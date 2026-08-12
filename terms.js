/* =========================================
   IQRANIX — TERMS & CONDITIONS JS
   Official Document Controller
========================================= */

"use strict";

/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeTermsPage();

});


function initializeTermsPage() {

    updateCopyrightYear();

    setupBackButton();

    setupSmoothLinks();

    setupPrintButton();

    setupDocumentProtection();

    console.log(
        "IQRANIX Terms & Conditions loaded."
    );

}


/* =========================================
   CURRENT YEAR
========================================= */

function updateCopyrightYear() {

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach(element => {

        element.textContent =
            currentYear;

    });

}


/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {

    const backButton =
        document.querySelector(".back-btn");

    if (!backButton) return;


    backButton.addEventListener(
        "click",
        event => {

            /*
             If there is browser history,
             return to the previous page.
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


/* =========================================
   SMOOTH INTERNAL LINKS
========================================= */

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
                    link.getAttribute("href");

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


                /*
                 Update the URL hash without
                 forcing a page reload.
                */

                history.pushState(
                    null,
                    "",
                    targetId
                );

            }
        );

    });

}


/* =========================================
   PRINT SUPPORT
========================================= */

function setupPrintButton() {

    const printButton =
        document.getElementById(
            "printTerms"
        );

    if (!printButton) return;


    printButton.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================
   DOCUMENT PROTECTION
========================================= */

function setupDocumentProtection() {

    /*
     The Terms & Conditions are an official
     document. We prevent accidental form
     submission if buttons are placed inside
     the document later.
    */

    document
        .querySelectorAll("button")
        .forEach(button => {

            if (
                !button.getAttribute("type")
            ) {

                button.setAttribute(
                    "type",
                    "button"
                );

            }

        });

}


/* =========================================
   OPTIONAL SECTION HIGHLIGHTING
========================================= */

function highlightCurrentSection() {

    const sections =
        document.querySelectorAll(
            ".terms-section"
        );

    if (!sections.length) return;


    const scrollPosition =
        window.scrollY + 140;


    let currentSection = null;


    sections.forEach(section => {

        const top =
            section.offsetTop;

        const bottom =
            top + section.offsetHeight;


        if (
            scrollPosition >= top &&
            scrollPosition < bottom
        ) {

            currentSection =
                section;

        }

    });


    sections.forEach(section => {

        section.classList.remove(
            "current-section"
        );

    });


    if (currentSection) {

        currentSection.classList.add(
            "current-section"
        );

    }

}


/* =========================================
   SCROLL LISTENER
========================================= */

let scrollTimer = null;

window.addEventListener(
    "scroll",
    () => {

        if (scrollTimer) return;


        scrollTimer =
            setTimeout(() => {

                highlightCurrentSection();

                scrollTimer = null;

            }, 100);

    },
    {
        passive: true
    }
);


/* =========================================
   PAGE VISIBILITY
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            updateCopyrightYear();

        }

    }
);


/* =========================================
   FINAL READY MESSAGE
========================================= */

console.log(
    "IQRANIX Terms & Conditions system ready."
);