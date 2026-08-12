/*
========================================
        IQRANIX SERVICE WORKER
========================================
*/

"use strict";

const CACHE_NAME = "iqranix-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./prayer.html",
    "./quran.html",
    "./qibla.html",
    "./tasbih.html",
    "./settings.html",
    "./notifications.html",

    "./manifest.json",

    "./icon-192x192.png",
    "./icon-512x512.png",
    "./logo.png",

    "./home.css",
    "./prayer.css",
    "./qibla.css",
    "./notifications.css",

    "./prayer.js",
    "./notifications.js"
];


/*
========================================
INSTALL
========================================
*/

self.addEventListener("install", event => {

    console.log("Iqranix Service Worker installing...");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(APP_FILES);

            })
            .catch(error => {

                console.warn(
                    "Some Iqranix files could not be cached:",
                    error
                );

            })

    );

    self.skipWaiting();

});


/*
========================================
ACTIVATE
========================================
*/

self.addEventListener("activate", event => {

    console.log("Iqranix Service Worker activated.");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(name =>
                            name !== CACHE_NAME
                        )
                        .map(name =>
                            caches.delete(name)
                        )

                );

            })

    );

    self.clients.claim();

});


/*
========================================
FETCH
========================================
*/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then(response => {

                /*
                Save successful network
                responses for offline use.
                */

                const responseClone =
                    response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(
                            event.request,
                            responseClone
                        );

                    });

                return response;

            })

            .catch(() => {

                /*
                If there is no internet,
                use the cached version.
                */

                return caches.match(
                    event.request
                );

            })

    );

});


/*
========================================
PUSH NOTIFICATIONS
========================================
*/

self.addEventListener(
    "push",
    event => {

        let data = {};

        try {

            data =
                event.data
                    ? event.data.json()
                    : {};

        } catch {

            data = {
                title: "Iqranix",
                body: event.data
                    ? event.data.text()
                    : "You have a new notification."
            };

        }

        const title =
            data.title || "Iqranix";

        const options = {

            body:
                data.body ||
                "Your Islamic reminder from Iqranix.",

            icon:
                data.icon ||
                "./icon-192x192.png",

            badge:
                data.badge ||
                "./icon-192x192.png",

            tag:
                data.tag ||
                "iqranix-notification",

            data:
                {
                    url:
                        data.url ||
                        "./index.html"
                },

            vibrate:
                [200, 100, 200],

            requireInteraction:
                Boolean(
                    data.requireInteraction
                )

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


/*
========================================
NOTIFICATION CLICK
========================================
*/

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();

        const url =
            event.notification.data &&
            event.notification.data.url
                ? event.notification.data.url
                : "./index.html";

        event.waitUntil(

            clients.matchAll({
                type: "window",
                includeUncontrolled: true
            })

            .then(clientList => {

                for (
                    const client of clientList
                ) {

                    if (
                        "focus" in client
                    ) {

                        client.navigate(url);

                        return client.focus();

                    }

                }

                if (
                    clients.openWindow
                ) {

                    return clients.openWindow(
                        url
                    );

                }

            })

        );

    }
);
