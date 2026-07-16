import { App } from "obsidian";

export function createQuickActions(app: App): HTMLElement {

    const quick = document.createElement("div");

    quick.classList.add("quick-actions");

    quick.dataset.quickButtons = "true";

    const bunny = document.createElement("div");

    bunny.classList.add("quick-bunny");

    bunny.innerHTML = `
        <svg class="bunny-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">

            <ellipse class="bunny-shadow"
                cx="32"
                cy="54"
                rx="14"
                ry="2"
                fill="#efc4d5"
                opacity="0.55"/>

            <path
                d="M24 31C22 26 21 18 24 16C28 14 28 24 29 29C30 28 31 28 33 29C34 24 35 14 40 16C44 17 39 31 38 31C41 34 42 36 42 39C42 44 38 47 32 47C26 47 22 45 22 39C22 36 22 34 24 31Z"
                fill="#fce8ea"
                stroke="#f293b3"
                stroke-width="1.2"
                stroke-linejoin="round"/>

            <ellipse
                cx="28"
                cy="38"
                rx="1.4"
                ry="2.2"
                fill="#b13f81"/>

            <ellipse
                cx="36"
                cy="38"
                rx="1.4"
                ry="2.2"
                fill="#b13f81"/>

            <ellipse
                cx="24"
                cy="40"
                rx="2.2"
                ry="1.4"
                fill="#fcd8dc"/>

            <ellipse
                cx="40"
                cy="40"
                rx="2.2"
                ry="1.4"
                fill="#fcd8dc"/>

            <path
                d="M31 41 Q32 42 33 41"
                stroke="#e97d9b"
                stroke-width="1.2"
                fill="none"
                stroke-linecap="round"/>

        </svg>
    `;

        quick.appendChild(bunny);

    let locked = false;

    bunny.addEventListener("mouseenter", () => {

        if (locked) return;

        locked = true;

        bunny.classList.add("jump");

        setTimeout(() => {

            bunny.classList.remove("jump");

            locked = false;

        }, 380);

    });

        return quick;

}