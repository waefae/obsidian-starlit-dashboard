import { App } from "obsidian";
import { getVaultImage } from "../utils/image";

export function createSchedule(app: App): HTMLElement {

    const schedule = document.createElement("div");

    schedule.classList.add("schedule-block");

    schedule.textContent = "SCHEDULE";

    const girlImage = getVaultImage(
        app,
        "040 Projects/starlit-archive-project/assets/girl.png"
    );

    if (girlImage) {

        schedule.style.setProperty(
            "--girl-image",
            `url("${girlImage}")`
        );

    }

    return schedule;

}