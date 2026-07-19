import { App, TFile } from "obsidian";
import { FocusTask } from "./progress";

export async function toggleTask(
    app: App,
    task: FocusTask
) {

    const file =
        app.vault.getAbstractFileByPath(task.path);

    if (!(file instanceof TFile)) {
        return;
    }

    const content =
        await app.vault.read(file);

    const lines =
        content.split("\n");

    const line =
        lines[task.line];

    if (!line) return;

    if (line.includes("- [ ]")) {

        lines[task.line] =
            line.replace("- [ ]", "- [x]");

    } else if (line.includes("- [x]")) {

        lines[task.line] =
            line.replace("- [x]", "- [ ]");

    }

    await app.vault.modify(
        file,
        lines.join("\n")
    );

}