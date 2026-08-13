"use strict";

/*
========================================================
 IQRANIX RINGTONES
========================================================
 Audio files:
 https://raw.githubusercontent.com/iqranixapp-cyber/Iqranix.data/main/audio1.mp3
 https://raw.githubusercontent.com/iqranixapp-cyber/Iqranix.data/main/audio2.mp3
 ...
 https://raw.githubusercontent.com/iqranixapp-cyber/Iqranix.data/main/audio30.mp3
========================================================
*/

const RINGTONE_STORAGE_KEY = "iqranixSelectedRingtone";
const TOTAL_RINGTONES = 30;

const AUDIO_BASE_URL =
    "https://raw.githubusercontent.com/iqranixapp-cyber/Iqranix.data/main/";

let currentAudio = null;
let currentPlayingButton = null;


/* ======================================================
   START
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    createRingtoneCards();

    loadSelectedRingtone();

});


/* ======================================================
   AUDIO URL
====================================================== */

function getAudioPath(number) {

    return `${AUDIO_BASE_URL}audio${number}.mp3`;

}


/* ======================================================
   CREATE RINGTONES
====================================================== */

function createRingtoneCards() {

    const container =
        document.getElementById("ringtonesList");

    if (!container) {

        console.error(
            "Iqranix: #ringtonesList was not found."
        );

        return;

    }

    container.innerHTML = "";

    for (
        let number = 1;
        number <= TOTAL_RINGTONES;
        number++
    ) {

        const card =
            document.createElement("div");

        card.className = "ringtone-card";

        card.dataset.ringtone = number;

        card.innerHTML = `

            <div class="ringtone-number">
                ${number}
            </div>

            <div class="ringtone-info">

                <h3>
                    Ringtone ${number}
                </h3>

                <p>
                    Iqranix notification sound
                </p>

            </div>

            <div class="ringtone-actions">

                <button
                    class="play-button"
                    type="button"
                    aria-label="Preview Ringtone ${number}"
                >
                    <i class="fas fa-play"></i>
                </button>

                <button
                    class="download-button"
                    type="button"
                    aria-label="Download Ringtone ${number}"
                >
                    <i class="fas fa-download"></i>
                </button>

                <button
                    class="select-button"
                    type="button"
                >
                    Select
                </button>

            </div>
        `;


        const playButton =
            card.querySelector(".play-button");

        const downloadButton =
            card.querySelector(".download-button");

        const selectButton =
            card.querySelector(".select-button");


        /* Preview */

        playButton.addEventListener(
            "click",
            () => {

                togglePreview(
                    number,
                    playButton
                );

            }
        );


        /* Download */

        downloadButton.addEventListener(
            "click",
            () => {

                downloadRingtone(number);

            }
        );


        /* Select */

        selectButton.addEventListener(
            "click",
            () => {

                selectRingtone(number);

            }
        );


        container.appendChild(card);

    }

}


/* ======================================================
   PREVIEW RINGTONE
====================================================== */

function togglePreview(
    number,
    button
) {

    const audioURL =
        getAudioPath(number);


    /*
       If this same ringtone is already playing,
       stop it.
    */

    if (
        currentAudio &&
        currentPlayingButton === button
    ) {

        stopPreview();

        return;

    }


    /*
       Stop any other ringtone.
    */

    stopPreview();


    /*
       Create new audio.
    */

    currentAudio =
        new Audio();


    currentAudio.preload = "auto";

    currentAudio.src = audioURL;


    currentPlayingButton = button;


    const icon =
        button.querySelector("i");


    if (icon) {

        icon.className =
            "fas fa-stop";

    }


    /*
       When audio finishes.
    */

    currentAudio.addEventListener(
        "ended",
        () => {

            stopPreview();

        }
    );


    /*
       Audio error.
    */

    currentAudio.addEventListener(
        "error",
        () => {

            console.error(
                "Iqranix ringtone error:",
                audioURL
            );

            stopPreview();

            alert(
                `Could not play Ringtone ${number}.`
            );

        }
    );


    /*
       Play.
    */

    currentAudio
        .play()
        .catch(error => {

            console.error(
                "Iqranix audio playback error:",
                error
            );

            stopPreview();

            alert(
                `Could not play Ringtone ${number}.`
            );

        });

}


/* ======================================================
   STOP PREVIEW
====================================================== */

function stopPreview() {

    if (currentAudio) {

        try {

            currentAudio.pause();

            currentAudio.currentTime = 0;

            currentAudio.removeAttribute("src");

            currentAudio.load();

        } catch (error) {

            console.warn(
                "Iqranix: Could not completely stop audio.",
                error
            );

        }

    }


    if (currentPlayingButton) {

        const icon =
            currentPlayingButton.querySelector("i");

        if (icon) {

            icon.className =
                "fas fa-play";

        }

    }


    currentAudio = null;

    currentPlayingButton = null;

}


/* ======================================================
   DOWNLOAD
====================================================== */

function downloadRingtone(number) {

    const audioURL =
        getAudioPath(number);


    const link =
        document.createElement("a");


    link.href =
        audioURL;


    link.download =
        `Iqranix-Ringtone-${number}.mp3`;


    link.target =
        "_blank";


    link.rel =
        "noopener";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


/* ======================================================
   SELECT RINGTONE
====================================================== */

function selectRingtone(number) {

    if (
        number < 1 ||
        number > TOTAL_RINGTONES
    ) {

        return;

    }


    localStorage.setItem(
        RINGTONE_STORAGE_KEY,
        String(number)
    );


    updateSelectedUI(number);


    showSelectedRingtone(
        `Ringtone ${number}`
    );


    stopPreview();


    /*
       Small confirmation.
    */

    console.log(
        `Iqranix: Ringtone ${number} selected.`
    );

}


/* ======================================================
   UPDATE SELECTED UI
====================================================== */

function updateSelectedUI(number) {

    const cards =
        document.querySelectorAll(
            ".ringtone-card"
        );


    cards.forEach(card => {

        const cardNumber =
            Number(
                card.dataset.ringtone
            );


        const selectButton =
            card.querySelector(
                ".select-button"
            );


        if (!selectButton) {

            return;

        }


        if (cardNumber === number) {

            card.classList.add(
                "selected"
            );


            selectButton.textContent =
                "Selected";


            selectButton.classList.add(
                "selected-button"
            );

        } else {

            card.classList.remove(
                "selected"
            );


            selectButton.textContent =
                "Select";


            selectButton.classList.remove(
                "selected-button"
            );

        }

    });

}


/* ======================================================
   SHOW CURRENT RINGTONE
====================================================== */

function showSelectedRingtone(name) {

    const element =
        document.getElementById(
            "selectedRingtone"
        );


    if (!element) {

        return;

    }


    element.textContent =
        name;

}


/* ======================================================
   LOAD SAVED RINGTONE
====================================================== */

function loadSelectedRingtone() {

    const saved =
        localStorage.getItem(
            RINGTONE_STORAGE_KEY
        );


    let number =
        saved
            ? Number(saved)
            : 1;


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_RINGTONES
    ) {

        number = 1;

    }


    updateSelectedUI(number);


    showSelectedRingtone(
        `Ringtone ${number}`
    );

}


/* ======================================================
   GET SELECTED RINGTONE URL
====================================================== */

function getSelectedRingtone() {

    const saved =
        localStorage.getItem(
            RINGTONE_STORAGE_KEY
        );


    let number =
        saved
            ? Number(saved)
            : 1;


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_RINGTONES
    ) {

        number = 1;

    }


    return getAudioPath(number);

}


/* ======================================================
   GET SELECTED RINGTONE NUMBER
====================================================== */

function getSelectedRingtoneNumber() {

    const saved =
        localStorage.getItem(
            RINGTONE_STORAGE_KEY
        );


    let number =
        saved
            ? Number(saved)
            : 1;


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_RINGTONES
    ) {

        number = 1;

    }


    return number;

}


/* ======================================================
   GLOBAL IQRANIX API
====================================================== */

window.IqranixRingtones = {

    getSelected:
        getSelectedRingtone,

    getSelectedNumber:
        getSelectedRingtoneNumber,

    getURL:
        getSelectedRingtone,

    select:
        selectRingtone,

    preview:
        togglePreview,

    stop:
        stopPreview,

    download:
        downloadRingtone

};
