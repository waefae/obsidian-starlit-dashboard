import { App } from "obsidian";
import { getVaultImage } from "../utils/image";
import { ASSET_PATH } from "../constants";

export function createSchedule(app: App): HTMLElement {

    const schedule = document.createElement("div");

    schedule.classList.add("schedule-block");

    schedule.textContent = "SCHEDULE";

    const girlImage = getVaultImage(
        app,
        `${ASSET_PATH}/girl.png`
    );

    if (girlImage) {

        schedule.style.setProperty(
            "--girl-image",
            `url("${girlImage}")`
        );

    }

    return schedule;

}