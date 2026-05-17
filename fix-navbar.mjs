import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/locale/messages.en.xlf', 'utf-8');

// Fix each TAG_IMG entry by finding lines with source containing TAG_IMG and target without <x>
const lines = content.split('\n');
let count = 0;
let inXElement = false;
let currentXElement = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line has a source with TAG_IMG and a target without <x>
  const match = line.match(/^(.*<source>)(<x\s+id="TAG_IMG"[^>]*\/>)\s*(.*?)(<\/source><target>)([^<].*?)(<\/target>.*)$/);
  
  if (match) {
    const prefix = match[1];     // everything before <source>
    const xElement = match[2];   // the <x .../> tag
    const text = match[3];       // text between x element and </source>
    const mid = match[4];        // </source><target>
    const targetText = match[5]; // target text (without <x>)
    const suffix = match[6];     // </target> and anything after
    
    lines[i] = `${prefix}${xElement} ${text}${mid}${xElement} ${targetText}${suffix}`;
    count++;
    console.log(`Fixed line ${i+1}: ${text.trim()} -> ${targetText.trim()}`);
  }
}

content = lines.join('\n');
console.log(`\nFixed ${count} navbar icon entries total`);
writeFileSync('src/locale/messages.en.xlf', content, 'utf-8');

// Fix "Tarifas" -> "Rates" (has different src: calendar-ico.svg but different trans unit)
const tarifasRegex = /(<source><x\s+id="TAG_IMG"\s+ctype="image"\s+equiv-text="&lt;img\s+src=&quot;\/iconos\/calendar-ico\.svg&quot;\s+class=&quot;nv-icon&quot;&gt;"\/>)\s*Tarifas\s*<\/source><target>Rates<\/target>/;
result = result.replace(tarifasRegex, (match, xElement) => {
  count++;
  return `<source>${xElement} Tarifas </source><target>${xElement} Rates </target>`;
});

// Check remaining TAG_IMG entries without <x> in target
const remaining = result.match(/TAG_IMG[^<]*<\/source><target>(?!<x)([^<]+)<\/target>/g);
if (remaining) {
  console.log(`WARNING: Still missing <x> in target for:`);
  remaining.forEach(r => console.log(`  ${r.substring(0, 120)}`));
}

console.log(`Fixed ${count} navbar icon entries`);
writeFileSync('src/locale/messages.en.xlf', result, 'utf-8');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
