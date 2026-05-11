'use client';

import { Suspense, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Trash2, Send, FileText, CheckCircle2, PenLine, RotateCcw, Loader2 } from 'lucide-react';
import { mockProprietaire, mockPiscines } from '@/lib/mock-data';
import { format } from 'date-fns';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

const PRESETS = [
  { description: 'Traitement choc chlore', qty: 1, unitPrice: 45 },
  { description: 'Réglage pH + alcalinité', qty: 1, unitPrice: 35 },
  { description: 'Nettoyage filtre à sable', qty: 1, unitPrice: 80 },
  { description: 'Remplacement cartouche filtrante', qty: 1, unitPrice: 120 },
  { description: 'Hivernage complet piscine', qty: 1, unitPrice: 250 },
  { description: 'Main d\'œuvre technicien (h)', qty: 2, unitPrice: 65 },
];

function DevisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [sent, setSent] = useState(false);

  const anomalie = searchParams.get('anomalie') || '';
  const piscineParam = searchParams.get('piscine') || mockPiscines[0].nom;

  const [client, setClient] = useState(`${mockProprietaire.prenom} ${mockProprietaire.nom}`);
  const [piscine, setPiscine] = useState(piscineParam);
  const [validite, setValidite] = useState(30);
  const [items, setItems] = useState<LineItem[]>(() => {
    if (anomalie) {
      return [{ id: '1', description: `Correction : ${anomalie}`, qty: 1, unitPrice: 60 }];
    }
    return [{ id: '1', description: 'Entretien piscine mensuel', qty: 1, unitPrice: 120 }];
  });

  const totalHT = items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);
  const tva = totalHT * 0.1;
  const totalTTC = totalHT + tva;
  const devisNum = `DEV-${format(new Date(), 'yyyyMM')}-${String(Math.floor(Math.random() * 900 + 100)).padStart(3, '0')}`;

  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now().toString(), description: '', qty: 1, unitPrice: 0 }]);

  const addPreset = (preset: typeof PRESETS[0]) =>
    setItems((prev) => [...prev, { id: Date.now().toString(), ...preset }]);

  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setDrawing(true);
    setHasSig(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#0B5EA8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => router.push('/dashboard'), 3000);
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 gap-5 text-center">
        <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text font-display">Devis envoyé !</h2>
          <p className="text-sm text-text-muted mt-2">
            {mockProprietaire.email} va recevoir le devis {devisNum} sous quelques minutes.
          </p>
        </div>
        <div className="text-xs text-text-muted animate-pulse">Redirection…</div>
      </div>
    );
  }

  return (
    <div className="pb-6 space-y-0">
      <div className="bg-gradient-to-br from-[#4A6A8A] to-[#2D4A6A] text-white px-5 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6 text-white/80" />
          <h1 className="text-2xl font-bold font-display">Nouveau devis</h1>
        </div>
        <p className="text-sm text-white/70">N° {devisNum}</p>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {anomalie && (
          <div className="bg-warning/8 border border-warning/20 rounded-2xl p-4">
            <p className="text-xs font-bold text-warning mb-1">Déclenché par anomalie</p>
            <p className="text-sm text-text">{anomalie}</p>
          </div>
        )}

        {/* Infos */}
        <div className="bg-white border border-border/70 rounded-2xl p-4 space-y-3 shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
          <h2 className="text-sm font-bold text-text">Informations</h2>
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1 block">Client</label>
            <input className="input-base text-sm" value={client} onChange={(e) => setClient(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1 block">Piscine</label>
            <select className="input-base text-sm" value={piscine} onChange={(e) => setPiscine(e.target.value)}>
              {mockPiscines.map((p) => (
                <option key={p.id} value={p.nom}>{p.nom} — {p.ville}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted mb-1 block">Validité (jours)</label>
            <input
              type="number" min={7} max={90}
              className="input-base text-sm"
              value={validite}
              onChange={(e) => setValidite(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-text">Ajouter rapidement</h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.description}
                onClick={() => addPreset(p)}
                className="text-[10px] font-semibold bg-primary/8 text-primary border border-primary/20 px-2.5 py-1.5 rounded-lg hover:bg-primary/15 active:scale-95 transition-all"
              >
                + {p.description}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-border/70 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
          <div className="px-4 py-3 border-b border-border/50">
            <h2 className="text-sm font-bold text-text">Prestations</h2>
          </div>
          <div className="divide-y divide-border/40">
            {items.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted">#{idx + 1}</span>
                  <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-danger/10 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
                <input
                  className="input-base text-sm"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="w-20">
                    <label className="text-[10px] font-semibold text-text-muted block mb-1">Qté</label>
                    <input type="number" min={1} className="input-base text-sm" value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-text-muted block mb-1">Prix unit. HT (€)</label>
                    <input type="number" min={0} step={0.5} className="input-base text-sm" value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-text-muted block mb-1">Total HT</label>
                    <div className="input-base text-sm bg-surface text-text-muted font-mono pointer-events-none">
                      {(item.qty * item.unitPrice).toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border/50">
            <button onClick={addItem} className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </button>
          </div>
          <div className="bg-surface px-4 py-4 space-y-1.5">
            <div className="flex justify-between text-sm text-text-muted">
              <span>Total HT</span><span className="font-mono font-semibold">{totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-text-muted">
              <span>TVA 10%</span><span className="font-mono font-semibold">{tva.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-bold text-text border-t border-border/60 pt-2">
              <span>Total TTC</span><span className="font-mono text-primary">{totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Signature canvas */}
        <div className="bg-white border border-border/70 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-text">Signature technicien</h2>
            </div>
            {hasSig && (
              <button onClick={clearSig} className="flex items-center gap-1 text-xs text-danger">
                <RotateCcw className="w-3 h-3" /> Effacer
              </button>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-text-muted mb-3">Signez dans le cadre (doigt ou souris)</p>
            <canvas
              ref={canvasRef} width={600} height={150}
              className="w-full border-2 border-dashed border-border rounded-xl bg-[#FAFBFD] touch-none cursor-crosshair"
              style={{ height: '120px' }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
            {!hasSig && (
              <p className="text-[11px] text-text-muted text-center mt-2">Signature requise pour envoyer</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={items.length === 0 || !hasSig}
          className="btn-primary w-full text-base py-4 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          Envoyer le devis par email
        </button>
        <p className="text-xs text-text-muted text-center">
          Envoi à {mockProprietaire.email} · valable {validite} jours
        </p>
      </div>
    </div>
  );
}

export default function DevisPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <DevisContent />
    </Suspense>
  );
}
