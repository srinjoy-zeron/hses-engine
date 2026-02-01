import unittest
from utils.normalize import normalize, X_MIN, X_MAX


class TestNormalize(unittest.TestCase):
    
    def setUp(self):
        """Reset global min/max before each test"""
        # Reset to original values
        self.original_min = X_MIN.copy()
        self.original_max = X_MAX.copy()

        X_MIN.clear()
        X_MIN.update(self.original_min)

        X_MAX.clear()
        X_MAX.update(self.original_max)

    def test_single_signal_min_value(self):
        """Test normalization at exact minimum"""
        data = {
            "warning_dismiss_time_ms": X_MIN["warning_dismiss_time_ms"]
        }
        result = normalize(data)

        self.assertEqual(result["warning_dismiss_time_ms"], 0.0)

    def test_single_signal_max_value(self):
        """Test normalization at exact maximum"""
        data = {
            "warning_dismiss_time_ms": X_MAX["warning_dismiss_time_ms"]
        }
        result = normalize(data)

        self.assertEqual(result["warning_dismiss_time_ms"], 1.0)

    def test_single_signal_mid_value(self):
        """Test normalization for mid-range value"""
        min_v = X_MIN["typing_speed_characters_per_minute"]
        max_v = X_MAX["typing_speed_characters_per_minute"]
        mid = (min_v + max_v) / 2

        data = {
            "typing_speed_characters_per_minute": mid
        }
        result = normalize(data)

        self.assertAlmostEqual(result["typing_speed_characters_per_minute"], 0.5)

    def test_multiple_signals(self):
        """Test normalization with multiple valid signals"""
        data = {
            "focus_loss_event_count": 10,
            "window_switches_per_minute": 15,
            "active_application_count": 10,
        }
        result = normalize(data)

        self.assertTrue(0.0 <= result["focus_loss_event_count"] <= 1.0)
        self.assertTrue(0.0 <= result["window_switches_per_minute"] <= 1.0)
        self.assertTrue(0.0 <= result["active_application_count"] <= 1.0)

    def test_updates_min_value(self):
        """Test that X_MIN updates when lower value is seen"""
        data = {
            "decision_latency_ms": X_MIN["decision_latency_ms"] - 50
        }
        normalize(data)

        self.assertEqual(
            X_MIN["decision_latency_ms"],
            self.original_min["decision_latency_ms"] - 50
        )

    def test_updates_max_value(self):
        """Test that X_MAX updates when higher value is seen"""
        data = {
            "decision_latency_ms": X_MAX["decision_latency_ms"] + 100
        }
        normalize(data)

        self.assertEqual(
            X_MAX["decision_latency_ms"],
            self.original_max["decision_latency_ms"] + 100
        )

    def test_ignores_unknown_signal(self):
        """Test unknown signal is ignored"""
        data = {
            "unknown_signal_xyz": 123
        }
        result = normalize(data)

        self.assertEqual(result["unknown_signal_xyz"], 123)


if __name__ == '__main__':
    unittest.main()
