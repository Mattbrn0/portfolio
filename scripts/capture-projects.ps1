$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" }

$out = Join-Path $PSScriptRoot "..\public\projects"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$profileDir = Join-Path $env:TEMP "portfolio-capture-v2"
$tmp = Join-Path $env:TEMP "portfolio-capture-raw"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

function Capture($slug, $url, $w, $h) {
  $file = Join-Path $tmp "$slug.png"
  & $chrome --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$profileDir" `
    --window-size=$w,$h --virtual-time-budget=12000 --screenshot="$file" $url 2>$null | Out-Null
  Write-Host "captured $slug $($w)x$h"
  $file
}

Add-Type -AssemblyName System.Drawing

function Crop-CenterTop($src, $dest, $cw, $ch, $offsetY = 0) {
  $img = [System.Drawing.Image]::FromFile($src)
  $x = [Math]::Max(0, [int](($img.Width - $cw) / 2))
  $y = [Math]::Min([Math]::Max(0, $offsetY), [Math]::Max(0, $img.Height - $ch))
  $w = [Math]::Min($cw, $img.Width - $x)
  $h = [Math]::Min($ch, $img.Height - $y)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), $x, $y, $w, $h, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $img.Dispose()
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

# Oryzons: viewport haut pour garder le titre serif, le nav et le CTA — c’est l’identité du site.
$ory = Capture "oryzons" "https://oryzons.com/" 1600 1000
Copy-Item $ory (Join-Path $out "oryzons.png") -Force

# Converter: page très aérée — on recadre sur le bloc utile (titre + dropzone).
$conv = Capture "oryzons-converter" "https://oryzons-converter.fr/" 1440 900
Crop-CenterTop $conv (Join-Path $out "oryzons-converter.png") 1440 780 0

# Les logins nautisme sont déjà parlants, on les rafraîchit simplement.
foreach ($pair in @(
  @("boatflow", "https://app.boatflow.fr/login"),
  @("nautiloc", "https://app.nautiloc.pro/login"),
  @("nautiflow", "https://nautiflow.fr/login")
)) {
  $file = Capture $pair[0] $pair[1] 1440 900
  Copy-Item $file (Join-Path $out "$($pair[0]).png") -Force
}

Write-Output "done"
