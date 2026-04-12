import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FridgeData, RoomStatus, SlotStatus } from './types';
import { ROWS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slotLabel(idx: number): string {
  return ROWS[Math.floor(idx / 4)] + ((idx % 4) + 1);
}

export function monthEnd(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

export function nextMonthEnd(): Date {
  const n = new Date();
  return monthEnd(n.getFullYear(), n.getMonth() + 1);
}

export function thisMonthEnd(): Date {
  const n = new Date();
  return monthEnd(n.getFullYear(), n.getMonth());
}

/** toISOString() はUTC変換するため JST で1日ズレる。ローカル日付コンポーネントを使う */
export function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDate(s: string): string | null {
  if (!s) return null;
  const d = new Date(s);
  return (d.getMonth() + 1) + '/' + d.getDate();
}

export function daysLeft(s: string): number | null {
  if (!s) return null;
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return Math.floor((new Date(s).getTime() - n.getTime()) / 86400000);
}

export function calcStatus(expDate: string): SlotStatus {
  if (!expDate) return 'none';
  const e = new Date(expDate);
  const tme = thisMonthEnd();
  const nme = nextMonthEnd();
  if (e <= tme) return 'red';
  if (e <= nme) {
    if (e.getTime() === nme.getTime()) return 'orange';
    return 'red';
  }
  return 'ok';
}

export function roomStatus(room: string | number, data: FridgeData): RoomStatus {
  const slots = data[room] || [];
  const statuses = slots.map(s => calcStatus(s.exp));
  if (statuses.includes('red')) return 'red';
  if (statuses.includes('orange')) return 'orange';
  if (statuses.every(s => s === 'none')) return 'none';
  return 'ok';
}
