/* =========================================================
   IQRANIX CALL UI
   STAGE 1 TEST CONTROLLER
========================================================= */

import {
    startIqranixCall,
    acceptIqranixCall,
    rejectIqranixCall,
    endIqranixCall
} from "./call-service.js";


/* =========================================================
   ELEMENTS
========================================================= */

const startAudioButton =
    document.getElementById(
        "startAudioCall"
    );

const startVideoButton =
    document.getElementById(
        "startVideoCall"
    );

const acceptButton =
    document.getElementById(
        "acceptIncomingCall"
    );

const rejectButton =
    document.getElementById(
        "rejectIncomingCall"
    );

const endButton =
    document.getElementById(
        "endActiveCall"
    );

const receiverInput =
    document.getElementById(
        "callReceiverId"
    );

const callStatus =
    document.getElementById(
        "callStatus"
    );

const incomingBox =
    document.getElementById(
        "incomingCallBox"
    );

const incomingName =
    document.getElementById(
        "incomingCallerName"
    );

const incomingType =
    document.getElementById(
        "incomingCallType"
    );


/* =========================================================
   STATE
========================================================= */

let incomingCallId = null;

let activeCallId = null;


/* =========================================================
   STATUS
========================================================= */

function setStatus(
    text
) {

    if (callStatus) {

        callStatus.textContent =
            text;
    }

    console.log(
        "[Iqranix Calls]",
        text
    );
}


/* =========================================================
   START AUDIO
========================================================= */

startAudioButton?.addEventListener(
    "click",
    async () => {

        const receiverId =
            receiverInput?.value.trim();

        if (!receiverId) {

            setStatus(
                "Enter the receiver's Firebase UID."
            );

            return;
        }


        try {

            setStatus(
                "Creating audio call..."
            );


            const call =
                await startIqranixCall(
                    receiverId,
                    "audio"
                );


            activeCallId =
                call.callId;


            setStatus(
                "Audio call is ringing..."
            );


        } catch (error) {

            console.error(error);

            setStatus(
                error.message ||
                "Could not start call."
            );
        }
    }
);


/* =========================================================
   START VIDEO
========================================================= */

startVideoButton?.addEventListener(
    "click",
    async () => {

        const receiverId =
            receiverInput?.value.trim();

        if (!receiverId) {

            setStatus(
                "Enter the receiver's Firebase UID."
            );

            return;
        }


        try {

            setStatus(
                "Creating video call..."
            );


            const call =
                await startIqranixCall(
                    receiverId,
                    "video"
                );


            activeCallId =
                call.callId;


            setStatus(
                "Video call is ringing..."
            );


        } catch (error) {

            console.error(error);

            setStatus(
                error.message ||
                "Could not start call."
            );
        }
    }
);


/* =========================================================
   INCOMING CALL
========================================================= */

window.addEventListener(
    "iqranix-incoming-call",
    (event) => {

        const call =
            event.detail;


        incomingCallId =
            call.callId;


        incomingType.textContent =
            call.type === "video"
                ? "Incoming video call"
                : "Incoming audio call";


        incomingName.textContent =
            call.caller?.displayName ||
            "Iqranix Member";


        if (incomingBox) {

            incomingBox.classList.remove(
                "hidden"
            );
        }


        setStatus(
            "Incoming call..."
        );
    }
);


/* =========================================================
   ACCEPT
========================================================= */

acceptButton?.addEventListener(
    "click",
    async () => {

        if (!incomingCallId) {
            return;
        }


        try {

            await acceptIqranixCall(
                incomingCallId
            );


            activeCallId =
                incomingCallId;


            if (incomingBox) {

                incomingBox.classList.add(
                    "hidden"
                );
            }


            setStatus(
                "Call accepted."
            );


        } catch (error) {

            console.error(error);

            setStatus(
                error.message ||
                "Could not accept call."
            );
        }
    }
);


/* =========================================================
   REJECT
========================================================= */

rejectButton?.addEventListener(
    "click",
    async () => {

        if (!incomingCallId) {
            return;
        }


        try {

            await rejectIqranixCall(
                incomingCallId
            );


            if (incomingBox) {

                incomingBox.classList.add(
                    "hidden"
                );
            }


            incomingCallId =
                null;


            setStatus(
                "Call rejected."
            );


        } catch (error) {

            console.error(error);

            setStatus(
                error.message ||
                "Could not reject call."
            );
        }
    }
);


/* =========================================================
   END
========================================================= */

endButton?.addEventListener(
    "click",
    async () => {

        try {

            await endIqranixCall(
                activeCallId
            );


            activeCallId =
                null;


            setStatus(
                "Call ended."
            );


        } catch (error) {

            console.error(error);

            setStatus(
                error.message ||
                "Could not end call."
            );
        }
    }
);


/* =========================================================
   CALL STATUS EVENTS
========================================================= */

window.addEventListener(
    "iqranix-call-status",
    (event) => {

        const call =
            event.detail;


        activeCallId =
            call.callId;


        switch (
            call.status
        ) {

            case "calling":

                setStatus(
                    "Calling..."
                );

                break;


            case "accepted":

                setStatus(
                    "Call accepted — ready for WebRTC."
                );

                break;


            case "rejected":

                setStatus(
                    "Call rejected."
                );

                break;


            case "ended":

                setStatus(
                    "Call ended."
                );

                activeCallId =
                    null;

                break;


            case "missed":

                setStatus(
                    "Missed call."
                );

                activeCallId =
                    null;

                break;
        }
    }
);


console.log(
    "☎ Iqranix Call UI — Stage 1 loaded."
);