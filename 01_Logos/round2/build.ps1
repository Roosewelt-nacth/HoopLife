# Round 2: realistic ninja-ball logo family. Writes SVG files, PNG exports and the review page.
$root = $PSScriptRoot
. (Join-Path $root "src\parts.ps1")
$out = Join-Path $root "files"
New-Item -ItemType Directory -Force $out | Out-Null

# {{INK}} = main wordmark colour, {{BG}} = background layer, {{FONT}} = web font import (files only)
$variants = [ordered]@{
"A1-primary" = @{ vb = "0 0 420 450"; body = @"
{{BG}}
<g transform="translate(10,0)">$GROUND$NINJA</g>
<text x="210" y="378" text-anchor="middle" $WORD font-size="64" textLength="300" lengthAdjust="spacingAndGlyphs" fill="{{INK}}" filter="url(#nb-drop)">HOOPLIFE</text>
<text x="210" y="415" text-anchor="middle" $WORD font-size="19" textLength="230" lengthAdjust="spacing" fill="url(#nb-gold)">COMMUNITY</text>
"@ }
"A2-hooded" = @{ vb = "0 0 400 470"; body = @"
{{BG}}
$GROUND$HOODED
<text x="200" y="398" text-anchor="middle" $WORD font-size="64" textLength="300" lengthAdjust="spacingAndGlyphs" fill="{{INK}}" filter="url(#nb-drop)">HOOPLIFE</text>
<text x="200" y="435" text-anchor="middle" $WORD font-size="19" textLength="230" lengthAdjust="spacing" fill="url(#nb-gold)">COMMUNITY</text>
"@ }
"A3-emblem" = @{ vb = "0 0 400 400"; body = @"
{{BG}}
<path id="nb-arcTop" d="M70,200 A130,130 0 0 1 330,200" fill="none"/>
<path id="nb-arcBot" d="M56,200 A144,144 0 0 0 344,200" fill="none"/>
<circle cx="200" cy="200" r="186" fill="#0B0B0C" stroke="url(#nb-gold)" stroke-width="10"/>
<circle cx="200" cy="200" r="172" fill="none" stroke="#C9A24A" stroke-opacity="0.55" stroke-width="1.5"/>
<g transform="translate(200,212) scale(0.6) translate(-222,-180)">$NINJA</g>
<text $WORD font-size="40" letter-spacing="4" fill="url(#nb-gold)"><textPath href="#nb-arcTop" startOffset="50%" text-anchor="middle">HOOPLIFE</textPath></text>
<text $WORD font-size="17" letter-spacing="6" fill="#F4F4F2"><textPath href="#nb-arcBot" startOffset="50%" text-anchor="middle">COMMUNITY &#183; CHENNAI</textPath></text>
<circle cx="44" cy="200" r="4" fill="#D7262E"/><circle cx="356" cy="200" r="4" fill="#D7262E"/>
"@ }
"A4-horizontal" = @{ vb = "0 0 820 320"; body = @"
{{BG}}
<g stroke-linecap="round">
  <line x1="20" y1="120" x2="110" y2="120" stroke="#D7262E" stroke-width="8"/>
  <line x1="40" y1="150" x2="100" y2="150" stroke="#C9A24A" stroke-width="6"/>
  <line x1="10" y1="180" x2="96" y2="180" stroke="#D7262E" stroke-width="8"/>
  <line x1="44" y1="210" x2="104" y2="210" stroke="#C9A24A" stroke-width="6"/>
</g>
<g transform="translate(-10,-20)">$GROUND$NINJA</g>
<text x="408" y="178" $WORD font-size="104" textLength="390" lengthAdjust="spacingAndGlyphs" fill="{{INK}}" filter="url(#nb-drop)">HOOPLIFE</text>
<text x="410" y="226" $WORD font-size="30" letter-spacing="20" fill="url(#nb-gold)">COMMUNITY</text>
<rect x="410" y="244" width="60" height="4" fill="#D7262E"/>
<text x="482" y="250" $WORD font-size="14" letter-spacing="5" fill="{{INK}}" opacity="0.8">CHENNAI &#183; EST. 2026</text>
"@ }
}

function Svg($vb, $inner, $font) { "<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"$vb`">$font$DEFS$inner</svg>" }

$inline = @{}
foreach ($name in $variants.Keys) {
  $v = $variants[$name]
  $dark  = $v.body.Replace("{{INK}}", "#FFFFFF").Replace("{{BG}}", '<rect width="100%" height="100%" fill="#0B0B0C"/>')
  $light = $v.body.Replace("{{INK}}", "#0B0B0C").Replace("{{BG}}", '<rect width="100%" height="100%" fill="#FFFFFF"/>')
  $clear = $v.body.Replace("{{INK}}", "#FFFFFF").Replace("{{BG}}", "")
  [IO.File]::WriteAllText((Join-Path $out "$name-dark.svg"),  (Svg $v.vb $dark $FONT))
  [IO.File]::WriteAllText((Join-Path $out "$name-light.svg"), (Svg $v.vb $light $FONT))
  [IO.File]::WriteAllText((Join-Path $out "$name-transparent.svg"), (Svg $v.vb $clear $FONT))
  $inline[$name] = Svg $v.vb ($v.body.Replace("{{INK}}", "currentColor").Replace("{{BG}}", "")) ""
}

# Review page: only the first inline SVG needs the defs; later copies reuse the same ids.
$page = [IO.File]::ReadAllText((Join-Path $root "src\review-template.html"))
foreach ($name in $variants.Keys) { $page = $page.Replace("{{$name}}", $inline[$name]) }
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Ninja-Logos.html"), $page)
Write-Output "SVG + page built."
