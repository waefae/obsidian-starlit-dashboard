import { App } from "obsidian";
import { renderCalendar } from "../modules/calendar";
import { getVaultImage } from "../utils/image";
import { createFocus } from "../components/focus";

export function createHomepage(app: App) {

    const root = document.createElement("div");
    root.classList.add("starlit-homepage");

    const heroImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/banner.png"
    );

    const projectImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/project.png"
    );

    const archiveText = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/text/starlit-archive.png"
    );

    const semesterText = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/text/summer-semester.png"
    );

    const startQuote = getVaultImage(
    app,
    "040 Projects/starlit-archive-project/assets/text/start-quote.png"
);

    const girlImage = getVaultImage(
    app,
    "040 Projects/starlit-archive-project/assets/girl.png"
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
        <div class="hero-banner">
            <div class="hero-content">

                <div class="hero-text-stack">
                    <div class="archive-title"></div>
                    <div class="semester-title"></div>
                    <div class="semester-divider"></div>
                    <div class="start-quote"></div>
                </div>

            </div>

            <div class="calendar-widget">
                CALENDAR
            </div>
        </div>

        <div class="quick-actions" data-quick-buttons="true"></div>
        
        <div class="deadlines-block"></div>
        <div class="illustration-block"></div>
        <div class="schedule-block">SCHEDULE</div>

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

    const quickActions = root.querySelector(
        ".quick-actions"
    );

    if (quickActions) {

        quickActions.after(
            createFocus(app)
        );

    }

    // =========================
    // HERO IMAGES
    // =========================

    const hero = root.querySelector(".hero-banner") as HTMLElement;

    if (heroImage) {
        hero.style.setProperty("--hero-image", `url("${heroImage}")`);
    }

    const archiveTitle = root.querySelector(".archive-title") as HTMLElement;
    if (archiveText) {
        archiveTitle.style.setProperty("--archive-title", `url("${archiveText}")`);
    }

    const semesterTitle = root.querySelector(".semester-title") as HTMLElement;
    if (semesterText) {
        semesterTitle.style.setProperty("--semester-title", `url("${semesterText}")`);
    }

    const startQuoteEl = root.querySelector(".start-quote") as HTMLElement;

if (startQuote) {
    startQuoteEl.style.setProperty(
        "--start-quote",
        `url("${startQuote}")`
    );
}

    const project = root.querySelector(".project-block") as HTMLElement;
    if (projectImage) {
        project.style.setProperty("--project-image", `url("${projectImage}")`);
    }

    const schedule = root.querySelector(".schedule-block") as HTMLElement;

if (girlImage) {
    schedule.style.setProperty("--girl-image", `url("${girlImage}")`);
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

    const calendarContainer = root.querySelector(".calendar-widget") as HTMLElement;

    if (calendarContainer) {
        renderCalendar(app, calendarContainer);
    }

    const quick = root.querySelector(".quick-actions");

if (quick) {

    const bunny = document.createElement("div");
    bunny.classList.add("quick-bunny");

    bunny.innerHTML = `
        <svg class="bunny-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">

            <!-- ТЕНЬ -->
            <ellipse class="bunny-shadow"
                cx="32" cy="54"
                rx="14" ry="2"
                fill="#efc4d5"
                opacity="0.55"/>

            <!-- ТЕЛО -->
            <path d="M24 31C22 26 21 18 24 16C28 14 28 24 29 29C30 28 31 28 33 29C34 24 35 14 40 16C44 17 39 31 38 31C41 34 42 36 42 39C42 44 38 47 32 47C26 47 22 45 22 39C22 36 22 34 24 31Z"
                  fill="#fce8ea"
                  stroke="#f293b3"
                  stroke-width="1.2"
                  stroke-linejoin="round"/>

            <ellipse cx="28" cy="38" rx="1.4" ry="2.2" fill="#b13f81"/>
            <ellipse cx="36" cy="38" rx="1.4" ry="2.2" fill="#b13f81"/>

            <ellipse cx="24" cy="40" rx="2.2" ry="1.4" fill="#fcd8dc"/>
            <ellipse cx="40" cy="40" rx="2.2" ry="1.4" fill="#fcd8dc"/>

            <path d="M31 41 Q32 42 33 41"
                  stroke="#e97d9b"
                  stroke-width="1.2"
                  fill="none"
                  stroke-linecap="round"/>

        </svg>
    `;

    quick.appendChild(bunny);

    // =========================
    // HOVER JUMP (1 раз, без залипания)
    // =========================

    let locked = false;

    bunny.addEventListener("mouseenter", () => {

        if (locked) return;
        locked = true;

        bunny.classList.add("jump");

        setTimeout(() => {
            bunny.classList.remove("jump");
            locked = false;
        }, 380); // быстрее возврат
    });
}

    window.dispatchEvent(
        new CustomEvent("starlit-dashboard-ready")
    );

    return root;
}