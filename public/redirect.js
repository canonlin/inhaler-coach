/*
 * The GitHub Pages collector is a project site, so it lives under
 * /inhaler-coach/ and has no API of its own. Anyone who opens it is sent to
 * the deployment that does.
 *
 * This lives in a file rather than inline in index.html because the back
 * office sends a Content-Security-Policy that forbids inline scripts, and a
 * policy that has to be weakened to keep a redirect working is a policy that
 * will be weakened for something else later.
 */
if (window.location.hostname.endsWith("github.io")) {
	window.location.replace(
		"https://inhaler-coach.vercel.app" +
			window.location.pathname.replace(/^\/inhaler-coach/, ""),
	);
}
