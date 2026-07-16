import { App } from "obsidian";

type CalendarTask = {
    text: string;
    date: any;
    type: "deadline" | "event";
};

export function renderCalendar(app: App, container: HTMLElement) {

    container.innerHTML = "";

    const dv = (app as any).plugins.plugins.dataview?.api;
    const today = window.moment();

    if (!dv) {
        container.innerHTML = "Dataview not found";
        return;
    }

    // ================= CARD =================

    const calendarCard = document.createElement("div");
    calendarCard.classList.add("calendar-card");

    // ================= POPUP =================

    const popup = document.createElement("div");
    popup.classList.add("calendar-popup");

    popup.style.position = "absolute";
    popup.style.display = "none";
    popup.style.zIndex = "9999";

    popup.style.background = "rgba(255,255,255,0.92)";
    popup.style.backdropFilter = "blur(10px)";
    popup.style.padding = "10px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    popup.style.minWidth = "180px";
    popup.style.maxWidth = "240px";
    popup.style.color = "#333";

    document.body.appendChild(popup);

    let popupTimeout: any = null;

    function showPopup(dayTasks: CalendarTask[], rect: DOMRect) {

        popup.innerHTML = "";

        if (!dayTasks || dayTasks.length === 0) {
            popup.style.display = "none";
            return;
        }

        const ul = document.createElement("ul");

        ul.style.listStyle = "none";
        ul.style.padding = "0";
        ul.style.margin = "0";

        dayTasks.forEach(t => {

            const li = document.createElement("li");

            li.textContent = t.text;
            li.style.padding = "6px 8px";
            li.style.borderRadius = "8px";
            li.style.marginBottom = "6px";
            li.style.cursor = "pointer";

            if (t.type === "deadline") li.style.background = "#FFE4F0";
            else if (t.type === "event") li.style.background = "#DCEEEE";
            else li.style.background = "#FFD6E0";

            ul.appendChild(li);
        });

        popup.appendChild(ul);

        popup.style.display = "block";

        popup.style.left = `${rect.left + window.scrollX + 10}px`;
        popup.style.top = `${rect.top + window.scrollY}px`;
    }

    document.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // ================= HEADER =================

    const header = document.createElement("div");
    header.classList.add("calendar-header");

    const left = document.createElement("div");
    left.classList.add("calendar-header-left");

    const title = document.createElement("div");
    title.classList.add("calendar-title");
    title.textContent = today.format("MMMM YYYY");

    left.appendChild(title);

    const right = document.createElement("div");
    right.classList.add("calendar-header-right");

    const load = document.createElement("div");
    load.classList.add("calendar-load-inline");

    right.appendChild(load);

    header.appendChild(left);
    header.appendChild(right);

    calendarCard.appendChild(header);

    // ================= WEEKDAYS =================

    const weekdays = document.createElement("div");
    weekdays.classList.add("calendar-weekdays");

    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(d => {
        const el = document.createElement("div");
        el.textContent = d;
        weekdays.appendChild(el);
    });

    calendarCard.appendChild(weekdays);

    // ================= TASKS =================

    const allTasks = dv.pages().file.tasks
        .where((t: any) =>
            !t.completed &&
            !t.text.toLowerCase().includes("cancelled")
        );

    function getTaskDates(t: any) {
        const dates: any[] = [];

        const deadline = t.text.match(/⏰\s*(\d{4}-\d{2}-\d{2})/);
        if (deadline) {
            dates.push({
                type: "deadline",
                date: window.moment(deadline[1]).startOf("day")
            });
        } else {
            const event = t.text.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
            if (event) {
                dates.push({
                    type: "event",
                    date: window.moment(event[1]).startOf("day")
                });
            }
        }

        return dates;
    }

    const tasks: CalendarTask[] = allTasks.flatMap((t: any) => {
        const dates = getTaskDates(t);

        return dates.map(d => ({
            text: t.text.replace(/⏰.*|📅.*/g, "").trim(),
            date: d.date,
            type: d.type
        }));
    });

    // ================= GRID =================

    const grid = document.createElement("div");
    grid.classList.add("calendar-grid");

    let day = today.clone().startOf("month").startOf("week").add(1, "day");
    const end = today.clone().endOf("month").endOf("week").add(1, "day");

    while (day.isSameOrBefore(end)) {

        const cell = document.createElement("div");
        cell.classList.add("calendar-day");

        const dayTasks = tasks.filter(t =>
            t.date.isSame(day, "day")
        );

        const count = dayTasks.length;

        cell.style.cursor = "pointer";

        // ================= HOVER POPUP =================

        cell.addEventListener("mouseenter", () => {

            clearTimeout(popupTimeout);

            if (dayTasks.length === 0) return;

            popupTimeout = setTimeout(() => {
                const rect = cell.getBoundingClientRect();
                showPopup(dayTasks, rect);
            }, 120);
        });

        cell.addEventListener("mouseleave", () => {
            clearTimeout(popupTimeout);
        });

        // ================= CLICK POPUP =================

        cell.addEventListener("click", (e) => {
            e.stopPropagation();
            const rect = cell.getBoundingClientRect();
            showPopup(dayTasks, rect);
        });

        // ================= VISUALS =================

        if (count > 0) {
            cell.classList.add(`lvl-${Math.min(count, 3)}`);
        }

        if (!day.isSame(today, "month")) {
            cell.style.opacity = "0.35";
            cell.style.filter = "grayscale(0.3)";
        }

        if (day.isSame(today, "day")) {
            cell.classList.add("today-heart");
            cell.textContent = "❤";
        } else {
            cell.textContent = String(day.date());
        }

        grid.appendChild(cell);
        day.add(1, "day");
    }

    calendarCard.appendChild(grid);

    // ================= LEGEND =================

    const legend = document.createElement("div");
    legend.classList.add("calendar-legend");

    legend.innerHTML = `
        <span><b style="color:#F48CA8">●</b> deadline</span>
        <span><b style="color:#DCEEEE">●</b> event</span>
        <span><b style="color:#FFD6E0">●</b> task</span>
        <span><b style="color:#F2C94C">●</b> birthday</span>
    `;

    calendarCard.appendChild(legend);

    // ================= LOAD =================

    const total = tasks.length;

    load.textContent =
        total > 40 ? "overloaded ⚠" :
        total > 20 ? "busy" :
        "soft";

    container.appendChild(calendarCard);
}