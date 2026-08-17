import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";

const appRoot = document.getElementById("app");

if (appRoot && !appRoot.dataset.reactMounted) {
	createRoot(appRoot).render(<App />);
	appRoot.dataset.reactMounted = "true";
}
