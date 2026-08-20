// ============================================================
// IQRANIX CREATE USERNAME
// Firebase Authentication + Cloud Firestore
// ============================================================

import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged,
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

const usernameInput =
  document.getElementById("usernameInput");

const usernameStatus =
  document.getElementById("usernameStatus");

const continueBtn =
  document.getElementById("continueBtn");

const buttonText =
  document.getElementById("buttonText");

const buttonSpinner =
  document.getElementById("buttonSpinner");

const logoutBtn =
  document.getElementById("logoutBtn");

const errorBox =
  document.getElementById("errorBox");


// ============================================================
// STATE
// ============================================================

let currentUser = null;
let usernameAvailable = false;
let checkingUsername = false;
let usernameTimer = null;


// ============================================================
// USERNAME VALIDATION
// ============================================================

function validateUsername(username) {

  if (!username) {
    return {
      valid: false,
      message: ""
    };
  }

  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters."
    };
  }

  if (username.length > 20) {
    return {
      valid: false,
      message: "Username must be 20 characters or less."
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message:
        "Use only lowercase letters, numbers and underscores."
    };
  }

  return {
    valid: true,
    message: ""
  };
}


// ============================================================
// STATUS
// ============================================================

function showStatus(message, type = "") {

  usernameStatus.textContent = message;

  usernameStatus.className = "status";

  if (type) {
    usernameStatus.classList.add(type);
  }
}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function hideError() {

  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}


// ============================================================
// BUTTON
// ============================================================

function updateButton() {

  continueBtn.disabled =
    !usernameAvailable ||
    checkingUsername ||
    !currentUser;
}


// ============================================================
// NORMALIZE USERNAME
// ============================================================

function normalizeUsername(value) {

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}


// ============================================================
// CHECK USERNAME
// ============================================================

async function checkUsername() {

  if (!currentUser) {
    showError(
      "Your IQRANIX account is not ready yet. Please wait a moment."
    );

    return;
  }

  const username =
    normalizeUsername(usernameInput.value);

  usernameInput.value = username;

  usernameAvailable = false;

  hideError();

  const validation =
    validateUsername(username);

  if (!username) {

    showStatus("");

    checkingUsername = false;

    updateButton();

    return;
  }

  if (!validation.valid) {

    showStatus(
      validation.message,
      "error"
    );

    checkingUsername = false;

    updateButton();

    return;
  }


  checkingUsername = true;

  updateButton();

  showStatus(
    "Checking availability...",
    "checking"
  );


  try {

    // --------------------------------------------------------
    // IMPORTANT:
    // The username itself is the Firestore document ID.
    //
    // usernames/jayjay
    // usernames/muslim_bro
    // usernames/iqranix
    // --------------------------------------------------------

    const usernameRef =
      doc(
        db,
        "usernames",
        username
      );


    const usernameSnapshot =
      await getDoc(usernameRef);


    if (usernameSnapshot.exists()) {

      const data =
        usernameSnapshot.data();

      // Allow the same user to continue if they
      // already own this username.
      if (
        data.uid &&
        data.uid === currentUser.uid
      ) {

        usernameAvailable = true;

        showStatus(
          "✓ This is your username.",
          "available"
        );

      } else {

        usernameAvailable = false;

        showStatus(
          "✕ This username is already taken.",
          "taken"
        );
      }

    } else {

      usernameAvailable = true;

      showStatus(
        "✓ Username is available.",
        "available"
      );
    }

  } catch (error) {

    console.error(
      "USERNAME CHECK ERROR:",
      error
    );

    usernameAvailable = false;

    showStatus(
      "Unable to check username.",
      "error"
    );

    showError(
      "Firebase could not check the username. Please check your internet connection and try again."
    );

  } finally {

    checkingUsername = false;

    updateButton();
  }
}


// ============================================================
// USERNAME INPUT
// ============================================================

usernameInput.addEventListener(
  "input",
  () => {

    clearTimeout(usernameTimer);

    usernameAvailable = false;

    checkingUsername = false;

    hideError();

    const normalized =
      normalizeUsername(usernameInput.value);

    usernameInput.value = normalized;

    updateButton();


    if (!normalized) {

      showStatus("");

      return;
    }


    const validation =
      validateUsername(normalized);

    if (!validation.valid) {

      showStatus(
        validation.message,
        "error"
      );

      return;
    }


    showStatus(
      "Checking availability...",
      "checking"
    );


    usernameTimer =
      setTimeout(
        checkUsername,
        500
      );
  }
);


// ============================================================
// CREATE USERNAME
// ============================================================

async function createUsername() {

  if (!currentUser) {

    showError(
      "You are not signed in."
    );

    return;
  }

  const username =
    normalizeUsername(usernameInput.value);


  const validation =
    validateUsername(username);


  if (!validation.valid) {

    showStatus(
      validation.message,
      "error"
    );

    return;
  }


  // Check one more time before writing.
  // This prevents a stale availability result.
  checkingUsername = true;

  updateButton();

  buttonText.textContent = "Securing...";

  buttonSpinner.classList.remove("hidden");

  hideError();


  try {

    const usernameRef =
      doc(
        db,
        "usernames",
        username
      );


    // --------------------------------------------------------
    // FINAL AVAILABILITY CHECK
    // --------------------------------------------------------

    const existing =
      await getDoc(usernameRef);


    if (existing.exists()) {

      const existingData =
        existing.data();

      // Already belongs to this user.
      if (
        existingData.uid !== currentUser.uid
      ) {

        usernameAvailable = false;

        showStatus(
          "✕ This username has just been taken.",
          "taken"
        );

        return;
      }

    }


    // --------------------------------------------------------
    // CREATE USERNAME RECORD
    // --------------------------------------------------------

    await setDoc(
      usernameRef,
      {
        uid: currentUser.uid,
        username: username,
        createdAt: serverTimestamp()
      }
    );


    // --------------------------------------------------------
    // ALSO SAVE USERNAME TO USER PROFILE
    // --------------------------------------------------------

    const userRef =
      doc(
        db,
        "users",
        currentUser.uid
      );


    await setDoc(
      userRef,
      {
        username: username,
        usernameUpdatedAt: serverTimestamp()
      },
      {
        merge: true
      }
    );


    // --------------------------------------------------------
    // SAVE LOCALLY
    // --------------------------------------------------------

    localStorage.setItem(
      "iqranix_username",
      username
    );


    localStorage.setItem(
      "iqranix_username_created",
      "true"
    );


    showStatus(
      "✓ Username secured successfully!",
      "available"
    );


    buttonText.textContent =
      "Success ✓";


    // --------------------------------------------------------
    // GO TO APP
    // --------------------------------------------------------

    setTimeout(
      () => {

        window.location.href =
          "index.html";

      },
      700
    );


  } catch (error) {

    console.error(
      "CREATE USERNAME ERROR:",
      error
    );


    showError(
      getFirebaseErrorMessage(error)
    );


    buttonText.textContent =
      "Continue";

  } finally {

    checkingUsername = false;

    buttonSpinner.classList.add("hidden");

    updateButton();
  }
}


// ============================================================
// CONTINUE BUTTON
// ============================================================

continueBtn.addEventListener(
  "click",
  createUsername
);


// ============================================================
// SIGN OUT
// ============================================================

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      window.location.href =
        "login.html";

    } catch (error) {

      console.error(
        "SIGN OUT ERROR:",
        error
      );

      showError(
        "Unable to sign out. Please try again."
      );
    }
  }
);


// ============================================================
// FIREBASE ERROR MESSAGE
// ============================================================

function getFirebaseErrorMessage(error) {

  console.error(error);

  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (
    error.code ===
    "permission-denied"
  ) {

    return "Firestore permission was denied. Please make sure the new Firestore rules are published.";
  }

  if (
    error.code ===
    "unavailable"
  ) {

    return "Firebase is temporarily unavailable. Check your internet connection and try again.";
  }

  if (
    error.code ===
    "failed-precondition"
  ) {

    return "Firebase could not complete this request. Please try again.";
  }

  if (
    error.code ===
    "unauthenticated"
  ) {

    return "Your login session has expired. Please sign in again.";
  }

  return (
    error.message ||
    "Unable to create your username."
  );
}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      currentUser = null;

      updateButton();

      showError(
        "You are not signed in. Redirecting to login..."
      );

      setTimeout(
        () => {

          window.location.href =
            "login.html";

        },
        1200
      );

      return;
    }


    currentUser = user;

    console.log(
      "IQRANIX USER:",
      user.uid
    );


    // User is authenticated.
    // The username page can now use Firestore.
    updateButton();

  }
);