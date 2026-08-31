@echo off
set "PATH=C:\Users\pedro\AppData\Local\Programs\nodejs;C:\Users\pedro\AppData\Local\Programs\MinGit\cmd;C:\Users\pedro\AppData\Local\Programs\MinGit\bin;%PATH%"
echo ==================================================
echo    MyFinance — Enviando para o GitHub (main)
echo ==================================================
git push -u origin main --force
pause
