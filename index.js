const { useState, useEffect, useRef, useCallback } = React;

    // ─── Constants ──────────────────────────────────────────────────────────
    const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const DERSLER = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Edebiyat', 'Diğer'];
    const SAATLER = Array.from({ length: 14 }, (_, i) => {
      const h = i + 8;
      return `${String(h).padStart(2,'0')}:00`;
    });

    const renk = (ders) => ({
      Matematik: 'bg-primary/10 text-black border-primary/20',
      Fizik: 'bg-green-100 text-black border-green-200',
      Kimya: 'bg-pink-100 text-black border-pink-200',
      Biyoloji: 'bg-orange-100 text-black border-orange-200',
      Tarih: 'bg-amber-100 text-black border-amber-200',
      Coğrafya: 'bg-blue-100 text-black border-blue-200',
      Edebiyat: 'bg-purple-100 text-black border-purple-200',
      Diğer: 'bg-gray-100 text-black border-gray-200',
    }[ders] || 'bg-gray-100 text-black border-gray-200');

    const ID = () => Math.random().toString(36).slice(2, 10);

    const INITIAL_DERSLER = [
      { id: ID(), gun: 'Pazartesi', saat: '08:00', ders: 'Matematik', ogretmen: 'Ahmet Hoca', sinif: '10A', notlar: 'Türev konusu' },
      { id: ID(), gun: 'Pazartesi', saat: '10:00', ders: 'Fizik', ogretmen: 'Ayşe Hoca', sinif: '10A', notlar: '' },
      { id: ID(), gun: 'Salı', saat: '09:00', ders: 'Kimya', ogretmen: 'Mehmet Hoca', sinif: '10B', notlar: 'Periyodik tablo' },
      { id: ID(), gun: 'Çarşamba', saat: '11:00', ders: 'Edebiyat', ogretmen: 'Fatma Hoca', sinif: '10A', notlar: '' },
      { id: ID(), gun: 'Perşembe', saat: '13:00', ders: 'Tarih', ogretmen: 'Ali Hoca', sinif: '10C', notlar: 'Osmanlı dönemi' },
    ];

    // ─── Toast ───────────────────────────────────────────────────────────────
    function Toast({ message, type, onClose }) {
      useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
      const colors = {
        success: 'bg-success-hl text-success border-success/30',
        error: 'bg-error-hl text-error border-error/30',
        info: 'bg-primary-hl text-primary border-primary/30',
      };
      return (
        <div className={`slide-down fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${colors[type] || colors.info}`}
          style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
          {type === 'success' && <i data-lucide="check-circle" className="w-4 h-4 shrink-0" />}
          {type === 'error' && <i data-lucide="x-circle" className="w-4 h-4 shrink-0" />}
          {type === 'info' && <i data-lucide="info" className="w-4 h-4 shrink-0" />}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <i data-lucide="x" className="w-3 h-3" />
          </button>
        </div>
      );
    }

    // ─── Ders Form Modal ─────────────────────────────────────────────────────
    function DersModal({ ders, onSave, onClose }) {
      const [form, setForm] = useState(ders || {
        gun: 'Pazartesi', saat: '08:00', ders: 'Matematik',
        ogretmen: '', sinif: '', notlar: ''
      });
      const [errors, setErrors] = useState({});
      const inputRef = useRef();
      useEffect(() => { inputRef.current?.focus(); }, []);

      const validate = () => {
        const e = {};
        if (!form.ogretmen.trim()) e.ogretmen = 'Öğretmen adı gerekli';
        if (!form.sinif.trim()) e.sinif = 'Sınıf gerekli';
        setErrors(e);
        return Object.keys(e).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSave(form);
      };

      const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

      return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="scale-in w-full max-w-md rounded-2xl border p-6"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--color-text)' }}>
                {ders ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}>
                <i data-lucide="x" className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>Gün</label>
                  <select value={form.gun} onChange={e => set('gun', e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {GUNLER.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>Saat</label>
                  <select value={form.saat} onChange={e => set('saat', e.target.value)}
                    className="w-full rounded-lg px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    {SAATLER.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>Ders</label>
                <select value={form.ders} onChange={e => set('ders', e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  {DERSLER.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>
                  Öğretmen <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input ref={inputRef} type="text" value={form.ogretmen}
                  onChange={e => { set('ogretmen', e.target.value); if (errors.ogretmen) setErrors(ev => ({ ...ev, ogretmen: null })); }}
                  placeholder="Öğretmen adı soyadı"
                  className="w-full rounded-lg px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                  style={{ background: 'var(--color-surface-2)', borderColor: errors.ogretmen ? 'var(--color-error)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.ogretmen && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.ogretmen}</p>}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>
                  Sınıf <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input type="text" value={form.sinif}
                  onChange={e => { set('sinif', e.target.value); if (errors.sinif) setErrors(ev => ({ ...ev, sinif: null })); }}
                  placeholder="Örn: 10A"
                  className="w-full rounded-lg px-3 py-2.5 text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                  style={{ background: 'var(--color-surface-2)', borderColor: errors.sinif ? 'var(--color-error)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.sinif && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.sinif}</p>}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-muted)' }}>Notlar (opsiyonel)</label>
                <textarea value={form.notlar} onChange={e => set('notlar', e.target.value)}
                  placeholder="Konu, not..."
                  rows={2}
                  className="w-full rounded-lg px-3 py-2.5 text-sm border resize-none transition-colors focus:outline-none focus:ring-2 ring-primary/30"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface-offset)' }}>
                  İptal
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-90"
                  style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                  {ders ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    // ─── Silme Onay Modal ────────────────────────────────────────────────────
    function SilModal({ ders, onConfirm, onClose }) {
      return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="scale-in w-full max-w-sm rounded-2xl border p-6 text-center"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'var(--color-error-highlight)' }}>
              <i data-lucide="trash-2" className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Dersi Sil</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
              <strong>{ders.ders}</strong> ({ders.gun}, {ders.saat}) dersini silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface-offset)' }}>
                İptal
              </button>
              <button onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:opacity-90"
                style={{ background: 'var(--color-error)', color: '#fff' }}>
                Sil
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ─── Ders Kartı ──────────────────────────────────────────────────────────
    function DersKarti({ ders, onEdit, onDelete, index }) {
      const cls = renk(ders.ders);
      return (
        <div className="fade-in-up group flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:shadow-md"
          style={{ animationDelay: `${index * 40}ms`, background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`}>
            {ders.saat}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{ders.ders}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--color-surface-offset)', color: 'var(--color-text-muted)' }}>{ders.sinif}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              <i data-lucide="user" className="inline w-3 h-3 mr-1" />{ders.ogretmen}
            </p>
            {ders.notlar && (
              <p className="text-xs mt-1 truncate" style={{ color: 'var(--color-text-faint)' }}>
                {ders.notlar}
              </p>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => onEdit(ders)}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ background: 'var(--color-primary-highlight)', color: 'var(--color-primary)' }}
              aria-label="Düzenle">
              <i data-lucide="pencil" className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(ders)}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ background: 'var(--color-error-highlight)', color: 'var(--color-error)' }}
              aria-label="Sil">
              <i data-lucide="trash-2" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    // ─── Liste Görünümü ───────────────────────────────────────────────────────
    function ListeGorunumu({ dersler, onEdit, onDelete, filtre, aramaMetni }) {
      const filtrelenmis = dersler.filter(d => {
        const aramaUyumu = !aramaMetni || [d.ders, d.ogretmen, d.sinif, d.notlar]
          .some(f => f.toLowerCase().includes(aramaMetni.toLowerCase()));
        const filtrUyumu = !filtre || d.ders === filtre || d.gun === filtre;
        return aramaUyumu && filtrUyumu;
      });

      const gunlereGore = GUNLER.reduce((acc, gun) => {
        const gunDersleri = filtrelenmis.filter(d => d.gun === gun)
          .sort((a, b) => a.saat.localeCompare(b.saat));
        if (gunDersleri.length) acc[gun] = gunDersleri;
        return acc;
      }, {});

      if (filtrelenmis.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'var(--color-surface-offset)' }}>
              <i data-lucide="calendar-x" className="w-7 h-7" style={{ color: 'var(--color-text-faint)' }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              {aramaMetni ? 'Sonuç bulunamadı' : 'Henüz ders yok'}
            </h3>
            <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
              {aramaMetni ? `"${aramaMetni}" için sonuç bulunamadı.` : 'Ders eklemek için + butonuna tıklayın.'}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          {Object.entries(gunlereGore).map(([gun, dersListesi], gi) => (
            <div key={gun} className="fade-in-up" style={{ animationDelay: `${gi * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-0.5 h-5 rounded-full day-color-${GUNLER.indexOf(gun)}`}
                  style={{ borderLeft: '2px solid' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {gun}
                </h3>
                <div className="flex-1 h-px" style={{ background: 'var(--color-divider)' }} />
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--color-surface-offset)', color: 'var(--color-text-muted)' }}>
                  {dersListesi.length} ders
                </span>
              </div>
              <div className="space-y-2 pl-4">
                {dersListesi.map((d, i) => (
                  <DersKarti key={d.id} ders={d} onEdit={onEdit} onDelete={onDelete} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ─── Tablo Görünümü ───────────────────────────────────────────────────────
    function TabloGorunumu({ dersler }) {
      const grid = {};
      GUNLER.forEach(g => { grid[g] = {}; });
      dersler.forEach(d => {
        if (!grid[d.gun]) grid[d.gun] = {};
        grid[d.gun][d.saat] = d;
      });
      const saatlerKullanilan = [...new Set(dersler.map(d => d.saat))].sort();
      if (saatlerKullanilan.length === 0) return (
        <p className="text-center py-16 text-sm" style={{ color: 'var(--color-text-muted)' }}>Ders programı boş.</p>
      );

      return (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'var(--color-surface-offset)' }}>
                <th className="px-3 py-3 text-left font-semibold text-xs" style={{ color: 'var(--color-text-muted)', minWidth: '64px' }}>Saat</th>
                {GUNLER.filter(g => dersler.some(d => d.gun === g)).map(g => (
                  <th key={g} className="px-3 py-3 text-left font-semibold text-xs" style={{ color: 'var(--color-text-muted)', minWidth: '140px' }}>{g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {saatlerKullanilan.map((saat, si) => (
                <tr key={saat} style={{ borderTop: `1px solid var(--color-divider)`, background: si % 2 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                  <td className="px-3 py-3 text-xs font-mono font-medium" style={{ color: 'var(--color-text-muted)' }}>{saat}</td>
                  {GUNLER.filter(g => dersler.some(d => d.gun === g)).map(gun => {
                    const d = grid[gun]?.[saat];
                    const cls = d ? renk(d.ders) : '';
                    return (
                      <td key={gun} className="px-3 py-2">
                        {d ? (
                          <div className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${cls}`}>
                            <div className="font-semibold">{d.ders}</div>
                            <div className="opacity-75 truncate">{d.ogretmen}</div>
                            <div className="opacity-60">{d.sinif}</div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // ─── İstatistik Kartları ──────────────────────────────────────────────────
    function IstatistikKarti({ label, value, icon, color }) {
      return (
        <div className="fade-in-up flex items-center gap-3 p-4 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: color + '20' }}>
            <i data-lucide={icon} className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="text-xl font-bold tabular-nums" style={{ color: 'var(--color-text)', lineHeight: 1 }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
          </div>
        </div>
      );
    }

    // ─── Ana Uygulama ─────────────────────────────────────────────────────────
    function App() {
      const [dersler, setDersler] = useState(INITIAL_DERSLER);
      const [modal, setModal] = useState(null);
      const [seciliDers, setSeciliDers] = useState(null);
      const [gorünum, setGorünum] = useState('liste');
      const [aramaMetni, setAramaMetni] = useState('');
      const [filtre, setFiltre] = useState('');
      const [toast, setToast] = useState(null);

      useEffect(() => { lucide.createIcons(); });

      const showToast = (message, type = 'success') => {
        setToast({ message, type, id: ID() });
      };

      const handleEkle = (form) => {
        setDersler(prev => [...prev, { ...form, id: ID() }]);
        setModal(null);
        showToast(`${form.ders} dersi eklendi.`);
      };

      const handleGuncelle = (form) => {
        setDersler(prev => prev.map(d => d.id === seciliDers.id ? { ...form, id: d.id } : d));
        setModal(null);
        setSeciliDers(null);
        showToast(`${form.ders} dersi güncellendi.`, 'info');
      };

      const handleSil = () => {
        setDersler(prev => prev.filter(d => d.id !== seciliDers.id));
        showToast(`${seciliDers.ders} dersi silindi.`, 'error');
        setModal(null);
        setSeciliDers(null);
      };

      const toplamDers = dersler.length;
      const benzersizDers = [...new Set(dersler.map(d => d.ders))].length;
      const benzersizOgretmen = [...new Set(dersler.map(d => d.ogretmen))].length;
      const aktifGun = [...new Set(dersler.map(d => d.gun))].length;

      return (
        <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
          <header className="sticky top-0 z-30 border-b"
            style={{ background: 'oklch(from var(--color-surface) l c h / 0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
              <div className="flex items-center gap-2.5 shrink-0">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Ders Programı Logo">
                  <rect width="28" height="28" rx="8" fill="var(--color-primary)" />
                  <rect x="7" y="7" width="5" height="5" rx="1.5" fill="white" />
                  <rect x="16" y="7" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="7" y="16" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="16" y="16" width="5" height="5" rx="1.5" fill="white" />
                </svg>
                <span className="font-semibold text-sm hidden sm:block" style={{ fontFamily: "'Montserrat', sans-serif", color: 'var(--color-text)' }}>
                  Haftalık Ders Programı
                </span>
              </div>
              <div className="flex-1" />
              <div className="flex rounded-lg p-0.5 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-offset)' }}>
                {[
                  { key: 'liste', icon: 'list', label: 'Liste' },
                  { key: 'tablo', icon: 'table', label: 'Tablo' },
                ].map(({ key, icon, label }) => (
                  <button key={key} onClick={() => setGorünum(key)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: gorünum === key ? 'var(--color-surface)' : 'transparent',
                      color: gorünum === key ? 'var(--color-text)' : 'var(--color-text-muted)',
                      boxShadow: gorünum === key ? 'var(--shadow-sm)' : 'none',
                    }}
                    aria-label={label}>
                    <i data-lucide={icon} className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setModal('ekle')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
                style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                <i data-lucide="plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Ders Ekle</span>
              </button>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <IstatistikKarti label="Toplam Ders" value={toplamDers} icon="book-open" color="var(--color-primary)" />
              <IstatistikKarti label="Farklı Dersler" value={benzersizDers} icon="layers" color="var(--color-orange)" />
              <IstatistikKarti label="Öğretmenler" value={benzersizOgretmen} icon="users" color="var(--color-purple)" />
              <IstatistikKarti label="Aktif Gün" value={aktifGun} icon="calendar" color="var(--color-success)" />
            </div>
            {gorünum === 'liste' && (
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-48 relative">
                  <i data-lucide="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: 'var(--color-text-faint)' }} />
                  <input type="text" placeholder="Ders, öğretmen veya sınıf ara..." value={aramaMetni}
                    onChange={e => setAramaMetni(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 ring-primary/20"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
                <select value={filtre} onChange={e => setFiltre(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <option value="">Tüm Dersler</option>
                  {DERSLER.map(d => <option key={d}>{d}</option>)}
                </select>
                {(aramaMetni || filtre) && (
                  <button onClick={() => { setAramaMetni(''); setFiltre(''); }}
                    className="px-3 py-2 rounded-xl text-sm border transition-colors hover:opacity-70"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <i data-lucide="x" className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <div>
              {gorünum === 'liste' ? (
                <ListeGorunumu
                  dersler={dersler}
                  onEdit={(d) => { setSeciliDers(d); setModal('duzenle'); }}
                  onDelete={(d) => { setSeciliDers(d); setModal('sil'); }}
                  filtre={filtre}
                  aramaMetni={aramaMetni}
                />
              ) : (
                <TabloGorunumu dersler={dersler} />
              )}
            </div>
          </main>

          {modal === 'ekle' && (
            <DersModal onSave={handleEkle} onClose={() => setModal(null)} />
          )}
          {modal === 'duzenle' && seciliDers && (
            <DersModal ders={seciliDers} onSave={handleGuncelle} onClose={() => { setModal(null); setSeciliDers(null); }} />
          )}
          {modal === 'sil' && seciliDers && (
            <SilModal ders={seciliDers} onConfirm={handleSil} onClose={() => { setModal(null); setSeciliDers(null); }} />
          )}
          {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);