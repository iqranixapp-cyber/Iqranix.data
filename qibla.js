"use strict";

/*
=========================================================
 IQRANIX PRECISION QIBLA ENGINE
=========================================================

 Kaaba coordinates:
 latitude  = 21.422487°
 longitude = 39.826206°

 The geographic bearing is calculated using the
 initial great-circle bearing between the user's
 position and the Kaaba.

 The sensor portion deliberately does NOT assume that
 event.alpha is automatically a magnetic compass heading.
=========================================================
*/


const KAABA = {
    lat: 21.422487,
    lon: 39.826206
};


const startButton =
    document.getElementById("startButton");

const calibrateButton =
    document.getElementById("calibrateButton");

const compassDial =
    document.getElementById("compassDial");

const qiblaArrow =
    document.getElementById("qiblaArrow");

const qiblaBearingElement =
    document.getElementById("qiblaBearing");

const alignmentElement =
    document.getElementById("alignmentValue");

const statusText =
    document.getElementById("statusText");

const statusDot =
    document.getElementById("statusDot");

const locationElement =
    document.getElementById("locationText");

const headingElement =
    document.getElementById("headingText");

const sensorElement =
    document.getElementById("sensorText");


let qiblaBearing = null;
let smoothedHeading = null;
let sensorSamples = [];
let running = false;


/* =====================================================
   ANGLE UTILITIES
===================================================== */

function normalize(angle) {

    angle %= 360;

    if (angle < 0) {
        angle += 360;
    }

    return angle;
}


function shortestAngleDifference(a, b) {

    return (
        ((a - b + 540) % 360) - 180
    );
}


/*
 Circular interpolation.

 This is important because 359° and 1° are
 only 2° apart, not 358° apart.
*/

function circularSmooth(previous, next, factor) {

    if (previous === null) {
        return normalize(next);
    }

    const difference =
        shortestAngleDifference(next, previous);

    return normalize(
        previous + difference * factor
    );
}


/* =====================================================
   PRECISE GREAT-CIRCLE QIBLA BEARING
===================================================== */

function calculateQiblaBearing(latitude, longitude) {

    const φ1 =
        latitude * Math.PI / 180;

    const φ2 =
        KAABA.lat * Math.PI / 180;

    const Δλ =
        (KAABA.lon - longitude) *
        Math.PI / 180;


    /*
      Initial bearing formula:

      θ =
      atan2(
          sin Δλ · cos φ2,
          cos φ1 · sin φ2
          -
          sin φ1 · cos φ2 · cos Δλ
      )
    */

    const y =
        Math.sin(Δλ) *
        Math.cos(φ2);


    const x =
        Math.cos(φ1) *
        Math.sin(φ2)
        -
        Math.sin(φ1) *
        Math.cos(φ2) *
        Math.cos(Δλ);


    const θ =
        Math.atan2(y, x);


    return normalize(
        θ * 180 / Math.PI
    );
}


/* =====================================================
   STATUS
===================================================== */

function setStatus(message, active = false) {

    statusText.textContent = message;

    statusDot.classList.toggle(
        "active",
        active
    );
}


/* =====================================================
   LOCATION
===================================================== */

function requestLocation() {

    return new Promise(
        (resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation unavailable."
                    )
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(

                resolve,

                reject,

                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0
                }

            );

        }
    );
}


/* =====================================================
   START
===================================================== */

async function startQibla() {

    startButton.disabled = true;

    setStatus(
        "Acquiring precise GPS location..."
    );


    try {

        const position =
            await requestLocation();


        const latitude =
            position.coords.latitude;

        const longitude =
            position.coords.longitude;


        qiblaBearing =
            calculateQiblaBearing(
                latitude,
                longitude
            );


        qiblaBearingElement.textContent =
            `${qiblaBearing.toFixed(2)}°`;


        locationElement.textContent =
            `${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°`;


        setStatus(
            "Location acquired. Requesting compass..."
        );


        await requestCompass();


    } catch (error) {

        console.error(error);

        startButton.disabled = false;

        setStatus(
            "Unable to obtain your location."
        );

        sensorElement.textContent =
            "Location unavailable";

    }

}


/* =====================================================
   REQUEST COMPASS
===================================================== */

async function requestCompass() {

    /*
      iOS Safari has an explicit permission API.
    */

    if (
        typeof DeviceOrientationEvent !==
        "undefined" &&
        typeof DeviceOrientationEvent.requestPermission ===
        "function"
    ) {

        try {

            const permission =
                await DeviceOrientationEvent.requestPermission();


            if (permission !== "granted") {

                throw new Error(
                    "Compass permission denied."
                );

            }

        } catch (error) {

            console.error(error);

            setStatus(
                "Compass permission denied."
            );

            startButton.disabled = false;

            return;
        }
    }


    /*
      Prefer absolute orientation.
    */

    window.addEventListener(
        "deviceorientationabsolute",
        processOrientation,
        true
    );


    /*
      Standard fallback.
    */

    window.addEventListener(
        "deviceorientation",
        processOrientation,
        true
    );


    running = true;

    startButton.hidden = true;

    calibrateButton.hidden = false;

    sensorElement.textContent =
        "Listening";

    setStatus(
        "Compass active — hold phone flat.",
        true
    );

}


/* =====================================================
   ORIENTATION PROCESSING
===================================================== */

function processOrientation(event) {

    if (
        !running ||
        qiblaBearing === null
    ) {
        return;
    }


    let heading = null;


    /*
    -----------------------------------------------------
    METHOD 1 — iOS / Safari calibrated heading
    -----------------------------------------------------
    */

    if (
        typeof event.webkitCompassHeading ===
        "number" &&
        Number.isFinite(event.webkitCompassHeading)
    ) {

        heading =
            event.webkitCompassHeading;

        sensorElement.textContent =
            "Calibrated compass";

    }


    /*
    -----------------------------------------------------
    METHOD 2 — absolute orientation
    -----------------------------------------------------
    */

    else if (
        event.absolute === true &&
        typeof event.alpha === "number"
    ) {

        heading =
            normalize(
                360 - event.alpha
            );

        sensorElement.textContent =
            "Absolute orientation";

    }


    /*
    -----------------------------------------------------
    METHOD 3 — ordinary orientation
    -----------------------------------------------------
    */

    else if (
        typeof event.alpha === "number"
    ) {

        /*
          This is NOT guaranteed to be true North.

          We still expose it as a fallback, but the UI
          should not pretend it has the same confidence
          as a calibrated compass heading.
        */

        heading =
            normalize(
                360 - event.alpha
            );

        sensorElement.textContent =
            "Browser orientation";

    }


    if (heading === null) {

        sensorElement.textContent =
            "No heading";

        return;
    }


    /*
    -----------------------------------------------------
    Screen orientation correction
    -----------------------------------------------------

    When the phone rotates between portrait and landscape,
    the browser's sensor frame and visual screen frame can
    differ.
    */

    let screenAngle = 0;


    if (
        screen.orientation &&
        typeof screen.orientation.angle === "number"
    ) {

        screenAngle =
            screen.orientation.angle;

    }


    heading =
        normalize(
            heading + screenAngle
        );


    /*
    -----------------------------------------------------
    Circular sensor smoothing
    -----------------------------------------------------
    */

    smoothedHeading =
        circularSmooth(
            smoothedHeading,
            heading,
            0.18
        );


    headingElement.textContent =
        `${smoothedHeading.toFixed(1)}°`;


    /*
    -----------------------------------------------------
    Rotate the dial so North represents true
    compass north relative to the phone.
    -----------------------------------------------------
    */

    compassDial.style.transform =
        `rotate(${-smoothedHeading}deg)`;


    /*
    -----------------------------------------------------
    Relative Qibla direction
    -----------------------------------------------------
    */

    const relative =
        normalize(
            qiblaBearing -
            smoothedHeading
        );


    qiblaArrow.style.transform =
        `rotate(${relative}deg)`;


    /*
    -----------------------------------------------------
    Angular error from perfect alignment
    -----------------------------------------------------
    */

    const error =
        Math.abs(
            shortestAngleDifference(
                relative,
                0
            )
        );


    alignmentElement.textContent =
        `${error.toFixed(1)}° off`;


    if (error <= 3) {

        alignmentElement.textContent =
            "✓ Facing Qibla";

        alignmentElement.style.color =
            "#0B6E4F";

        setStatus(
            "✓ You are facing the Qibla",
            true
        );

    }

    else if (error <= 10) {

        alignmentElement.textContent =
            `${error.toFixed(1)}° — almost aligned`;

        alignmentElement.style.color =
            "#b17a16";

        setStatus(
            "Almost aligned with the Qibla",
            true
        );

    }

    else {

        alignmentElement.textContent =
            `${error.toFixed(1)}° off`;

        alignmentElement.style.color =
            "#8b5757";

        setStatus(
            "Rotate toward the Qibla",
            true
        );

    }

}


/* =====================================================
   CALIBRATION
===================================================== */

calibrateButton.addEventListener(
    "click",
    () => {

        smoothedHeading = null;

        sensorSamples = [];

        setStatus(
            "Calibrating… rotate your phone slowly.",
            true
        );


        setTimeout(
            () => {

                setStatus(
                    "Compass active — hold phone flat.",
                    true
                );

            },
            3500
        );

    }
);


/* =====================================================
   START BUTTON
===================================================== */

startButton.addEventListener(
    "click",
    startQibla
);