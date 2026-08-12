/* =========================================================
   IQRANIX — HOME PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PAGE NAVIGATION
       ===================================================== */

    const pages = {
        "quran.html": "quran.html",
        "prayer.html": "prayer.html",
        "duas.html": "duas.html",
        "qibla-calibration.html": "qibla-calibration.html",
        "tasbih.html": "tasbih.html",
        "hijri-calendar.html": "hijri-calendar.html",

        "prophets.html": "prophets.html",
        "seerah.html": "seerah.html",
        "fiqh.html": "fiqh.html",

        "nasheeds.html": "nasheeds.html",
        "wallpapers.html": "wallpapers.html",
        "ringtones.html": "ringtones.html",

        "quiz.html": "quiz.html",

        "mosques.html": "mosques.html",
        "reminders.html": "reminders.html",
        "bookmarks.html": "bookmarks.html",

        "premium.html": "premium.html",
        "settings.html": "settings.html"
    };


    /* =====================================================
       OPEN PAGE
       ===================================================== */

    function openPage(page) {

        if (!page) {
            return;
        }

        if (pages[page]) {
            window.location.href = pages[page];
            return;
        }

        console.warn(
            "IQRANIX: Unknown page:",
            page
        );
    }


    /* =====================================================
       GENERIC DATA-PAGE SUPPORT
       ===================================================== */

    document
        .querySelectorAll("[data-page]")
        .forEach(element => {

            const page =
                element.getAttribute("data-page");

            if (!page) {
                return;
            }

            element.addEventListener("click", event => {

                if (
                    element.tagName.toLowerCase() !== "a"
                ) {
                    event.preventDefault();
                }

                openPage(page);

            });

        });


    /* =====================================================
       SETTINGS
       ===================================================== */

    document
        .querySelectorAll(
            "#settingsButton, .settings-button, [data-settings]"
        )
        .forEach(button => {

            button.addEventListener("click", event => {

                if (
                    button.tagName.toLowerCase() !== "a"
                ) {
                    event.preventDefault();
                }

                window.location.href =
                    "settings.html";

            });

        });


    /* =====================================================
       NEXT PRAYER CARD
       ===================================================== */

    const prayerCard =
        document.querySelector(".next-prayer-card");

    if (prayerCard) {

        prayerCard.addEventListener("click", () => {

            window.location.href =
                "prayer.html";

        });

    }


    /* =====================================================
       PRAYER INFORMATION
       
       This safely displays existing values if another
       prayer script places them in localStorage.
       ===================================================== */

    const savedLocation =
        localStorage.getItem("iqranix_location");

    const locationElement =
        document.getElementById("home-location");

    if (
        savedLocation &&
        locationElement
    ) {
        locationElement.textContent =
            savedLocation;
    }


    /* =====================================================
       PREMIUM CARD
       ===================================================== */

    const premiumCard =
        document.querySelector(".go-premium-card");

    if (premiumCard) {

        premiumCard.addEventListener("click", () => {

            window.location.href =
                "premium.html";

        });

    }


    /* =====================================================
       BROKEN # LINKS
       ===================================================== */

    document
        .querySelectorAll('a[href="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

            });

        });


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const year =
        document.getElementById("current-year");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       CONSOLE
       ===================================================== */

    console.log(
        "IQRANIX Home loaded successfully."
    );

});