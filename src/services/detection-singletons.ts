import { STAGES } from "../config/stages";
import { ActuationDetector } from "../detection/actuation-detector";
import { AudioFeatures } from "../detection/audio-features";
import { DetectionManager } from "../detection/detection-manager";
import { DeviceTracker } from "../detection/device-tracker";
import { InhalerDetector } from "../detection/inhaler-detector";
import { MotionEnergy } from "../detection/motion-energy";
import { RespirationSampler } from "../detection/respiration-sampler";
import { PrimingDetector } from "../steps/step0-priming";
import { ShakeDetector } from "../steps/step1-shake";
import { ExhaleDetector } from "../steps/step2-exhale";
import { PressInhaleDetector } from "../steps/step3-press-inhale";
import { RinseDetector } from "../steps/step4-rinse";

export type SingletonServices = {
	detection: DetectionManager;
	inhalerDetector: InhalerDetector;
	deviceTracker: DeviceTracker;
	motionEnergy: MotionEnergy;
	actuationDet: ActuationDetector;
	respSampler: RespirationSampler;
	audio: AudioFeatures;
	step0: PrimingDetector;
	step1: ShakeDetector;
	step2: ExhaleDetector;
	step3: PressInhaleDetector;
	step4: RinseDetector;
};

let _singletons: SingletonServices | null = null;

export const singletons = new Proxy({} as SingletonServices, {
	get(_target, prop: keyof SingletonServices) {
		if (!_singletons && typeof window !== "undefined") {
			_singletons = {
				detection: new DetectionManager(),
				inhalerDetector: new InhalerDetector(),
				deviceTracker: new DeviceTracker(),
				motionEnergy: new MotionEnergy(),
				actuationDet: new ActuationDetector(),
				respSampler: new RespirationSampler(),
				audio: new AudioFeatures(),
				step0: new PrimingDetector(),
				step1: new ShakeDetector(),
				step2: new ExhaleDetector(),
				step3: new PressInhaleDetector(),
				step4: new RinseDetector(),
			};
		}
		return _singletons ? _singletons[prop] : undefined;
	},
});

export function getStageConfig(idx: number) {
	return STAGES[idx] ?? STAGES[0];
}
