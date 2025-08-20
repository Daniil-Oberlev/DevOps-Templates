#!/usr/bin/env python3
import os
import sys
import subprocess
from pathlib import Path

# Константы для конфигурации
CONTAINER_DIRS = {'tools', 'utils', 'coverage'}
EXCLUDE_DIRS = {'.git', '.github', '.vscode'}
TEST_TIMEOUT = 300
BADGE_WIDTH = 125
BADGE_HEIGHT = 20
BADGE_DIR = Path('utils/coverage')
BADGE_FILENAME = 'coverage-badge.svg'

# Цвета для badge в RGB
COLOR_BRIGHTGREEN = "#4c1"
COLOR_GREEN = "#97ca00"
COLOR_YELLOWGREEN = "#a4a61d"
COLOR_YELLOW = "#dfb317"
COLOR_ORANGE = "#fe7d37"
COLOR_RED = "#e05d44"
COLOR_GREY = "#555"

# Целевые файлы для разных типов проектов
DOCKER_FILES = {'Dockerfile'}
NGINX_FILES = {'nginx.conf'}
SCRIPTS_FILES = {'.sh'}
GENERAL_FILES = {'Dockerfile', 'nginx.conf'}

def is_project_directory(dir_path):
    """Определить, является ли директория проектной (должна содержать тесты)"""
    if dir_path.name in CONTAINER_DIRS:
        return False

    target_files = set()

    if 'docker' in dir_path.parts:
        target_files.update(DOCKER_FILES)
        for file in dir_path.iterdir():
            if file.is_file() and file.name.startswith('Dockerfile.'):
                target_files.add(file.name)

    elif 'nginx' in dir_path.parts:
        target_files.update(NGINX_FILES)

    elif 'scripts' in dir_path.parts:
        for file in dir_path.iterdir():
            if file.is_file() and file.suffix in SCRIPTS_FILES and file.name != 'test.sh':
                target_files.add(file.name)

    else:
        target_files.update(GENERAL_FILES)

    for file in dir_path.iterdir():
        if file.is_file() and file.name in target_files:
            return True

    has_subdirs = any(subdir.is_dir() for subdir in dir_path.iterdir())
    has_files = any(file.is_file() and file.name != 'test.sh' for file in dir_path.iterdir())

    return not has_subdirs and has_files

def find_all_directories_without_tests(base_dirs=None):
    """Найти все проектные директории без test.sh"""
    if base_dirs is None:
        base_dirs = ['.']

    directories_without_tests = []
    directories_with_tests = set()

    test_files = find_all_test_files(base_dirs)
    for test_file in test_files:
        test_dir = Path(test_file).parent
        directories_with_tests.add(str(test_dir))

    for base_dir in base_dirs:
        base_path = Path(base_dir)
        if base_path.exists():
            for dir_path in base_path.rglob('*'):
                if dir_path.is_dir():
                    if any(excluded in dir_path.parts for excluded in EXCLUDE_DIRS):
                        continue

                    dir_str = str(dir_path)
                    if dir_str in directories_with_tests:
                        continue

                    parent_has_tests = any(
                        str(parent) in directories_with_tests for parent in dir_path.parents
                    )
                    if parent_has_tests:
                        continue

                    if is_project_directory(dir_path):
                        directories_without_tests.append(dir_str)

    return sorted(directories_without_tests)

def find_all_test_files(base_dirs=None):
    """Найти все test.sh файлы рекурсивно"""
    if base_dirs is None:
        base_dirs = ['.']

    test_files = []

    for base_dir in base_dirs:
        base_path = Path(base_dir)
        if base_path.exists():
            for test_file in base_path.rglob('test.sh'):
                if any(excluded in test_file.parts for excluded in EXCLUDE_DIRS):
                    continue
                test_files.append(str(test_file))

    return test_files

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
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_file}")

        return {
            'file': test_file,
            'success': success,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }

    except subprocess.TimeoutExpired:
        print(f"⏰ TIMEOUT: {test_file}")
        return {
            'file': test_file,
            'success': False,
            'error': 'Timeout'
        }
    except (OSError, subprocess.SubprocessError) as e:
        print(f"🚫 ERROR: {test_file} - {e}")
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

def calculate_coverage(passed, total):
    """Рассчитать процент покрытия тестами"""
    if total == 0:
        return 0.0
    return round((passed / total) * 100, 2)

def get_coverage_color(coverage):
    """Получить RGB цвет в зависимости от покрытия"""
    if coverage >= 90:
        return COLOR_BRIGHTGREEN
    elif coverage >= 80:
        return COLOR_GREEN
    elif coverage >= 70:
        return COLOR_YELLOWGREEN
    elif coverage >= 60:
        return COLOR_YELLOW
    elif coverage >= 50:
        return COLOR_ORANGE
    else:
        return COLOR_RED

def generate_badge(coverage):
    """Сгенерировать SVG badge с процентом покрытия"""
    color = get_coverage_color(coverage)

    badge_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{BADGE_WIDTH}" height="{BADGE_HEIGHT}">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width="{BADGE_WIDTH}" height="{BADGE_HEIGHT}" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="{COLOR_GREY}" d="M0 0h67v20H0z"/>
    <path fill="{color}" d="M67 0h58v20H67z"/>
    <path fill="url(#b)" d="M0 0h125v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="33.5" y="15" fill="#010101" fill-opacity=".3">tests</text>
    <text x="33.5" y="14">tests</text>
    <text x="95.5" y="15" fill="#010101" fill-opacity=".3">{coverage}%</text>
    <text x="95.5" y="14">{coverage}%</text>
  </g>
</svg>'''

    return badge_svg

def analyze_test_coverage():
    """Выполнить полный анализ покрытия тестами"""
    print("🔍 Analyzing test coverage...")

    test_files = find_all_test_files()
    total_tests = len(test_files)

    directories_without_tests = find_all_directories_without_tests()

    passed = 0
    coverage = 0.0
    results = []

    if test_files:
        print(f"📋 Found {total_tests} test files:")
        for test_file in test_files:
            print(f"   - {test_file}")

        print("\n🚀 Running tests...")
        results, passed, total_tests = run_tests(test_files)
        coverage = calculate_coverage(passed, total_tests)

    return {
        'coverage': coverage,
        'passed': passed,
        'total_tests': total_tests,
        'test_files': test_files,
        'directories_without_tests': directories_without_tests,
        'results': results
    }

def print_results(analysis):
    """Вывести результаты анализа"""
    print(f"\n📊 Test Coverage: {analysis['coverage']}% ({analysis['passed']}/{analysis['total_tests']})")

    if analysis['directories_without_tests']:
        print(f"\n⚠️  Directories without tests ({len(analysis['directories_without_tests'])}):")
        for directory in analysis['directories_without_tests']:
            print(f"   - {directory}")
    else:
        print("\n🎉 All project directories have tests!")

def save_badge(coverage):
    """Сохранить badge в файл"""
    BADGE_DIR.mkdir(exist_ok=True, parents=True)

    badge = generate_badge(coverage)
    badge_path = BADGE_DIR / BADGE_FILENAME

    with open(badge_path, 'w', encoding='utf-8') as f:
        f.write(badge)

    return badge_path

def main():
    """Основная функция"""
    analysis = analyze_test_coverage()
    print_results(analysis)

    badge_path = save_badge(analysis['coverage'])
    print(f"\n🛡️  Coverage badge updated: {badge_path}")

    return 0

if __name__ == '__main__':
    sys.exit(main())
