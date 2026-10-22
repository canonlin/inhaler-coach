import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./pharmacist/Auth";
import { router } from "./routes";
import "./style.css";

const appRoot = document.getElementById("app");

if (appRoot && !appRoot.dataset.reactMounted) {
	createRoot(appRoot).render(
		// The provider wraps the whole app, not just the back office: it is the
		// thing that hears a 401 from any request, so a session that ends
		// mid-shift is noticed wherever the pharmacist happens to be.
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>,
	);
	appRoot.dataset.reactMounted = "true";
}
