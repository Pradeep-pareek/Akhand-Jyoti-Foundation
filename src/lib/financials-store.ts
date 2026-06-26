import fs from "fs";
import path from "path";
import { IMAGES_DIR } from "./gallery-store";

export type FinancialTabId = "policies" | "fundraising" | "financials";

export interface FinancialDocument {
  id: number;
  tabId: FinancialTabId;
  year: string;
  title: string;
  subtitle: string;
  filename: string; // PDF filename stored in IMAGES_DIR/financials/
  createdAt: string;
  updatedAt: string;
}

const FINANCIALS_DIR = path.join(IMAGES_DIR, "financials");
const DATA_FILE = path.join(IMAGES_DIR, "data", "financials.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FINANCIALS_DIR)) fs.mkdirSync(FINANCIALS_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function readFinancials(): FinancialDocument[] {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as FinancialDocument[];
}

export function writeFinancials(items: FinancialDocument[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function nextId(items: FinancialDocument[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

export { FINANCIALS_DIR };
