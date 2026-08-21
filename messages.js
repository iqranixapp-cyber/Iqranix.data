/* =========================================================
   IQRANIX MESSAGES — STAGE 1
   Firebase + Firestore + Storage + Native WebRTC

   NO PEERJS

   Stage 1:
   - Conversations
   - Text messages
   - Image messages
   - Firestore WebRTC signaling
   - Audio calls
   - Video calls
   - Incoming calls while app/page is open

   Stage 2:
   - Android background/closed-app call notifications
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    getDoc,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyACoqjK_khqp0yUxbmOG5rRezVJ8qdQZas",

    authDomain:
        "iqranix.firebaseapp.com",

    projectId:
        "iqranix",

    storageBucket:
        "iqranix.firebasestorage.app",

    messagingSenderId:
        "1078213163565",

    appId:
        "1:1078213163565:web:58d4da2a1d68bb6b19d6a4",

    measurementId:
        "G-PKVQ3070SY"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);

const storage =
    getStorage(app);


/* =========================================================
   DOM
========================================================= */

const messagesPage =
    document.getElementById("messagesPage");

const chatPage =
    document.getElementById("chatPage");

const usernameSearch =
    document.getElementById("usernameSearch");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const searchStatus =
    document.getElementById("searchStatus");

const usernameResults =
    document.getElementById("usernameResults");

const conversationList =
    document.getElementById("conversationList");

const newMessageBtn =
    document.getElementById("newMessageBtn");

const backBtn =
    document.getElementById("backBtn");

const chatProfileButton =
    document.getElementById("chatProfileButton");

const chatAvatar =
    document.getElementById("chatAvatar");

const chatName =
    document.getElementById("chatName");

const chatUsername =
    document.getElementById("chatUsername");

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const sendMessageBtn =
    document.getElementById("sendMessageBtn");

const plusBtn =
    document.getElementById("plusBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const voiceMessageBtn =
    document.getElementById("voiceMessageBtn");

const imageFileInput =
    document.getElementById("imageFileInput");

const composer =
    document.getElementById("composer");


/* Calls */

const audioCallButton =
    document.getElementById("audioCallButton");

const videoCallButton =
    document.getElementById("videoCallButton");

const callScreen =
    document.getElementById("callScreen");

const videoCallView =
    document.getElementById("videoCallView");

const audioCallView =
    document.getElementById("audioCallView");

const remoteVideo =
    document.getElementById("remoteVideo");

const localVideo =
    document.getElementById("localVideo");

const callAvatar =
    document.getElementById("callAvatar");

const callName =
    document.getElementById("callName");

const videoCallName =
    document.getElementById("videoCallName");

const activeCallType =
    document.getElementById("activeCallType");

const callStatus =
    document.getElementById("callStatus");

const audioStatusText =
    document.getElementById("audioStatusText");

const muteCallButton =
    document.getElementById("muteCallButton");

const speakerCallButton =
    document.getElementById("speakerCallButton");

const cameraCallButton =
    document.getElementById("cameraCallButton");

const endCallButton =
    document.getElementById("endCallButton");


/* Incoming */

const incomingCall =
    document.getElementById("incomingCall");

const incomingAvatar =
    document.getElementById("incomingAvatar");

const incomingName =
    document.getElementById("incomingName");

const incomingType =
    document.getElementById("incomingType");

const acceptCallButton =
    document.getElementById("acceptCallButton");

const rejectCallButton =
    document.getElementById("rejectCallButton");


/* Profile */

const profilePopup =
    document.getElementById("profilePopup");

const profilePopupAvatar =
    document.getElementById("profilePopupAvatar");

const profilePopupName =
    document.getElementById("profilePopupName");

const profilePopupUsername =
    document.getElementById("profilePopupUsername");

const closeProfilePopup =
    document.getElementById("closeProfilePopup");


/* =========================================================
   DEFAULT AVATAR
========================================================= */

const DEFAULT_AVATAR =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 200 200"
        >
            <rect
                width="200"
                height="200"
                fill="#dfeae5"
            />

            <circle
                cx="100"
                cy="75"
                r="38"
                fill="#8aa89c"
            />

            <circle
                cx="100"
                cy="205"
                r="72"
                fill="#8aa89c"
            />
        </svg>
    `);


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let currentProfile = null;

let currentConversationId = null;

let currentChatUser = null;

let unsubscribeConversations = null;

let unsubscribeMessages = null;

let unsubscribeIncomingCalls = null;

let unsubscribeRemoteCandidates = null;

let currentCall = null;

let currentCallDocId = null;

let currentCallType = null;

let localStream = null;

let peerConnection = null;

let microphoneMuted = false;

let cameraDisabled = false;

let speakerEnabled = true;

let pendingIncomingCall = null;


/* =========================================================
   WEBRTC CONFIG
========================================================= */

const rtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        },

        {
            urls:
                "stun:stun1.l.google.com:19302"
        }

    ]
};


/* =========================================================
   HELPERS
========================================================= */

function safeAvatar(url) {

    return url || DEFAULT_AVATAR;
}


function escapeHTML(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function show(element) {

    element?.classList.remove("hidden");
}


function hide(element) {

    element?.classList.add("hidden");
}


function formatTime(timestamp) {

    if (!timestamp) return "";

    try {

        const date =
            timestamp.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        return date.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    } catch {

        return "";
    }
}


function makeConversationId(uid1, uid2) {

    return [uid1, uid2]
        .sort()
        .join("_");
}


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            currentUser = null;

            conversationList.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-icon">
                        🔐
                    </div>

                    <h3>
                        Sign in required
                    </h3>

                    <p>
                        Sign in to use Iqranix Messages.
                    </p>

                </div>
            `;

            return;
        }


        currentUser = user;


        await loadMyProfile();


        listenForConversations();


        /*
           Stage 1 incoming-call listener.

           This works while the Iqranix page/app
           is active.
        */

        listenForIncomingCalls();
    }
);


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadMyProfile() {

    try {

        const profileRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        const snapshot =
            await getDoc(profileRef);


        if (snapshot.exists()) {

            currentProfile = {

                uid:
                    currentUser.uid,

                ...snapshot.data()

            };

        } else {

            currentProfile = {

                uid:
                    currentUser.uid,

                displayName:
                    currentUser.displayName ||
                    "Iqranix Member",

                username:
                    currentUser.email
                        ? currentUser.email
                            .split("@")[0]
                            .toLowerCase()
                        : "member",

                photoURL:
                    currentUser.photoURL ||
                    DEFAULT_AVATAR
            };
        }

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        currentProfile = {

            uid:
                currentUser.uid,

            displayName:
                currentUser.displayName ||
                "Iqranix Member",

            username:
                "member",

            photoURL:
                currentUser.photoURL ||
                DEFAULT_AVATAR
        };
    }
}


/* =========================================================
   CONVERSATIONS
========================================================= */

function listenForConversations() {

    if (!currentUser) return;


    if (unsubscribeConversations) {

        unsubscribeConversations();

        unsubscribeConversations = null;
    }


    const conversationsQuery =
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

            orderBy(
                "lastMessageAt",
                "desc"
            )
        );


    unsubscribeConversations =
        onSnapshot(

            conversationsQuery,

            (snapshot) => {

                conversationList.innerHTML = "";


                if (snapshot.empty) {

                    conversationList.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                💬
                            </div>

                            <h3>
                                No conversations yet
                            </h3>

                            <p>
                                Search for an Iqranix
                                username to start chatting.
                            </p>

                        </div>

                    `;

                    return;
                }


                snapshot.forEach(
                    docSnap => {

                        renderConversation(
                            docSnap.id,
                            docSnap.data()
                        );
                    }
                );

            },

            error => {

                console.error(
                    "Conversation error:",
                    error
                );

                conversationList.innerHTML = `

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            ⚠️
                        </div>

                        <h3>
                            Messages unavailable
                        </h3>

                        <p>
                            Check your Firestore indexes
                            and rules.
                        </p>

                    </div>
                `;
            }
        );
}


/* =========================================================
   RENDER CONVERSATION
========================================================= */

function renderConversation(
    conversationId,
    data
) {

    const participants =
        data.participants || [];


    const otherUid =
        participants.find(
            uid =>
                uid !== currentUser.uid
        );


    if (!otherUid) return;


    const name =
        data.participantNames?.[otherUid] ||
        "Iqranix Member";


    const username =
        data.participantUsernames?.[otherUid] ||
        "";


    const photo =
        data.participantPhotos?.[otherUid] ||
        DEFAULT_AVATAR;


    const button =
        document.createElement("button");


    button.className =
        "conversation";


    button.innerHTML = `

        <img
            class="conversation-avatar"
            src="${safeAvatar(photo)}"
            alt=""
        >

        <div class="conversation-info">

            <div class="conversation-top">

                <span class="conversation-name">
                    ${escapeHTML(name)}
                </span>

                <span class="conversation-time">
                    ${formatTime(
                        data.lastMessageAt
                    )}
                </span>

            </div>

            <div class="conversation-preview">

                ${escapeHTML(
                    data.lastMessage ||
                    "Start a conversation"
                )}

            </div>

        </div>

    `;


    button.addEventListener(
        "click",
        () => {

            openConversation(

                conversationId,

                {
                    uid:
                        otherUid,

                    displayName:
                        name,

                    username:
                        username,

                    photoURL:
                        photo
                }
            );

        }
    );


    conversationList.appendChild(button);
}


/* =========================================================
   SEARCH
========================================================= */

let searchTimer = null;


usernameSearch?.addEventListener(
    "input",
    () => {

        clearTimeout(
            searchTimer
        );


        const value =
            usernameSearch.value
                .trim()
                .replace(/^@/, "")
                .toLowerCase();


        clearSearchBtn.style.display =
            value
                ? "grid"
                : "none";


        if (!value) {

            hide(usernameResults);

            searchStatus.textContent =
                "";

            return;
        }


        searchStatus.textContent =
            "Searching...";


        searchTimer =
            setTimeout(
                () => searchUsers(value),
                350
            );
    }
);


async function searchUsers(username) {

    if (!currentUser) return;


    try {

        const usersQuery =
            query(

                collection(
                    db,
                    "users"
                ),

                where(
                    "username",
                    "==",
                    username
                ),

                limit(10)
            );


        const snapshot =
            await getDocs(
                usersQuery
            );


        usernameResults.innerHTML =
            "";


        if (snapshot.empty) {

            searchStatus.textContent =
                "No user found.";

            hide(usernameResults);

            return;
        }


        searchStatus.textContent =
            "User found";


        snapshot.forEach(
            docSnap => {

                if (
                    docSnap.id ===
                    currentUser.uid
                ) {
                    return;
                }


                const data =
                    docSnap.data();


                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "username-result";


                button.innerHTML = `

                    <img
                        src="${safeAvatar(
                            data.photoURL
                        )}"
                        alt=""
                    >

                    <div class="username-result-info">

                        <strong>
                            ${escapeHTML(
                                data.displayName ||
                                "Iqranix Member"
                            )}
                        </strong>

                        <span>
                            @${escapeHTML(
                                data.username ||
                                username
                            )}
                        </span>

                    </div>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        startConversationWithUser({

                            uid:
                                docSnap.id,

                            ...data

                        });


                        usernameSearch.value =
                            "";

                        clearSearchBtn.style.display =
                            "none";

                        hide(usernameResults);

                        searchStatus.textContent =
                            "";
                    }
                );


                usernameResults.appendChild(
                    button
                );
            }
        );


        show(usernameResults);

    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        searchStatus.textContent =
            "Search failed.";
    }
}


/* =========================================================
   CLEAR SEARCH
========================================================= */

clearSearchBtn?.addEventListener(
    "click",
    () => {

        usernameSearch.value =
            "";

        clearSearchBtn.style.display =
            "none";

        searchStatus.textContent =
            "";

        hide(usernameResults);

        usernameSearch.focus();
    }
);


/* =========================================================
   NEW MESSAGE
========================================================= */

newMessageBtn?.addEventListener(
    "click",
    () => {

        usernameSearch.focus();

        usernameSearch.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
);


/* =========================================================
   START CONVERSATION
========================================================= */

async function startConversationWithUser(
    user
) {

    if (!currentUser) return;


    const conversationId =
        makeConversationId(
            currentUser.uid,
            user.uid
        );


    const conversationRef =
        doc(
            db,
            "conversations",
            conversationId
        );


    const existing =
        await getDoc(
            conversationRef
        );


    if (!existing.exists()) {

        await setDoc(

            conversationRef,

            {

                participants: [

                    currentUser.uid,

                    user.uid

                ],


                participantNames: {

                    [currentUser.uid]:
                        currentProfile.displayName ||
                        "Iqranix Member",

                    [user.uid]:
                        user.displayName ||
                        "Iqranix Member"
                },


                participantUsernames: {

                    [currentUser.uid]:
                        currentProfile.username ||
                        "",

                    [user.uid]:
                        user.username ||
                        ""
                },


                participantPhotos: {

                    [currentUser.uid]:
                        currentProfile.photoURL ||
                        DEFAULT_AVATAR,

                    [user.uid]:
                        user.photoURL ||
                        DEFAULT_AVATAR
                },


                lastMessage:
                    "",

                lastMessageAt:
                    serverTimestamp(),

                createdAt:
                    serverTimestamp()

            }
        );
    }


    openConversation(
        conversationId,
        user
    );
}


/* =========================================================
   OPEN CHAT
========================================================= */

function openConversation(
    conversationId,
    user
) {

    currentConversationId =
        conversationId;

    currentChatUser =
        user;


    chatName.textContent =
        user.displayName ||
        "Iqranix Member";


    chatUsername.textContent =
        user.username
            ? `@${user.username}`
            : "Iqranix member";


    chatAvatar.src =
        safeAvatar(
            user.photoURL
        );


    hide(messagesPage);

    show(chatPage);


    listenForMessages(
        conversationId
    );


    setTimeout(
        () => {

            messageInput.focus();

            scrollChatToBottom();

        },
        150
    );
}


/* =========================================================
   CLOSE CHAT
========================================================= */

backBtn?.addEventListener(
    "click",
    closeChat
);


function closeChat() {

    hide(chatPage);

    show(messagesPage);


    currentConversationId =
        null;

    currentChatUser =
        null;


    if (unsubscribeMessages) {

        unsubscribeMessages();

        unsubscribeMessages =
            null;
    }


    messageInput.value =
        "";

    messageInput.style.height =
        "40px";
}


/* =========================================================
   MESSAGES
========================================================= */

function listenForMessages(
    conversationId
) {

    if (unsubscribeMessages) {

        unsubscribeMessages();

        unsubscribeMessages = null;
    }


    const messagesQuery =
        query(

            collection(
                db,
                "conversations",
                conversationId,
                "messages"
            ),

            orderBy(
                "createdAt",
                "asc"
            )
        );


    unsubscribeMessages =
        onSnapshot(

            messagesQuery,

            snapshot => {

                chatMessages.innerHTML =
                    "";


                if (snapshot.empty) {

                    chatMessages.innerHTML = `

                        <div class="chat-empty">

                            <div class="chat-empty-icon">
                                ☾
                            </div>

                            <h3>
                                Start your conversation
                            </h3>

                            <p>
                                Send a message to begin.
                            </p>

                        </div>

                    `;

                    return;
                }


                snapshot.forEach(
                    docSnap => {

                        renderMessage(
                            docSnap.data()
                        );
                    }
                );


                requestAnimationFrame(
                    scrollChatToBottom
                );

            },

            error => {

                console.error(
                    "Messages error:",
                    error
                );
            }
        );
}


/* =========================================================
   RENDER MESSAGE
========================================================= */

function renderMessage(data) {

    const wrapper =
        document.createElement(
            "div"
        );


    const sent =
        data.senderId ===
        currentUser.uid;


    wrapper.className =
        `message ${
            sent
                ? "sent"
                : "received"
        }`;


    if (
        data.type === "image" &&
        data.imageUrl
    ) {

        wrapper.innerHTML = `

            <img
                src="${safeAvatar(
                    data.imageUrl
                )}"
                class="message-image"
                alt="Image message"
            >

            <span class="message-time">
                ${formatTime(
                    data.createdAt
                )}
            </span>

        `;

    } else {

        wrapper.innerHTML = `

            ${escapeHTML(
                data.text || ""
            )}

            <span class="message-time">
                ${formatTime(
                    data.createdAt
                )}
            </span>

        `;
    }


    chatMessages.appendChild(
        wrapper
    );
}


/* =========================================================
   SEND TEXT
========================================================= */

sendMessageBtn?.addEventListener(
    "click",
    sendTextMessage
);


messageInput?.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendTextMessage();
        }
    }
);


async function sendTextMessage() {

    const text =
        messageInput.value.trim();


    if (!text) return;


    if (
        !currentUser ||
        !currentConversationId ||
        !currentChatUser
    ) {
        return;
    }


    sendMessageBtn.disabled =
        true;


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

                text:

                    text,

                type:
                    "text",

                createdAt:
                    serverTimestamp()

            }
        );


        await updateConversationPreview(
            text
        );


        messageInput.value =
            "";

        messageInput.style.height =
            "40px";


    } catch (error) {

        console.error(
            "Send error:",
            error
        );

        alert(
            "Message could not be sent."
        );

    } finally {

        sendMessageBtn.disabled =
            false;
    }
}


/* =========================================================
   CONVERSATION PREVIEW
========================================================= */

async function updateConversationPreview(
    text
) {

    await updateDoc(

        doc(
            db,
            "conversations",
            currentConversationId
        ),

        {

            lastMessage:
                text,

            lastMessageAt:
                serverTimestamp()

        }
    );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

plusBtn?.addEventListener(
    "click",
    () => imageFileInput.click()
);


imageFileInput?.addEventListener(
    "change",
    uploadImage
);


async function uploadImage() {

    const file =
        imageFileInput.files?.[0];


    if (!file) return;


    if (
        !currentUser ||
        !currentConversationId ||
        !currentChatUser
    ) {
        return;
    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please select an image."
        );

        return;
    }


    if (
        file.size >
        10 * 1024 * 1024
    ) {

        alert(
            "Image must be smaller than 10 MB."
        );

        return;
    }


    plusBtn.disabled =
        true;


    try {

        const safeName =
            file.name.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


        const path =
            `messages/${
                currentUser.uid
            }/${
                currentConversationId
            }/${
                Date.now()
            }_${safeName}`;


        const storageRef =
            ref(
                storage,
                path
            );


        await uploadBytes(
            storageRef,
            file
        );


        const imageUrl =
            await getDownloadURL(
                storageRef
            );


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

                text:
                    "",

                type:
                    "image",

                imageUrl:

                    imageUrl,

                storagePath:

                    path,

                createdAt:
                    serverTimestamp()

            }
        );


        await updateConversationPreview(
            "📷 Image"
        );


    } catch (error) {

        console.error(
            "Image error:",
            error
        );

        alert(
            "Image upload failed. Check Firebase Storage rules."
        );

    } finally {

        plusBtn.disabled =
            false;

        imageFileInput.value =
            "";
    }
}


/* =========================================================
   EMOJI
========================================================= */

emojiBtn?.addEventListener(
    "click",
    () => {

        const emojis = [
            "😊",
            "❤️",
            "😂",
            "👍",
            "🙏",
            "✨",
            "🤲",
            "🕌",
            "🌙"
        ];


        const emoji =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        insertAtCursor(
            messageInput,
            emoji
        );
    }
);


function insertAtCursor(
    textarea,
    text
) {

    const start =
        textarea.selectionStart;


    const end =
        textarea.selectionEnd;


    textarea.value =
        textarea.value.substring(
            0,
            start
        ) +
        text +
        textarea.value.substring(
            end
        );


    textarea.selectionStart =
        textarea.selectionEnd =
        start + text.length;


    textarea.focus();
}


/* =========================================================
   VOICE BUTTON
========================================================= */

voiceMessageBtn?.addEventListener(
    "click",
    () => {

        alert(
            "Voice messages will be added in a later Messages update."
        );
    }
);


/* =========================================================
   TEXTAREA
========================================================= */

messageInput?.addEventListener(
    "input",
    () => {

        messageInput.style.height =
            "auto";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                120
            ) + "px";
    }
);


/* =========================================================
   SCROLL
========================================================= */

function scrollChatToBottom() {

    if (!chatMessages) return;


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* =========================================================
   PROFILE
========================================================= */

chatProfileButton?.addEventListener(
    "click",
    () => {

        if (!currentChatUser) return;


        profilePopupAvatar.src =
            safeAvatar(
                currentChatUser.photoURL
            );


        profilePopupName.textContent =
            currentChatUser.displayName ||
            "Iqranix Member";


        profilePopupUsername.textContent =
            currentChatUser.username
                ? `@${currentChatUser.username}`
                : "Iqranix member";


        show(profilePopup);
    }
);


closeProfilePopup?.addEventListener(
    "click",
    () => hide(profilePopup)
);


profilePopup?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            profilePopup
        ) {

            hide(profilePopup);
        }
    }
);


/* =========================================================
   START AUDIO CALL
========================================================= */

audioCallButton?.addEventListener(
    "click",
    () => {

        startOutgoingCall(
            "audio"
        );
    }
);


/* =========================================================
   START VIDEO CALL
========================================================= */

videoCallButton?.addEventListener(
    "click",
    () => {

        startOutgoingCall(
            "video"
        );
    }
);


/* =========================================================
   GET MEDIA
========================================================= */

async function getLocalStream(
    type
) {

    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track => track.stop()
            );
    }


    const constraints = {

        audio: true,

        video:
            type === "video"
                ? {
                    facingMode:
                        "user",

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    }
                }
                : false
    };


    localStream =
        await navigator.mediaDevices
            .getUserMedia(
                constraints
            );


    if (
        type === "video" &&
        localVideo
    ) {

        localVideo.srcObject =
            localStream;
    }


    microphoneMuted =
        false;

    cameraDisabled =
        false;


    updateCallControls();
}


/* =========================================================
   CREATE PEER CONNECTION
========================================================= */

function createPeerConnection(
    callId,
    isCaller
) {

    peerConnection =
        new RTCPeerConnection(
            rtcConfiguration
        );


    /*
       Add local media.
    */

    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track => {

                    peerConnection.addTrack(
                        track,
                        localStream
                    );
                }
            );
    }


    /*
       Receive remote media.
    */

    peerConnection.ontrack =
        event => {

            const stream =
                event.streams[0];


            if (remoteVideo) {

                remoteVideo.srcObject =
                    stream;
            }


            setCallStatus(
                "Connected"
            );
        };


    /*
       ICE candidates.
    */

    peerConnection.onicecandidate =
        async event => {

            if (
                !event.candidate
            ) {
                return;
            }


            const collectionName =
                isCaller
                    ? "callerCandidates"
                    : "calleeCandidates";


            try {

                await addDoc(

                    collection(
                        db,
                        "calls",
                        callId,
                        collectionName
                    ),

                    event.candidate.toJSON()
                );

            } catch (error) {

                console.error(
                    "ICE candidate error:",
                    error
                );
            }
        };


    /*
       Connection monitoring.
    */

    peerConnection.onconnectionstatechange =
        () => {

            const state =
                peerConnection.connectionState;


            console.log(
                "WebRTC connection:",
                state
            );


            if (
                state ===
                "connected"
            ) {

                setCallStatus(
                    "Connected"
                );
            }


            if (
                state ===
                "connecting"
            ) {

                setCallStatus(
                    "Connecting..."
                );
            }


            if (
                state ===
                "disconnected" ||
                state ===
                "failed"
            ) {

                setCallStatus(
                    "Connection lost"
                );
            }
        };


    return peerConnection;
}


/* =========================================================
   LISTEN FOR REMOTE ICE
========================================================= */

function listenForRemoteCandidates(
    callId,
    collectionName
) {

    if (
        unsubscribeRemoteCandidates
    ) {

        unsubscribeRemoteCandidates();

        unsubscribeRemoteCandidates =
            null;
    }


    const candidatesQuery =
        collection(
            db,
            "calls",
            callId,
            collectionName
        );


    unsubscribeRemoteCandidates =
        onSnapshot(

            candidatesQuery,

            snapshot => {

                snapshot.docChanges()
                    .forEach(
                        async change => {

                            if (
                                change.type !==
                                "added"
                            ) {
                                return;
                            }


                            if (
                                !peerConnection
                            ) {
                                return;
                            }


                            try {

                                await peerConnection
                                    .addIceCandidate(
                                        new RTCIceCandidate(
                                            change.doc.data()
                                        )
                                    );

                            } catch (error) {

                                console.warn(
                                    "Could not add ICE candidate:",
                                    error
                                );
                            }
                        }
                    );
            }
        );
}


/* =========================================================
   OUTGOING CALL
========================================================= */

async function startOutgoingCall(
    type
) {

    if (
        !currentUser ||
        !currentChatUser
    ) {

        alert(
            "Open a conversation first."
        );

        return;
    }


    try {

        setCallInterface(
            type
        );


        setCallStatus(
            "Calling..."
        );


        await getLocalStream(
            type
        );


        /*
           Create call document.
        */

        const callRef =
            await addDoc(

                collection(
                    db,
                    "calls"
                ),

                {

                    callerId:
                        currentUser.uid,

                    receiverId:
                        currentChatUser.uid,

                    type:
                        type,

                    status:
                        "calling",

                    createdAt:
                        serverTimestamp()

                }
            );


        currentCallDocId =
            callRef.id;

        currentCallType =
            type;


        createPeerConnection(
            currentCallDocId,
            true
        );


        listenForRemoteCandidates(
            currentCallDocId,
            "calleeCandidates"
        );


        /*
           Create WebRTC offer.
        */

        const offer =
            await peerConnection
                .createOffer();


        await peerConnection
            .setLocalDescription(
                offer
            );


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


        /*
           Wait for receiver answer.
        */

        const unsubscribeAnswer =
            onSnapshot(

                callRef,

                async snapshot => {

                    const data =
                        snapshot.data();


                    if (!data) return;


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

                            setCallStatus(
                                "Connected"
                            );

                        } catch (error) {

                            console.error(
                                "Answer error:",
                                error
                            );
                        }
                    }


                    if (
                        data.status ===
                        "rejected"
                    ) {

                        unsubscribeAnswer();

                        alert(
                            "The call was declined."
                        );

                        endCall(
                            true
                        );
                    }


                    if (
                        data.status ===
                        "ended"
                    ) {

                        unsubscribeAnswer();

                        endCall(
                            false
                        );
                    }
                }
            );


        currentCall =
            {
                unsubscribeAnswer
            };


    } catch (error) {

        console.error(
            "Outgoing call error:",
            error
        );


        hideCallScreen();


        handleCallError(
            error
        );
    }
}


/* =========================================================
   INCOMING CALL LISTENER
========================================================= */

function listenForIncomingCalls() {

    if (
        unsubscribeIncomingCalls
    ) {

        unsubscribeIncomingCalls();

        unsubscribeIncomingCalls =
            null;
    }


    /*
       IMPORTANT:

       This listener receives incoming calls
       while this page is alive.

       Stage 2 will connect this system to
       Android push notifications.
    */

    const callsQuery =
        query(

            collection(
                db,
                "calls"
            ),

            where(
                "receiverId",
                "==",
                currentUser.uid
            ),

            where(
                "status",
                "==",
                "calling"
            ),

            orderBy(
                "createdAt",
                "desc"
            ),

            limit(1)
        );


    unsubscribeIncomingCalls =
        onSnapshot(

            callsQuery,

            async snapshot => {

                if (
                    snapshot.empty
                ) {
                    return;
                }


                const callDoc =
                    snapshot.docs[0];


                if (
                    pendingIncomingCall ===
                    callDoc.id
                ) {
                    return;
                }


                pendingIncomingCall =
                    callDoc.id;


                await showIncomingCall(
                    callDoc.id,
                    callDoc.data()
                );
            },

            error => {

                console.error(
                    "Incoming call listener:",
                    error
                );
            }
        );
}


/* =========================================================
   SHOW INCOMING CALL
========================================================= */

async function showIncomingCall(
    callId,
    data
) {

    let caller = null;


    try {

        const callerRef =
            await getDoc(

                doc(
                    db,
                    "users",
                    data.callerId
                )
            );


        if (
            callerRef.exists()
        ) {

            caller = {

                uid:
                    data.callerId,

                ...callerRef.data()

            };
        }

    } catch (error) {

        console.warn(
            "Caller profile error:",
            error
        );
    }


    caller =
        caller || {

            uid:
                data.callerId,

            displayName:
                "Iqranix Member",

            username:
                "member",

            photoURL:
                DEFAULT_AVATAR
        };


    incomingName.textContent =
        caller.displayName ||
        "Iqranix Member";


    incomingAvatar.src =
        safeAvatar(
            caller.photoURL
        );


    incomingType.textContent =
        data.type === "video"
            ? "Incoming video call"
            : "Incoming audio call";


    /*
       Save incoming call information.
    */

    incomingCall.dataset.callId =
        callId;

    incomingCall.dataset.callerId =
        data.callerId;

    incomingCall.dataset.type =
        data.type;


    show(
        incomingCall
    );
}


/* =========================================================
   ACCEPT CALL
========================================================= */

acceptCallButton?.addEventListener(
    "click",
    acceptIncomingCall
);


async function acceptIncomingCall() {

    const callId =
        incomingCall.dataset.callId;


    if (!callId) return;


    try {

        const callRef =
            doc(
                db,
                "calls",
                callId
            );


        const callSnapshot =
            await getDoc(
                callRef
            );


        if (
            !callSnapshot.exists()
        ) {

            alert(
                "This call is no longer available."
            );

            hide(
                incomingCall
            );

            return;
        }


        const data =
            callSnapshot.data();


        const type =
            data.type === "video"
                ? "video"
                : "audio";


        hide(
            incomingCall
        );


        setCallInterface(
            type
        );


        setCallStatus(
            "Connecting..."
        );


        await getLocalStream(
            type
        );


        currentCallDocId =
            callId;

        currentCallType =
            type;


        createPeerConnection(
            callId,
            false
        );


        listenForRemoteCandidates(
            callId,
            "callerCandidates"
        );


        /*
           Receive caller's offer.
        */

        if (!data.offer) {

            throw new Error(
                "Caller offer not available."
            );
        }


        await peerConnection
            .setRemoteDescription(

                new RTCSessionDescription(
                    data.offer
                )
            );


        /*
           Create answer.
        */

        const answer =
            await peerConnection
                .createAnswer();


        await peerConnection
            .setLocalDescription(
                answer
            );


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


    } catch (error) {

        console.error(
            "Accept call error:",
            error
        );


        hide(
            incomingCall
        );


        handleCallError(
            error
        );
    }
}


/* =========================================================
   REJECT CALL
========================================================= */

rejectCallButton?.addEventListener(
    "click",
    rejectIncomingCall
);


async function rejectIncomingCall() {

    const callId =
        incomingCall.dataset.callId;


    hide(
        incomingCall
    );


    pendingIncomingCall =
        null;


    if (!callId) return;


    try {

        await updateDoc(

            doc(
                db,
                "calls",
                callId
            ),

            {
                status:
                    "rejected"
            }
        );

    } catch (error) {

        console.error(
            "Reject call error:",
            error
        );
    }
}


/* =========================================================
   CALL UI
========================================================= */

function setCallInterface(
    type
) {

    activeCallType.textContent =
        type === "video"
            ? "Video call"
            : "Audio call";


    const name =
        currentChatUser?.displayName ||
        "Iqranix Member";


    callName.textContent =
        name;


    videoCallName.textContent =
        name;


    callAvatar.src =
        safeAvatar(
            currentChatUser?.photoURL
        );


    if (type === "video") {

        show(
            videoCallView
        );

        hide(
            audioCallView
        );

    } else {

        show(
            audioCallView
        );

        hide(
            videoCallView
        );
    }


    show(
        callScreen
    );
}


function setCallStatus(
    text
) {

    if (callStatus) {

        callStatus.textContent =
            text;
    }


    if (audioStatusText) {

        audioStatusText.textContent =
            text;
    }
}


/* =========================================================
   MUTE
========================================================= */

muteCallButton?.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const tracks =
            localStream.getAudioTracks();


        if (!tracks.length) return;


        microphoneMuted =
            !microphoneMuted;


        tracks.forEach(
            track => {

                track.enabled =
                    !microphoneMuted;
            }
        );


        updateCallControls();
    }
);


/* =========================================================
   CAMERA
========================================================= */

cameraCallButton?.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const tracks =
            localStream.getVideoTracks();


        if (!tracks.length) return;


        cameraDisabled =
            !cameraDisabled;


        tracks.forEach(
            track => {

                track.enabled =
                    !cameraDisabled;
            }
        );


        updateCallControls();
    }
);


/* =========================================================
   SPEAKER
========================================================= */

speakerCallButton?.addEventListener(
    "click",
    () => {

        speakerEnabled =
            !speakerEnabled;


        if (remoteVideo) {

            remoteVideo.muted =
                !speakerEnabled;
        }


        speakerCallButton.textContent =
            speakerEnabled
                ? "🔊"
                : "🔇";
    }
);


/* =========================================================
   CALL CONTROLS
========================================================= */

function updateCallControls() {

    muteCallButton.textContent =
        microphoneMuted
            ? "🔇"
            : "🎙";


    cameraCallButton.textContent =
        cameraDisabled
            ? "🚫"
            : "▣";
}


/* =========================================================
   END CALL
========================================================= */

endCallButton?.addEventListener(
    "click",
    () => endCall(true)
);


async function endCall(
    updateFirestore = true
) {

    const callId =
        currentCallDocId;


    /*
       Tell other participant.
    */

    if (
        updateFirestore &&
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
                    status:
                        "ended"
                }
            );

        } catch (error) {

            console.warn(
                "Could not update call:",
                error
            );
        }
    }


    /*
       Close WebRTC.
    */

    if (peerConnection) {

        try {

            peerConnection.close();

        } catch {}
    }


    peerConnection =
        null;


    /*
       Stop microphone/camera.
    */

    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track => track.stop()
            );
    }


    localStream =
        null;


    if (remoteVideo) {

        remoteVideo.srcObject =
            null;
    }


    if (localVideo) {

        localVideo.srcObject =
            null;
    }


    if (
        unsubscribeRemoteCandidates
    ) {

        unsubscribeRemoteCandidates();

        unsubscribeRemoteCandidates =
            null;
    }


    if (
        currentCall?.unsubscribeAnswer
    ) {

        currentCall
            .unsubscribeAnswer();
    }


    currentCall =
        null;

    currentCallDocId =
        null;

    currentCallType =
        null;


    microphoneMuted =
        false;

    cameraDisabled =
        false;


    hide(
        callScreen
    );


    updateCallControls();
}


/* =========================================================
   CALL ERROR
========================================================= */

function handleCallError(
    error
) {

    console.error(
        error
    );


    if (
        error.name ===
        "NotAllowedError"
    ) {

        alert(
            "Camera or microphone permission was denied. Allow the required permission and try again."
        );

        return;
    }


    if (
        error.name ===
        "NotFoundError"
    ) {

        alert(
            "The required camera or microphone was not found."
        );

        return;
    }


    if (
        error.name ===
        "NotReadableError"
    ) {

        alert(
            "Your camera or microphone is already being used by another application."
        );

        return;
    }


    alert(
        "The call could not be started."
    );
}


/* =========================================================
   STARTUP
========================================================= */

updateCallControls();


console.log(
    "Iqranix Messages Stage 1 loaded."
);