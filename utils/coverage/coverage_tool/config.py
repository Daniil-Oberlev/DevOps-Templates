from pathlib import Path

# Исключённые папки
EXCLUDE_DIRS = {'.git', '.github', '.vscode'}
CONTAINER_DIRS = {'tools', 'utils', 'coverage'}

# Файлы проектов
DOCKER_FILES = {'Dockerfile'}
NGINX_FILES = {'nginx.conf'}
SCRIPTS_FILES = {'.sh'}
GENERAL_FILES = {'Dockerfile', 'nginx.conf'}

# Badge
BADGE_WIDTH = 125
BADGE_HEIGHT = 20
BADGE_DIR = Path('utils/coverage')
BADGE_FILENAME = 'coverage-badge.svg'

# Цвета
COLOR_BRIGHTGREEN = "#4c1"
COLOR_GREEN = "#97ca00"
COLOR_YELLOWGREEN = "#a4a61d"
COLOR_YELLOW = "#dfb317"
COLOR_ORANGE = "#fe7d37"
COLOR_RED = "#e05d44"
COLOR_GREY = "#555"

# Прочее
TEST_TIMEOUT = 300
