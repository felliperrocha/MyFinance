$env:PATH = "C:\Users\pedro\AppData\Local\Programs\nodejs;C:\Users\pedro\AppData\Local\Programs\MinGit\cmd;C:\Users\pedro\AppData\Local\Programs\MinGit\bin;" + $env:PATH

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   MyFinance — Enviando para o GitHub (main)     " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$gitExe = "C:\Users\pedro\AppData\Local\Programs\MinGit\cmd\git.exe"

if (Test-Path $gitExe) {
    & $gitExe push -u origin main --force
} else {
    Write-Error "Git não foi localizado em $gitExe"
}
