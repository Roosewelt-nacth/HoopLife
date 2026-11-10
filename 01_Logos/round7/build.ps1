# Round 7: make the Pulse H read as a basketball, not a tennis ball.
# A basketball has a vertical seam, a full horizontal seam and two curved side seams.
#   ckpt - checkpoint (two seams only: reads as tennis)
#   b1   - full basketball seams; the vertical seam breaks where the pulse beats through
#   b2   - full basketball seams; vertical seam runs straight through behind the pulse
$root = $PSScriptRoot
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null
$RED = "#D7262E"

$SHAPES = @{
  ckpt = @{ seams = @("M44,40 C72,76 72,124 44,160", "M156,40 C128,76 128,124 156,160"); ink = @(); pts = "65,100 80,100 89,74 100,126 109,100 135,100" }
  b1   = @{ seams = @("M42,42 C64,76 64,124 42,158", "M158,42 C136,76 136,124 158,158"); ink = @("M16,100 H58", "M142,100 H184", "M100,16 V60", "M100,140 V184"); pts = "58,100 81,100 90,72 100,128 110,100 142,100" }
  b2   = @{ seams = @("M42,42 C64,76 64,124 42,158", "M158,42 C136,76 136,124 158,158"); ink = @("M16,100 H58", "M142,100 H184", "M100,16 V184"); pts = "58,100 81,100 90,72 100,128 110,100 142,100" }
}

function Mark($k, $sw, $tf) {
  $sh = $SHAPES[$k]; $s = "<circle cx=`"100`" cy=`"100`" r=`"84`" stroke=`"{{INK}}`"/>"
  foreach ($d in $sh.seams + $sh.ink) { $s += "<path d=`"$d`" stroke=`"{{INK}}`"/>" }
  if ($k -eq "b2") { $s += "<polyline points=`"$($sh.pts)`" stroke=`"{{PAPER}}`" stroke-width=`"$($sw + 10)`"/>" }  # knock-out so the pulse sits cleanly over the seam
  $s += "<polyline points=`"$($sh.pts)`" stroke=`"$RED`"/>"
  "<g transform=`"$tf`" fill=`"none`" stroke-width=`"$sw`" stroke-linecap=`"round`" stroke-linejoin=`"round`">$s</g>"
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
function Word($k) {
  $x = 0; $s = ""; $letters = "HOOPLIFE"; $track = 28
  for ($n = 0; $n -lt 8; $n++) {
    if ($n -eq 2) { $s += Mark $k 15 "translate($($x - 5),-10) scale(0.6)"; $x += 110 + $track; continue }
    $g2 = $GLYPHS[[string]$letters[$n]]
    $s += "<path transform=`"translate($x,0)`" d=`"$($g2.d)`"/>"; $x += $g2.w + $track
  }
  @{ svg = "<g fill=`"none`" stroke=`"{{INK}}`" stroke-width=`"9`" stroke-linecap=`"round`" stroke-linejoin=`"round`">$s</g>"; w = $x - $track }
}
function Svg($vb, $inner, $bg) {
  $b = ""; if ($bg) { $p = $vb.Split(" "); $b = "<rect x=`"$($p[0])`" y=`"$($p[1])`" width=`"$($p[2])`" height=`"$($p[3])`" fill=`"$bg`"/>" }
  "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$b$inner</svg>"
}

$marks = [ordered]@{}
foreach ($k in "ckpt","b1","b2") {
  $w = Word $k
  $marks["icon-$k"] = @{ vb = "-10 -10 220 220"; body = (Mark $k 12 "") }
  $marks["word-$k"] = @{ vb = "-40 -40 $($w.w + 80) 180"; body = $w.svg }
}
foreach ($name in $marks.Keys) {
  $m = $marks[$name]
  foreach ($c in @(@("dark","#FFFFFF","#0B0B0C"), @("light","#0B0B0C","#FFFFFF"), @("transparent-white","#FFFFFF",$null), @("transparent-black","#0B0B0C",$null))) {
    $paper = if ($c[2]) { $c[2] } else { if ($c[1] -eq "#FFFFFF") { "#0B0B0C" } else { "#FFFFFF" } }
    [IO.File]::WriteAllText((Join-Path $out "$name-$($c[0]).svg"), (Svg $m.vb $m.body.Replace("{{INK}}", $c[1]).Replace("{{PAPER}}", $paper) $c[2]))
  }
}
$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
$page = [regex]::Replace($page, '\{\{([a-z0-9\-]+)\}\}', { param($mt) $m = $marks[$mt.Groups[1].Value]
  Svg $m.vb ($m.body.Replace("{{INK}}", "currentColor").Replace("{{PAPER}}", "var(--tile)")) $null })
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Basketball-Fix.html"), $page)
Write-Output "Built $($marks.Count) marks + page."
