"use strict";

/* =========================================================
   IQRANIX — MOSQUES
   Google Maps + GPS + Nearby Mosques + Pinning
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let map = null;

let userLocation = null;

let userMarker = null;

let accuracyCircle = null;

let placesService = null;

let searchBox = null;

let currentInfoMarker = null;

let pinMarker = null;

let pinPosition = null;

let pinMode = false;

let nearbyMarkers = [];

let savedMosques = [];


/* =========================================================
   ELEMENTS
========================================================= */

const mapElement =
    document.getElementById("map");

const statusMessage =
    document.getElementById("statusMessage");

const loadingOverlay =
    document.getElementById("loadingOverlay");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const locateButton =
    document.getElementById("locateButton");

const myLocationButton =
    document.getElementById("myLocationButton");

const nearbyButton =
    document.getElementById("nearbyButton");

const pinMosqueButton =
    document.getElementById("pinMosqueButton");

const cancelPinButton =
    document.getElementById("cancelPinButton");

const pinModeMessage =
    document.getElementById("pinModeMessage");

const pinPanel =
    document.getElementById("pinPanel");

const closePinPanel =
    document.getElementById("closePinPanel");

const savePinButton =
    document.getElementById("savePinButton");

const mosqueNameInput =
    document.getElementById("mosqueNameInput");

const mosqueDescriptionInput =
    document.getElementById("mosqueDescriptionInput");

const pinLatitude =
    document.getElementById("pinLatitude");

const pinLongitude =
    document.getElementById("pinLongitude");

const mosqueInfo =
    document.getElementById("mosqueInfo");

const closeInfoButton =
    document.getElementById("closeInfoButton");

const infoName =
    document.getElementById("infoName");

const infoAddress =
    document.getElementById("infoAddress");

const infoDistance =
    document.getElementById("infoDistance");

const directionsButton =
    document.getElementById("directionsButton");

const saveMosqueButton =
    document.getElementById("saveMosqueButton");

const backButton =
    document.getElementById("backButton");


/* =========================================================
   DEFAULT LOCATION
   Nairobi
========================================================= */

const DEFAULT_LOCATION = {
    lat: -1.286389,
    lng: 36.817223
};


/* =========================================================
   LOAD SAVED MOSQUES
========================================================= */

function loadSavedMosques() {

    try {

        const data =
            localStorage.getItem(
                "iqranix_saved_mosques"
            );

        savedMosques =
            data ? JSON.parse(data) : [];

    } catch (error) {

        console.error(
            "Could not load saved mosques:",
            error
        );

        savedMosques = [];

    }

}


/* =========================================================
   SAVE MOSQUES LOCALLY
========================================================= */

function persistSavedMosques() {

    localStorage.setItem(
        "iqranix_saved_mosques",
        JSON.stringify(savedMosques)
    );

}


/* =========================================================
   GOOGLE MAP INITIALIZATION
========================================================= */

window.initMap = function() {

    loadSavedMosques();


    map = new google.maps.Map(
        mapElement,
        {

            center:
                DEFAULT_LOCATION,

            zoom: 13,

            mapTypeControl: false,

            streetViewControl: false,

            fullscreenControl: false,

            zoomControl: false,

            clickableIcons: true,

            gestureHandling: "greedy",

            styles: [

                {
                    featureType:
                        "poi.business",

                    stylers: [
                        {
                            visibility:
                                "on"
                        }
                    ]
                }

            ]

        }
    );


    placesService =
        new google.maps.places.PlacesService(
            map
        );


    setupMapEvents();

    setupSearch();

    requestUserLocation();

    renderSavedMosques();

    hideLoading();

};


/* =========================================================
   MAP EVENTS
========================================================= */

function setupMapEvents() {

    map.addListener(
        "click",
        function(event) {

            if (!pinMode) {

                return;

            }

            placePin(
                event.latLng
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    searchBox =
        new google.maps.places.SearchBox(
            searchInput
        );


    searchBox.addListener(
        "places_changed",
        function() {

            const places =
                searchBox.getPlaces();

            if (!places ||
                !places.length) {

                return;

            }


            const place =
                places[0];


            if (!place.geometry ||
                !place.geometry.location) {

                showStatus(
                    "This place has no map location."
                );

                return;

            }


            map.panTo(
                place.geometry.location
            );

            map.setZoom(16);


            showPlaceInfo(
                place
            );

        }
    );


    searchInput.addEventListener(
        "input",
        function() {

            clearSearch.classList.toggle(
                "hidden",
                searchInput.value.length === 0
            );

        }
    );


    clearSearch.addEventListener(
        "click",
        function() {

            searchInput.value = "";

            clearSearch.classList.add(
                "hidden"
            );

            searchInput.focus();

        }
    );

}


/* =========================================================
   USER LOCATION
========================================================= */

function requestUserLocation() {

    if (!navigator.geolocation) {

        showStatus(
            "GPS is not supported on this device."
        );

        useDefaultLocation();

        return;

    }


    showStatus(
        "Getting your location..."
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            userLocation = {
                lat: lat,
                lng: lng
            };


            displayUserLocation();

            findNearbyMosques();


            showStatus(
                "Showing mosques near you."
            );

        },

        function(error) {

            console.warn(
                "Location error:",
                error
            );


            showStatus(
                "Location permission unavailable. Showing Nairobi."
            );


            useDefaultLocation();

        },

        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 60000

        }

    );

}


/* =========================================================
   DEFAULT LOCATION
========================================================= */

function useDefaultLocation() {

    userLocation =
        DEFAULT_LOCATION;


    map.setCenter(
        DEFAULT_LOCATION
    );

    map.setZoom(13);

    findNearbyMosques();

}


/* =========================================================
   DISPLAY USER LOCATION
========================================================= */

function displayUserLocation() {

    if (userMarker) {

        userMarker.setMap(null);

    }


    if (accuracyCircle) {

        accuracyCircle.setMap(null);

    }


    userMarker =
        new google.maps.Marker({

            map: map,

            position:
                userLocation,

            title:
                "Your location",

            icon: {

                path:
                    google.maps.SymbolPath.CIRCLE,

                scale: 9,

                fillColor:
                    "#0B6E4F",

                fillOpacity:
                    1,

                strokeColor:
                    "#FFFFFF",

                strokeWeight:
                    4

            }

        });


    accuracyCircle =
        new google.maps.Circle({

            map: map,

            center:
                userLocation,

            radius: 60,

            fillColor:
                "#0B6E4F",

            fillOpacity:
                0.08,

            strokeColor:
                "#0B6E4F",

            strokeOpacity:
                0.22,

            strokeWeight:
                1

        });


    map.setCenter(
        userLocation
    );

    map.setZoom(15);

}


/* =========================================================
   FIND NEARBY MOSQUES
========================================================= */

function findNearbyMosques() {

    if (!placesService ||
        !userLocation) {

        return;

    }


    clearNearbyMarkers();


    showStatus(
        "Searching for nearby mosques..."
    );


    const request = {

        location:
            new google.maps.LatLng(
                userLocation.lat,
                userLocation.lng
            ),

        radius:
            5000,

        keyword:
            "mosque"

    };


    placesService.nearbySearch(
        request,
        function(results, status) {

            if (
                status !==
                google.maps.places.PlacesServiceStatus.OK
            ) {

                showStatus(
                    "No nearby mosques were found."
                );

                return;

            }


            if (!results.length) {

                showStatus(
                    "No mosques found nearby."
                );

                return;

            }


            results.forEach(
                function(place) {

                    createMosqueMarker(
                        place
                    );

                }
            );


            showStatus(
                results.length +
                " mosques found nearby."
            );

        }
    );

}


/* =========================================================
   CLEAR NEARBY MARKERS
========================================================= */

function clearNearbyMarkers() {

    nearbyMarkers.forEach(
        function(marker) {

            marker.setMap(null);

        }
    );


    nearbyMarkers = [];

}


/* =========================================================
   CREATE MOSQUE MARKER
========================================================= */

function createMosqueMarker(
    place
) {

    if (!place.geometry ||
        !place.geometry.location) {

        return;

    }


    const marker =
        new google.maps.Marker({

            map: map,

            position:
                place.geometry.location,

            title:
                place.name || "Mosque",

            animation:
                google.maps.Animation.DROP,

            icon: {

                path:
                    google.maps.SymbolPath.CIRCLE,

                scale: 10,

                fillColor:
                    "#0B6E4F",

                fillOpacity:
                    1,

                strokeColor:
                    "#FFFFFF",

                strokeWeight:
                    3

            }

        });


    nearbyMarkers.push(
        marker
    );


    marker.addListener(
        "click",
        function() {

            showPlaceInfo(
                place,
                marker
            );

        }
    );

}


/* =========================================================
   SHOW PLACE INFORMATION
========================================================= */

function showPlaceInfo(
    place,
    marker = null
) {

    currentInfoMarker =
        marker;


    infoName.textContent =
        place.name ||
        "Mosque";


    infoAddress.textContent =
        place.formatted_address ||
        place.vicinity ||
        "Address unavailable";


    if (
        userLocation &&
        place.geometry &&
        place.geometry.location
    ) {

        const distance =
            calculateDistance(
                userLocation.lat,
                userLocation.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );


        infoDistance.textContent =
            formatDistance(distance);

    } else {

        infoDistance.textContent =
            "";

    }


    mosqueInfo.classList.remove(
        "hidden"
    );


    directionsButton.onclick =
        function() {

            openDirections(
                place.geometry.location
            );

        };


    saveMosqueButton.onclick =
        function() {

            savePlace(
                place
            );

        };

}


/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const earthRadius =
        6371000;


    const lat1Rad =
        lat1 * Math.PI / 180;

    const lat2Rad =
        lat2 * Math.PI / 180;


    const deltaLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const deltaLng =
        (lng2 - lng1) *
        Math.PI / 180;


    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +

        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *

        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


/* =========================================================
   FORMAT DISTANCE
========================================================= */

function formatDistance(
    metres
) {

    if (metres < 1000) {

        return Math.round(
            metres
        ) + " m away";

    }


    return (
        metres / 1000
    ).toFixed(1) +
    " km away";

}


/* =========================================================
   DIRECTIONS
========================================================= */

function openDirections(
    location
) {

    if (!location) {

        return;

    }


    const destination =
        location.lat() +
        "," +
        location.lng();


    const url =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(
            destination
        );


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   SAVE GOOGLE MOSQUE
========================================================= */

function savePlace(
    place
) {

    if (!place.geometry ||
        !place.geometry.location) {

        return;

    }


    const saved = {

        id:
            place.place_id ||
            Date.now().toString(),

        name:
            place.name ||
            "Mosque",

        address:
            place.formatted_address ||
            place.vicinity ||
            "",

        lat:
            place.geometry.location.lat(),

        lng:
            place.geometry.location.lng(),

        savedAt:
            new Date().toISOString()

    };


    const exists =
        savedMosques.some(
            function(item) {

                return item.id === saved.id;

            }
        );


    if (exists) {

        showStatus(
            "This mosque is already saved."
        );

        return;

    }


    savedMosques.push(
        saved
    );


    persistSavedMosques();


    showStatus(
        "Mosque saved to Iqranix."
    );


    saveMosqueButton.textContent =
        "Saved ✓";

}


/* =========================================================
   PIN MODE
========================================================= */

function startPinMode() {

    pinMode = true;


    mosqueInfo.classList.add(
        "hidden"
    );


    pinModeMessage.classList.remove(
        "hidden"
    );


    pinMosqueButton.classList.add(
        "active"
    );


    showStatus(
        "Tap the map where the mosque is located."
    );

}


/* =========================================================
   CANCEL PIN MODE
========================================================= */

function cancelPinMode() {

    pinMode = false;


    pinModeMessage.classList.add(
        "hidden"
    );


    pinPanel.classList.add(
        "hidden"
    );


    pinMosqueButton.classList.remove(
        "active"
    );


    if (pinMarker) {

        pinMarker.setMap(null);

        pinMarker = null;

    }


    pinPosition = null;

}


/* =========================================================
   PLACE PIN
========================================================= */

function placePin(
    position
) {

    pinPosition =
        position;


    if (pinMarker) {

        pinMarker.setMap(null);

    }


    pinMarker =
        new google.maps.Marker({

            map: map,

            position: position,

            draggable: true,

            title:
                "New mosque location",

            animation:
                google.maps.Animation.DROP,

            icon: {

                path:
                    google.maps.SymbolPath.CIRCLE,

                scale: 12,

                fillColor:
                    "#0B6E4F",

                fillOpacity:
                    1,

                strokeColor:
                    "#FFFFFF",

                strokeWeight:
                    4

            }

        });


    pinMarker.addListener(
        "dragend",
        function(event) {

            pinPosition =
                event.latLng;

            updatePinCoordinates();

        }
    );


    updatePinCoordinates();


    pinPanel.classList.remove(
        "hidden"
    );


    mosqueNameInput.focus();


    showStatus(
        "Move the pin if necessary, then save the mosque."
    );

}


/* =========================================================
   UPDATE PIN COORDINATES
========================================================= */

function updatePinCoordinates() {

    if (!pinPosition) {

        return;

    }


    pinLatitude.textContent =
        pinPosition
            .lat()
            .toFixed(6);


    pinLongitude.textContent =
        pinPosition
            .lng()
            .toFixed(6);

}


/* =========================================================
   SAVE PINNED MOSQUE
========================================================= */

function savePinnedMosque() {

    if (!pinPosition) {

        showStatus(
            "Please place the mosque pin first."
        );

        return;

    }


    const name =
        mosqueNameInput
            .value
            .trim();


    if (!name) {

        mosqueNameInput.focus();

        showStatus(
            "Enter the mosque name."
        );

        return;

    }


    const description =
        mosqueDescriptionInput
            .value
            .trim();


    const mosque = {

        id:
            "community_" +
            Date.now(),

        name:
            name,

        description:
            description,

        lat:
            pinPosition.lat(),

        lng:
            pinPosition.lng(),

        createdAt:
            new Date().toISOString(),

        source:
            "Iqranix Community Map"

    };


    savedMosques.push(
        mosque
    );


    persistSavedMosques();


    createSavedMosqueMarker(
        mosque
    );


    showStatus(
        "Mosque pinned successfully."
    );


    mosqueNameInput.value =
        "";

    mosqueDescriptionInput.value =
        "";


    cancelPinMode();

}


/* =========================================================
   RENDER SAVED MOSQUES
========================================================= */

function renderSavedMosques() {

    savedMosques.forEach(
        function(mosque) {

            createSavedMosqueMarker(
                mosque
            );

        }
    );

}


/* =========================================================
   SAVED MOSQUE MARKER
========================================================= */

function createSavedMosqueMarker(
    mosque
) {

    if (!map) {

        return;

    }


    const marker =
        new google.maps.Marker({

            map: map,

            position: {

                lat:
                    Number(mosque.lat),

                lng:
                    Number(mosque.lng)

            },

            title:
                mosque.name,

            icon: {

                path:
                    google.maps.SymbolPath.CIRCLE,

                scale: 11,

                fillColor:
                    "#087E5A",

                fillOpacity:
                    1,

                strokeColor:
                    "#FFFFFF",

                strokeWeight:
                    3

            }

        });


    marker.addListener(
        "click",
        function() {

            infoName.textContent =
                mosque.name;


            infoAddress.textContent =
                mosque.description ||
                "Community-added mosque";


            infoDistance.textContent =
                "";


            mosqueInfo.classList.remove(
                "hidden"
            );


            directionsButton.onclick =
                function() {

                    openDirections(
                        new google.maps.LatLng(
                            mosque.lat,
                            mosque.lng
                        )
                    );

                };


            saveMosqueButton.textContent =
                "Saved ✓";

        }
    );

}


/* =========================================================
   LOCATE USER
========================================================= */

function locateUser() {

    if (!userLocation) {

        requestUserLocation();

        return;

    }


    map.panTo(
        userLocation
    );

    map.setZoom(16);


    showStatus(
        "Centered on your location."
    );

}


/* =========================================================
   CLOSE INFO
========================================================= */

function closeInfo() {

    mosqueInfo.classList.add(
        "hidden"
    );

}


/* =========================================================
   STATUS
========================================================= */

function showStatus(
    message
) {

    statusMessage.textContent =
        message;

    statusMessage.classList.remove(
        "hidden"
    );


    clearTimeout(
        showStatus.timer
    );


    showStatus.timer =
        setTimeout(
            function() {

                statusMessage.classList.add(
                    "hidden"
                );

            },
            4000
        );

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideLoading() {

    setTimeout(
        function() {

            loadingOverlay.classList.add(
                "hidden"
            );

        },
        500
    );

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

locateButton.addEventListener(
    "click",
    locateUser
);


myLocationButton.addEventListener(
    "click",
    locateUser
);


nearbyButton.addEventListener(
    "click",
    function() {

        if (!userLocation) {

            requestUserLocation();

            return;

        }

        findNearbyMosques();

        map.panTo(
            userLocation
        );

    }
);


pinMosqueButton.addEventListener(
    "click",
    function() {

        if (pinMode) {

            cancelPinMode();

        } else {

            startPinMode();

        }

    }
);


cancelPinButton.addEventListener(
    "click",
    cancelPinMode
);


closePinPanel.addEventListener(
    "click",
    cancelPinMode
);


savePinButton.addEventListener(
    "click",
    savePinnedMosque
);


closeInfoButton.addEventListener(
    "click",
    closeInfo
);


/* =========================================================
   BACK BUTTON
========================================================= */

backButton.addEventListener(
    "click",
    function() {

        if (window.history.length > 1) {

            window.history.back();

        } else {

            window.location.href =
                "index.html";

        }

    }
);


/* =========================================================
   GOOGLE MAPS ERROR
========================================================= */

window.gm_authFailure =
    function() {

        loadingOverlay.classList.add(
            "hidden"
        );

        showStatus(
            "Google Maps authentication failed. Check your API key and restrictions."
        );

    };


/* =========================================================
   INITIAL MESSAGE
========================================================= */

console.log(
    "Iqranix Mosques Map initialized."
);