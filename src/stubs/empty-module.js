/**
 * Stand-in for the @mediapipe/* solution bundles (face_mesh, hands, pose,
 * selfie_segmentation).
 *
 * The @tensorflow-models/* packages import their MediaPipe runtime at module
 * scope even when you only ever construct the 'tfjs' runtime. That code touches
 * `document` on load, which throws inside a Web Worker — so the models can't be
 * imported off the main thread at all unless it's stubbed out.
 *
 * The importers pull named classes (`import {Hands} from '@mediapipe/hands'`),
 * so the names have to exist even though nothing ever constructs them. Any of
 * these being called means something asked for runtime: 'mediapipe', which this
 * project never does — hence the throw rather than a silent no-op.
 *
 * Aliased in vite.config.js. See docs/implementation-plan-v3.md.
 */

const unavailable = (name) => {
	throw new Error(
		`${name} (@mediapipe solution bundle) is stubbed out — this project only uses runtime: 'tfjs'. See src/stubs/empty-module.js.`,
	);
};

export class FaceMesh {
	constructor() {
		unavailable("FaceMesh");
	}
}

export class Hands {
	constructor() {
		unavailable("Hands");
	}
}

export class Pose {
	constructor() {
		unavailable("Pose");
	}
}

export class FaceDetection {
	constructor() {
		unavailable("FaceDetection");
	}
}

export class SelfieSegmentation {
	constructor() {
		unavailable("SelfieSegmentation");
	}
}

export default {};
