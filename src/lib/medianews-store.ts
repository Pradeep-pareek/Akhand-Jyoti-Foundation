import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "./gallery-store";

export interface MediaNewsItem {
  id: number;
  title: string;
  description: string;
  image: string; // stored as filename, e.g. "1234_news.jpg"
  link: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(IMAGES_DIR, "data", "medianews.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE))
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function readMediaNews(): MediaNewsItem[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as MediaNewsItem[];
}

export function writeMediaNews(items: MediaNewsItem[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function nextId(items: MediaNewsItem[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}
