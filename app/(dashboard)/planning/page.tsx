'use client';

import { Calendar, Clock, MapPin, ChevronRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockMissions, getStatusColor, getStatusLabel } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

export default function PlanningPage() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMissionsForDay = (day: Date) =>
    mockMissions.filter((m) => isSameDay(m.datePrevu, day));

  const totalWeek = mockMissions.length;
  const done = mockMissions.filter((m) => m.statut === StatutPassage.COMPLETE).length;

  return (
    <div className="pb-6 space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-[#0E5FA8] text-white px-5 pt-6 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="w-6 h-6 text-white/80" />
          <div>
            <h1 className="text-2xl font-bold font-display">Planning</h1>
            <p className="text-sm text-white/70">Semaine du {format(weekStart, 'd MMM', { locale: fr })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold font-mono">{totalWeek}</p>
            <p className="text-[11px] text-white/70">Missions</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold font-mono">{done}</p>
            <p className="text-[11px] text-white/70">Terminées</p>
          </div>
        </div>
      </div>

      {/* Day strip */}
      <div className="flex gap-1.5 px-4 py-4 overflow-x-auto">
        {weekDays.slice(0, 5).map((day) => {
          const isToday = isSameDay(day, today);
          const dayMissions = getMissionsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all ${
                isToday
                  ? 'bg-primary text-white shadow-ocean-sm'
                  : 'bg-white border border-border/60 text-text-muted'
              }`}
            >
              <p className="text-[10px] font-semibold uppercase">
                {format(day, 'EEE', { locale: fr })}
              </p>
              <p className={`text-lg font-bold font-mono ${isToday ? 'text-white' : 'text-text'}`}>
                {format(day, 'd')}
              </p>
              {dayMissions.length > 0 && (
                <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-primary'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 space-y-4">
        {weekDays.map((day) => {
          const dayMissions = getMissionsForDay(day);
          const isToday = isSameDay(day, today);
          if (!isToday && dayMissions.length === 0) return null;

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${isToday ? 'bg-primary' : 'bg-border'}`} />
                <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-text-muted'}`}>
                  {format(day, 'EEEE d MMMM', { locale: fr })}
                  {isToday && ' · Aujourd\'hui'}
                </p>
              </div>

              {dayMissions.length === 0 ? (
                <div className="bg-white border border-dashed border-border rounded-2xl p-4 text-center">
                  <p className="text-xs text-text-muted">Aucune mission planifiée</p>
                </div>
              ) : (
                dayMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/passage/${mission.id}`}
                    className="flex items-center gap-3 bg-white border border-border/70 rounded-2xl p-4 shadow-[0_1px_4px_rgba(11,94,168,0.06)] hover:border-primary/30 hover:shadow-ocean-sm active:scale-[0.99] transition-all group"
                  >
                    <div className={`w-2 self-stretch rounded-full flex-shrink-0 ${
                      mission.statut === StatutPassage.COMPLETE ? 'bg-success' :
                      mission.statut === StatutPassage.EN_COURS ? 'bg-warning' :
                      'bg-border'
                    }`} />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-xs font-bold text-primary">{mission.heure}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(mission.statut)}`}>
                          {getStatusLabel(mission.statut)}
                        </span>
                      </div>
                      <p className="font-bold text-text text-sm truncate">{mission.client}</p>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{mission.adresse}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
