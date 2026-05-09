import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "./gallery-store";

export interface StatItem {
  id: number;
  value: number;
  label: string;
  icon: string;
}

const DATA_FILE = path.join(IMAGES_DIR, "data", "impact-numbers.json");

const DEFAULT_DATA: StatItem[] = [
  { id: 1, value: 635,   label: "SKILL DEVELOPMENT",      icon: "/images/skill-development.png" },
  { id: 2, value: 19727, label: "SKILL ASSESSMENT",        icon: "/images/skill-assessment-icon.svg" },
  { id: 3, value: 5060,  label: "EDUCATION",               icon: "/images/education-icon.svg" },
  { id: 4, value: 10850, label: "HEALTH & WELLBEING",      icon: "/images/health-wellbeing-icon.svg" },
  { id: 5, value: 1200,  label: "WOMEN ENTREPRENEURSHIP",  icon: "/images/women entrepreneurship-icon.svg" },
  { id: 6, value: 4940,  label: "COMMUNITY DEVELOPMENT",   icon: "/images/community-development-icon.svg" },
  { id: 7, value: 42412, label: "COMMUNITY MEMBERS",       icon: "/images/community-members-icon.svg" },
];

function ensureFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

export function readStats(): StatItem[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as StatItem[];
}

export function writeStats(items: StatItem[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}