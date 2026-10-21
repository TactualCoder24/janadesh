"""Janadesh logo: a horseshoe of seats (the House) with the violet indelible-ink stroke standing at its centre.
Outputs SVGs (text converted to outlines, so no font is needed) and PNGs for GitHub."""
import math, os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'logo')
os.makedirs(OUT, exist_ok=True)
F = os.path.join(os.environ.get('JANADESH_DL', os.path.join(ROOT, 'dl')), 'gfonts', 'ofl')
INK, VIOLET, VIOLET_LT, WHITE, GREY = '#141414', '#4A2577', '#8E5BD0', '#FFFFFF', '#5D6068'

def static(path, axes, out):
    f = TTFont(path)
    inst = instancer.instantiateVariableFont(f, axes)
    inst.save(out)
    return out
LAT = static(f'{F}/aneklatin/AnekLatin[wdth,wght].ttf', {'wght': 800, 'wdth': 112}, f'{OUT}/_lat.ttf')
LAT_R = static(f'{F}/aneklatin/AnekLatin[wdth,wght].ttf', {'wght': 500, 'wdth': 100}, f'{OUT}/_latr.ttf')
DEV = static(f'{F}/anekdevanagari/AnekDevanagari[wdth,wght].ttf', {'wght': 700, 'wdth': 100}, f'{OUT}/_dev.ttf')

def text_path(fontfile, text, size, x, y):
    """Shape with HarfBuzz and return (svg path d, advance width)."""
    blob = hb.Blob.from_file_path(fontfile)
    face = hb.Face(blob); font = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {})
    tt = TTFont(fontfile); gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    upm = tt['head'].unitsPerEm; s = size / upm
    pen = SVGPathPen(gs); cx = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        tp = TransformPen(pen, (s, 0, 0, -s, x + (cx + pos.x_offset) * s, y - pos.y_offset * s))
        gs[name].draw(tp)
        cx += pos.x_advance
    return pen.getCommands(), cx * s

def mark(cx, cy, R, dot='#fff', ink=VIOLET_LT, rows=(7, 9, 11)):
    """Three-row horseshoe of seats around an ink stroke. R = outer radius."""
    radii = [R * 0.56, R * 0.78, R]
    dr = R * 0.085
    out = []
    for ri, (r, n) in enumerate(zip(radii, rows)):
        for j in range(n):
            if ri == 0 and j == n // 2:
                continue  # the ink stroke takes the inner centre seat
            a = math.pi - math.pi * j / (n - 1)
            out.append(f'<circle cx="{cx + r*math.cos(a):.2f}" cy="{cy - r*math.sin(a):.2f}" r="{dr:.2f}" fill="{dot}"/>')
    w = R * 0.19; h = R * 0.5
    out.append(f'<rect x="{cx - w/2:.2f}" y="{cy - h:.2f}" width="{w:.2f}" height="{h + dr:.2f}" rx="{w/2:.2f}" fill="{ink}"/>')
    return ''.join(out)

def svg(w, h, body, bg=None):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{b}{body}</svg>'

def save(name, s, png=None):
    open(f'{OUT}/{name}.svg', 'w').write(s)
    if png:
        cairosvg.svg2png(bytestring=s.encode(), write_to=f'{OUT}/{name}.png', output_width=png[0], output_height=png[1])

# 1. App icon / GitHub avatar: dark rounded square
icon = svg(512, 512, f'<rect width="512" height="512" rx="116" fill="{INK}"/>' + mark(256, 360, 190))
save('janadesh-icon', icon, (512, 512))
# 2. Mark for light backgrounds (no tile)
save('janadesh-mark', svg(512, 300, mark(256, 280, 240, dot=INK, ink=VIOLET)), (512, 300))
# 3. Horizontal lockup: mark + Janadesh + जनादेश
d1, w1 = text_path(LAT, 'Janadesh', 120, 330, 150)
d2, w2 = text_path(DEV, 'जनादेश', 64, 334, 240)
W = int(330 + max(w1, w2) + 30)
lock = svg(W, 280, f'<g>{mark(140, 240, 125, dot=INK, ink=VIOLET)}</g><path d="{d1}" fill="{INK}"/><path d="{d2}" fill="{VIOLET}"/>')
save('janadesh-logo', lock, (W * 2, 560))
lock_dark = svg(W, 280, f'<rect width="{W}" height="280" fill="{INK}"/>{mark(140, 240, 125)}<path d="{d1}" fill="#fff"/><path d="{d2}" fill="{VIOLET_LT}"/>')
save('janadesh-logo-dark', lock_dark, (W * 2, 560))
# 4. GitHub social preview 1280x640
t1, tw1 = text_path(LAT, 'Janadesh', 150, 520, 280)
t2, tw2 = text_path(DEV, 'जनादेश', 74, 524, 382)
t3, _ = text_path(LAT_R, 'Seat simulator for the Lok Sabha and every Vidhan Sabha', 30, 524, 460)
t4, _ = text_path(LAT_R, 'Simulation only. Not real results or forecasts.', 24, 524, 506)
soc = svg(1280, 640, f'<rect width="1280" height="640" fill="{INK}"/>{mark(270, 430, 205)}'
          f'<path d="{t1}" fill="#fff"/><path d="{t2}" fill="{VIOLET_LT}"/><path d="{t3}" fill="#D9DAE0"/><path d="{t4}" fill="#9A9DA8"/>'
          f'<rect x="0" y="626" width="1280" height="14" fill="{VIOLET_LT}"/>')
save('janadesh-social', soc, (1280, 640))
# favicon-size check
small = svg(512, 512, f'<rect width="512" height="512" rx="116" fill="{INK}"/>' + mark(256, 360, 190, rows=(5, 7, 9)))
save('janadesh-favicon', small)
cairosvg.svg2png(bytestring=small.encode(), write_to=f'{OUT}/janadesh-favicon-64.png', output_width=64, output_height=64)
for f in ['_lat.ttf', '_latr.ttf', '_dev.ttf']:
    os.remove(f'{OUT}/{f}')
print(sorted(os.listdir(OUT)))
