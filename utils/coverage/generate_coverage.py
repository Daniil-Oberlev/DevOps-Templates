#!/usr/bin/env python3
import sys

from coverage_tool.badge import save_badge
from coverage_tool.analyzer import analyze_test_coverage, print_results

def main():
    """Основная функция"""
    analysis = analyze_test_coverage()
    print_results(analysis)

    badge_path = save_badge(analysis['coverage'])
    print(f"\n🛡️  Coverage badge updated: {badge_path}")

    return 0

if __name__ == '__main__':
    sys.exit(main())
