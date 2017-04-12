import os
import os.path
from urllib.parse import unquote
from flask import Flask, Response, request, send_file
from argparse import ArgumentParser


app = Flask(__name__)


@app.route('/<path:path>', methods=['POST'])
def catch(path):
    dest = os.path.join(app.config['BASE_DIR'], path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w') as f:
        f.write(unquote(request.form['data']))
    return send_file('nothing.html')


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('base_dir', metavar='BASE_DIR', nargs='?', default='.')
    args = parser.parse_args()
    app.config['BASE_DIR'] = args.base_dir
    app.run(port=13337)
