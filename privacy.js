/*
=========================================
        IQRANIX — PRIVACY.JS
=========================================
        Privacy Policy Page
=========================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializePrivacyPage();
    setupPrintButton();
    setupBackButton();

});


/*
=========================================
        INITIALIZE PAGE
=========================================
*/

function initializePrivacyPage() {

    // Automatically update the copyright year
    const yearElements =
        document.querySelectorAll("[data-current-year]");

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach(element => {

        element.textContent =
            currentYear;

    });


    // Add a subtle page-ready state
    document.body.classList.add("privacy-ready");

}


/*
=========================================
        PRINT PRIVACY POLICY
=========================================
*/

function setupPrintButton() {

    const printButton =
        document.getElementById("printPrivacy");

    if (!printButton) return;

    printButton.addEventListener("click", () => {

        window.print();

    });

}


/*
=========================================
        BACK BUTTON
=========================================
*/

function setupBackButton() {

    const backButton =
        document.getElementById("privacyBack");

    if (!backButton) return;

    backButton.addEventListener("click", (event) => {

        event.preventDefault();

        if (window.history.length > 1) {

            window.history.back();

        } else {

            window.location.href =
                "settings.html";

        }

    });

}


/*
=========================================
        EMAIL COPYRIGHT LINK
=========================================
*/

function setupCopyrightEmail() {

    const emailLinks =
        document.querySelectorAll(
            "[data-copyright-email]"
        );

    emailLinks.forEach(link => {

        link.addEventListener("click", () => {

            console.log(
                "Copyright correspondence initiated."
            );

        });

    });

}


/*
=========================================
        ACCESSIBILITY
=========================================
*/

function setupAccessibility() {

    const sections =
        document.querySelectorAll(
            ".privacy-section"
        );

    sections.forEach(section => {

        section.setAttribute(
            "tabindex",
            "-1"
        );

    });

}


/*
=========================================
        FINAL INITIALIZATION
=========================================
*/

setupCopyrightEmail();
setupAccessibility();


console.log(
    "Iqranix Privacy Policy loaded successfully."
);