"use strict";

/*
=========================================================
IQRANIX — TASBIH COUNTER
Advanced Voice Counting
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const countDisplay =
        document.getElementById("countDisplay");

    const targetDisplay =
        document.getElementById("targetDisplay");

    const tapButton =
        document.getElementById("tapButton");

    const resetButton =
        document.getElementById("resetButton");

    const microphoneButton =
        document.getElementById("microphoneButton");

    const targetInput =
        document.getElementById("targetInput");

    const dhikrSelect =
        document.getElementById("dhikrSelect");

    const progressBar =
        document.getElementById("progressBar");

    const statusText =
        document.getElementById("statusText");

    const currentDhikr =
        document.getElementById("currentDhikr");

    const backButton =
        document.getElementById("backButton");

    const toast =
        document.getElementById("toast");


    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const COUNT_KEY =
        "iqranix-tasbih-count";

    const TARGET_KEY =
        "iqranix-tasbih-target";

    const DHIKR_KEY =
        "iqranix-tasbih-dhikr";


    /* =====================================================
       STATE
    ===================================================== */

    let count =
        parseInt(
            localStorage.getItem(COUNT_KEY),
            10
        ) || 0;

    let target =
        parseInt(
            localStorage.getItem(TARGET_KEY),
            10
        ) || 33;

    let listening = false;

    let recognition = null;

    let manuallyStopped = false;

    let restartTimer = null;


    /* =====================================================
       DHIKR DICTIONARY
    ===================================================== */

    const dhikrDictionary = {

        "subhanallah": [
            "subhanallah",
            "subhan allah",
            "subhan Allah",
            "سبحان الله"
        ],

        "alhamdulillah": [
            "alhamdulillah",
            "alhamdu lillah",
            "al hamdulillah",
            "al hamdu lillah",
            "الحمد لله"
        ],

        "allahu-akbar": [
            "allahu akbar",
            "allah akbar",
            "allahuakbar",
            "الله أكبر"
        ],

        "astaghfirullah": [
            "astaghfirullah",
            "astaghfir allah",
            "astagfirullah",
            "astagfir allah",
            "أستغفر الله"
        ],

        "la-ilaha-illallah": [
            "la ilaha illallah",
            "la ilaha illa allah",
            "la ilaha illallah",
            "there is no god but Allah",
            "لا إله إلا الله"
        ],

        "salawat": [
            "salawat",
            "salawat ala nabi",
            "sallallahu alayhi wa sallam",
            "sallallahu alaihi wasallam",
            "صل على النبي"
        ]

    };


    /* =====================================================
       NORMALIZE SPEECH
    ===================================================== */

    function normalizeSpeech(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\p{L}\p{N}\s]/gu, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================================
       CURRENT DHIKR
    ===================================================== */

    function getSelectedDhikr() {

        if (!dhikrSelect) {
            return "subhanallah";
        }

        return dhikrSelect.value;

    }


    /* =====================================================
       CHECK WHETHER SPEECH MATCHES DHIKR
    ===================================================== */

    function speechMatchesDhikr(text) {

        const selected =
            getSelectedDhikr();

        const normalized =
            normalizeSpeech(text);

        const phrases =
            dhikrDictionary[selected] || [];

        for (const phrase of phrases) {

            const normalizedPhrase =
                normalizeSpeech(phrase);

            if (
                normalized === normalizedPhrase ||
                normalized.includes(normalizedPhrase)
            ) {

                return true;

            }

        }

        return false;

    }


    /* =====================================================
       DISPLAY
    ===================================================== */

    function updateDisplay() {

        if (countDisplay) {
            countDisplay.textContent = count;
        }

        if (targetDisplay) {
            targetDisplay.textContent = target;
        }

        if (targetInput) {
            targetInput.value = target;
        }

        if (currentDhikr && dhikrSelect) {

            const option =
                dhikrSelect.options[
                    dhikrSelect.selectedIndex
                ];

            if (option) {
                currentDhikr.textContent =
                    option.textContent.trim();
            }

        }

        updateProgress();

        save();

    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function updateProgress() {

        if (!progressBar) {
            return;
        }

        if (target <= 0) {

            progressBar.style.width =
                "0%";

            return;

        }

        const percentage =
            Math.min(
                100,
                (count / target) * 100
            );

        progressBar.style.width =
            percentage + "%";


        const counterCard =
            document.querySelector(
                ".counter-card"
            );

        if (counterCard) {

            if (count >= target) {
                counterCard.classList.add(
                    "completed"
                );
            } else {
                counterCard.classList.remove(
                    "completed"
                );
            }

        }

    }


    /* =====================================================
       SAVE
    ===================================================== */

    function save() {

        localStorage.setItem(
            COUNT_KEY,
            String(count)
        );

        localStorage.setItem(
            TARGET_KEY,
            String(target)
        );

        if (dhikrSelect) {

            localStorage.setItem(
                DHIKR_KEY,
                dhikrSelect.value
            );

        }

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add(
            "show"
        );

        clearTimeout(
            showToast.timer
        );

        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 1500);

    }


    /* =====================================================
       ADD COUNT
    ===================================================== */

    function addCount(amount = 1) {

        amount =
            Number.parseInt(
                amount,
                10
            );

        if (
            !Number.isFinite(amount) ||
            amount < 1
        ) {
            amount = 1;
        }


        /* Prevent counting beyond target */

        if (
            target > 0 &&
            count >= target
        ) {

            count = target;

            updateDisplay();

            stopListening();

            showToast(
                "🤲 Alhamdulillah! Target reached."
            );

            return;

        }


        if (
            target > 0 &&
            count + amount > target
        ) {

            amount =
                target - count;

        }


        if (amount <= 0) {
            return;
        }


        count += amount;

        updateDisplay();


        /* Vibration */

        if (
            navigator.vibrate &&
            amount === 1
        ) {

            navigator.vibrate(20);

        }


        /* Target reached */

        if (
            target > 0 &&
            count >= target
        ) {

            count = target;

            updateDisplay();

            stopListening();

            showToast(
                "🤲 Alhamdulillah! Target reached."
            );

            if (navigator.vibrate) {

                navigator.vibrate([
                    80,
                    50,
                    80
                ]);

            }

            return;

        }


        if (amount === 1) {

            showToast(
                "+1"
            );

        } else {

            showToast(
                "+" + amount
            );

        }

    }


    /* =====================================================
       TAP BUTTON
    ===================================================== */

    if (tapButton) {

        tapButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                addCount(1);

            }
        );

    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                count = 0;

                updateDisplay();

                showToast(
                    "Counter reset"
                );

            }
        );

    }


    /* =====================================================
       TARGET
    ===================================================== */

    if (targetInput) {

        targetInput.addEventListener(
            "change",
            () => {

                let value =
                    Number.parseInt(
                        targetInput.value,
                        10
                    );

                if (
                    !Number.isFinite(value) ||
                    value < 1
                ) {

                    value = 33;

                }

                target = value;

                updateDisplay();

            }
        );

    }


    /* =====================================================
       DHIKR SELECT
    ===================================================== */

    if (dhikrSelect) {

        const saved =
            localStorage.getItem(
                DHIKR_KEY
            );

        if (saved) {

            const exists =
                [...dhikrSelect.options]
                    .some(
                        option =>
                            option.value === saved
                    );

            if (exists) {
                dhikrSelect.value = saved;
            }

        }


        dhikrSelect.addEventListener(
            "change",
            () => {

                save();

                updateDisplay();

                if (listening) {

                    stopListening();

                    setTimeout(
                        startListening,
                        400
                    );

                }

                showToast(
                    "Dhikr selected"
                );

            }
        );

    }


    /* =====================================================
       SPEECH RECOGNITION
    ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        if (microphoneButton) {

            microphoneButton.disabled =
                false;

            microphoneButton.addEventListener(
                "click",
                () => {

                    if (statusText) {

                        statusText.textContent =
                            "🎤 Speech recognition is not available in this browser. Try Chrome on Android.";

                    }

                    showToast(
                        "Voice counting is unavailable here."
                    );

                }
            );

        }

    } else {

        recognition =
            new SpeechRecognition();


        /*
        -----------------------------------------------------
        RECOGNITION SETTINGS
        -----------------------------------------------------
        */

        recognition.continuous = true;

        recognition.interimResults = false;

        recognition.maxAlternatives = 3;

        recognition.lang = "en-US";


        /*
        -----------------------------------------------------
        START
        -----------------------------------------------------
        */

        recognition.onstart =
            () => {

                listening = true;

                if (microphoneButton) {

                    microphoneButton.classList.add(
                        "active"
                    );

                    microphoneButton.classList.add(
                        "listening"
                    );

                    microphoneButton.textContent =
                        "🛑 Stop Listening";

                }

                if (statusText) {

                    statusText.textContent =
                        "🎤 Listening for your selected dhikr…";

                }

            };


        /*
        -----------------------------------------------------
        RESULT
        -----------------------------------------------------
        */

        recognition.onresult =
            event => {

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];

                    if (!result.isFinal) {
                        continue;
                    }


                    /*
                    Try all available alternatives.
                    */

                    let matched = false;

                    for (
                        let j = 0;
                        j < result.length;
                        j++
                    ) {

                        const transcript =
                            result[j]
                                .transcript
                                .trim();

                        console.log(
                            "IQRANIX heard:",
                            transcript
                        );


                        if (
                            speechMatchesDhikr(
                                transcript
                            )
                        ) {

                            addCount(1);

                            matched = true;

                            if (statusText) {

                                statusText.textContent =
                                    "✓ Dhikr recognized — +1";

                            }

                            break;

                        }

                    }


                    if (!matched) {

                        if (statusText) {

                            statusText.textContent =
                                "🎤 Listening… say the selected dhikr.";

                        }

                    }

                }

            };


        /*
        -----------------------------------------------------
        ERROR
        -----------------------------------------------------
        */

        recognition.onerror =
            event => {

                console.warn(
                    "IQRANIX Speech:",
                    event.error
                );


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    listening = false;

                    if (statusText) {

                        statusText.textContent =
                            "🎤 Microphone permission was denied. Allow microphone access and try again.";

                    }

                    updateMicrophoneButton();

                    return;

                }


                if (
                    event.error ===
                    "no-speech"
                ) {

                    if (statusText) {

                        statusText.textContent =
                            "🎤 No speech detected. Listening again…";

                    }

                    return;

                }


                if (
                    event.error ===
                    "audio-capture"
                ) {

                    listening = false;

                    if (statusText) {

                        statusText.textContent =
                            "🎤 No microphone was detected.";

                    }

                    updateMicrophoneButton();

                    return;

                }


                if (statusText) {

                    statusText.textContent =
                        "🎤 Microphone error: " +
                        event.error;

                }

            };


        /*
        -----------------------------------------------------
        END
        -----------------------------------------------------
        */

        recognition.onend =
            () => {

                listening = false;

                updateMicrophoneButton();


                /*
                Android/Chrome may automatically terminate
                speech recognition. Restart it while the
                user still wants voice counting.
                */

                if (
                    !manuallyStopped &&
                    count < target
                ) {

                    clearTimeout(
                        restartTimer
                    );

                    restartTimer =
                        setTimeout(
                            () => {

                                if (
                                    !manuallyStopped &&
                                    !listening
                                ) {

                                    try {

                                        recognition.start();

                                    } catch (error) {

                                        console.warn(
                                            "Recognition restart:",
                                            error
                                        );

                                    }

                                }

                            },
                            350
                        );

                } else {

                    if (statusText) {

                        statusText.textContent =
                            "Tap the microphone to start.";

                    }

                }

            };


        /*
        -----------------------------------------------------
        UPDATE BUTTON
        -----------------------------------------------------
        */

        function updateMicrophoneButton() {

            if (!microphoneButton) {
                return;
            }

            if (listening) {

                microphoneButton.classList.add(
                    "active"
                );

                microphoneButton.classList.add(
                    "listening"
                );

                microphoneButton.textContent =
                    "🛑 Stop Listening";

            } else {

                microphoneButton.classList.remove(
                    "active"
                );

                microphoneButton.classList.remove(
                    "listening"
                );

                microphoneButton.textContent =
                    "🎤 Count with Microphone";

            }

        }


        /*
        -----------------------------------------------------
        START LISTENING
        -----------------------------------------------------
        */

        function startListening() {

            if (!recognition) {
                return;
            }

            manuallyStopped = false;


            if (
                target > 0 &&
                count >= target
            ) {

                showToast(
                    "Target already reached."
                );

                return;

            }


            try {

                recognition.start();

            } catch (error) {

                /*
                Recognition may already be starting.
                */

                console.warn(
                    "Recognition start:",
                    error
                );

            }

        }


        /*
        -----------------------------------------------------
        STOP LISTENING
        -----------------------------------------------------
        */

        function stopListening() {

            manuallyStopped = true;

            clearTimeout(
                restartTimer
            );

            if (!recognition) {
                return;
            }

            try {

                recognition.stop();

            } catch (error) {

                console.warn(
                    "Recognition stop:",
                    error
                );

            }

            listening = false;

            updateMicrophoneButton();

        }


        /*
        -----------------------------------------------------
        MICROPHONE BUTTON
        -----------------------------------------------------
        */

        if (microphoneButton) {

            microphoneButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    if (listening) {

                        stopListening();

                        if (statusText) {

                            statusText.textContent =
                                "Voice counting stopped.";

                        }

                    } else {

                        startListening();

                    }

                }
            );

        }

    }


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                } else {

                    window.location.href =
                        "index.html";

                }

            }
        );

    }


    /* =====================================================
       SPACEBAR
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const tag =
                document.activeElement?.tagName;

            if (
                event.code === "Space" &&
                tag !== "INPUT" &&
                tag !== "SELECT" &&
                tag !== "TEXTAREA"
            ) {

                event.preventDefault();

                addCount(1);

            }

        }
    );


    /* =====================================================
       INITIAL DISPLAY
    ===================================================== */

    updateDisplay();

    console.log(
        "IQRANIX Tasbih ready."
    );

});