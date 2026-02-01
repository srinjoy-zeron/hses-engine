import unittest
import sys
import os

if __name__ == "__main__":
    start_dir = os.path.dirname(__file__)
    suite = unittest.defaultTestLoader.discover(
        start_dir=start_dir,
        pattern="test_*.py"
    )
    result = unittest.TextTestRunner(verbosity=2).run(suite)

    print("\n===== Test Metrics =====")
    print(f"Total tests run     : {result.testsRun}")
    print(f"Failures            : {len(result.failures)}")
    print(f"Errors              : {len(result.errors)}")
    print(f"Skipped             : {len(result.skipped)}")
    print(f"Expected failures   : {len(result.expectedFailures)}")
    print(f"Unexpected successes: {len(result.unexpectedSuccesses)}")

    sys.exit(not result.wasSuccessful())


