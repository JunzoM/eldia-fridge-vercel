import type { FridgeData, HistoryEntry, RemData } from './types';
import { NAMES, LS_DATA, LS_HISTORY, LS_REMOVED } from './constants';

export function initData(rooms: (string | number)[]): FridgeData {
  const d: FridgeData = {};
  rooms.forEach(r => {
    d[r] = NAMES.map(n => ({ name: n, exp: '' }));
  });
  return d;
}

export function loadData(rooms: (string | number)[]): FridgeData {
  try {
    const raw = localStorage.getItem(LS_DATA);
    if (raw) {
      const stored = JSON.parse(raw) as FridgeData;
      const defaults = initData(rooms);
      // ストアが切り替わった場合に未保存の部屋をデフォルト値で補完する
      const result: FridgeData = {};
      rooms.forEach(r => {
        result[r] = stored[r] ?? defaults[r];
      });
      return result;
    }
  } catch {}
  return initData(rooms);
}

export function saveData(d: FridgeData): void {
  try {
    localStorage.setItem(LS_DATA, JSON.stringify(d));
  } catch {}
}

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]') as HistoryEntry[];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry): void {
  const hh = loadHistory();
  hh.unshift(entry);
  try {
    localStorage.setItem(LS_HISTORY, JSON.stringify(hh.slice(0, 300)));
  } catch {}
}

export function loadRemoved(): RemData {
  try {
    return JSON.parse(localStorage.getItem(LS_REMOVED) || '{}') as RemData;
  } catch {
    return {};
  }
}

export function saveRemoved(d: RemData): void {
  try {
    localStorage.setItem(LS_REMOVED, JSON.stringify(d));
  } catch {}
}
