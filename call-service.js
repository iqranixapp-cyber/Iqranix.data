/* =========================================================
   IQRANIX CALL SERVICE
   STAGE 1
   Firebase Firestore Call Signaling

   Supports:
   - Audio calls
   - Video calls
   - Calling
   - Ringing
   - Accepted
   - Rejected
   - Ended
   - Missed
========================================================= */

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyACoqjK_khqp0yUxbmOG5rRezVJ8qdQZas",
    authDomain: "iqranix.firebaseapp.com",
    projectId: "iqranix",
    storageBucket: "iqranix.firebasestorage.app",
    messagingSenderId: "1078213163565",
    appId: "1:1078213163565:web:58d4da2a1d68bb6b19d6a4",
    measurementId: "G-PKVQ3070SY"
};


/* =========================================================
   FIREBASE INITIALIZATION
========================================================= */

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let activeCallId = null;

let activeCallUnsubscribe = null;

let incomingCallUnsubscribe = null;


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (!user) {

        stopIncomingCallListener();

        console.log(
            "Iqranix Call Service: user signed out."
        );

        return;
    }

    console.log(
        "Iqranix Call Service ready for:",
        user.uid
    );

    listenForIncomingCalls();
});


/* =========================================================
   START OUTGOING CALL
========================================================= */

export async function startIqranixCall(
    receiverId,
    type = "audio"
) {

    if (!currentUser) {

        throw new Error(
            "You must be signed in before making a call."
        );
    }

    if (!receiverId) {

        throw new Error(
            "Receiver ID is missing."
        );
    }

    if (receiverId === currentUser.uid) {

        throw new Error(
            "You cannot call yourself."
        );
    }

    if (
        type !== "audio" &&
        type !== "video"
    ) {

        throw new Error(
            "Invalid call type."
        );
    }


    /* -------------------------------------------------------
       Check receiver profile
    ------------------------------------------------------- */

    const receiverRef =
        doc(
            db,
            "users",
            receiverId
        );

    const receiverSnapshot =
        await getDoc(receiverRef);

    if (!receiverSnapshot.exists()) {

        throw new Error(
            "The user could not be found."
        );
    }


    /* -------------------------------------------------------
       Create call document
    ------------------------------------------------------- */

    const callsRef =
        collection(
            db,
            "calls"
        );

    const callData = {

        callerId:
            currentUser.uid,

        receiverId:

            receiverId,

        type:

            type,

        status:

            "calling",

        createdAt:

            serverTimestamp()
    };


    const callDocument =
        await addDoc(
            callsRef,
            callData
        );


    activeCallId =
        callDocument.id;


    console.log(
        "Iqranix call created:",
        activeCallId
    );


    /* -------------------------------------------------------
       Listen to call state
    ------------------------------------------------------- */

    listenToActiveCall(
        activeCallId
    );


    return {

        callId:
            activeCallId,

        callerId:
            currentUser.uid,

        receiverId,

        type
    };
}


/* =========================================================
   LISTEN TO ACTIVE CALL
========================================================= */

function listenToActiveCall(
    callId
) {

    if (activeCallUnsubscribe) {

        activeCallUnsubscribe();

        activeCallUnsubscribe = null;
    }


    const callRef =
        doc(
            db,
            "calls",
            callId
        );


    activeCallUnsubscribe =
        onSnapshot(
            callRef,
            (snapshot) => {

                if (!snapshot.exists()) {

                    console.log(
                        "Call document no longer exists."
                    );

                    return;
                }


                const call =
                    snapshot.data();


                console.log(
                    "Call status:",
                    call.status
                );


                window.dispatchEvent(
                    new CustomEvent(
                        "iqranix-call-status",
                        {
                            detail: {
                                callId,
                                ...call
                            }
                        }
                    )
                );


                /* ---------------------------------------------
                   Call ended
                --------------------------------------------- */

                if (
                    call.status ===
                    "ended"
                ) {

                    cleanupActiveCall();
                }


                /* ---------------------------------------------
                   Call rejected
                --------------------------------------------- */

                if (
                    call.status ===
                    "rejected"
                ) {

                    cleanupActiveCall();
                }


                /* ---------------------------------------------
                   Call missed
                --------------------------------------------- */

                if (
                    call.status ===
                    "missed"
                ) {

                    cleanupActiveCall();
                }
            },
            (error) => {

                console.error(
                    "Active call listener error:",
                    error
                );
            }
        );
}


/* =========================================================
   INCOMING CALL LISTENER
========================================================= */

function listenForIncomingCalls() {

    if (!currentUser) {
        return;
    }


    stopIncomingCallListener();


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

            limit(1)
        );


    incomingCallUnsubscribe =
        onSnapshot(
            callsQuery,
            async (snapshot) => {

                if (snapshot.empty) {
                    return;
                }


                for (
                    const callDocument
                    of snapshot.docs
                ) {

                    const call =
                        callDocument.data();


                    /*
                       Ignore calls created too long ago.
                    */

                    if (
                        call.createdAt
                    ) {

                        const created =
                            call.createdAt.toMillis();

                        const age =
                            Date.now() -
                            created;


                        /*
                           Five minute safety limit.
                        */

                        if (
                            age >
                            5 * 60 * 1000
                        ) {

                            await updateDoc(
                                callDocument.ref,
                                {
                                    status:
                                        "missed"
                                }
                            );

                            continue;
                        }
                    }


                    /* -----------------------------------------
                       Get caller profile
                    ----------------------------------------- */

                    let caller =
                        null;


                    try {

                        const callerRef =
                            doc(
                                db,
                                "users",
                                call.callerId
                            );


                        const callerSnapshot =
                            await getDoc(
                                callerRef
                            );


                        if (
                            callerSnapshot.exists()
                        ) {

                            caller = {
                                uid:
                                    call.callerId,

                                ...callerSnapshot.data()
                            };
                        }

                    } catch (error) {

                        console.warn(
                            "Could not load caller profile:",
                            error
                        );
                    }


                    /* -----------------------------------------
                       Notify application
                    ----------------------------------------- */

                    window.dispatchEvent(
                        new CustomEvent(
                            "iqranix-incoming-call",
                            {
                                detail: {

                                    callId:
                                        callDocument.id,

                                    callerId:
                                        call.callerId,

                                    receiverId:
                                        call.receiverId,

                                    type:
                                        call.type,

                                    status:
                                        call.status,

                                    caller:
                                        caller
                                }
                            }
                        )
                    );
                }
            },
            (error) => {

                console.error(
                    "Incoming call listener error:",
                    error
                );
            }
        );
}


/* =========================================================
   ACCEPT CALL
========================================================= */

export async function acceptIqranixCall(
    callId
) {

    if (!currentUser) {

        throw new Error(
            "You must be signed in."
        );
    }

    if (!callId) {

        throw new Error(
            "Call ID is missing."
        );
    }


    const callRef =
        doc(
            db,
            "calls",
            callId
        );


    const snapshot =
        await getDoc(
            callRef
        );


    if (!snapshot.exists()) {

        throw new Error(
            "This call no longer exists."
        );
    }


    const call =
        snapshot.data();


    if (
        call.receiverId !==
        currentUser.uid
    ) {

        throw new Error(
            "You are not the receiver of this call."
        );
    }


    if (
        call.status !==
        "calling"
    ) {

        throw new Error(
            "This call is no longer available."
        );
    }


    await updateDoc(
        callRef,
        {
            status:
                "accepted",

            acceptedAt:
                serverTimestamp()
        }
    );


    activeCallId =
        callId;


    listenToActiveCall(
        callId
    );


    console.log(
        "Iqranix call accepted:",
        callId
    );
}


/* =========================================================
   REJECT CALL
========================================================= */

export async function rejectIqranixCall(
    callId
) {

    if (!currentUser) {
        throw new Error(
            "You must be signed in."
        );
    }


    const callRef =
        doc(
            db,
            "calls",
            callId
        );


    const snapshot =
        await getDoc(
            callRef
        );


    if (!snapshot.exists()) {
        return;
    }


    const call =
        snapshot.data();


    if (
        call.receiverId !==
        currentUser.uid
    ) {

        throw new Error(
            "You cannot reject this call."
        );
    }


    await updateDoc(
        callRef,
        {

            status:
                "rejected",

            rejectedAt:
                serverTimestamp()
        }
    );


    console.log(
        "Iqranix call rejected:",
        callId
    );
}


/* =========================================================
   END CALL
========================================================= */

export async function endIqranixCall(
    callId = activeCallId
) {

    if (!currentUser) {
        return;
    }

    if (!callId) {
        return;
    }


    try {

        const callRef =
            doc(
                db,
                "calls",
                callId
            );


        const snapshot =
            await getDoc(
                callRef
            );


        if (!snapshot.exists()) {
            return;
        }


        const call =
            snapshot.data();


        if (
            call.callerId !==
                currentUser.uid
            &&
            call.receiverId !==
                currentUser.uid
        ) {

            console.warn(
                "User does not belong to this call."
            );

            return;
        }


        await updateDoc(
            callRef,
            {

                status:
                    "ended",

                endedAt:
                    serverTimestamp()
            }
        );


        console.log(
            "Iqranix call ended:",
            callId
        );


    } catch (error) {

        console.error(
            "Could not end call:",
            error
        );
    }


    cleanupActiveCall();
}


/* =========================================================
   MARK CALL AS MISSED
========================================================= */

export async function markIqranixCallMissed(
    callId
) {

    if (!currentUser || !callId) {
        return;
    }


    const callRef =
        doc(
            db,
            "calls",
            callId
        );


    const snapshot =
        await getDoc(
            callRef
        );


    if (!snapshot.exists()) {
        return;
    }


    const call =
        snapshot.data();


    if (
        call.receiverId !==
        currentUser.uid
    ) {

        return;
    }


    if (
        call.status !==
        "calling"
    ) {

        return;
    }


    await updateDoc(
        callRef,
        {

            status:
                "missed",

            missedAt:
                serverTimestamp()
        }
    );
}


/* =========================================================
   GET CALL
========================================================= */

export async function getIqranixCall(
    callId
) {

    if (!callId) {
        return null;
    }


    const callSnapshot =
        await getDoc(
            doc(
                db,
                "calls",
                callId
            )
        );


    if (!callSnapshot.exists()) {
        return null;
    }


    return {

        callId:
            callSnapshot.id,

        ...callSnapshot.data()
    };
}


/* =========================================================
   ACTIVE CALL ID
========================================================= */

export function getActiveIqranixCallId() {

    return activeCallId;
}


/* =========================================================
   CURRENT USER
========================================================= */

export function getIqranixCurrentUser() {

    return currentUser;
}


/* =========================================================
   STOP INCOMING LISTENER
========================================================= */

function stopIncomingCallListener() {

    if (
        incomingCallUnsubscribe
    ) {

        incomingCallUnsubscribe();

        incomingCallUnsubscribe = null;
    }
}


/* =========================================================
   CLEANUP
========================================================= */

function cleanupActiveCall() {

    activeCallId = null;


    if (
        activeCallUnsubscribe
    ) {

        activeCallUnsubscribe();

        activeCallUnsubscribe = null;
    }
}


/* =========================================================
   GLOBAL DEBUG HELPER
========================================================= */

window.IqranixCalls = {

    start:
        startIqranixCall,

    accept:
        acceptIqranixCall,

    reject:
        rejectIqranixCall,

    end:
        endIqranixCall,

    missed:
        markIqranixCallMissed,

    get:
        getIqranixCall,

    active:
        getActiveIqranixCallId
};


console.log(
    "☎ Iqranix Call Service — Stage 1 loaded."
);