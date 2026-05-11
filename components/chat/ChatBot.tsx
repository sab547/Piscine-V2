'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: Date;
}

const FAQ: Record<string, string> = {
  'intervention': 'Une intervention dure en moyenne 45 minutes. Vous recevrez un rapport par email avec les photos avant/après et les mesures d\'eau.',
  'rapport': 'Vos rapports sont disponibles dans votre espace client via le lien sécurisé envoyé par email. Chaque rapport inclut les mesures pH, chlore et température.',
  'devis': 'Pour obtenir un devis, contactez-nous ou signalez une anomalie depuis votre portail. Nous vous enverrons un devis signable en ligne sous 24h.',
  'anomalie': 'En cas d\'anomalie détectée (pH, chlore hors norme), votre technicien en est automatiquement informé et prendra contact avec vous sous 2h.',
  'paiement': 'Nous acceptons les paiements par carte bancaire, virement et prélèvement automatique. Toutes les transactions sont sécurisées par Stripe.',
  'contact': 'Vous pouvez nous joindre au +33 4 93 00 00 00 ou par email à contact@pooltrackpro.fr du lundi au vendredi de 8h à 18h.',
  'fréquence': 'La fréquence d\'entretien recommandée est de 2 fois par mois en été et 1 fois par mois en hiver. Nous vous contacterons avant chaque passage.',
  'normes': 'Les normes eau piscine : pH entre 7.0 et 7.6, chlore entre 1.0 et 3.0 ppm, température entre 24 et 28°C.',
};

const QUICK_QUESTIONS = [
  { label: '🔧 Intervention', key: 'intervention' },
  { label: '📄 Mon rapport', key: 'rapport' },
  { label: '💶 Devis', key: 'devis' },
  { label: '📞 Contact', key: 'contact' },
];

const WELCOME = 'Bonjour ! Je suis l\'assistant PoolTrack. Comment puis-je vous aider ? Choisissez une question fréquente ou posez la vôtre.';

function findAnswer(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ)) {
    if (lower.includes(key)) return answer;
  }
  for (const [key, answer] of Object.entries(FAQ)) {
    const words = key.split(' ');
    if (words.some((w) => lower.includes(w) && w.length > 3)) return answer;
  }
  return 'Je n\'ai pas trouvé de réponse précise à votre question. Notre équipe est disponible au +33 4 93 00 00 00 ou par email à contact@pooltrackpro.fr.';
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', text: WELCOME, time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread((u) => u + 1);
    }
  }, [messages.length, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: answer, time: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 bg-primary hover:bg-primary-dark active:scale-95 text-white rounded-2xl shadow-ocean-lg transition-all flex items-center justify-center ${open ? 'scale-0 pointer-events-none' : 'scale-100'}`}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-4 z-50 w-80 max-h-[480px] bg-white border border-border/70 rounded-2xl shadow-ocean-lg flex flex-col transition-all duration-200 origin-bottom-right ${
          open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-primary rounded-t-2xl">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Assistant PoolTrack</p>
            <p className="text-[10px] text-white/70">Disponible 24h/24</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Quick questions */}
        <div className="flex gap-1.5 p-3 pb-0 overflow-x-auto flex-shrink-0">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q.key}
              onClick={() => sendMessage(q.key)}
              className="whitespace-nowrap text-[10px] font-semibold bg-primary/8 text-primary border border-primary/20 px-2.5 py-1.5 rounded-lg hover:bg-primary/15 transition-colors flex-shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'bot' ? 'bg-primary/10' : 'bg-surface'}`}>
                {msg.role === 'bot' ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-text-muted" />}
              </div>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-surface text-text rounded-bl-sm'
                    : 'bg-primary text-white rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-surface px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border/50">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre question…"
            className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-8 h-8 bg-primary disabled:opacity-40 hover:bg-primary-dark active:scale-95 text-white rounded-xl flex items-center justify-center transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}
