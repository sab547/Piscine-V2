'use client';

import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockMissions, getStatusColor, getStatusLabel } from '@/lib/mock-data';

export default function PlanningPage() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getMissionsForDay = (day: Date) => {
    return mockMissions.filter(
      (m) =>
        format(m.datePrevu, 'yyyy-MM-dd') ===
        format(day, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text font-display">
        Planning semaine
      </h1>

      <div className="space-y-2">
        {weekDays.map((day) => {
          const dayMissions = getMissionsForDay(day);
          const isToday =
            format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

          return (
            <div
              key={day.toISOString()}
              className={`rounded-lg border ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface'
              } p-4 space-y-3`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-text">
                    {format(day, 'EEEE', { locale: fr })}
                  </p>
                  <p className="text-xs text-text-muted">
                    {format(day, 'd MMMM', { locale: fr })}
                  </p>
                </div>
                {isToday && (
                  <span className="ml-auto text-xs font-semibold bg-primary text-white px-2 py-1 rounded-full">
                    Aujourd'hui
                  </span>
                )}
              </div>

              {dayMissions.length > 0 ? (
                <div className="space-y-2 mt-3 border-t border-border/50 pt-3">
                  {dayMissions.map((mission) => (
                    <Link
                      key={mission.id}
                      href={`/passage/${mission.id}`}
                      className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm text-text">
                              {mission.heure}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(
                                mission.statut
                              )}`}
                            >
                              {getStatusLabel(mission.statut)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-text mt-1">
                            {mission.client}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                            <MapPin className="w-3 h-3" />
                            {mission.adresse.split(',')[0]}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted text-center py-2">
                  Aucune mission
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
