"use strict";

const RINGTONE_STORAGE_KEY = "iqranixSelectedRingtone";
const TOTAL_RINGTONES = 30;

let currentAudio = null;
let currentPlayingButton = null;

document.addEventListener("DOMContentLoaded", initializeRingtones);

function initializeRingtones() {
    createRingtoneCards();
    loadSelectedRingtone();
}

/* =========================================
   CREATE RINGTONES
========================================= */

function createRingtoneCards() {

    const container = document.getElementById("ringtonesList");

    if (!container) return;

    container.innerHTML = "";

    for (let number = 1; number <= TOTAL_RINGTONES; number++) {

        const audioFile = getAudioPath(number);

        const card = document.createElement("div");

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

        playButton.addEventListener("click", () => {

            togglePreview(
                number,
                playButton
            );

        });

        downloadButton.addEventListener("click", () => {

            downloadRingtone(
                number
            );

        });

        selectButton.addEventListener("click", () => {

            selectRingtone(number);

        });

        container.appendChild(card);
    }
}


/* =========================================
   AUDIO PATH
========================================= */

function getAudioPath(number) {

    return `audio${number}.mp3`;

}


/* =========================================
   PREVIEW
========================================= */

function togglePreview(number, button) {

    const audioPath = getAudioPath(number);

    if (
        currentAudio &&
        currentPlayingButton === button
    ) {

        stopPreview();
        return;

    }

    stopPreview();

    currentAudio = new Audio(audioPath);
    currentPlayingButton = button;

    const icon = button.querySelector("i");

    icon.className = "fas fa-stop";

    currentAudio.addEventListener(
        "ended",
        stopPreview
    );

    currentAudio.addEventListener(
        "error",
        () => {

            stopPreview();

            alert(
                `Could not play ${audioPath}. Make sure the audio file is uploaded.`
            );

        }
    );

    currentAudio
        .play()
        .catch(error => {

            console.error(
                "Audio playback error:",
                error
            );

            stopPreview();

            alert(
                "The ringtone could not be played."
            );

        });
}


/* =========================================
   STOP PREVIEW
========================================= */

function stopPreview() {

    if (currentAudio) {

        currentAudio.pause();
        currentAudio.currentTime = 0;

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


/* =========================================
   DOWNLOAD RINGTONE
========================================= */

function downloadRingtone(number) {

    const audioFile =
        getAudioPath(number);

    const downloadLink =
        document.createElement("a");

    downloadLink.href =
        audioFile;

    downloadLink.download =
        `Iqranix-Ringtone-${number}.mp3`;

    downloadLink.rel =
        "noopener";

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
        downloadLink
    );

}


/* =========================================
   SELECT RINGTONE
========================================= */

function selectRingtone(number) {

    localStorage.setItem(
        RINGTONE_STORAGE_KEY,
        String(number)
    );

    updateSelectedUI(number);

    showSelectedRingtone(
        `Ringtone ${number}`
    );

    stopPreview();
}


/* =========================================
   UPDATE SELECTED UI
========================================= */

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


/* =========================================
   SELECTED RINGTONE DISPLAY
========================================= */

function showSelectedRingtone(name) {

    const element =
        document.getElementById(
            "selectedRingtone"
        );

    if (!element) return;

    element.textContent = name;

}


/* =========================================
   LOAD SAVED RINGTONE
========================================= */

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


/* =========================================
   PUBLIC RINGTONE FUNCTION
========================================= */

function getSelectedRingtone() {

    const saved =
        localStorage.getItem(
            RINGTONE_STORAGE_KEY
        );

    const number =
        saved
            ? Number(saved)
            : 1;

    return getAudioPath(number);

}


/* =========================================
   GLOBAL ACCESS
========================================= */

window.IqranixRingtones = {

    getSelected:
        getSelectedRingtone,

    select:
        selectRingtone,

    preview:
        togglePreview,

    download:
        downloadRingtone

};