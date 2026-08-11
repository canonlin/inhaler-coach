import importlib.util
import tempfile
import unittest
import zipfile
from pathlib import Path


MODULE_PATH = Path(__file__).parents[1] / "training/object-detection/extract_collector.py"
SPEC = importlib.util.spec_from_file_location("extract_collector", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(MODULE)

FILTER_PATH = MODULE_PATH.with_name("filter_pseudolabels.py")
FILTER_SPEC = importlib.util.spec_from_file_location("filter_pseudolabels", FILTER_PATH)
FILTER = importlib.util.module_from_spec(FILTER_SPEC)
assert FILTER_SPEC.loader is not None
FILTER_SPEC.loader.exec_module(FILTER)

ACCEPT_PATH = MODULE_PATH.with_name("accept_candidate.py")
ACCEPT_SPEC = importlib.util.spec_from_file_location("accept_candidate", ACCEPT_PATH)
ACCEPT = importlib.util.module_from_spec(ACCEPT_SPEC)
assert ACCEPT_SPEC.loader is not None
ACCEPT_SPEC.loader.exec_module(ACCEPT)


class LabelledSecondsTest(unittest.TestCase):
	def test_inventory_pairs_json_and_video_across_split_archives(self):
		with tempfile.TemporaryDirectory() as directory:
			first = Path(directory) / "001.zip"
			second = Path(directory) / "002.zip"
			with zipfile.ZipFile(first, "w") as archive:
				archive.writestr("batch/abc12345_recording.webm", b"video")
			with zipfile.ZipFile(second, "w") as archive:
				archive.writestr("batch/abc12345_recording.json", b"{}")
			result = MODULE.inventory([first, second])
			self.assertEqual(set(result), {"abc12345"})
			self.assertEqual(result["abc12345"]["video"], (first, "batch/abc12345_recording.webm"))
			self.assertEqual(result["abc12345"]["json"], (second, "batch/abc12345_recording.json"))

	def test_keeps_only_exact_protocol_labels_and_resolves_boundaries(self):
		payload = {
			"metadata": {"protocol": [{"id": "still"}, {"id": "move"}]},
			"signals": {
				"frames": [
					{"t": 100, "label": "brief_still"},
					{"t": 1100, "label": "still"},
					{"t": 1300, "label": "still"},
					{"t": 1800, "label": "move"},
					{"t": 2200, "label": "after_still"},
					{"t": 3100, "label": "move"},
				],
			},
		}
		self.assertEqual(MODULE.labelled_seconds(payload), {1: ("still", 1300), 3: ("move", 3100)})

	def test_pseudolabel_uses_seed_near_device_not_higher_score_background(self):
		detection = {
			"w": 640,
			"h": 360,
			"boxes": [
				[20, 20, 60, 60, 0.8],
				[280, 120, 360, 300, 0.5],
			],
			"best": None,
		}
		row = {"seed_x": "0.5", "seed_y": "0.58", "seed_source": "yolo", "task": "still"}
		result = FILTER.choose_box(detection, row, 0.18)
		self.assertTrue(result["usable"])
		self.assertEqual(result["boxes"], [[280, 120, 360, 300, 0.5]])
		self.assertEqual(result["label_source"], "dino+yolo")

	def test_uncorroborated_non_negative_frame_is_excluded(self):
		result = FILTER.choose_box(
			{"w": 640, "h": 360, "boxes": [[20, 20, 60, 60, 0.8]]},
			{"seed_x": "", "seed_y": "", "task": "shake_normal"},
			0.18,
		)
		self.assertFalse(result["usable"])
		self.assertEqual(result["label_source"], "excluded")

	def test_quick_collector_frame_is_an_explicit_negative(self):
		result = FILTER.choose_box(
			{"w": 640, "h": 360, "boxes": [[20, 20, 60, 60, 0.8]]},
			{"seed_x": "", "seed_y": "", "task": "negative_no_inhaler"},
			0.18,
		)
		self.assertTrue(result["usable"])
		self.assertEqual(result["boxes"], [])
		self.assertEqual(result["label_source"], "negative")

	def test_candidate_requires_recall_gain_without_new_false_fires(self):
		baseline = {"frame_recall": 0.76, "false_fires": 0}
		improved = ACCEPT.compare_reports(
			baseline,
			{"frame_recall": 0.79, "false_fires": 0},
			0.02,
		)
		regressed_safety = ACCEPT.compare_reports(
			baseline,
			{"frame_recall": 0.90, "false_fires": 1},
			0.02,
		)
		insufficient_gain = ACCEPT.compare_reports(
			baseline,
			{"frame_recall": 0.77, "false_fires": 0},
			0.02,
		)
		self.assertTrue(improved["accepted"])
		self.assertFalse(regressed_safety["accepted"])
		self.assertFalse(insufficient_gain["accepted"])


if __name__ == "__main__":
	unittest.main()
