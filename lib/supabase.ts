import type { FridgeData, RemData } from './types';
import { initData } from './storage';

let SB_URL = '';
let SB_KEY = '';

export function configureSB(url: string, key: string) {
  SB_URL = url;
  SB_KEY = key;
}

export function hasSB(): boolean {
  return !!SB_URL;
}

function sbHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
  };
}

export async function sbLoad(
  rooms: (string | number)[]
): Promise<{ ok: boolean; data: FridgeData | null; removed: RemData | null }> {
  if (!SB_URL) return { ok: false, data: null, removed: null };
  try {
    const [itemsRes, remRes] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/fridge_items?select=*`, { headers: sbHeaders() }).then(r => r.json()),
      fetch(`${SB_URL}/rest/v1/fridge_removed?select=key`, { headers: sbHeaders() }).then(r => r.json()),
    ]);

    let data: FridgeData | null = null;
    if (Array.isArray(itemsRes) && itemsRes.length) {
      data = initData(rooms);
      (itemsRes as Array<{ room_no: string; slot_idx: number; expiry_date?: string; name?: string }>).forEach(it => {
        if (!data![it.room_no]) return;
        const i = Number(it.slot_idx);
        if (data![it.room_no][i]) {
          data![it.room_no][i].exp = it.expiry_date || '';
          data![it.room_no][i].name = it.name || data![it.room_no][i].name;
        }
      });
    }

    let removed: RemData | null = null;
    if (Array.isArray(remRes)) {
      removed = {};
      (remRes as Array<{ key: string }>).forEach(r => { removed![r.key] = true; });
    }

    return { ok: true, data, removed };
  } catch {
    return { ok: false, data: null, removed: null };
  }
}

export function sbSave(
  roomNo: string | number,
  idx: number,
  name: string,
  exp: string,
  onOk?: () => void,
  onErr?: (code: number) => void
): void {
  if (!SB_URL) { onOk?.(); return; }
  fetch(`${SB_URL}/rest/v1/fridge_items?on_conflict=room_no,slot_idx`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal', ...sbHeaders() },
    body: JSON.stringify({
      room_no: String(roomNo),
      slot_idx: idx,
      name: name || '',
      expiry_date: exp || '',
      updated_at: new Date().toISOString(),
    }),
  }).then(r => {
    if ([200, 201, 204].includes(r.status)) { onOk?.(); }
    else { r.text().then(t => { console.error('sbSave err', r.status, t); onErr?.(r.status); }); }
  }).catch(e => { console.error('sbSave fetch err', e); onErr?.(0); });
}

export function sbSetRemoved(key: string): void {
  if (!SB_URL) return;
  fetch(`${SB_URL}/rest/v1/fridge_removed`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates', ...sbHeaders() },
    body: JSON.stringify({ key }),
  }).catch(() => {});
}

export function sbDeleteRemoved(key: string): void {
  if (!SB_URL) return;
  fetch(`${SB_URL}/rest/v1/fridge_removed?key=eq.${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: sbHeaders(),
  }).catch(() => {});
}
