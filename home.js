/* =========================================================
   IQRANIX — HOMEPAGE JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   DOM
========================================================= */

const menuButton =
    document.getElementById("menuButton");

const closeMenu =
    document.getElementById("closeMenu");

const homeMenu =
    document.getElementById("homeMenu");

const menuBackdrop =
    document.getElementById("menuBackdrop");

const userName =
    document.getElementById("user-name");

const gregorianDate =
    document.getElementById("gregorian-date");

const hijriDate =
    document.getElementById("hijri-date");

const nextPrayer =
    document.getElementById("next-prayer");

const dhikrCount =
    document.getElementById("dhikr-count");

const goalProgress =
    document.getElementById("goal-progress");

const streakDays =
    document.getElementById("streak-days");


/* =========================================================
   MENU
========================================================= */

function openMenu() {

    if (!homeMenu) return;

    homeMenu.classList.add("open");

    homeMenu.setAttribute(
        "aria-hidden",
        "false"
    );

    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    if (menuBackdrop) {

        menuBackdrop.hidden = false;

    }

    document.body.style.overflow = "hidden";
}


function closeHomeMenu() {

    if (!homeMenu) return;

    homeMenu.classList.remove("open");

    homeMenu.setAttribute(
        "aria-hidden",
        "true"
    );

    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    if (menuBackdrop) {

        menuBackdrop.hidden = true;

    }

    document.body.style.overflow = "";
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


if (closeMenu) {

    closeMenu.addEventListener(
        "click",
        closeHomeMenu
    );

}


if (menuBackdrop) {

    menuBackdrop.addEventListener(
        "click",
        closeHomeMenu
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeHomeMenu();

        }

    }
);


/* =========================================================
   DATE — GREGORIAN + HIJRI
========================================================= */

function updateGregorianDate() {

    if (!gregorianDate) return;

    const now = new Date();

    gregorianDate.textContent =
        now.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


/* =========================================================
   HIJRI DATE
=========================================================

   Primary:
   AlAdhan Gregorian → Hijri API

   Fallback:
   Browser Umm al-Qura calendar

========================================================= */

async function updateHijriDate() {

    if (!hijriDate) return;

    const now = new Date();

    const day =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year =
        now.getFullYear();


    /*
      Show a temporary value while
      the correct date is being obtained.
    */

    hijriDate.textContent =
        "Loading Hijri date...";


    try {

        const response = await fetch(
            `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Hijri API request failed"
            );

        }


        const result =
            await response.json();


        if (
            !result ||
            !result.data ||
            !result.data.hijri
        ) {

            throw new Error(
                "Invalid Hijri API response"
            );

        }


        const hijri =
            result.data.hijri;


        /*
          AlAdhan returns the correct
          Hijri day, month and year.
        */

        const hijriDay =
            hijri.day;

        const hijriMonth =
            hijri.month.en;

        const hijriYear =
            hijri.year;


        hijriDate.textContent =
            `${hijriDay} ${hijriMonth} ${hijriYear} AH`;


        /*
          Save the latest verified date.
        */

        try {

            localStorage.setItem(
                "iqranixHijriDate",
                JSON.stringify({
                    day: hijriDay,
                    month: hijriMonth,
                    year: hijriYear,
                    updatedAt:
                        new Date().toISOString()
                })
            );

        } catch (storageError) {

            console.warn(
                "Could not save Hijri date:",
                storageError
            );

        }


        console.log(
            "IQRANIX correct Hijri date:",
            `${hijriDay} ${hijriMonth} ${hijriYear} AH`
        );


    } catch (error) {

        console.warn(
            "IQRANIX Hijri API unavailable:",
            error
        );


        /*
          FALLBACK 1:
          Umm al-Qura calendar.
        */

        try {

            const formatter =
                new Intl.DateTimeFormat(
                    "en-US-u-ca-islamic-umalqura",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );


            const formatted =
                formatter.format(now);


            hijriDate.textContent =
                `${formatted} AH`;


            console.log(
                "IQRANIX using Umm al-Qura fallback:",
                formatted
            );


            return;


        } catch (fallbackError) {

            console.warn(
                "Umm al-Qura fallback unavailable:",
                fallbackError
            );

        }


        /*
          FALLBACK 2:
          Previously saved Hijri date.
        */

        try {

            const saved =
                localStorage.getItem(
                    "iqranixHijriDate"
                );


            if (saved) {

                const data =
                    JSON.parse(saved);


                if (
                    data &&
                    data.day &&
                    data.month &&
                    data.year
                ) {

                    hijriDate.textContent =
                        `${data.day} ${data.month} ${data.year} AH`;

                    return;

                }

            }

        } catch (storageError) {

            console.warn(
                "Saved Hijri date could not be read:",
                storageError
            );

        }


        hijriDate.textContent =
            "Hijri date unavailable";

    }

}


/* =========================================================
   UPDATE ALL DATES
========================================================= */

function updateDates() {

    updateGregorianDate();

    updateHijriDate();

}


/* =========================================================
   LOCAL DATA HELPER
========================================================= */

function readJSON(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "IQRANIX local data error:",
            key,
            error
        );

        return fallback;

    }

}


/* =========================================================
   DHIKR
========================================================= */

function loadDhikrCount() {

    if (!dhikrCount) return;

    const possibleKeys = [

        "iqranixDhikrCount",
        "iqranixTasbihCount",
        "tasbihCount",
        "dhikrCount"

    ];


    let value = null;


    for (const key of possibleKeys) {

        const stored =
            localStorage.getItem(key);

        if (stored !== null) {

            value = Number(stored);

            break;

        }

    }


    if (
        Number.isNaN(value) ||
        value === null
    ) {

        value = 0;

    }


    dhikrCount.textContent =
        Math.max(0, value);

}


/* =========================================================
   GOALS
========================================================= */

function loadGoalProgress() {

    if (!goalProgress) return;


    const possibleKeys = [

        "iqranixGoalProgress",
        "goalProgress",
        "iqranixDailyGoalProgress"

    ];


    let value = 0;


    for (const key of possibleKeys) {

        const stored =
            localStorage.getItem(key);

        if (stored !== null) {

            value = Number(stored);

            break;

        }

    }


    if (Number.isNaN(value)) {

        value = 0;

    }


    goalProgress.textContent =
        Math.min(
            100,
            Math.max(0, value)
        );

}


/* =========================================================
   STREAK
========================================================= */

function loadStreak() {

    if (!streakDays) return;


    const possibleKeys = [

        "iqranixStreak",
        "iqranixStreakDays",
        "streakDays"

    ];


    let value = 0;


    for (const key of possibleKeys) {

        const stored =
            localStorage.getItem(key);

        if (stored !== null) {

            value = Number(stored);

            break;

        }

    }


    if (Number.isNaN(value)) {

        value = 0;

    }


    streakDays.textContent =
        Math.max(0, value);

}


/* =========================================================
   PRAYER SCHEDULE
========================================================= */

const HOME_PRAYERS = [

    "Fajr",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha"

];


function getPrayerSchedule() {

    /*
      1. Live prayer engine
    */

    if (
        window.iqranixPrayerTimes &&
        typeof window.iqranixPrayerTimes === "object"
    ) {

        return window.iqranixPrayerTimes;

    }


    /*
      2. Saved prayer schedule
    */

    const saved =
        readJSON(
            "iqranixPrayerSchedule",
            null
        );


    if (
        saved &&
        saved.times
    ) {

        return saved.times;

    }


    /*
      3. Complete prayer package
    */

    if (
        window.iqranixPrayerData &&
        window.iqranixPrayerData.times
    ) {

        return window.iqranixPrayerData.times;

    }


    return null;

}


/* =========================================================
   PARSE PRAYER TIME
========================================================= */

function prayerTimeToDate(
    time,
    baseDate = new Date()
) {

    if (!time) return null;


    const clean =
        String(time)
            .substring(0, 5);


    const parts =
        clean.split(":");


    if (parts.length !== 2) {

        return null;

    }


    const hours =
        Number(parts[0]);

    const minutes =
        Number(parts[1]);


    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {

        return null;

    }


    const result =
        new Date(baseDate);


    result.setHours(
        hours,
        minutes,
        0,
        0
    );


    return result;

}


/* =========================================================
   NEXT PRAYER
========================================================= */

function updateNextPrayer() {

    if (!nextPrayer) return;


    const times =
        getPrayerSchedule();


    if (!times) {

        nextPrayer.textContent =
            "Open Prayer Times";

        return;

    }


    const now =
        new Date();


    let found = null;


    for (
        const prayerName of HOME_PRAYERS
    ) {

        const time =
            times[prayerName];


        const date =
            prayerTimeToDate(
                time,
                now
            );


        if (
            date &&
            date > now
        ) {

            found = {

                name:
                    prayerName,

                date:
                    date

            };

            break;

        }

    }


    /*
      Today's prayers have passed.
      Tomorrow's Fajr is next.
    */

    if (!found) {

        const fajrTime =
            times.Fajr;


        const tomorrow =
            new Date(now);


        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        const fajrDate =
            prayerTimeToDate(
                fajrTime,
                tomorrow
            );


        if (fajrDate) {

            found = {

                name: "Fajr",

                date: fajrDate

            };

        }

    }


    if (!found) {

        nextPrayer.textContent =
            "Prayer Times";

        return;

    }


    nextPrayer.textContent =
        `${found.name} • ${formatTime(found.date)}`;

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(date) {

    if (!date) return "";


    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   IMAGE FALLBACKS
========================================================= */

function enableImageFallbacks() {

    const images = [

        {
            selector: ".hero-image",
            fallback:
                "linear-gradient(145deg,#0d503b,#071a14)"
        },

        {
            selector: ".premium-image",
            fallback:
                "linear-gradient(145deg,#4d3a17,#171107)"
        },

        {
            selector: ".forgotten-image",
            fallback:
                "linear-gradient(145deg,#154c3a,#071a14)"
        },

        {
            selector: ".quran-card .card-image",
            fallback:
                "linear-gradient(145deg,#0d6549,#061a13)"
        },

        {
            selector: ".duas-card .card-image",
            fallback:
                "linear-gradient(145deg,#164e40,#081a14)"
        },

        {
            selector: ".calendar-card .card-image",
            fallback:
                "linear-gradient(145deg,#173c53,#07171f)"
        },

        {
            selector: ".qibla-card .card-image",
            fallback:
                "linear-gradient(145deg,#403d18,#111108)"
        }

    ];


    images.forEach(item => {

        const element =
            document.querySelector(
                item.selector
            );


        if (!element) return;


        const computed =
            getComputedStyle(element);


        const background =
            computed.backgroundImage;


        const match =
            background.match(
                /url\(["']?(.*?)["']?\)/
            );


        if (!match) return;


        const imageURL =
            match[1];


        const tester =
            new Image();


        tester.onload = () => {

            element.classList.add(
                "image-loaded"
            );

        };


        tester.onerror = () => {

            element.style.backgroundImage =
                item.fallback;

        };


        tester.src =
            imageURL;

    });

}


/* =========================================================
   PRAYER ENGINE EVENT
========================================================= */

window.addEventListener(
    "iqranix:prayer-times-updated",
    () => {

        updateNextPrayer();

    }
);


/* =========================================================
   SCHEDULER EVENT
========================================================= */

window.addEventListener(
    "iqranix:scheduler-updated",
    () => {

        updateNextPrayer();

    }
);


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible"
        ) {

            updateDates();

            updateNextPrayer();

            loadDhikrCount();

            loadGoalProgress();

            loadStreak();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeHomepage() {

    updateGregorianDate();

    /*
      Hijri date loads independently
      because it is asynchronous.
    */
    updateHijriDate();

    loadDhikrCount();

    loadGoalProgress();

    loadStreak();

    updateNextPrayer();

    enableImageFallbacks();

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeHomepage
    );

} else {

    initializeHomepage();

}


/* =========================================================
   LIVE NEXT-PRAYER UPDATE
========================================================= */

setInterval(
    updateNextPrayer,
    30000
);


/* =========================================================
   DAILY HIJRI REFRESH
========================================================= */

setInterval(
    updateHijriDate,
    60 * 60 * 1000
);


/* =========================================================
   PUBLIC HOMEPAGE API
========================================================= */

window.IqranixHome = {

    refresh: function () {

        updateGregorianDate();

        updateHijriDate();

        loadDhikrCount();

        loadGoalProgress();

        loadStreak();

        updateNextPrayer();

    },

    getPrayerSchedule:
        getPrayerSchedule,

    updateHijriDate:
        updateHijriDate

};


/* =========================================================
   READY
========================================================= */

console.log(
    "IQRANIX Homepage Ready."
);
