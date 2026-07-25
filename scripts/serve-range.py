#!/usr/bin/env python3
"""static file server with proper HTTP Range support + request logging.
python's stock http.server can't do ranges (breaks audio seeking), and
WEBrick serves mp3s as application/octet-stream. this one does both right
and logs every request (with its Range header) so seek behavior is visible.

usage: python3 serve-range.py [port] [dir] [logfile]
"""
import datetime
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

LOG_PATH = None

def log_line(msg):
    stamp = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-3]
    line = f'{stamp} {msg}'
    print(line, flush=True)
    if LOG_PATH:
        with open(LOG_PATH, 'a') as f:
            f.write(line + '\n')

class RangeHandler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.mp3': 'audio/mpeg',
        '.json': 'application/json',
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
    }

    def log_message(self, fmt, *args):  # quiet the default logger
        pass

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')  # dev server: always revalidate
        super().end_headers()

    def send_head(self):
        rng = self.headers.get('Range')
        path = self.translate_path(self.path)
        if rng is None or os.path.isdir(path):
            log_line(f'{self.path} (full) -> 200')
            return super().send_head()

        m = re.match(r'bytes=(\d*)-(\d*)$', rng.strip())
        if not m or (not m.group(1) and not m.group(2)):
            log_line(f'{self.path} range={rng!r} unparseable -> 200')
            return super().send_head()
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, 'File not found')
            return None
        size = os.fstat(f.fileno()).st_size
        if m.group(1):
            start = int(m.group(1))
            end = int(m.group(2)) if m.group(2) else size - 1
        else:  # suffix form bytes=-N: the last N bytes
            start = max(0, size - int(m.group(2)))
            end = size - 1
        end = min(end, size - 1)
        if start >= size or start > end:
            f.close()
            log_line(f'{self.path} range={rng!r} -> 416 (size {size})')
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        log_line(f'{self.path} range={rng!r} -> 206 [{start}-{end}/{size}]')
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        f.seek(start)
        return _Bounded(f, end - start + 1)

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            log_line(f'{self.path} client closed connection mid-body')

class _Bounded:
    """file-like wrapper that stops reading after `remaining` bytes."""
    def __init__(self, f, remaining):
        self.f = f
        self.remaining = remaining
    def read(self, n=-1):
        if self.remaining <= 0:
            return b''
        n = self.remaining if n < 0 else min(n, self.remaining)
        data = self.f.read(n)
        self.remaining -= len(data)
        return data
    def close(self):
        self.f.close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8140
    if len(sys.argv) > 2:
        os.chdir(sys.argv[2])
    if len(sys.argv) > 3:
        LOG_PATH = sys.argv[3]
    log_line(f'serving {os.getcwd()} on http://localhost:{port}/')
    ThreadingHTTPServer(('', port), RangeHandler).serve_forever()
