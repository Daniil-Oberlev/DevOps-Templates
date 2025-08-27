import os
import subprocess
import shutil

from .config import TEST_TIMEOUT

def run_single_test(test_file):
    """Запустить один тест и вернуть результат"""
    try:
        test_file = os.path.abspath(test_file)

        if not os.path.isfile(test_file):
            raise OSError(f"Тестовый файл не существует: {test_file}")

        bash_path = shutil.which('bash') or shutil.which('bash.exe')
        if not bash_path:
            raise OSError("Команда bash не найдена в PATH")

        test_file_unix = test_file.replace('\\', '/')
        working_dir = os.path.dirname(test_file).replace('\\', '/')

        if not os.path.isdir(working_dir):
            raise OSError(f"Рабочая директория не существует: {working_dir}")

        cmd = [bash_path, test_file_unix]

        result = subprocess.run(
            cmd,
            cwd=working_dir,
            capture_output=True,
            text=True,
            timeout=TEST_TIMEOUT,
            check=False,
            env=os.environ.copy()
        )

        success = result.returncode == 0
        status = "PASS" if success else "FAIL"
        print(f"{status}: {test_file}")
        if not success:
            print(f"Детали ошибки: returncode={result.returncode}, stderr={result.stderr}")

        return {
            'file': test_file,
            'success': success,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }

    except subprocess.TimeoutExpired:
        print(f"ТАЙМАУТ: {test_file}")
        return {
            'file': test_file,
            'success': False,
            'error': 'Timeout'
        }
    except (OSError, subprocess.SubprocessError) as e:
        print(f"ОШИБКА: {test_file} - {e}")
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
        print(f"Запуск теста: {test_file}")
        result = run_single_test(test_file)
        results.append(result)

        if result['success']:
            passed += 1

    return results, passed, total
