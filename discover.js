/* ============================================================
   IQRANIX DISCOVER
   Full navigation + search + daily discovery
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ========================================================
       ELEMENTS
    ======================================================== */

    const backBtn = document.getElementById("backBtn");
    const searchBtn = document.getElementById("searchBtn");

    const searchSection =
        document.getElementById("searchSection");

    const searchInput =
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearSearch");

    const heroExplore =
        document.getElementById("heroExplore");

    const dailyDiscoveryBtn =
        document.getElementById("dailyDiscoveryBtn");

    const discoverCards =
        document.querySelectorAll(
            ".discover-card, .feature-card"
        );

    const searchResults =
        document.getElementById("searchResults");

    const searchResultsGrid =
        document.getElementById("searchResultsGrid");

    const noResults =
        document.getElementById("noResults");



    /* ========================================================
       BACK BUTTON
    ======================================================== */

    if (backBtn) {

        backBtn.addEventListener("click", () => {

            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "index.html";
            }

        });

    }



    /* ========================================================
       SEARCH OPEN / CLOSE
    ======================================================== */

    if (searchBtn) {

        searchBtn.addEventListener("click", () => {

            searchSection.classList.toggle("open");

            if (searchSection.classList.contains("open")) {

                setTimeout(() => {
                    searchInput.focus();
                }, 100);

            } else {

                clearSearchInput();

            }

        });

    }



    /* ========================================================
       CLEAR SEARCH
    ======================================================== */

    function clearSearchInput() {

        if (searchInput) {
            searchInput.value = "";
        }

        hideSearchResults();

        showAllCards();

    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            clearSearchInput
        );

    }



    /* ========================================================
       CARD NAVIGATION
    ======================================================== */

    discoverCards.forEach(card => {

        card.addEventListener("click", () => {

            const page =
                card.dataset.page;

            if (!page) return;

            card.style.transform = "scale(.975)";

            setTimeout(() => {

                window.location.href = page;

            }, 120);

        });

    });



    /* ========================================================
       HERO EXPLORE
    ======================================================== */

    if (heroExplore) {

        heroExplore.addEventListener("click", () => {

            const target =
                document.getElementById("discoverCards");

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }



    /* ========================================================
       SEARCH
    ======================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            performSearch
        );

        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    clearSearchInput();

                    searchSection.classList.remove(
                        "open"
                    );

                }

            }
        );

    }



    function performSearch() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        if (!query) {

            hideSearchResults();

            showAllCards();

            return;
        }


        const words =
            query
                .split(/\s+/)
                .filter(Boolean);


        const matches = [];


        discoverCards.forEach(card => {

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

            const description =
                card.querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

            const keywords =
                (
                    card.dataset.keywords || ""
                ).toLowerCase();


            const searchable =
                `${title} ${description} ${keywords}`;


            const matched =
                words.every(word =>
                    searchable.includes(word)
                );


            if (matched) {
                matches.push(card);
            }

        });


        displaySearchResults(matches);

    }



    /* ========================================================
       SEARCH RESULT DISPLAY
    ======================================================== */

    function displaySearchResults(matches) {

        if (!searchResults ||
            !searchResultsGrid ||
            !noResults) {
            return;
        }


        searchResults.hidden = false;

        searchResultsGrid.innerHTML = "";


        if (matches.length === 0) {

            noResults.style.display = "block";

            searchResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }


        noResults.style.display = "none";


        matches.forEach(card => {

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .trim() || "Discover";


            const description =
                card.querySelector("p")
                    ?.textContent
                    .trim() || "";


            const icon =
                card.querySelector(".icon-box i")
                    ?.className ||
                "fa-solid fa-compass";


            const page =
                card.dataset.page;


            const result =
                document.createElement("article");


            result.className =
                "search-result";


            result.innerHTML = `
                <div class="search-result-icon">
                    <i class="${icon}"></i>
                </div>

                <h3>${escapeHTML(title)}</h3>

                <p>${escapeHTML(description)}</p>
            `;


            result.addEventListener(
                "click",
                () => {

                    if (page) {
                        window.location.href = page;
                    }

                }
            );


            searchResultsGrid.appendChild(result);

        });


        searchResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }



    /* ========================================================
       HIDE SEARCH RESULTS
    ======================================================== */

    function hideSearchResults() {

        if (!searchResults) return;

        searchResults.hidden = true;

        if (searchResultsGrid) {
            searchResultsGrid.innerHTML = "";
        }

        if (noResults) {
            noResults.style.display = "none";
        }

    }



    /* ========================================================
       SHOW ALL CARDS
    ======================================================== */

    function showAllCards() {

        discoverCards.forEach(card => {

            card.style.display = "";

        });

    }



    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    function escapeHTML(value) {

        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    /* ========================================================
       DAILY DISCOVERY
    ======================================================== */

    const dailyPages = [

        "history.html",
        "scholars.html",
        "civilizations.html",
        "sacred-places.html",
        "islamic-books.html",
        "islamic-knowledge.html",
        "hadith.html"

    ];


    function getDailyIndex() {

        const today =
            new Date();


        const start =
            new Date(
                today.getFullYear(),
                0,
                0
            );


        const difference =
            today - start;


        const oneDay =
            1000 * 60 * 60 * 24;


        const dayOfYear =
            Math.floor(
                difference / oneDay
            );


        return dayOfYear %
            dailyPages.length;

    }


    if (dailyDiscoveryBtn) {

        dailyDiscoveryBtn.addEventListener(
            "click",
            () => {

                const index =
                    getDailyIndex();

                const page =
                    dailyPages[index];

                if (page) {
                    window.location.href = page;
                }

            }
        );

    }



    /* ========================================================
       KEYBOARD SEARCH SHORTCUT
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "/" &&
                document.activeElement.tagName !== "INPUT"
            ) {

                event.preventDefault();

                searchSection.classList.add(
                    "open"
                );

                searchInput.focus();

            }

        }
    );



    /* ========================================================
       IMAGE PRELOADING
       Keeps card transitions smoother.
    ======================================================== */

    const backgroundImages = [

        "discover-hero-bg.jpg",

        "history-bg.jpg",
        "scholars-bg.jpg",
        "mosque-bg.jpg",
        "hadith-bg.jpg",
        "names-bg.jpg",
        "civilizations-bg.jpg",
        "sacred-places-bg.jpg",
        "books-bg.jpg",
        "calendar-bg.jpg",
        "knowledge-bg.jpg",
        "ringtones-bg.jpg",
        "nasheeds-bg.jpg",

        "discover-daily-bg.jpg"

    ];


    backgroundImages.forEach(src => {

        const image =
            new Image();

        image.src = src;

    });



    /* ========================================================
       PAGE READY
    ======================================================== */

    document.body.classList.add(
        "discover-ready"
    );

});