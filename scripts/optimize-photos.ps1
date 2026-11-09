# Creates optimized web copies of the original photos (originals are never modified).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/optimize-photos.ps1
param(
  [string]$Source = "Media untuk website HBD Chagiya",
  [string]$Dest = "public/assets/photos",
  [string]$VideoDest = "public/assets/videos",
  [int]$MaxSide = 1400,
  [long]$Quality = 84
)
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
New-Item -ItemType Directory -Force -Path $Dest, $VideoDest | Out-Null

# Natural sort (numbers compared numerically)
function NatKey([string]$s) { [regex]::Replace($s, '\d+', { param($m) $m.Value.PadLeft(10, '0') }) }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $Quality

$photos = Get-ChildItem -Path $Source -File | Where-Object { $_.Extension -match '\.(jpe?g|png|webp)$' } | Sort-Object { NatKey $_.Name }
$i = 0
foreach ($f in $photos) {
  $i++
  $name = "photo-{0:D2}.jpg" -f $i
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $scale = [Math]::Min(1.0, $MaxSide / [Math]::Max($img.Width, $img.Height))
  $w = [int]($img.Width * $scale); $h = [int]($img.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save((Join-Path $root "$Dest/$name"), $codec, $params)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Output "$name <= $($f.Name) ($w x $h)"
}

$videos = Get-ChildItem -Path $Source -File | Where-Object { $_.Extension -match '\.(mp4|mov|webm)$' } | Sort-Object { NatKey $_.Name }
$j = 0
foreach ($v in $videos) {
  $j++
  $name = "video-{0:D2}{1}" -f $j, $v.Extension.ToLower()
  Copy-Item $v.FullName (Join-Path $VideoDest $name) -Force
  Write-Output "$name <= $($v.Name)"
}

