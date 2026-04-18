import { buildHelp, buildLs, buildNeofetch, buildGrep } from './terminal/commands/system';
import { buildWhoami, buildEducation, buildContact } from './terminal/commands/info';
import { buildResume } from './terminal/commands/resume';
import { buildProjects } from './terminal/commands/projects';
import { buildMusic } from './terminal/commands/music';

export const COMMANDS = {
  help:         ()     => buildHelp(),
  ls:           ()     => buildLs(),
  whoami:       (args) => buildWhoami(args),
  about:        (args) => buildWhoami(args),
  resume:       (args) => buildResume(args),
  experience:   (args) => buildResume(args),
  projects:     (args) => buildProjects(args),
  music:        (args) => buildMusic(args),
  concerts:     (args) => buildMusic(['-concerts', ...args]),
  education:    (args) => buildEducation(args),
  contact:      (args) => buildContact(args),
  socials:      (args) => buildContact(args),
  neofetch:     ()     => buildNeofetch(),
  grep:         (args) => buildGrep(args),
};
