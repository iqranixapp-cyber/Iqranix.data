// ============================================================
// IQRANIX — PROFILE
// Firebase Authentication + Firestore
// ============================================================

import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ============================================================
// ELEMENTS
// ============================================================

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");

const infoName = document.getElementById("info-name");
const infoEmail = document.getElementById("info-email");
const memberSince = document.getElementById("member-since");

const profileAvatar = document.getElementById("profile-avatar");

const editButton =
    document.getElementById("edit-profile-button");

const editModal =
    document.getElementById("edit-modal");

const closeModal =
    document.getElementById("close-modal");

const profileForm =
    document.getElementById("profile-form");

const displayNameInput =
    document.getElementById("display-name");

const saveButton =
    document.getElementById("save-profile-button");

const formMessage =
    document.getElementById("form-message");

const logoutButton =
    document.getElementById("logout-button");

const toast =
    document.getElementById("profile-toast");

const toastMessage =
    document.getElementById("toast-message");

const quranProgress =
    document.getElementById("quran-progress");

const quranProgressBar =
    document.getElementById("quran-progress-bar");

const quranProgressLabel =
    document.getElementById("quran-progress-label");

const profileStreak =
    document.getElementById("profile-streak");

const dhikrProgress =
    document.getElementById("dhikr-progress");

const achievementCount =
    document.getElementById("achievement-count");

const lastSurah =
    document.getElementById("last-surah");

const lastAyah =
    document.getElementById("last-ayah");


// ============================================================
// CURRENT USER
// ============================================================

let currentUser = null;


// ============================================================
// TOAST
// ============================================================

function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


// ============================================================
// AVATAR
// ============================================================

function updateAvatar(user) {

    if (!profileAvatar) return;

    if (user.photoURL) {

        profileAvatar.innerHTML = `
            <img
                src="${user.photoURL}"
                alt="Profile picture"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:50%;
                "
            >
        `;

        return;
    }

    const name =
        user.displayName ||
        user.email ||
        "U";

    const initial =
        name.trim().charAt(0).toUpperCase();

    profileAvatar.innerHTML = initial;
}


// ============================================================
// MEMBER SINCE
// ============================================================

function formatMemberSince(user) {

    if (!memberSince) return;

    if (!user.metadata?.creationTime) {

        memberSince.textContent = "Recently";

        return;
    }

    const date =
        new Date(user.metadata.creationTime);

    memberSince.textContent =
        date.toLocaleDateString(
            undefined,
            {
                month: "long",
                year: "numeric"
            }
        );
}


// ============================================================
// DISPLAY USER
// ============================================================

function displayUser(user) {

    const name =
        user.displayName ||
        "IQRANIX Member";

    const email =
        user.email ||
        "No email available";


    if (profileName)
        profileName.textContent = name;

    if (profileEmail)
        profileEmail.textContent = email;

    if (infoName)
        infoName.textContent = name;

    if (infoEmail)
        infoEmail.textContent = email;


    displayNameInput.value =
        user.displayName || "";


    formatMemberSince(user);

    updateAvatar(user);
}


// ============================================================
// LOAD FIRESTORE PROFILE
// ============================================================

async function loadFirestoreProfile(user) {

    try {

        const userRef =
            doc(db, "users", user.uid);

        const snapshot =
            await getDoc(userRef);


        if (snapshot.exists()) {

            const data =
                snapshot.data();


            // -------------------------------
            // Name
            // -------------------------------

            if (
                data.displayName &&
                !user.displayName
            ) {

                profileName.textContent =
                    data.displayName;

                infoName.textContent =
                    data.displayName;

                displayNameInput.value =
                    data.displayName;
            }


            // -------------------------------
            // Streak
            // -------------------------------

            const streak =
                Number(data.streak || 0);

            if (profileStreak)
                profileStreak.textContent =
                    streak;


            // -------------------------------
            // Quran progress
            // -------------------------------

            const quran =
                Number(data.quranProgress || 0);

            updateQuranProgress(quran);


            // -------------------------------
            // Dhikr
            // -------------------------------

            const dhikr =
                Number(data.dhikrToday || 0);

            if (dhikrProgress)
                dhikrProgress.textContent =
                    dhikr;


            // -------------------------------
            // Achievements
            // -------------------------------

            const achievements =
                Array.isArray(data.achievements)
                    ? data.achievements.length
                    : Number(data.achievementCount || 0);

            if (achievementCount)
                achievementCount.textContent =
                    achievements;


            // -------------------------------
            // Last Surah
            // -------------------------------

            if (data.lastSurah) {

                lastSurah.textContent =
                    data.lastSurah;

            }


            if (data.lastAyah) {

                lastAyah.textContent =
                    data.lastAyah;

            }

        } else {

            // Create a basic profile
            // for the newly authenticated user.

            await setDoc(
                userRef,
                {
                    uid: user.uid,

                    displayName:
                        user.displayName || "",

                    email:
                        user.email || "",

                    streak: 0,

                    quranProgress: 0,

                    dhikrToday: 0,

                    achievementCount: 0,

                    createdAt:
                        serverTimestamp()
                },
                {
                    merge: true
                }
            );

        }

    } catch (error) {

        console.error(
            "Error loading Firestore profile:",
            error
        );

    }
}


// ============================================================
// QURAN PROGRESS
// ============================================================

function updateQuranProgress(value) {

    let progress =
        Number(value);

    if (isNaN(progress))
        progress = 0;

    progress =
        Math.max(
            0,
            Math.min(100, progress)
        );


    if (quranProgress)
        quranProgress.textContent =
            progress;

    if (quranProgressLabel)
        quranProgressLabel.textContent =
            `${progress}%`;

    if (quranProgressBar)
        quranProgressBar.style.width =
            `${progress}%`;
}


// ============================================================
// OPEN EDIT MODAL
// ============================================================

function openEditModal() {

    if (!editModal) return;

    if (currentUser) {

        displayNameInput.value =
            currentUser.displayName || "";

    }

    formMessage.textContent = "";

    editModal.hidden = false;

    document.body.style.overflow = "hidden";

    setTimeout(() => {

        displayNameInput.focus();

    }, 100);

}


// ============================================================
// CLOSE EDIT MODAL
// ============================================================

function closeEditModal() {

    if (!editModal) return;

    editModal.hidden = true;

    document.body.style.overflow = "";

}


// ============================================================
// EDIT BUTTON
// ============================================================

if (editButton) {

    editButton.addEventListener(
        "click",
        openEditModal
    );

}


// ============================================================
// CLOSE BUTTON
// ============================================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeEditModal
    );

}


// ============================================================
// CLOSE WHEN CLICKING OUTSIDE
// ============================================================

if (editModal) {

    editModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === editModal
            ) {

                closeEditModal();

            }

        }
    );

}


// ============================================================
// SAVE PROFILE
// ============================================================

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentUser) {

                formMessage.textContent =
                    "Please sign in first.";

                return;
            }


            const newName =
                displayNameInput.value.trim();


            if (!newName) {

                formMessage.textContent =
                    "Please enter your name.";

                return;
            }


            if (newName.length < 2) {

                formMessage.textContent =
                    "Name must contain at least 2 characters.";

                return;
            }


            try {

                saveButton.disabled = true;

                saveButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;


                // Update Firebase Authentication

                await updateProfile(
                    currentUser,
                    {
                        displayName: newName
                    }
                );


                // Update Firestore

                const userRef =
                    doc(
                        db,
                        "users",
                        currentUser.uid
                    );


                await setDoc(
                    userRef,
                    {
                        displayName: newName,

                        email:
                            currentUser.email || "",

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge: true
                    }
                );


                // Update page

                profileName.textContent =
                    newName;

                infoName.textContent =
                    newName;


                formMessage.textContent =
                    "Profile updated successfully.";

                showToast(
                    "Profile updated successfully."
                );


                setTimeout(() => {

                    closeEditModal();

                }, 700);


            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );


                formMessage.textContent =
                    getFirebaseErrorMessage(
                        error
                    );

            } finally {

                saveButton.disabled = false;

                saveButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Save Changes
                `;

            }

        }
    );

}


// ============================================================
// SIGN OUT
// ============================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "Are you sure you want to sign out of IQRANIX?"
                );


            if (!confirmed) return;


            try {

                await signOut(auth);

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Sign out error:",
                    error
                );

                showToast(
                    "Unable to sign out. Please try again."
                );

            }

        }
    );

}


// ============================================================
// FIREBASE ERROR MESSAGES
// ============================================================

function getFirebaseErrorMessage(error) {

    if (!error?.code)
        return "Something went wrong. Please try again.";


    switch (error.code) {

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        case "auth/requires-recent-login":
            return "Please sign in again before changing your profile.";

        case "permission-denied":
            return "You don't have permission to update this profile.";

        default:
            return (
                error.message ||
                "Something went wrong. Please try again."
            );

    }

}


// ============================================================
// AUTHENTICATION STATE
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            // Not signed in.
            // Send them back to login.

            window.location.href =
                "login.html";

            return;
        }


        // Store current user

        currentUser = user;


        // Display Firebase Auth information

        displayUser(user);


        // Load Firestore information

        await loadFirestoreProfile(user);


        console.log(
            "IQRANIX profile loaded for:",
            user.email
        );

    }
);


// ============================================================
// PREVENT MODAL SCROLL LOCK ON PAGE HIDE
// ============================================================

window.addEventListener(
    "pageshow",
    () => {

        document.body.style.overflow = "";

    }
);