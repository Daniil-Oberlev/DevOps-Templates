import os
import subprocess

from .config import TEST_TIMEOUT

def run_single_test(test_file):
    """Запустить один тест и вернуть результат"""
    try:
        result = subprocess.run(
            ['bash', test_file],
            cwd=os.path.dirname(test_file),
            capture_output=True,
            text=True,
            timeout=TEST_TIMEOUT,
            check=False
        )

        success = result.returncode == 0
        status = "PASS" if success else "FAIL"
        print(f"{status}: {test_file}")

        return {
            'file': test_file,
            'success': success,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }

    except subprocess.TimeoutExpired:
        print(f"TIMEOUT: {test_file}")
        return {
            'file': test_file,
            'success': False,
            'error': 'Timeout'
        }
    except (OSError, subprocess.SubprocessError) as e:
        print(f"ERROR: {test_file} - {e}")
        return {
            'file': test_file,
            'success': False,
            'error': str(e)
        }

def run_tests(test_files):
    """Запустить все тесты и собрать результаты"""
    results = []
    total = len(test_files)
    passed = 0

    for test_file in test_files:
        print(f"Running test: {test_file}")
        result = run_single_test(test_file)
        results.append(result)

        if result['success']:
            passed += 1

    return results, passed, total
