'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FLOORS_M, FLOORS_L, LS_STORE, LS_PIN_OK } from '@/lib/constants';
import type { FridgeData, HistoryEntry, RemData, MenuState, ViewType, StoreType, AlertItem, FloorData } from '@/lib/types';
import { calcStatus, nextMonthEnd, slotLabel } from '@/lib/utils';
import { loadData, saveData, loadHistory, pushHistory, loadRemoved, saveRemoved, initData } from '@/lib/storage';
import { configureSB, hasSB, sbLoad, sbSave, sbSetRemoved, sbDeleteRemoved } from '@/lib/supabase';

import PinScreen from '@/components/PinScreen';
import FloorsView from '@/components/FloorsView';
import RoomView from '@/components/RoomView';
import AlertsView from '@/components/AlertsView';
import RestockView from '@/components/RestockView';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import MenuModal from '@/components/MenuModal';
import DateModal from '@/components/DateModal';
import NameModal from '@/components/NameModal';
import BottomNav from '@/components/BottomNav';
import AppHeader from '@/components/AppHeader';
import Toast from '@/components/Toast';

function getAllRooms(floors: FloorData[]) {
  return floors.reduce<(string | number)[]>((a, f) => [...a, ...f.rooms], []);
}

function getFloors(store: StoreType): FloorData[] {
  return store === 'L' ? FLOORS_L : FLOORS_M;
}

export default function Home() {
  const [store, setStore] = useState<StoreType>('M');
  const [pinOk, setPinOk] = useState(false);
  const [data, setData] = useState<FridgeData>({});
  const [hist, setHist] = useState<HistoryEntry[]>([]);
  const [rem, setRem] = useState<RemData>({});
  const [view, setView] = useState<ViewType>('floors');
  const [room, setRoom] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [editDate, setEditDate] = useState<MenuState | null>(null);
  const [editName, setEditName] = useState<MenuState | null>(null);
  const [loading, setLoading] = useState(false);
  const [sbReady, setSbReady] = useState(false);
  const editedRef = useRef(false);

  // Load config & init
  useEffect(() => {
    const savedStore = (localStorage.getItem(LS_STORE) || 'M') as StoreType;
    const floors = getFloors(savedStore);
    const rooms = getAllRooms(floors);
    setStore(savedStore);
    setData(loadData(rooms));
    setHist(loadHistory());
    setRem(loadRemoved());
    setPinOk(!!localStorage.getItem(LS_PIN_OK));

    fetch('/api/config')
      .then(r => r.json())
      .then(({ supabaseUrl, supabaseKey }: { supabaseUrl: string; supabaseKey: string }) => {
        configureSB(supabaseUrl, supabaseKey);
        setSbReady(!!supabaseUrl);
      })
      .catch(() => {});
  }, []);

  const showToast = useCallback((msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  }, []);

  // Sync from Supabase after PIN OK
  useEffect(() => {
    if (!pinOk || !sbReady) return;
    const floors = getFloors(store);
    const rooms = getAllRooms(floors);
    editedRef.current = false;
    setLoading(true);
    sbLoad(rooms).then(({ ok, data: nd, removed }) => {
      setLoading(false);
      if (ok && nd && !editedRef.current) { saveData(nd); setData(nd); }
      if (ok && removed && !editedRef.current) { saveRemoved(removed); setRem(removed); }
      if (ok) showToast('同期完了');
    });
  }, [pinOk, sbReady, store, showToast]);

  function switchStore(s: StoreType) {
    localStorage.setItem(LS_STORE, s);
    setStore(s);
    const floors = getFloors(s);
    const rooms = getAllRooms(floors);
    setData(loadData(rooms));
    setRem(loadRemoved());
    setView('floors');
    setRoom(null);
    setLoading(true);
    sbLoad(rooms).then(({ ok, data: nd, removed }) => {
      setLoading(false);
      if (ok && nd) { saveData(nd); setData(nd); } else { setData(loadData(rooms)); }
      if (ok && removed) { saveRemoved(removed); setRem(removed); } else { setRem(loadRemoved()); }
    });
  }

  function persistRem(nr: RemData) {
    setRem(nr);
    saveRemoved(nr);
  }

  function isRemoved(rn: string | number, i: number) {
    return !!rem[`${rn}-${i}`];
  }

  function toggleRemoved(rn: string | number, i: number) {
    const k = `${rn}-${i}`;
    const nr = { ...rem };
    if (nr[k]) { delete nr[k]; sbDeleteRemoved(k); }
    else { nr[k] = true; sbSetRemoved(k); }
    persistRem(nr);
  }

  function bulkRemove(items: Array<{ rn: string | number; idx: number }>) {
    const nr = { ...rem };
    items.forEach(it => {
      const k = `${it.rn}-${it.idx}`;
      if (!nr[k]) { nr[k] = true; sbSetRemoved(k); }
    });
    persistRem(nr);
    showToast('一括取り出し中にしました');
  }

  function removedCount(r: string | number) {
    return (data[r] || []).filter((_, i) => isRemoved(r, i)).length;
  }

  const floors = getFloors(store);
  const allRooms = getAllRooms(floors);
  const totalRemoved = allRooms.reduce<number>((a, r) => a + removedCount(r), 0);

  const alerts: AlertItem[] = [];
  allRooms.forEach(r => {
    (data[r] || []).forEach((s, i) => {
      const st = calcStatus(s.exp);
      if (st === 'red' || st === 'orange') alerts.push({ rn: r, idx: i, name: s.name, exp: s.exp, st });
    });
  });
  const hasRed = alerts.some(a => a.st === 'red');

  function updateExpiry(rn: string | number, idx: number, newExp: string) {
    editedRef.current = true;
    const nm = data[rn]?.[idx]?.name ?? '';
    const from = data[rn]?.[idx]?.exp ?? '';
    const nd = { ...data, [rn]: [...(data[rn] || [])] };
    nd[rn][idx] = { ...nd[rn][idx], exp: newExp };
    setData(nd);
    saveData(nd);
    pushHistory({ dt: new Date().toISOString(), rn, name: nm, from, to: newExp });
    setHist(loadHistory());
    sbSave(rn, idx, nm, newExp,
      () => showToast('消費期限を更新しました'),
      (code) => showToast(`SB保存失敗(${code})`, 'err')
    );
  }

  function updateName(rn: string | number, idx: number, newName: string, applyAll: boolean) {
    const nd = { ...data };
    const targets = applyAll ? allRooms : [rn];
    targets.forEach(r => {
      nd[r] = [...(nd[r] || [])];
      nd[r][idx] = { ...nd[r][idx], name: newName, exp: '' };
      sbSave(r, idx, newName, '');
    });
    setData(nd);
    saveData(nd);
    showToast(newName ? '品目を変更しました' : '品目を削除しました');
  }

  if (!pinOk) {
    return <PinScreen onOk={() => setPinOk(true)} />;
  }

  const curSlots = room !== null ? (data[room] || []) : [];

  return (
    <div className="max-w-[430px] mx-auto min-h-svh bg-cream">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <AppHeader
        store={store}
        onSwitchStore={switchStore}
        view={view}
        room={room}
        loading={loading}
        totalRemoved={totalRemoved}
        alerts={alerts}
        hasRed={hasRed}
        sbReady={sbReady}
        onBack={() => setView('floors')}
        onAlerts={() => setView('alerts')}
      />

      <div className="pb-20">
        {view === 'floors' && (
          <FloorsView
            floors={floors}
            data={data}
            rem={rem}
            onOpen={r => { setRoom(r); setView('room'); }}
          />
        )}
        {view === 'room' && room !== null && (
          <RoomView
            rn={room}
            slots={curSlots}
            isRemoved={isRemoved}
            onTap={(rn, idx) => setMenu({ rn, idx, mode: isRemoved(rn, idx) ? 'ret' : 'norm' })}
          />
        )}
        {view === 'alerts' && (
          <AlertsView
            items={alerts}
            rem={rem}
            onOpen={r => { setRoom(r); setView('room'); }}
            onBulkRemove={bulkRemove}
          />
        )}
        {view === 'restock' && <RestockView data={data} rem={rem} allRooms={allRooms} />}
        {view === 'history' && <HistoryView hist={hist} />}
        {view === 'settings' && <SettingsView sbReady={sbReady} />}
      </div>

      <BottomNav
        view={view}
        onNav={setView}
        alertCount={alerts.length}
        hasRed={hasRed}
        totalRemoved={totalRemoved}
      />

      {menu && (
        <MenuModal
          menu={menu}
          name={(data[menu.rn]?.[menu.idx]?.name) ?? ''}
          label={slotLabel(menu.idx)}
          onEditDate={() => { setEditDate(menu); setMenu(null); }}
          onEditName={() => { setEditName(menu); setMenu(null); }}
          onRemove={() => { toggleRemoved(menu.rn, menu.idx); showToast('取り出し中にしました'); setMenu(null); }}
          onReturn={() => { toggleRemoved(menu.rn, menu.idx); showToast('元の位置に戻しました'); setMenu(null); }}
          onClose={() => setMenu(null)}
        />
      )}

      {editDate && (
        <DateModal
          menu={editDate}
          current={(data[editDate.rn]?.[editDate.idx]?.exp) ?? ''}
          name={(data[editDate.rn]?.[editDate.idx]?.name) ?? ''}
          label={slotLabel(editDate.idx)}
          onSave={d => { updateExpiry(editDate.rn, editDate.idx, d); setEditDate(null); }}
          onClose={() => setEditDate(null)}
        />
      )}

      {editName && (
        <NameModal
          menu={editName}
          current={(data[editName.rn]?.[editName.idx]?.name) ?? ''}
          label={slotLabel(editName.idx)}
          onSave={(name, all) => { updateName(editName.rn, editName.idx, name, all); setEditName(null); }}
          onClose={() => setEditName(null)}
        />
      )}
    </div>
  );
}
