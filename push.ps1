$gitExe = (Get-Command git).Source
if (-not $gitExe) {
    $gitExe = "git"
}

Write-Host "Realizando commit e push automático..." -ForegroundColor Cyan
& $gitExe add .
$status = & $gitExe status --porcelain
if ($status) {
    & $gitExe commit -m "chore: auto-sync updates"
}
& $gitExe push origin main
Write-Host "Concluído com sucesso!" -ForegroundColor Green
