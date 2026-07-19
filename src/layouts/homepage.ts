import { App } from "obsidian";
import { renderCalendar } from "../modules/calendar";

import { createHero } from "../components/hero";
import { createQuickActions } from "../components/quickActions";
import { createFocus } from "../components/focus";
import { createDeadlines } from "../components/deadlines";
import { createIllustration } from "../components/illustration";
import { createSchedule } from "../components/schedule";
import { createProject } from "../components/project";
import { createSubjects } from "../components/subjects";
import { createTR } from "../components/tr";
import { createBottom } from "../components/bottom";
import StarlitPlugin from "../main";

export function createHomepage(
    app: App,
    plugin: StarlitPlugin
) {

    const root = document.createElement("div");

    root.classList.add("starlit-homepage");

    const hero = createHero(app);

    root.append(
        hero,
        createQuickActions(app),
        createFocus(app, plugin),
        createDeadlines(app),
        createIllustration(app),
        createSchedule(app),
        createProject(app),
        createSubjects(app),
        createTR(app),
        createBottom(app)
    );

    // =========================
    // CALENDAR
    // =========================

    const calendarContainer = hero.querySelector(
        ".calendar-widget"
    ) as HTMLElement;

    if (calendarContainer) {

        renderCalendar(
            app,
            calendarContainer
        );

    }

    // =========================
    // READY EVENT
    // =========================

    window.dispatchEvent(
        new CustomEvent("starlit-dashboard-ready")
    );

    return root;

}