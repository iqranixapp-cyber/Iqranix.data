/* =========================================================
   IQRANIX MESSAGES
   PeerJS audio/video calling
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const messagesPage =
    document.getElementById("messagesPage");

const chatPage =
    document.getElementById("chatPage");

const newChatBtn =
    document.getElementById("newChatBtn");

const startChatBtn =
    document.getElementById("startChatBtn");

const newChatModal =
    document.getElementById("newChatModal");

const closeModal =
    document.getElementById("closeModal");

const peerIdInput =
    document.getElementById("peerIdInput");

const connectPeerBtn =
    document.getElementById("connectPeerBtn");

const backChat =
    document.getElementById("backChat");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const chatMessages =
    document.getElementById("chatMessages");

const attachBtn =
    document.getElementById("attachBtn");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const chooseImage =
    document.getElementById("chooseImage");

const imageInput =
    document.getElementById("imageInput");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPanel =
    document.getElementById("emojiPanel");

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");


/* =========================================================
   CHAT USER
========================================================= */

const chatName =
    document.getElementById("chatName");

const chatUsername =
    document.getElementById("chatUsername");

const chatAvatar =
    document.getElementById("chatAvatar");


/* =========================================================
   CALL ELEMENTS
========================================================= */

const callScreen =
    document.getElementById("callScreen");

const remoteVideo =
    document.getElementById("remoteVideo");

const localVideo =
    document.getElementById("localVideo");

const audioCallBackground =
    document.getElementById("audioCallBackground");

const callAvatar =
    document.getElementById("callAvatar");

const callName =
    document.getElementById("callName");

const callStatus =
    document.getElementById("callStatus");

const callType =
    document.getElementById("callType");

const audioCallBtn =
    document.getElementById("audioCallBtn");

const videoCallBtn =
    document.getElementById("videoCallBtn");

const endCallBtn =
    document.getElementById("endCallBtn");

const muteBtn =
    document.getElementById("muteBtn");

const cameraBtn =
    document.getElementById("cameraBtn");

const speakerBtn =
    document.getElementById("speakerBtn");


/* =========================================================
   INCOMING CALL
========================================================= */

const incomingCall =
    document.getElementById("incomingCall");

const incomingName =
    document.getElementById("incomingName");

const incomingCallType =
    document.getElementById("incomingCallType");

const incomingAvatar =
    document.getElementById("incomingAvatar");

const acceptCallBtn =
    document.getElementById("acceptCallBtn");

const rejectCallBtn =
    document.getElementById("rejectCallBtn");


/* =========================================================
   STATE
========================================================= */

let peer = null;

let localStream = null;

let currentCall = null;

let incomingCallObject = null;

let currentConnection = null;

let currentPeerId = null;

let currentCallMode = "video";

let microphoneEnabled = true;

let cameraEnabled = true;


/* =========================================================
   DEFAULT AVATAR
========================================================= */

const DEFAULT_AVATAR =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="200"
             height="200"
             viewBox="0 0 200 200">

            <rect width="200" height="200"
                  fill="#E9F6F0"/>

            <circle cx="100"
                    cy="76"
                    r="38"
                    fill="#0B6E4F"/>

            <path
                d="M35 180
                   C40 130 160 130 165 180"
                fill="#0B6E4F"/>
        </svg>
    `);


/* =========================================================
   INITIAL UI
========================================================= */

chatAvatar.src = DEFAULT_AVATAR;

callAvatar.src = DEFAULT_AVATAR;

incomingAvatar.src = DEFAULT_AVATAR;


/* =========================================================
   PEERJS
========================================================= */

function initializePeer() {

    if (typeof Peer === "undefined") {

        console.error(
            "PeerJS failed to load."
        );

        return;

    }


    peer = new Peer();


    peer.on("open", id => {

        currentPeerId = id;

        console.log(
            "Your Peer ID:",
            id
        );

        localStorage.setItem(
            "iqranix_peer_id",
            id
        );

    });


    peer.on("error", error => {

        console.error(
            "PeerJS error:",
            error
        );

        if (
            error.type ===
            "peer-unavailable"
        ) {

            alert(
                "That Peer ID could not be found."
            );

        }

    });


    /*
     * INCOMING CALL
     */

    peer.on("call", call => {

        incomingCallObject = call;

        const metadata =
            call.metadata || {};

        const type =
            metadata.type || "video";

        const name =
            metadata.name ||
            "Iqranix Member";


        incomingName.textContent =
            name;

        incomingCallType.textContent =
            type === "audio"
                ? "Incoming audio call"
                : "Incoming video call";


        incomingAvatar.src =
            metadata.avatar ||
            DEFAULT_AVATAR;


        incomingCall.classList.add(
            "show"
        );

    });


    /*
     * DATA CONNECTION
     */

    peer.on("connection", connection => {

        connection.on("open", () => {

            currentConnection =
                connection;

            console.log(
                "Data connection established."
            );

        });


        connection.on("data", data => {

            handleIncomingData(data);

        });

    });

}


/* =========================================================
   REQUEST MICROPHONE
========================================================= */

async function getAudioStream() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });

        return stream;

    } catch (error) {

        console.error(
            "Microphone permission error:",
            error
        );

        throw error;

    }

}


/* =========================================================
   REQUEST CAMERA + MICROPHONE
========================================================= */

async function getVideoStream() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: true
            });

        return stream;

    } catch (error) {

        console.error(
            "Camera/microphone error:",
            error
        );

        throw error;

    }

}


/* =========================================================
   START AUDIO CALL
========================================================= */

async function startAudioCall() {

    if (!currentPeerId) {

        alert(
            "Your calling connection is still starting. Please wait a moment."
        );

        return;

    }


    const target =
        peerIdInput.value.trim() ||
        currentPeerIdForChat();


    if (!target) {

        openNewChatModal();

        return;

    }


    try {

        localStream =
            await getAudioStream();

        currentCallMode =
            "audio";


        localVideo.srcObject = null;

        audioCallBackground.classList.add(
            "show"
        );

        callType.textContent =
            "Audio call";

        callStatus.textContent =
            "Calling...";


        showCallScreen();


        currentCall =
            peer.call(
                target,
                localStream,
                {
                    metadata: {
                        type: "audio",
                        name:
                            chatName.textContent,
                        avatar:
                            chatAvatar.src
                    }
                }
            );


        setupCall(currentCall);

    } catch (error) {

        alert(
            "Microphone permission is required for an audio call."
        );

    }

}


/* =========================================================
   START VIDEO CALL
========================================================= */

async function startVideoCall() {

    if (!currentPeerId) {

        alert(
            "Your calling connection is still starting. Please wait a moment."
        );

        return;

    }


    const target =
        currentPeerIdForChat();


    if (!target) {

        openNewChatModal();

        return;

    }


    try {

        localStream =
            await getVideoStream();

        currentCallMode =
            "video";


        localVideo.srcObject =
            localStream;


        audioCallBackground.classList.remove(
            "show"
        );


        callType.textContent =
            "Video call";

        callStatus.textContent =
            "Calling...";


        showCallScreen();


        currentCall =
            peer.call(
                target,
                localStream,
                {
                    metadata: {
                        type: "video",
                        name:
                            chatName.textContent,
                        avatar:
                            chatAvatar.src
                    }
                }
            );


        setupCall(currentCall);

    } catch (error) {

        alert(
            "Camera and microphone permission is required for a video call."
        );

    }

}


/* =========================================================
   SETUP CALL
========================================================= */

function setupCall(call) {

    if (!call) return;


    currentCall = call;


    call.on("stream", remoteStream => {

        remoteVideo.srcObject =
            remoteStream;

        callStatus.textContent =
            "Connected";

    });


    call.on("close", () => {

        endCurrentCall(false);

    });


    call.on("error", error => {

        console.error(
            "Call error:",
            error
        );

        endCurrentCall(false);

    });

}


/* =========================================================
   ACCEPT CALL
========================================================= */

acceptCallBtn.addEventListener(
    "click",
    async () => {

        if (!incomingCallObject) return;


        const call =
            incomingCallObject;

        const metadata =
            call.metadata || {};

        const type =
            metadata.type || "video";


        try {

            if (type === "audio") {

                localStream =
                    await getAudioStream();

                currentCallMode =
                    "audio";

                localVideo.srcObject =
                    null;

                audioCallBackground.classList.add(
                    "show"
                );

            } else {

                localStream =
                    await getVideoStream();

                currentCallMode =
                    "video";

                localVideo.srcObject =
                    localStream;

                audioCallBackground.classList.remove(
                    "show"
                );

            }


            incomingCall.classList.remove(
                "show"
            );


            callType.textContent =
                type === "audio"
                    ? "Audio call"
                    : "Video call";


            callStatus.textContent =
                "Connecting...";


            showCallScreen();


            call.answer(
                localStream
            );


            setupCall(call);


            incomingCallObject =
                null;

        } catch (error) {

            alert(
                "Camera or microphone permission was not granted."
            );

        }

    }
);


/* =========================================================
   REJECT CALL
========================================================= */

rejectCallBtn.addEventListener(
    "click",
    () => {

        if (incomingCallObject) {

            incomingCallObject.close();

            incomingCallObject =
                null;

        }

        incomingCall.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   END CALL
========================================================= */

endCallBtn.addEventListener(
    "click",
    () => {

        endCurrentCall(true);

    }
);


function endCurrentCall(closePeerCall = true) {

    if (
        closePeerCall &&
        currentCall
    ) {

        try {

            currentCall.close();

        } catch {}

    }


    if (localStream) {

        localStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

    }


    if (remoteVideo) {

        remoteVideo.srcObject =
            null;

    }


    if (localVideo) {

        localVideo.srcObject =
            null;

    }


    localStream =
        null;

    currentCall =
        null;


    hideCallScreen();

}


/* =========================================================
   CALL SCREEN
========================================================= */

function showCallScreen() {

    callScreen.classList.add(
        "show"
    );

}


function hideCallScreen() {

    callScreen.classList.remove(
        "show"
    );

}


/* =========================================================
   MUTE
========================================================= */

muteBtn.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const audioTracks =
            localStream.getAudioTracks();


        audioTracks.forEach(track => {

            track.enabled =
                !track.enabled;

            microphoneEnabled =
                track.enabled;

        });


        muteBtn.textContent =
            microphoneEnabled
                ? "🎙"
                : "🔇";

    }
);


/* =========================================================
   CAMERA
========================================================= */

cameraBtn.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const videoTracks =
            localStream.getVideoTracks();


        if (!videoTracks.length) {

            return;

        }


        videoTracks.forEach(track => {

            track.enabled =
                !track.enabled;

            cameraEnabled =
                track.enabled;

        });


        cameraBtn.textContent =
            cameraEnabled
                ? "▣"
                : "🚫";

    }
);


/* =========================================================
   SPEAKER
========================================================= */

speakerBtn.addEventListener(
    "click",
    () => {

        remoteVideo.muted =
            !remoteVideo.muted;


        speakerBtn.textContent =
            remoteVideo.muted
                ? "🔇"
                : "🔊";

    }
);


/* =========================================================
   CHAT CONNECTION
========================================================= */

function connectToPeer(peerId) {

    if (!peer) {

        alert(
            "Calling system is still loading."
        );

        return;

    }


    if (!peerId) return;


    const connection =
        peer.connect(
            peerId,
            {
                reliable: true
            }
        );


    connection.on("open", () => {

        currentConnection =
            connection;

        console.log(
            "Connected to:",
            peerId
        );

        addSystemMessage(
            "Connected."
        );

    });


    connection.on("data", data => {

        handleIncomingData(data);

    });


    connection.on("close", () => {

        currentConnection =
            null;

    });


    connection.on("error", error => {

        console.error(
            error
        );

    });

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) return;


    addMessage(
        text,
        "sent"
    );


    if (currentConnection) {

        currentConnection.send({

            type: "text",

            text: text,

            time:
                Date.now()

        });

    } else {

        addSystemMessage(
            "Message shown locally. Connect to the other member's Peer ID to send it."
        );

    }


    messageInput.value = "";

    autoResizeTextarea();

    scrollToBottom();

}


/* =========================================================
   RECEIVE DATA
========================================================= */

function handleIncomingData(data) {

    if (!data) return;


    if (
        typeof data === "object" &&
        data.type === "text"
    ) {

        addMessage(
            data.text,
            "received",
            data.time
        );

    }


    if (
        typeof data === "object" &&
        data.type === "image"
    ) {

        addImageMessage(
            data.data,
            "received"
        );

    }

}


/* =========================================================
   MESSAGE UI
========================================================= */

function addMessage(
    text,
    direction,
    timestamp = Date.now()
) {

    const empty =
        chatMessages.querySelector(
            ".chat-start"
        );

    if (empty) {

        empty.remove();

    }


    const bubble =
        document.createElement(
            "div"
        );

    bubble.className =
        `message ${direction}`;


    const content =
        document.createElement(
            "div"
        );

    content.textContent =
        text;


    const time =
        document.createElement(
            "span"
        );

    time.className =
        "message-time";


    time.textContent =
        new Date(timestamp)
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


    bubble.appendChild(
        content
    );

    bubble.appendChild(
        time
    );


    chatMessages.appendChild(
        bubble
    );


    scrollToBottom();

}


/* =========================================================
   IMAGE MESSAGE
========================================================= */

function addImageMessage(
    src,
    direction
) {

    const bubble =
        document.createElement(
            "div"
        );

    bubble.className =
        `message ${direction}`;


    const image =
        document.createElement(
            "img"
        );

    image.src =
        src;

    image.style.width =
        "220px";

    image.style.maxWidth =
        "100%";

    image.style.borderRadius =
        "14px";


    bubble.appendChild(
        image
    );


    chatMessages.appendChild(
        bubble
    );


    scrollToBottom();

}


/* =========================================================
   SYSTEM MESSAGE
========================================================= */

function addSystemMessage(text) {

    const element =
        document.createElement(
            "div"
        );

    element.style.textAlign =
        "center";

    element.style.fontSize =
        "12px";

    element.style.color =
        "#718078";

    element.style.padding =
        "8px";


    element.textContent =
        text;


    chatMessages.appendChild(
        element
    );

}


/* =========================================================
   IMAGE SELECTION
========================================================= */

chooseImage.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);


imageInput.addEventListener(
    "change",
    () => {

        const file =
            imageInput.files[0];

        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            event => {

                const imageData =
                    event.target.result;


                /*
                 * Show immediately.
                 */

                addImageMessage(
                    imageData,
                    "sent"
                );


                /*
                 * Send through PeerJS.
                 *
                 * This is intended for testing.
                 * Large images should eventually
                 * use Firebase Storage.
                 */

                if (currentConnection) {

                    currentConnection.send({

                        type: "image",

                        data: imageData

                    });

                }


                imageInput.value = "";

            };


        reader.readAsDataURL(file);

    }
);


/* =========================================================
   ATTACHMENT MENU
========================================================= */

attachBtn.addEventListener(
    "click",
    () => {

        emojiPanel.classList.remove(
            "show"
        );

        attachmentMenu.classList.toggle(
            "show"
        );

    }
);


/* =========================================================
   EMOJI
========================================================= */

emojiBtn.addEventListener(
    "click",
    () => {

        attachmentMenu.classList.remove(
            "show"
        );

        emojiPanel.classList.toggle(
            "show"
        );

    }
);


emojiPanel
    .querySelectorAll("button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                insertEmoji(
                    button.textContent
                );

            }
        );

    });


function insertEmoji(emoji) {

    const start =
        messageInput.selectionStart;

    const end =
        messageInput.selectionEnd;

    const text =
        messageInput.value;


    messageInput.value =
        text.substring(
            0,
            start
        ) +
        emoji +
        text.substring(
            end
        );


    messageInput.focus();


    messageInput.selectionStart =
        start + emoji.length;

    messageInput.selectionEnd =
        start + emoji.length;


    autoResizeTextarea();

}


/* =========================================================
   SEND BUTTON
========================================================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* =========================================================
   ENTER TO SEND
========================================================= */

messageInput.addEventListener(
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


/* =========================================================
   AUTO RESIZE TEXTAREA
========================================================= */

function autoResizeTextarea() {

    messageInput.style.height =
        "auto";


    const height =
        Math.min(
            messageInput.scrollHeight,
            130
        );


    messageInput.style.height =
        `${height}px`;

}


messageInput.addEventListener(
    "input",
    autoResizeTextarea
);


/* =========================================================
   KEYBOARD FIX
   The composer follows the visual viewport.
========================================================= */

function handleKeyboard() {

    if (!window.visualViewport) return;


    const viewport =
        window.visualViewport;


    function update() {

        const keyboardHeight =
            Math.max(
                0,
                window.innerHeight -
                viewport.height -
                viewport.offsetTop
            );


        /*
         * Move the composer upward
         * with the keyboard.
         */

        const composer =
            document.getElementById(
                "composer"
            );


        if (composer) {

            composer.style.transform =
                keyboardHeight > 0
                    ? `translateY(-${keyboardHeight}px)`
                    : "translateY(0)";

        }


        /*
         * Keep newest message visible.
         */

        if (
            document.activeElement ===
            messageInput
        ) {

            requestAnimationFrame(
                scrollToBottom
            );

        }

    }


    viewport.addEventListener(
        "resize",
        update
    );


    viewport.addEventListener(
        "scroll",
        update
    );


    update();

}


handleKeyboard();


/* =========================================================
   SCROLL
========================================================= */

function scrollToBottom() {

    requestAnimationFrame(
        () => {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }
    );

}


/* =========================================================
   OPEN CHAT
========================================================= */

function openChat(peerId) {

    currentPeerId =
        peerId;


    messagesPage.classList.remove(
        "active"
    );

    chatPage.classList.add(
        "active"
    );


    chatName.textContent =
        "Iqranix Member";

    chatUsername.textContent =
        `@${peerId.slice(0, 12)}`;


    chatAvatar.src =
        DEFAULT_AVATAR;


    if (peerId) {

        connectToPeer(
            peerId
        );

    }

}


/* =========================================================
   CURRENT CHAT PEER
========================================================= */

function currentPeerIdForChat() {

    return currentPeerId;

}


/* =========================================================
   BACK
========================================================= */

backChat.addEventListener(
    "click",
    () => {

        chatPage.classList.remove(
            "active"
        );

        messagesPage.classList.add(
            "active"
        );

        if (currentConnection) {

            try {

                currentConnection.close();

            } catch {}

        }

        currentConnection =
            null;

    }
);


/* =========================================================
   NEW CHAT MODAL
========================================================= */

function openNewChatModal() {

    newChatModal.classList.add(
        "show"
    );

}


function closeNewChatModal() {

    newChatModal.classList.remove(
        "show"
    );

}


newChatBtn.addEventListener(
    "click",
    openNewChatModal
);


startChatBtn.addEventListener(
    "click",
    openNewChatModal
);


closeModal.addEventListener(
    "click",
    closeNewChatModal
);


connectPeerBtn.addEventListener(
    "click",
    () => {

        const id =
            peerIdInput.value.trim();


        if (!id) {

            alert(
                "Enter the other person's Peer ID."
            );

            return;

        }


        closeNewChatModal();

        openChat(id);

    }
);


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        clearSearch.style.display =
            searchInput.value
                ? "block"
                : "none";

    }
);


clearSearch.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        clearSearch.style.display =
            "none";

        searchInput.focus();

    }
);


/* =========================================================
   CALL BUTTONS
========================================================= */

audioCallBtn.addEventListener(
    "click",
    startAudioCall
);


videoCallBtn.addEventListener(
    "click",
    startVideoCall
);


/* =========================================================
   START
========================================================= */

initializePeer();


/* =========================================================
   DISPLAY YOUR PEER ID
========================================================= */

setTimeout(() => {

    if (currentPeerId) {

        addSystemMessage(
            `Your calling ID: ${currentPeerId}`
        );

    }

}, 3000);