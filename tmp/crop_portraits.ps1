Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$races = @('human','dwarf','elf','halfling','dragonborn','gnome','halfelf','halforc','tiefling')
$classes = @('barbarian','bard','cleric','druid','warrior','monk','paladin','ranger','rogue','sorcerer','warlock','mage')
$root = Get-Location
$sheetDir = Join-Path $root 'tmp\portrait_sheets'
$outDir = Join-Path $root 'public\assets\portraits'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Get-ActiveBounds([System.Drawing.Bitmap]$bmp) {
  $w = $bmp.Width
  $h = $bmp.Height
  $xActive = New-Object bool[] $w
  $yActive = New-Object bool[] $h
  $sample = 3
  for($y = 0; $y -lt $h; $y += $sample) {
    for($x = 0; $x -lt $w; $x += $sample) {
      $c = $bmp.GetPixel($x, $y)
      $brightness = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
      $colorSpread = [Math]::Abs($c.R - $c.G) + [Math]::Abs($c.G - $c.B) + [Math]::Abs($c.R - $c.B)
      if($brightness -gt 24 -or ($brightness -gt 14 -and $colorSpread -gt 18)) {
        $xActive[$x] = $true
        $yActive[$y] = $true
      }
    }
  }
  $minX = 0; while($minX -lt $w -and -not $xActive[$minX]) { $minX++ }
  $maxX = $w - 1; while($maxX -gt 0 -and -not $xActive[$maxX]) { $maxX-- }
  $minY = 0; while($minY -lt $h -and -not $yActive[$minY]) { $minY++ }
  $maxY = $h - 1; while($maxY -gt 0 -and -not $yActive[$maxY]) { $maxY-- }

  if($maxX -le $minX -or $maxY -le $minY) {
    return [System.Drawing.Rectangle]::new(0, 0, $w, $h)
  }

  $pad = 4
  $minX = [Math]::Max(0, $minX - $pad)
  $minY = [Math]::Max(0, $minY - $pad)
  $maxX = [Math]::Min($w - 1, $maxX + $pad)
  $maxY = [Math]::Min($h - 1, $maxY + $pad)
  return [System.Drawing.Rectangle]::new($minX, $minY, $maxX - $minX + 1, $maxY - $minY + 1)
}

$count = 0
$reports = @()
foreach($class in $classes) {
  foreach($gender in @('male','female')) {
    $sheetPath = Join-Path $sheetDir "$($class)_$($gender).png"
    if(!(Test-Path $sheetPath)) { throw "Missing sheet $sheetPath" }
    $srcImg = [System.Drawing.Bitmap]::FromFile($sheetPath)
    try {
      $bounds = Get-ActiveBounds $srcImg
      # Keep a square grid area, anchored at the detected top-left. This avoids right/bottom black padding.
      $side = [Math]::Min($bounds.Width, $bounds.Height)
      if($side -lt 900) { $side = [Math]::Min($srcImg.Width, $srcImg.Height) }
      $gridX = [Math]::Max(0, [Math]::Min($bounds.X, $srcImg.Width - $side))
      $gridY = [Math]::Max(0, [Math]::Min($bounds.Y, $srcImg.Height - $side))
      $cell = $side / 3.0
      $reports += "$class/$gender source=$($srcImg.Width)x$($srcImg.Height) grid=$gridX,$gridY,$side"
      for($i = 0; $i -lt 9; $i++) {
        $row = [Math]::Floor($i / 3)
        $col = $i % 3
        $x = [int][Math]::Round($gridX + ($col * $cell))
        $y = [int][Math]::Round($gridY + ($row * $cell))
        $nextX = [int][Math]::Round($gridX + (($col + 1) * $cell))
        $nextY = [int][Math]::Round($gridY + (($row + 1) * $cell))
        $srcRect = [System.Drawing.Rectangle]::new($x, $y, $nextX - $x, $nextY - $y)
        $bmp = New-Object System.Drawing.Bitmap 512, 512
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($srcImg, [System.Drawing.Rectangle]::new(0, 0, 512, 512), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $outPath = Join-Path $outDir "$($class)_$($races[$i])_$($gender).png"
        $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $bmp.Dispose()
        $count++
      }
    } finally {
      $srcImg.Dispose()
    }
  }
}
$reports | Set-Content -Path (Join-Path $sheetDir 'crop-report.txt')
Write-Output "cropped $count portraits"
