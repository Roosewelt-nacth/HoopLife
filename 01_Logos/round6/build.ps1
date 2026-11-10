# Round 6: refinements of the checkpoint Pulse H (no ninja in the logo).
#   base   - checkpoint as saved
#   weight - bolder HOOP, lighter LIFE
#   tight  - tighter letter spacing so the word reads as one shape
#   lines  - line hierarchy: heavier ring, lighter seams
#   solid  - solid black ball with seams cut out (strong at small sizes)
$root = $PSScriptRoot
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null
$RED = "#D7262E"
$SEAM_L = "M44,40 C72,76 72,124 44,160"; $SEAM_R = "M156,40 C128,76 128,124 156,160"
$PULSEPTS = "65,100 80,100 89,74 100,126 109,100 135,100"

function Mark($ring, $seam, $pulse, $solid, $tf) {
  if ($solid) {
    # Disc in ink, seams in the paper colour (knockout), pulse red.
    return "<g transform=`"$tf`" fill=`"none`" stroke-linecap=`"round`" stroke-linejoin=`"round`">" +
      "<circle cx=`"100`" cy=`"100`" r=`"90`" fill=`"{{INK}}`"/>" +
      "<path d=`"$SEAM_L`" stroke=`"{{PAPER}}`" stroke-width=`"$seam`"/><path d=`"$SEAM_R`" stroke=`"{{PAPER}}`" stroke-width=`"$seam`"/>" +
      "<polyline points=`"$PULSEPTS`" stroke=`"$RED`" stroke-width=`"$pulse`"/></g>"
  }
  "<g transform=`"$tf`" fill=`"none`" stroke-linecap=`"round`" stroke-linejoin=`"round`">" +
  "<circle cx=`"100`" cy=`"100`" r=`"84`" stroke=`"{{INK}}`" stroke-width=`"$ring`"/>" +
  "<path d=`"$SEAM_L`" stroke=`"{{INK}}`" stroke-width=`"$seam`"/><path d=`"$SEAM_R`" stroke=`"{{INK}}`" stroke-width=`"$seam`"/>" +
  "<polyline points=`"$PULSEPTS`" stroke=`"$RED`" stroke-width=`"$pulse`"/></g>"
}

$GLYPHS = @{
  H = @{ w = 52; d = "M0,0 V100 M52,0 V100 M0,50 H52" }
  O = @{ w = 84; d = "M42,0 A42,50 0 1 0 42.01,0" }
  P = @{ w = 52; d = "M0,100 V0 H26 A26,26 0 0 1 26,52 H0" }
  L = @{ w = 46; d = "M0,0 V100 H46" }
  I = @{ w = 0;  d = "M0,0 V100" }
  F = @{ w = 46; d = "M46,0 H0 V100 M0,50 H38" }
  E = @{ w = 46; d = "M46,0 H0 V100 H46 M0,50 H38" }
}

# heavy = stroke for HOOP, light = stroke for LIFE, track = letter gap; mark strokes in mark units (x0.6 in the word)
function Word($heavy, $light, $track, $mk) {
  $x = 0; $s = ""; $letters = "HOOPLIFE"
  for ($n = 0; $n -lt 8; $n++) {
    if ($n -eq 2) { $s += Mark $mk[0] $mk[1] $mk[2] $mk[3] "translate($($x - 5),-10) scale(0.6)"; $x += 110 + $track; continue }
    $sw = if ($n -lt 4) { $heavy } else { $light }
    $g2 = $GLYPHS[[string]$letters[$n]]
    $s += "<path stroke-width=`"$sw`" transform=`"translate($x,0)`" d=`"$($g2.d)`"/>"
    $x += $g2.w + $track
  }
  @{ svg = "<g fill=`"none`" stroke=`"{{INK}}`" stroke-linecap=`"round`" stroke-linejoin=`"round`">$s</g>"; w = $x - $track }
}

function Svg($vb, $inner, $bg) {
  $b = ""; if ($bg) { $p = $vb.Split(" "); $b = "<rect x=`"$($p[0])`" y=`"$($p[1])`" width=`"$($p[2])`" height=`"$($p[3])`" fill=`"$bg`"/>" }
  "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$b$inner</svg>"
}

$opts = [ordered]@{
  base   = @{ word = (Word 9 9 28 @(15,15,15,$false));  icon = (Mark 12 12 12 $false "") }
  weight = @{ word = (Word 14 8 28 @(20,20,20,$false)); icon = (Mark 12 12 12 $false "") }
  tight  = @{ word = (Word 11 11 18 @(17,17,17,$false)); icon = (Mark 12 12 12 $false "") }
  lines  = @{ word = (Word 9 9 28 @(17,11,15,$false));  icon = (Mark 14 9 12 $false "") }
  solid  = @{ word = (Word 9 9 28 @(15,15,15,$true));   icon = (Mark 12 11 12 $true "") }
}

$marks = [ordered]@{}
foreach ($k in $opts.Keys) {
  $w = $opts[$k].word
  $marks["word-$k"] = @{ vb = "-40 -40 $($w.w + 80) 180"; body = $w.svg }
  $marks["icon-$k"] = @{ vb = "-10 -10 220 220"; body = $opts[$k].icon }
}

foreach ($name in $marks.Keys) {
  $m = $marks[$name]
  foreach ($c in @(@("dark","#FFFFFF","#0B0B0C"), @("light","#0B0B0C","#FFFFFF"))) {
    [IO.File]::WriteAllText((Join-Path $out "$name-$($c[0]).svg"), (Svg $m.vb $m.body.Replace("{{INK}}", $c[1]).Replace("{{PAPER}}", $c[2]) $c[2]))
  }
}

$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
$page = [regex]::Replace($page, '\{\{([a-z\-]+)\}\}', { param($mt) $m = $marks[$mt.Groups[1].Value]
  Svg $m.vb ($m.body.Replace("{{INK}}", "currentColor").Replace("{{PAPER}}", "var(--tile)")) $null })
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Logo-Refinements.html"), $page)
Write-Output "Built $($marks.Count) marks + page."
