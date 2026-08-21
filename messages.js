/* =========================================================
   IQRANIX MESSAGES
   PeerJS audio/video calling
========================================================= */


/* ---------------------------------------------------------
   ELEMENTS
--------------------------------------------------------- */

const myPeerId = document.getElementById("myPeerId");
const remotePeerId = document.getElementById("remotePeerId");

const connectionStatus =
    document.getElementById("connectionStatus");

const connectionInfo =
    document.getElementById("connectionInfo");

const statusDot =
    document.getElementById("statusDot");

const copyIdBtn =
    document.getElementById("copyIdBtn");

const audioCallBtn =
    document.getElementById("audioCallBtn");

const videoCallBtn =
    document.getElementById("videoCallBtn");

const callScreen =
    document.getElementById("callScreen");

const callType =
    document.getElementById("callType");

const callStatus =
    document.getElementById("callStatus");

const remoteVideo =
    document.getElementById("remoteVideo");

const localVideo =
    document.getElementById("localVideo");

const videoPlaceholder =
    document.getElementById("videoPlaceholder");

const audioAvatar =
    document.querySelector(".audio-avatar");

const muteBtn =
    document.getElementById("muteBtn");

const cameraBtn =
    document.getElementById("cameraBtn");

const endCallBtn =
    document.getElementById("endCallBtn");

const incomingCall =
    document.getElementById("incomingCall");

const incomingPeer =
    document.getElementById("incomingPeer");

const acceptBtn =
    document.getElementById("acceptBtn");

const rejectBtn =
    document.getElementById("rejectBtn");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");

const backBtn =
    document.getElementById("backBtn");


/* ---------------------------------------------------------
   VARIABLES
--------------------------------------------------------- */

let peer = null;

let localStream = null;

let currentCall = null;

let pendingCall = null;

let currentCallMode = "video";

let microphoneEnabled = true;

let cameraEnabled = true;


/* ---------------------------------------------------------
   TOAST
--------------------------------------------------------- */

function showToast(message) {

    toastText.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* ---------------------------------------------------------
   STATUS
--------------------------------------------------------- */

function setStatus(text, info, state = "normal") {

    connectionStatus.textContent = text;

    connectionInfo.textContent = info;

    statusDot.classList.remove(
        "online",
        "error"
    );

    if (state === "online") {
        statusDot.classList.add("online");
    }

    if (state === "error") {
        statusDot.classList.add("error");
    }
}


/* ---------------------------------------------------------
   CAMERA + MICROPHONE
--------------------------------------------------------- */

async function getMedia(videoRequired = true) {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                audio: true,

                video: videoRequired

            });

        return stream;

    } catch (error) {

        console.error(
            "Media permission error:",
            error
        );

        if (error.name === "NotAllowedError") {

            showToast(
                "Camera or microphone permission was denied."
            );

        } else {

            showToast(
                "Camera or microphone is unavailable."
            );
        }

        throw error;
    }
}


/* ---------------------------------------------------------
   CREATE PEER
--------------------------------------------------------- */

function createPeer() {

    if (typeof Peer === "undefined") {

        setStatus(
            "PeerJS failed",
            "PeerJS library could not load.",
            "error"
        );

        showToast(
            "PeerJS could not load."
        );

        return;
    }


    /*
       PeerJS's public cloud signaling server
       automatically creates the ID.
    */

    peer = new Peer();


    /* PEER OPEN */

    peer.on("open", (id) => {

        console.log(
            "My Peer ID:",
            id
        );

        myPeerId.textContent = id;

        setStatus(
            "Ready",
            "Your calling ID is ready.",
            "online"
        );

    });


    /* INCOMING CALL */

    peer.on("call", async (call) => {

        console.log(
            "Incoming call:",
            call.peer
        );

        pendingCall = call;

        incomingPeer.textContent =
            "Call from " + call.peer;

        incomingCall.classList.remove("hidden");

    });


    /* CONNECTION ERROR */

    peer.on("error", (error) => {

        console.error(
            "PeerJS error:",
            error
        );

        setStatus(
            "Connection problem",
            error.message || "PeerJS error",
            "error"
        );

        showToast(
            error.message || "Calling connection failed."
        );

    });


    /* DISCONNECTED */

    peer.on("disconnected", () => {

        setStatus(
            "Disconnected",
            "Trying to reconnect..."
        );

    });


    /* CLOSE */

    peer.on("close", () => {

        setStatus(
            "Offline",
            "Calling connection closed.",
            "error"
        );

    });

}


/* ---------------------------------------------------------
   COPY MY ID
--------------------------------------------------------- */

copyIdBtn.addEventListener(
    "click",
    async () => {

        const id =
            myPeerId.textContent.trim();

        if (
            !id ||
            id === "Generating ID..." ||
            id === "Connecting..."
        ) {

            showToast(
                "Your Call ID is not ready yet."
            );

            return;
        }

        try {

            await navigator.clipboard.writeText(id);

            showToast(
                "Call ID copied."
            );

        } catch {

            showToast(
                "Copy failed. Press and hold the ID to copy it."
            );

        }

    }
);


/* ---------------------------------------------------------
   START AUDIO CALL
--------------------------------------------------------- */

audioCallBtn.addEventListener(
    "click",
    () => startCall("audio")
);


/* ---------------------------------------------------------
   START VIDEO CALL
--------------------------------------------------------- */

videoCallBtn.addEventListener(
    "click",
    () => startCall("video")
);


/* ---------------------------------------------------------
   START CALL
--------------------------------------------------------- */

async function startCall(mode) {

    const target =
        remotePeerId.value.trim();

    if (!target) {

        showToast(
            "Enter the other person's Call ID."
        );

        return;
    }


    if (!peer || peer.destroyed) {

        showToast(
            "Calling service is not ready."
        );

        return;
    }


    if (target === myPeerId.textContent.trim()) {

        showToast(
            "You cannot call yourself."
        );

        return;
    }


    currentCallMode = mode;


    try {

        /*
          For audio calls we only request
          microphone.

          For video calls we request both.
        */

        localStream =
            await getMedia(
                mode === "video"
            );


        localVideo.srcObject =
            localStream;


        openCallScreen(
            mode,
            "Calling..."
        );


        const call =
            peer.call(
                target,
                localStream,
                {
                    metadata: {
                        type: mode
                    }
                }
            );


        currentCall = call;


        callStatus.textContent =
            "Calling " + target + "...";


        attachCallListeners(call);

    } catch (error) {

        console.error(error);

        closeCall();

    }

}


/* ---------------------------------------------------------
   ACCEPT INCOMING CALL
--------------------------------------------------------- */

acceptBtn.addEventListener(
    "click",
    async () => {

        if (!pendingCall) return;


        const call =
            pendingCall;

        pendingCall = null;

        incomingCall.classList.add("hidden");


        currentCallMode =
            call.metadata?.type || "video";


        try {

            localStream =
                await getMedia(
                    currentCallMode === "video"
                );


            localVideo.srcObject =
                localStream;


            /*
              Answer the caller.
            */

            call.answer(
                localStream
            );


            currentCall =
                call;


            openCallScreen(
                currentCallMode,
                "Connecting..."
            );


            attachCallListeners(
                call
            );


        } catch (error) {

            console.error(error);

            showToast(
                "Could not access microphone/camera."
            );

            call.close();

        }

    }
);


/* ---------------------------------------------------------
   REJECT
--------------------------------------------------------- */

rejectBtn.addEventListener(
    "click",
    () => {

        if (pendingCall) {

            pendingCall.close();

            pendingCall = null;

        }

        incomingCall.classList.add(
            "hidden"
        );

    }
);


/* ---------------------------------------------------------
   CALL LISTENERS
--------------------------------------------------------- */

function attachCallListeners(call) {

    call.on(
        "stream",
        (remoteStream) => {

            console.log(
                "Remote stream received"
            );

            remoteVideo.srcObject =
                remoteStream;


            videoPlaceholder.classList.add(
                "hidden"
            );


            callStatus.textContent =
                "Connected";

        }
    );


    call.on(
        "close",
        () => {

            console.log(
                "Call closed"
            );

            closeCall();

        }
    );


    call.on(
        "error",
        (error) => {

            console.error(
                "Call error:",
                error
            );

            showToast(
                "Call connection failed."
            );

            closeCall();

        }
    );

}


/* ---------------------------------------------------------
   OPEN CALL SCREEN
--------------------------------------------------------- */

function openCallScreen(
    mode,
    status
) {

    callScreen.classList.remove(
        "hidden"
    );


    callType.textContent =
        mode === "video"
            ? "Video Call"
            : "Audio Call";


    callStatus.textContent =
        status;


    if (mode === "video") {

        remoteVideo.style.display =
            "block";

        localVideo.style.display =
            "block";

        videoPlaceholder.classList.remove(
            "hidden"
        );

        audioAvatar.style.display =
            "none";

        cameraBtn.style.display =
            "flex";

    } else {

        remoteVideo.style.display =
            "none";

        localVideo.style.display =
            "none";

        videoPlaceholder.classList.add(
            "hidden"
        );

        audioAvatar.style.display =
            "flex";

        cameraBtn.style.display =
            "none";

    }

}


/* ---------------------------------------------------------
   MUTE MICROPHONE
--------------------------------------------------------- */

muteBtn.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const tracks =
            localStream.getAudioTracks();


        if (!tracks.length) return;


        microphoneEnabled =
            !microphoneEnabled;


        tracks.forEach(
            track => {

                track.enabled =
                    microphoneEnabled;

            }
        );


        muteBtn.querySelector(
            "small"
        ).textContent =
            microphoneEnabled
                ? "Mute"
                : "Unmute";


        muteBtn.firstChild.textContent =
            microphoneEnabled
                ? "🎙"
                : "🔇";

    }
);


/* ---------------------------------------------------------
   CAMERA TOGGLE
--------------------------------------------------------- */

cameraBtn.addEventListener(
    "click",
    () => {

        if (!localStream) return;


        const tracks =
            localStream.getVideoTracks();


        if (!tracks.length) return;


        cameraEnabled =
            !cameraEnabled;


        tracks.forEach(
            track => {

                track.enabled =
                    cameraEnabled;

            }
        );


        cameraBtn.querySelector(
            "small"
        ).textContent =
            cameraEnabled
                ? "Camera"
                : "Camera off";

    }
);


/* ---------------------------------------------------------
   END CALL
--------------------------------------------------------- */

endCallBtn.addEventListener(
    "click",
    () => {

        if (currentCall) {

            currentCall.close();

        }

        closeCall();

    }
);


/* ---------------------------------------------------------
   CLOSE CALL
--------------------------------------------------------- */

function closeCall() {

    if (localStream) {

        localStream.getTracks().forEach(
            track => track.stop()
        );

    }


    localStream = null;

    remoteVideo.srcObject = null;

    localVideo.srcObject = null;

    currentCall = null;

    microphoneEnabled = true;

    cameraEnabled = true;


    callScreen.classList.add(
        "hidden"
    );


    callStatus.textContent =
        "Ready";

}


/* ---------------------------------------------------------
   BACK BUTTON
--------------------------------------------------------- */

backBtn.addEventListener(
    "click",
    () => {

        if (
            !callScreen.classList.contains(
                "hidden"
            )
        ) {

            closeCall();

            return;
        }

        history.back();

    }
);


/* ---------------------------------------------------------
   PAGE LOAD
--------------------------------------------------------- */

window.addEventListener(
    "load",
    () => {

        console.log(
            "Iqranix Messages starting..."
        );

        setStatus(
            "Connecting...",
            "Creating your Call ID..."
        );


        createPeer();

    }
);


/* ---------------------------------------------------------
   PAGE CLOSE
--------------------------------------------------------- */

window.addEventListener(
    "beforeunload",
    () => {

        if (localStream) {

            localStream
                .getTracks()
                .forEach(
                    track => track.stop()
                );

        }

        if (peer) {

            peer.destroy();

        }

    }
);
