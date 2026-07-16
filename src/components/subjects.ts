import { App } from "obsidian";
import { ASSET_PATH } from "../constants";

export function createSubjects(app: App): HTMLElement {

    const subjects = document.createElement("div");

    subjects.classList.add("subjects-block");

    subjects.textContent = "subjects";

    return subjects;

}