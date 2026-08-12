/*========================================
  IQRANIX - PRAYER.JS
  Updated Prayer Time Engine
========================================*/

"use strict";

/*========================================
  ELEMENTS
========================================*/

const city = document.getElementById("city");
const country = document.getElementById("country");

const gregorianDate = document.getElementById("gregorianDate");
const hijriDate = document.getElementById("hijriDate");

const nextPrayer = document.getElementById("nextPrayer");
const countdown = document.getElementById("countdown");
const progressBar = document.getElementById("progressBar");

const refreshBtn = document.getElementById("refreshBtn");

const fajrTime = document.getElementById("fajrTime");
const sunriseTime = document.getElementById("sunriseTime");
const dhuhrTime = document.getElementById("dhuhrTime");
const asrTime = document.getElementById("asrTime");
const maghribTime = document.getElementById("maghribTime");
const ishaTime = document.getElementById("ishaTime");


/*========================================
  VARIABLES
========================================*/

let latitude = null;
let longitude = null;

let prayerTimes = {};
let prayerDate = null;

let countdownTimer = null;
let refreshTimer = null;


/*========================================
  PRAYER NAMES
========================================*/

const PRAYERS = [
    "Fajr",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha"
];


/*========================================
  START
========================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializePrayerPage();

});


/*========================================
  INITIALIZE
========================================*/

async function initializePrayerPage() {

    updateCurrentDate();

    await getLocation();

    startAutoRefresh();

}


/*========================================
  REFRESH BUTTON
========================================*/

if (refreshBtn) {

    refreshBtn.addEventListener("click", async () => {

        refreshBtn.classList.add("rotating");

        await getLocation();

        setTimeout(() => {

            refreshBtn.classList.remove("rotating");

        }, 600);

    });

}


/*========================================
  LOCATION
========================================*/

function getLocation() {

    return new Promise((resolve) => {

        if (!navigator.geolocation) {

            setLocationError(
                "Location is not supported on this device."
            );

            resolve(false);

            return;

        }


        if (city) {

            city.textContent =
                "Detecting location...";

        }

        if (country) {

            country.textContent =
                "Please allow location access";

        }


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                latitude =
                    position.coords.latitude;

                longitude =
                    position.coords.longitude;


                console.log(
                    "Iqranix location:",
                    latitude,
                    longitude
                );


                await loadLocation();

                await loadPrayerTimes();

                resolve(true);

            },

            (error) => {

                console.error(
                    "Location error:",
                    error
                );

                setLocationError(
                    "Location Disabled"
                );

                resolve(false);

            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 300000
            }

        );

    });

}


/*========================================
  LOCATION ERROR
========================================*/

function setLocationError(message) {

    if (city) {

        city.textContent =
            message;

    }

    if (country) {

        country.textContent =
            "Enable GPS/location permission";

    }

}


/*========================================
  REVERSE GEOCODING
========================================*/

async function loadLocation() {

    if (
        latitude === null ||
        longitude === null
    ) {

        return;

    }


    try {

        const response = await fetch(

            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`

        );


        if (!response.ok) {

            throw new Error(
                "Reverse geocoding failed"
            );

        }


        const data =
            await response.json();


        const address =
            data.address || {};


        const detectedCity =

            address.city ||

            address.town ||

            address.village ||

            address.municipality ||

            address.county ||

            "Unknown";


        const detectedCountry =
            address.country || "";


        if (city) {

            city.textContent =
                detectedCity;

        }


        if (country) {

            country.textContent =
                detectedCountry;

        }


    } catch (error) {

        console.error(
            "Location lookup error:",
            error
        );


        if (city) {

            city.textContent =
                "Current Location";

        }

        if (country) {

            country.textContent =
                "GPS location detected";

        }

    }

}


/*========================================
  LOAD PRAYER TIMES
========================================*/

async function loadPrayerTimes() {

    if (
        latitude === null ||
        longitude === null
    ) {

        return;

    }


    try {

        const timestamp =
            Math.floor(Date.now() / 1000);


        const url =

            `https://api.aladhan.com/v1/timings/${timestamp}` +

            `?latitude=${latitude}` +

            `&longitude=${longitude}` +

            `&method=2`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Prayer API request failed"
            );

        }


        const result =
            await response.json();


        if (
            !result.data ||
            !result.data.timings
        ) {

            throw new Error(
                "Invalid prayer API response"
            );

        }


        prayerTimes =
            result.data.timings;


        prayerDate =
            result.data.date;


        /*--------------------------------
          DISPLAY TIMES
        --------------------------------*/

        setPrayerTime(
            fajrTime,
            prayerTimes.Fajr
        );

        setPrayerTime(
            sunriseTime,
            prayerTimes.Sunrise
        );

        setPrayerTime(
            dhuhrTime,
            prayerTimes.Dhuhr
        );

        setPrayerTime(
            asrTime,
            prayerTimes.Asr
        );

        setPrayerTime(
            maghribTime,
            prayerTimes.Maghrib
        );

        setPrayerTime(
            ishaTime,
            prayerTimes.Isha
        );


        /*--------------------------------
          DATES
        --------------------------------*/

        if (
            gregorianDate &&
            prayerDate &&
            prayerDate.readable
        ) {

            gregorianDate.textContent =
                prayerDate.readable;

        }


        if (
            hijriDate &&
            prayerDate &&
            prayerDate.hijri
        ) {

            hijriDate.textContent =

                `${prayerDate.hijri.day} ` +

                `${prayerDate.hijri.month.en} ` +

                `${prayerDate.hijri.year} AH`;

        }


        /*--------------------------------
          PUBLISH PRAYER DATA
        --------------------------------*/

        publishPrayerData();


        /*--------------------------------
          UPDATE UI
        --------------------------------*/

        determineNextPrayer();

        highlightCurrentPrayer();


        console.log(
            "Iqranix prayer times loaded:",
            prayerTimes
        );


    } catch (error) {

        console.error(
            "Prayer API Error:",
            error
        );

        if (nextPrayer) {

            nextPrayer.textContent =
                "Unable to load";

        }

        if (countdown) {

            countdown.textContent =
                "--:--";

        }

    }

}


/*========================================
  DISPLAY PRAYER TIME
========================================*/

function setPrayerTime(element, value) {

    if (!element) return;

    if (!value) {

        element.textContent =
            "--:--";

        return;

    }


    element.textContent =
        normalizePrayerTime(value);

}


/*========================================
  NORMALIZE TIME
========================================*/

function normalizePrayerTime(time) {

    if (!time) {

        return "";

    }


    return time
        .toString()
        .substring(0, 5);

}


/*========================================
  PUBLISH PRAYER DATA
========================================

  The notification system can read:

  window.iqranixPrayerTimes

  The Android/native scheduler can later
  use the same structured data.
========================================*/

function publishPrayerData() {

    const cleanTimes = {

        Fajr:
            normalizePrayerTime(
                prayerTimes.Fajr
            ),

        Sunrise:
            normalizePrayerTime(
                prayerTimes.Sunrise
            ),

        Dhuhr:
            normalizePrayerTime(
                prayerTimes.Dhuhr
            ),

        Asr:
            normalizePrayerTime(
                prayerTimes.Asr
            ),

        Maghrib:
            normalizePrayerTime(
                prayerTimes.Maghrib
            ),

        Isha:
            normalizePrayerTime(
                prayerTimes.Isha
            )

    };


    window.iqranixPrayerTimes =
        cleanTimes;


    /*
      Also publish location.
    */

    window.iqranixPrayerLocation = {

        latitude:
            latitude,

        longitude:
            longitude

    };


    /*
      Publish complete package.
    */

    window.iqranixPrayerData = {

        date:
            prayerDate,

        location: {

            latitude:
                latitude,

            longitude:
                longitude

        },

        times:
            cleanTimes

    };


    /*
      Save today's prayer schedule locally.

      This is useful for the Android/native
      notification scheduler later.
    */

    try {

        localStorage.setItem(

            "iqranixPrayerSchedule",

            JSON.stringify(
                window.iqranixPrayerData
            )

        );

    } catch (error) {

        console.warn(
            "Could not save prayer schedule:",
            error
        );

    }

}


/*========================================
  NEXT PRAYER
========================================*/

function determineNextPrayer() {

    if (!prayerTimes) return;


    const prayers = [

        {
            name: "Fajr",
            time: prayerTimes.Fajr
        },

        {
            name: "Dhuhr",
            time: prayerTimes.Dhuhr
        },

        {
            name: "Asr",
            time: prayerTimes.Asr
        },

        {
            name: "Maghrib",
            time: prayerTimes.Maghrib
        },

        {
            name: "Isha",
            time: prayerTimes.Isha
        }

    ];


    const now =
        new Date();


    let next = null;


    for (
        const prayer of prayers
    ) {

        const time =
            normalizePrayerTime(
                prayer.time
            );


        if (!time) continue;


        const prayerDateTime =
            createTodayTime(time);


        if (
            prayerDateTime > now
        ) {

            next = {

                name:
                    prayer.name,

                date:
                    prayerDateTime

            };

            break;

        }

    }


    /*
      If all prayers have passed,
      next prayer is tomorrow's Fajr.
    */

    if (!next) {

        const tomorrow =
            new Date();


        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        const fajr =
            normalizePrayerTime(
                prayerTimes.Fajr
            );


        const parts =
            fajr.split(":");


        tomorrow.setHours(

            Number(parts[0] || 5),

            Number(parts[1] || 0),

            0,

            0

        );


        next = {

            name: "Fajr",

            date: tomorrow

        };

    }


    if (nextPrayer) {

        nextPrayer.textContent =
            next.name;

    }


    startCountdown(
        next.date
    );

}


/*========================================
  CREATE TODAY TIME
========================================*/

function createTodayTime(time) {

    const parts =
        time.split(":");


    const date =
        new Date();


    date.setHours(

        Number(parts[0]),

        Number(parts[1]),

        0,

        0

    );


    return date;

}


/*========================================
  COUNTDOWN
========================================*/

function startCountdown(targetTime) {

    if (countdownTimer) {

        clearInterval(
            countdownTimer
        );

    }


    function updateCountdown() {

        const now =
            new Date();


        let difference =
            targetTime - now;


        if (
            difference <= 0
        ) {

            clearInterval(
                countdownTimer
            );


            loadPrayerTimes();

            return;

        }


        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const hours =
            Math.floor(
                totalSeconds / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        if (countdown) {

            countdown.textContent =

                `${String(hours).padStart(2, "0")}:` +

                `${String(minutes).padStart(2, "0")}:` +

                `${String(seconds).padStart(2, "0")}`;

        }


        /*
          Progress through the 24-hour day.
        */

        const remaining =
            difference / 86400000;


        const percentage =
            (1 - remaining) * 100;


        if (progressBar) {

            progressBar.style.width =

                `${Math.min(
                    Math.max(percentage, 0),
                    100
                )}%`;

        }

    }


    updateCountdown();


    countdownTimer =
        setInterval(
            updateCountdown,
            1000
        );

}


/*========================================
  CURRENT PRAYER
========================================*/

function highlightCurrentPrayer() {

    const cards =
        document.querySelectorAll(
            ".prayer-card"
        );


    cards.forEach(card => {

        card.classList.remove(
            "active"
        );

    });


    if (!prayerTimes) return;


    const now =
        new Date();


    const prayerOrder = [

        {
            name: "Fajr",
            time: prayerTimes.Fajr
        },

        {
            name: "Sunrise",
            time: prayerTimes.Sunrise
        },

        {
            name: "Dhuhr",
            time: prayerTimes.Dhuhr
        },

        {
            name: "Asr",
            time: prayerTimes.Asr
        },

        {
            name: "Maghrib",
            time: prayerTimes.Maghrib
        },

        {
            name: "Isha",
            time: prayerTimes.Isha
        }

    ];


    let currentIndex = -1;


    for (
        let i = 0;
        i < prayerOrder.length;
        i++
    ) {

        const currentTime =
            normalizePrayerTime(
                prayerOrder[i].time
            );


        if (!currentTime) continue;


        const currentDate =
            createTodayTime(
                currentTime
            );


        if (
            currentDate <= now
        ) {

            currentIndex = i;

        }

    }


    /*
      Do not treat Sunrise as a Salah card.
      Move to Fajr/Dhuhr appropriately.
    */

    if (currentIndex === 1) {

        currentIndex = 0;

    }


    if (cards[currentIndex]) {

        cards[currentIndex]
            .classList
            .add("active");

    }

}


/*========================================
  DATE
========================================*/

function updateCurrentDate() {

    if (!gregorianDate) return;


    const today =
        new Date();


    gregorianDate.textContent =

        today.toLocaleDateString(
            undefined,
            {

                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"

            }
        );

}


/*========================================
  AUTO REFRESH
========================================*/

function startAutoRefresh() {

    if (refreshTimer) {

        clearInterval(
            refreshTimer
        );

    }


    /*
      Refresh every 10 minutes.
    */

    refreshTimer =
        setInterval(

            () => {

                if (
                    latitude !== null &&
                    longitude !== null
                ) {

                    loadPrayerTimes();

                }

            },

            600000

        );

}


/*========================================
  VISIBILITY REFRESH
========================================

  When the user returns to the page,
  refresh the schedule.
========================================*/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            if (
                latitude !== null &&
                longitude !== null
            ) {

                loadPrayerTimes();

            }

        }

    }
);


/*========================================
  GLOBAL API
========================================

  Other Iqranix scripts can use these.
========================================*/

window.IqranixPrayer = {

    getTimes: function () {

        return {
            ...window.iqranixPrayerTimes
        };

    },

    getLocation: function () {

        return {
            latitude:
                latitude,

            longitude:
                longitude

        };

    },

    refresh: function () {

        return loadPrayerTimes();

    }

};


/*========================================
  READY
========================================*/

window.addEventListener(
    "load",
    () => {

        console.log(
            "IQRANIX Prayer Engine Ready."
        );

    }
);