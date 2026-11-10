# Shared artwork for the realistic ninja ball (ball centre 200,180, radius 110).
$DEFS = @'
<defs>
  <radialGradient id="nb-ball" cx="0.38" cy="0.3" r="0.78">
    <stop offset="0" stop-color="#FFB169"/><stop offset="0.35" stop-color="#F27C2C"/>
    <stop offset="0.78" stop-color="#C2501A"/><stop offset="1" stop-color="#6E2709"/>
  </radialGradient>
  <radialGradient id="nb-shade" cx="0.36" cy="0.28" r="0.85">
    <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
  </radialGradient>
  <radialGradient id="nb-spec" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.6"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="nb-mask" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3C3C43"/><stop offset="0.35" stop-color="#151518"/><stop offset="1" stop-color="#040405"/>
  </linearGradient>
  <linearGradient id="nb-red" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F2545A"/><stop offset="0.5" stop-color="#D7262E"/><stop offset="1" stop-color="#8A0F15"/>
  </linearGradient>
  <linearGradient id="nb-tail" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#B3161D"/><stop offset="1" stop-color="#E4393F"/>
  </linearGradient>
  <linearGradient id="nb-eye" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9CED6"/>
  </linearGradient>
  <linearGradient id="nb-gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#F6DC8A"/><stop offset="0.5" stop-color="#C9A24A"/><stop offset="1" stop-color="#8A6420"/>
  </linearGradient>
  <radialGradient id="nb-hood" cx="0.45" cy="0.25" r="0.9">
    <stop offset="0" stop-color="#43434B"/><stop offset="0.5" stop-color="#1B1B1F"/><stop offset="1" stop-color="#070708"/>
  </radialGradient>
  <clipPath id="nb-clip"><circle cx="200" cy="180" r="110"/></clipPath>
  <filter id="nb-grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <filter id="nb-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="nb-drop" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
  </filter>
</defs>
'@

$BALL = @'
<g clip-path="url(#nb-clip)">
  <circle cx="200" cy="180" r="110" fill="url(#nb-ball)"/>
  <rect x="90" y="70" width="220" height="220" filter="url(#nb-grain)" opacity="0.16" style="mix-blend-mode:multiply"/>
  <g fill="none" stroke="#2A1206" stroke-width="4.5" stroke-linecap="round">
    <path d="M214,70 C190,130 190,230 214,290"/>
    <path d="M120,98 C162,148 162,214 122,264"/>
    <path d="M298,104 C260,148 260,214 296,260"/>
  </g>
</g>
'@

$HEADBAND = @'
<g clip-path="url(#nb-clip)">
  <path d="M85,110 Q200,140 315,110 L315,134 Q200,164 85,134 Z" fill="url(#nb-red)"/>
  <path d="M85,113 Q200,143 315,113" fill="none" stroke="#FF9A9E" stroke-opacity="0.5" stroke-width="1.5"/>
</g>
'@

$MASK = @'
<g clip-path="url(#nb-clip)">
  <path d="M85,142 Q200,172 315,142 L315,198 Q200,228 85,198 Z" fill="url(#nb-mask)"/>
  <path d="M85,145 Q200,175 315,145" fill="none" stroke="#6A6A72" stroke-opacity="0.6" stroke-width="1.5"/>
  <path d="M100,188 Q200,214 300,188" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="2"/>
</g>
<path d="M134,178 Q162,180 190,192 L186,203 Q160,200 142,194 Z" fill="url(#nb-eye)"/>
<path d="M266,178 Q238,180 210,192 L214,203 Q240,200 258,194 Z" fill="url(#nb-eye)"/>
'@

$SHADE = @'
<circle cx="200" cy="180" r="110" fill="url(#nb-shade)"/>
<ellipse cx="158" cy="110" rx="40" ry="22" fill="url(#nb-spec)" transform="rotate(-25 158 110)"/>
<circle cx="200" cy="180" r="109" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="2"/>
'@

$TAILS = @'
<path d="M300,116 C335,98 360,80 394,84 C382,92 374,99 368,108 C346,112 328,126 306,134 Z" fill="url(#nb-tail)"/>
<path d="M318,117 C340,105 360,93 382,89" fill="none" stroke="#FF8A8F" stroke-opacity="0.45" stroke-width="2"/>
<path d="M302,130 C338,136 356,156 386,166 C374,170 366,176 358,183 C338,170 322,154 300,146 Z" fill="#9A1118"/>
'@

$KNOT = '<ellipse cx="308" cy="128" rx="11" ry="13" fill="url(#nb-red)"/>'
$GROUND = '<ellipse cx="200" cy="304" rx="82" ry="10" fill="#000" opacity="0.35" filter="url(#nb-soft)"/>'

$NINJA = "<g filter=`"url(#nb-drop)`">$TAILS$BALL$HEADBAND$MASK$KNOT$SHADE</g>"

$HOOD_BACK = '<path d="M200,48 C292,48 348,116 348,200 C348,262 318,300 296,316 L104,316 C82,300 52,262 52,200 C52,116 108,48 200,48 Z" fill="url(#nb-hood)"/>'
$HOOD_FRONT = @'
<path d="M86,160 C88,92 140,62 200,62 C260,62 312,92 314,160 C296,120 252,100 200,100 C148,100 104,120 86,160 Z" fill="url(#nb-hood)"/>
<path d="M86,160 C104,120 148,100 200,100 C252,100 296,120 314,160" fill="none" stroke="#5A5A63" stroke-opacity="0.7" stroke-width="2"/>
'@
$HOODED = "<g filter=`"url(#nb-drop)`">$HOOD_BACK$BALL$MASK$SHADE$HOOD_FRONT</g>"

$FONT = "<style>@import url('https://fonts.googleapis.com/css2?family=Anton&amp;display=swap');</style>"
$WORD = "font-family=`"Anton, Impact, 'Arial Black', sans-serif`""
