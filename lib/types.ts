export interface SlotData {
  name: string;
  exp: string;
}

export type FridgeData = Record<string | number, SlotData[]>;

export interface HistoryEntry {
  dt: string;
  rn: string | number;
  name: string;
  from: string;
  to: string;
}

export type RemData = Record<string, boolean>;

export type SlotStatus = 'red' | 'orange' | 'ok' | 'none';
export type RoomStatus = 'red' | 'orange' | 'ok' | 'none';

export interface FloorData {
  f: string;
  rooms: (string | number)[];
}

export interface AlertItem {
  rn: string | number;
  idx: number;
  name: string;
  exp: string;
  st: 'red' | 'orange';
}

export type MenuMode = 'norm' | 'ret';

export interface MenuState {
  rn: string | number;
  idx: number;
  mode: MenuMode;
}

export type ViewType = 'floors' | 'room' | 'alerts' | 'restock' | 'history' | 'settings';
export type StoreType = 'M' | 'L';
