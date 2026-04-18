import dataService from '../../../services/dataService';
import { g, dg, w, d, a, blank, rule, wrapText } from '../ansi';

export function buildResume(args) {
  const work = dataService.getWorkExperience();
  const edu  = dataService.getInstitutions();

  if (args.includes('-timeline')) {
    const lines = [blank(), g('  CAREER TIMELINE'), rule(), blank()];
    for (const job of [...work].reverse()) {
      const year    = job.period.slice(0, 4);
      const current = job.period.includes('Present');
      const bullet  = current ? '══' : '──';
      const company = job.company.padEnd(22);
      const pos     = job.position.padEnd(28);
      lines.push(current
        ? `  ${g(year)}  ${g(bullet)}  ${g(pos)}${g(company)}${dg('← present')}`
        : `  ${d(year)}  ${d(bullet)}  ${d(pos)}${d(company)}`
      );
    }
    lines.push(blank());
    for (const inst of [...edu].reverse()) {
      const year = inst.period.slice(0, 4);
      lines.push(d(`  ${year}  ░░  [${inst.degree.split(',')[0]}  ·  GPA ${inst.gpa}]`));
    }
    lines.push(blank(), d(`  ${work.length} roles · game dev → startup → enterprise`), blank());
    return lines;
  }

  if (args.includes('-skills')) {
    const skills  = dataService.getSkills();
    const grouped = {};
    for (const s of skills) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }
    const bar12 = lvl => {
      const filled = Math.round(lvl / 100 * 12);
      return g('█'.repeat(filled)) + d('░'.repeat(12 - filled));
    };
    const cell = s => `${w(s.name.padEnd(14))} ${bar12(s.level)} ${d(String(s.level).padEnd(3))}`;

    const lines = [blank(), g('  SKILLS'), rule(), blank()];
    for (const [cat, items] of Object.entries(grouped)) {
      lines.push(a(`  ${cat.toUpperCase()}`));
      for (let i = 0; i < items.length; i += 2) {
        const right = items[i + 1];
        lines.push(right
          ? `  ${cell(items[i])}    ${cell(right)}`
          : `  ${cell(items[i])}`
        );
      }
      lines.push(blank());
    }
    return lines;
  }

  if (args.includes('-exp') || args.includes('-full')) {
    const lines = [blank(), g('  WORK EXPERIENCE'), rule()];
    for (const job of work) {
      lines.push(blank());
      lines.push(`  ${g(job.company.padEnd(36))}${d(job.period)}`);
      lines.push(a(`  ${job.position}  ·  ${job.type}  ·  ${job.location}`));
      for (const r of job.responsibilities) lines.push(w(`    · ${r.length > 72 ? r.slice(0, 71) + '…' : r}`));
      lines.push(d(`  Stack: ${job.technologies.join(' · ')}`));
    }
    if (args.includes('-full')) {
      lines.push(...buildResume(['-skills']).slice(1));
    } else {
      lines.push(blank());
    }
    return lines;
  }

  const current = work[0];
  return [
    blank(),
    g('  RESUME'),
    rule(),
    blank(),
    g(`  ${current.company}`),
    w(`  ${current.position}  ·  ${current.period}`),
    d(`  ${current.location}`),
    blank(),
    ...wrapText(dataService.getSummary(), 72),
    blank(),
    dg('  resume -timeline  · -skills  · -exp  · -full'),
    blank(),
  ];
}
