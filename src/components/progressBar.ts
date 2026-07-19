import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createProgressBar(app: App): HTMLElement {

    const progress = document.createElement("div");

    const milestone = getVaultImage(
        app,
        `${ASSET_PATH}/svg/progress/milestone.svg`
    );

    const star = getVaultImage(
        app,
        `${ASSET_PATH}/svg/progress/current-star.svg`
    );

    progress.classList.add("course-progress");

    progress.innerHTML = `
        <div class="course-progress-track">

            <div class="course-progress-fill"></div>

            <div class="course-progress-milestones">

                <span class="course-progress-milestone"></span>
                <span class="course-progress-milestone"></span>
                <span class="course-progress-milestone"></span>
                <span class="course-progress-milestone"></span>

            </div>

            <span class="course-progress-star"></span>

        </div>
    `;

    if (milestone) {

        progress.style.setProperty(
            "--progress-milestone",
            `url("${milestone}")`
        );

    }

    if (star) {

        progress.style.setProperty(
            "--progress-star",
            `url("${star}")`
        );

    }

    return progress;

}