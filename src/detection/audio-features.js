/**
 * Audio feature extraction for inhaler sound events.
 *
 * Why audio at all: pressing the canister moves it a few millimetres, under the
 * fingers that are doing the pressing — close to the worst case for vision. The
 * same event is loud and spectrally distinctive. The literature detects pMDI
 * actuations from high-frequency power with 99.7% accuracy / 100% sensitivity
 * (Sci Rep 2018, doi:10.1038/s41598-018-20523-w), which is far beyond what
 * landmark geometry can offer here.
 *
 * The features are chosen to survive a noisy room (a clinic, or a video playing
 * in the background):
 *
 *   - highBandEnergy — a spray is a broadband hiss with lots of energy above
 *     2 kHz. Speech and music put most of their power below that.
 *   - flatness — spectral flatness (geometric mean / arithmetic mean). Noise-like
 *     sounds (a spray, a breath) approach 1; tonal sounds (voice, music) have a
 *     fundamental plus harmonics and sit far lower. This is what separates a
 *     spray from a loud television, which amplitude alone cannot do.
 */

const FFT_SIZE = 1024;

/** Spray energy lives well above the voice band. */
const HIGH_BAND_HZ = [2000, 8000];

/** Breath is broadband too but lower and slower than a spray. */
const BREATH_BAND_HZ = [300, 2000];

/**
 * Audio is sampled on its own timer, NOT on the video loop.
 *
 * A spray lasts 60–110 ms. The render loop runs at ~27 fps (37 ms/frame), which
 * catches only two or three points of it — enough to see a peak, not enough to
 * measure the duration that separates a spray from a click. At 100 Hz the whole
 * envelope is visible.
 */
const SAMPLE_INTERVAL_MS = 10;

export class AudioFeatures {
	constructor() {
		this.context = null;
		this.analyser = null;
		this.source = null;
		this.spectrum = null;
		this.binHz = 0;
		this.timer = null;
	}

	/** @param {(sound: object, timestamp: number) => void} onSample */
	startSampling(onSample) {
		this.stopSampling();
		this.timer = setInterval(() => {
			const sound = this.sample();
			if (sound) onSample(sound, performance.now());
		}, SAMPLE_INTERVAL_MS);
	}

	stopSampling() {
		if (this.timer) clearInterval(this.timer);
		this.timer = null;
	}

	/** @param {MediaStream} stream - a stream carrying an audio track */
	async initialize(stream) {
		this.context = new AudioContext();
		if (this.context.state === "suspended") {
			await this.context.resume();
		}

		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = FFT_SIZE;
		this.analyser.smoothingTimeConstant = 0; // we do our own smoothing

		this.source = this.context.createMediaStreamSource(stream);
		this.source.connect(this.analyser);

		this.spectrum = new Float32Array(this.analyser.frequencyBinCount);
		this.binHz = this.context.sampleRate / FFT_SIZE;
	}

	get isReady() {
		return this.analyser !== null;
	}

	/**
	 * @returns {{rms:number, highBand:number, breathBand:number, flatness:number}|null}
	 * Energies are mean power in the band (dB-domain values converted to linear).
	 */
	sample() {
		if (!this.analyser) return null;

		this.analyser.getFloatFrequencyData(this.spectrum);

		const binOf = (hz) =>
			Math.min(this.spectrum.length - 1, Math.round(hz / this.binHz));

		let total = 0;
		let high = 0;
		let highCount = 0;
		let breath = 0;
		let breathCount = 0;
		let logSum = 0;
		let counted = 0;

		const highLo = binOf(HIGH_BAND_HZ[0]);
		const highHi = binOf(HIGH_BAND_HZ[1]);
		const breathLo = binOf(BREATH_BAND_HZ[0]);
		const breathHi = binOf(BREATH_BAND_HZ[1]);

		for (let i = 1; i < this.spectrum.length; i++) {
			// getFloatFrequencyData is in dBFS; back to linear power.
			const power = 10 ** (this.spectrum[i] / 10);
			total += power;

			if (i >= highLo && i <= highHi) {
				high += power;
				highCount++;
			}
			if (i >= breathLo && i <= breathHi) {
				breath += power;
				breathCount++;
			}

			// Spectral flatness over the whole band. Floor the power so a silent
			// bin can't drag the geometric mean to zero.
			const floored = Math.max(power, 1e-12);
			logSum += Math.log(floored);
			counted++;
		}

		const arithmeticMean = total / counted;
		const geometricMean = Math.exp(logSum / counted);

		return {
			rms: Math.sqrt(arithmeticMean),
			highBand: highCount ? high / highCount : 0,
			breathBand: breathCount ? breath / breathCount : 0,
			flatness: arithmeticMean > 0 ? geometricMean / arithmeticMean : 0,
		};
	}

	destroy() {
		this.stopSampling();
		this.source?.disconnect();
		this.context?.close();
		this.context = null;
		this.analyser = null;
		this.source = null;
	}
}
