let cvReady = false;
let loadPromise = null;

export function loadOpenCV() {
	if (cvReady) return Promise.resolve(window.cv);
	if (loadPromise) return loadPromise;

	loadPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://docs.opencv.org/4.x/opencv.js";
		script.async = true;

		script.onload = () => {
			if (window.cv) {
				window.cv.onRuntimeInitialized = () => {
					cvReady = true;
					resolve(window.cv);
				};
			} else {
				cvReady = true;
				resolve(window.cv);
			}
		};

		script.onerror = () => {
			loadPromise = null;
			reject(new Error("Failed to load OpenCV.js"));
		};

		document.head.appendChild(script);
	});

	return loadPromise;
}

export function isOpenCVReady() {
	return cvReady;
}
