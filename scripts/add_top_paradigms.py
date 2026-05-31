import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/_JOB_/APP/norsk-app/public/glosses.json', encoding='utf-8') as f:
    g = json.load(f)

# Verbs — (canonical_key, class, inf, present, preterite, perfect, imperative)
VERBS = [
    ('finne',   'strong', 'å finne',   'finner',   'fant',   'har funnet',   'finn'),
    ('kalle',   'weak_2', 'å kalle',   'kaller',   'kalte',  'har kalt',     'kall'),
    ('se',      'strong', 'å se',      'ser',      'så',     'har sett',     'se'),
    ('bruke',   'weak_2', 'å bruke',   'bruker',   'brukte', 'har brukt',    'bruk'),
    ('jobbe',   'weak_1', 'å jobbe',   'jobber',   'jobbet', 'har jobbet',   'jobb'),
    ('trenge',  'weak_2', 'å trenge',  'trenger',  'trengte','har trengt',   'treng'),
    ('lage',    'weak_1', 'å lage',    'lager',    'laget',  'har laget',    'lag'),
    ('ligge',   'strong', 'å ligge',   'ligger',   'lå',     'har ligget',   'ligg'),
    ('føde',    'weak_2', 'å føde',    'føder',    'fødte',  'har født',     'fød'),
    ('hevde',   'weak_1', 'å hevde',   'hevder',   'hevdet', 'har hevdet',   'hevd'),
    ('kjøre',   'weak_2', 'å kjøre',   'kjører',   'kjørte', 'har kjørt',    'kjør'),
    # other very common verbs from the broader list
    ('ha',      'strong', 'å ha',      'har',      'hadde',  'har hatt',     'ha'),
    ('være',    'strong', 'å være',    'er',       'var',    'har vært',     'vær'),
    ('gjøre',   'strong', 'å gjøre',   'gjør',     'gjorde', 'har gjort',    'gjør'),
    ('si',      'strong', 'å si',      'sier',     'sa',     'har sagt',     'si'),
]

# Nouns — (canonical_key, gender, sg_indef, sg_def, pl_indef, pl_def)
NOUNS = [
    ('nordmann',       'm', 'nordmann',       'nordmannen',       'nordmenn',       'nordmennene'),
    ('liv',            'n', 'liv',            'livet',            'liv',            'livene'),
    ('jobb',           'm', 'jobb',           'jobben',           'jobber',         'jobbene'),
    ('lege',           'm', 'lege',           'legen',            'leger',          'legene'),
    ('innvandrer',     'm', 'innvandrer',     'innvandreren',     'innvandrere',    'innvandrerne'),
    ('arbeidsgiver',   'm', 'arbeidsgiver',   'arbeidsgiveren',   'arbeidsgivere',  'arbeidsgiverne'),
    ('olje',           'm', 'olje',           'oljen',            'oljer',          'oljene'),
    ('time',           'm', 'time',           'timen',            'timer',          'timene'),
    ('henvisning',     'm', 'henvisning',     'henvisningen',     'henvisninger',   'henvisningene'),
    ('arbeidsmarked',  'n', 'arbeidsmarked',  'arbeidsmarkedet',  'arbeidsmarkeder','arbeidsmarkedene'),
    ('apotek',         'n', 'apotek',         'apoteket',         'apotek',         'apotekene'),
    ('allemannsrett',  'm', 'allemannsrett',  'allemannsretten',  '',               ''),  # abstract, no plural
    # pluralia tantum
    ('penger',         'm', 'penger',         'pengene',          'penger',         'pengene'),  # only plural
]

# Adjectives — (canonical_key, indef_m_f, indef_n, indef_pl, definite, comparative, superlative)
ADJ = [
    ('annen',     'annen',     'annet',     'andre',     'andre',     '',          ''),  # other (irregular)
    ('første',    'første',    'første',    'første',    'første',    '',          ''),  # ordinal first (invariable)
    ('gratis',    'gratis',    'gratis',    'gratis',    'gratis',    '',          ''),  # invariable loan adj
    ('populær',   'populær',   'populært',  'populære',  'populære',  'mer populær','mest populær'),
]

added_v = 0; added_n = 0; added_a = 0
for vals in VERBS:
    k, vclass, inf, pres, pret, perf, imp = vals
    forms = {'infinitive': inf, 'present': pres, 'preterite': pret, 'perfect': perf, 'imperative': imp}
    if k in g:
        g[k]['verb_class'] = vclass
        g[k]['forms'] = forms
        g[k]['pos'] = 'verb'
    else:
        # find an existing inflected form to copy translation
        existing = None
        for f in forms.values():
            n = f.replace('å ','').replace('har ','').strip()
            if n in g:
                existing = g[n]; break
        g[k] = {
            'translation': existing.get('translation','') if existing else '',
            'transcription': existing.get('transcription','') if existing else '',
            'pos': 'verb',
            'dict': existing.get('dict','') if existing else '',
            'verb_class': vclass,
            'forms': forms,
        }
    added_v += 1

for vals in NOUNS:
    k, gender, si, sd, pi, pd = vals
    forms = {'sg_indef': si, 'sg_def': sd}
    if pi: forms['pl_indef'] = pi
    if pd: forms['pl_def'] = pd
    if k in g:
        g[k]['gender'] = gender
        g[k]['forms'] = forms
        g[k]['pos'] = 'noun'
    else:
        existing = None
        for f in forms.values():
            if f in g:
                existing = g[f]; break
        g[k] = {
            'translation': existing.get('translation','') if existing else '',
            'transcription': existing.get('transcription','') if existing else '',
            'pos': 'noun',
            'dict': existing.get('dict','') if existing else '',
            'gender': gender,
            'forms': forms,
        }
    added_n += 1

for vals in ADJ:
    k, imf, ineu, ipl, defi, comp, sup = vals
    forms = {'indef_m_f': imf, 'indef_n': ineu, 'indef_pl': ipl, 'definite': defi}
    if comp: forms['comparative'] = comp
    if sup: forms['superlative'] = sup
    if k in g:
        g[k]['forms'] = forms
        g[k]['pos'] = 'adj'
    else:
        existing = None
        for f in forms.values():
            if f in g:
                existing = g[f]; break
        g[k] = {
            'translation': existing.get('translation','') if existing else '',
            'transcription': existing.get('transcription','') if existing else '',
            'pos': 'adj',
            'dict': existing.get('dict','') if existing else '',
            'forms': forms,
        }
    added_a += 1

print(f'Verbs: {added_v}, Nouns: {added_n}, Adj: {added_a}')

g = dict(sorted(g.items()))
with open('c:/_JOB_/APP/norsk-app/public/glosses.json', 'w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)
print('Saved.')
