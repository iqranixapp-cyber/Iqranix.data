/* ============================================================
   IQRANIX — MESSAGES + WEBRTC CALLING
   FULL REPLACEMENT
============================================================ */

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    setDoc,
    doc,
    query,
    where,
    limit,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    onSnapshot,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


/* ============================================================
   ELEMENTS
============================================================ */

const usernameSearch = document.getElementById("usernameSearch");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const usernameResults = document.getElementById("usernameResults");
const searchStatus = document.getElementById("searchStatus");
const conversationList = document.getElementById("conversationList");

const chatPage = document.getElementById("chatPage");
const backBtn = document.getElementById("backBtn");
const newMessageBtn = document.getElementById("newMessageBtn");
const closeChatBtn = document.getElementById("closeChatBtn");

const chatAvatar = document.getElementById("chatAvatar");
const chatName = document.getElementById("chatName");
const chatUsername = document.getElementById("chatUsername");
const chatOnlineDot = document.getElementById("chatOnlineDot");

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const emojiBtn = document.getElementById("emojiBtn");

const callButton = document.getElementById("callButton");

const callScreen = document.getElementById("callScreen");
const callAvatar = document.getElementById("callAvatar");
const callName = document.getElementById("callName");
const callStatus = document.getElementById("callStatus");

const remoteVideo = document.getElementById("remoteVideo");
const localVideo = document.getElementById("localVideo");

const muteCallButton = document.getElementById("muteCallButton");
const cameraCallButton = document.getElementById("cameraCallButton");
const endCallButton = document.getElementById("endCallButton");

const incomingCall = document.getElementById("incomingCall");
const incomingAvatar = document.getElementById("incomingAvatar");
const incomingName = document.getElementById("incomingName");
const incomingType = document.getElementById("incomingType");

const acceptCallButton = document.getElementById("acceptCallButton");
const rejectCallButton = document.getElementById("rejectCallButton");

const chatMenuButton = document.getElementById("chatMenuButton");
const chatMenu = document.getElementById("chatMenu");

const chatProfileButton = document.getElementById("chatProfileButton");

const profilePopup = document.getElementById("profilePopup");
const closeProfilePopup = document.getElementById("closeProfilePopup");
const profilePopupAvatar = document.getElementById("profilePopupAvatar");
const profilePopupName = document.getElementById("profilePopupName");
const profilePopupUsername = document.getElementById("profilePopupUsername");

const viewProfileOption = document.getElementById("viewProfileOption");
const clearConversationOption =
    document.getElementById("clearConversationOption");
const searchConversationOption =
    document.getElementById("searchConversationOption");
const muteConversationOption =
    document.getElementById("muteConversationOption");
const reportUserOption =
    document.getElementById("reportUserOption");


/* ============================================================
   STATE
============================================================ */

let currentUser = null;
let currentChatUser = null;
let currentConversationId = null;

let searchTimer = null;

let messagesUnsubscribe = null;
let callsUnsubscribe = null;

let callDocumentUnsubscribe = null;
let candidateUnsubscribe = null;

let peerConnection = null;
let localStream = null;

let activeCallId = null;
let activeCallType = null;

let pendingIncomingCall = null;

let isMuted = false;
let isCameraOff = false;
let conversationMuted = false;


/* ============================================================
   WEBRTC
============================================================ */

const ICE_SERVERS = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: "stun:stun1.l.google.com:19302"
        }
    ]
};


/* ============================================================
   HELPER
============================================================ */

function exists(element) {
    return !!element;
}


/* ============================================================
   AUTH
============================================================ */

onAuthStateChanged(auth, async user => {

    currentUser = user || null;

    if (!currentUser) {
        showLoginState();
        return;
    }

    await loadConversations();
    listenForIncomingCalls();

});


/* ============================================================
   LOGIN
============================================================ */

function showLoginState() {

    if (!conversationList)
        return;

    conversationList.innerHTML = `
        <div class="loading-state">
            <h2>Sign in required</h2>
            <p>Sign in to message Iqranix members.</p>
        </div>
    `;

}


/* ============================================================
   SEARCH
============================================================ */

usernameSearch?.addEventListener("input", () => {

    const value =
        usernameSearch.value
            .trim()
            .replace(/^@/, "")
            .toLowerCase();

    clearSearchBtn?.classList.toggle(
        "hidden",
        !value
    );

    clearTimeout(searchTimer);

    if (!value) {

        usernameResults?.classList.add("hidden");

        if (usernameResults)
            usernameResults.innerHTML = "";

        if (searchStatus)
            searchStatus.textContent = "";

        return;
    }

    usernameResults?.classList.remove("hidden");

    if (searchStatus)
        searchStatus.textContent =
            "Searching Iqranix members...";

    if (usernameResults)
        usernameResults.innerHTML = `
            <div class="search-message">
                Searching...
            </div>
        `;

    searchTimer =
        setTimeout(
            () => searchUsers(value),
            350
        );

});


async function searchUsers(searchText) {

    if (!currentUser)
        return;

    const username =
        searchText
            .trim()
            .replace(/^@/, "")
            .toLowerCase();

    if (!username)
        return;

    try {

        const usersRef = collection(db, "users");
        const results = [];

        try {

            const lowerQuery =
                query(
                    usersRef,
                    where(
                        "usernameLower",
                        ">=",
                        username
                    ),
                    where(
                        "usernameLower",
                        "<=",
                        username + "\uf8ff"
                    ),
                    limit(20)
                );

            const snapshot =
                await getDocs(lowerQuery);

            snapshot.forEach(item => {

                if (item.id !== currentUser.uid) {

                    results.push({
                        uid: item.id,
                        ...item.data()
                    });

                }

            });

        } catch (error) {

            console.warn(
                "Username query failed:",
                error
            );

        }

        if (!results.length) {

            const snapshot =
                await getDocs(
                    query(
                        usersRef,
                        limit(100)
                    )
                );

            snapshot.forEach(item => {

                if (item.id === currentUser.uid)
                    return;

                const data = item.data();

                const stored =
                    String(data.username || "")
                        .replace(/^@/, "")
                        .toLowerCase();

                if (stored.startsWith(username)) {

                    results.push({
                        uid: item.id,
                        ...data
                    });

                }

            });

        }

        const unique =
            Array.from(
                new Map(
                    results.map(user => [
                        user.uid,
                        user
                    ])
                ).values()
            );

        renderSearchResults(unique);

        if (searchStatus)
            searchStatus.textContent = "";

    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        if (usernameResults)
            usernameResults.innerHTML = `
                <div class="search-message">
                    Couldn't search usernames.
                </div>
            `;

    }

}


/* ============================================================
   SEARCH RESULTS
============================================================ */

function renderSearchResults(users) {

    if (!usernameResults)
        return;

    usernameResults.innerHTML = "";

    if (!users.length) {

        usernameResults.innerHTML = `
            <div class="search-message">
                No Iqranix member found.
            </div>
        `;

        return;
    }

    users.forEach(user => {

        const button =
            document.createElement("button");

        button.className = "search-result";

        const avatar =
            document.createElement("img");

        avatar.className = "result-avatar";

        avatar.src =
            user.photoURL ||
            createAvatar(
                user.displayName ||
                user.username ||
                "I"
            );

        avatar.onerror = () => {
            avatar.src =
                createAvatar(
                    user.displayName ||
                    user.username ||
                    "I"
                );
        };

        const info =
            document.createElement("div");

        info.className = "result-info";

        const name =
            document.createElement("span");

        name.className = "result-name";

        name.textContent =
            user.displayName ||
            "Iqranix Member";

        const username =
            document.createElement("span");

        username.className = "result-username";

        username.textContent =
            "@" +
            (
                user.username ||
                user.usernameLower ||
                "username"
            );

        info.append(name, username);

        button.append(avatar, info);

        button.addEventListener(
            "click",
            () => openConversation(user)
        );

        usernameResults.appendChild(button);

    });

}


/* ============================================================
   OPEN CONVERSATION
============================================================ */

async function openConversation(user) {

    if (!currentUser)
        return;

    currentChatUser = user;

    try {

        currentConversationId =
            await findOrCreateConversation(user);

        setChatHeader(user);

        usernameResults?.classList.add("hidden");

        await loadChatMessages(
            currentConversationId
        );

        chatPage?.classList.add("active");

        document.body.style.overflow = "hidden";

        messageInput?.focus();

    } catch (error) {

        console.error(
            "OPEN CONVERSATION:",
            error
        );

        alert(
            "Could not open conversation.\n\n" +
            error.message
        );

    }

}


/* ============================================================
   FIND / CREATE CONVERSATION
============================================================ */

async function findOrCreateConversation(otherUser) {

    const conversationsRef =
        collection(db, "conversations");

    const q =
        query(
            conversationsRef,
            where(
                "participants",
                "array-contains",
                currentUser.uid
            ),
            limit(100)
        );

    const snapshot =
        await getDocs(q);

    for (const item of snapshot.docs) {

        const data = item.data();

        if (
            Array.isArray(data.participants) &&
            data.participants.includes(
                otherUser.uid
            )
        ) {

            return item.id;

        }

    }

    const conversation =
        await addDoc(
            conversationsRef,
            {
                participants: [
                    currentUser.uid,
                    otherUser.uid
                ],

                participantNames: {
                    [currentUser.uid]:
                        currentUser.displayName ||
                        "Iqranix Member",

                    [otherUser.uid]:
                        otherUser.displayName ||
                        "Iqranix Member"
                },

                participantUsernames: {
                    [currentUser.uid]:
                        currentUser.username || "",

                    [otherUser.uid]:
                        otherUser.username || ""
                },

                participantPhotos: {
                    [currentUser.uid]:
                        currentUser.photoURL || "",

                    [otherUser.uid]:
                        otherUser.photoURL || ""
                },

                lastMessage: "",

                lastMessageAt:
                    serverTimestamp(),

                createdAt:
                    serverTimestamp()
            }
        );

    return conversation.id;

}


/* ============================================================
   HEADER
============================================================ */

function setChatHeader(user) {

    if (chatName)
        chatName.textContent =
            user.displayName ||
            "Iqranix Member";

    if (chatUsername)
        chatUsername.textContent =
            "@" +
            (
                user.username ||
                user.usernameLower ||
                "username"
            );

    if (chatAvatar) {

        chatAvatar.src =
            user.photoURL ||
            createAvatar(
                user.displayName ||
                user.username ||
                "I"
            );

    }

}


/* ============================================================
   MESSAGES
============================================================ */

async function loadChatMessages(conversationId) {

    if (!chatMessages)
        return;

    if (messagesUnsubscribe)
        messagesUnsubscribe();

    const messagesRef =
        collection(
            db,
            "conversations",
            conversationId,
            "messages"
        );

    const q =
        query(
            messagesRef,
            orderBy("createdAt", "asc"),
            limit(100)
        );

    messagesUnsubscribe =
        onSnapshot(
            q,
            snapshot => {

                chatMessages.innerHTML = "";

                if (snapshot.empty) {

                    showChatEmpty();
                    return;

                }

                snapshot.forEach(item => {

                    renderMessage(
                        item.data()
                    );

                });

                scrollChatToBottom();

            },
            error => {

                console.error(
                    "Message listener:",
                    error
                );

            }
        );

}


function showChatEmpty() {

    if (!chatMessages)
        return;

    chatMessages.innerHTML = `
        <div class="chat-empty">
            <div class="chat-empty-icon">✦</div>
            <h2>Start a beneficial conversation</h2>
            <p>
                Keep your conversation respectful,
                beneficial and Islamic.
            </p>
        </div>
    `;

}


function renderMessage(message) {

    if (!chatMessages)
        return;

    const row =
        document.createElement("div");

    const mine =
        message.senderId === currentUser.uid;

    row.className =
        mine
            ? "message-row mine"
            : "message-row theirs";

    const bubble =
        document.createElement("div");

    bubble.className =
        "message-bubble";

    const text =
        document.createElement("div");

    text.textContent =
        message.text || "";

    const time =
        document.createElement("span");

    time.className =
        "message-time";

    time.textContent =
        formatMessageTime(
            message.createdAt
        );

    bubble.append(text, time);

    row.appendChild(bubble);

    chatMessages.appendChild(row);

}


/* ============================================================
   SEND MESSAGE
============================================================ */

sendMessageBtn?.addEventListener(
    "click",
    sendMessage
);

messageInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


async function sendMessage() {

    const text =
        messageInput?.value.trim();

    if (
        !text ||
        !currentUser ||
        !currentChatUser ||
        !currentConversationId
    )
        return;

    try {

        await addDoc(
            collection(
                db,
                "conversations",
                currentConversationId,
                "messages"
            ),
            {
                senderId:
                    currentUser.uid,

                receiverId:
                    currentChatUser.uid,

                text,

                createdAt:
                    serverTimestamp()
            }
        );

        await updateDoc(
            doc(
                db,
                "conversations",
                currentConversationId
            ),
            {
                lastMessage: text,
                lastMessageAt:
                    serverTimestamp()
            }
        );

        messageInput.value = "";

    } catch (error) {

        console.error(
            "Send message:",
            error
        );

        alert(
            "Message could not be sent.\n\n" +
            error.message
        );

    }

}


/* ============================================================
   CALL BUTTON
============================================================ */

callButton?.addEventListener(
    "click",
    () => {

        if (!currentChatUser) {

            alert(
                "Open a conversation first."
            );

            return;

        }

        const video =
            confirm(
                "Start a video call?\n\n" +
                "Press Cancel for an audio call."
            );

        startCall(
            video
                ? "video"
                : "audio"
        );

    }
);


/* ============================================================
   CHECK MEDIA SUPPORT
============================================================ */

function checkMediaSupport() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Camera and microphone calling is not available here.\n\n" +
            "Please open Iqranix from HTTPS or your installed PWA."
        );

        return false;

    }

    return true;

}


/* ============================================================
   REQUEST MICROPHONE
============================================================ */

async function requestMicrophone() {

    if (!checkMediaSupport())
        throw new Error(
            "Your browser does not support microphone access."
        );

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

        return stream;

    } catch (error) {

        console.error(
            "MICROPHONE ERROR:",
            error.name,
            error.message
        );

        if (error.name === "NotAllowedError") {

            throw new Error(
                "Microphone access was blocked. Open your Android browser/site settings and allow Microphone for Iqranix, then try again."
            );

        }

        if (error.name === "NotFoundError") {

            throw new Error(
                "No microphone was found on this device."
            );

        }

        throw new Error(
            "Could not access the microphone: " +
            error.message
        );

    }

}


/* ============================================================
   REQUEST CAMERA + MICROPHONE
============================================================ */

async function requestCameraAndMicrophone() {

    if (!checkMediaSupport())
        throw new Error(
            "Your browser does not support camera access."
        );

    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: {
                        facingMode: "user"
                    }
                });

        return stream;

    } catch (error) {

        console.error(
            "CAMERA/MIC ERROR:",
            error.name,
            error.message
        );

        if (error.name === "NotAllowedError") {

            throw new Error(
                "Camera or microphone access was blocked. Open your Android browser/site settings and allow Camera and Microphone for Iqranix, then try again."
            );

        }

        if (error.name === "NotFoundError") {

            throw new Error(
                "A camera or microphone could not be found."
            );

        }

        if (error.name === "NotReadableError") {

            throw new Error(
                "The camera or microphone is currently being used by another app."
            );

        }

        throw new Error(
            "Could not access camera/microphone: " +
            error.message
        );

    }

}


/* ============================================================
   START CALL
============================================================ */

async function startCall(type) {

    if (
        !currentUser ||
        !currentChatUser
    )
        return;

    if (activeCallId) {

        alert(
            "You are already in a call."
        );

        return;

    }

    try {

        activeCallType = type;

        /* ----------------------------------------------------
           GET MEDIA
        ---------------------------------------------------- */

        if (type === "video") {

            localStream =
                await requestCameraAndMicrophone();

        } else {

            localStream =
                await requestMicrophone();

        }


        /* ----------------------------------------------------
           CREATE CALL DOCUMENT FIRST
        ---------------------------------------------------- */

        const callRef =
            doc(
                collection(db, "calls")
            );

        activeCallId =
            callRef.id;

        await setDoc(
            callRef,
            {
                callerId:
                    currentUser.uid,

                receiverId:
                    currentChatUser.uid,

                callerName:
                    currentUser.displayName ||
                    "Iqranix Member",

                callerUsername:
                    currentUser.username || "",

                callerPhoto:
                    currentUser.photoURL || "",

                receiverName:
                    currentChatUser.displayName ||
                    "Iqranix Member",

                receiverUsername:
                    currentChatUser.username || "",

                receiverPhoto:
                    currentChatUser.photoURL || "",

                type: type,

                status: "ringing",

                createdAt:
                    serverTimestamp()
            }
        );


        /* ----------------------------------------------------
           PEER CONNECTION
        ---------------------------------------------------- */

        peerConnection =
            createPeerConnection();

        localStream
            .getTracks()
            .forEach(track => {

                peerConnection.addTrack(
                    track,
                    localStream
                );

            });


        /* ----------------------------------------------------
           ICE COLLECTIONS
        ---------------------------------------------------- */

        const callerCandidates =
            collection(
                callRef,
                "callerCandidates"
            );

        const calleeCandidates =
            collection(
                callRef,
                "calleeCandidates"
            );


        /* ----------------------------------------------------
           SEND ICE
        ---------------------------------------------------- */

        peerConnection.onicecandidate =
            async event => {

                if (!event.candidate)
                    return;

                try {

                    await addDoc(
                        callerCandidates,
                        event.candidate.toJSON()
                    );

                } catch (error) {

                    console.error(
                        "Caller ICE:",
                        error
                    );

                }

            };


        /* ----------------------------------------------------
           REMOTE VIDEO
        ---------------------------------------------------- */

        peerConnection.ontrack =
            event => {

                if (
                    event.streams &&
                    event.streams[0] &&
                    remoteVideo
                ) {

                    remoteVideo.srcObject =
                        event.streams[0];

                    remoteVideo.play()
                        .catch(() => {});

                }

            };


        /* ----------------------------------------------------
           LOCAL VIDEO
        ---------------------------------------------------- */

        if (
            type === "video" &&
            localVideo
        ) {

            localVideo.srcObject =
                localStream;

            localVideo.style.display =
                "block";

            localVideo.muted = true;

            localVideo.play()
                .catch(() => {});

        } else if (localVideo) {

            localVideo.srcObject = null;

            localVideo.style.display =
                "none";

        }


        /* ----------------------------------------------------
           SHOW CALL SCREEN
        ---------------------------------------------------- */

        showCallScreen(
            currentChatUser,
            type,
            "Calling..."
        );


        /* ----------------------------------------------------
           OFFER
        ---------------------------------------------------- */

        const offer =
            await peerConnection
                .createOffer();

        await peerConnection
            .setLocalDescription(offer);


        await updateDoc(
            callRef,
            {
                offer: {
                    type:
                        offer.type,

                    sdp:
                        offer.sdp
                }
            }
        );


        /* ----------------------------------------------------
           LISTEN FOR ANSWER
        ---------------------------------------------------- */

        callDocumentUnsubscribe =
            onSnapshot(
                callRef,
                async snapshot => {

                    const data =
                        snapshot.data();

                    if (!data)
                        return;


                    if (
                        data.answer &&
                        peerConnection &&
                        !peerConnection
                            .currentRemoteDescription
                    ) {

                        try {

                            await peerConnection
                                .setRemoteDescription(
                                    new RTCSessionDescription(
                                        data.answer
                                    )
                                );

                            if (callStatus)
                                callStatus.textContent =
                                    "Connecting...";

                        } catch (error) {

                            console.error(
                                "Remote answer:",
                                error
                            );

                        }

                    }


                    if (
                        data.status ===
                        "accepted"
                    ) {

                        if (callStatus)
                            callStatus.textContent =
                                "Connecting...";

                    }


                    if (
                        data.status ===
                        "rejected"
                    ) {

                        if (callStatus)
                            callStatus.textContent =
                                "Call declined";

                        setTimeout(
                            () => endCall(false),
                            700
                        );

                    }


                    if (
                        data.status ===
                        "ended"
                    ) {

                        endCall(false);

                    }

                }
            );


        /* ----------------------------------------------------
           RECEIVE CALLEE ICE
        ---------------------------------------------------- */

        candidateUnsubscribe =
            onSnapshot(
                calleeCandidates,
                snapshot => {

                    snapshot.docChanges()
                        .forEach(change => {

                            if (
                                change.type !==
                                "added"
                            )
                                return;

                            if (!peerConnection)
                                return;

                            peerConnection
                                .addIceCandidate(
                                    new RTCIceCandidate(
                                        change.doc.data()
                                    )
                                )
                                .catch(error => {

                                    console.warn(
                                        "Callee ICE:",
                                        error
                                    );

                                });

                        });

                }
            );


    } catch (error) {

        console.error(
            "START CALL ERROR:",
            error
        );

        await endCall(false);

        alert(
            "Could not start the call.\n\n" +
            error.message
        );

    }

}


/* ============================================================
   PEER CONNECTION
============================================================ */

function createPeerConnection() {

    const pc =
        new RTCPeerConnection(
            ICE_SERVERS
        );

    pc.onconnectionstatechange =
        () => {

            console.log(
                "Connection:",
                pc.connectionState
            );

            if (
                pc.connectionState ===
                "connected"
            ) {

                if (callStatus)
                    callStatus.textContent =
                        "Connected";

            }

            if (
                pc.connectionState ===
                "connecting"
            ) {

                if (callStatus)
                    callStatus.textContent =
                        "Connecting...";

            }

            if (
                pc.connectionState ===
                "failed"
            ) {

                if (callStatus)
                    callStatus.textContent =
                        "Connection failed";

            }

            if (
                pc.connectionState ===
                "disconnected"
            ) {

                if (callStatus)
                    callStatus.textContent =
                        "Connection interrupted";

            }

        };


    pc.oniceconnectionstatechange =
        () => {

            console.log(
                "ICE:",
                pc.iceConnectionState
            );

        };


    return pc;

}


/* ============================================================
   INCOMING CALLS
============================================================ */

function listenForIncomingCalls() {

    if (!currentUser)
        return;

    if (callsUnsubscribe)
        callsUnsubscribe();

    const q =
        query(
            collection(db, "calls"),

            where(
                "receiverId",
                "==",
                currentUser.uid
            ),

            where(
                "status",
                "==",
                "ringing"
            ),

            limit(10)
        );

    callsUnsubscribe =
        onSnapshot(
            q,
            snapshot => {

                snapshot.docChanges()
                    .forEach(change => {

                        if (
                            change.type !==
                            "added"
                        )
                            return;

                        pendingIncomingCall = {
                            id:
                                change.doc.id,
                            ...change.doc.data()
                        };

                        showIncomingCall(
                            pendingIncomingCall
                        );

                    });

            },
            error => {

                console.error(
                    "Incoming calls:",
                    error
                );

            }
        );

}


/* ============================================================
   INCOMING UI
============================================================ */

function showIncomingCall(call) {

    if (!call)
        return;

    if (incomingName)
        incomingName.textContent =
            call.callerName ||
            "Iqranix Member";

    if (incomingType)
        incomingType.textContent =
            call.type === "video"
                ? "Incoming video call"
                : "Incoming audio call";

    if (incomingAvatar) {

        incomingAvatar.src =
            call.callerPhoto ||
            createAvatar(
                call.callerName ||
                "I"
            );

    }

    incomingCall?.classList.remove(
        "hidden"
    );

}


/* ============================================================
   ACCEPT
============================================================ */

acceptCallButton?.addEventListener(
    "click",
    acceptIncomingCall
);


async function acceptIncomingCall() {

    const call =
        pendingIncomingCall;

    if (!call)
        return;

    incomingCall?.classList.add(
        "hidden"
    );

    currentChatUser = {
        uid:
            call.callerId,

        displayName:
            call.callerName,

        username:
            call.callerUsername,

        photoURL:
            call.callerPhoto
    };

    activeCallId =
        call.id;

    activeCallType =
        call.type;

    try {

        /* ----------------------------------------------------
           MEDIA
        ---------------------------------------------------- */

        if (call.type === "video") {

            localStream =
                await requestCameraAndMicrophone();

        } else {

            localStream =
                await requestMicrophone();

        }


        /* ----------------------------------------------------
           CALL REF
        ---------------------------------------------------- */

        const callRef =
            doc(
                db,
                "calls",
                call.id
            );

        const callerCandidates =
            collection(
                callRef,
                "callerCandidates"
            );

        const calleeCandidates =
            collection(
                callRef,
                "calleeCandidates"
            );


        /* ----------------------------------------------------
           PEER
        ---------------------------------------------------- */

        peerConnection =
            createPeerConnection();

        localStream
            .getTracks()
            .forEach(track => {

                peerConnection.addTrack(
                    track,
                    localStream
                );

            });


        /* ----------------------------------------------------
           ICE
        ---------------------------------------------------- */

        peerConnection.onicecandidate =
            async event => {

                if (!event.candidate)
                    return;

                await addDoc(
                    calleeCandidates,
                    event.candidate.toJSON()
                );

            };


        /* ----------------------------------------------------
           REMOTE
        ---------------------------------------------------- */

        peerConnection.ontrack =
            event => {

                if (
                    event.streams &&
                    event.streams[0] &&
                    remoteVideo
                ) {

                    remoteVideo.srcObject =
                        event.streams[0];

                    remoteVideo.play()
                        .catch(() => {});

                }

            };


        /* ----------------------------------------------------
           LOCAL
        ---------------------------------------------------- */

        if (
            call.type === "video" &&
            localVideo
        ) {

            localVideo.srcObject =
                localStream;

            localVideo.style.display =
                "block";

            localVideo.muted = true;

            localVideo.play()
                .catch(() => {});

        } else if (localVideo) {

            localVideo.srcObject = null;

            localVideo.style.display =
                "none";

        }


        showCallScreen(
            currentChatUser,
            call.type,
            "Connecting..."
        );


        /* ----------------------------------------------------
           RECEIVE OFFER
        ---------------------------------------------------- */

        if (!call.offer) {

            throw new Error(
                "The caller's offer was not found."
            );

        }

        await peerConnection
            .setRemoteDescription(
                new RTCSessionDescription(
                    call.offer
                )
            );


        /* ----------------------------------------------------
           CREATE ANSWER
        ---------------------------------------------------- */

        const answer =
            await peerConnection
                .createAnswer();

        await peerConnection
            .setLocalDescription(answer);


        await updateDoc(
            callRef,
            {
                answer: {
                    type:
                        answer.type,

                    sdp:
                        answer.sdp
                },

                status:
                    "accepted"
            }
        );


        /* ----------------------------------------------------
           RECEIVE CALLER ICE
        ---------------------------------------------------- */

        candidateUnsubscribe =
            onSnapshot(
                callerCandidates,
                snapshot => {

                    snapshot.docChanges()
                        .forEach(change => {

                            if (
                                change.type !==
                                "added"
                            )
                                return;

                            if (!peerConnection)
                                return;

                            peerConnection
                                .addIceCandidate(
                                    new RTCIceCandidate(
                                        change.doc.data()
                                    )
                                )
                                .catch(error => {

                                    console.warn(
                                        "Caller ICE:",
                                        error
                                    );

                                });

                        });

                }
            );


        /* ----------------------------------------------------
           CALL LISTENER
        ---------------------------------------------------- */

        callDocumentUnsubscribe =
            onSnapshot(
                callRef,
                snapshot => {

                    const data =
                        snapshot.data();

                    if (!data)
                        return;

                    if (
                        data.status ===
                        "ended"
                    ) {

                        endCall(false);

                    }

                }
            );


    } catch (error) {

        console.error(
            "ACCEPT CALL ERROR:",
            error
        );

        try {

            await updateDoc(
                doc(
                    db,
                    "calls",
                    call.id
                ),
                {
                    status: "ended"
                }
            );

        } catch (e) {

            console.warn(e);

        }

        await endCall(false);

        alert(
            "Could not answer the call.\n\n" +
            error.message
        );

    }

}


/* ============================================================
   REJECT
============================================================ */

rejectCallButton?.addEventListener(
    "click",
    rejectIncomingCall
);


async function rejectIncomingCall() {

    const call =
        pendingIncomingCall;

    if (!call)
        return;

    try {

        await updateDoc(
            doc(
                db,
                "calls",
                call.id
            ),
            {
                status: "rejected"
            }
        );

    } catch (error) {

        console.error(
            "Reject call:",
            error
        );

    }

    incomingCall?.classList.add(
        "hidden"
    );

    pendingIncomingCall = null;

}


/* ============================================================
   CALL SCREEN
============================================================ */

function showCallScreen(
    user,
    type,
    status
) {

    if (callName)
        callName.textContent =
            user.displayName ||
            "Iqranix Member";

    if (callStatus)
        callStatus.textContent =
            status;

    if (callAvatar) {

        callAvatar.src =
            user.photoURL ||
            createAvatar(
                user.displayName ||
                user.username ||
                "I"
            );

    }

    callScreen?.classList.remove(
        "hidden"
    );

}


/* ============================================================
   END CALL
============================================================ */

endCallButton?.addEventListener(
    "click",
    () => endCall(true)
);


async function endCall(updateFirebase = true) {

    const callId =
        activeCallId;

    if (
        updateFirebase &&
        callId
    ) {

        try {

            await updateDoc(
                doc(
                    db,
                    "calls",
                    callId
                ),
                {
                    status: "ended"
                }
            );

        } catch (error) {

            console.warn(
                "End call Firebase:",
                error
            );

        }

    }


    if (callDocumentUnsubscribe) {

        callDocumentUnsubscribe();
        callDocumentUnsubscribe = null;

    }

    if (candidateUnsubscribe) {

        candidateUnsubscribe();
        candidateUnsubscribe = null;

    }


    if (peerConnection) {

        try {
            peerConnection.close();
        } catch (e) {}

        peerConnection = null;

    }


    if (localStream) {

        localStream
            .getTracks()
            .forEach(track => {

                try {
                    track.stop();
                } catch (e) {}

            });

        localStream = null;

    }


    if (remoteVideo)
        remoteVideo.srcObject = null;

    if (localVideo)
        localVideo.srcObject = null;


    callScreen?.classList.add(
        "hidden"
    );

    incomingCall?.classList.add(
        "hidden"
    );


    activeCallId = null;
    activeCallType = null;

    pendingIncomingCall = null;

    isMuted = false;
    isCameraOff = false;

}


/* ============================================================
   MUTE
============================================================ */

muteCallButton?.addEventListener(
    "click",
    () => {

        if (!localStream)
            return;

        const tracks =
            localStream.getAudioTracks();

        if (!tracks.length)
            return;

        isMuted = !isMuted;

        tracks.forEach(track => {
            track.enabled = !isMuted;
        });

        if (muteCallButton)
            muteCallButton.textContent =
                isMuted
                    ? "🔇"
                    : "🎤";

    }
);


/* ============================================================
   CAMERA
============================================================ */

cameraCallButton?.addEventListener(
    "click",
    () => {

        if (!localStream)
            return;

        const tracks =
            localStream.getVideoTracks();

        if (!tracks.length)
            return;

        isCameraOff =
            !isCameraOff;

        tracks.forEach(track => {
            track.enabled =
                !isCameraOff;
        });

        if (cameraCallButton)
            cameraCallButton.textContent =
                isCameraOff
                    ? "🚫"
                    : "📷";

    }
);


/* ============================================================
   CHAT MENU
============================================================ */

chatMenuButton?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        chatMenu?.classList.toggle(
            "hidden"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            chatMenu &&
            !chatMenu.contains(event.target) &&
            event.target !== chatMenuButton
        ) {

            chatMenu.classList.add(
                "hidden"
            );

        }

    }
);


/* ============================================================
   PROFILE
============================================================ */

chatProfileButton?.addEventListener(
    "click",
    showProfile
);

viewProfileOption?.addEventListener(
    "click",
    showProfile
);


function showProfile() {

    if (!currentChatUser)
        return;

    if (profilePopupAvatar)
        profilePopupAvatar.src =
            currentChatUser.photoURL ||
            createAvatar(
                currentChatUser.displayName ||
                "I"
            );

    if (profilePopupName)
        profilePopupName.textContent =
            currentChatUser.displayName ||
            "Iqranix Member";

    if (profilePopupUsername)
        profilePopupUsername.textContent =
            "@" +
            (
                currentChatUser.username ||
                "username"
            );

    profilePopup?.classList.remove(
        "hidden"
    );

    chatMenu?.classList.add(
        "hidden"
    );

}


closeProfilePopup?.addEventListener(
    "click",
    () => {

        profilePopup?.classList.add(
            "hidden"
        );

    }
);


/* ============================================================
   CLOSE CHAT
============================================================ */

closeChatBtn?.addEventListener(
    "click",
    () => {

        if (messagesUnsubscribe) {

            messagesUnsubscribe();
            messagesUnsubscribe = null;

        }

        chatPage?.classList.remove(
            "active"
        );

        document.body.style.overflow = "";

        currentChatUser = null;
        currentConversationId = null;

        loadConversations();

    }
);


/* ============================================================
   BACK
============================================================ */

backBtn?.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);


/* ============================================================
   NEW MESSAGE
============================================================ */

newMessageBtn?.addEventListener(
    "click",
    () => {

        usernameSearch?.focus();

    }
);


/* ============================================================
   CLEAR SEARCH
============================================================ */

clearSearchBtn?.addEventListener(
    "click",
    () => {

        if (usernameSearch)
            usernameSearch.value = "";

        clearSearchBtn?.classList.add(
            "hidden"
        );

        usernameResults?.classList.add(
            "hidden"
        );

    }
);


/* ============================================================
   EMOJI
============================================================ */

emojiBtn?.addEventListener(
    "click",
    () => {

        if (!messageInput)
            return;

        messageInput.value += " 😊";

        messageInput.focus();

    }
);


/* ============================================================
   LOAD CONVERSATIONS
============================================================ */

async function loadConversations() {

    if (!currentUser || !conversationList)
        return;

    try {

        const q =
            query(
                collection(
                    db,
                    "conversations"
                ),
                where(
                    "participants",
                    "array-contains",
                    currentUser.uid
                ),
                limit(50)
            );

        const snapshot =
            await getDocs(q);

        const conversations =
            snapshot.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));

        conversations.sort((a, b) => {

            const at =
                a.lastMessageAt
                    ?.toMillis?.() || 0;

            const bt =
                b.lastMessageAt
                    ?.toMillis?.() || 0;

            return bt - at;

        });

        renderConversations(
            conversations
        );

    } catch (error) {

        console.error(
            "Conversations:",
            error
        );

    }

}


function renderConversations(conversations) {

    if (!conversationList)
        return;

    conversationList.innerHTML = "";

    if (!conversations.length) {

        conversationList.innerHTML = `
            <div class="loading-state">
                <h2>No conversations yet</h2>
                <p>
                    Search a username above
                    to start a conversation.
                </p>
            </div>
        `;

        return;
    }

    conversations.forEach(conversation => {

        const otherUid =
            conversation.participants?.find(
                uid =>
                    uid !== currentUser.uid
            );

        if (!otherUid)
            return;

        const name =
            conversation
                .participantNames?.[otherUid] ||
            "Iqranix Member";

        const username =
            conversation
                .participantUsernames?.[otherUid] ||
            "";

        const photo =
            conversation
                .participantPhotos?.[otherUid] ||
            "";

        const button =
            document.createElement("button");

        button.className =
            "conversation";

        const avatar =
            document.createElement("img");

        avatar.className =
            "conversation-avatar";

        avatar.src =
            photo ||
            createAvatar(name);

        const info =
            document.createElement("div");

        info.className =
            "conversation-info";

        const top =
            document.createElement("div");

        top.className =
            "conversation-top";

        const nameElement =
            document.createElement("span");

        nameElement.className =
            "conversation-name";

        nameElement.textContent =
            name;

        const time =
            document.createElement("span");

        time.className =
            "conversation-time";

        time.textContent =
            formatConversationTime(
                conversation.lastMessageAt
            );

        top.append(
            nameElement,
            time
        );

        const preview =
            document.createElement("div");

        preview.className =
            "conversation-preview";

        preview.textContent =
            conversation.lastMessage ||
            (
                username
                    ? "@" + username
                    : "Start a conversation"
            );

        info.append(
            top,
            preview
        );

        button.append(
            avatar,
            info
        );

        button.addEventListener(
            "click",
            () => openConversation({
                uid: otherUid,
                displayName: name,
                username,
                photoURL: photo
            })
        );

        conversationList.appendChild(
            button
        );

    });

}


/* ============================================================
   TIME
============================================================ */

function formatMessageTime(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !==
        "function"
    )
        return "";

    return timestamp
        .toDate()
        .toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


function formatConversationTime(timestamp) {

    if (
        !timestamp ||
        typeof timestamp.toDate !==
        "function"
    )
        return "";

    const date =
        timestamp.toDate();

    const diff =
        new Date() - date;

    const minutes =
        Math.floor(
            diff / 60000
        );

    if (minutes < 1)
        return "now";

    if (minutes < 60)
        return `${minutes}m`;

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24)
        return `${hours}h`;

    return date.toLocaleDateString(
        [],
        {
            day: "numeric",
            month: "short"
        }
    );

}


/* ============================================================
   AVATAR
============================================================ */

function createAvatar(name) {

    const letter =
        String(name || "I")
            .trim()
            .charAt(0)
            .toUpperCase();

    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
        >
            <circle
                cx="50"
                cy="50"
                r="50"
                fill="#0b6e4f"
            />

            <text
                x="50"
                y="63"
                text-anchor="middle"
                font-family="Arial"
                font-size="42"
                font-weight="700"
                fill="#ffffff"
            >
                ${letter}
            </text>
        </svg>
    `;

    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* ============================================================
   DONE
============================================================ */

console.log(
    "Iqranix Messages + WebRTC Calling loaded."
);