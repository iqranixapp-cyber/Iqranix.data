/* =========================================================
   IQRANIX STARTUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const startupScreen =
        document.getElementById("startupScreen");

    if (!startupScreen) return;


    document.body.classList.add("iqranix-opening");


    /* =====================================================
       OPENING SOUND
    ===================================================== */

    const openingSound = new Audio("iqranix-opening.mp3");

    openingSound.volume = 0.65;

    openingSound.preload = "auto";


    /*
     * Try to play the sound.
     *
     * Some mobile browsers block audio that starts
     * without a user interaction. If blocked, the
     * startup screen will still work normally.
     */

    openingSound.play().catch(() => {
        console.log("Opening sound was blocked by the browser.");
    });


    /* =====================================================
       STARTUP TIMER
    ===================================================== */

    const STARTUP_TIME = 2400;


    setTimeout(() => {

        startupScreen.classList.add("hidden");

        document.body.classList.remove(
            "iqranix-opening"
        );


        setTimeout(() => {

            startupScreen.remove();

        }, 750);

    }, STARTUP_TIME);

});