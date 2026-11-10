# Round 4: "Pulse H" mark. A basketball with its vertical seam removed: the side seams + equator form an H,
# and the equator is a red heartbeat pulse (Hoop + Life). Custom monoline wordmark, ball replaces the second O.
$root = $PSScriptRoot
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null
$RED = "#D7262E"

# Mark on a 200x200 grid, centre 100,100.
function Mark($sw, $tf) {
  "<g class=`"mark`" transform=`"$tf`" fill=`"none`" stroke-linecap=`"round`" stroke-linejoin=`"round`" stroke-width=`"$sw`">" +
  "<circle class=`"d`" style=`"--i:0`" pathLength=`"1`" cx=`"100`" cy=`"100`" r=`"84`" stroke=`"{{INK}}`" transform=`"rotate(-90 100 100)`"/>" +
  "<path class=`"d`" style=`"--i:1`" pathLength=`"1`" d=`"M44,40 C72,76 72,124 44,160`" stroke=`"{{INK}}`"/>" +
  "<path class=`"d`" style=`"--i:1`" pathLength=`"1`" d=`"M156,40 C128,76 128,124 156,160`" stroke=`"{{INK}}`"/>" +
  "<polyline class=`"d pulse`" style=`"--i:2`" pathLength=`"1`" points=`"65,100 80,100 89,74 100,126 109,100 135,100`" stroke=`"$RED`"/>" +
  "</g>"
}

# Monoline letters, cap height 100, drawn as strokes.
$GLYPHS = @{
  H = @{ w = 52; d = "M0,0 V100 M52,0 V100 M0,50 H52" }
  O = @{ w = 84; d = "M42,0 A42,50 0 1 0 42.01,0" }
  P = @{ w = 52; d = "M0,100 V0 H26 A26,26 0 0 1 26,52 H0" }
  L = @{ w = 46; d = "M0,0 V100 H46" }
  I = @{ w = 0;  d = "M0,0 V100" }
  F = @{ w = 46; d = "M46,0 H0 V100 M0,50 H38" }
  E = @{ w = 46; d = "M46,0 H0 V100 H46 M0,50 H38" }
}
$TRACK = 28; $SW = 9

function Word($letters, $ballAt) {
  $x = 0; $i = 3; $s = ""
  for ($n = 0; $n -lt $letters.Length; $n++) {
    if ($n -eq $ballAt) { $s += Mark 15 "translate($($x - 5),-10) scale(0.6)"; $x += 110 + $TRACK; continue }
    $glyph = $GLYPHS[[string]$letters[$n]]
    $s += "<path class=`"d`" style=`"--i:$i`" pathLength=`"1`" transform=`"translate($x,0)`" d=`"$($glyph.d)`"/>"; $i++
    $x += $glyph.w + $TRACK
  }
  @{ svg = "<g class=`"word`" fill=`"none`" stroke=`"{{INK}}`" stroke-width=`"$SW`" stroke-linecap=`"round`" stroke-linejoin=`"round`">$s</g>"; w = $x - $TRACK }
}

$wm = Word "HOOPLIFE" 2          # ball as the second O
$plain = Word "HOOPLIFE" -1      # plain O's, for the stacked lockup

function Svg($vb, $inner, $bg) {
  $b = ""; if ($bg) { $p = $vb.Split(" "); $b = "<rect x=`"$($p[0])`" y=`"$($p[1])`" width=`"$($p[2])`" height=`"$($p[3])`" fill=`"$bg`"/>" }
  "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$b$inner</svg>"
}

$marks = [ordered]@{
  "wordmark" = @{ vb = "-40 -40 $($wm.w + 80) 180"; body = $wm.svg }
  "stacked"  = @{ vb = "-60 -30 $($plain.w + 120) 400"; body = (Mark 12 "translate($($plain.w/2 - 100),0)") + "<g transform=`"translate(0,250)`">$($plain.svg)</g>" }
  "icon"     = @{ vb = "0 0 200 200"; body = (Mark 12 "") }
  "avatar"   = @{ vb = "-30 -30 260 260"; body = (Mark 12 "") }
}

foreach ($name in $marks.Keys) {
  $m = $marks[$name]
  foreach ($v in @(@("dark","#FFFFFF","#0B0B0C"), @("light","#0B0B0C","#FFFFFF"), @("transparent-white","#FFFFFF",$null), @("transparent-black","#0B0B0C",$null))) {
    [IO.File]::WriteAllText((Join-Path $out "$name-$($v[0]).svg"), (Svg $m.vb $m.body.Replace("{{INK}}", $v[1]) $v[2]))
  }
}

$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
$page = [regex]::Replace($page, '\{\{([a-z]+)\}\}', { param($mt) $m = $marks[$mt.Groups[1].Value]; Svg $m.vb $m.body.Replace("{{INK}}", "currentColor") $null })
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Pulse-Logo.html"), $page)
Write-Output "Built $($marks.Count) marks x 4 colourways + page. Wordmark width: $($wm.w)"
