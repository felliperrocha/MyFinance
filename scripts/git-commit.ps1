$git = "C:\Users\pedro\AppData\Local\Programs\MinGit\cmd\git.exe"

Write-Host "Configuring user..."
& $git config user.name "felliperrocha"
& $git config user.email "felliperrocha@users.noreply.github.com"

Write-Host "Adding files..."
& $git add .

Write-Host "Committing..."
& $git commit -m "feat: initial release of MyFinance platform with Neon PostgreSQL, Auth and Dark Mode"

Write-Host "Renaming branch to main..."
& $git branch -M main

Write-Host "Setting remote origin..."
& $git remote remove origin 2>$null
& $git remote add origin https://github.com/felliperrocha/MyFinance.git

Write-Host "Checking git log..."
& $git log -n 1 --stat
