# Round 5: Pulse H + ninja options. Base mark = checkpoint v1 (round4). Variants:
#   base  - checkpoint, unchanged
#   band  - the red pulse ties off outside the ball as a ninja headband with two tails
#   eyes  - two slanted ninja eye slits in the upper counter of the H
#   mask  - a black ninja mask band with cut-out eyes above the pulse
# Wordmark refinement: "weight" = HOOP heavier, LIFE lighter.
$root = $PSScriptRoot
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null
$RED = "#D7262E"

$RING  = "<circle class=`"d`" style=`"--i:0`" pathLength=`"1`" cx=`"100`" cy=`"100`" r=`"84`" stroke=`"{{INK}}`" transform=`"rotate(-90 100 100)`"/>"
$SEAMS = "<path class=`"d`" style=`"--i:1`" pathLength=`"1`" d=`"M44,40 C72,76 72,124 44,160`" stroke=`"{{INK}}`"/>" +
         "<path class=`"d`" style=`"--i:1`" pathLength=`"1`" d=`"M156,40 C128,76 128,124 156,160`" stroke=`"{{INK}}`"/>"
$PULSE = "<polyline class=`"d pulse`" style=`"--i:2`" pathLength=`"1`" points=`"65,100 80,100 89,74 100,126 109,100 135,100`" stroke=`"$RED`"/>"

$EXTRA = @{
  base = ""
  band = "<path class=`"d tail`" style=`"--i:3`" pathLength=`"1`" d=`"M135,100 H192 C206,94 216,80 236,76`" stroke=`"$RED`"/>" +
         "<path class=`"d tail`" style=`"--i:3`" pathLength=`"1`" d=`"M192,100 C210,104 222,96 242,100`" stroke=`"$RED`"/>"
  eyes = "<g class=`"fade`" fill=`"{{INK}}`" stroke=`"none`">" +
         "<path d=`"M70,50 L95,58 Q97,64 92,65 L72,59 Q66,55 70,50 Z`"/><path d=`"M130,50 L105,58 Q103,64 108,65 L128,59 Q134,55 130,50 Z`"/></g>"
  mask = "<clipPath id=`"{{ID}}-c`"><path d=`"M44,40 C72,76 72,124 44,160 L156,160 C128,124 128,76 156,40 Z`"/></clipPath>" +
         "<mask id=`"{{ID}}-m`"><rect width=`"200`" height=`"200`" fill=`"#fff`"/><g fill=`"#000`"><path d=`"M70,47 L95,54 Q97,60 92,61 L72,56 Q66,52 70,47 Z`"/><path d=`"M130,47 L105,54 Q103,60 108,61 L128,56 Q134,52 130,47 Z`"/></g></mask>" +
         "<g class=`"fade`" clip-path=`"url(#{{ID}}-c)`"><rect x=`"40`" y=`"38`" width=`"120`" height=`"30`" rx=`"4`" fill=`"{{INK}}`" stroke=`"none`" mask=`"url(#{{ID}}-m)`"/></g>"
}

function Mark($v, $sw, $tf) {
  $under = ""; $over = $EXTRA[$v]
  if ($v -eq "mask") { $under = $EXTRA[$v]; $over = "" }
  "<g class=`"mark`" transform=`"$tf`" fill=`"none`" stroke-linecap=`"round`" stroke-linejoin=`"round`" stroke-width=`"$sw`">$under$RING$SEAMS$PULSE$over</g>"
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
$TRACK = 28

# $heavy: stroke for HOOP; LIFE always 9. Ball replaces the second O.
function Word($v, $heavy) {
  $x = 0; $i = 4; $s = ""; $letters = "HOOPLIFE"
  for ($n = 0; $n -lt 8; $n++) {
    $sw = if ($n -lt 4) { $heavy } else { 9 }
    if ($n -eq 2) { $s += Mark $v ([math]::Round($heavy / 0.6, 1)) "translate($($x - 5),-10) scale(0.6)"; $x += 110 + $TRACK; if ($v -eq "band") { $x += 22 }; continue }
    $glyph = $GLYPHS[[string]$letters[$n]]
    $s += "<path class=`"d`" style=`"--i:$i`" pathLength=`"1`" stroke-width=`"$sw`" transform=`"translate($x,0)`" d=`"$($glyph.d)`"/>"; $i++
    $x += $glyph.w + $TRACK
  }
  @{ svg = "<g class=`"word`" fill=`"none`" stroke=`"{{INK}}`" stroke-linecap=`"round`" stroke-linejoin=`"round`">$s</g>"; w = $x - $TRACK }
}

function Svg($vb, $inner, $bg) {
  $b = ""; if ($bg) { $p = $vb.Split(" "); $b = "<rect x=`"$($p[0])`" y=`"$($p[1])`" width=`"$($p[2])`" height=`"$($p[3])`" fill=`"$bg`"/>" }
  "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$b$inner</svg>"
}

$marks = [ordered]@{}
foreach ($v in "base","band","eyes","mask") {
  $iconVb = if ($v -eq "band") { "-10 -10 262 220" } else { "-10 -10 220 220" }
  $wm = Word $v 9
  $wmW = $wm.w + 80; if ($v -eq "band") { $wmW += 60 }
  $marks["icon-$v"] = @{ vb = $iconVb; body = (Mark $v 12 "") }
  $marks["word-$v"] = @{ vb = "-40 -40 $wmW 180"; body = $wm.svg }
}
$wh = Word "base" 13
$marks["word-weight"] = @{ vb = "-40 -40 $($wh.w + 80) 180"; body = $wh.svg }

foreach ($name in $marks.Keys) {
  $m = $marks[$name]
  foreach ($c in @(@("dark","#FFFFFF","#0B0B0C"), @("light","#0B0B0C","#FFFFFF"), @("transparent-white","#FFFFFF",$null), @("transparent-black","#0B0B0C",$null))) {
    [IO.File]::WriteAllText((Join-Path $out "$name-$($c[0]).svg"), (Svg $m.vb $m.body.Replace("{{INK}}", $c[1]).Replace("{{ID}}", "f") $c[2]))
  }
}

$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
$page = [regex]::Replace($page, '\{\{([a-z\-]+)\}\}', { param($mt)
  $m = $marks[$mt.Groups[1].Value]; $id = "m" + [guid]::NewGuid().ToString("N").Substring(0,6)
  Svg $m.vb $m.body.Replace("{{INK}}", "currentColor").Replace("{{ID}}", $id) $null })
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Ninja-Options.html"), $page)
Write-Output "Built $($marks.Count) marks x 4 colourways + page."
