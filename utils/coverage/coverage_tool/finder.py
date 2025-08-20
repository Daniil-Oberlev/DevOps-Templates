from pathlib import Path

from .config import (
    CONTAINER_DIRS,
    DOCKER_FILES,
    NGINX_FILES,
    SCRIPTS_FILES,
    GENERAL_FILES,
    EXCLUDE_DIRS
)

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
