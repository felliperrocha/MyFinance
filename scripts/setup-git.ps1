$ErrorActionPreference = "Stop"

$destDir = "C:\Users\pedro\AppData\Local\Programs\MinGit"
$tempZip = "$env:TEMP\mingit.zip"
$downloadUrl = "https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip"

Write-Host "Creating directory: $destDir"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

Write-Host "Downloading MinGit from $downloadUrl..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZip -UseBasicParsing

Write-Host "Extracting MinGit to $destDir..."
Expand-Archive -Path $tempZip -DestinationPath $destDir -Force

Write-Host "Cleaning up temp file..."
Remove-Item -Path $tempZip -Force

$gitExe = "$destDir\cmd\git.exe"
if (Test-Path $gitExe) {
    Write-Host "MinGit successfully installed at: $gitExe"
    & $gitExe --version
    
    # Add to User PATH
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$destDir\cmd*") {
        $newPath = "$destDir\cmd;$destDir\bin;$userPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added MinGit to User PATH."
    }
} else {
    Write-Error "Git executable not found at $gitExe"
}
