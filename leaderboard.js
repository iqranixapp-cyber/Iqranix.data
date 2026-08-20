// ============================================================
// IQRANIX LEADERBOARD
// REAL FIRESTORE DATA ONLY
// ============================================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


let currentUser = null;
let currentGroup = null;
let members = [];
let currentPeriod = "weekly";


// ============================================================
// HELPERS
// ============================================================

const $ = (id) =>
    document.getElementById(id);


function setStatus(
    message,
    icon = "fa-spinner fa-spin"
) {

    const status =
        $("statusMessage");

    if (!status) return;

    status.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${escapeHTML(message)}</span>
    `;

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupButtons();
        setupTabs();

        console.log(
            "IQRANIX Leaderboard loaded."
        );

        startAuth();

    }
);


// ============================================================
// AUTH
// ============================================================

function startAuth() {

    setStatus(
        "Checking your account..."
    );


    try {

        onAuthStateChanged(
            auth,
            async (user) => {

                if (!user) {

                    setStatus(
                        "Please sign in to view your leaderboard.",
                        "fa-lock"
                    );

                    showMessage(
                        "Sign in required",
                        "You need to be signed in before opening a group leaderboard.",
                        "login.html"
                    );

                    return;

                }


                currentUser =
                    user;


                console.log(
                    "Signed in:",
                    user.uid
                );


                await startLeaderboard();

            }
        );

    } catch (error) {

        console.error(
            error
        );

        showError(
            error
        );

    }

}


// ============================================================
// MAIN LEADERBOARD
// ============================================================

async function startLeaderboard() {

    setStatus(
        "Finding your group..."
    );


    try {

        const groupId =
            await getGroupId();


        if (!groupId) {

            setStatus(
                "No group connected.",
                "fa-users"
            );

            showMessage(
                "No group yet",
                "Create a group or join an IQRANIX group to see the leaderboard.",
                "groups.html"
            );

            return;

        }


        console.log(
            "Group ID:",
            groupId
        );


        setStatus(
            "Loading group..."
        );


        const groupRef =
            doc(
                db,
                "groups",
                groupId
            );


        const groupSnap =
            await getDoc(
                groupRef
            );


        if (!groupSnap.exists()) {

            setStatus(
                "Group not found.",
                "fa-triangle-exclamation"
            );

            showMessage(
                "Group not found",
                "The selected group no longer exists or you don't have access to it.",
                "groups.html"
            );

            return;

        }


        currentGroup = {

            id:
                groupSnap.id,

            ...groupSnap.data()

        };


        console.log(
            "Group loaded:",
            currentGroup
        );


        const groupMemberIds =
            Array.isArray(
                currentGroup.members
            )
                ? currentGroup.members
                : [];


        /*
         * Make sure the current user belongs
         * to the group when the group contains
         * a member list.
         */

        if (
            groupMemberIds.length &&
            !groupMemberIds.includes(
                currentUser.uid
            )
        ) {

            setStatus(
                "You are not a member of this group.",
                "fa-user-lock"
            );

            showMessage(
                "Group access unavailable",
                "Your account is not listed as a member of this group.",
                "groups.html"
            );

            return;

        }


        await loadMembers(
            groupMemberIds
        );


        renderGroup();


        renderLeaderboard();


        setStatus(
            members.length
                ? "Leaderboard ready."
                : "Your group has no member profiles yet.",
            members.length
                ? "fa-circle-check"
                : "fa-users"
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );

        showError(
            error
        );

    }

}


// ============================================================
// GET GROUP ID
// ============================================================

async function getGroupId() {

    /*
     * 1. URL:
     *
     * leaderboard.html?id=GROUP_ID
     */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlId =
        params.get("id");


    if (urlId) {

        saveGroupId(
            urlId
        );

        return urlId;

    }


    /*
     * 2. Local storage
     */

    const savedKeys = [

        "iqranix_current_group_id",

        "iqranix_group_id",

        "iqranix_selected_group",

        "currentGroupId"

    ];


    for (
        const key of savedKeys
    ) {

        try {

            const value =
                localStorage.getItem(
                    key
                );


            if (value) {

                return value;

            }

        } catch (error) {

            console.warn(
                "LocalStorage unavailable."
            );

        }

    }


    /*
     * 3. Find a group containing
     * the current user.
     */

    console.log(
        "Searching Firestore for user's group..."
    );


    const groupsRef =
        collection(
            db,
            "groups"
        );


    const q =
        query(
            groupsRef,
            where(
                "members",
                "array-contains",
                currentUser.uid
            ),
            limit(1)
        );


    const snapshot =
        await getDocs(
            q
        );


    if (
        snapshot.empty
    ) {

        return null;

    }


    const group =
        snapshot.docs[0];


    saveGroupId(
        group.id
    );


    return group.id;

}


// ============================================================
// SAVE GROUP
// ============================================================

function saveGroupId(
    id
) {

    try {

        localStorage.setItem(
            "iqranix_current_group_id",
            id
        );

    } catch (error) {

        console.warn(
            "Could not save group."
        );

    }

}


// ============================================================
// LOAD MEMBERS
// ============================================================

async function loadMembers(
    memberIds
) {

    members = [];


    if (!memberIds.length) {

        return;

    }


    setStatus(
        "Loading real group members..."
    );


    /*
     * IMPORTANT:
     *
     * We load the actual user documents
     * referenced by groups.members.
     *
     * No hardcoded names.
     */

    for (
        const uid of memberIds
    ) {

        try {

            const userRef =
                doc(
                    db,
                    "users",
                    uid
                );


            const userSnap =
                await getDoc(
                    userRef
                );


            if (
                !userSnap.exists()
            ) {

                console.warn(
                    "Missing user:",
                    uid
                );

                continue;

            }


            const data =
                userSnap.data();


            const username =
                String(
                    data.username || ""
                )
                .trim()
                .toLowerCase();


            const name =
                String(
                    data.displayName ||
                    data.name ||
                    username ||
                    "IQRANIX Member"
                )
                .trim();


            members.push({

                uid,

                name,

                username,

                photoURL:
                    data.photoURL ||
                    data.profilePhoto ||
                    "",

                weekly:
                    number(
                        data.weeklyPoints,
                        data.weekly_points,
                        data.pointsWeekly,
                        data.points_weekly,
                        data.points,
                        0
                    ),

                monthly:
                    number(
                        data.monthlyPoints,
                        data.monthly_points,
                        data.pointsMonthly,
                        data.points_monthly,
                        data.points,
                        0
                    ),

                all:
                    number(
                        data.allTimePoints,
                        data.all_time_points,
                        data.totalPoints,
                        data.total_points,
                        data.points,
                        0
                    )

            });


        } catch (error) {

            console.warn(
                "Could not load member:",
                uid,
                error
            );

        }

    }


    console.log(
        "REAL MEMBERS:",
        members
    );

}


// ============================================================
// GROUP HEADER
// ============================================================

function renderGroup() {

    $("groupName").textContent =
        currentGroup.name ||
        "IQRANIX Group";


    $("memberCount").textContent =
        `${members.length} ${
            members.length === 1
                ? "member"
                : "members"
        }`;


    $("memberTotal").textContent =
        members.length;

}


// ============================================================
// GET POINTS
// ============================================================

function pointsFor(
    member
) {

    if (
        currentPeriod ===
        "monthly"
    ) {

        return member.monthly || 0;

    }


    if (
        currentPeriod ===
        "all"
    ) {

        return member.all || 0;

    }


    return member.weekly || 0;

}


// ============================================================
// SORT
// ============================================================

function sortedMembers() {

    return members
        .map(
            member => ({

                ...member,

                points:
                    pointsFor(
                        member
                    )

            })
        )
        .sort(
            (a,b) =>
                b.points - a.points
        )
        .map(
            (member,index) => ({

                ...member,

                rank:
                    index + 1

            })
        );

}


// ============================================================
// RENDER EVERYTHING
// ============================================================

function renderLeaderboard() {

    const sorted =
        sortedMembers();


    renderPodium(
        sorted
    );


    renderMemberList(
        sorted
    );


    renderYourPosition(
        sorted
    );

}


// ============================================================
// PODIUM
// ============================================================

function renderPodium(
    sorted
) {

    const places = [

        {
            member:
                sorted[0],

            name:
                "firstName",

            username:
                "firstUsername",

            points:
                "firstPoints",

            avatar:
                "firstAvatar"

        },

        {
            member:
                sorted[1],

            name:
                "secondName",

            username:
                "secondUsername",

            points:
                "secondPoints",

            avatar:
                "secondAvatar"

        },

        {
            member:
                sorted[2],

            name:
                "thirdName",

            username:
                "thirdUsername",

            points:
                "thirdPoints",

            avatar:
                "thirdAvatar"

        }

    ];


    places.forEach(
        place => {

            const member =
                place.member;


            if (!member) {

                $(place.name).textContent =
                    "—";

                $(place.username).textContent =
                    "No member";

                $(place.points).textContent =
                    "0";

                $(place.avatar).textContent =
                    "—";

                $(place.avatar).style.backgroundImage =
                    "";

                return;

            }


            $(place.name).textContent =
                member.name;


            $(place.username).textContent =
                member.username
                    ? "@" + member.username
                    : "IQRANIX Member";


            $(place.points).textContent =
                member.points;


            setAvatar(
                $(place.avatar),
                member
            );

        }
    );

}


// ============================================================
// MEMBER LIST
// ============================================================

function renderMemberList(
    sorted
) {

    const container =
        $("membersList");


    container.innerHTML =
        "";


    if (!sorted.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-users"></i>

                <strong>
                    No members found
                </strong>

                <span>
                    Add members to this group first.
                </span>

            </div>

        `;

        return;

    }


    /*
     * Show every REAL member.
     */

    sorted.forEach(
        member => {

            const row =
                document.createElement(
                    "article"
                );


            row.className =
                "member-row";


            row.innerHTML = `

                <div class="member-rank">
                    #${member.rank}
                </div>

                <div class="member-avatar">
                    ${getInitial(member)}
                </div>

                <div class="member-info">

                    <strong>
                        ${escapeHTML(member.name)}
                    </strong>

                    <span>
                        ${
                            member.username
                                ? "@" +
                                  escapeHTML(
                                      member.username
                                  )
                                : "IQRANIX Member"
                        }
                    </span>

                </div>

                <div class="member-points">

                    <strong>
                        ${member.points}
                    </strong>

                    <span>
                        points
                    </span>

                </div>

            `;


            const avatar =
                row.querySelector(
                    ".member-avatar"
                );


            setAvatar(
                avatar,
                member
            );


            container.appendChild(
                row
            );

        }
    );

}


// ============================================================
// YOUR POSITION
// ============================================================

function renderYourPosition(
    sorted
) {

    const index =
        sorted.findIndex(
            member =>
                member.uid ===
                currentUser.uid
        );


    if (index === -1) {

        $("yourRank").textContent =
            "—";

        $("yourName").textContent =
            "You";

        $("yourUsername").textContent =
            "";

        $("yourPoints").textContent =
            "0";

        $("nextRankText").textContent =
            "Your account is not in this group's member list.";

        return;

    }


    const me =
        sorted[index];


    $("yourRank").textContent =
        me.rank;


    $("yourName").textContent =
        me.name;


    $("yourUsername").textContent =
        me.username
            ? "@" + me.username
            : "";


    $("yourPoints").textContent =
        me.points;


    setAvatar(
        $("yourAvatar"),
        me
    );


    if (
        me.rank === 1
    ) {

        $("nextRankText").textContent =
            "You're #1 in this group.";

        return;

    }


    const above =
        sorted[index - 1];


    const difference =
        Math.max(
            0,
            above.points -
            me.points
        );


    $("nextRankText").textContent =
        `${difference} more point${
            difference === 1
                ? ""
                : "s"
        } to reach #${me.rank - 1}.`;

}


// ============================================================
// PERIOD
// ============================================================

function setupTabs() {

    document
        .querySelectorAll(
            ".period-tab"
        )
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".period-tab"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        tab.classList.add(
                            "active"
                        );


                        currentPeriod =
                            tab.dataset.period ||
                            "weekly";


                        if (
                            currentPeriod ===
                            "weekly"
                        ) {

                            $("periodTitle")
                                .textContent =
                                "This Week";

                        } else if (
                            currentPeriod ===
                            "monthly"
                        ) {

                            $("periodTitle")
                                .textContent =
                                "This Month";

                        } else {

                            $("periodTitle")
                                .textContent =
                                "All Time";

                        }


                        renderLeaderboard();

                    }
                );

            }
        );

}


// ============================================================
// BUTTONS
// ============================================================

function setupButtons() {

    $("backBtn")
        ?.addEventListener(
            "click",
            () => {

                if (
                    history.length > 1
                ) {

                    history.back();

                } else {

                    window.location.href =
                        "community.html";

                }

            }
        );


    $("refreshBtn")
        ?.addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );


    $("messageButton")
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "groups.html";

            }
        );

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(
    title,
    text,
    destination
) {

    const box =
        $("pageMessage");


    box.classList.remove(
        "hidden"
    );


    $("messageTitle")
        .textContent =
        title;


    $("messageText")
        .textContent =
        text;


    $("messageButton")
        .onclick =
        () => {

            window.location.href =
                destination;

        };

}


// ============================================================
// ERROR
// ============================================================

function showError(
    error
) {

    console.error(
        error
    );


    let message =
        "Something went wrong while loading your leaderboard.";


    if (
        error?.code ===
        "permission-denied"
    ) {

        message =
            "Firebase denied access to the group. Check your Firestore security rules.";

    } else if (
        error?.code ===
        "failed-precondition"
    ) {

        message =
            "Firestore requires an index for the group query.";

    } else if (
        error?.code ===
        "unavailable"
    ) {

        message =
            "Firebase is temporarily unavailable. Check your internet connection.";

    } else if (
        error?.message
    ) {

        message =
            error.message;

    }


    setStatus(
        "Leaderboard could not load.",
        "fa-triangle-exclamation"
    );


    showMessage(
        "Leaderboard error",
        message,
        "groups.html"
    );

}


// ============================================================
// AVATAR
// ============================================================

function setAvatar(
    element,
    member
) {

    if (!element) {
        return;
    }


    if (
        member.photoURL
    ) {

        element.textContent =
            "";

        element.style.backgroundImage =
            `url("${escapeAttribute(
                member.photoURL
            )}")`;

        element.style.backgroundSize =
            "cover";

        element.style.backgroundPosition =
            "center";

    } else {

        element.style.backgroundImage =
            "";

        element.textContent =
            getInitial(
                member
            );

    }

}


// ============================================================
// INITIAL
// ============================================================

function getInitial(
    member
) {

    return String(
        member.name ||
        member.username ||
        "U"
    )
    .charAt(0)
    .toUpperCase();

}


// ============================================================
// NUMBER
// ============================================================

function number(
    ...values
) {

    for (
        const value of values
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            const n =
                Number(value);


            if (
                Number.isFinite(n)
            ) {

                return n;

            }

        }

    }


    return 0;

}


// ============================================================
// SECURITY
// ============================================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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

    return String(
        value ?? ""
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