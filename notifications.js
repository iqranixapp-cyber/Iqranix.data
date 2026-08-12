/*
========================================
        IQRANIX NOTIFICATIONS.JS
========================================

Web notification engine.

Handles:
• Notification settings
• Prayer notifications
• Before-prayer reminders
• Selected Adhan
• Adhan preview
• Saving Adhan preferences
• Daily Quran reminder
• Daily Hadith reminder
• Daily Dua reminder
• Morning Adhkar
• Evening Adhkar
• Jumu'ah reminder
• Duplicate prevention

IMPORTANT:
This is the WEB notification layer.

Later, after generating the Android project,
the native Android scheduler will provide
reliable background notifications and Adhan
when the app is closed.
========================================
*/

"use strict";


/*========================================
  STORAGE
========================================*/

const SETTINGS_KEY =
    "iqranixNotifications";

const HISTORY_KEY =
    "iqranixNotificationHistory";


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
  DEFAULT SETTINGS
========================================*/

function getDefaultSettings() {

    return {

        notificationsToggle: false,

        dndToggle: false,

        prayerNotifications: false,

        beforePrayerReminder: false,

        reminderTime: "10",

        fajrAdhan: "fajr.mp3",

        dhuhrAdhan: "makkah.mp3",

        asrAdhan: "madinah.mp3",

        maghribAdhan: "alaqsa.mp3",

        ishaAdhan: "egypt.mp3",

        dailyQuran: false,

        dailyHadith: false,

        dailyDua: false,

        morningAdhkar: false,

        eveningAdhkar: false,

        jumuahReminder: false,

        ramadanReminder: false,

        lastTenNights: false,

        eidReminder: false

    };

}


/*========================================
  PAGE START
========================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSettings();

        setupSaveButton();

        setupAdhanSaveButton();

        setupPreviewButtons();

        requestNotificationPermission();

        startNotificationEngine();

        console.log(
            "Iqranix notification engine started."
        );

    }
);


/*========================================
  READ SETTINGS
========================================*/

function getNotificationSettings() {

    const saved =
        localStorage.getItem(
            SETTINGS_KEY
        );

    const defaults =
        getDefaultSettings();

    if (!saved) {

        return defaults;

    }

    try {

        return Object.assign(
            defaults,
            JSON.parse(saved)
        );

    } catch (error) {

        console.error(
            "Could not read notification settings:",
            error
        );

        return defaults;

    }

}


/*========================================
  SAVE SETTINGS
========================================*/

function saveSettings(settings) {

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(settings)

    );

}


/*========================================
  GET CHECKBOX
========================================*/

function getChecked(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.checked
        : false;

}


/*========================================
  GET VALUE
========================================*/

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


/*========================================
  SET CHECKBOX
========================================*/

function setChecked(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.checked =
            Boolean(value);

    }

}


/*========================================
  SET VALUE
========================================*/

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (
        element &&
        value !== undefined &&
        value !== null
    ) {

        element.value =
            String(value);

    }

}


/*========================================
  LOAD SETTINGS INTO UI
========================================*/

function loadSettings() {

    const settings =
        getNotificationSettings();


    setChecked(
        "notificationsToggle",
        settings.notificationsToggle
    );

    setChecked(
        "dndToggle",
        settings.dndToggle
    );

    setChecked(
        "prayerNotifications",
        settings.prayerNotifications
    );

    setChecked(
        "beforePrayerReminder",
        settings.beforePrayerReminder
    );


    setValue(
        "reminderTime",
        settings.reminderTime
    );


    setValue(
        "fajrAdhan",
        settings.fajrAdhan
    );

    setValue(
        "dhuhrAdhan",
        settings.dhuhrAdhan
    );

    setValue(
        "asrAdhan",
        settings.asrAdhan
    );

    setValue(
        "maghribAdhan",
        settings.maghribAdhan
    );

    setValue(
        "ishaAdhan",
        settings.ishaAdhan
    );


    setChecked(
        "dailyQuran",
        settings.dailyQuran
    );

    setChecked(
        "dailyHadith",
        settings.dailyHadith
    );

    setChecked(
        "dailyDua",
        settings.dailyDua
    );

    setChecked(
        "morningAdhkar",
        settings.morningAdhkar
    );

    setChecked(
        "eveningAdhkar",
        settings.eveningAdhkar
    );


    setChecked(
        "jumuahReminder",
        settings.jumuahReminder
    );

    setChecked(
        "ramadanReminder",
        settings.ramadanReminder
    );

    setChecked(
        "lastTenNights",
        settings.lastTenNights
    );

    setChecked(
        "eidReminder",
        settings.eidReminder
    );

}


/*========================================
  SAVE ALL SETTINGS BUTTON
========================================*/

function setupSaveButton() {

    const button =
        document.getElementById(
            "saveNotifications"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        async () => {

            const settings =
                collectSettings();

            saveSettings(settings);


            if (
                settings.notificationsToggle
            ) {

                await requestNotificationPermission();

            }


            showSavedMessage(
                button,
                "✓ All Settings Saved"
            );


            startNotificationEngine();

        }
    );

}


/*========================================
  COLLECT SETTINGS
========================================*/

function collectSettings() {

    return {

        notificationsToggle:
            getChecked(
                "notificationsToggle"
            ),

        dndToggle:
            getChecked(
                "dndToggle"
            ),

        prayerNotifications:
            getChecked(
                "prayerNotifications"
            ),

        beforePrayerReminder:
            getChecked(
                "beforePrayerReminder"
            ),

        reminderTime:
            getValue(
                "reminderTime"
            ),


        fajrAdhan:
            getValue(
                "fajrAdhan"
            ),

        dhuhrAdhan:
            getValue(
                "dhuhrAdhan"
            ),

        asrAdhan:
            getValue(
                "asrAdhan"
            ),

        maghribAdhan:
            getValue(
                "maghribAdhan"
            ),

        ishaAdhan:
            getValue(
                "ishaAdhan"
            ),


        dailyQuran:
            getChecked(
                "dailyQuran"
            ),

        dailyHadith:
            getChecked(
                "dailyHadith"
            ),

        dailyDua:
            getChecked(
                "dailyDua"
            ),

        morningAdhkar:
            getChecked(
                "morningAdhkar"
            ),

        eveningAdhkar:
            getChecked(
                "eveningAdhkar"
            ),


        jumuahReminder:
            getChecked(
                "jumuahReminder"
            ),

        ramadanReminder:
            getChecked(
                "ramadanReminder"
            ),

        lastTenNights:
            getChecked(
                "lastTenNights"
            ),

        eidReminder:
            getChecked(
                "eidReminder"
            )

    };

}


/*========================================
  SAVE ADHAN BUTTON
========================================*/

function setupAdhanSaveButton() {

    const button =
        document.getElementById(
            "saveAdhanSettings"
        );

    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const settings =
                getNotificationSettings();


            settings.fajrAdhan =
                getValue(
                    "fajrAdhan"
                );

            settings.dhuhrAdhan =
                getValue(
                    "dhuhrAdhan"
                );

            settings.asrAdhan =
                getValue(
                    "asrAdhan"
                );

            settings.maghribAdhan =
                getValue(
                    "maghribAdhan"
                );

            settings.ishaAdhan =
                getValue(
                    "ishaAdhan"
                );


            saveSettings(
                settings
            );


            showSavedMessage(
                button,
                "✓ Adhan Preferences Saved"
            );

        }
    );

}


/*========================================
  PREVIEW BUTTONS
========================================*/

function setupPreviewButtons() {

    const buttons =
        document.querySelectorAll(
            ".preview-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const row =
                        button.closest(
                            ".adhan-row"
                        );

                    if (!row) return;


                    const select =
                        row.querySelector(
                            ".adhan-select"
                        );

                    if (!select) return;


                    const file =
                        select.value;


                    if (!file) {

                        alert(
                            "Please select an Adhan first."
                        );

                        return;

                    }


                    playAdhan(
                        file
                    );

                }
            );

        }
    );

}


/*========================================
  ADHAN PLAYBACK
========================================*/

let currentAdhanAudio = null;


function playAdhan(file) {

    if (!file) return;


    try {

        if (
            currentAdhanAudio
        ) {

            currentAdhanAudio.pause();

            currentAdhanAudio.currentTime =
                0;

        }


        currentAdhanAudio =
            new Audio(file);


        currentAdhanAudio.preload =
            "auto";


        currentAdhanAudio.volume =
            1;


        currentAdhanAudio.play()

            .then(() => {

                console.log(
                    "Playing Adhan:",
                    file
                );

            })

            .catch(
                error => {

                    console.warn(
                        "Audio playback was blocked:",
                        error
                    );

                    alert(
                        "The browser blocked automatic audio playback. Tap the Preview button again to play the Adhan."
                    );

                }
            );

    } catch (error) {

        console.error(
            "Adhan playback error:",
            error
        );

    }

}


/*========================================
  NOTIFICATION PERMISSION
========================================*/

async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        console.warn(
            "Notifications are not supported."
        );

        return false;

    }


    if (
        Notification.permission ===
        "granted"
    ) {

        return true;

    }


    if (
        Notification.permission ===
        "denied"
    ) {

        console.warn(
            "Notification permission was denied."
        );

        return false;

    }


    try {

        const permission =
            await Notification.requestPermission();

        return (
            permission ===
            "granted"
        );

    } catch (error) {

        console.error(
            "Notification permission error:",
            error
        );

        return false;

    }

}


/*========================================
  NOTIFICATIONS ALLOWED?
========================================*/

function notificationsAllowed() {

    const settings =
        getNotificationSettings();


    if (
        !settings.notificationsToggle
    ) {

        return false;

    }


    if (
        settings.dndToggle
    ) {

        return false;

    }


    if (
        !("Notification" in window)
    ) {

        return false;

    }


    if (
        Notification.permission !==
        "granted"
    ) {

        return false;

    }


    return true;

}


/*========================================
  NOTIFICATION ENGINE
========================================*/

let notificationEngineTimer =
    null;


function startNotificationEngine() {

    if (
        notificationEngineTimer
    ) {

        clearInterval(
            notificationEngineTimer
        );

    }


    checkAllNotifications();


    /*
    Check every 20 seconds.
    */

    notificationEngineTimer =
        setInterval(
            checkAllNotifications,
            20000
        );

}


/*========================================
  CHECK EVERYTHING
========================================*/

function checkAllNotifications() {

    if (
        !notificationsAllowed()
    ) {

        return;

    }


    checkPrayerNotifications();

    checkDailyReminders();

    checkJumuahReminder();

}


/*========================================
  PRAYER NOTIFICATIONS
========================================*/

function checkPrayerNotifications() {

    const settings =
        getNotificationSettings();


    if (
        !settings.prayerNotifications &&
        !settings.beforePrayerReminder
    ) {

        return;

    }


    /*
    prayer.js must publish:

    window.iqranixPrayerTimes
    */

    const times =
        window.iqranixPrayerTimes;


    if (!times) {

        return;

    }


    checkPrayer(
        "Fajr",
        times.Fajr,
        settings.fajrAdhan,
        settings
    );

    checkPrayer(
        "Dhuhr",
        times.Dhuhr,
        settings.dhuhrAdhan,
        settings
    );

    checkPrayer(
        "Asr",
        times.Asr,
        settings.asrAdhan,
        settings
    );

    checkPrayer(
        "Maghrib",
        times.Maghrib,
        settings.maghribAdhan,
        settings
    );

    checkPrayer(
        "Isha",
        times.Isha,
        settings.ishaAdhan,
        settings
    );

}


/*========================================
  CHECK ONE PRAYER
========================================*/

function checkPrayer(
    prayerName,
    prayerTime,
    adhanFile,
    settings
) {

    if (!prayerTime) return;


    const clock =
        normalizePrayerTime(
            prayerTime
        );


    if (!clock) return;


    const prayerDate =
        createTodayTime(
            clock
        );


    const now =
        new Date();


    /*
    ----------------------------------------
    BEFORE PRAYER
    ----------------------------------------
    */

    if (
        settings.beforePrayerReminder
    ) {

        const minutes =
            Number(
                settings.reminderTime
            ) || 10;


        const reminderDate =
            new Date(
                prayerDate.getTime()
                -
                minutes * 60000
            );


        if (
            now >= reminderDate &&
            now < prayerDate
        ) {

            const key =
                `before-${getTodayKey()}-${prayerName}-${clock}-${minutes}`;


            if (
                !wasAlreadySent(key)
            ) {

                sendNotification(

                    `${prayerName} Soon`,

                    `${prayerName} prayer is in approximately ${minutes} minutes.`

                );


                markAsSent(
                    key
                );

            }

        }

    }


    /*
    ----------------------------------------
    AT PRAYER TIME
    ----------------------------------------
    */

    if (
        settings.prayerNotifications
    ) {

        const current =
            getCurrentTime();


        if (
            current === clock
        ) {

            const key =
                `prayer-${getTodayKey()}-${prayerName}-${clock}`;


            if (
                !wasAlreadySent(key)
            ) {

                /*
                Play selected Adhan.
                */

                if (
                    adhanFile
                ) {

                    playAdhan(
                        adhanFile
                    );

                }


                sendNotification(

                    `${prayerName} Prayer`,

                    `It is time for ${prayerName} Salah.`

                );


                markAsSent(
                    key
                );

            }

        }

    }

}


/*========================================
  NORMALIZE PRAYER TIME
========================================*/

function normalizePrayerTime(
    prayerTime
) {

    if (!prayerTime) {

        return null;

    }


    /*
    API can return values such as:

    05:21
    05:21 (EAT)
    05:21 +0300

    We only need HH:MM.
    */

    const match =
        String(
            prayerTime
        ).match(
            /^(\d{1,2}):(\d{2})/
        );


    if (!match) {

        return null;

    }


    const hours =
        String(
            Number(
                match[1]
            )
        ).padStart(2, "0");


    const minutes =
        match[2];


    return `${hours}:${minutes}`;

}


/*========================================
  CREATE TODAY TIME
========================================*/

function createTodayTime(
    clock
) {

    const parts =
        clock.split(":");


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
  DAILY REMINDERS
========================================*/

function checkDailyReminders() {

    const settings =
        getNotificationSettings();


    /*
    Daily reminders use a simple
    fixed time for the web layer.

    These can later be moved to the
    Android scheduler.
    */

    const current =
        getCurrentTime();


    if (
        current !== "08:00"
    ) {

        return;

    }


    if (
        settings.dailyQuran
    ) {

        sendOncePerDay(

            "daily-quran",

            "Daily Qur'an",

            "Take a moment to read or listen to the Holy Qur'an."

        );

    }


    if (
        settings.dailyHadith
    ) {

        sendOncePerDay(

            "daily-hadith",

            "Daily Hadith",

            "Take a moment to learn and reflect upon a beneficial Hadith."

        );

    }


    if (
        settings.dailyDua
    ) {

        sendOncePerDay(

            "daily-dua",

            "Daily Du'a",

            "Remember Allah and make your daily Du'a."

        );

    }


    if (
        settings.morningAdhkar
    ) {

        sendOncePerDay(

            "morning-adhkar",

            "Morning Adhkar",

            "Begin your day with the remembrance of Allah."

        );

    }


    /*
    Evening Adhkar at 18:00.
    */

    if (
        current === "18:00" &&
        settings.eveningAdhkar
    ) {

        sendOncePerDay(

            "evening-adhkar",

            "Evening Adhkar",

            "Take some time for your evening remembrance."

        );

    }

}


/*========================================
  JUMU'AH
========================================*/

function checkJumuahReminder() {

    const settings =
        getNotificationSettings();


    if (
        !settings.jumuahReminder
    ) {

        return;

    }


    const now =
        new Date();


    /*
    Friday = 5
    */

    if (
        now.getDay() !== 5
    ) {

        return;

    }


    if (
        getCurrentTime() !== "09:00"
    ) {

        return;

    }


    sendOncePerDay(

        "jumuah",

        "Jumu'ah Mubarak",

        "Remember Allah, send salawat upon the Prophet ﷺ, and prepare for Jumu'ah."

    );

}


/*========================================
  SEND NOTIFICATION
========================================*/

function sendNotification(
    title,
    message
) {

    if (
        !notificationsAllowed()
    ) {

        return;

    }


    try {

        const notification =
            new Notification(

                `IQRANIX • ${title}`,

                {

                    body:
                        message,

                    icon:
                        "logo.png",

                    badge:
                        "logo.png",

                    tag:
                        `iqranix-${title}`

                }

            );


        console.log(
            "Notification sent:",
            title
        );


        return notification;

    } catch (error) {

        console.error(
            "Notification error:",
            error
        );

    }

}


/*========================================
  SEND ONCE PER DAY
========================================*/

function sendOncePerDay(
    type,
    title,
    message
) {

    const key =
        `${type}-${getTodayKey()}`;


    if (
        wasAlreadySent(key)
    ) {

        return;

    }


    sendNotification(
        title,
        message
    );


    markAsSent(
        key
    );

}


/*========================================
  HISTORY
========================================*/

function getHistory() {

    const saved =
        localStorage.getItem(
            HISTORY_KEY
        );


    if (!saved) {

        return {};

    }


    try {

        return JSON.parse(
            saved
        );

    } catch {

        return {};

    }

}


/*========================================
  CHECK HISTORY
========================================*/

function wasAlreadySent(
    key
) {

    const history =
        getHistory();


    return history[key] === true;

}


/*========================================
  MARK SENT
========================================*/

function markAsSent(
    key
) {

    const history =
        getHistory();


    history[key] =
        true;


    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(
            history
        )

    );

}


/*========================================
  CLEAN HISTORY
========================================*/

function cleanNotificationHistory() {

    const history =
        getHistory();


    const today =
        getTodayKey();


    const cleaned =
        {};


    Object.keys(history)
        .forEach(
            key => {

                if (
                    key.includes(today)
                ) {

                    cleaned[key] =
                        true;

                }

            }
        );


    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(
            cleaned
        )

    );

}


/*========================================
  CURRENT TIME
========================================*/

function getCurrentTime() {

    const now =
        new Date();


    return (

        String(
            now.getHours()
        ).padStart(2, "0")

        +

        ":"

        +

        String(
            now.getMinutes()
        ).padStart(2, "0")

    );

}


/*========================================
  TODAY KEY
========================================*/

function getTodayKey() {

    const now =
        new Date();


    return (

        now.getFullYear()

        +

        "-"

        +

        String(
            now.getMonth() + 1
        ).padStart(2, "0")

        +

        "-"

        +

        String(
            now.getDate()
        ).padStart(2, "0")

    );

}


/*========================================
  SAVED MESSAGE
========================================*/

function showSavedMessage(
    button,
    message
) {

    if (!button) return;


    const original =
        button.textContent;


    button.textContent =
        message;


    button.disabled =
        true;


    setTimeout(
        () => {

            button.textContent =
                original;

            button.disabled =
                false;

        },
        1800
    );

}


/*========================================
  START ENGINE
========================================*/

cleanNotificationHistory();

startNotificationEngine();


/*========================================
  PUBLIC API
========================================

Useful later for the Android bridge.
========================================*/

window.IqranixNotifications = {

    getSettings:
        getNotificationSettings,

    saveSettings:
        saveSettings,

    playAdhan:
        playAdhan,

    check:
        checkAllNotifications

};


console.log(
    "IQRANIX Notifications Engine Ready."
);