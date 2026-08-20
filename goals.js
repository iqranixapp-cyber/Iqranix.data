/* =========================================================
   IQRANIX — DAILY GOALS
   goals.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       STORAGE
    ----------------------------------------------------- */

    const STORAGE_KEY = "iqranix_daily_goals";

    const defaultGoals = [
        {
            id: "quran",
            title: "Read Quran",
            subtitle: "Read 2 pages",
            icon: "fa-quran",
            xp: 20,
            completed: false
        },
        {
            id: "prayer",
            title: "Complete Prayers",
            subtitle: "Complete all 5 prayers",
            icon: "fa-mosque",
            xp: 40,
            completed: false
        },
        {
            id: "dhikr",
            title: "Morning & Evening Dhikr",
            subtitle: "Complete your daily adhkar",
            icon: "fa-hands-praying",
            xp: 25,
            completed: false
        },
        {
            id: "hadith",
            title: "Learn a Hadith",
            subtitle: "Read today's Hadith",
            icon: "fa-book-open",
            xp: 15,
            completed: false
        }
    ];


    /* -----------------------------------------------------
       LOAD SAVED DATA
    ----------------------------------------------------- */

    let savedData = null;

    try {
        savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
        savedData = null;
    }

    let goals = savedData?.goals || defaultGoals;

    let currentDate = getToday();


    /* -----------------------------------------------------
       RESET WHEN A NEW DAY STARTS
    ----------------------------------------------------- */

    if (savedData?.date !== currentDate) {
        goals = defaultGoals.map(goal => ({
            ...goal,
            completed: false
        }));

        saveData();
    }


    /* -----------------------------------------------------
       ELEMENTS
    ----------------------------------------------------- */

    const goalList =
        document.getElementById("goalsList") ||
        document.querySelector(".goals-list");

    const progressBar =
        document.getElementById("goalsProgressBar") ||
        document.querySelector(".goals-progress-bar");

    const progressText =
        document.getElementById("goalsProgressText") ||
        document.querySelector(".goals-progress-text");

    const completedText =
        document.getElementById("goalsCompleted") ||
        document.querySelector(".goals-completed");

    const xpText =
        document.getElementById("goalsXP") ||
        document.querySelector(".goals-xp");

    const streakText =
        document.getElementById("goalsStreak") ||
        document.querySelector(".goals-streak");

    const resetButton =
        document.getElementById("resetGoals") ||
        document.querySelector(".reset-goals");


    /* -----------------------------------------------------
       RENDER GOALS
    ----------------------------------------------------- */

    function renderGoals() {

        if (!goalList) return;

        goalList.innerHTML = "";

        goals.forEach(goal => {

            const item = document.createElement("button");

            item.className =
                `goal-item ${goal.completed ? "completed" : ""}`;

            item.setAttribute("type", "button");
            item.dataset.goalId = goal.id;

            item.innerHTML = `

                <div class="goal-icon">
                    <i class="fa-solid ${goal.icon}"></i>
                </div>

                <div class="goal-content">

                    <strong>${escapeHTML(goal.title)}</strong>

                    <span>${escapeHTML(goal.subtitle)}</span>

                </div>

                <div class="goal-xp">
                    +${goal.xp} XP
                </div>

                <div class="goal-check">

                    ${
                        goal.completed
                        ? '<i class="fa-solid fa-check"></i>'
                        : '<i class="fa-solid fa-chevron-right"></i>'
                    }

                </div>

            `;

            item.addEventListener("click", () => {
                toggleGoal(goal.id);
            });

            goalList.appendChild(item);
        });

        updateProgress();
    }


    /* -----------------------------------------------------
       COMPLETE / UNCOMPLETE GOAL
    ----------------------------------------------------- */

    function toggleGoal(id) {

        const goal = goals.find(item => item.id === id);

        if (!goal) return;

        goal.completed = !goal.completed;

        saveData();
        renderGoals();

        if (goal.completed) {
            showCompletionEffect(goal);
        }

        checkAllGoals();
    }


    /* -----------------------------------------------------
       PROGRESS
    ----------------------------------------------------- */

    function updateProgress() {

        const completed = goals.filter(
            goal => goal.completed
        ).length;

        const total = goals.length;

        const percentage =
            total === 0
                ? 0
                : Math.round((completed / total) * 100);

        const xp = goals
            .filter(goal => goal.completed)
            .reduce((sum, goal) => sum + goal.xp, 0);


        /* Progress bar */

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }


        /* Percentage */

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }


        /* Completed count */

        if (completedText) {
            completedText.textContent =
                `${completed}/${total} completed`;
        }


        /* XP */

        if (xpText) {
            xpText.textContent = `${xp} XP`;
        }


        /* Streak */

        if (streakText) {
            streakText.textContent =
                calculateStreak();
        }


        /* Optional percentage elements */

        document
            .querySelectorAll("[data-goals-percent]")
            .forEach(element => {
                element.textContent = `${percentage}%`;
            });


        /* Optional completed elements */

        document
            .querySelectorAll("[data-goals-completed]")
            .forEach(element => {
                element.textContent = completed;
            });
    }


    /* -----------------------------------------------------
       ALL GOALS COMPLETED
    ----------------------------------------------------- */

    function checkAllGoals() {

        const allComplete =
            goals.length > 0 &&
            goals.every(goal => goal.completed);

        if (!allComplete) return;

        const card =
            document.querySelector(".daily-goals-card") ||
            document.querySelector(".goals-card");

        if (card) {
            card.classList.add("all-complete");

            setTimeout(() => {
                card.classList.remove("all-complete");
            }, 2500);
        }

        showToast(
            "MashaAllah! All your daily goals are complete ✨"
        );
    }


    /* -----------------------------------------------------
       COMPLETION EFFECT
    ----------------------------------------------------- */

    function showCompletionEffect(goal) {

        const message =
            `+${goal.xp} XP • ${goal.title} completed`;

        showToast(message);
    }


    /* -----------------------------------------------------
       TOAST
    ----------------------------------------------------- */

    function showToast(message) {

        let toast = document.getElementById(
            "goalsToast"
        );

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "goalsToast";

            toast.className = "goals-toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(window.goalToastTimer);

        window.goalToastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);
    }


    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    function resetGoals() {

        const confirmed =
            confirm("Reset today's Daily Goals?");

        if (!confirmed) return;

        goals = defaultGoals.map(goal => ({
            ...goal,
            completed: false
        }));

        saveData();
        renderGoals();

        showToast("Daily goals have been reset.");
    }


    if (resetButton) {
        resetButton.addEventListener(
            "click",
            resetGoals
        );
    }


    /* -----------------------------------------------------
       STREAK SYSTEM
    ----------------------------------------------------- */

    function calculateStreak() {

        const streak =
            savedData?.streak || 0;

        return `${streak} day${streak === 1 ? "" : "s"}`;
    }


    /* -----------------------------------------------------
       SAVE DATA
    ----------------------------------------------------- */

    function saveData() {

        const completedAll =
            goals.length > 0 &&
            goals.every(goal => goal.completed);

        let streak =
            savedData?.streak || 0;

        const lastCompleted =
            savedData?.lastCompletedDate || null;


        if (
            completedAll &&
            lastCompleted !== currentDate
        ) {

            streak++;

            savedData = {
                streak: streak,
                lastCompletedDate: currentDate,
                date: currentDate,
                goals: goals
            };

        } else {

            savedData = {
                streak: streak,
                lastCompletedDate: lastCompleted,
                date: currentDate,
                goals: goals
            };
        }


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(savedData)
        );
    }


    /* -----------------------------------------------------
       TODAY
    ----------------------------------------------------- */

    function getToday() {

        const now = new Date();

        return now.toISOString().split("T")[0];
    }


    /* -----------------------------------------------------
       SAFE HTML
    ----------------------------------------------------- */

    function escapeHTML(value) {

        return String(value)
            .replace(/