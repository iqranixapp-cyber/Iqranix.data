/* =========================================================
   IQRANIX — NOTIFICATIONS & ADHAN
   Connected to Iqranix Prayer Times
   Ready for Native Android Scheduler
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       STORAGE
    ===================================================== */

    const SETTINGS_KEY = "iqranixNotificationSettings";
    const PRAYER_SCHEDULE_KEY = "iqranixPrayerSchedule";


    /* =====================================================
       DEFAULT SETTINGS
    ===================================================== */

    const DEFAULT_SETTINGS = {
        notificationsEnabled: true,
        adhanEnabled: true,

        adhan: "default",

        prayers: {
            fajr: true,
            dhuhr: true,
            asr: true,
            maghrib: true,
            isha: true
        }
    };


    let settings = loadSettings();

    let prayerSchedule = null;

    let previewAudio = null;


    /* =====================================================
       PRAYER INFORMATION
    ===================================================== */

    const PRAYERS = {
        fajr: {
            name: "Fajr",
            arabic: "الفجر"
        },

        dhuhr: {
            name: "Dhuhr",
            arabic: "الظهر"
        },

        asr: {
            name: "Asr",
            arabic: "العصر"
        },

        maghrib: {
            name: "Maghrib",
            arabic: "المغرب"
        },

        isha: {
            name: "Isha",
            arabic: "العشاء"
        }
    };


    /* =====================================================
       LOAD SETTINGS
    ===================================================== */

    function loadSettings() {

        try {

            const saved =
                localStorage.getItem(SETTINGS_KEY);

            if (!saved) {
                return structuredClone(DEFAULT_SETTINGS);
            }

            const parsed = JSON.parse(saved);

            return {
                ...structuredClone(DEFAULT_SETTINGS),
                ...parsed,
                prayers: {
                    ...DEFAULT_SETTINGS.prayers,
                    ...(parsed.prayers || {})
                }
            };

        } catch (error) {

            console.error(
                "IQRANIX: Could not load notification settings",
                error
            );

            return structuredClone(DEFAULT_SETTINGS);
        }
    }


    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    function saveSettings() {

        try {

            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify(settings)
            );

            /*
             * Notify the rest of Iqranix.
             */
            window.dispatchEvent(
                new CustomEvent(
                    "iqranixNotificationSettingsUpdated",
                    {
                        detail: settings
                    }
                )
            );

            /*
             * Send the complete schedule + settings
             * to the native scheduler bridge.
             */
            sendToNativeScheduler();

        } catch (error) {

            console.error(
                "IQRANIX: Could not save notification settings",
                error
            );
        }
    }


    /* =====================================================
       FIND PRAYER SCHEDULE
    ===================================================== */

    function loadPrayerSchedule() {

        /*
         * First try the global schedule.
         */
        if (
            window.iqranixPrayerSchedule &&
            typeof window.iqranixPrayerSchedule === "object"
        ) {

            prayerSchedule =
                window.iqranixPrayerSchedule;

            return prayerSchedule;
        }


        /*
         * Some versions of prayer.js may expose
         * the times using iqranixPrayerTimes.
         */
        if (
            window.iqranixPrayerTimes &&
            typeof window.iqranixPrayerTimes === "object"
        ) {

            prayerSchedule =
                window.iqranixPrayerTimes;

            return prayerSchedule;
        }


        /*
         * Finally check localStorage.
         */
        try {

            const stored =
                localStorage.getItem(
                    PRAYER_SCHEDULE_KEY
                );

            if (stored) {

                prayerSchedule =
                    JSON.parse(stored);

                return prayerSchedule;
            }

        } catch (error) {

            console.warn(
                "IQRANIX: Invalid stored prayer schedule.",
                error
            );
        }


        prayerSchedule = null;

        return null;
    }


    /* =====================================================
       NORMALIZE PRAYER TIME
    ===================================================== */

    function getPrayerTime(prayer) {

        if (!prayerSchedule) {
            return null;
        }


        /*
         * Possible formats supported:
         *
         * {
         *   fajr: "05:12",
         *   dhuhr: "12:18",
         *   ...
         * }
         *
         * OR
         *
         * {
         *   fajr: { time: "05:12" }
         * }
         *
         * OR
         *
         * {
         *   Fajr: "05:12"
         * }
         */


        const possibleKeys = [
            prayer,
            prayer.toLowerCase(),
            prayer.charAt(0).toUpperCase() +
            prayer.slice(1)
        ];


        let value = null;


        for (const key of possibleKeys) {

            if (
                Object.prototype.hasOwnProperty.call(
                    prayerSchedule,
                    key
                )
            ) {

                value =
                    prayerSchedule[key];

                break;
            }
        }


        /*
         * Sometimes prayer times are nested.
         */
        if (
            !value &&
            prayerSchedule.times
        ) {

            for (const key of possibleKeys) {

                if (
                    Object.prototype.hasOwnProperty.call(
                        prayerSchedule.times,
                        key
                    )
                ) {

                    value =
                        prayerSchedule.times[key];

                    break;
                }
            }
        }


        if (!value) {
            return null;
        }


        /*
         * Handle:
         *
         * "05:12"
         * { time: "05:12" }
         * { formatted: "05:12 AM" }
         */
        if (typeof value === "object") {

            value =
                value.time ||
                value.formatted ||
                value.display ||
                value.value ||
                null;
        }


        if (!value) {
            return null;
        }


        return String(value).trim();
    }


    /* =====================================================
       CONVERT TIME TO TODAY'S DATE
    ===================================================== */

    function timeToDate(timeString) {

        if (!timeString) {
            return null;
        }


        const now = new Date();


        /*
         * 24-hour format:
         * 05:12
         * 18:31
         */
        let match =
            timeString.match(
                /^(\d{1,2}):(\d{2})$/
            );


        if (match) {

            const hours =
                Number(match[1]);

            const minutes =
                Number(match[2]);

            const date =
                new Date(now);

            date.setHours(
                hours,
                minutes,
                0,
                0
            );

            return date;
        }


        /*
         * 12-hour format:
         * 5:12 AM
         * 6:31 PM
         */
        match =
            timeString.match(
                /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
            );


        if (match) {

            let hours =
                Number(match[1]);

            const minutes =
                Number(match[2]);

            const period =
                match[3].toUpperCase();


            if (period === "PM" && hours !== 12) {
                hours += 12;
            }

            if (period === "AM" && hours === 12) {
                hours = 0;
            }


            const date =
                new Date(now);

            date.setHours(
                hours,
                minutes,
                0,
                0
            );

            return date;
        }


        return null;
    }


    /* =====================================================
       FORMAT DISPLAY TIME
    ===================================================== */

    function formatDisplayTime(timeString) {

        const date =
            timeToDate(timeString);

        if (!date) {
            return timeString || "Unavailable";
        }


        return new Intl.DateTimeFormat(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        ).format(date);
    }


    /* =====================================================
       GET NEXT PRAYER
    ===================================================== */

    function getNextPrayer() {

        const now =
            new Date();

        let next = null;


        for (const key of Object.keys(PRAYERS)) {

            if (!settings.prayers[key]) {
                continue;
            }


            const time =
                getPrayerTime(key);

            if (!time) {
                continue;
            }


            const date =
                timeToDate(time);

            if (!date) {
                continue;
            }


            if (date > now) {

                if (
                    !next ||
                    date < next.date
                ) {

                    next = {
                        key,
                        date,
                        time
                    };
                }
            }
        }


        /*
         * If all today's prayers have passed,
         * tomorrow's Fajr is the next prayer.
         */
        if (!next) {

            if (
                settings.prayers.fajr
            ) {

                const fajrTime =
                    getPrayerTime("fajr");

                const fajrDate =
                    timeToDate(fajrTime);


                if (fajrDate) {

                    fajrDate.setDate(
                        fajrDate.getDate() + 1
                    );


                    next = {
                        key: "fajr",
                        date: fajrDate,
                        time: fajrTime,
                        tomorrow: true
                    };
                }
            }
        }


        return next;
    }


    /* =====================================================
       UPDATE NEXT PRAYER UI
    ===================================================== */

    function updateNextPrayer() {

        const nameElement =
            document.getElementById(
                "next-prayer-name"
            );

        const timeElement =
            document.getElementById(
                "next-prayer-time"
            );


        if (!nameElement || !timeElement) {
            return;
        }


        loadPrayerSchedule();


        const next =
            getNextPrayer();


        if (!next) {

            nameElement.textContent =
                "Prayer times unavailable";

            timeElement.textContent =
                "Please allow location access and make sure prayer times are available.";

            return;
        }


        const info =
            PRAYERS[next.key];


        nameElement.textContent =
            info.name;


        const formatted =
            formatDisplayTime(next.time);


        if (next.tomorrow) {

            timeElement.textContent =
                `Tomorrow • ${formatted}`;

        } else {

            timeElement.textContent =
                formatted;
        }


        /*
         * Also update homepage-style next prayer
         * if the element exists.
         */
        const homepageNext =
            document.getElementById(
                "next-prayer"
            );

        if (homepageNext) {

            homepageNext.textContent =
                `${info.name} • ${formatted}`;
        }
    }


    /* =====================================================
       NOTIFICATION PERMISSION
    ===================================================== */

    async function requestNotificationPermission() {

        const status =
            document.getElementById(
                "notification-status"
            );

        const button =
            document.getElementById(
                "notification-permission-button"
            );


        if (
            !("Notification" in window)
        ) {

            if (status) {

                status.textContent =
                    "Notifications are not supported on this browser.";
            }

            return;
        }


        try {

            const permission =
                await Notification.requestPermission();


            updatePermissionUI(
                permission
            );


            if (permission === "granted") {

                settings.notificationsEnabled =
                    true;

                saveSettings();

                /*
                 * Send current schedule to native layer.
                 */
                sendToNativeScheduler();
            }

        } catch (error) {

            console.error(
                "IQRANIX notification permission error:",
                error
            );

            if (status) {

                status.textContent =
                    "Unable to request notification permission.";
            }
        }
    }


    /* =====================================================
       PERMISSION UI
    ===================================================== */

    function updatePermissionUI(permission) {

        const status =
            document.getElementById(
                "notification-status"
            );

        const button =
            document.getElementById(
                "notification-permission-button"
            );


        if (!status) {
            return;
        }


        if (permission === "granted") {

            status.textContent =
                "Notifications are allowed on this device.";

            if (button) {
                button.textContent =
                    "Allowed";
                button.disabled = true;
            }

        } else if (permission === "denied") {

            status.textContent =
                "Notifications are blocked. Enable them in device settings.";

            if (button) {
                button.textContent =
                    "Enable";
                button.disabled = false;
            }

        } else {

            status.textContent =
                "Notifications have not been enabled yet.";

            if (button) {
                button.textContent =
                    "Allow";
                button.disabled = false;
            }
        }
    }


    /* =====================================================
       MASTER TOGGLE
    ===================================================== */

    function setupMasterToggles() {

        const notificationToggle =
            document.getElementById(
                "prayer-notifications-toggle"
            );


        const adhanToggle =
            document.getElementById(
                "adhan-toggle"
            );


        if (notificationToggle) {

            notificationToggle.checked =
                settings.notificationsEnabled;


            notificationToggle.addEventListener(
                "change",
                () => {

                    settings.notificationsEnabled =
                        notificationToggle.checked;

                    saveSettings();

                    updateNextPrayer();
                }
            );
        }


        if (adhanToggle) {

            adhanToggle.checked =
                settings.adhanEnabled;


            adhanToggle.addEventListener(
                "change",
                () => {

                    settings.adhanEnabled =
                        adhanToggle.checked;

                    saveSettings();
                }
            );
        }
    }


    /* =====================================================
       ADHAN SELECTOR
    ===================================================== */

    function setupAdhanSelector() {

        const select =
            document.getElementById(
                "adhan-select"
            );


        if (!select) {
            return;
        }


        select.value =
            settings.adhan;


        select.addEventListener(
            "change",
            () => {

                settings.adhan =
                    select.value;

                saveSettings();
            }
        );
    }


    /* =====================================================
       PRAYER TOGGLES
    ===================================================== */

    function setupPrayerToggles() {

        const toggles =
            document.querySelectorAll(
                ".prayer-toggle"
            );


        toggles.forEach(
            toggle => {

                const prayer =
                    toggle.dataset.prayer;


                if (!prayer) {
                    return;
                }


                toggle.checked =
                    settings.prayers[prayer] !== false;


                toggle.addEventListener(
                    "change",
                    () => {

                        settings.prayers[prayer] =
                            toggle.checked;

                        saveSettings();

                        updateNextPrayer();
                    }
                );
            }
        );
    }


    /* =====================================================
       PREVIEW ADHAN
    ===================================================== */

    function previewAdhan() {

        /*
         * Put your actual audio files in the root later.
         *
         * Example:
         *
         * adhan-default.mp3
         * adhan-madinah.mp3
         * adhan-makkah.mp3
         * adhan-al-aqsa.mp3
         * adhan-abdulbasit.mp3
         * adhan-fajr.mp3
         */

        const audioFiles = {

            default:
                "adhan-default.mp3",

            madinah:
                "adhan-madinah.mp3",

            makkah:
                "adhan-makkah.mp3",

            "al-aqsa":
                "adhan-al-aqsa.mp3",

            abdulbasit:
                "adhan-abdulbasit.mp3",

            fajr:
                "adhan-fajr.mp3"
        };


        const file =
            audioFiles[settings.adhan];


        if (!file) {
            return;
        }


        try {

            if (previewAudio) {

                previewAudio.pause();

                previewAudio.currentTime = 0;
            }


            previewAudio =
                new Audio(file);


            previewAudio.preload =
                "auto";


            previewAudio.play()
                .catch(error => {

                    console.warn(
                        "IQRANIX: Adhan preview could not start.",
                        error
                    );

                    alert(
                        "The selected Adhan audio file could not be played. Make sure the audio file exists in your IQRANIX folder."
                    );
                });

        } catch (error) {

            console.error(
                "IQRANIX Adhan preview error:",
                error
            );
        }
    }


    /* =====================================================
       NATIVE SCHEDULER BRIDGE
    =====================================================

       This is intentionally separated from the website
       notification system.

       When IQRANIX is packaged as an Android app, the
       native Android layer can expose:

           window.IqranixNativeScheduler.schedulePrayer()

       The website will automatically send the schedule
       and settings to it.

       The native Android scheduler can then use
       AlarmManager / exact alarms / foreground handling
       according to Android's current rules.
    ===================================================== */

    function sendToNativeScheduler() {

        loadPrayerSchedule();


        const payload = {

            type:
                "IQRANIX_PRAYER_SCHEDULE",

            generatedAt:
                new Date().toISOString(),

            settings:
                settings,

            prayerTimes: {

                fajr:
                    getPrayerTime("fajr"),

                dhuhr:
                    getPrayerTime("dhuhr"),

                asr:
                    getPrayerTime("asr"),

                maghrib:
                    getPrayerTime("maghrib"),

                isha:
                    getPrayerTime("isha")
            }
        };


        /*
         * Native Android bridge.
         */
        if (
            window.IqranixNativeScheduler &&
            typeof
            window.IqranixNativeScheduler
                .schedulePrayerNotifications ===
                "function"
        ) {

            try {

                window.IqranixNativeScheduler
                    .schedulePrayerNotifications(
                        payload
                    );

                console.log(
                    "IQRANIX: Schedule sent to native scheduler."
                );

            } catch (error) {

                console.error(
                    "IQRANIX native scheduler error:",
                    error
                );
            }
        }


        /*
         * Generic WebView bridge.
         *
         * Useful for Android WebView wrappers.
         */
        if (
            window.Android &&
            typeof window.Android
                .schedulePrayerNotifications ===
                "function"
        ) {

            try {

                window.Android
                    .schedulePrayerNotifications(
                        JSON.stringify(payload)
                    );

            } catch (error) {

                console.error(
                    "IQRANIX Android bridge error:",
                    error
                );
            }
        }


        /*
         * Always expose the payload so the native
         * integration can retrieve it.
         */
        window.iqranixNativePrayerSchedule =
            payload;


        /*
         * Dispatch an event for a native wrapper
         * listening through JavaScript.
         */
        window.dispatchEvent(
            new CustomEvent(
                "iqranixNativePrayerScheduleReady",
                {
                    detail: payload
                }
            )
        );
    }


    /* =====================================================
       WEB NOTIFICATION TEST
    ===================================================== */

    function sendTestNotification() {

        if (
            !("Notification" in window)
        ) {
            return;
        }


        if (
            Notification.permission !==
            "granted"
        ) {
            return;
        }


        try {

            new Notification(
                "IQRANIX Prayer Reminder",
                {
                    body:
                        "It is time to remember Allah and prepare for Salah.",
                    icon:
                        "logo.png",
                    badge:
                        "logo.png"
                }
            );

        } catch (error) {

            console.warn(
                "IQRANIX test notification failed:",
                error
            );
        }
    }


    /* =====================================================
       LISTEN FOR PRAYER.JS UPDATES
    ===================================================== */

    function listenForPrayerUpdates() {

        window.addEventListener(
            "iqranixPrayerScheduleUpdated",
            event => {

                if (
                    event.detail &&
                    typeof event.detail === "object"
                ) {

                    window.iqranixPrayerSchedule =
                        event.detail;

                    prayerSchedule =
                        event.detail;
                }


                updateNextPrayer();

                sendToNativeScheduler();
            }
        );


        /*
         * Also listen for storage changes.
         *
         * This is useful if prayer.js updates
         * localStorage in another tab/window.
         */
        window.addEventListener(
            "storage",
            event => {

                if (
                    event.key ===
                    PRAYER_SCHEDULE_KEY
                ) {

                    loadPrayerSchedule();

                    updateNextPrayer();

                    sendToNativeScheduler();
                }
            }
        );
    }


    /* =====================================================
       SAVE BUTTON
    ===================================================== */

    function setupSaveButton() {

        const button =
            document.getElementById(
                "save-notification-settings"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {

                saveSettings();

                button.innerHTML =
                    '<i class="fa-solid fa-check"></i> Settings Saved';


                setTimeout(
                    () => {

                        button.innerHTML =
                            '<i class="fa-solid fa-check"></i> Save Notification Settings';

                    },
                    1800
                );
            }
        );
    }


    /* =====================================================
       INITIAL PERMISSION STATE
    ===================================================== */

    function initializePermission() {

        if (
            !("Notification" in window)
        ) {

            updatePermissionUI(
                "unsupported"
            );

            return;
        }


        updatePermissionUI(
            Notification.permission
        );
    }


    /* =====================================================
       AUTO UPDATE CLOCK
    ===================================================== */

    function startPrayerRefresh() {

        /*
         * Recalculate next prayer every minute.
         */
        setInterval(
            () => {

                updateNextPrayer();

            },
            60 * 1000
        );
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        console.log(
            "IQRANIX Notifications initializing..."
        );


        loadPrayerSchedule();


        setupMasterToggles();

        setupAdhanSelector();

        setupPrayerToggles();

        setupSaveButton();

        initializePermission();

        listenForPrayerUpdates();

        updateNextPrayer();

        sendToNativeScheduler();

        startPrayerRefresh();


        /*
         * Permission button.
         */
        const permissionButton =
            document.getElementById(
                "notification-permission-button"
            );


        if (permissionButton) {

            permissionButton.addEventListener(
                "click",
                requestNotificationPermission
            );
        }


        /*
         * Adhan preview.
         */
        const previewButton =
            document.getElementById(
                "preview-adhan"
            );


        if (previewButton) {

            previewButton.addEventListener(
                "click",
                previewAdhan
            );
        }


        console.log(
            "IQRANIX Notifications ready."
        );
    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.IqranixNotifications = {

        getSettings() {
            return settings;
        },

        getPrayerSchedule() {
            return prayerSchedule;
        },

        getNextPrayer,

        updateNextPrayer,

        requestPermission:
            requestNotificationPermission,

        sendToNativeScheduler,

        sendTestNotification,

        reloadPrayerSchedule() {

            loadPrayerSchedule();

            updateNextPrayer();

            sendToNativeScheduler();
        }
    };

})();