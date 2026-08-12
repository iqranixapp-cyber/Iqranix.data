("use strict");

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "iqranixPrayerScheduler";

    const reminderType = document.getElementById("reminderType");
    const prayerFields = document.getElementById("prayerFields");
    const customFields = document.getElementById("customFields");
    const prayerName = document.getElementById("prayerName");
    const customName = document.getElementById("customName");
    const reminderTime = document.getElementById("reminderTime");
    const enabledInput = document.getElementById("enabledInput");
    const saveButton = document.getElementById("saveButton");
    const scheduleList = document.getElementById("scheduleList");
    const emptyState = document.getElementById("emptyState");
    const clearAllButton = document.getElementById("clearAllButton");
    const toast = document.getElementById("toast");
    const backButton = document.getElementById("backButton");

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let schedules = loadSchedules();
    let editingId = null;

    function loadSchedules() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveSchedules() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
    }

    function toggleTypeFields() {
        const custom = reminderType.value === "custom";
        prayerFields.classList.toggle("hidden", custom);
        customFields.classList.toggle("hidden", !custom);
    }

    function getSelectedDays() {
        return [...document.querySelectorAll("#daysGrid input:checked")]
            .map(input => Number(input.value))
            .sort((a, b) => a - b);
    }

    function formatTime(time) {
        if (!time) return "--:--";
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute, 0, 0);
        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function resetForm() {
        editingId = null;
        reminderType.value = "prayer";
        prayerName.value = "Fajr";
        customName.value = "";
        reminderTime.value = "";
        enabledInput.checked = true;

        document.querySelectorAll("#daysGrid input").forEach(input => {
            input.checked = true;
        });

        saveButton.textContent = "＋ Save Reminder";
        toggleTypeFields();
    }

    function renderSchedules() {
        scheduleList.innerHTML = "";

        emptyState.classList.toggle("hidden", schedules.length !== 0);

        if (!schedules.length) return;

        schedules
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .forEach(item => {
                const element = document.createElement("article");
                element.className = "schedule-item" + (item.enabled ? "" : " disabled");

                const daysText = item.days.length === 7
                    ? "Every day"
                    : item.days.map(day => dayNames[day]).join(" • ");

                element.innerHTML = `
                    <div class="schedule-icon">${item.type === "prayer" ? "🕌" : "🔔"}</div>
                    <div class="schedule-main">
                        <div class="schedule-name"></div>
                        <div class="schedule-time"></div>
                        <div class="schedule-days"></div>
                    </div>
                    <div class="schedule-actions">
                        <button type="button" class="toggle" title="Enable/disable">${item.enabled ? "🔔" : "🔕"}</button>
                        <button type="button" class="edit" title="Edit">✏️</button>
                        <button type="button" class="delete" title="Delete">🗑️</button>
                    </div>
                `;

                element.querySelector(".schedule-name").textContent = item.name;
                element.querySelector(".schedule-time").textContent = formatTime(item.time);
                element.querySelector(".schedule-days").textContent = daysText;

                element.querySelector(".toggle").addEventListener("click", () => {
                    item.enabled = !item.enabled;
                    saveSchedules();
                    renderSchedules();
                });

                element.querySelector(".edit").addEventListener("click", () => {
                    editSchedule(item.id);
                });

                element.querySelector(".delete").addEventListener("click", () => {
                    schedules = schedules.filter(schedule => schedule.id !== item.id);
                    saveSchedules();
                    renderSchedules();
                    showToast("Reminder deleted");
                });

                scheduleList.appendChild(element);
            });
    }

    function editSchedule(id) {
        const item = schedules.find(schedule => schedule.id === id);
        if (!item) return;

        editingId = id;
        reminderType.value = item.type;
        prayerName.value = item.type === "prayer" ? item.name : "Fajr";
        customName.value = item.type === "custom" ? item.name : "";
        reminderTime.value = item.time;
        enabledInput.checked = item.enabled;

        document.querySelectorAll("#daysGrid input").forEach(input => {
            input.checked = item.days.includes(Number(input.value));
        });

        saveButton.textContent = "✓ Update Reminder";
        toggleTypeFields();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function saveReminder() {
        const type = reminderType.value;
        const name = type === "prayer"
            ? prayerName.value
            : customName.value.trim();

        if (!name) {
            showToast("Enter a reminder name");
            return;
        }

        if (!reminderTime.value) {
            showToast("Choose a time");
            return;
        }

        const days = getSelectedDays();

        if (!days.length) {
            showToast("Choose at least one day");
            return;
        }

        const item = {
            id: editingId || (Date.now().toString(36) + Math.random().toString(36).slice(2)),
            type,
            name,
            time: reminderTime.value,
            days,
            enabled: enabledInput.checked
        };

        if (editingId) {
            const index = schedules.findIndex(schedule => schedule.id === editingId);
            if (index !== -1) schedules[index] = item;
            showToast("Reminder updated");
        } else {
            schedules.push(item);
            showToast("Reminder saved");
        }

        saveSchedules();
        renderSchedules();
        resetForm();
    }

    reminderType.addEventListener("change", toggleTypeFields);
    saveButton.addEventListener("click", saveReminder);

    clearAllButton.addEventListener("click", () => {
        if (!schedules.length) {
            showToast("No reminders to clear");
            return;
        }

        if (confirm("Delete all saved reminders?")) {
            schedules = [];
            saveSchedules();
            renderSchedules();
            resetForm();
            showToast("All reminders cleared");
        }
    });

    backButton.addEventListener("click", () => {
        if (history.length > 1) history.back();
        else window.location.href = "index.html";
    });

    toggleTypeFields();
    renderSchedules();
});
