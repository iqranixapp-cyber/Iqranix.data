// ============================================================
// IQRANIX DISCOVER
// Premium Discover navigation + search
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

const backBtn =
    document.getElementById("backBtn");

const searchBtn =
    document.getElementById("searchBtn");

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

const searchResults =
    document.getElementById("searchResults");

const searchResultsGrid =
    document.getElementById("searchResultsGrid");

const noResults =
    document.getElementById("noResults");


// ============================================================
// DISCOVER CARDS
// ============================================================

const cards =
    Array.from(
        document.querySelectorAll(
            ".featured-card, .discover-card"
        )
    );


// ============================================================
// BACK BUTTON
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "index.html";
            }

        }
    );

}


// ============================================================
// SEARCH OPEN / CLOSE
// ============================================================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            searchSection.classList.toggle(
                "open"
            );


            if (
                searchSection.classList.contains(
                    "open"
                )
            ) {

                setTimeout(
                    () => {
                        searchInput.focus();
                    },
                    100
                );

            }

        }
    );

}


// ============================================================
// HERO EXPLORE
// ============================================================

if (heroExplore) {

    heroExplore.addEventListener(
        "click",
        () => {

            const section =
                document.getElementById(
                    "discoverCards"
                );


            if (section) {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


// ============================================================
// CARD NAVIGATION
// ============================================================

cards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const page =
                    card.dataset.page;


                if (!page) {
                    return;
                }


                card.style.transform =
                    "scale(.97)";


                setTimeout(
                    () => {

                        card.style.transform =
                            "";

                        window.location.href =
                            page;

                    },
                    120
                );

            }
        );

    }
);


// ============================================================
// SEARCH
// ============================================================

function performSearch() {

    const term =
        searchInput.value
            .trim()
            .toLowerCase();


    if (!term) {

        searchResults.hidden =
            true;

        cards.forEach(
            card => {

                card.style.display =
                    "";

            }
        );

        return;
    }


    searchResults.hidden =
        false;


    searchResultsGrid.innerHTML =
        "";


    let matches = [];


    cards.forEach(
        card => {

            const keywords =
                (
                    card.dataset.keywords ||
                    ""
                ).toLowerCase();


            const title =
                (
                    card.querySelector("h3")
                        ?.textContent ||
                    ""
                ).toLowerCase();


            const description =
                (
                    card.querySelector("p")
                        ?.textContent ||
                    ""
                ).toLowerCase();


            const searchableText =
                `${keywords} ${title} ${description}`;


            if (
                searchableText.includes(term)
            ) {

                matches.push(card);

            }

        }
    );


    if (!matches.length) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    matches.forEach(
        card => {

            const result =
                document.createElement(
                    "button"
                );


            result.className =
                "search-result";


            result.type =
                "button";


            const title =
                card.querySelector("h3")
                    ?.textContent ||
                "Discover";


            const description =
                card.querySelector("p")
                    ?.textContent ||
                "";


            result.innerHTML = `

                <div class="card-icon">
                    ${getCardIcon(card)}
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

            `;


            result.addEventListener(
                "click",
                () => {

                    const page =
                        card.dataset.page;


                    if (page) {

                        window.location.href =
                            page;

                    }

                }
            );


            searchResultsGrid.appendChild(
                result
            );

        }
    );

}


// ============================================================
// SEARCH INPUT
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        performSearch
    );

}


// ============================================================
// CLEAR SEARCH
// ============================================================

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            performSearch();

            searchInput.focus();

        }
    );

}


// ============================================================
// SEARCH ENTER KEY
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                searchInput.value =
                    "";

                performSearch();

                searchSection.classList.remove(
                    "open"
                );

            }

        }
    );

}


// ============================================================
// CARD ICON
// ============================================================

function getCardIcon(card) {

    const icon =
        card.querySelector(
            ".card-icon i"
        );


    if (!icon) {

        return `
            <i class="fa-solid fa-compass"></i>
        `;

    }


    return icon.outerHTML;

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


// ============================================================
// DAILY DISCOVERY DATA
// ============================================================

const dailyDiscoveries = [

    {
        title:
            "The Golden Age of Islamic Knowledge",

        text:
            "Explore the period when Muslim scholars made remarkable contributions to mathematics, medicine, astronomy, geography, philosophy and many other fields.",

        page:
            "scholars.html"
    },


    {
        title:
            "Journey Through Islamic History",

        text:
            "Discover the caliphates, dynasties, cities and major historical developments that shaped Muslim civilization.",

        page:
            "history.html"
    },


    {
        title:
            "The World of Hadith",

        text:
            "Explore the science of Hadith and learn about the different traditions of prophetic reports and their preservation.",

        page:
            "hadith.html"
    },


    {
        title:
            "Muslim Civilizations Across Continents",

        text:
            "From Andalusia to Africa, Persia and beyond, discover the diverse civilizations that contributed to Islamic history.",

        page:
            "civilizations.html"
    },


    {
        title:
            "Names With Beautiful Meanings",

        text:
            "Discover meaningful Muslim names and learn about their linguistic origins and meanings.",

        page:
            "islamic-names.html"
    }

];


// ============================================================
// DAILY DISCOVERY
// ============================================================

function showDailyDiscovery() {

    const index =
        new Date().getDate()
        % dailyDiscoveries.length;


    const discovery =
        dailyDiscoveries[index];


    if (!discovery) {
        return;
    }


    /*
       Instead of replacing the whole page,
       we use a small dialog so the user can
       continue exploring afterwards.
    */

    const overlay =
        document.createElement("div");


    overlay.className =
        "daily-modal";


    overlay.innerHTML = `

        <div class="daily-modal-card">

            <button
                class="daily-modal-close"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="daily-modal-symbol">
                ﷽
            </div>

            <span>
                TODAY'S DISCOVERY
            </span>

            <h2>
                ${escapeHTML(discovery.title)}
            </h2>

            <p>
                ${escapeHTML(discovery.text)}
            </p>

            <button
                class="daily-modal-action"
                id="dailyModalAction"
            >
                Explore This Topic
                <i class="fa-solid fa-arrow-right"></i>
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const close =
        overlay.querySelector(
            ".daily-modal-close"
        );


    const action =
        overlay.querySelector(
            "#dailyModalAction"
        );


    function closeModal() {

        overlay.remove();

    }


    close.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeModal();

            }

        }
    );


    action.addEventListener(
        "click",
        () => {

            window.location.href =
                discovery.page;

        }
    );

}


if (dailyDiscoveryBtn) {

    dailyDiscoveryBtn.addEventListener(
        "click",
        showDailyDiscovery
    );

}


// ============================================================
// KEYBOARD ACCESSIBILITY
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement !==
                searchInput
        ) {

            event.preventDefault();

            searchSection.classList.add(
                "open"
            );

            searchInput.focus();

        }

    }
);


// ============================================================
// INITIALIZATION
// ============================================================

console.log(
    "IQRANIX Discover initialized."
);

console.log(
    `Discover cards loaded: ${cards.length}`
);