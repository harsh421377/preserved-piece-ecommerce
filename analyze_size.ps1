# Find largest files (excluding node_modules, .git, .next)
Write-Host "=== TOP 30 LARGEST FILES ==="
Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\\.next\\' } |
  Sort-Object Length -Descending |
  Select-Object -First 30 @{N='SizeKB';E={[math]::Round($_.Length/1KB,2)}}, FullName |
  Format-Table -AutoSize

Write-Host "`n=== DIRECTORY SIZES ==="
Get-ChildItem -Directory -ErrorAction SilentlyContinue | ForEach-Object {
  $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
  [PSCustomObject]@{Name=$_.Name; SizeMB=[math]::Round($size/1MB,2)}
} | Sort-Object SizeMB -Descending | Format-Table -AutoSize

Write-Host "`n=== PUBLIC FOLDER CONTENTS ==="
Get-ChildItem -Path "public" -Recurse -File -ErrorAction SilentlyContinue |
  Sort-Object Length -Descending |
  Select-Object @{N='SizeKB';E={[math]::Round($_.Length/1KB,2)}}, FullName |
  Format-Table -AutoSize
