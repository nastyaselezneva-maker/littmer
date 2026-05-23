// Audit partikkelverb across all content files.
// Finds cases where:
//   segments[i] = no with text == first-word-of-partikkel (e.g., "ser"/"tar"/"finner"/"blir"/etc)
//   segments[i+1] = ru with no field starting with " <particle>" (e.g., " ut", " med")
// and combines them into one no segment with pos:"phrase" and text = full partikkel form.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('c:/_JOB_/APP/norsk-app')
const CONTENT = path.join(ROOT, 'public', 'content')
const PHRASES = path.join(ROOT, 'scripts', 'PHRASES.json')
const DRY = process.argv.includes('--dry-run')
const VERBOSE = process.argv.includes('--verbose')

const data = JSON.parse(fs.readFileSync(PHRASES, 'utf-8'))
const PARTIKKEL = data.verb_preposition

const FORMS = {}
function addForms(verbBase, forms){FORMS[verbBase]=forms}
addForms('se',['se','ser','så','sett'])
addForms('ta',['ta','tar','tok','tatt'])
addForms('legge',['legge','legger','la','lagt'])
addForms('holde',['holde','holder','holdt'])
addForms('få',['få','får','fikk','fått'])
addForms('gå',['gå','går','gikk','gått'])
addForms('finne',['finne','finner','fant','funnet'])
addForms('gi',['gi','gir','ga','gitt'])
addForms('komme',['komme','kommer','kom','kommet'])
addForms('bli',['bli','blir','ble','blitt'])
addForms('sette',['sette','setter','satte','satt'])
addForms('gjøre',['gjøre','gjør','gjorde','gjort'])
addForms('ha',['ha','har','hadde','hatt'])
addForms('bestå',['bestå','består','bestod','bestått'])
addForms('skille',['skille','skiller','skilte','skilt'])
addForms('spille',['spille','spiller','spilte','spilt'])
addForms('vise',['vise','viser','viste','vist'])
addForms('regne',['regne','regner','regnet'])
addForms('snakke',['snakke','snakker','snakket'])
addForms('tenke',['tenke','tenker','tenkte','tenkt'])
addForms('stå',['stå','står','stod','stått'])
addForms('begynne',['begynne','begynner','begynte','begynt'])
addForms('slutte',['slutte','slutter','sluttet'])
addForms('satse',['satse','satser','satset'])
addForms('advare',['advare','advarer','advarte','advart'])
addForms('slite',['slite','sliter','slet','slitt'])
addForms('argumentere',['argumentere','argumenterer','argumenterte'])
addForms('mangle',['mangle','mangler','manglet'])

const FORM_TO_INF = {}
for (const [inf, forms] of Object.entries(FORMS)){
  for (const f of forms){ FORM_TO_INF[f.toLowerCase()] = inf }
}

const PARTIKKEL_BY_VERB = {}
for (const p of PARTIKKEL){
  const fw = p.split(/\s+/)[0].toLowerCase()
  if (!PARTIKKEL_BY_VERB[fw]){PARTIKKEL_BY_VERB[fw]=[]}
  PARTIKKEL_BY_VERB[fw].push(p)
}
for (const k of Object.keys(PARTIKKEL_BY_VERB)){
  PARTIKKEL_BY_VERB[k].sort((a,b)=>b.length-a.length)
}

const CYR = {a:'а',b:'б',c:'к',d:'д',e:'э',f:'ф',g:'г',h:'х',i:'и',j:'й',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',q:'к',r:'р',s:'с',t:'т',u:'у',v:'в',w:'в',x:'кс',y:'ю',z:'з','å':'о','ø':'ё','æ':'э'}
function transcribe(s){return s.toLowerCase().split('').map(c=>CYR[c]||c).join('')}

function buildNo(segs){
  return segs.map(s=>s.type==='ru'?(s.no||''):(s.text||'')).join('')
}

function escapeRegex(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}

const stats = {files:0, changed:0, joins:0, perPartikkel:{}, skipped:[], errors:[]}

function tryMerge(segs, i){
  const seg = segs[i]
  const next = segs[i+1]
  if (!seg || seg.type!=='no' || typeof seg.text!=='string') return null
  if (!next || next.type!=='ru' || typeof next.no!=='string') return null

  const verbText = seg.text.trim()
  const verbLow = verbText.toLowerCase()
  const firstWord = verbLow.split(/\s+/)[0]
  const inf = FORM_TO_INF[firstWord]
  if (!inf) return null
  const candidates = PARTIKKEL_BY_VERB[inf] || []
  if (candidates.length===0) return null

  for (const cand of candidates){
    const candWords = cand.split(/\s+/)
    const verbWords = verbLow.split(/\s+/)
    if (verbWords.length >= candWords.length) continue
    const remaining = candWords.slice(verbWords.length).join(' ')
    let okPrefix = true
    for (let k=1; k<verbWords.length; k++){
      if (verbWords[k] !== candWords[k].toLowerCase()){okPrefix=false; break}
    }
    if (!okPrefix) continue

    const re = new RegExp('^(\\s+)'+escapeRegex(remaining)+'(?=[\\s.,!?;:"]|$)','i')
    const m = next.no.match(re)
    if (!m) continue

    const restAfter = next.no.slice(m[0].length)
    if (cand === 'ser ut' && /^\s*av\s+\S/i.test(restAfter)){
      stats.skipped.push({file:'_pending', reason:'ser ut av — literal', text:verbText+next.no.slice(0,40)})
      continue
    }

    const newText = verbText + ' ' + remaining
    const translation = seg.translation || cand
    const dict = seg.dict || cand
    let trans = seg.transcription || ''
    trans = trans.trim() + ' ' + transcribe(remaining)
    const newSeg = {
      type: 'no',
      text: newText,
      translation,
      transcription: trans,
      pos: 'phrase',
    }
    if (dict) newSeg.dict = dict
    for (const k of Object.keys(seg)){
      if(!['type','text','translation','dict','transcription','pos'].includes(k)) newSeg[k]=seg[k]
    }
    const newNext = {...next, no: next.no.slice(m[0].length)}
    return {merged: [newSeg, newNext], cand}
  }
  return null
}

function processSegs(segs, fname){
  const out = []
  let chg = false
  let i = 0
  while (i < segs.length){
    const r = tryMerge(segs, i)
    if (r){
      out.push(r.merged[0])
      out.push(r.merged[1])
      chg = true
      stats.joins++
      stats.perPartikkel[r.cand] = (stats.perPartikkel[r.cand]||0)+1
      if (VERBOSE) console.log(`  [${fname}] partikkel: "${r.merged[0].text}" (canonical: ${r.cand})`)
      i += 2
      continue
    }
    out.push(segs[i])
    i++
  }
  return {segs: out, chg}
}

const files = fs.readdirSync(CONTENT).filter(f=>f.endsWith('.json')).sort()
for (const f of files){
  const fp = path.join(CONTENT, f)
  let raw, json
  try { raw=fs.readFileSync(fp,'utf-8'); json=JSON.parse(raw) } catch(e){ continue }
  if (!Array.isArray(json.segments)) continue
  stats.files++
  const orig = buildNo(json.segments)
  const r = processSegs(json.segments, f)
  if (!r.chg) continue
  const newNo = buildNo(r.segs)
  if (newNo !== orig){
    stats.errors.push({file:f, orig:orig.slice(0,150), new:newNo.slice(0,150)})
    continue
  }
  for (const sk of stats.skipped){ if (sk.file==='_pending') sk.file=f }
  json.segments = r.segs
  if (!DRY) fs.writeFileSync(fp, JSON.stringify(json), 'utf-8')
  stats.changed++
}

console.log(`Files scanned: ${stats.files}`)
console.log(`Files changed: ${stats.changed}`)
console.log(`Joins: ${stats.joins}`)
console.log(`\nTop partikkelverb:`)
Object.entries(stats.perPartikkel).sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([k,v])=>console.log(`  ${v.toString().padStart(3)} ${k}`))
console.log(`\nSkipped (literal/false-positive): ${stats.skipped.length}`)
stats.skipped.slice(0,10).forEach(s=>console.log(`  [${s.file}] ${s.reason}: ${s.text}`))
if (stats.errors.length){
  console.log(`\nErrors: ${stats.errors.length}`)
  stats.errors.slice(0,5).forEach(e=>console.log(`  [${e.file}]\n    orig: ${e.orig}\n    new : ${e.new}`))
}
console.log(`\nDry: ${DRY}`)
fs.writeFileSync(path.join(ROOT,'scripts','_partikkel_report.json'), JSON.stringify(stats,null,2), 'utf-8')
