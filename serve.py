#!/usr/bin/env python3
"""Local dev server that never caches, so edits show up on a normal refresh.

Usage:  python3 serve.py            (http://localhost:8000)
        python3 serve.py 8080
"""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


# threaded: a browser's idle pre-opened connection must not block other requests
with http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Serving on http://localhost:{PORT} (no cache)")
    httpd.serve_forever()
