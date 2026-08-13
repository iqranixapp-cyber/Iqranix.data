"use strict";

/*
=========================================================
 IQRANIX — SERVICE WORKER
 sw.js
=========================================================
*/

const VERSION = "iqranix-v1.0.0";

const STATIC_CACHE = VERSION + "-static";
const RUNTIME_CACHE = VERSION + "-runtime";

const APP_ROOT = "/Iqranix.data/";
const OFFLINE_PAGE = APP_ROOT + "index.html";


/* =====================================================
   APP SHELL
===================================================== */

const APP_SHELL = [
    APP_ROOT,
    OFFLINE_PAGE,
    APP_ROOT + "manifest.json",
    APP_ROOT + "icon-192x192.png",
    APP_ROOT + "icon-512x512.png"
];


/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", function (event) {

    console.log("Iqranix Service Worker installing...");

    event.waitUntil(

        caches.open(STATIC_CACHE)

            .then(function (cache) {

                return cache.addAll(APP_SHELL);

            })

            .then(function () {

                return self.skipWaiting();

            })

            .catch(function (error) {

                console.error(
                    "Iqranix SW install error:",
                    error
                );

            })

    );

});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", function (event) {

    console.log("Iqranix Service Worker activated.");

    event.waitUntil(

        caches.keys()

            .then(function (cacheNames) {

                return Promise.all(

                    cacheNames.map(function (cacheName) {

                        if (
                            cacheName.startsWith("iqranix-") &&
                            cacheName !== STATIC_CACHE &&
                            cacheName !== RUNTIME_CACHE
                        ) {

                            return caches.delete(
                                cacheName
                            );

                        }

                    })

                );

            })

            .then(function () {

                return self.clients.claim();

            })

    );

});


/* =====================================================
   MESSAGE
===================================================== */

self.addEventListener("message", function (event) {

    if (!event.data) {
        return;
    }

    if (
        event.data.type ===
        "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }

});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", function (event) {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url =
        new URL(request.url);


    /* Ignore unsupported protocols */

    if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
    ) {

        return;

    }


    /* =================================================
       PAGE NAVIGATION
    ================================================= */

    if (
        request.mode ===
        "navigate"
    ) {

        event.respondWith(
            networkFirstNavigation(request)
        );

        return;

    }


    /* =================================================
       AUDIO
    ================================================= */

    if (
        url.pathname.endsWith(".mp3") ||
        url.pathname.endsWith(".m4a") ||
        url.pathname.endsWith(".ogg") ||
        url.pathname.endsWith(".wav")
    ) {

        event.respondWith(
            networkFirst(request)
        );

        return;

    }


    /* =================================================
       SAME ORIGIN
    ================================================= */

    if (
        url.origin ===
        self.location.origin
    ) {

        event.respondWith(
            cacheFirst(request)
        );

        return;

    }


    /* =================================================
       EXTERNAL API / CDN
    ================================================= */

    event.respondWith(
        networkFirst(request)
    );

});


/* =====================================================
   NETWORK FIRST — NAVIGATION
===================================================== */

async function networkFirstNavigation(request) {

    try {

        const response =
            await fetch(request);

        if (
            response &&
            response.ok
        ) {

            const cache =
                await caches.open(
                    RUNTIME_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }

        return response;

    }

    catch (error) {

        console.warn(
            "Offline navigation:",
            error
        );

        const cached =
            await caches.match(request);

        if (cached) {
            return cached;
        }


        const offline =
            await caches.match(
                OFFLINE_PAGE
            );

        if (offline) {
            return offline;
        }


        return new Response(
            "Iqranix is currently offline.",
            {
                status: 503,
                headers: {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                }
            }
        );

    }

}


/* =====================================================
   CACHE FIRST
===================================================== */

async function cacheFirst(request) {

    const cached =
        await caches.match(request);

    if (cached) {

        return cached;

    }


    try {

        const response =
            await fetch(request);

        if (
            response &&
            response.ok
        ) {

            const cache =
                await caches.open(
                    RUNTIME_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }

        return response;

    }

    catch (error) {

        console.warn(
            "Cache-first request failed:",
            error
        );

        return new Response(
            "",
            {
                status: 503
            }
        );

    }

}


/* =====================================================
   NETWORK FIRST
===================================================== */

async function networkFirst(request) {

    try {

        const response =
            await fetch(request);

        if (
            response &&
            response.ok &&
            response.type !== "opaque"
        ) {

            const cache =
                await caches.open(
                    RUNTIME_CACHE
                );

            await cache.put(
                request,
                response.clone()
            );

        }

        return response;

    }

    catch (error) {

        console.warn(
            "Network request failed:",
            error
        );

        const cached =
            await caches.match(request);

        if (cached) {

            return cached;

        }

        return new Response(
            "",
            {
                status: 503
            }
        );

    }

}


/* =====================================================
   PUSH NOTIFICATIONS
===================================================== */

self.addEventListener(
    "push",
    function (event) {

        let data = {};

        try {

            if (event.data) {

                data =
                    event.data.json();

            }

        }

        catch (error) {

            data = {

                title:
                    "Iqranix",

                body:
                    event.data
                        ? event.data.text()
                        : "You have an Islamic reminder."

            };

        }


        const title =
            data.title ||
            "Iqranix";


        const options = {

            body:
                data.body ||
                "You have an Islamic reminder.",

            icon:
                APP_ROOT +
                "icon-192x192.png",

            badge:
                APP_ROOT +
                "icon-192x192.png",

            tag:
                data.tag ||
                "iqranix-notification",

            renotify:
                true,

            data: {

                url:
                    data.url ||
                    APP_ROOT

            }

        };


        event.waitUntil(

            self.registration
                .showNotification(
                    title,
                    options
                )

        );

    }
);


/* =====================================================
   NOTIFICATION CLICK
===================================================== */

self.addEventListener(
    "notificationclick",
    function (event) {

        event.notification.close();


        const targetUrl =
            event.notification.data &&
            event.notification.data.url
                ? event.notification.data.url
                : APP_ROOT;


        event.waitUntil(

            self.clients
                .matchAll({

                    type:
                        "window",

                    includeUncontrolled:
                        true

                })

                .then(function (clientList) {

                    for (
                        const client
                        of clientList
                    ) {

                        if (
                            "focus"
                            in client
                        ) {

                            client.navigate(
                                targetUrl
                            );

                            return client.focus();

                        }

                    }


                    if (
                        self.clients.openWindow
                    ) {

                        return self.clients
                            .openWindow(
                                targetUrl
                            );

                    }

                })

        );

    }
);


console.log(
    "Iqranix Service Worker loaded."
);
