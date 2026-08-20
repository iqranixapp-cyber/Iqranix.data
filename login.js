// ============================================================
// IQRANIX — LOGIN / AUTHENTICATION
// Firebase Authentication
// Google + Email/Password
// ============================================================

import {
    auth
} from "./firebase-config.js";

import {
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ============================================================
// ELEMENTS
// ============================================================

const googleButton =
    document.getElementById("google-login");

const loginForm =
    document.getElementById("login-form");

const signupButton =
    document.getElementById("signup-btn");

const forgotButton =
    document.getElementById("forgot-password");

const loginButton =
    document.getElementById("login-btn");

const message =
    document.getElementById("message");


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
// LOADING STATE
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
// GOOGLE SIGN-IN
// ============================================================

if (googleButton) {

    googleButton.addEventListener("click", async () => {

        setLoading(true);

        showMessage(
            "Connecting to Google...",
            "success"
        );

        try {

            const provider =
                new GoogleAuthProvider();

            provider.setCustomParameters({
                prompt: "select_account"
            });

            await signInWithRedirect(
                auth,
                provider
            );

        } catch (error) {

            console.error(
                "Iqranix Google Sign-In Error:",
                error
            );

            setLoading(false);

            showMessage(
                getFriendlyError(error)
            );
        }
    });
}


// ============================================================
// GOOGLE REDIRECT RESULT
// ============================================================

async function checkGoogleRedirect() {

    try {

        const result =
            await getRedirectResult(auth);

        if (!result) {
            return;
        }

        const user = result.user;

        console.log(
            "Iqranix Google user:",
            user
        );

        showMessage(
            `Welcome, ${user.displayName || "Iqranix user"}!`,
            "success"
        );

        redirectToApp();

    } catch (error) {

        console.error(
            "Google redirect error:",
            error
        );

        setLoading(false);

        showMessage(
            getFriendlyError(error)
        );
    }
}

checkGoogleRedirect();


// ============================================================
// EMAIL / PASSWORD LOGIN
// ============================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

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
                    "Iqranix email user:",
                    result.user
                );

                showMessage(
                    "Signed in successfully!",
                    "success"
                );

                redirectToApp();

            } catch (error) {

                console.error(
                    "Email login error:",
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

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

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
                    "Your password must be at least 6 characters."
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
                    "Account creation error:",
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

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

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
                    "Password reset error:",
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
                "Iqranix authenticated:",
                user.email
            );

        }

    }
);


// ============================================================
// REDIRECT
// ============================================================

function redirectToApp() {

    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 800);
}


// ============================================================
// FRIENDLY FIREBASE ERRORS
// ============================================================

function getFriendlyError(error) {

    switch (error.code) {

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


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/unauthorized-domain":

            return "This Iqranix website is not authorized for Firebase Authentication.";


        case "auth/network-request-failed":

            return "Network connection failed. Please check your internet connection.";


        case "auth/too-many-requests":

            return "Too many attempts. Please wait a little and try again.";


        case "auth/operation-not-allowed":

            return "This sign-in method is not enabled in Firebase.";


        default:

            return (
                error.message ||
                "Something went wrong. Please try again."
            );
    }
}