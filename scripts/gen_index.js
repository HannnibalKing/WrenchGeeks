const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'docs', 'data', 'relationships.json');
const outGenPath = path.join(__dirname, '..', 'docs', 'GEN_CODED_INDEX.md');
const outTrimNoGenPath = path.join(__dirname, '..', 'docs', 'TRIM_NO_GEN_REPORT.md');

function loadJson(p) {
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

function isGenCoded(model) {
  if (!model || typeof model !== 'string') return false;
  return model.includes('(') || /Gen\s*\d+/i.test(model);
}

const TRIM_KEYWORDS = [
  'SS','GXP','GTP','SVT','SRT-6','SRT-4','SRT','STI','Type R','Si','AMG','Cobra','Shelby','Boss','Nismo','Evo','Red Line','Turbo','R/T','Hellcat','Demon','Scat Pack'
];

function hasTrimKeyword(model) {
  if (!model || typeof model !== 'string') return false;
  return TRIM_KEYWORDS.some(k => model.toLowerCase().includes(k.toLowerCase()));
}

function scan() {
  const data = loadJson(dataPath);
  const buckets = { genCoded: {}, trimNoGen: {} };
  const sections = ['platforms','engines'];

  for (const sec of sections) {
    const obj = data[sec];
    if (!obj || typeof obj !== 'object') continue;
    for (const groupName of Object.keys(obj)) {
      const items = obj[groupName];
      if (!Array.isArray(items)) continue;
      for (const it of items) {
        const make = it.make || 'Unknown';
        const model = it.model || '';
        const years = it.years || '';
        const notes = it.notes || '';

        // Gen-coded list
        if (isGenCoded(model)) {
          if (!buckets.genCoded[make]) buckets.genCoded[make] = [];
          buckets.genCoded[make].push({ model, years, group: groupName, section: sec, notes });
        }

        // Trim keyword but not gen-coded
        if (hasTrimKeyword(model) && !isGenCoded(model)) {
          if (!buckets.trimNoGen[make]) buckets.trimNoGen[make] = [];
          buckets.trimNoGen[make].push({ model, years, group: groupName, section: sec, notes });
        }
      }
    }
  }

  // Write GEN_CODED_INDEX.md
  let genMd = '# Gen-Coded Vehicle Index\n\n';
  const genMakes = Object.keys(buckets.genCoded).sort();
  for (const mk of genMakes) {
    genMd += `## ${mk}\n`;
    for (const e of buckets.genCoded[mk]) {
      genMd += `- **Model:** ${e.model} — **Years:** ${e.years} — **Group:** ${e.group} (${e.section})${e.notes ? ` — ${e.notes}` : ''}\n`;
    }
    genMd += '\n';
  }

  // Write TRIM_NO_GEN_REPORT.md
  let trimMd = '# Trim Without Generation Code Report\n\n';
  trimMd += 'Entries with performance/trim keywords but no generation/chassis code in the model.\n\n';
  const trimMakes = Object.keys(buckets.trimNoGen).sort();
  for (const mk of trimMakes) {
    trimMd += `## ${mk}\n`;
    for (const e of buckets.trimNoGen[mk]) {
      trimMd += `- **Model:** ${e.model} — **Years:** ${e.years} — **Group:** ${e.group} (${e.section})${e.notes ? ` — ${e.notes}` : ''}\n`;
    }
    trimMd += '\n';
  }

  fs.writeFileSync(outGenPath, genMd, 'utf8');
  fs.writeFileSync(outTrimNoGenPath, trimMd, 'utf8');

  console.log('Generated:', outGenPath);
  console.log('Generated:', outTrimNoGenPath);
}

scan();
