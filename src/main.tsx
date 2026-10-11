import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import "./style.css";

const appRoot = document.getElementById("app");

if (appRoot && !appRoot.dataset.reactMounted) {
	createRoot(appRoot).render(<RouterProvider router={router} />);
	appRoot.dataset.reactMounted = "true";
}
