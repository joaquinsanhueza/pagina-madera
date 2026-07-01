# Convierte todos los .MOV de la carpeta vid/ a .mp4 compatible con todos los navegadores
$vidDir = "vid"
$movFiles = Get-ChildItem -Path $vidDir -Filter "*.MOV"

foreach ($file in $movFiles) {
    $input  = $file.FullName
    $output = Join-Path $vidDir ($file.BaseName + ".mp4")
    Write-Host "Convirtiendo: $($file.Name) -> $($file.BaseName).mp4"
    ffmpeg -i $input -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart -y $output
    if (Test-Path $output) { Write-Host "OK: $($file.BaseName).mp4" -ForegroundColor Green }
}
Write-Host "Listo!" -ForegroundColor Green
