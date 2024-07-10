import { CbClient } from "../../../core/src/Client";

export function initNavigation() {
	const burgerMenu = document.getElementById(
		"burger-menu",
	) as HTMLButtonElement;
	const nav = document.getElementById("main-nav") as HTMLElement;

	console.log("burgerMenu", burgerMenu);

	burgerMenu.addEventListener("click", () => {
		nav.classList.toggle("open");
		console.log("toggle nav");
	});
}

const client: CbClient = new CbClient("http://localhost:3000/settings");
