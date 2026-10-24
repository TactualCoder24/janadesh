"""Make the constituency maps lighter to download: simplify every arc of the TopoJSON files in source/maps (pc.json, states.json, ac/*.json).

Arcs are shared by neighbouring seats, so simplifying each arc on its own keeps the seats fitting together. The tolerance is a fraction of the map's width
(about a fifth of a pixel at the size the map is drawn), and never more than a few percent of the arc's own extent, so small city seats keep their shape.
Each arc is then written as a short string (see poly), which the page decodes when it loads the map. The untouched originals are copied to dl/maps-orig/ the first time, and a file that has been simplified is marked and skipped, so this is safe to run again.
Every seat's area is compared before and after; the script stops if any seat changes by more than 12%.

  python build/simplify_maps.py            # simplify in place
  python build/simplify_maps.py --check    # only report what would change
"""
import os, sys, json, glob, shutil, math
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MAPS = os.path.join(ROOT, 'source', 'maps')
ORIG = os.path.join(ROOT, 'dl', 'maps-orig')
CHECK = '--check' in sys.argv

def decode(arc):
    x = y = 0; out = []
    for dx, dy in arc: x += dx; y += dy; out.append((x, y))
    return out

def encode(pts):
    out = []; px = py = 0
    for x, y in pts: out.append([x - px, y - py]); px, py = x, y
    return out

def poly(deltas):
    """each arc as a short string: the integer steps as zig-zag varints, five bits to a character (the Google polyline method without the 1e5 scaling)"""
    out = []
    for dx, dy in deltas:
        for n in (dx, dy):
            v = ~(n << 1) if n < 0 else n << 1
            while v >= 0x20: out.append(chr((0x20 | (v & 0x1f)) + 63)); v >>= 5
            out.append(chr(v + 63))
    return ''.join(out)

def dp(pts, tol):
    """Douglas-Peucker on a list of points, iterative, the end points are always kept"""
    n = len(pts)
    if n <= 2: return pts
    keep = [False] * n; keep[0] = keep[-1] = True; stack = [(0, n - 1)]
    while stack:
        a, b = stack.pop(); ax, ay = pts[a]; bx, by = pts[b]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy); best = -1; bi = -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = math.hypot(px - ax, py - ay) if L == 0 else abs(dy * (px - ax) - dx * (py - ay)) / L
            if d > best: best, bi = d, i
        if best > tol: keep[bi] = True; stack.append((a, bi)); stack.append((bi, b))
    return [p for p, k in zip(pts, keep) if k]

def ring_area(coords):
    return abs(sum(coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1] for i in range(len(coords) - 1))) / 2

def ring_coords(arcs, idx):
    out = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(a if not out else a[1:])
    return out

def areas(j, arcs_abs):
    res = []
    for o in j['objects'].values():
        for g in o['geometries']:
            polys = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']] if g['type'] == 'Polygon' else []
            a = 0
            for poly in polys:
                for k, ring in enumerate(poly):
                    r = ring_area(ring_coords(arcs_abs, ring)); a += r if k == 0 else -r
            res.append(a)
    return res

def simplify(j):
    sx, sy = j['transform']['scale']; arcs = [decode(a) for a in j['arcs']]
    xs = [p[0] for a in arcs for p in a]; ys = [p[1] for a in arcs for p in a]
    width = (max(xs) - min(xs)) * sx
    tol = (width / 1800.0) / sx           # in the map's own integer units
    q = max(1, round((width / 14000.0) / sx))   # coarser grid: one step is about width / 14000 (200 m on the India map)
    before = areas(j, arcs); new = []
    for a in arcs:
        if len(a) > 3:
            ext = max(max(p[0] for p in a) - min(p[0] for p in a), max(p[1] for p in a) - min(p[1] for p in a))
            a = dp(a, min(tol, 0.03 * ext))
        if q > 1:
            c = []
            for x, y in a:
                p = (round(x / q), round(y / q))
                if not c or p != c[-1]: c.append(p)
            a = c if len(c) >= 2 else [c[0], c[0]]
        new.append(a)
    after = [v * q * q for v in areas(j, new)]
    worst = max((abs(b - a) / b for b, a in zip(before, after) if b > 0), default=0)
    return new, before, after, worst, q

def main():
    files = [os.path.join(MAPS, 'pc.json'), os.path.join(MAPS, 'states.json')] + sorted(glob.glob(os.path.join(MAPS, 'ac', '*.json')))
    tot0 = tot1 = 0
    for f in files:
        j = json.load(open(f, encoding='utf-8')); size0 = os.path.getsize(f)
        if j.get('simplified'): tot0 += size0; tot1 += size0; continue
        new, before, after, worst, q = simplify(j)
        if worst > 0.12: raise SystemExit(f'{os.path.basename(f)}: a seat changes by {worst:.0%}, nothing written')
        pts0 = sum(len(a) for a in j['arcs']); pts1 = sum(len(a) for a in new)
        j['arcs'] = [poly(encode(a)) for a in new]; j['enc'] = 'poly'; j['simplified'] = 1; j['transform']['scale'] = [v * q for v in j['transform']['scale']]
        raw = json.dumps(j, separators=(',', ':'))
        tot0 += size0; tot1 += len(raw.encode('utf-8'))
        print(f"{os.path.relpath(f, MAPS):26s} {size0 // 1024:5d} KB -> {len(raw) // 1024:5d} KB, points {pts0} -> {pts1}, largest seat change {worst:.1%}")
        if not CHECK:
            rel = os.path.relpath(f, MAPS); dest = os.path.join(ORIG, rel); os.makedirs(os.path.dirname(dest), exist_ok=True)
            if not os.path.exists(dest): shutil.copyfile(f, dest)
            open(f, 'w', encoding='utf-8', newline='').write(raw)
    print(f'maps: {tot0 // 1024} KB -> {tot1 // 1024} KB' + (' (check only)' if CHECK else ''))

if __name__ == '__main__':
    main()
