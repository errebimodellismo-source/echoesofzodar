Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$races = @('human','dwarf','elf','halfling','dragonborn','gnome','halfelf','halforc','tiefling')
$sheetPath = Join-Path (Get-Location) 'tmp\portrait_sheets\bard_female.png'
$outDir = Join-Path (Get-Location) 'public\assets\portraits'
$img = [System.Drawing.Image]::FromFile($sheetPath)
try {
  $cell = $img.Width / 4.0
  for($i=0; $i -lt 9; $i++) {
    $row = [Math]::Floor($i / 3)
    $col = $i % 3
    $x = [int][Math]::Round($col * $cell)
    $y = [int][Math]::Round($row * $cell)
    $nx = [int][Math]::Round(($col + 1) * $cell)
    $ny = [int][Math]::Round(($row + 1) * $cell)
    $src = [System.Drawing.Rectangle]::new($x, $y, $nx - $x, $ny - $y)
    $bmp = New-Object System.Drawing.Bitmap 512,512
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, [System.Drawing.Rectangle]::new(0,0,512,512), $src, [System.Drawing.GraphicsUnit]::Pixel)
    $outPath = Join-Path $outDir "bard_$($races[$i])_female.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
  }
} finally { $img.Dispose() }
Write-Output 'bard female recropped'
