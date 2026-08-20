// ============================================================
// IQRANIX GROUPS
// Username search + group creation
//
// FIRESTORE STRUCTURE:
//
// users/{uid}
//     username
//     displayName
//
// groups/{groupId}
//     name
//     description
//     ownerId
//     ownerUsername
//     members: [uid, uid, uid]
//     memberCount
//     createdAt
//     updatedAt
//     status: "active"
//
// Designed so we can connect groups to the leaderboard later.
// ============================================================


import {
    auth,
    db
} from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    limit,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ============================================================
// ELEMENT HELPER
// ============================================================

const $ = (selector) =>
    document.querySelector(selector);


// ============================================================
// STATE
// ============================================================

let currentUser = null;

let currentUserData = null;

let selectedMembers = [];

let searchTimer = null;

let toastTimer = null;

let createdGroupId = null;


// ============================================================
// ELEMENTS
// ============================================================

const loader =
    $("#accessLoader");

const app =
    $("#groupsApp");

const searchInput =
    $("#usernameSearch");

const searchResults =
    $("#searchResults");

const selectedSection =
    $("#selectedSection");

const selectedMembersContainer =
    $("#selectedMembers");

const memberCount =
    $("#memberCount");

const createButton =
    $("#createGroupBtn");

const groupNameInput =
    $("#groupName");

const groupDescriptionInput =
    $("#groupDescription");


// ============================================================
// INITIAL STATE
// ============================================================

if (app) {
    app.style.visibility = "hidden";
}


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        currentUser =
            user;


        try {

            await loadCurrentUser();

            unlockPage();

            initialise();

        } catch (error) {

            console.error(
                "Groups identity error:",
                error
            );

            window.location.replace(
                "create-username.html"
            );

        }

    }
);


// ============================================================
// LOAD CURRENT USER
// ============================================================

async function loadCurrentUser() {

    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    const snapshot =
        await getDoc(
            userRef
        );


    if (!snapshot.exists()) {
        throw new Error(
            "IQRANIX profile does not exist."
        );
    }


    const data =
        snapshot.data();


    const username =
        String(
            data.username || ""
        )
        .trim()
        .toLowerCase();


    if (!username) {
        throw new Error(
            "Username has not been created."
        );
    }


    currentUserData =
        data;

}


// ============================================================
// UNLOCK
// ============================================================

function unlockPage() {

    if (app) {
        app.style.visibility = "visible";
    }


    if (loader) {

        loader.style.opacity = "0";

        setTimeout(
            () => {

                loader.style.display =
                    "none";

            },
            250
        );

    }

}


// ============================================================
// INITIALISE
// ============================================================

function initialise() {

    setupBackButton();

    setupCharacterCounters();

    setupUsernameSearch();

    setupMemberControls();

    setupCreateGroup();

    setupModal();

}


// ============================================================
// BACK BUTTON
// ============================================================

function setupBackButton() {

    $("#backBtn")?.addEventListener(
        "click",
        () => {

            if (
                document.referrer &&
                document.referrer.includes(
                    location.origin
                )
            ) {

                history.back();

            } else {

                window.location.href =
                    "community.html";

            }

        }
    );

}


// ============================================================
// CHARACTER COUNTERS
// ============================================================

function setupCharacterCounters() {

    groupNameInput?.addEventListener(
        "input",
        () => {

            $("#groupNameCount").textContent =
                groupNameInput.value.length;

            updateCreateButton();

        }
    );


    groupDescriptionInput?.addEventListener(
        "input",
        () => {

            $("#groupDescriptionCount").textContent =
                groupDescriptionInput.value.length;

        }
    );

}


// ============================================================
// USERNAME SEARCH
// ============================================================

function setupUsernameSearch() {

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value
                    .trim()
                    .replace(/^@/, "")
                    .toLowerCase();


            $("#clearSearchBtn")
                ?.classList.toggle(
                    "hidden",
                    !value
                );


            clearTimeout(
                searchTimer
            );


            if (!value) {

                renderSearchStart();

                return;

            }


            if (value.length < 2) {

                renderSearchMessage(
                    "Keep typing",
                    "Enter at least 2 characters of a username.",
                    "fa-keyboard"
                );

                return;

            }


            searchTimer =
                setTimeout(
                    () => {

                        searchUsers(
                            value
                        );

                    },
                    350
                );

        }
    );


    $("#clearSearchBtn")?.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            $("#clearSearchBtn")
                .classList.add(
                    "hidden"
                );

            renderSearchStart();

            searchInput.focus();

        }
    );

}


// ============================================================
// SEARCH USERS
// ============================================================

async function searchUsers(
    username
) {

    showSearchLoading();


    try {

        const usersRef =
            collection(
                db,
                "users"
            );


        /*
         * Username prefix search.
         *
         * Usernames are stored lowercase.
         */

        const usersQuery =
            query(
                usersRef,
                where(
                    "username",
                    ">=",
                    username
                ),
                where(
                    "username",
                    "<=",
                    username + "\uf8ff"
                ),
                limit(20)
            );


        const snapshot =
            await getDocs(
                usersQuery
            );


        const results = [];


        snapshot.forEach(
            userDoc => {

                const data =
                    userDoc.data();


                // Never show the current user
                // as someone to add.

                if (
                    userDoc.id ===
                    currentUser.uid
                ) {
                    return;
                }


                const normalizedUsername =
                    String(
                        data.username || ""
                    )
                    .trim()
                    .toLowerCase();


                if (!normalizedUsername) {
                    return;
                }


                results.push({

                    uid:
                        userDoc.id,

                    username:
                        normalizedUsername,

                    displayName:
                        data.displayName ||
                        data.name ||
                        normalizedUsername,

                    photoURL:
                        data.photoURL ||
                        data.profilePhoto ||
                        ""

                });

            }
        );


        renderSearchResults(
            results
        );


    } catch (error) {

        console.error(
            "Username search failed:",
            error
        );


        renderSearchMessage(
            "Search unavailable",
            "We couldn't search usernames right now. Please try again.",
            "fa-triangle-exclamation"
        );

    }

}


// ============================================================
// SEARCH LOADING
// ============================================================

function showSearchLoading() {

    $("#searchSpinner")
        ?.classList.remove(
            "hidden"
        );


    searchResults.innerHTML = `

        <div class="search-empty">

            <div class="search-empty-icon">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>

            <strong>
                Finding people...
            </strong>

            <span>
                Searching IQRANIX usernames.
            </span>

        </div>

    `;

}


// ============================================================
// RENDER SEARCH RESULTS
// ============================================================

function renderSearchResults(
    users
) {

    $("#searchSpinner")
        ?.classList.add(
            "hidden"
        );


    if (!users.length) {

        renderSearchMessage(
            "No one found",
            "Try checking the username spelling.",
            "fa-user-slash"
        );

        return;

    }


    searchResults.innerHTML =
        "";


    users.forEach(
        user => {

            const alreadySelected =
                selectedMembers.some(
                    member =>
                        member.uid === user.uid
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "user-result";


            button.innerHTML = `

                ${createAvatar(
                    user,
                    "user-result-avatar"
                )}

                <div class="user-result-info">

                    <strong>
                        ${escapeHTML(
                            user.displayName
                        )}
                    </strong>

                    <span>
                        @${escapeHTML(
                            user.username
                        )}
                    </span>

                </div>

                <div class="user-result-action">

                    <i class="fa-solid ${
                        alreadySelected
                            ? "fa-check"
                            : "fa-plus"
                    }"></i>

                </div>

            `;


            if (alreadySelected) {

                button.style.opacity =
                    ".5";

                button.disabled =
                    true;

            } else {

                button.addEventListener(
                    "click",
                    () => {

                        addMember(
                            user
                        );

                    }
                );

            }


            searchResults.appendChild(
                button
            );

        }
    );

}


// ============================================================
// SEARCH START
// ============================================================

function renderSearchStart() {

    $("#searchSpinner")
        ?.classList.add(
            "hidden"
        );


    searchResults.innerHTML = `

        <div class="search-empty">

            <div class="search-empty-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>

            <strong>
                Search for someone
            </strong>

            <span>
                Enter at least 2 characters of a username.
            </span>

        </div>

    `;

}


// ============================================================
// SEARCH MESSAGE
// ============================================================

function renderSearchMessage(
    title,
    message,
    icon
) {

    $("#searchSpinner")
        ?.classList.add(
            "hidden"
        );


    searchResults.innerHTML = `

        <div class="search-empty">

            <div class="search-empty-icon">

                <i class="fa-solid ${icon}"></i>

            </div>

            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

    `;

}


// ============================================================
// ADD MEMBER
// ============================================================

function addMember(
    user
) {

    if (
        selectedMembers.some(
            member =>
                member.uid === user.uid
        )
    ) {
        return;
    }


    selectedMembers.push(
        user
    );


    renderSelectedMembers();

    updateCreateButton();


    /*
     * Refresh current search results so
     * the selected person gets a checkmark.
     */

    const term =
        searchInput.value
            .trim()
            .replace(/^@/, "")
            .toLowerCase();


    if (term.length >= 2) {

        searchUsers(
            term
        );

    }


    showToast(
        `${user.displayName} added`,
        "fa-user-plus"
    );

}


// ============================================================
// REMOVE MEMBER
// ============================================================

function removeMember(
    uid
) {

    selectedMembers =
        selectedMembers.filter(
            member =>
                member.uid !== uid
        );


    renderSelectedMembers();

    updateCreateButton();


    const term =
        searchInput.value
            .trim()
            .replace(/^@/, "")
            .toLowerCase();


    if (term.length >= 2) {

        searchUsers(
            term
        );

    }

}


// ============================================================
// MEMBER CONTROLS
// ============================================================

function setupMemberControls() {

    $("#clearMembersBtn")?.addEventListener(
        "click",
        () => {

            selectedMembers = [];

            renderSelectedMembers();

            updateCreateButton();


            showToast(
                "Selected members cleared",
                "fa-users-slash"
            );

        }
    );

}


// ============================================================
// RENDER SELECTED MEMBERS
// ============================================================

function renderSelectedMembers() {

    memberCount.textContent =
        selectedMembers.length;


    if (!selectedMembers.length) {

        selectedSection
            ?.classList.add(
                "hidden"
            );

        selectedMembersContainer.innerHTML =
            "";

        return;

    }


    selectedSection
        ?.classList.remove(
            "hidden"
        );


    selectedMembersContainer.innerHTML =
        "";


    selectedMembers.forEach(
        member => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "selected-member";


            item.innerHTML = `

                ${createAvatar(
                    member,
                    "selected-avatar"
                )}

                <div class="selected-info">

                    <strong>
                        ${escapeHTML(
                            member.displayName
                        )}
                    </strong>

                    <span>
                        @${escapeHTML(
                            member.username
                        )}
                    </span>

                </div>

                <button
                    type="button"
                    class="remove-member"
                    aria-label="Remove member"
                >

                    <i class="fa-solid fa-xmark"></i>

                </button>

            `;


            item
                .querySelector(
                    ".remove-member"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        removeMember(
                            member.uid
                        );

                    }
                );


            selectedMembersContainer.appendChild(
                item
            );

        }
    );

}


// ============================================================
// CREATE BUTTON STATE
// ============================================================

function updateCreateButton() {

    if (!createButton) {
        return;
    }


    const validName =
        groupNameInput.value
            .trim()
            .length >= 2;


    const hasMembers =
        selectedMembers.length >= 1;


    createButton.disabled =
        !validName ||
        !hasMembers;


    const hint =
        createButton.querySelector(
            ".create-button-text small"
        );


    if (!hint) {
        return;
    }


    if (!validName) {

        hint.textContent =
            "Enter a group name";

    } else if (!hasMembers) {

        hint.textContent =
            "Add at least one person";

    } else {

        hint.textContent =
            `${selectedMembers.length} member${
                selectedMembers.length === 1
                    ? ""
                    : "s"
            } selected`;

    }

}


// ============================================================
// CREATE GROUP
// ============================================================

function setupCreateGroup() {

    createButton?.addEventListener(
        "click",
        createGroup
    );

}


// ============================================================
// CREATE GROUP
// ============================================================

async function createGroup() {

    if (!currentUser) {
        return;
    }


    const name =
        groupNameInput.value
            .trim();


    const description =
        groupDescriptionInput.value
            .trim();


    if (name.length < 2) {

        showToast(
            "Enter a group name first",
            "fa-circle-exclamation"
        );

        groupNameInput.focus();

        return;

    }


    if (!selectedMembers.length) {

        showToast(
            "Add at least one person",
            "fa-user-plus"
        );

        return;

    }


    createButton.disabled =
        true;


    const originalHTML =
        createButton.innerHTML;


    createButton.innerHTML = `

        <span class="create-icon">

            <i class="fa-solid fa-spinner fa-spin"></i>

        </span>

        <span class="create-button-text">

            <strong>
                Creating group...
            </strong>

            <small>
                Setting everything up
            </small>

        </span>

    `;


    try {

        const ownerUsername =
            String(
                currentUserData.username || ""
            )
            .trim()
            .toLowerCase();


        /*
         * The owner is automatically a member.
         */

        const memberIds = [

            currentUser.uid,

            ...selectedMembers.map(
                member =>
                    member.uid
            )

        ];


        const uniqueMemberIds =
            [...new Set(memberIds)];


        const groupData = {

            name:
                name,

            description:
                description,

            ownerId:
                currentUser.uid,

            ownerUsername:
                ownerUsername,

            members:
                uniqueMemberIds,

            memberCount:
                uniqueMemberIds.length,

            status:
                "active",

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        };


        const groupRef =
            await addDoc(
                collection(
                    db,
                    "groups"
                ),
                groupData
            );


        createdGroupId =
            groupRef.id;


        console.log(
            "IQRANIX group created:",
            createdGroupId
        );


        showSuccessModal();


    } catch (error) {

        console.error(
            "Group creation failed:",
            error
        );


        createButton.innerHTML =
            originalHTML;


        updateCreateButton();


        showToast(
            getFirestoreErrorMessage(
                error
            ),
            "fa-triangle-exclamation"
        );

    }

}


// ============================================================
// SUCCESS MODAL
// ============================================================

function setupModal() {

    $("#openCreatedGroup")?.addEventListener(
        "click",
        () => {

            if (!createdGroupId) {
                return;
            }


            window.location.href =
                `group.html?id=${encodeURIComponent(
                    createdGroupId
                )}`;

        }
    );


    $("#closeSuccessModal")?.addEventListener(
        "click",
        () => {

            $("#successModal")
                ?.classList.add(
                    "hidden"
                );


            window.location.href =
                "groups.html";

        }
    );


    $("#successModal")?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("#successModal")
            ) {

                $("#successModal")
                    .classList.add(
                        "hidden"
                    );

            }

        }
    );

}


// ============================================================
// SHOW SUCCESS
// ============================================================

function showSuccessModal() {

    $("#successModal")
        ?.classList.remove(
            "hidden"
        );

}


// ============================================================
// TOAST
// ============================================================

function showToast(
    message,
    icon = "fa-circle-check"
) {

    const toast =
        $("#groupsToast");


    const toastIcon =
        $("#toastIcon");


    const toastMessage =
        $("#toastMessage");


    if (
        !toast ||
        !toastIcon ||
        !toastMessage
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toastIcon.innerHTML = `
        <i class="fa-solid ${icon}"></i>
    `;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
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
// AVATAR
// ============================================================

function createAvatar(
    user,
    className
) {

    const initial =
        String(
            user.displayName ||
            user.username ||
            "U"
        )
        .charAt(0)
        .toUpperCase();


    /*
     * Use profile image when one exists.
     */

    if (user.photoURL) {

        return `

            <div
                class="${className}"
                style="
                    background-image:
                        url('${escapeAttribute(
                            user.photoURL
                        )}');
                    background-size: cover;
                    background-position: center;
                "
            ></div>

        `;

    }


    return `

        <div class="${className}">
            ${escapeHTML(initial)}
        </div>

    `;

}


// ============================================================
// SECURITY HELPERS
// ============================================================

function escapeHTML(
    value
) {

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


function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// FIRESTORE ERROR MESSAGE
// ============================================================

function getFirestoreErrorMessage(
    error
) {

    if (!error) {
        return "Something went wrong.";
    }


    if (
        error.code ===
        "permission-denied"
    ) {

        return "You don't have permission to create this group.";

    }


    if (
        error.code ===
        "failed-precondition"
    ) {

        return "Firestore needs an index for this username search.";

    }


    if (
        error.code ===
        "unavailable"
    ) {

        return "Internet connection unavailable. Try again.";

    }


    return "We couldn't create the group. Please try again.";

}