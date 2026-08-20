"use strict";

/*
===========================================================
 IQRANIX QIBLA
 Accurate GPS + Device Compass Qibla Finder

 Features:
 - High accuracy GPS
 - Great-circle bearing to Kaaba
 - Distance to Kaaba
 - Android/iOS compass support
 - iOS motion permission
 - Screen orientation correction
 - Compass smoothing
 - Qibla alignment detection
 - Calibration guidance
===========================================================
*/


/* =========================================================
   CONSTANTS
========================================================= */

const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

const EARTH_RADIUS_KM = 6371.0088;

let userLatitude = null;
let userLongitude = null;
let userAltitude = null;

let qiblaBearing = null;
let currentHeading = null;

let compassStarted = false;
let locationStarted = false;

let lastRawHeading = null;
let smoothedHeading = null;

let locationWatchId = null;


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   NUMBER HELPERS
========================================================= */

function normalizeDegrees(value) {

    value = Number(value);

    if (!Number.isFinite(value)) {
        return null;
    }

    value %= 360;

    if (value < 0) {
        value += 360;
    }

    return value;
}


function shortestAngleDifference(a, b) {

    return (
        ((a - b + 540) % 360) - 180
    );
}


/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const toRad =
        Math.PI / 180;

    const φ1 =
        lat1 * toRad;

    const φ2 =
        lat2 * toRad;

    const Δφ =
        (lat2 - lat1) * toRad;

    const Δλ =
        (lon2 - lon1) * toRad;

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return EARTH_RADIUS_KM * c;
}


/* =========================================================
   QIBLA BEARING
   Great-circle initial bearing
========================================================= */

function calculateQiblaBearing(
    latitude,
    longitude
) {

    const φ1 =
        latitude *
        Math.PI / 180;

    const φ2 =
        KAABA_LAT *
        Math.PI / 180;

    const Δλ =
        (
            KAABA_LON -
            longitude
        ) *
        Math.PI / 180;

    const y =
        Math.sin(Δλ) *
        Math.cos(φ2);

    const x =
        Math.cos(φ1) *
        Math.sin(φ2) -
        Math.sin(φ1) *
        Math.cos(φ2) *
        Math.cos(Δλ);

    const bearing =
        Math.atan2(y, x) *
        180 /
        Math.PI;

    return normalizeDegrees(
        bearing
    );
}


/* =========================================================
   CARDINAL DIRECTION
========================================================= */

function getDirection(degrees) {

    degrees =
        normalizeDegrees(degrees);

    if (degrees === null) {
        return "--";
    }

    if (
        degrees >= 337.5 ||
        degrees < 22.5
    ) {
        return "N";
    }

    if (degrees < 67.5) {
        return "NE";
    }

    if (degrees < 112.5) {
        return "E";
    }

    if (degrees < 157.5) {
        return "SE";
    }

    if (degrees < 202.5) {
        return "S";
    }

    if (degrees < 247.5) {
        return "SW";
    }

    if (degrees < 292.5) {
        return "W";
    }

    return "NW";
}


/* =========================================================
   LOCATION
========================================================= */

function requestLocation() {

    if (!navigator.geolocation) {

        updateLocationUI(
            "Location unavailable",
            "This browser does not support GPS location."
        );

        return;
    }


    updateLocationUI(
        "Finding your location...",
        "Requesting high-accuracy GPS position"
    );


    navigator.geolocation.getCurrentPosition(

        handleLocation,

        handleLocationError,

        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }

    );
}


/* =========================================================
   CONTINUOUS LOCATION
========================================================= */

function startLocationWatch() {

    if (!navigator.geolocation) {
        return;
    }

    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(
            locationWatchId
        );
    }

    locationWatchId =
        navigator.geolocation.watchPosition(

            handleLocation,

            handleLocationError,

            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 5000
            }

        );

    locationStarted = true;
}


/* =========================================================
   LOCATION RESULT
========================================================= */

function handleLocation(position) {

    const coords =
        position.coords;

    userLatitude =
        Number(coords.latitude);

    userLongitude =
        Number(coords.longitude);

    userAltitude =
        Number.isFinite(
            Number(coords.altitude)
        )
            ? Number(coords.altitude)
            : null;


    if (
        !Number.isFinite(userLatitude) ||
        !Number.isFinite(userLongitude)
    ) {

        updateLocationUI(
            "Invalid location",
            "Unable to read your GPS coordinates."
        );

        return;
    }


    qiblaBearing =
        calculateQiblaBearing(
            userLatitude,
            userLongitude
        );


    const distance =
        calculateDistance(
            userLatitude,
            userLongitude,
            KAABA_LAT,
            KAABA_LON
        );


    updateLocationUI(
        "Location detected",
        getLocationAccuracyText(
            coords.accuracy
        )
    );


    updateCoordinates();

    updateQiblaDetails(
        distance
    );

    updateBearingDisplay();

    updatePointer();


    if (!compassStarted) {

        updateStatus(
            "warning",
            "Location found",
            "Enable the compass to find Qibla."
        );

    }
}


/* =========================================================
   LOCATION ERROR
========================================================= */

function handleLocationError(error) {

    console.warn(
        "Location error:",
        error
    );


    let message =
        "Unable to determine your location.";


    if (error.code === 1) {

        message =
            "Location permission was denied.";

    } else if (error.code === 2) {

        message =
            "Your location could not be determined.";

    } else if (error.code === 3) {

        message =
            "Location request timed out.";
    }


    updateLocationUI(
        "Location required",
        message
    );


    updateStatus(
        "warning",
        "Location required",
        "Enable precise location to calculate Qibla."
    );
}


/* =========================================================
   LOCATION UI
========================================================= */

function updateLocationUI(
    title,
    details
) {

    if ($("locationTitle")) {
        $("locationTitle").textContent =
            title;
    }

    if ($("locationDetails")) {
        $("locationDetails").textContent =
            details;
    }
}


function getLocationAccuracyText(
    accuracy
) {

    accuracy =
        Number(accuracy);

    if (!Number.isFinite(accuracy)) {
        return "GPS location detected";
    }

    return (
        `GPS accuracy ±${Math.round(accuracy)} m`
    );
}


/* =========================================================
   COORDINATES
========================================================= */

function updateCoordinates() {

    if (!$("coordinates")) {
        return;
    }

    $("coordinates").textContent =
        `${userLatitude.toFixed(5)}, ${userLongitude.toFixed(5)}`;
}


/* =========================================================
   QIBLA DETAILS
========================================================= */

function updateQiblaDetails(
    distance
) {

    if ($("qiblaBearing")) {

        $("qiblaBearing").textContent =
            `${Math.round(qiblaBearing)}°`;
    }


    if ($("distance")) {

        if (distance < 1) {

            $("distance").textContent =
                `${Math.round(distance * 1000)} m`;

        } else {

            $("distance").textContent =
                `${distance.toFixed(1)} km`;
        }
    }
}


/* =========================================================
   BEARING DISPLAY
========================================================= */

function updateBearingDisplay() {

    if (!$("bearingValue")) {
        return;
    }

    if (qiblaBearing === null) {

        $("bearingValue").textContent =
            "--°";

        return;
    }

    $("bearingValue").textContent =
        `${Math.round(qiblaBearing)}°`;
}


/* =========================================================
   COMPASS PERMISSION
========================================================= */

async function requestCompassPermission() {

    /*
     * iPhone/iPad Safari requires explicit
     * DeviceOrientation permission.
     */

    if (
        typeof DeviceOrientationEvent !==
        "undefined" &&
        typeof DeviceOrientationEvent.requestPermission ===
        "function"
    ) {

        try {

            const permission =
                await DeviceOrientationEvent
                    .requestPermission(
                        true
                    );


            if (
                permission !==
                "granted"
            ) {

                updateStatus(
                    "warning",
                    "Compass permission denied",
                    "Allow motion/orientation access in your browser."
                );

                return false;
            }

        } catch (error) {

            console.error(
                "Compass permission:",
                error
            );

            updateStatus(
                "warning",
                "Compass permission required",
                "Please allow motion and orientation access."
            );

            return false;
        }
    }

    return true;
}


/* =========================================================
   START COMPASS
========================================================= */

async function startCompass() {

    if (compassStarted) {
        return;
    }


    const permission =
        await requestCompassPermission();


    if (!permission) {
        return;
    }


    if (
        !window.DeviceOrientationEvent
    ) {

        updateStatus(
            "warning",
            "Compass unavailable",
            "Your device/browser does not provide a compass sensor."
        );

        return;
    }


    /*
     * Prefer absolute orientation.
     *
     * This is important because ordinary
     * DeviceOrientation can be relative.
     */

    window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
    );


    /*
     * Some browsers do not fire
     * deviceorientationabsolute.
     */

    window.addEventListener(
        "deviceorientation",
        handleOrientationFallback,
        true
    );


    compassStarted = true;


    if ($("enableCompass")) {
        $("enableCompass").hidden = true;
    }


    updateStatus(
        "warning",
        "Compass starting...",
        "Keep your phone flat and away from magnetic objects."
    );


    setTimeout(
        checkCompass,
        2500
    );
}


/* =========================================================
   ORIENTATION FALLBACK
========================================================= */

let absoluteOrientationReceived =
    false;


function handleOrientation(
    event
) {

    absoluteOrientationReceived =
        true;

    processOrientation(
        event,
        true
    );
}


function handleOrientationFallback(
    event
) {

    if (
        absoluteOrientationReceived
    ) {
        return;
    }

    processOrientation(
        event,
        false
    );
}


/* =========================================================
   PROCESS ORIENTATION
========================================================= */

function processOrientation(
    event,
    absolute
) {

    let heading =
        null;


    /*
     * iOS Safari exposes a much more useful
     * compass heading.
     */

    if (
        typeof event.webkitCompassHeading ===
        "number"
    ) {

        heading =
            event.webkitCompassHeading;

    } else if (
        typeof event.alpha ===
        "number"
    ) {

        /*
         * For absolute orientation:
         *
         * alpha = rotation around Z axis.
         *
         * Convert to compass heading.
         */

        heading =
            360 -
            event.alpha;

    }


    if (
        heading === null ||
        !Number.isFinite(heading)
    ) {
        return;
    }


    /*
     * Screen orientation correction.
     */

    const screenAngle =
        getScreenOrientation();


    /*
     * iOS webkitCompassHeading is already
     * screen-adjusted in many implementations.
     * Android absolute alpha generally needs
     * orientation correction.
     */

    if (
        typeof event.webkitCompassHeading !==
        "number"
    ) {

        heading =
            heading +
            screenAngle;
    }


    heading =
        normalizeDegrees(
            heading
        );


    /*
     * Smooth sensor noise.
     */

    smoothedHeading =
        smoothHeading(
            heading
        );


    currentHeading =
        smoothedHeading;


    updateCompassUI();

    updatePointer();

    updateAlignment();
}


/* =========================================================
   SCREEN ORIENTATION
========================================================= */

function getScreenOrientation() {

    if (
        screen.orientation &&
        typeof screen.orientation.angle ===
        "number"
    ) {

        return screen.orientation.angle;
    }


    if (
        typeof window.orientation ===
        "number"
    ) {

        return normalizeDegrees(
            window.orientation
        );
    }


    return 0;
}


/* =========================================================
   SMOOTH HEADING
========================================================= */

function smoothHeading(
    newHeading
) {

    if (
        lastRawHeading === null
    ) {

        lastRawHeading =
            newHeading;

        return newHeading;
    }


    const difference =
        shortestAngleDifference(
            newHeading,
            lastRawHeading
        );


    /*
     * Ignore very large sudden jumps
     * caused by bad sensor readings.
     */

    if (
        Math.abs(difference) >
        100
    ) {

        lastRawHeading =
            newHeading;

        return newHeading;
    }


    const smoothing =
        0.22;


    let result =
        lastRawHeading +
        difference *
        smoothing;


    result =
        normalizeDegrees(
            result
        );


    lastRawHeading =
        result;


    return result;
}


/* =========================================================
   COMPASS UI
========================================================= */

function updateCompassUI() {

    if (
        currentHeading === null
    ) {
        return;
    }


    if ($("compassRing")) {

        /*
         * Rotate the compass so North
         * stays aligned with the real world.
         */

        $("compassRing").style.transform =
            `rotate(${-currentHeading}deg)`;
    }


    /*
     * Keep cardinal labels readable.
     */

    document
        .querySelectorAll(
            ".direction"
        )
        .forEach(
            element => {

                element.style.transform =
                    getLabelTransform(
                        element
                    );

            }
        );


    if ($("accuracyText")) {

        $("accuracyText").textContent =
            `Compass heading ${Math.round(currentHeading)}°`;
    }
}


/* =========================================================
   CARDINAL LABEL TRANSFORM
========================================================= */

function getLabelTransform(
    element
) {

    const classes =
        element.classList;

    let base =
        "";


    if (
        classes.contains("north") ||
        classes.contains("south")
    ) {

        base =
            "translateX(-50%)";

    } else {

        base =
            "translateY(-50%)";
    }


    return (
        `${base} rotate(${currentHeading}deg)`
    );
}


/* =========================================================
   QIBLA POINTER
========================================================= */

function updatePointer() {

    if (
        qiblaBearing === null ||
        currentHeading === null
    ) {
        return;
    }


    const relative =
        shortestAngleDifference(
            qiblaBearing,
            currentHeading
        );


    if ($("qiblaPointer")) {

        $("qiblaPointer").style.transform =
            `rotate(${relative}deg)`;
    }
}


/* =========================================================
   ALIGNMENT
========================================================= */

function updateAlignment() {

    if (
        qiblaBearing === null ||
        currentHeading === null
    ) {
        return;
    }


    const difference =
        Math.abs(
            shortestAngleDifference(
                qiblaBearing,
                currentHeading
            )
        );


    /*
     * Alignment tolerance:
     *
     * <= 3°  = excellent
     * <= 7°  = aligned
     * <= 15° = close
     */

    if (
        difference <= 3
    ) {

        updateStatus(
            "good",
            "Qibla aligned",
            "You are facing the Qibla."
        );


        if ($("alignmentText")) {
            $("alignmentText").textContent =
                "Qibla aligned";
        }

    } else if (
        difference <= 7
    ) {

        updateStatus(
            "good",
            "Almost aligned",
            `Turn ${getTurnDirection(difference)} ${Math.round(difference)}°`
        );


        if ($("alignmentText")) {
            $("alignmentText").textContent =
                "Almost there";
        }

    } else if (
        difference <= 15
    ) {

        updateStatus(
            "warning",
            "Nearly aligned",
            `Turn ${getTurnDirection(difference)} ${Math.round(difference)}°`
        );


        if ($("alignmentText")) {
            $("alignmentText").textContent =
                "Nearly aligned";
        }

    } else {

        updateStatus(
            "warning",
            "Turn toward the Qibla",
            `Turn ${getTurnDirection(difference)} ${Math.round(difference)}°`
        );


        if ($("alignmentText")) {
            $("alignmentText").textContent =
                "Turn toward Qibla";
        }
    }
}


/* =========================================================
   TURN DIRECTION
========================================================= */

function getTurnDirection(
    absoluteDifference
) {

    const difference =
        shortestAngleDifference(
            qiblaBearing,
            currentHeading
        );


    if (Math.abs(difference) < 1) {
        return "forward";
    }


    return difference > 0
        ? "right"
        : "left";
}


/* =========================================================
   STATUS UI
========================================================= */

function updateStatus(
    type,
    title,
    message
) {

    const dot =
        $("statusDot");

    const titleElement =
        $("statusTitle");

    const messageElement =
        $("statusMessage");


    if (dot) {

        dot.classList.remove(
            "good",
            "warning"
        );


        if (type === "good") {

            dot.classList.add(
                "good"
            );

        } else {

            dot.classList.add(
                "warning"
            );
        }
    }


    if (titleElement) {

        titleElement.textContent =
            title;
    }


    if (messageElement) {

        messageElement.textContent =
            message;
    }


    if ($("statusText")) {

        $("statusText").textContent =
            title;
    }
}


/* =========================================================
   COMPASS CHECK
========================================================= */

function checkCompass() {

    if (
        currentHeading === null
    ) {

        updateStatus(
            "warning",
            "Compass not detected",
            "Your phone may not have a compass sensor, or permission may be blocked."
        );

        if ($("accuracyText")) {

            $("accuracyText").textContent =
                "No compass heading detected.";
        }

        return;
    }


    updateStatus(
        "warning",
        "Compass active",
        "Keep your phone level for the best result."
    );
}


/* =========================================================
   CALIBRATION
========================================================= */

function calibrateCompass() {

    lastRawHeading = null;
    smoothedHeading = null;

    updateStatus(
        "warning",
        "Calibrating compass",
        "Slowly move your phone in a large figure-eight."
    );


    if ($("accuracyText")) {

        $("accuracyText").textContent =
            "Move your phone slowly in a figure-eight, then keep it flat.";
    }


    /*
     * Do not fake a calibration value.
     *
     * The actual magnetic sensor calibration
     * is handled by the operating system/device.
     *
     * This simply resets our smoothing filter
     * and guides the user.
     */

    setTimeout(
        () => {

            if (
                currentHeading !== null
            ) {

                updateStatus(
                    "warning",
                    "Compass ready",
                    "Keep the phone flat and away from magnetic interference."
                );
            }

        },
        4000
    );
}


/* =========================================================
   BUTTON SETUP
========================================================= */

function setupButtons() {

    $("enableLocation")
        ?.addEventListener(
            "click",
            () => {

                requestLocation();

                startLocationWatch();
            }
        );


    $("refreshLocation")
        ?.addEventListener(
            "click",
            () => {

                requestLocation();

                startLocationWatch();
            }
        );


    $("enableCompass")
        ?.addEventListener(
            "click",
            () => {

                startCompass();
            }
        );


    $("calibrateButton")
        ?.addEventListener(
            "click",
            () => {

                calibrateCompass();
            }
        );


    $("backButton")
        ?.addEventListener(
            "click",
            () => {

                if (
                    history.length > 1
                ) {

                    history.back();

                } else {

                    location.href =
                        "index.html";
                }
            }
        );


    $("infoButton")
        ?.addEventListener(
            "click",
            () => {

                if ($("infoModal")) {

                    $("infoModal").hidden =
                        false;
                }
            }
        );


    $("closeInfo")
        ?.addEventListener(
            "click",
            closeInfo
        );


    $("closeInfoButton")
        ?.addEventListener(
            "click",
            closeInfo
        );


    $("understandButton")
        ?.addEventListener(
            "click",
            closeInfo
        );
}


/* =========================================================
   CLOSE INFO
========================================================= */

function closeInfo() {

    if ($("infoModal")) {

        $("infoModal").hidden =
            true;
    }
}


/* =========================================================
   SCREEN ROTATION
========================================================= */

function setupScreenOrientation() {

    if (
        screen.orientation
    ) {

        screen.orientation.addEventListener(
            "change",
            () => {

                if (
                    currentHeading !== null
                ) {

                    updateCompassUI();
                    updatePointer();
                    updateAlignment();
                }
            }
        );
    }

    window.addEventListener(
        "orientationchange",
        () => {

            setTimeout(
                () => {

                    updateCompassUI();
                    updatePointer();
                    updateAlignment();

                },
                200
            );
        }
    );
}


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
         * Some browsers stop orientation
         * events when the page is hidden.
         */

        if (
            !document.hidden &&
            compassStarted
        ) {

            setTimeout(
                () => {

                    updateCompassUI();
                    updatePointer();
                    updateAlignment();

                },
                300
            );
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initQibla() {

    console.log(
        "Iqranix Qibla starting..."
    );


    setupButtons();

    setupScreenOrientation();


    /*
     * Calculate location immediately.
     */

    requestLocation();

    startLocationWatch();


    /*
     * Do not request motion permission
     * automatically on iOS.
     *
     * It must happen after a user gesture.
     */

    if (
        typeof DeviceOrientationEvent !==
        "undefined" &&
        typeof DeviceOrientationEvent.requestPermission ===
        "function"
    ) {

        if ($("enableCompass")) {
            $("enableCompass").hidden = false;
        }

        updateStatus(
            "warning",
            "Compass permission needed",
            "Tap Enable Compass to start the Qibla compass."
        );

    } else {

        /*
         * Android browsers normally allow
         * orientation access without a separate
         * permission dialog.
         */

        startCompass();
    }


    updateBearingDisplay();


    console.log(
        "Iqranix Qibla ready."
    );
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initQibla
    );

} else {

    initQibla();
}


/* =========================================================
   PUBLIC API
========================================================= */

window.IqranixQibla = {

    requestLocation,

    startCompass,

    calculateQiblaBearing,

    calculateDistance,

    calibrateCompass

};
