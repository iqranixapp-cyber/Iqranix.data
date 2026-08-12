/* =========================================================
   IQRANIX — QIBLA FINDER JAVASCRIPT
   Accurate Great-Circle Qibla Bearing
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       KAABA COORDINATES
       ===================================================== */

    const MECCA_LAT = 21.422487;
    const MECCA_LNG = 39.826206;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const appContainer =
        document.getElementById("app-container");

    const compassRing =
        document.getElementById("compass-ring");

    const qiblaLayer =
        document.getElementById("qibla-layer");

    const statusText =
        document.getElementById("status-text");

    const statusDot =
        document.getElementById("status-dot");

    const qiblaAngleEl =
        document.getElementById("qibla-angle");

    const deviceHeadingEl =
        document.getElementById("device-heading");

    const distanceEl =
        document.getElementById("distance");

    const locationStatus =
        document.getElementById("location-status");

    const startBtn =
        document.getElementById("start-btn");

    const buttonText =
        document.getElementById("button-text");

    const buttonIcon =
        document.getElementById("button-icon");

    const alignmentMessage =
        document.getElementById("alignment-message");

    const alignmentText =
        document.getElementById("alignment-text");


    /* =====================================================
       VARIABLES
       ===================================================== */

    let userLatitude = null;
    let userLongitude = null;

    let qiblaBearing = null;

    let deviceHeading = null;

    let compassStarted = false;

    let orientationHandler = null;


    /* =====================================================
       HELPERS
       ===================================================== */

    function normalizeDegrees(value) {

        value = value % 360;

        if (value < 0) {
            value += 360;
        }

        return value;
    }


    function shortestAngleDifference(a, b) {

        let difference =
            normalizeDegrees(a - b);

        if (difference > 180) {
            difference -= 360;
        }

        return difference;
    }


    function degreesToRadians(degrees) {

        return degrees * Math.PI / 180;

    }


    function radiansToDegrees(radians) {

        return radians * 180 / Math.PI;

    }


    /* =====================================================
       GREAT-CIRCLE QIBLA CALCULATION
       ===================================================== */

    function calculateQiblaBearing(lat, lng) {

        const latitude1 =
            degreesToRadians(lat);

        const latitude2 =
            degreesToRadians(MECCA_LAT);

        const longitudeDifference =
            degreesToRadians(
                MECCA_LNG - lng
            );


        const y =
            Math.sin(longitudeDifference);


        const x =
            Math.cos(latitude1) *
            Math.tan(latitude2)

            -

            Math.sin(latitude1) *
            Math.cos(longitudeDifference);


        const bearing =
            radiansToDegrees(
                Math.atan2(y, x)
            );


        return normalizeDegrees(bearing);
    }


    /* =====================================================
       DISTANCE TO MECCA
       Haversine / Great-Circle Distance
       ===================================================== */

    function calculateDistanceKm(lat, lng) {

        const earthRadius = 6371.0088;


        const latitude1 =
            degreesToRadians(lat);

        const latitude2 =
            degreesToRadians(MECCA_LAT);


        const deltaLatitude =
            degreesToRadians(
                MECCA_LAT - lat
            );

        const deltaLongitude =
            degreesToRadians(
                MECCA_LNG - lng
            );


        const a =
            Math.sin(deltaLatitude / 2) *
            Math.sin(deltaLatitude / 2)

            +

            Math.cos(latitude1) *
            Math.cos(latitude2) *

            Math.sin(deltaLongitude / 2) *
            Math.sin(deltaLongitude / 2);


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return earthRadius * c;
    }


    /* =====================================================
       LOCATION
       ===================================================== */

    function getLocation() {

        if (!navigator.geolocation) {

            showError(
                "Your browser does not support location."
            );

            return;
        }


        statusText.textContent =
            "Finding your location...";

        locationStatus.textContent =
            "Locating";


        navigator.geolocation.getCurrentPosition(

            position => {

                userLatitude =
                    position.coords.latitude;

                userLongitude =
                    position.coords.longitude;


                /* Calculate Qibla */

                qiblaBearing =
                    calculateQiblaBearing(
                        userLatitude,
                        userLongitude
                    );


                /* Distance */

                const distance =
                    calculateDistanceKm(
                        userLatitude,
                        userLongitude
                    );


                qiblaAngleEl.textContent =
                    `${Math.round(qiblaBearing)}°`;


                distanceEl.textContent =
                    `${Math.round(distance).toLocaleString()} km`;


                locationStatus.textContent =
                    "Located";


                statusDot.classList.add("active");


                statusText.textContent =
                    "Location found. Starting compass...";


                /* Start orientation */

                requestCompassPermission();

            },


            error => {

                console.error(
                    "Location error:",
                    error
                );


                showError(
                    "Location permission is required to find the Qibla."
                );

            },


            {
                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0
            }
        );
    }


    /* =====================================================
       COMPASS PERMISSION
       ===================================================== */

    async function requestCompassPermission() {

        /*
         * iPhone / iPad require explicit permission.
         */

        if (
            typeof DeviceOrientationEvent !== "undefined" &&

            typeof DeviceOrientationEvent.requestPermission ===
            "function"
        ) {

            try {

                const permission =
                    await DeviceOrientationEvent.requestPermission();


                if (permission === "granted") {

                    startOrientation();

                } else {

                    showError(
                        "Compass permission was denied."
                    );

                }

            } catch (error) {

                console.error(error);

                showError(
                    "Unable to start the compass."
                );

            }

            return;
        }


        /*
         * Android and other browsers normally
         * do not expose requestPermission().
         */

        startOrientation();
    }


    /* =====================================================
       START ORIENTATION
       ===================================================== */

    function startOrientation() {

        if (compassStarted) {
            return;
        }


        compassStarted = true;


        startBtn.classList.add("running");

        buttonIcon.textContent = "✓";

        buttonText.textContent =
            "Compass Running";


        statusDot.classList.add("active");


        statusText.textContent =
            "Compass active. Rotate your phone slowly.";


        /*
         * Prefer absolute orientation.
         */

        orientationHandler =
            handleOrientation;


        window.addEventListener(
            "deviceorientationabsolute",
            orientationHandler,
            true
        );


        /*
         * Fallback for browsers that don't
         * provide deviceorientationabsolute.
         */

        window.addEventListener(
            "deviceorientation",
            orientationHandler,
            true
        );
    }


    /* =====================================================
       DEVICE ORIENTATION
       ===================================================== */

    function handleOrientation(event) {

        let heading = null;


        /*
         * iOS Safari.
         */

        if (
            typeof event.webkitCompassHeading ===
            "number"
        ) {

            heading =
                event.webkitCompassHeading;

        }


        /*
         * Android absolute orientation.
         */

        else if (
            event.absolute === true &&

            typeof event.alpha ===
            "number"
        ) {

            heading =
                360 - event.alpha;

        }


        /*
         * Generic fallback.
         */

        else if (
            typeof event.alpha ===
            "number"
        ) {

            heading =
                360 - event.alpha;

        }


        if (
            typeof heading !== "number" ||
            Number.isNaN(heading)
        ) {

            return;
        }


        /*
         * Correct for screen orientation.
         */

        const screenAngle =
            getScreenOrientation();


        heading =
            normalizeDegrees(
                heading + screenAngle
            );


        deviceHeading =
            heading;


        updateCompass(
            deviceHeading
        );
    }


    /* =====================================================
       SCREEN ORIENTATION
       ===================================================== */

    function getScreenOrientation() {

        if (
            screen.orientation &&
            typeof screen.orientation.angle === "number"
        ) {

            return screen.orientation.angle;
        }


        /*
         * Older browsers.
         */

        if (
            typeof window.orientation ===
            "number"
        ) {

            return window.orientation;
        }


        return 0;
    }


    /* =====================================================
       UPDATE COMPASS
       ===================================================== */

    function updateCompass(heading) {

        if (qiblaBearing === null) {
            return;
        }


        /*
         * The compass dial rotates opposite
         * to the phone's movement.
         */

        compassRing.style.transform =
            `rotate(${-heading}deg)`;


        /*
         * Qibla pointer rotates according
         * to the Qibla bearing relative
         * to the current heading.
         */

        const relativeQibla =
            normalizeDegrees(
                qiblaBearing - heading
            );


        qiblaLayer.style.transform =
            `rotate(${relativeQibla}deg)`;


        /*
         * Display heading.
         */

        deviceHeadingEl.textContent =
            `${Math.round(heading)}°`;


        /*
         * Check alignment.
         */

        const difference =
            Math.abs(
                shortestAngleDifference(
                    qiblaBearing,
                    heading
                )
            );


        if (difference <= 5) {

            setAligned(true);

        } else {

            setAligned(false);

            const roundedDifference =
                Math.round(difference);


            alignmentText.textContent =
                `Turn ${roundedDifference}° toward the Qibla.`;
        }
    }


    /* =====================================================
       ALIGNMENT
       ===================================================== */

    function setAligned(aligned) {

        if (aligned) {

            appContainer.classList.add("aligned");

            alignmentText.textContent =
                "You are facing the Qibla.";

            alignmentMessage.querySelector(
                ".alignment-icon"
            ).textContent = "✓";

        } else {

            appContainer.classList.remove("aligned");

            alignmentMessage.querySelector(
                ".alignment-icon"
            ).textContent = "🧭";
        }
    }


    /* =====================================================
       ERROR
       ===================================================== */

    function showError(message) {

        statusText.textContent =
            message;

        statusDot.classList.remove(
            "active"
        );

        statusDot.classList.add(
            "error"
        );

        locationStatus.textContent =
            "Unavailable";
    }


    /* =====================================================
       START BUTTON
       ===================================================== */

    startBtn.addEventListener(
        "click",
        () => {

            /*
             * If compass is already running,
             * don't request everything again.
             */

            if (compassStarted) {

                statusText.textContent =
                    "Compass is running. Rotate your phone slowly.";

                return;
            }


            statusText.textContent =
                "Requesting location and compass access...";


            getLocation();
        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    statusText.textContent =
        "Tap Start Compass to begin.";

    locationStatus.textContent =
        "Waiting";

});