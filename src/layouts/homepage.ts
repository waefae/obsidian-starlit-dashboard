import { App } from "obsidian";
import { renderCalendar } from "../modules/calendar";
import { getVaultImage } from "../utils/image";
import { createFocus } from "../components/focus";
import { createHero } from "../components/hero";
import { createQuickActions } from "../components/quickActions";
import { createSchedule } from "../components/schedule";

export function createHomepage(app: App) {

    const root = document.createElement("div");
    root.classList.add("starlit-homepage");

    const projectImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/project.png"
    );

    const illustrationImage = getVaultImage(
    app,
    "040 Projects/starlit-archive-project/assets/illustration.png"
);

    const deadlinesImage = getVaultImage(
    app,
    "040 Projects/starlit-archive-project/assets/deadlines.png"
);

    root.innerHTML = `
        
        <div class="deadlines-block"></div>
        <div class="illustration-block"></div>
        <div class="schedule-placeholder"></div>

        <div class="project-block">
            <div class="project-overlay"></div>
            <div class="project-content">PROJECT</div>
        </div>

        <div class="subjects-block">subjects</div>

        <div class="tr-block">
            <div class="recent-notes">recent-notes</div>
            <div class="tasks-block">tasks</div>
        </div>

        <div class="bottom-block">BOTTOM</div>
    `;

    const hero = createHero(app);

    root.prepend(hero);

    const quickActions = createQuickActions(app);

    hero.after(quickActions);

    quickActions.after(
        createFocus(app)
    );

    const schedule = createSchedule(app);

    const schedulePlaceholder = root.querySelector(
        ".schedule-placeholder"
    );

    schedulePlaceholder?.replaceWith(schedule);

    const project = root.querySelector(".project-block") as HTMLElement;
    if (projectImage) {
        project.style.setProperty("--project-image", `url("${projectImage}")`);
    }
    
    const illustration = root.querySelector(".illustration-block") as HTMLElement;

if (illustrationImage) {
    illustration.style.setProperty(
        "--illustration-image",
        `url("${illustrationImage}")`
    );
}

    const deadlines = root.querySelector(".deadlines-block") as HTMLElement;

if (deadlinesImage) {
    deadlines.style.setProperty(
        "--deadlines-image",
        `url("${deadlinesImage}")`
    );
}

    // =========================
    // CALENDAR INIT (ВАЖНО!)
    // =========================

    const calendarContainer = hero.querySelector(
        ".calendar-widget"
    ) as HTMLElement;

    if (calendarContainer) {
        renderCalendar(app, calendarContainer);
    }

    window.dispatchEvent(
        new CustomEvent("starlit-dashboard-ready")
    );

    return root;
}