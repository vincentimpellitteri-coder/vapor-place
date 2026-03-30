@echo off
cd /d C:\Users\Vin\OneDrive\vapor-place
start "" http://127.0.0.1:8080/home.html
python -m http.server 8080
pause
