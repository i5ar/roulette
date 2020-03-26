from pathlib import Path
from shutil import copy, copytree, rmtree, ignore_patterns

back_end = input('please, insert back-end directory root: ')
back_end_path = Path(back_end)

# Copy roulette-front/static/ to roulette-back/static/
static_path = Path('static')
rmtree(back_end_path / "static", ignore_errors=True)
copytree(static_path, back_end_path / "static", ignore=ignore_patterns('*.pyc'))

# Copy roulette-front/index.html to roulette-back/templates/index.html
index_path = Path('index.html')
copy(index_path, back_end_path / "templates")
