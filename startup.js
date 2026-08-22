/* =========================================================
   IQRANIX STARTUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const startupScreen =
        document.getElementById("startupScreen");

    if (!startupScreen) return;


    document.body.classList.add("iqranix-opening");


    /*
     * Show the startup screen briefly.
     * Then reveal the homepage.
     */

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