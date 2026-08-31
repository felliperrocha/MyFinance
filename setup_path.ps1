$nodeDir = "C:\Users\pedro\AppData\Local\Programs\nodejs"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*nodejs*") {
    $newPath = "$currentPath;$nodeDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Node.js adicionado ao PATH do Usuário com sucesso!"
} else {
    Write-Host "Node.js já está no PATH do Usuário."
}
