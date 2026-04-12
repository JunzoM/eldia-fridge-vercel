import type { FloorData } from './types';

export const FLOORS_M: FloorData[] = [
  { f: '6F', rooms: [601, 602, 603] },
  { f: '5F', rooms: [501, 502, 503, 505, 506, 507, 508] },
  { f: '4F', rooms: [401, 403, 405, 406, 407, 408, 410, 411, 412, 413] },
  { f: '3F', rooms: [301, 302, 303, 305, 306, 307, 308, 310, 311, 312] },
  { f: '2F', rooms: [202, 203, 205, 206, 207] },
];

export const FLOORS_L: FloorData[] = [
  { f: '5F', rooms: ['L501', 'L502', 'L503', 'L505', 'L506', 'L507', 'L508', 'L510', 'L511'] },
  { f: '4F', rooms: ['L401', 'L403', 'L405', 'L406', 'L407', 'L408', 'L410', 'L411', 'L412', 'L413', 'L415', 'L416', 'L417', 'L418', 'L420', 'L421'] },
  { f: '3F', rooms: ['L301', 'L302', 'L303', 'L305', 'L306', 'L307', 'L308', 'L310', 'L311', 'L312', 'L313', 'L315', 'L316', 'L317', 'L318', 'L320'] },
  { f: '2F', rooms: ['L201', 'L202', 'L203', 'L205', 'L206', 'L207', 'L208', 'L210', 'L211', 'L212', 'L213', 'L215'] },
];

export const ROWS = ['A', 'B', 'C', 'D'];
export const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

export const NAMES = [
  'コカ・コーラ', '角ハイボール', '伊右衛門', '烏龍茶', '午後の紅茶',
  'ポカリスウェット', 'クリスタルガイザー', 'Red Bull', 'キリン一番搾り',
  'アサヒスーパードライ', 'のどごし生', '氷結レモン', 'パワフルコールド',
  'ダース ミルク', 'フリースペース①', 'フリースペース②',
  'ストロングD', // 17番目: NameModal プリセット表示用（デフォルトスロットには含まない）
];

/** 冷蔵庫スロット数 (4×4 グリッド固定) */
export const SLOT_COUNT = 16;

export const CORRECT_PIN = '0123';
export const LS_DATA = 'elv7';
export const LS_HISTORY = 'elhv7';
export const LS_REMOVED = 'elrv7';
export const LS_STORE = 'eldia_store';
export const LS_PIN_OK = 'eldia_pin_ok';
