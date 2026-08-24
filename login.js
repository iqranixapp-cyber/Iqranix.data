// ============================================================
// IQRANIX — LOGIN / AUTHENTICATION
// Google Redirect + Email/Password
// Firebase JS SDK 12.17.1
// ============================================================

import { auth } from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    browserPopupRedirectResolver
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ============================================================
// ELEMENTS
// ============================================================

const googleButton = document.getElementById("google-login");
const loginForm = document.getElementById("login-form");
const signupButton = document.getElementById("signup-btn");
const forgotButton = document.getElementById("forgot-password");
const loginButton = document.getElementById("login-btn");
const message = document.getElementById("message");


// ============================================================
// MESSAGE
// ============================================================

function showMessage(text, type = "error") {

    if (!message) return;

    message.textContent = text;

    message.className = "message";

    if (type === "success") {
        message.classList.add("success");
    } else {
        message.classList.add("error");
    }
}


// ============================================================
// LOADING
// ============================================================

function setLoading(isLoading) {

    if (googleButton) {
        googleButton.disabled = isLoading;
    }

    if (loginButton) {
        loginButton.disabled = isLoading;
    }

    if (signupButton) {
        signupButton.disabled = isLoading;
    }

    if (forgotButton) {
        forgotButton.disabled = isLoading;
    }
}


// ============================================================
// REDIRECT TO APP
// ============================================================

function redirectToApp() {

    window.location.replace("index.html");

}


// ============================================================
// GOOGLE SIGN-IN
// ============================================================

async function googleLogin() {

    try {

        setLoading(true);

        showMessage(
            "Connecting to Google...",
            "success"
        );


        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        /*
         * IMPORTANT:
         *
         * browserPopupRedirectResolver belongs here.
         *
         * It must NOT be passed to getRedirectResult().
         */

        await signInWithRedirect(
            auth,
            provider,
            browserPopupRedirectResolver
        );


    } catch (error) {

        console.error(
            "IQRANIX Google Sign-In Error:",
            error
        );

        setLoading(false);

        showMessage(
            getFriendlyError(error)
        );

    }

}


// ============================================================
// GOOGLE BUTTON
// ============================================================

if (googleButton) {

    googleButton.addEventListener(
        "click",
        googleLogin
    );

}


// ============================================================
// PROCESS GOOGLE REDIRECT
// ============================================================

async function processGoogleRedirect() {

    try {

        /*
         * IMPORTANT:
         *
         * No third argument here.
         */

        const result =
            await getRedirectResult(auth);


        if (!result) {

            console.log(
                "No Google redirect result."
            );

            return;
        }


        console.log(
            "Google sign-in successful:",
            result.user
        );


        showMessage(
            `Welcome to Iqranix, ${
                result.user.displayName || "friend"
            }!`,
            "success"
        );


        redirectToApp();


    } catch (error) {

        console.error(
            "IQRANIX Redirect Result Error:",
            error
        );

        setLoading(false);

        showMessage(
            getFriendlyError(error)
        );

    }

}


// Run when login page opens
processGoogleRedirect();


// ============================================================
// EMAIL / PASSWORD LOGIN
// ============================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password."
                );

                return;
            }


            setLoading(true);


            showMessage(
                "Signing you in...",
                "success"
            );


            try {

                const result =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Email sign-in successful:",
                    result.user
                );


                showMessage(
                    "Signed in successfully!",
                    "success"
                );


                redirectToApp();


            } catch (error) {

                console.error(
                    "Email Sign-In Error:",
                    error
                );


                setLoading(false);


                showMessage(
                    getFriendlyError(error)
                );

            }

        }
    );

}


// ============================================================
// CREATE ACCOUNT
// ============================================================

if (signupButton) {

    signupButton.addEventListener(
        "click",
        async () => {

            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            if (!email) {

                showMessage(
                    "Enter your email address first."
                );

                return;
            }


            if (!password) {

                showMessage(
                    "Enter a password first."
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must be at least 6 characters."
                );

                return;
            }


            setLoading(true);


            showMessage(
                "Creating your Iqranix account...",
                "success"
            );


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Iqranix account created:",
                    result.user
                );


                showMessage(
                    "Account created successfully!",
                    "success"
                );


                redirectToApp();


            } catch (error) {

                console.error(
                    "Account Creation Error:",
                    error
                );


                setLoading(false);


                showMessage(
                    getFriendlyError(error)
                );

            }

        }
    );

}


// ============================================================
// FORGOT PASSWORD
// ============================================================

if (forgotButton) {

    forgotButton.addEventListener(
        "click",
        async () => {

            const emailInput =
                document.getElementById("email");


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            if (!email) {

                showMessage(
                    "Enter your email address first."
                );

                return;
            }


            setLoading(true);


            showMessage(
                "Sending password reset email...",
                "success"
            );


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                setLoading(false);


                showMessage(
                    "Password reset email sent. Check your inbox.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Password Reset Error:",
                    error
                );


                setLoading(false);


                showMessage(
                    getFriendlyError(error)
                );

            }

        }
    );

}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "IQRANIX authenticated:",
                user.uid
            );

        } else {

            console.log(
                "IQRANIX: No authenticated user."
            );

        }

    }
);


// ============================================================
// FRIENDLY FIREBASE ERRORS
// ============================================================

function getFriendlyError(error) {

    console.error(
        "Firebase error:",
        error
    );


    switch (error?.code) {

        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/user-not-found":

            return "No Iqranix account was found with this email.";


        case "auth/wrong-password":

        case "auth/invalid-credential":

            return "The email or password is incorrect.";


        case "auth/email-already-in-use":

            return "An account already exists with this email.";


        case "auth/weak-password":

            return "Please choose a stronger password.";


        case "auth/unauthorized-domain":

            return "This website is not authorized in Firebase Authentication.";


        case "auth/operation-not-allowed":

            return "This sign-in method is not enabled in Firebase.";


        case "auth/network-request-failed":

            return "Network connection failed. Please check your internet connection.";


        case "auth/too-many-requests":

            return "Too many attempts. Please wait and try again later.";


        case "auth/web-storage-unsupported":

            return "Your browser is blocking the storage required for sign-in.";


        case "auth/redirect-operation-pending":

            return "A Google sign-in is already in progress. Please wait.";


        case "auth/popup-blocked":

            return "The browser blocked the authentication window.";


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/invalid-api-key":

            return "The Firebase API key is invalid.";


        case "auth/argument-error":

            return "Firebase authentication received an invalid configuration or argument.";


        default:

            return (
                error?.message ||
                "Something went wrong. Please try again."
            );

    }

}