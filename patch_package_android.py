import json

with open('android-app/package.json', 'r') as f:
    data = json.load(f)

if 'allowScripts' not in data:
    data['allowScripts'] = {}
data['allowScripts']['esbuild'] = True

with open('android-app/package.json', 'w') as f:
    json.dump(data, f, indent=2)
print("Patched android-app/package.json")
