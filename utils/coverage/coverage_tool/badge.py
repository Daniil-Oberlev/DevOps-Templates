from .config import (
    COLOR_BRIGHTGREEN,
    COLOR_GREEN,
    COLOR_YELLOWGREEN,
    COLOR_YELLOW,
    COLOR_ORANGE,
    COLOR_GREY,
    COLOR_RED,
    BADGE_WIDTH,
    BADGE_HEIGHT,
    BADGE_FILENAME,
    BADGE_DIR
)

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

def save_badge(coverage):
    """Сохранить badge в файл"""
    BADGE_DIR.mkdir(exist_ok=True, parents=True)

    badge = generate_badge(coverage)
    badge_path = BADGE_DIR / BADGE_FILENAME

    with open(badge_path, 'w', encoding='utf-8') as f:
        f.write(badge)

    return badge_path
