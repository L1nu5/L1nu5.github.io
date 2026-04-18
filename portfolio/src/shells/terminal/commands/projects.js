import dataService from '../../../services/dataService';
import { g, dg, w, d, a, blank, rule, row, wrapText } from '../ansi';

export function buildProjects(args) {
  const projects = dataService.getProjects();
  const wizard   = projects.find(p => p.id === 1);
  const site     = projects.find(p => p.id === 2);

  if (args.includes('-wizard') || args.includes('-1')) {
    const lines = [
      blank(),
      g(`  ${wizard.name.toUpperCase()}`),
      rule(),
      a(`  ${wizard.tagline}`),
      d(`  ${wizard.context}  ·  ${wizard.period}  ·  ${wizard.role}`),
      d(`  Stack: ${wizard.technologies.join(' · ')}`),
      blank(),
      ...wrapText(wizard.description, 72),
      blank(),
      g('  ARCHITECTURE LAYERS'), rule(),
    ];
    for (const layer of wizard.architecture.layers) {
      const [name, desc] = layer.split(' — ');
      lines.push(d(`  ├─ ${name}`));
      if (desc) lines.push(d(`  │  ${desc.length > 64 ? desc.slice(0, 63) + '…' : desc}`));
    }
    lines.push(blank(), g('  DESIGN PATTERNS'), rule());
    for (const p of wizard.architecture.patterns) {
      const [name, ...rest] = p.split(' — ');
      lines.push(`  ${a(name.padEnd(18))}`);
      lines.push(d(`    ${rest.join(' — ').slice(0, 66)}`));
    }
    lines.push(blank(), g('  KEY FEATURES'), rule());
    for (const f of wizard.keyFeatures) lines.push(d(`  · ${f.slice(0, 70)}`));
    lines.push(blank(), g('  ROADMAP'), rule());
    for (const i of wizard.improvements) lines.push(d(`  · ${i.slice(0, 70)}`));
    lines.push(blank(), a(`  Impact: ${wizard.impact.teams} · ${wizard.impact.products}`), blank());
    return lines;
  }

  if (args.includes('-portfolio') || args.includes('-2')) {
    const lines = [
      blank(),
      g(`  ${site.name.toUpperCase()}`),
      rule(),
      a(`  ${site.tagline}`),
      d(`  ${site.context}  ·  ${site.period}  ·  ${site.role}`),
      d(`  Stack: ${site.technologies.join(' · ')}`),
      blank(),
      ...wrapText(site.description, 72),
      blank(),
      g('  FEATURES'), rule(),
    ];
    for (const f of site.features) lines.push(d(`  · ${f}`));
    lines.push(blank(), d(`  Live:   ${site.liveUrl}`), d(`  Source: ${site.githubUrl}`), blank());
    return lines;
  }

  return [
    blank(),
    g('  PROJECTS'),
    rule(),
    blank(),
    row('[1]', 4, wizard.name),
    a(`      ${wizard.tagline}`),
    d(`      ${wizard.context}  ·  ${wizard.period}`),
    d(`      Stack: ${wizard.technologies.join(' · ')}`),
    blank(),
    row('[2]', 4, site.name),
    a(`      ${site.tagline}`),
    d(`      ${site.context}  ·  ${site.period}`),
    d(`      ${site.liveUrl}`),
    blank(),
    dg('  projects -wizard  · -portfolio'),
    blank(),
  ];
}
