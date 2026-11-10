# Builds dark/light SVG logo files and the review page from src templates.
$root = $PSScriptRoot
$src = Join-Path $root "src"
$out = Join-Path $root "concepts"
New-Item -ItemType Directory -Force $out | Out-Null

$inline = @{}
foreach ($f in Get-ChildItem $src -Filter *.svg) {
  $t = [IO.File]::ReadAllText($f.FullName)
  $dark  = $t.Replace("{{INK}}", "#FFFFFF").Replace("{{BG}}", '<rect width="100%" height="100%" fill="#0B0B0C"/>')
  $light = $t.Replace("{{INK}}", "#0B0B0C").Replace("{{BG}}", '<rect width="100%" height="100%" fill="#FFFFFF"/>')
  $clear = $t.Replace("{{INK}}", "#FFFFFF").Replace("{{BG}}", "")
  [IO.File]::WriteAllText((Join-Path $out ($f.BaseName + "-dark.svg")), $dark)
  [IO.File]::WriteAllText((Join-Path $out ($f.BaseName + "-light.svg")), $light)
  [IO.File]::WriteAllText((Join-Path $out ($f.BaseName + "-transparent.svg")), $clear)
  $inline[$f.BaseName.Substring(0,1)] = $t.Replace("{{INK}}", "currentColor").Replace("{{BG}}", "")
}

$page = [IO.File]::ReadAllText((Join-Path $src "review-template.html"))
# Profile-picture crops: square viewBox around the mark, wordmark removed for A and B
$crops = @{ A = "55 0 330 330"; B = "40 30 320 320"; C = "0 30 400 400" }
foreach ($k in "A","B","C") {
  $m = [regex]::Replace($inline[$k], 'viewBox="[^"]*"', "viewBox=`"$($crops[$k])`"")
  if ($k -ne "C") { $m = [regex]::Replace($m, '<text[^>]*>[^<]*</text>', '') }
  $m = $m.Replace('id="a-ball"','id="a-ball-m"').Replace('url(#a-ball)','url(#a-ball-m)').Replace('id="b-ring"','id="b-ring-m"').Replace('url(#b-ring)','url(#b-ring-m)')
  $page = $page.Replace("{{$($k)_MARK}}", $m)
}
foreach ($k in "A","B","C") { $page = $page.Replace("{{$k}}", $inline[$k]) }
[IO.File]::WriteAllText((Join-Path $root "HoopLife-Logo-Concepts.html"), $page)
Write-Output "Built:"; Get-ChildItem $out | Select-Object -ExpandProperty Name
