import { App } from "obsidian";
import { renderCalendar } from "../modules/calendar";
import { getVaultImage } from "../utils/image";
import { createFocus } from "../components/focus";
import { createHero } from "../components/hero";
import { createQuickActions } from "../components/quickActions";
import { createSchedule } from "../components/schedule";
import { createProject } from "../components/project";
import { createIllustration } from "../components/illustration";
import { createDeadlines } from "../components/deadlines";

export function createHomepage(app: App) {

    const root = document.createElement("div");
    root.classList.add("starlit-homepage");

    root.innerHTML = `
        
        <div class="deadlines-placeholder"></div>
        <div class="illustration-placeholder"></div>
        <div class="schedule-placeholder"></div>

        <div class="project-placeholder"></div>

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

    const project = createProject(app);

    root.querySelector(
        ".project-placeholder"
    )?.replaceWith(project);
    
    const illustration = createIllustration(app);

    root.querySelector(
        ".illustration-placeholder"
    )?.replaceWith(illustration);

    const deadlines = createDeadlines(app);

    root.querySelector(
        ".deadlines-placeholder"
    )?.replaceWith(deadlines);

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