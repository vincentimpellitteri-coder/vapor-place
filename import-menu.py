"""
import-menu.py
Reads menu-editnew.xlsx and writes js/menu-data.js and js/menu-data.json.
Run this after editing the spreadsheet:
    python import-menu.py
"""
import json, openpyxl

TYPE_PREFIX = {
    'Disposable':      'DISP',
    'Salt Nic':        'SALT',
    'Sub-Ohm':         'SUB',
    'Kit':             'KIT',
    'Salt Nic/Sub-Ohm':'SALT',   # dual-type: shows under Salt AND Sub-Ohm filters
}

DUAL_TYPES = {'Salt Nic/Sub-Ohm'}

# Hidden search aliases — brand words that users type split (e.g. "sad" or "boy" → finds Sadboy)
SEARCH_ALIASES = [
    ('Sadboy', 'sad boy'),
]

wb = openpyxl.load_workbook('menu-editnew.xlsx')
ws = wb.active

data = []
for row in ws.iter_rows(min_row=2, values_only=True):
    typ, name, profile, image = row[0], row[1], row[2], row[3]
    if not name or str(name).strip() == '':
        continue
    typ_str = str(typ).strip()
    prefix = TYPE_PREFIX.get(typ_str, typ_str)
    entry = {
        'name':    prefix + ' ' + str(name).strip(),
        'profile': str(profile).strip() if profile else '',
        'image':   str(image).strip() if image else '',
    }
    if typ_str in DUAL_TYPES:
        entry['types'] = ['SALT', 'SUB']
    # Add hidden tags for split-word brand searches
    tags = []
    for brand, alias in SEARCH_ALIASES:
        if brand.lower() in entry['name'].lower():
            tags.append(alias)
    if tags:
        entry['tags'] = ' '.join(tags)
    data.append(entry)

with open('js/menu-data.js', 'w', encoding='utf-8') as f:
    f.write('const MENU_DATA = ' + json.dumps(data, ensure_ascii=False) + ';')

with open('js/menu-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Done — wrote {len(data)} entries to js/menu-data.js and js/menu-data.json')
