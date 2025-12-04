@echo off
echo Mulai server FastAPI...

REM Ganti path ini sesuai lokasi venv kamu (lihat folder venv\Scripts)
"C:\Users\Pongo\Desktop\MateriASAH\venv\Scripts\python.exe" -m uvicorn main:app --reload --port 8000

echo.
echo Server berjalan di http://127.0.0.1:8000/docs
echo Tekan Ctrl+C untuk matikan
pause