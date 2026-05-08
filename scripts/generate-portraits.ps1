Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$outDir = Join-Path (Split-Path $PSScriptRoot -Parent) "public\assets\portraits"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$classes = [ordered]@{
  barbarian = @{ color="#dc2626"; trim="#f97316"; armor="#3b1614"; sigil="AXE" }
  bard      = @{ color="#f97316"; trim="#fbbf24"; armor="#321707"; sigil="SONG" }
  cleric    = @{ color="#f59e0b"; trim="#f8fafc"; armor="#2e2614"; sigil="LIGHT" }
  druid     = @{ color="#84cc16"; trim="#22c55e"; armor="#142719"; sigil="LEAF" }
  warrior   = @{ color="#ef4444"; trim="#f59e0b"; armor="#2d1515"; sigil="BLADE" }
  monk      = @{ color="#06b6d4"; trim="#67e8f9"; armor="#10242b"; sigil="KI" }
  paladin   = @{ color="#facc15"; trim="#fde68a"; armor="#302813"; sigil="OATH" }
  ranger    = @{ color="#14b8a6"; trim="#22c55e"; armor="#102820"; sigil="BOW" }
  rogue     = @{ color="#22c55e"; trim="#86efac"; armor="#0f2417"; sigil="DAG" }
  sorcerer  = @{ color="#8b5cf6"; trim="#c084fc"; armor="#1e123a"; sigil="ARC" }
  warlock   = @{ color="#7c3aed"; trim="#c4b5fd"; armor="#170d2c"; sigil="PACT" }
  mage      = @{ color="#3b82f6"; trim="#a855f7"; armor="#111b35"; sigil="RUNE" }
}

$races = [ordered]@{
  human      = @{ skin="#d9a56f"; hair="#3a2415"; trait="none" }
  dwarf      = @{ skin="#c88f5a"; hair="#6b4423"; trait="beard" }
  elf        = @{ skin="#ecd6ad"; hair="#d8c27a"; trait="ears" }
  halfling   = @{ skin="#f0bf91"; hair="#7a4a28"; trait="round" }
  dragonborn = @{ skin="#9a7040"; hair="#53351e"; trait="scales" }
  gnome      = @{ skin="#eebc91"; hair="#b36b2c"; trait="small" }
  halfelf    = @{ skin="#e3c196"; hair="#6d4726"; trait="halfears" }
  halforc    = @{ skin="#739c5a"; hair="#252515"; trait="tusks" }
  tiefling   = @{ skin="#bf6f8f"; hair="#2b1020"; trait="horns" }
}

function ColorFromHex($hex) {
  [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function BrushFromHex($hex) {
  New-Object System.Drawing.SolidBrush (ColorFromHex $hex)
}

function PenFromHex($hex, $width = 1) {
  New-Object System.Drawing.Pen ((ColorFromHex $hex), $width)
}

function ShiftColor($hex, [int]$amount) {
  $c = ColorFromHex $hex
  $r = [Math]::Min(255, [Math]::Max(0, $c.R + $amount))
  $g = [Math]::Min(255, [Math]::Max(0, $c.G + $amount))
  $b = [Math]::Min(255, [Math]::Max(0, $c.B + $amount))
  [System.Drawing.Color]::FromArgb($r, $g, $b)
}

function FillEllipse($graphics, $brush, $x, $y, $w, $h) {
  $graphics.FillEllipse($brush, [single]$x, [single]$y, [single]$w, [single]$h)
}

function DrawFantasyPortrait($classKey, $raceKey, $gender, $class, $race, $filePath) {
  $bmp = New-Object System.Drawing.Bitmap 512, 512
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $rect = [System.Drawing.Rectangle]::new(0, 0, 512, 512)
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, (ShiftColor $class.color -85), ([System.Drawing.Color]::FromArgb(4, 7, 16)), 45
  $g.FillRectangle($bg, $rect)

  $haloPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $haloPath.AddEllipse(58, 26, 396, 396)
  $halo = New-Object System.Drawing.Drawing2D.PathGradientBrush $haloPath
  $accent = ColorFromHex $class.color
  $halo.CenterColor = [System.Drawing.Color]::FromArgb(110, $accent.R, $accent.G, $accent.B)
  $halo.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $g.FillPath($halo, $haloPath)

  $g.DrawEllipse((PenFromHex $class.trim 7), 34, 34, 444, 444)
  $g.DrawEllipse((PenFromHex "#111827" 10), 49, 49, 414, 414)
  $g.DrawEllipse((PenFromHex $class.color 3), 61, 61, 390, 390)

  FillEllipse $g (BrushFromHex $class.armor) 104 300 304 194
  $g.FillRectangle((BrushFromHex $class.armor), 132, 270, 248, 172)
  $g.DrawArc((PenFromHex $class.trim 5), 118, 286, 276, 176, 190, 160)

  if($race.trait -eq "ears") {
    FillEllipse $g (BrushFromHex $race.skin) 98 178 56 92
    FillEllipse $g (BrushFromHex $race.skin) 358 178 56 92
    $g.DrawEllipse((PenFromHex "#6b4f2f" 3), 98, 178, 56, 92)
    $g.DrawEllipse((PenFromHex "#6b4f2f" 3), 358, 178, 56, 92)
  } elseif($race.trait -eq "halfears") {
    FillEllipse $g (BrushFromHex $race.skin) 110 190 42 70
    FillEllipse $g (BrushFromHex $race.skin) 360 190 42 70
  } elseif($race.trait -eq "horns") {
    $g.FillPolygon((BrushFromHex "#4b1420"), @([System.Drawing.Point]::new(178,122),[System.Drawing.Point]::new(132,48),[System.Drawing.Point]::new(194,99)))
    $g.FillPolygon((BrushFromHex "#4b1420"), @([System.Drawing.Point]::new(334,122),[System.Drawing.Point]::new(380,48),[System.Drawing.Point]::new(318,99)))
  }

  $headW = if($race.trait -eq "small") { 150 } else { 174 }
  $headH = if($race.trait -eq "dwarf") { 170 } else { 192 }
  $hx = 256 - ($headW / 2)
  $hy = if($race.trait -eq "small") { 124 } else { 105 }

  FillEllipse $g (BrushFromHex $race.skin) $hx $hy $headW $headH
  $outline = New-Object System.Drawing.Pen ((ShiftColor $race.skin -45), 3)
  $g.DrawEllipse($outline, [single]$hx, [single]$hy, [single]$headW, [single]$headH)

  $hairColor = if($gender -eq "female") { ShiftColor $race.hair 12 } else { ColorFromHex $race.hair }
  $hairBrush = New-Object System.Drawing.SolidBrush $hairColor
  FillEllipse $g $hairBrush ($hx + 5) ($hy - 30) ($headW - 10) 84
  if($gender -eq "female") {
    FillEllipse $g $hairBrush ($hx - 18) ($hy + 22) 44 164
    FillEllipse $g $hairBrush ($hx + $headW - 26) ($hy + 22) 44 164
  }

  FillEllipse $g (BrushFromHex "#0f172a") ($hx + 49) ($hy + 84) 22 22
  FillEllipse $g (BrushFromHex "#0f172a") ($hx + $headW - 71) ($hy + 84) 22 22
  FillEllipse $g (BrushFromHex "#f8fafc") ($hx + 54) ($hy + 88) 6 6
  FillEllipse $g (BrushFromHex "#f8fafc") ($hx + $headW - 66) ($hy + 88) 6 6

  $facePen = New-Object System.Drawing.Pen ((ShiftColor $race.skin -65), 4)
  $g.DrawLine($facePen, 256, ($hy + 103), 250, ($hy + 131))
  $g.DrawArc($facePen, 228, ($hy + 137), 56, 26, 20, 140)

  switch($race.trait) {
    "beard" {
      FillEllipse $g (BrushFromHex $race.hair) 192 226 128 104
      $g.DrawArc((PenFromHex $class.trim 3), 204, 242, 104, 72, 10, 160)
    }
    "tusks" {
      FillEllipse $g (BrushFromHex "#f0ead2") 222 248 24 50
      FillEllipse $g (BrushFromHex "#f0ead2") 266 248 24 50
      $g.DrawEllipse((PenFromHex "#6f6a50" 2), 222, 248, 24, 50)
      $g.DrawEllipse((PenFromHex "#6f6a50" 2), 266, 248, 24, 50)
    }
    "scales" {
      foreach($sx in @(204, 230, 256, 282)) { FillEllipse $g (BrushFromHex $class.color) $sx 142 18 18 }
      FillEllipse $g (BrushFromHex "#4a321e") 226 214 60 46
    }
    "round" {
      FillEllipse $g (BrushFromHex "#fb9a9a") 186 218 35 24
      FillEllipse $g (BrushFromHex "#fb9a9a") 291 218 35 24
    }
  }

  switch($classKey) {
    "cleric"    { $g.DrawLine((PenFromHex $class.trim 7),256,304,256,382); $g.DrawLine((PenFromHex $class.trim 7),224,336,288,336) }
    "paladin"   { $g.FillPolygon((BrushFromHex $class.trim), @([System.Drawing.Point]::new(256,308),[System.Drawing.Point]::new(218,362),[System.Drawing.Point]::new(256,414),[System.Drawing.Point]::new(294,362))) }
    "mage"      { $g.DrawEllipse((PenFromHex $class.trim 5),218,318,76,76); $g.DrawLine((PenFromHex $class.trim 3),256,318,256,394); $g.DrawLine((PenFromHex $class.trim 3),218,356,294,356) }
    "sorcerer"  { FillEllipse $g (BrushFromHex $class.trim) 232 326 48 48; $g.DrawEllipse((PenFromHex "#ffffff" 3),232,326,48,48) }
    "warlock"   { $g.DrawArc((PenFromHex $class.trim 6),214,322,84,84,20,320) }
    "ranger"    { $g.DrawArc((PenFromHex $class.trim 6),194,308,124,124,230,260); $g.DrawLine((PenFromHex $class.trim 3),212,318,306,410) }
    "rogue"     { $g.DrawLine((PenFromHex $class.trim 8),220,326,290,404); $g.DrawLine((PenFromHex "#e5e7eb" 5),224,330,286,400) }
    "bard"      { $g.DrawArc((PenFromHex $class.trim 5),222,324,68,68,90,260); $g.DrawLine((PenFromHex $class.trim 4),286,326,286,394) }
    "druid"     { $g.FillPolygon((BrushFromHex $class.trim), @([System.Drawing.Point]::new(256,312),[System.Drawing.Point]::new(210,364),[System.Drawing.Point]::new(256,396),[System.Drawing.Point]::new(302,364))) }
    "monk"      { $g.DrawEllipse((PenFromHex $class.trim 4),220,322,72,72); $g.DrawLine((PenFromHex $class.trim 4),220,358,292,358) }
    "barbarian" { $g.DrawLine((PenFromHex "#d1d5db" 9),206,316,296,408); $g.DrawLine((PenFromHex $class.trim 5),222,332,280,390) }
    default     { $g.DrawLine((PenFromHex "#e5e7eb" 8),256,306,256,410); $g.DrawLine((PenFromHex $class.trim 5),232,336,280,336) }
  }

  $font = New-Object System.Drawing.Font "Georgia", 16, ([System.Drawing.FontStyle]::Bold)
  $small = New-Object System.Drawing.Font "Segoe UI", 11, ([System.Drawing.FontStyle]::Regular)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($raceKey.ToUpperInvariant(), $font, (BrushFromHex "#f8fafc"), [System.Drawing.RectangleF]::new(0,424,512,28), $sf)
  $g.DrawString(($class.sigil + " / " + $(if($gender -eq "female"){"F"}else{"M"})), $small, (BrushFromHex $class.trim), [System.Drawing.RectangleF]::new(0,454,512,24), $sf)

  $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$count = 0
foreach($classKey in $classes.Keys) {
  foreach($raceKey in $races.Keys) {
    foreach($gender in @("male", "female")) {
      $name = "$classKey`_$raceKey`_$gender.png"
      DrawFantasyPortrait $classKey $raceKey $gender $classes[$classKey] $races[$raceKey] (Join-Path $outDir $name)
      $count++
    }
  }
}

Write-Output "Generated $count fantasy portraits in $outDir"
