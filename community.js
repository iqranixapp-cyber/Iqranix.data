// ============================================================
// IQRANIX COMMUNITY
// Premium Community Controller
//
// IMPORTANT:
// Firebase user must be signed in.
// Firestore users/{uid} must contain a username.
//
// COMMUNITY NAME:
// Uses Firestore username first.
// Google displayName is NOT used as the Community username.
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
    collection,
    doc,
    getDoc,
    query,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);


let currentUser = null;

let currentUserData = null;

let communityAccessGranted = false;

let redirecting = false;

let feedUnsubscribe = null;

let groupsUnsubscribe = null;

let storiesUnsubscribe = null;


// ============================================================
// LOCK PAGE
// ============================================================

document.documentElement.classList.add("community-lock");

document.body.classList.add("community-locked");


const communityApp =
    $("#communityApp");

const accessLoader =
    $("#communityAccessLoader");


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        console.log(
            "IQRANIX Community auth:",
            user ? user.uid : "SIGNED OUT"
        );


        if (!user) {

            redirectTo("login.html");

            return;
        }


        currentUser = user;


        try {

            await verifyCommunityIdentity(user);

        } catch (error) {

            console.error(
                "Community identity error:",
                error
            );

            redirectTo("create-username.html");
        }

    }
);


// ============================================================
// VERIFY FIRESTORE PROFILE
// ============================================================

async function verifyCommunityIdentity(user) {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const snapshot =
        await getDoc(userRef);


    if (!snapshot.exists()) {

        console.warn(
            "No Firestore profile."
        );

        redirectTo(
            "create-username.html"
        );

        return;
    }


    currentUserData =
        snapshot.data();


    /*
     * IMPORTANT:
     *
     * Username comes ONLY from Firestore.
     *
     * We do NOT use:
     *
     * user.displayName
     *
     * because that is the Google account name.
     */

    const username =
        String(
            currentUserData.username || ""
        )
        .trim()
        .toLowerCase();


    if (!username) {

        console.warn(
            "User has no username."
        );

        redirectTo(
            "create-username.html"
        );

        return;
    }


    if (
        currentUserData.communityAccess === false
    ) {

        console.warn(
            "Community access disabled."
        );

        redirectTo(
            "create-username.html"
        );

        return;
    }


    communityAccessGranted = true;


    console.log(
        "Community access granted:",
        `@${username}`
    );


    unlockCommunity();

    initialiseCommunity();

}


// ============================================================
// REDIRECT
// ============================================================

function redirectTo(page) {

    if (redirecting) {
        return;
    }


    redirecting = true;

    communityAccessGranted = false;


    if (communityApp) {
        communityApp.style.display = "none";
    }


    if (accessLoader) {
        accessLoader.style.display = "flex";
    }


    window.location.replace(page);

}


// ============================================================
// UNLOCK
// ============================================================

function unlockCommunity() {

    if (!communityAccessGranted) {
        return;
    }


    document.documentElement.classList.remove(
        "community-lock"
    );

    document.body.classList.remove(
        "community-locked"
    );


    if (communityApp) {

        communityApp.style.display = "";

        communityApp.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (accessLoader) {

        accessLoader.style.opacity = "0";

        setTimeout(
            () => {
                accessLoader.style.display = "none";
            },
            250
        );

    }

}


// ============================================================
// INITIALISE
// ============================================================

function initialiseCommunity() {

    if (!communityAccessGranted) {
        return;
    }


    updateUserInterface();

    setupNavigation();

    setupCreateSheet();

    setupFeedTabs();

    setupFilters();

    setupSearch();

    setupMenu();

    setupLogout();

    loadGroups();

    loadStories();

    loadPosts();

}


// ============================================================
// USER INTERFACE
// ============================================================

function updateUserInterface() {

    if (
        !currentUser ||
        !currentUserData
    ) {
        return;
    }


    /*
     * THIS IS THE IMPORTANT FIX.
     *
     * Community displays username from:
     *
     * users/{uid}.username
     *
     * not Google displayName.
     */

    const username =
        String(
            currentUserData.username || "member"
        )
        .trim();


    /*
     * If you want the Community greeting to say:
     *
     * Welcome, Bilal
     *
     * and username is:
     *
     * bilal
     *
     * we use the username itself.
     */

    const displayUsername =
        username;


    const firstName =
        displayUsername
            .replace(/^@/, "")
            .split(/\s+/)[0];


    const welcome =
        $("#welcomeUsername");


    if (welcome) {
        welcome.textContent =
            firstName;
    }


    const avatar =
        $("#profileAvatar");


    const menuAvatar =
        $("#menuAvatar");


    const initial =
        firstName
            .charAt(0)
            .toUpperCase() || "I";


    if (avatar) {
        avatar.textContent = initial;
    }


    if (menuAvatar) {
        menuAvatar.textContent = initial;
    }


    const menuUsername =
        $("#menuUsername");


    const menuHandle =
        $("#menuHandle");


    if (menuUsername) {
        menuUsername.textContent =
            firstName;
    }


    if (menuHandle) {
        menuHandle.textContent =
            `@${username.replace(/^@/, "")}`;
    }

}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    $("#profileMiniBtn")
        ?.addEventListener(
            "click",
            openProfile
        );


    $("#bottomProfileBtn")
        ?.addEventListener(
            "click",
            openProfile
        );


    $("#menuProfileBtn")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                openProfile();

            }
        );


    $("#groupsBtn")
        ?.addEventListener(
            "click",
            openGroups
        );


    $("#viewGroupsBtn")
        ?.addEventListener(
            "click",
            openGroups
        );


    $("#menuGroups")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                openGroups();

            }
        );


    $("#leaderboardBtn")
        ?.addEventListener(
            "click",
            openLeaderboard
        );


    $("#menuLeaderboard")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                openLeaderboard();

            }
        );


    /*
     * REELS BUTTON
     *
     * This is ONLY the dedicated
     * "Open Reels" button.
     *
     * The floating + button does NOT
     * use this function.
     */

    $("#reelsBtn")
        ?.addEventListener(
            "click",
            openReels
        );


    $("#menuReels")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                openReels();

            }
        );


    $("#menuMessages")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                window.location.href =
                    "messages.html";

            }
        );


    $("#savedPostsMenu")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                window.location.href =
                    "saved.html";

            }
        );


    $("#notificationBtn")
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "notifications.html";

            }
        );


    $("#notificationsMenu")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                window.location.href =
                    "notifications.html";

            }
        );


    $("#menuSettings")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                window.location.href =
                    "settings.html";

            }
        );


    $("#menuHelp")
        ?.addEventListener(
            "click",
            () => {

                closeMenu();

                window.location.href =
                    "faq.html";

            }
        );


    $("#watchStories")
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "stories.html";

            }
        );

}


// ============================================================
// NAVIGATION FUNCTIONS
// ============================================================

function openProfile() {

    if (!communityAccessGranted) {
        return;
    }

    window.location.href =
        "profile.html";
}


function openGroups() {

    if (!communityAccessGranted) {
        return;
    }

    window.location.href =
        "groups.html";
}


function openLeaderboard() {

    if (!communityAccessGranted) {
        return;
    }

    window.location.href =
        "leaderboard.html";
}


function openReels() {

    if (!communityAccessGranted) {
        return;
    }

    window.location.href =
        "reels.html";
}


// ============================================================
// CREATE SHEET
//
// IMPORTANT FIX:
//
// + button -> ONLY opens sheet.
//
// It does NOT open reels.html.
//
// Story -> story-create.html
// Post  -> post-create.html
// Reel  -> create-reel.html
// ============================================================

function setupCreateSheet() {

    const overlay =
        $("#actionOverlay");


    const openButton =
        $("#bottomCreate");


    const closeButton =
        $("#closeActions");


    if (!overlay || !openButton) {
        return;
    }


    openButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            openCreateSheet();

        }
    );


    closeButton?.addEventListener(
        "click",
        closeCreateSheet
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeCreateSheet();

            }

        }
    );


    /*
     * STORY
     */

    $("#addStoryOption")
        ?.addEventListener(
            "click",
            () => {

                closeCreateSheet();

                window.location.href =
                    "story-create.html";

            }
        );


    /*
     * POST
     */

    $("#addPostOption")
        ?.addEventListener(
            "click",
            () => {

                closeCreateSheet();

                window.location.href =
                    "post-create.html";

            }
        );


    /*
     * REEL
     *
     * This is intentionally different
     * from the normal Open Reels button.
     */

    $("#createReelOption")
        ?.addEventListener(
            "click",
            () => {

                closeCreateSheet();

                window.location.href =
                    "create-reel.html";

            }
        );

}


function openCreateSheet() {

    const overlay =
        $("#actionOverlay");


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";

}


function closeCreateSheet() {

    const overlay =
        $("#actionOverlay");


    if (!overlay) {
        return;
    }


    overlay.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const button =
        $("#communitySearchBtn");


    const search =
        $("#communitySearch");


    const close =
        $("#closeSearchBtn");


    const input =
        $("#communitySearchInput");


    button?.addEventListener(
        "click",
        () => {

            search?.classList.toggle(
                "active"
            );

            if (
                search?.classList.contains(
                    "active"
                )
            ) {

                input?.focus();

            }

        }
    );


    close?.addEventListener(
        "click",
        () => {

            search?.classList.remove(
                "active"
            );

            if (input) {
                input.value = "";
            }

        }
    );

}


// ============================================================
// FEED TABS
// ============================================================

function setupFeedTabs() {

    $$(".feed-tab")
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        $$(".feed-tab")
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        tab.classList.add(
                            "active"
                        );


                        const type =
                            tab.dataset.tab;


                        console.log(
                            "Feed tab:",
                            type
                        );

                    }
                );

            }
        );

}


// ============================================================
// FILTER
// ============================================================

function setupFilters() {

    const button =
        $("#filterBtn");


    const panel =
        $("#communityFilterPanel");


    button?.addEventListener(
        "click",
        () => {

            panel?.classList.toggle(
                "active"
            );

        }
    );


    panel?.querySelectorAll(
        "button"
    ).forEach(
        filterButton => {

            filterButton.addEventListener(
                "click",
                () => {

                    panel.classList.remove(
                        "active"
                    );

                    showToast(
                        "Feed filter updated.",
                        "fa-solid fa-sliders"
                    );

                }
            );

        }
    );

}


// ============================================================
// MENU
// ============================================================

function setupMenu() {

    $("#menuBtn")
        ?.addEventListener(
            "click",
            openMenu
        );


    $("#communityMenuClose")
        ?.addEventListener(
            "click",
            closeMenu
        );


    $("#communityMenuOverlay")
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "communityMenuOverlay"
                ) {

                    closeMenu();

                }

            }
        );

}


function openMenu() {

    $("#communityMenuOverlay")
        ?.classList.add(
            "active"
        );

    document.body.style.overflow =
        "hidden";

}


function closeMenu() {

    $("#communityMenuOverlay")
        ?.classList.remove(
            "active"
        );

    document.body.style.overflow =
        "";

}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    $("#logoutBtn")
        ?.addEventListener(
            "click",
            async () => {

                try {

                    await signOut(auth);

                    window.location.replace(
                        "login.html"
                    );

                } catch (error) {

                    console.error(
                        "Logout failed:",
                        error
                    );

                    showToast(
                        "Unable to sign out.",
                        "fa-solid fa-circle-exclamation"
                    );

                }

            }
        );

}


// ============================================================
// GROUPS
// ============================================================

function loadGroups() {

    const container =
        $("#communityGroups");


    if (!container) {
        return;
    }


    const groupsRef =
        collection(
            db,
            "groups"
        );


    const groupsQuery =
        query(
            groupsRef,
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(6)
        );


    groupsUnsubscribe =
        onSnapshot(
            groupsQuery,
            snapshot => {

                if (snapshot.empty) {

                    renderEmptyGroups(
                        container
                    );

                    return;
                }


                container.innerHTML =
                    "";


                snapshot.forEach(
                    groupDoc => {

                        container.appendChild(
                            createGroupCard(
                                groupDoc.id,
                                groupDoc.data()
                            )
                        );

                    }
                );

            },
            error => {

                console.warn(
                    "Groups:",
                    error
                );

                renderEmptyGroups(
                    container
                );

            }
        );

}


// ============================================================
// GROUP CARD
// ============================================================

function createGroupCard(
    id,
    group
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "community-group-card";


    const name =
        group.name ||
        "IQRANIX Group";


    const description =
        group.description ||
        "Grow, learn and compete together.";


    const members =
        Number(
            group.memberCount || 0
        );


    const icon =
        group.icon ||
        "fa-users";


    card.innerHTML = `

        <div class="group-card-top">

            <div class="group-icon">
                <i class="fa-solid ${safeIcon(icon)}"></i>
            </div>

            <span class="group-members">
                ${members} members
            </span>

        </div>

        <h3>
            ${escapeHTML(name)}
        </h3>

        <p>
            ${escapeHTML(description)}
        </p>

        <button
            class="group-open-btn"
            type="button"
        >
            Enter Group
            <i class="fa-solid fa-arrow-right"></i>
        </button>
    `;


    card
        .querySelector(
            ".group-open-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    `groups.html?id=${encodeURIComponent(id)}`;

            }
        );


    return card;

}


// ============================================================
// EMPTY GROUPS
// ============================================================

function renderEmptyGroups(container) {

    container.innerHTML = `

        <div class="community-empty-groups">

            <div class="community-empty-icon">
                <i class="fa-solid fa-users"></i>
            </div>

            <h3>
                Find your people
            </h3>

            <p>
                Join an IQRANIX group and grow together
                through beneficial activities.
            </p>

            <button
                type="button"
                id="browseGroupsButton"
            >
                Browse Groups
                <i class="fa-solid fa-arrow-right"></i>
            </button>

        </div>
    `;


    $("#browseGroupsButton")
        ?.addEventListener(
            "click",
            openGroups
        );

}


// ============================================================
// STORIES
// ============================================================

function loadStories() {

    const container =
        $("#storiesContainer");


    if (!container) {
        return;
    }


    const storiesRef =
        collection(
            db,
            "stories"
        );


    const storiesQuery =
        query(
            storiesRef,
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(15)
        );


    storiesUnsubscribe =
        onSnapshot(
            storiesQuery,
            snapshot => {

                renderStories(
                    container,
                    snapshot
                );

            },
            error => {

                console.warn(
                    "Stories:",
                    error
                );

                renderStories(
                    container,
                    null
                );

            }
        );

}


// ============================================================
// STORIES RENDER
// ============================================================

function renderStories(
    container,
    snapshot
) {

    container.innerHTML =
        "";


    const yourStory =
        document.createElement(
            "button"
        );


    yourStory.type =
        "button";


    yourStory.className =
        "story-item";


    yourStory.innerHTML = `

        <div class="story-ring">

            <div class="story-plus">
                <i class="fa-solid fa-plus"></i>
            </div>

        </div>

        <span>
            Your Story
        </span>
    `;


    yourStory.addEventListener(
        "click",
        () => {

            window.location.href =
                "story-create.html";

        }
    );


    container.appendChild(
        yourStory
    );


    if (!snapshot) {
        return;
    }


    snapshot.forEach(
        storyDoc => {

            const story =
                storyDoc.data();


            if (
                currentUser &&
                story.uid === currentUser.uid
            ) {
                return;
            }


            const username =
                String(
                    story.username ||
                    "Member"
                );


            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "story-item";


            item.innerHTML = `

                <div class="story-ring">

                    <div class="story-inner">

                        <div class="story-placeholder">

                            <i class="fa-solid fa-user"></i>

                        </div>

                    </div>

                </div>

                <span>
                    ${escapeHTML(username)}
                </span>
            `;


            item.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `stories.html?id=${encodeURIComponent(storyDoc.id)}`;

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


// ============================================================
// POSTS
// ============================================================

function loadPosts() {

    const container =
        $("#communityFeed");


    if (!container) {
        return;
    }


    const postsRef =
        collection(
            db,
            "posts"
        );


    const postsQuery =
        query(
            postsRef,
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(15)
        );


    feedUnsubscribe =
        onSnapshot(
            postsQuery,
            snapshot => {

                if (snapshot.empty) {

                    renderEmptyFeed(
                        container
                    );

                    return;
                }


                container.innerHTML =
                    "";


                snapshot.forEach(
                    postDoc => {

                        container.appendChild(
                            createPostCard(
                                postDoc.id,
                                postDoc.data()
                            )
                        );

                    }
                );

            },
            error => {

                console.warn(
                    "Posts:",
                    error
                );

                renderEmptyFeed(
                    container
                );

            }
        );

}


// ============================================================
// POST CARD
// ============================================================

function createPostCard(
    id,
    post
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "community-post";


    /*
     * IMPORTANT:
     *
     * Posts should store username.
     *
     * If username exists we use it.
     *
     * We do NOT use Google displayName
     * as the preferred community identity.
     */

    const username =
        String(
            post.username ||
            "IQRANIX Member"
        );


    const initial =
        username
            .replace(/^@/, "")
            .charAt(0)
            .toUpperCase() || "I";


    const content =
        String(
            post.content ||
            post.text ||
            ""
        );


    article.innerHTML = `

        <div class="post-header">

            <div class="post-avatar">
                ${escapeHTML(initial)}
            </div>

            <div class="post-author">

                <strong>
                    ${escapeHTML(username)}
                </strong>

                <span>
                    @${escapeHTML(
                        username
                            .replace(/^@/, "")
                    )}
                </span>

            </div>

            <button
                class="post-more"
                aria-label="Post options"
            >
                <i class="fa-solid fa-ellipsis"></i>
            </button>

        </div>

        <div class="post-content">
            ${escapeHTML(content)}
        </div>

        <div class="post-actions">

            <button type="button">
                <i class="fa-regular fa-heart"></i>
                Like
            </button>

            <button type="button">
                <i class="fa-regular fa-comment"></i>
                Comment
            </button>

            <button type="button">
                <i class="fa-regular fa-bookmark"></i>
                Save
            </button>

        </div>
    `;


    return article;

}


// ============================================================
// EMPTY FEED
// ============================================================

function renderEmptyFeed(container) {

    container.innerHTML = `

        <div class="community-empty-groups">

            <div class="community-empty-icon">
                <i class="fa-solid fa-mosque"></i>
            </div>

            <h3>
                Start the conversation
            </h3>

            <p>
                Be the first to share something beneficial
                with the IQRANIX Ummah.
            </p>

            <button
                type="button"
                id="firstPostButton"
            >
                + Share something
            </button>

        </div>
    `;


    $("#firstPostButton")
        ?.addEventListener(
            "click",
            openCreateSheet
        );

}


// ============================================================
// TOAST
// ============================================================

function showToast(
    message,
    icon = "fa-solid fa-circle-check"
) {

    const toast =
        $("#communityToast");


    const iconElement =
        $("#toastIcon");


    const messageElement =
        $("#toastMessage");


    if (
        !toast ||
        !messageElement
    ) {
        return;
    }


    if (iconElement) {
        iconElement.className =
            icon;
    }


    messageElement.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


// ============================================================
// KEYBOARD / ESC
// ============================================================

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            closeCreateSheet();

            closeMenu();

        }
    );

}


// ============================================================
// SECURITY HELPERS
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function safeIcon(icon) {

    const allowed =
        [
            "fa-users",
            "fa-heart",
            "fa-book-quran",
            "fa-mosque",
            "fa-star",
            "fa-graduation-cap",
            "fa-hands-praying"
        ];


    return allowed.includes(icon)
        ? icon
        : "fa-users";

}