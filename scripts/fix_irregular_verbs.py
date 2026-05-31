import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/_JOB_/APP/norsk-app/scripts/_morphology_review.json', encoding='utf-8') as f:
    review = json.load(f)

with open('c:/_JOB_/APP/norsk-app/public/glosses.json', encoding='utf-8') as f:
    g = json.load(f)

# Step 1: delete forms from all entries in review (they're broken)
deleted = 0
for r in review:
    key = r['key']
    if key in g and 'forms' in g[key]:
        del g[key]['forms']
        if 'verb_class' in g[key]:
            del g[key]['verb_class']
        deleted += 1
print(f'Step 1: deleted broken forms from {deleted} entries')

# Step 2: add correct paradigms for canonical infinitives
CORRECT = {
    # strong verbs
    'bryte':     ('strong', 'å bryte',     'bryter',     'brøt',         'har brutt',    'bryt'),
    'avbryte':   ('strong', 'å avbryte',   'avbryter',   'avbrøt',       'har avbrutt',  'avbryt'),
    'drive':     ('strong', 'å drive',     'driver',     'drev',         'har drevet',   'driv'),
    'gripe':     ('strong', 'å gripe',     'griper',     'grep',         'har grepet',   'grip'),
    'nyte':      ('strong', 'å nyte',      'nyter',      'nøt',          'har nytt',     'nyt'),
    'skyte':     ('strong', 'å skyte',     'skyter',     'skjøt',        'har skutt',    'skyt'),
    'forlate':   ('strong', 'å forlate',   'forlater',   'forlot',       'har forlatt',  'forlat'),
    'slite':     ('strong', 'å slite',     'sliter',     'slet',         'har slitt',    'slit'),
    'oversette': ('strong', 'å oversette', 'oversetter', 'oversatte',    'har oversatt', 'oversett'),
    'gjennomgå': ('strong', 'å gjennomgå', 'gjennomgår', 'gjennomgikk',  'har gjennomgått', 'gjennomgå'),
    'bestå':     ('strong', 'å bestå',     'består',     'besto',        'har bestått',  'bestå'),
    'utelate':   ('strong', 'å utelate',   'utelater',   'utelot',       'har utelatt',  'utelat'),
    'tillate':   ('strong', 'å tillate',   'tillater',   'tillot',       'har tillatt',  'tillat'),
    'skryte':    ('strong', 'å skryte',    'skryter',    'skrøt',        'har skrytt',   'skryt'),
    'bøtelegge': ('strong', 'å bøtelegge', 'bøtelegger', 'bøtela',       'har bøtelagt', 'bøtelegg'),
    'innlegge':  ('strong', 'å innlegge',  'innlegger',  'innla',        'har innlagt',  'innlegg'),
    'yte':       ('strong', 'å yte',       'yter',       'ytte',         'har ytt',      'yt'),
    # weak_2 (-te / -t)
    'møte':       ('weak_2', 'å møte',       'møter',       'møtte',       'har møtt',       'møt'),
    'lete':       ('weak_2', 'å lete',       'leter',       'lette',       'har lett',       'let'),
    'erklære':    ('weak_2', 'å erklære',    'erklærer',    'erklærte',    'har erklært',    'erklær'),
    'svare':      ('weak_2', 'å svare',      'svarer',      'svarte',      'har svart',      'svar'),
    'tale':       ('weak_2', 'å tale',       'taler',       'talte',       'har talt',       'tal'),
    'løse':       ('weak_2', 'å løse',       'løser',       'løste',       'har løst',       'løs'),
    'mene':       ('weak_2', 'å mene',       'mener',       'mente',       'har ment',       'men'),
    'utvide':     ('weak_2', 'å utvide',     'utvider',     'utvidet',     'har utvidet',    'utvid'),
    'gjennomføre':('weak_2', 'å gjennomføre','gjennomfører','gjennomførte','har gjennomført','gjennomfør'),
    'omgjøre':    ('weak_2', 'å omgjøre',    'omgjør',      'omgjorde',    'har omgjort',    'omgjør'),
    'overlevere': ('weak_2', 'å overlevere', 'overleverer', 'overleverte', 'har overlevert', 'overlever'),
    'diktere':    ('weak_2', 'å diktere',    'dikterer',    'dikterte',    'har diktert',    'dikter'),
    'finansiere': ('weak_2', 'å finansiere', 'finansierer', 'finansierte', 'har finansiert', 'finansier'),
    'konstruere': ('weak_2', 'å konstruere', 'konstruerer', 'konstruerte', 'har konstruert', 'konstruer'),
    'lansere':    ('weak_2', 'å lansere',    'lanserer',    'lanserte',    'har lansert',    'lanser'),
    'nominere':   ('weak_2', 'å nominere',   'nominerer',   'nominerte',   'har nominert',   'nominer'),
    'passere':    ('weak_2', 'å passere',    'passerer',    'passerte',    'har passert',    'passer'),
    'plassere':   ('weak_2', 'å plassere',   'plasserer',   'plasserte',   'har plassert',   'plasser'),
    'lytte':      ('weak_2', 'å lytte',      'lytter',      'lyttet',      'har lyttet',     'lytt'),
    'slette':     ('weak_2', 'å slette',     'sletter',     'slettet',     'har slettet',    'slett'),
    'drifte':     ('weak_2', 'å drifte',     'drifter',     'driftet',     'har driftet',    'drift'),
    'forvalte':   ('weak_2', 'å forvalte',   'forvalter',   'forvaltet',   'har forvaltet',  'forvalt'),
    'forvente':   ('weak_2', 'å forvente',   'forventer',   'forventet',   'har forventet',  'forvent'),
    # weak_1 (-et / -et)
    'vente':  ('weak_1', 'å vente',  'venter',  'ventet',  'har ventet',  'vent'),
    'hente':  ('weak_1', 'å hente',  'henter',  'hentet',  'har hentet',  'hent'),
    'starte': ('weak_1', 'å starte', 'starter', 'startet', 'har startet', 'start'),
    'pynte':  ('weak_1', 'å pynte',  'pynter',  'pyntet',  'har pyntet',  'pynt'),
    'sulte':  ('weak_1', 'å sulte',  'sulter',  'sultet',  'har sultet',  'sult'),
}

added = 0
created = 0
for inf, vals in CORRECT.items():
    vclass, inf_form, pres, pret, perf, imp = vals
    forms = {'infinitive': inf_form, 'present': pres, 'preterite': pret, 'perfect': perf, 'imperative': imp}
    if inf in g:
        g[inf]['verb_class'] = vclass
        g[inf]['forms'] = forms
        g[inf]['pos'] = 'verb'
        added += 1
    else:
        existing = None
        for v in forms.values():
            norm = v.replace('å ', '').replace('har ', '').strip()
            if norm in g:
                existing = g[norm]
                break
        if existing:
            g[inf] = {
                'translation': existing.get('translation', ''),
                'transcription': existing.get('transcription', ''),
                'pos': 'verb',
                'dict': existing.get('dict', ''),
                'verb_class': vclass,
                'forms': forms,
            }
            created += 1
        else:
            print(f'  SKIP {inf}: no inflected form in glosses to copy from')

print(f'Step 2: enriched {added} existing canonicals, created {created} new canonical entries')

g = dict(sorted(g.items()))
with open('c:/_JOB_/APP/norsk-app/public/glosses.json', 'w', encoding='utf-8') as f:
    json.dump(g, f, ensure_ascii=False, indent=2)

with_forms = sum(1 for e in g.values() if e.get('forms'))
print(f'Total entries with forms: {with_forms}')
