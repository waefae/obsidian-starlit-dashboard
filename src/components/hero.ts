import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createHero(app: App): HTMLElement {

    const hero = document.createElement("div");

    hero.classList.add("hero-banner");

    const heroImage = getVaultImage(
        app,
        `${ASSET_PATH}/banner.png`
    );

    const archiveText = getVaultImage(
        app,
        `${ASSET_PATH}/text/starlit-archive.png`
    );

    const semesterText = getVaultImage(
        app,
        `${ASSET_PATH}/text/summer-semester.png`
    );

    const startQuote = getVaultImage(
        app,
        `${ASSET_PATH}/text/start-quote.png`
    );

    hero.innerHTML = `
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
    `;

    if (heroImage) {

        hero.style.setProperty(
            "--hero-image",
            `url("${heroImage}")`
        );

    }

    const archiveTitle = hero.querySelector(
        ".archive-title"
    ) as HTMLElement;

    if (archiveText) {

        archiveTitle.style.setProperty(
            "--archive-title",
            `url("${archiveText}")`
        );

    }

    const semesterTitle = hero.querySelector(
        ".semester-title"
    ) as HTMLElement;

    if (semesterText) {

        semesterTitle.style.setProperty(
            "--semester-title",
            `url("${semesterText}")`
        );

    }

    const startQuoteEl = hero.querySelector(
        ".start-quote"
    ) as HTMLElement;

    if (startQuote) {

        startQuoteEl.style.setProperty(
            "--start-quote",
            `url("${startQuote}")`
        );

    }

    return hero;

}