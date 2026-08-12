/*
=========================================================
        IQRANIX — DISCLAIMER.JS
        Official Disclaimer Page
=========================================================
*/

"use strict";


/* =====================================================
   PAGE READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeDisclaimer();

});


/* =====================================================
   INITIALIZE
===================================================== */

function initializeDisclaimer() {

    updateCopyrightYear();

    setupBackNavigation();

    setupSmoothLinks();

    setupContactLinks();

    setupPrintSupport();

    setupSectionAccessibility();

    console.log(
        "Iqranix Disclaimer loaded successfully."
    );

}


/* =====================================================
   UPDATE COPYRIGHT YEAR
===================================================== */

function updateCopyrightYear() {

    const currentYear =
        new Date().getFullYear();

    const footerTexts =
        document.querySelectorAll(
            ".document-footer small"
        );

    footerTexts.forEach(element => {

        if (
            element.textContent.includes("©")
        ) {

            element.textContent =
                element.textContent.replace(
                    /\d{4}/,
                    currentYear
                );

        }

    });

}


/* =====================================================
   BACK NAVIGATION
===================================================== */

function setupBackNavigation() {

    const backButton =
        document.querySelector(
            ".back-link"
        );

    if (!backButton) return;


    backButton.addEventListener(
        "click",
        event => {

            /*
             * If there is a previous page in
             * browser history, return there.
             */

            if (
                window.history.length > 1
            ) {

                event.preventDefault();

                window.history.back();

            }

        }
    );

}


/* =====================================================
   SMOOTH INTERNAL LINKS
===================================================== */

function setupSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }
        );

    });

}


/* =====================================================
   CONTACT LINKS
===================================================== */

function setupContactLinks() {

    const emailLinks =
        document.querySelectorAll(
            'a[href^="mailto:"]'
        );


    emailLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                console.log(
                    "Opening Iqranix official email."
                );

            }
        );

    });


    const instagramLinks =
        document.querySelectorAll(
            'a[href*="instagram.com"]'
        );


    instagramLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                console.log(
                    "Opening Iqranix Instagram."
                );

            }
        );

    });

}


/* =====================================================
   PRINT SUPPORT
===================================================== */

function setupPrintSupport() {

    window.addEventListener(
        "beforeprint",
        () => {

            document.body.classList.add(
                "printing"
            );

        }
    );


    window.addEventListener(
        "afterprint",
        () => {

            document.body.classList.remove(
                "printing"
            );

        }
    );

}


/* =====================================================
   ACCESSIBILITY
===================================================== */

function setupSectionAccessibility() {

    const sections =
        document.querySelectorAll(
            ".document-section"
        );


    sections.forEach(
        (section, index) => {

            section.setAttribute(
                "data-section",
                String(index + 1)
            );

        }
    );

}


/* =====================================================
   PAGE VISIBILITY
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            console.log(
                "Iqranix Disclaimer page hidden."
            );

        } else {

            console.log(
                "Iqranix Disclaimer page active."
            );

        }

    }
);


/* =====================================================
   READY MESSAGE
===================================================== */

console.log(
    "IQRANIX Disclaimer JavaScript Ready."
);