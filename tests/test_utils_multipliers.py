import unittest
from datetime import datetime
from utils.multiplier import time_of_day_multiplier , session_length_multiplier , noise_environment_multiplier


class TestTimeOfDayMultiplier(unittest.TestCase):
    
    def test_none_input(self):
        """Test that None input returns 1.0"""
        result = time_of_day_multiplier(None)
        self.assertEqual(result, 1.0)

    def test_morning_start_boundary(self):
        """Test exactly 7:00 AM (start of 7am–1pm range)"""
        result = time_of_day_multiplier("07:00")
        self.assertEqual(result, 0.8)

    def test_morning_end_boundary(self):
        """Test exactly 12:59 PM (end of 7am–1pm range)"""
        result = time_of_day_multiplier("12:59")
        self.assertEqual(result, 0.8)

    def test_afternoon_start_boundary(self):
        """Test exactly 1:00 PM (start of 1pm–4pm range)"""
        result = time_of_day_multiplier("13:00")
        self.assertEqual(result, 1.15)

    def test_afternoon_end_boundary(self):
        """Test exactly 3:59 PM (end of 1pm–4pm range)"""
        result = time_of_day_multiplier("15:59")
        self.assertEqual(result, 1.15)

    def test_evening_start_boundary(self):
        """Test exactly 4:00 PM (start of 4pm–9pm range)"""
        result = time_of_day_multiplier("16:00")
        self.assertEqual(result, 1.05)

    def test_evening_end_boundary(self):
        """Test exactly 8:59 PM (end of 4pm–9pm range)"""
        result = time_of_day_multiplier("20:59")
        self.assertEqual(result, 1.05)

    def test_night_start_boundary(self):
        """Test exactly 9:00 PM (start of late night range)"""
        result = time_of_day_multiplier("21:00")
        self.assertAlmostEqual(result, 1.05)

    def test_late_night_before_midnight(self):
        """Test late night time before midnight"""
        result = time_of_day_multiplier("23:30")
        self.assertTrue(1.05 < result <= 1.3)

    def test_late_night_after_midnight(self):
        """Test late night time after midnight"""
        result = time_of_day_multiplier("02:00")
        self.assertTrue(1.05 < result <= 1.3)

    def test_late_night_cap(self):
        """Test that late night multiplier does not exceed cap"""
        result = time_of_day_multiplier("05:59")
        self.assertLessEqual(result, 1.3)


class TestSessionLengthMultiplier(unittest.TestCase):
    
    def test_none_input(self):
        """Test that None input returns 1.0"""
        result = session_length_multiplier(None)
        self.assertEqual(result, 1.0)

    def test_short_session_lower_bound(self):
        """Test very short session"""
        result = session_length_multiplier(0)
        self.assertEqual(result, 0.8)

    def test_short_session_upper_bound(self):
        """Test exactly 50 minutes"""
        result = session_length_multiplier(50)
        self.assertEqual(result, 0.8)

    def test_medium_session_lower_bound(self):
        """Test start of medium session range"""
        result = session_length_multiplier(51)
        self.assertEqual(result, 1.0)

    def test_medium_session_upper_bound(self):
        """Test exactly 90 minutes"""
        result = session_length_multiplier(90)
        self.assertEqual(result, 1.0)

    def test_long_session_start(self):
        """Test start of long session exponential range"""
        result = session_length_multiplier(91)
        self.assertGreater(result, 1.0)

    def test_long_session_exponential_growth(self):
        """Test that multiplier increases with session length"""
        result1 = session_length_multiplier(120)
        result2 = session_length_multiplier(200)
        self.assertGreater(result2, result1)

    def test_long_session_cap(self):
        """Test that multiplier does not exceed cap"""
        result = session_length_multiplier(2000)
        self.assertLessEqual(result, 1.25)


class TestNoiseEnvironmentMultiplier(unittest.TestCase):
    
    def test_none_noise_score(self):
        """Test None noise score defaults to 0"""
        result = noise_environment_multiplier(None, "SOL")
        self.assertIsNotNone(result)

    def test_zero_noise_score(self):
        """Test zero noise score"""
        result = noise_environment_multiplier(0, "SOL")
        self.assertIsNotNone(result)

    def test_noise_score_below_threshold(self):
        """Test noise score below scaling threshold (<= 76)"""
        result = noise_environment_multiplier(70, "OFE")
        self.assertIsNotNone(result)

    def test_noise_score_above_threshold(self):
        """Test noise score above scaling threshold"""
        result = noise_environment_multiplier(90, "OFE")
        self.assertGreater(result, 1.0)

    def test_noise_score_upper_cap(self):
        """Test noise score capped at 130"""
        result1 = noise_environment_multiplier(130, "OFE")
        result2 = noise_environment_multiplier(200, "offcie")
        self.assertEqual(result1, result2)

    def test_different_environment_factors(self):
        """Test different environmental factors affect result"""
        result1 = noise_environment_multiplier(80, "SOL")
        result2 = noise_environment_multiplier(80, "HSE")
        self.assertNotEqual(result1, result2)


if __name__ == '__main__':
    unittest.main()
