/* =========================================================
   IQRANIX — ABOUT.JS
   Professional About Page Behaviour
========================================================= */

"use strict";


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeAboutPage();

});


function initializeAboutPage() {

    setupScrollAnimations();

    setupExternalLinks();

    setupDocumentLinks();

    updateCopyrightYear();

    setupButtonEffects();

    console.log("Iqranix About Page Loaded.");

}


/* =========================================================
   SCROLL ANIMATIONS
========================================================= */

function setupScrollAnimations() {

    const sections = document.querySelectorAll(
        ".about-section, .brand-card, .closing-section"
    );

    if (!sections.length) {
        return;
    }


    /*
     * If the browser does not support
     * IntersectionObserver, simply leave
     * everything visible.
     */

    if (!("IntersectionObserver" in window)) {
        return;
    }


    sections.forEach(section => {

        section.classList.add("about-hidden");

    });


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "about-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    sections.forEach(section => {

        observer.observe(section);

    });

}


/* =========================================================
   EXTERNAL LINKS
========================================================= */

function setupExternalLinks() {

    const externalLinks = document.querySelectorAll(
        'a[target="_blank"]'
    );


    externalLinks.forEach(link => {

        /*
         * Ensure external links cannot access
         * the opener page.
         */

        const currentRel =
            link.getAttribute("rel") || "";

        if (!currentRel.includes("noopener")) {

            link.setAttribute(
                "rel",
                `${currentRel} noopener noreferrer`.trim()
            );

        }

    });

}


/* =========================================================
   DOCUMENT LINKS
========================================================= */

function setupDocumentLinks() {

    const links = document.querySelectorAll(
        ".document-link"
    );


    links.forEach(link => {

        link.addEventListener("click", () => {

            link.classList.add(
                "link-clicked"
            );

        });

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function updateCopyrightYear() {

    const currentYear =
        new Date().getFullYear();


    const footerSmallTexts =
        document.querySelectorAll(
            ".about-footer small"
        );


    footerSmallTexts.forEach(element => {

        const text =
            element.textContent;


        if (text.includes("2026")) {

            element.textContent =
                text.replace(
                    "2026",
                    currentYear
                );

        }

    });

}


/* =========================================================
   BUTTON / LINK EFFECTS
========================================================= */

function setupButtonEffects() {

    const interactiveElements =
        document.querySelectorAll(
            ".document-link, .back-link, .footer-social a"
        );


    interactiveElements.forEach(element => {

        element.addEventListener(
            "pointerdown",
            () => {

                element.style.transform =
                    "scale(0.97)";

            }
        );


        element.addEventListener(
            "pointerup",
            () => {

                element.style.transform =
                    "";

            }
        );


        element.addEventListener(
            "pointercancel",
            () => {

                element.style.transform =
                    "";

            }
        );

    });

}


/* =========================================================
   OPTIONAL: RETURN TO TOP
========================================================= */

function createBackToTopButton() {

    /*
     * This function is intentionally not
     * automatically enabled because the
     * current About HTML does not contain
     * a back-to-top button.
     *
     * It is kept here so the page can be
     * expanded later without rewriting
     * the JavaScript architecture.
     */

}


/* =========================================================
   ERROR-SAFE IMAGE HANDLING
========================================================= */

function setupImageFallbacks() {

    const images =
        document.querySelectorAll("img");


    images.forEach(image => {

        image.addEventListener(
            "error",
            () => {

                console.warn(
                    "Iqranix image could not be loaded:",
                    image.src
                );

            }
        );

    });

}


/* =========================================================
   ONLINE / OFFLINE STATUS
========================================================= */

window.addEventListener(
    "online",
    () => {

        console.log(
            "Iqranix connection restored."
        );

    }
);


window.addEventListener(
    "offline",
    () => {

        console.log(
            "Iqranix is currently offline."
        );

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

            console.log(
                "Iqranix About page active."
            );

        }

    }
);