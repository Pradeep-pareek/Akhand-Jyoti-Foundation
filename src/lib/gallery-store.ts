import fs from "fs";
import path from "path";

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  images: string[]; // stored as filenames, e.g. ["photo1.jpg"]
  createdAt: string;
  updatedAt: string;
}

// Path to the folder where images are stored
export const IMAGES_DIR = "C:\\inetpub\\lelifepay.com\\Api-Sample-Data\\akhandjyoti";

// Path to the JSON file used as a simple database
const DATA_FILE = path.join(IMAGES_DIR, "data", "gallery.json");

/** Ensure the data directory and file exist */
function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

/** Read all gallery items */
export function readGallery(): GalleryItem[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as GalleryItem[];
}

/** Write all gallery items */
export function writeGallery(items: GalleryItem[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

/** Get next auto-increment ID */
export function nextId(items: GalleryItem[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}