import React from 'react';
import { Droplet, Trash2, Clock, Calendar } from 'lucide-react';
import { WaterIntakeRecord } from '../../types/water';

interface WaterHistoryTableProps {
  records: WaterIntakeRecord[];
  onDeleteRecord: (id: string) => void;
  isDeleting?: boolean;
}

export const WaterHistoryTable: React.FC<WaterHistoryTableProps> = ({
  records,
  onDeleteRecord,
  isDeleting = false,
}) => {
  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 mx-auto flex items-center justify-center border border-sky-100">
          <Droplet className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-base font-outfit">No Water Logged Today</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tap one of the quick-add buttons above or enter a custom amount to record your first glass of water.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-600" />
          <h3 className="font-bold text-slate-900 font-outfit text-base">Today's Intake Log</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
          {records.length} {records.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
        {records.map((record) => {
          const timeFormatted = new Date(record.timestamp || record.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={record.id}
              className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Droplet className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 font-outfit">
                    +{record.amountMl} ml
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                    <span>{timeFormatted}</span>
                    {record.notes && <span className="text-slate-500 font-medium">• {record.notes}</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteRecord(record.id)}
                disabled={isDeleting}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors opacity-70 group-hover:opacity-100 disabled:opacity-30"
                title="Remove Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
