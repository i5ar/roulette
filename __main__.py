from pathlib import Path
import argparse
from shutil import copy, copytree, ignore_patterns


def main():
    # https://docs.python.org/3/library/argparse.html
    parser = argparse.ArgumentParser(description='Copy static folder and html')
    parser.add_argument(
        '-p',
        '--path',
        type=Path,
        required=True,
        help='back-end directory root')
    args = parser.parse_args()

    # back_end = input('please, insert back-end directory root: ')
    # back_end_path = Path(back_end)
    back_end_path = args.path

    # NOTE: Copy roulette-front/static/ to roulette-back/static/
    static_path = Path('static')
    print('Copying "static/"')
    copytree(
        static_path,
        back_end_path / "static",
        ignore=ignore_patterns('*.pyc'),
        copy_function=copy,
        dirs_exist_ok=True)

    # NOTE: Copy roulette-front/index.html to roulette-back/templates/index.html
    index_path = Path('index.html')
    print('Copying "index.html"')
    copy(index_path, back_end_path / "templates")
    print('Done')


if __name__ == "__main__":
    main()
