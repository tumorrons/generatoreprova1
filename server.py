#!/usr/bin/env python3
"""
Universal Project Builder - Local HTTP Server
Risolve problemi CORS per moduli ES6
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("🚀 Universal Project Builder v2.0")
    print("=" * 50)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"📡 Server avviato su: http://localhost:{PORT}")
        print(f"📱 Apri il browser su: http://localhost:{PORT}")
        print(f"⏹️  Premi Ctrl+C per fermare il server")
        print("=" * 50)
        
        try:
            webbrowser.open(f'http://localhost:{PORT}')
            print("🌐 Browser aperto automaticamente")
        except:
            print("⚠️  Apri manualmente il browser")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server fermato")
            httpd.shutdown()