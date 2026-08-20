// ============================================================
// IQRANIX REELS
// Bunny Stream playback + Cloudflare Worker upload
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
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE =
    "https://iqranix-reels-api.athmanbilal16.workers.dev";


// Bunny Stream Library
const BUNNY_LIBRARY_ID =
    "728760";


// Bunny CDN hostname
const BUNNY_CDN_HOSTNAME =
    "vz-6b8c98ef-d07c-cdn.net";


// ============================================================
// LIMITS
// ============================================================

const MAX_FILE_SIZE =
    50 * 1024 * 1024;

const MAX_DURATION_SECONDS =
    180;


// ============================================================
// ELEMENTS
// ============================================================

const feed =
    document.getElementById("reelsFeed");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// STATE
// ============================================================

let currentUser = null;


// ============================================================
// SVG ICONS
// ============================================================

const ICONS = {

    heart: `
        <svg viewBox="0 0 24 24">
            <path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/>
        </svg>
    `,

    heartFilled: `
        <svg viewBox="0 0 24 24">
            <path
                d="M12 20.2S3.2 15 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7C20.8 15 12 20.2 12 20.2Z"
                fill="currentColor"
                stroke="currentColor"
            />
        </svg>
    `,

    comment: `
        <svg viewBox="0 0 24 24">
            <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9.2 9.2 0 0 1-3.2-.6L4 20l1.6-3.5A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/>
            <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/>
        </svg>
    `,

    repost: `
        <svg viewBox="0 0 24 24">
            <path d="M17 3l4 4-4 4"/>
            <path d="M3 11V9a2 2 0 0 1 2-2h16"/>
            <path d="M7 21l-4-4 4-4"/>
            <path d="M21 13v2a2 2 0 0 1-2 2H3"/>
        </svg>
    `,

    share: `
        <svg viewBox="0 0 24 24">
            <path d="M21 3 10.5 13.5"/>
            <path d="m21 3-7 18-3.5-7.5L3 10.5 21 3Z"/>
        </svg>
    `,

    flag: `
        <svg viewBox="0 0 24 24">
            <path d="M5 21V4"/>
            <path d="M5 5c4-3 7 3 14 0v9c-7 3-10-3-14 0"/>
        </svg>
    `,

    more: `
        <svg viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
    `,

    video: `
        <svg viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="3"/>
            <path d="M8 5l2-3h4l2 3"/>
            <path d="M10 10l5 3-5 3z"/>
        </svg>
    `
};


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        currentUser =
            user || null;


        if (!currentUser) {

            feed.innerHTML = `
                <div class="state">

                    <div class="state-icon">
                        ${ICONS.video}
                    </div>

                    <h2>Sign in required</h2>

                    <p>
                        Please sign in to view IQRANIX Reels.
                    </p>

                </div>
            `;

            return;
        }


        await loadReels();
    }
);


// ============================================================
// LOAD REELS
// ============================================================

async function loadReels() {

    feed.innerHTML = `
        <div class="state">

            <div class="state-icon">
                ${ICONS.video}
            </div>

            <h2>Discover Khayr...</h2>

            <p>
                Loading IQRANIX Reels
            </p>

        </div>
    `;


    try {

        const reelsQuery =
            query(
                collection(db, "reels"),

                orderBy(
                    "createdAt",
                    "desc"
                ),

                limit(50)
            );


        const snapshot =
            await getDocs(reelsQuery);


        if (snapshot.empty) {

            feed.innerHTML = `
                <div class="state">

                    <div class="state-icon">
                        ${ICONS.video}
                    </div>

                    <h2>No Reels yet</h2>

                    <p>
                        Be the first to share something beneficial.
                    </p>

                </div>
            `;

            return;
        }


        feed.innerHTML = "";


        snapshot.forEach(item => {

            const reel = {
                id: item.id,
                ...item.data()
            };


            feed.appendChild(
                createReelCard(reel)
            );
        });


        setupAutoplay();


    } catch (error) {

        console.error(
            "Firestore reels error:",
            error
        );


        feed.innerHTML = `
            <div class="state">

                <div class="state-icon">
                    ⚠
                </div>

                <h2>
                    Couldn't load Reels
                </h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>
        `;
    }
}


// ============================================================
// BUNNY PLAYBACK URL
// ============================================================

function buildBunnyPlaybackUrl(videoId) {

    if (!videoId)
        return "";


    return (
        `https://${BUNNY_CDN_HOSTNAME}/` +
        `${videoId}/play_720p.mp4`
    );
}


// ============================================================
// BUNNY EMBED URL
// ============================================================

function buildBunnyEmbedUrl(videoId) {

    if (!videoId)
        return "";


    return (
        `https://iframe.mediadelivery.net/embed/` +
        `${BUNNY_LIBRARY_ID}/` +
        `${videoId}` +
        `?autoplay=true&loop=true&muted=true&preload=true`
    );
}


// ============================================================
// VIDEO URL
// ============================================================

function getReelVideoUrl(reel) {

    if (reel.videoId) {

        return buildBunnyPlaybackUrl(
            reel.videoId
        );
    }


    if (reel.videoUrl) {

        return reel.videoUrl;
    }


    return "";
}


// ============================================================
// CREATE REEL CARD
// ============================================================

function createReelCard(reel) {

    const card =
        document.createElement("article");


    card.className =
        "reel-card";


    // ========================================================
    // DIRECT HTML5 VIDEO
    // ========================================================

    const video =
        document.createElement("video");


    video.className =
        "reel-video";


    const videoUrl =
        getReelVideoUrl(reel);


    video.src =
        videoUrl;


    /*
        Autoplay starts muted because Android/browser
        autoplay restrictions require this.

        After the user interacts with the Reel,
        a one-second timer starts.

        After one second, sound is enabled automatically.

        There is no centre play button.
    */

    video.muted =
        true;


    video.defaultMuted =
        true;


    video.loop =
        true;


    video.playsInline =
        true;


    video.setAttribute(
        "playsinline",
        ""
    );


    video.setAttribute(
        "webkit-playsinline",
        ""
    );


    video.preload =
        "auto";


    // ========================================================
    // BUNNY IFRAME FALLBACK
    // ========================================================

    const bunnyPlayer =
        document.createElement("iframe");


    bunnyPlayer.className =
        "bunny-player";


    bunnyPlayer.allow =
        "autoplay; fullscreen; picture-in-picture";


    bunnyPlayer.setAttribute(
        "allowfullscreen",
        ""
    );


    bunnyPlayer.title =
        "IQRANIX Reel";


    if (reel.videoId) {

        bunnyPlayer.src =
            buildBunnyEmbedUrl(
                reel.videoId
            );
    }


    // ========================================================
    // PROCESSING STATE
    // ========================================================

    const processing =
        document.createElement("div");


    processing.className =
        "processing-state";


    processing.innerHTML = `
        <div class="processing-icon">
            ${ICONS.video}
        </div>

        <span>
            Video is still processing...
        </span>
    `;


    // ========================================================
    // ERROR STATE
    // ========================================================

    const errorState =
        document.createElement("div");


    errorState.className =
        "video-error-state";


    errorState.innerHTML = `
        <strong>
            Video unavailable
        </strong>

        <span>
            This Reel could not be played right now.
        </span>
    `;


    // ========================================================
    // SHADE
    // ========================================================

    const shade =
        document.createElement("div");


    shade.className =
        "video-shade";


    // ========================================================
    // SOUND HINT
    // ========================================================

    const soundHint =
        document.createElement("div");


    soundHint.className =
        "sound-hint";


    soundHint.textContent =
        "Sound will turn on shortly";


    // ========================================================
    // INFO
    // ========================================================

    const info =
        document.createElement("div");


    info.className =
        "reel-info";


    const user =
        document.createElement("div");


    user.className =
        "reel-user";


    const avatar =
        document.createElement("img");


    avatar.className =
        "reel-avatar";


    avatar.src =
        reel.photoURL ||
        createAvatar(
            reel.displayName || "I"
        );


    avatar.onerror =
        () => {

            avatar.src =
                createAvatar(
                    reel.displayName || "I"
                );
        };


    const userDetails =
        document.createElement("div");


    userDetails.className =
        "reel-user-details";


    const username =
        document.createElement("span");


    username.className =
        "reel-user-name";


    username.textContent =
        reel.displayName ||
        "IQRANIX Member";


    const followBtn =
        document.createElement("button");


    followBtn.className =
        "follow-btn";


    followBtn.textContent =
        "Follow";


    followBtn.setAttribute(
        "aria-label",
        `Follow ${reel.displayName || "user"}`
    );


    followBtn.onclick =
        event => {

            event.stopPropagation();

            toggleFollow(
                followBtn,
                reel.uid
            );
        };


    userDetails.append(
        username,
        followBtn
    );


    user.append(
        avatar,
        userDetails
    );


    info.appendChild(
        user
    );


    if (reel.caption) {

        const caption =
            document.createElement("div");


        caption.className =
            "reel-caption";


        caption.textContent =
            reel.caption;


        info.appendChild(
            caption
        );
    }


    // ========================================================
    // ACTIONS
    // ========================================================

    const actions =
        document.createElement("div");


    actions.className =
        "reel-actions";


    // LIKE
    const likeGroup =
        createAction(
            ICONS.heart,
            reel.likes || 0,
            "Like Reel"
        );


    likeGroup.button.onclick =
        event => {

            event.stopPropagation();

            likeGroup.button.classList.toggle(
                "active"
            );

            if (
                likeGroup.button.classList.contains(
                    "active"
                )
            ) {

                likeGroup.button.innerHTML =
                    ICONS.heartFilled;

                likeGroup.count.textContent =
                    Number(
                        reel.likes || 0
                    ) + 1;

            } else {

                likeGroup.button.innerHTML =
                    ICONS.heart;

                likeGroup.count.textContent =
                    reel.likes || 0;
            }
        };


    // COMMENTS
    const commentGroup =
        createAction(
            ICONS.comment,
            reel.commentsCount || 0,
            "Comments"
        );


    commentGroup.button.onclick =
        event => {

            event.stopPropagation();

            console.log(
                "Comments:",
                reel.id
            );
        };


    // REPOST
    const repostGroup =
        createAction(
            ICONS.repost,
            reel.reposts || 0,
            "Repost"
        );


    repostGroup.button.onclick =
        event => {

            event.stopPropagation();

            repostGroup.button.classList.toggle(
                "active"
            );
        };


    // SHARE
    const shareGroup =
        createAction(
            ICONS.share,
            null,
            "Share Reel"
        );


    shareGroup.button.onclick =
        async event => {

            event.stopPropagation();

            await shareReel(reel);
        };


    // SAVE / FLAG
    const saveGroup =
        createAction(
            ICONS.flag,
            null,
            "Save Reel"
        );


    saveGroup.button.onclick =
        event => {

            event.stopPropagation();

            saveGroup.button.classList.toggle(
                "active"
            );
        };


    // MORE
    const moreGroup =
        createAction(
            ICONS.more,
            null,
            "More options"
        );


    moreGroup.button.onclick =
        event => {

            event.stopPropagation();

            console.log(
                "More options:",
                reel.id
            );
        };


    actions.append(
        likeGroup.wrapper,
        commentGroup.wrapper,
        repostGroup.wrapper,
        shareGroup.wrapper,
        saveGroup.wrapper,
        moreGroup.wrapper
    );


    // ========================================================
    // APPEND
    // ========================================================

    card.append(
        video,
        bunnyPlayer,
        processing,
        errorState,
        shade,
        soundHint,
        info,
        actions
    );


    // ========================================================
    // VIDEO READY
    // ========================================================

    video.addEventListener(
        "loadeddata",
        () => {

            processing.classList.remove(
                "visible"
            );

            errorState.classList.remove(
                "visible"
            );
        }
    );


    video.addEventListener(
        "canplay",
        () => {

            processing.classList.remove(
                "visible"
            );
        }
    );


    // ========================================================
    // VIDEO ERROR
    // ========================================================

    video.addEventListener(
        "error",
        () => {

            console.warn(
                "Direct Bunny MP4 unavailable. " +
                "Switching to Bunny Stream player.",
                videoUrl
            );


            if (reel.videoId) {

                card.classList.add(
                    "bunny-fallback"
                );


                processing.classList.remove(
                    "visible"
                );


                errorState.classList.remove(
                    "visible"
                );


                return;
            }


            processing.classList.remove(
                "visible"
            );


            errorState.classList.add(
                "visible"
            );
        }
    );


    // ========================================================
    // USER INTERACTION
    //
    // The Reel keeps playing automatically.
    //
    // The first interaction starts a one-second timer.
    // After one second, sound is enabled.
    //
    // Tapping the Reel DOES NOT pause the video.
    // ========================================================

    let soundTimerStarted =
        false;


    const enableSoundAfterInteraction =
        event => {

            if (
                event.target.closest(
                    ".reel-action"
                ) ||
                event.target.closest(
                    ".follow-btn"
                )
            ) {
                return;
            }


            if (
                soundTimerStarted ||
                !video.paused === false
            ) {
                if (soundTimerStarted) {
                    return;
                }
            }


            soundTimerStarted =
                true;


            soundHint.classList.add(
                "visible"
            );


            setTimeout(
                () => {

                    if (
                        !card.classList.contains(
                            "bunny-fallback"
                        )
                    ) {

                        video.muted =
                            false;


                        video.defaultMuted =
                            false;


                        video.volume =
                            1;


                        video.play()
                            .then(() => {

                                soundHint.classList.remove(
                                    "visible"
                                );

                            })
                            .catch(
                                error => {

                                    console.warn(
                                        "Sound playback failed:",
                                        error
                                    );

                                    soundHint.classList.remove(
                                        "visible"
                                    );
                                }
                            );
                    }

                },
                1000
            );
        };


    card.addEventListener(
        "click",
        enableSoundAfterInteraction
    );


    card.addEventListener(
        "touchstart",
        enableSoundAfterInteraction,
        {
            passive: true
        }
    );


    // ========================================================
    // SHOW SOUND HINT WHEN AUTOPLAY STARTS MUTED
    // ========================================================

    video.addEventListener(
        "playing",
        () => {

            if (video.muted) {

                soundHint.classList.add(
                    "visible"
                );


                setTimeout(
                    () => {

                        soundHint.classList.remove(
                            "visible"
                        );

                    },
                    2200
                );
            }
        }
    );


    return card;
}


// ============================================================
// ACTION CREATOR
// ============================================================

function createAction(
    icon,
    count,
    label
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "action-group";


    const button =
        document.createElement("button");


    button.className =
        "reel-action";


    button.innerHTML =
        icon;


    button.setAttribute(
        "aria-label",
        label
    );


    const countElement =
        document.createElement("span");


    countElement.className =
        "action-count";


    if (
        count !== null &&
        count !== undefined
    ) {

        countElement.textContent =
            count;

    } else {

        countElement.style.display =
            "none";
    }


    wrapper.append(
        button,
        countElement
    );


    return {
        wrapper,
        button,
        count: countElement
    };
}


// ============================================================
// AUTOPLAY
// ============================================================

function setupAutoplay() {

    const cards =
        document.querySelectorAll(
            ".reel-card"
        );


    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        const card =
                            entry.target;


                        const video =
                            card.querySelector(
                                ".reel-video"
                            );


                        if (
                            !video ||
                            card.classList.contains(
                                "bunny-fallback"
                            )
                        ) {
                            return;
                        }


                        if (
                            entry.isIntersecting &&
                            entry.intersectionRatio >= 0.65
                        ) {

                            /*
                                Autoplay starts muted.

                                After the user interacts with
                                the Reel, sound is enabled after
                                one second.
                            */

                            video.muted =
                                true;


                            video.defaultMuted =
                                true;


                            video.play()
                                .catch(
                                    error => {

                                        console.log(
                                            "Autoplay blocked:",
                                            error
                                        );
                                    }
                                );


                        } else {

                            video.pause();

                            video.currentTime =
                                0;
                        }
                    }
                );

            },

            {
                threshold: [
                    0,
                    0.65,
                    1
                ]
            }
        );


    cards.forEach(
        card =>
            observer.observe(card)
    );
}


// ============================================================
// FOLLOW
// ============================================================

function toggleFollow(
    button,
    uid
) {

    if (!currentUser) {

        alert(
            "Please sign in to follow users."
        );

        return;
    }


    if (
        uid === currentUser.uid
    ) {

        return;
    }


    const following =
        button.classList.toggle(
            "following"
        );


    button.textContent =
        following
            ? "Following"
            : "Follow";


    console.log(
        "Follow state:",
        uid,
        following
    );


    /*
        Firestore follow-system can be connected here later.

        We deliberately keep this UI-only for now so it does
        not interfere with Reel playback.
    */
}


// ============================================================
// SHARE
// ============================================================

async function shareReel(reel) {

    const shareUrl =
        window.location.href;


    if (
        navigator.share
    ) {

        try {

            await navigator.share({
                title:
                    "IQRANIX Reel",

                text:
                    reel.caption ||
                    "Watch this beneficial Reel on IQRANIX.",

                url:
                    shareUrl
            });

        } catch (error) {

            console.log(
                "Share canceled:",
                error
            );
        }

        return;
    }


    try {

        await navigator.clipboard.writeText(
            shareUrl
        );


        alert(
            "Reel link copied."
        );

    } catch {

        alert(
            shareUrl
        );
    }
}


// ============================================================
// AVATAR
// ============================================================

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

            <rect
                width="100"
                height="100"
                rx="50"
                fill="#101014"
            />

            <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#e6bd62"
                stroke-width="2"
            />

            <text
                x="50"
                y="63"
                text-anchor="middle"
                font-family="Arial"
                font-size="43"
                font-weight="700"
                fill="#f8d987"
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


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;
}


// ============================================================
// BACK BUTTON
// ============================================================

backBtn.onclick =
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "index.html";
        }
    };


// ============================================================
// INITIAL
// ============================================================

console.log(
    "IQRANIX Reels initialized."
);


console.log(
    "Cloudflare Worker:",
    `${API_BASE}/upload`
);


console.log(
    "Bunny Library:",
    BUNNY_LIBRARY_ID
);


console.log(
    "Bunny CDN:",
    BUNNY_CDN_HOSTNAME
);