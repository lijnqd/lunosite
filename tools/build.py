#!/usr/bin/env python3
"""Bundle every site script into one minified file, js/app.min.js, and point all pages at it.

Each module runs in its own scope and inside try/catch, so one failing module never stops
the others; page-specific modules run only when their block is on the page.
The preloader stays synchronous: its minified code is inlined into each page's head.
Usage: python3 tools/build.py <path-to-terser>"""
import os, re, subprocess, sys, time, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TERSER = sys.argv[1]
# document order of the old deferred tags: lenis must precede smooth
MODS = [('lenis.min', None), ('ascii', None), ('pixfx', None), ('nav', None), ('cursor', None),
        ('reviews', '#rqRow'), ('cases', '#csStack'), ('adv', '.adv.av'), ('services', '#services'),
        ('stats', '.stats'), ('case', '.cx-title'), ('main', '.hero'), ('cat', '.hero-c .cat'), ('cookies', None),
        ('dotmorph', None), ('track', None), ('form', '#form'), ('faq', '.fq-grid'),
        ('smooth', None), ('expertise', '.exp')]
parts = []
for name, sel in MODS:
    code = open(os.path.join(ROOT, 'js', name + '.js')).read()
    guard = f"if(!document.querySelector({sel!r}))return;" if sel else ''
    parts.append(f"(function(){{{guard}try{{\n{code}\n}}catch(e){{console.error('[{name}]',e)}}}})();")
src = '\n'.join(parts)
tmp = os.path.join(ROOT, 'tools', '.bundle.js'); open(tmp, 'w').write(src)
out = os.path.join(ROOT, 'js', 'app.min.js')
subprocess.run([TERSER, tmp, '-c', 'passes=2', '-m', '--comments', 'false', '-o', out], check=True)
os.remove(tmp)
pre = subprocess.run([TERSER, os.path.join(ROOT, 'js', 'preloader.js'), '-c', '-m', '--comments', 'false'],
                     check=True, capture_output=True, text=True).stdout.strip()
v = int(time.time())
names = '|'.join(re.escape(n) for n, _ in MODS)
tag = re.compile(r'[ \t]*<script src="/?js/(?:%s)\.js(?:\?v=\d+)?" defer></script>\n?' % names)
for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
    if '/embeds/' in f or '/tools/' in f: continue
    h = open(f).read(); o = h
    h = re.sub(r'<script src="/js/app\.min\.js\?v=\d+" defer></script>', f'<script src="/js/app.min.js?v={v}" defer></script>', h)
    m = tag.search(h)
    if m:
        h = h[:m.start()] + f'<script src="/js/app.min.js?v={v}" defer></script>\n' + tag.sub('', h[m.start():])
    h = re.sub(r'<script src="/js/preloader\.js(?:\?v=\d+)?"></script>', lambda _: '<script id="pre-js">' + pre + '</script>', h)
    h = re.sub(r'<script id="pre-js">.*?</script>', lambda _: '<script id="pre-js">' + pre + '</script>', h, flags=re.S)
    if h != o: open(f, 'w').write(h)
print('app.min.js', os.path.getsize(out), 'bytes; preloader inline', len(pre))
