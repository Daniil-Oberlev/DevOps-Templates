from .finder import find_all_test_files, find_all_directories_without_tests
from .runner import run_tests
from .badge import calculate_coverage

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
