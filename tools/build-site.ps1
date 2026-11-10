# Builds the public showcase in docs/ (served by GitHub Pages).
# Each design page is copied from its source and wrapped as a full HTML document.
# Usage:  powershell -ExecutionPolicy Bypass -File tools/build-site.ps1 [-Thumbs]
param([switch]$Thumbs)
$root = Split-Path $PSScriptRoot -Parent
$docs = Join-Path $root "docs"
New-Item -ItemType Directory -Force $docs, "$docs\media", "$docs\thumbs" | Out-Null

# slug => source page (relative to repo root)
$pages = [ordered]@{
  "logo-final-b1"      = "01_Logos\round7\HoopLife-Basketball-Fix.html"
  "logo-pulse-h"       = "01_Logos\round4\HoopLife-Pulse-Logo.html"
  "logo-refinements"   = "01_Logos\round6\HoopLife-Logo-Refinements.html"
  "logo-ninja-options" = "01_Logos\round5\HoopLife-Ninja-Options.html"
  "logo-round3"        = "01_Logos\round3\HoopLife-Logo-R3.html"
  "logo-round2"        = "01_Logos\round2\HoopLife-Ninja-Logos.html"
  "logo-round1"        = "01_Logos\HoopLife-Logo-Concepts.html"
  "merch-ball-keychain"= "02_Merch\keychain-ball\HoopLife-Ball-Keychain-v2.html"
  "merch-disc-keychain"= "02_Merch\keychain\HoopLife-Keychain.html"
  "merch-brick-ninja"  = "02_Merch\brick-ninja\HoopLife-Brick-Ninja.html"
  "mascot-figure"      = "03_Mascot\HoopLife-Ninja-Figure.html"
  "game-5v5"           = "03_Mascot\HoopLife-Court-5v5.html"
  "game-8bit"          = "03_Mascot\HoopLife-Court-8bit.html"
  "game-3v3"           = "03_Mascot\HoopLife-Court.html"
}
$head = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}.hl-back{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:99;font:600 12px system-ui,sans-serif;color:#F4F4F2;background:rgba(11,11,12,.85);border:1px solid #444;border-radius:999px;padding:8px 14px;text-decoration:none}.hl-back:hover{border-color:#D7262E}</style></head><body>'
$tail = '<a class="hl-back" href="./index.html">&larr; HoopLife showcase</a></body></html>'
foreach ($slug in $pages.Keys) {
  $src = Join-Path $root $pages[$slug]
  if (-not (Test-Path $src)) { Write-Warning "missing $src"; continue }
  $body = [IO.File]::ReadAllText($src)
  $body = $body -replace '(?i)<meta charset="utf-8">\s*', ''
  [IO.File]::WriteAllText((Join-Path $docs "$slug.html"), $head + $body + $tail, (New-Object Text.UTF8Encoding $false))
}
# media: final logo files, jock tag, turnaround sheet
$media = @(
  "01_Logos\CHECKPOINT-v2-Basketball-B1\files\icon-b1-dark.svg", "01_Logos\CHECKPOINT-v2-Basketball-B1\files\icon-b1-light.svg",
  "01_Logos\CHECKPOINT-v2-Basketball-B1\files\word-b1-dark.svg", "01_Logos\CHECKPOINT-v2-Basketball-B1\files\word-b1-light.svg",
  "02_Merch\keychain-ball\jock-tag\jock-tag-v4.png", "03_Mascot\sculpt-package\turnaround-sheet.png"
)
foreach ($m in $media) { $p = Join-Path $root $m; if (Test-Path $p) { Copy-Item $p "$docs\media\" -Force } }
Copy-Item (Join-Path $PSScriptRoot "showcase-index.html") "$docs\index.html" -Force
New-Item -ItemType File -Force "$docs\.nojekyll" | Out-Null

# optional: page thumbnails via headless Edge (needs a local server on 8765 serving the repo root)
if ($Thumbs) {
  $edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
  foreach ($slug in $pages.Keys) {
    $png = "$docs\thumbs\$slug.png"; Remove-Item $png -ErrorAction SilentlyContinue
    & $edge --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --hide-scrollbars --window-size=1200,800 --virtual-time-budget=9000 "--screenshot=$png" "http://localhost:8765/docs/$slug.html" 2>$null
    $i = 0; while (-not (Test-Path $png) -and $i -lt 40) { Start-Sleep 1; $i++ }
  }
  python -I -c "import glob; from PIL import Image
for f in glob.glob(r'$docs\thumbs\*.png'):
    im = Image.open(f).convert('RGB'); im.thumbnail((640, 640)); im.save(f, optimize=True)"
}
Write-Output "Showcase built in $docs"
