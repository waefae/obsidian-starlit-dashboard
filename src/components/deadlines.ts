import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createDeadlines(app: App): HTMLElement {

    const deadlines = document.createElement("div");

    deadlines.classList.add("deadlines-block");

    const deadlinesImage = getVaultImage(
        app,
        `${ASSET_PATH}/deadlines.png`
    );

    if (deadlinesImage) {

        deadlines.style.setProperty(
            "--deadlines-image",
            `url("${deadlinesImage}")`
        );

    }

    return deadlines;

}