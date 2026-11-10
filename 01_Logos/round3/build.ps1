# Round 3: minimal modular "shot clock" wordmark. Letters are rounded segments on a 100-unit cap height.
# Writes SVG files to .\files and the review page HoopLife-Logo-R3.html.
$root = $PSScriptRoot
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null
$RED = "#D7262E"; $R = 4

# Segment grid: stroke 18, split gap 8 -> top half 0-46, bottom half 54-100.
# Stroke 22, split gap 6: top half 0-47, bottom half 53-100. Middle bars sit detached at 39-61.
$L = @{
  H = @{ w = 72; r = @(@(0,0,22,47), @(0,53,22,47), @(50,0,22,47), @(50,53,22,47), @(28,39,16,22)) }
  O = @{ w = 72; r = @(@(0,0,22,47), @(0,0,72,22), @(50,0,22,47), @(0,53,22,47), @(0,78,72,22), @(50,53,22,47)) }
  P = @{ w = 72; r = @(@(0,0,22,47), @(0,0,72,22), @(50,0,22,47), @(28,39,44,22), @(0,53,22,47)) }
  L = @{ w = 64; r = @(@(0,0,22,47), @(0,53,22,47), @(0,78,64,22)) }
  I = @{ w = 22; r = @(@(0,0,22,47), @(0,53,22,47)) }
  F = @{ w = 64; r = @(@(0,0,22,47), @(0,0,64,22), @(28,39,26,22), @(0,53,22,47)) }
  E = @{ w = 64; r = @(@(0,0,22,47), @(0,0,64,22), @(28,39,30,22), @(0,53,22,47), @(0,78,64,22)) }
}
$TRACK = 14

# Quartered ball: a circle split by a cross-shaped gap (the seams).
function Ball($cx, $cy, $r, $gap, $fill, $id, $cls) {
  $x = $cx - $r; $y = $cy - $r; $h = $r - $gap / 2; $x2 = $cx + $gap / 2; $y2 = $cy + $gap / 2
  "<g class=`"$cls`"><clipPath id=`"$id`"><circle cx=`"$cx`" cy=`"$cy`" r=`"$r`"/></clipPath><g clip-path=`"url(#$id)`" fill=`"$fill`">" +
  "<rect x=`"$x`" y=`"$y`" width=`"$h`" height=`"$h`"/><rect x=`"$x2`" y=`"$y`" width=`"$h`" height=`"$h`"/>" +
  "<rect x=`"$x`" y=`"$y2`" width=`"$h`" height=`"$h`"/><rect x=`"$x2`" y=`"$y2`" width=`"$h`" height=`"$h`"/></g></g>"
}

function Wordmark($idp) {
  $x = 0; $i = 0; $s = ""
  foreach ($ch in "H","O","BALL","P","L","I","F","E") {
    if ($ch -eq "BALL") { $s += Ball ($x + 50) 50 50 6 $RED "$idp-ball" "ball"; $x += 100 + $TRACK; continue }
    foreach ($b in $L[$ch].r) {
      $s += "<rect class=`"b`" style=`"--i:$i`" x=`"$($x + $b[0])`" y=`"$($b[1])`" width=`"$($b[2])`" height=`"$($b[3])`" rx=`"$R`"/>"; $i++
    }
    $x += $L[$ch].w + $TRACK
  }
  "<g class=`"wm`" fill=`"{{INK}}`">$s</g>"
}
$WMW = 628  # total wordmark width

$SYM = @{
  ball  = (Ball 307 178 25 5 "{{INK}}" "{{ID}}-sym" "sym")
  ninja = "<g class=`"sym`" fill=`"{{INK}}`"><rect x=`"266`" y=`"172`" width=`"38`" height=`"12`" rx=`"3`" transform=`"rotate(12 285 178)`"/><rect x=`"310`" y=`"172`" width=`"38`" height=`"12`" rx=`"3`" transform=`"rotate(-12 329 178)`"/></g>"
  hoop  = "<g class=`"sym`" fill=`"{{INK}}`"><rect x=`"280`" y=`"152`" width=`"54`" height=`"9`" rx=`"3`"/><rect x=`"284`" y=`"167`" width=`"7`" height=`"30`" rx=`"3`" transform=`"rotate(-12 287 167)`"/><rect x=`"297`" y=`"167`" width=`"7`" height=`"32`" rx=`"3`"/><rect x=`"310`" y=`"167`" width=`"7`" height=`"32`" rx=`"3`"/><rect x=`"323`" y=`"167`" width=`"7`" height=`"30`" rx=`"3`" transform=`"rotate(12 327 167)`"/></g>"
}

function Svg($vb, $inner, $bg) {
  $b = ""; if ($bg) { $p = $vb.Split(" "); $b = "<rect x=`"$($p[0])`" y=`"$($p[1])`" width=`"$($p[2])`" height=`"$($p[3])`" fill=`"$bg`"/>" }
  "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$b$inner</svg>"
}

# Marks: lockups (wordmark + symbol), wordmark only, ball icon, HL icon.
$marks = [ordered]@{}
foreach ($k in "ball","ninja","hoop") { $marks["lockup-$k"] = @{ vb = "-48 -48 724 300"; body = (Wordmark "{{ID}}") + "<g transform=`"translate(7,4)`">" + $SYM[$k] + "</g>" } }
$marks["wordmark"] = @{ vb = "-48 -48 724 196"; body = (Wordmark "{{ID}}") }
$marks["icon-ball"] = @{ vb = "0 0 200 200"; body = (Ball 100 100 64 10 $RED "{{ID}}-ib" "ball") }
$hl = ""; foreach ($b in $L.H.r) { $hl += "<rect x=`"$($b[0])`" y=`"$($b[1])`" width=`"$($b[2])`" height=`"$($b[3])`" rx=`"$R`"/>" }
$hl += "<rect x=`"86`" y=`"0`" width=`"22`" height=`"47`" rx=`"$R`"/><rect x=`"86`" y=`"53`" width=`"22`" height=`"47`" rx=`"$R`"/><rect x=`"86`" y=`"78`" width=`"64`" height=`"22`" rx=`"$R`" fill=`"$RED`"/>"
$marks["icon-hl"] = @{ vb = "0 0 200 200"; body = "<g transform=`"translate(25,50)`" fill=`"{{INK}}`">$hl</g>" }

$inline = @{}; $n = 0
foreach ($name in $marks.Keys) {
  $m = $marks[$name]
  foreach ($v in @(@("dark","#FFFFFF","#0B0B0C"), @("light","#0B0B0C","#FFFFFF"), @("transparent-white","#FFFFFF",$null), @("transparent-black","#0B0B0C",$null))) {
    $body = $m.body.Replace("{{INK}}", $v[1]).Replace("{{ID}}", "f")
    [IO.File]::WriteAllText((Join-Path $out "$name-$($v[0]).svg"), (Svg $m.vb $body $v[2]))
  }
  $inline[$name] = $m.vb
}

# Page: each inline copy gets unique clip ids.
function InlineMark($name) { $n = [guid]::NewGuid().ToString("N").Substring(0,6); Svg $marks[$name].vb ($marks[$name].body.Replace("{{INK}}", "currentColor").Replace("{{ID}}", "m$n")) $null }
$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
$page = [regex]::Replace($page, '\{\{([a-z\-]+)\}\}', { param($mt) InlineMark $mt.Groups[1].Value })
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Logo-R3.html"), $page)
Write-Output "Built $($marks.Count) marks x 4 colourways + page."
