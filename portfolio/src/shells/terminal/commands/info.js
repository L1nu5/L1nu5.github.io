import dataService from '../../../services/dataService';
import { g, dg, w, d, a, blank, rule, wrapText } from '../ansi';

export function buildWhoami(args) {
  const info    = dataService.getResumePersonalInfo();
  const summary = dataService.getSummary();
  const links   = dataService.getSocialLinks();
  const past    = dataService.getPastEvents();

  if (args.includes('-interests')) {
    const lichess = links.find(l => l.platform === 'Lichess');
    const avg     = (past.reduce((s, e) => s + e.rating, 0) / past.length).toFixed(1);
    const faves   = [...past].sort((a, b) => b.rating - a.rating).slice(0, 3).map(e => e.title);
    return [
      blank(),
      g(`  ${info.name}`),
      rule(info.name.length + 2),
      w(`  ${info.title}  ·  ${info.location}`),
      blank(),
      ...wrapText(summary, 72),
      blank(),
      g('  INTERESTS'),
      rule(),
      blank(),
      `  ${g('♟')}  ${w('Chess')}`,
      d(`     ${lichess ? lichess.url : 'lichess.org/@Abhish3k'}`),
      d('     Active player · enjoy classical and rapid formats'),
      blank(),
      `  ${g('♫')}  ${w('Music')}`,
      d(`     ${past.length} concerts · avg rating ${avg}★`),
      d(`     Favorites: ${faves.join(' · ')}`),
      blank(),
      `  ${g('🎮')}  ${w('Gaming')}`,
      d('     PC gamer · shipped AAA titles at Ubisoft'),
      d('     Far Cry 5 · Starlink · Prince of Persia'),
      blank(),
    ];
  }

  return [
    blank(),
    g(`  ${info.name}`),
    rule(info.name.length + 2),
    w(`  ${info.title}  ·  ${info.location}`),
    a(`  ${info.website}`),
    blank(),
    ...wrapText(summary, 72),
    blank(),
    dg("  type 'whoami -interests' for chess · music · gaming details"),
    blank(),
  ];
}

export function buildEducation(args) {
  const institutions = dataService.getInstitutions();

  if (args.includes('-full')) {
    const lines = [blank(), g('  EDUCATION'), rule()];
    for (const inst of institutions) {
      lines.push(blank());
      lines.push(g(`  ${inst.institution}`));
      lines.push(w(`  ${inst.degree}`));
      lines.push(d(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`));
      lines.push(blank(), a('  Achievements:'));
      for (const achievement of inst.achievements) lines.push(d(`    · ${achievement}`));
      lines.push(a('  Coursework:'));
      lines.push(d(`    ${inst.highlights.slice(0, 5).join('  ·  ')}`));
    }
    lines.push(blank());
    return lines;
  }

  return [
    blank(),
    g('  EDUCATION'),
    rule(),
    blank(),
    ...institutions.flatMap(inst => [
      g(`  ${inst.institution}`),
      w(`  ${inst.degree}`),
      d(`  ${inst.period}  ·  GPA ${inst.gpa}  ·  ${inst.location}`),
      blank(),
    ]),
    dg('  education -full  for coursework and achievements'),
    blank(),
  ];
}

export function buildContact(args) {
  const links = dataService.getSocialLinks();
  const info  = dataService.getContactInfo();

  if (args.includes('-all')) {
    const lines = [blank(), g('  CONTACT'), rule(), blank()];
    for (const l of links) {
      lines.push(`  ${w(l.platform.padEnd(14))}${a(l.username.padEnd(20))}${d(l.url)}`);
    }
    lines.push(
      blank(),
      `  ${d('Email'.padEnd(14))}${w(info.email)}`,
      `  ${d('Location'.padEnd(14))}${w(info.location)}  ·  ${d(info.timezone)}`,
      `  ${d('Available'.padEnd(14))}${w(info.availability)}`,
      `  ${d('Response'.padEnd(14))}${w(info.responseTime)}`,
      blank(),
    );
    return lines;
  }

  const key = links.filter(l => ['LinkedIn', 'GitHub', 'Lichess'].includes(l.platform));
  return [
    blank(),
    g('  CONTACT'),
    rule(),
    blank(),
    `  ${d('Email'.padEnd(14))}${w(info.email)}`,
    blank(),
    ...key.map(l => `  ${w(l.platform.padEnd(14))}${a(l.url)}`),
    blank(),
    dg('  contact -all  for all platforms'),
    blank(),
  ];
}
