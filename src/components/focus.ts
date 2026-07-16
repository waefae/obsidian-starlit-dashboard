import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createFocus(app: App): HTMLElement {

    const focus = document.createElement("div");

    focus.classList.add("focus-block");

    const focusImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/focus.png`
    );

    const borderImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/border.png`
    );

    const selectImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/select.png`
    );

    const badgeImage = getVaultImage(
        app,
        `${ASSET_PATH}/focus/badge.png`
    );

    focus.innerHTML = `

        <div class="focus-corner tl"></div>
        <div class="focus-corner tr"></div>
        <div class="focus-corner bl"></div>
        <div class="focus-corner br"></div>

        <div class="focus-layout">

            <div class="focus-header">
                FOCUS
            </div>

            <div class="focus-badge">

                <div class="course-grid">

                    <div class="course-title">
                        Quantum Mechanics
                    </div>

                    <div class="course-counter">
                        2 / 5
                    </div>

                    <div class="course-subtitle">
                        Lecture 7
                    </div>

                </div>

                <div class="course-progress">
                    <div class="course-progress-fill"></div>
                </div>

            </div>

            <div class="focus-tasks">

                <div class="task">
                    <span class="task-dot"></span>
                    Write essay
                </div>

                <div class="task completed">
                    <span class="task-dot"></span>
                    Read chapter 3
                </div>

                <div class="task">
                    <span class="task-dot"></span>
                    Review notes
                </div>

            </div>

        </div>

        <div class="focus-select"></div>

    `;

    if (focusImage) {

        focus.style.setProperty(
            "--focus-image",
            `url("${focusImage}")`
        );

    }

    if (borderImage) {

        focus.style.setProperty(
            "--focus-border-image",
            `url("${borderImage}")`
        );

    }

    if (selectImage) {

        focus.style.setProperty(
            "--focus-select-image",
            `url("${selectImage}")`
        );

    }

    if (badgeImage) {

        focus.style.setProperty(
            "--focus-badge-image",
            `url("${badgeImage}")`
        );

    }

    return focus;

}