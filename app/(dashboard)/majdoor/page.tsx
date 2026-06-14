'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { formatCurrency } from '@/lib/utils';
import { Clock, Plus, CreditCard, X, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Worker { id: string; name: string; phone: string; daily_wage: number; skill_type: string; }


const tabs = [
  { key: 'attendance', en: "Today's Attendance", hi: 'आज की उपस्थिति', kn: 'ಇಂದಿನ ಹಾಜರಾತಿ' },
  { key: 'workers', en: 'My Workers', hi: 'मेरे मजदूर', kn: 'ನನ್ನ ಕೆಲಸಗಾರರು' },
  { key: 'ledger', en: 'Wage Ledger', hi: 'मजदूरी खाता', kn: 'ಕೂಲಿ ಲೆಡ್ಜರ್' },
  { key: 'report', en: 'Monthly Report', hi: 'मासिक रिपोर्ट', kn: 'ಮಾಸಿಕ ವರದಿ' },
];

const skillTypes = ['general', 'harvesting', 'sowing', 'spraying', 'irrigation'];

export default function MajdoorPage() {
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState('attendance');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<Record<string, { status: string; task: string }>>({});
  const [allAttendance, setAllAttendance] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', daily_wage: '425', skill_type: 'general' });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function load() {
      try {
        const res = await fetch('/api/majdoor');
        const data = await res.json();
        if (data.workers) setWorkers(data.workers);
        
        // Map attendance records to state
        if (data.attendanceRecords) {
          setAllAttendance(data.attendanceRecords);
          const loadedAtt: Record<string, any> = {};
          const today = new Date().toISOString().split('T')[0];
          data.attendanceRecords.forEach((r: any) => {
            if (r.attendance_date === today) {
              loadedAtt[r.worker_id] = { status: r.status, task: r.task || '' };
            }
          });
          setAttendance(loadedAtt);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const setWorkerAttendance = (wid: string, status: string) => {
    setAttendance({ ...attendance, [wid]: { ...attendance[wid], status, task: attendance[wid]?.task || '' } });
  };

  const setWorkerTask = (wid: string, task: string) => {
    setAttendance({ ...attendance, [wid]: { ...attendance[wid], task, status: attendance[wid]?.status || 'present' } });
  };

  const saveAttendance = async () => {
    try {
      const records = Object.entries(attendance).map(([worker_id, data]) => {
        const worker = workers.find(w => w.id === worker_id);
        const wage_earned = data.status === 'present' ? worker?.daily_wage : data.status === 'half_day' ? (worker?.daily_wage || 0) / 2 : 0;
        return { worker_id, status: data.status, task: data.task, wage_earned };
      });

      await fetch('/api/majdoor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_attendance', records })
      });
      alert(language === 'hi' ? 'उपस्थिति सेव हो गई!' : language === 'kn' ? 'ಹಾಜರಾತಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Attendance saved successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const addWorker = async () => {
    try {
      const res = await fetch('/api/majdoor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_worker',
          name: newWorker.name,
          phone: newWorker.phone || null,
          daily_wage: parseFloat(newWorker.daily_wage) || 425,
          skill_type: newWorker.skill_type || 'general'
        })
      });
      const data = await res.json();
      if (data.success && data.worker) {
        setWorkers([...workers, data.worker]);
        setShowAddWorker(false);
        setNewWorker({ name: '', phone: '', daily_wage: '425', skill_type: 'general' });
      } else {
        alert(data.error || 'Failed to add worker');
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error: ' + e.message);
    }
  };

  const deleteWorker = async (wid: string) => {
    if (!confirm(language === 'hi' ? 'क्या आप इस मजदूर को हटाना चाहते हैं?' : language === 'kn' ? 'ಈ ಕೆಲಸಗಾರನನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವೇ?' : 'Are you sure you want to delete this worker?')) return;
    try {
      const res = await fetch(`/api/majdoor?worker_id=${wid}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkers(workers.filter(w => w.id !== wid));
      } else {
        alert('Failed to delete worker');
      }
    } catch (e) {
      console.error(e);
      alert('Network error');
    }
  };

  const markPaid = async (wid: string) => {
    try {
      await fetch('/api/majdoor', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_paid', worker_id: wid })
      });
      setAllAttendance(allAttendance.map(a => a.worker_id === wid ? { ...a, payment_status: 'paid' } : a));
      const newAttendance = { ...attendance };
      delete newAttendance[wid];
      setAttendance(newAttendance);
      alert(language === 'hi' ? 'भुगतान दर्ज किया गया!' : language === 'kn' ? 'ಪಾವತಿ ದಾಖಲಿಸಲಾಗಿದೆ!' : 'Payment marked as completed!');
    } catch (e) {
      console.error(e);
    }
  };

  // Dynamic Ledger Calculation
  const workerStats = workers.map((w) => {
    const records = allAttendance.filter((a) => a.worker_id === w.id);
    const totalDays = records.reduce((sum, r) => sum + (r.status === 'present' ? 1 : r.status === 'half_day' ? 0.5 : 0), 0);
    const totalEarned = records.reduce((sum, r) => sum + (r.wage_earned || 0), 0);
    const pendingEarned = records.filter(r => r.payment_status === 'pending').reduce((sum, r) => sum + (r.wage_earned || 0), 0);
    return { ...w, totalDays, totalEarned, pendingEarned };
  });

  const totalPending = workerStats.reduce((sum, w) => sum + w.pendingEarned, 0);

  // Dynamic Chart Data (Group by week)
  const getChartData = () => {
    if (!isClient) return [];
    const weeklyCosts: Record<string, number> = {};
    allAttendance.forEach(r => {
      if (!r.wage_earned) return;
      const d = new Date(r.attendance_date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff)).toISOString().split('T')[0];
      const weekLabel = `Week ${monday.split('-').slice(1).join('/')}`;
      weeklyCosts[weekLabel] = (weeklyCosts[weekLabel] || 0) + Number(r.wage_earned);
    });
    const sortedWeeks = Object.keys(weeklyCosts).sort();
    return sortedWeeks.slice(-4).map(week => ({ week, cost: weeklyCosts[week] }));
  };

  const chartData = getChartData().length > 0 ? getChartData() : [{ week: 'No Data', cost: 0 }];

  const title = language === 'hi' ? 'डिजिटल मजदूर 👷' : language === 'kn' ? 'ಡಿಜಿಟಲ್ ಮಜ್ದೂರ್ 👷' : 'Digital Majdoor 👷';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>

      {/* Min wage info */}
      <div className="card-krishisetu p-3 bg-amber-50 border-amber-200">
        <p className="text-xs text-amber-800">
          ℹ️ {language === 'hi' ? 'कर्नाटक कृषि न्यूनतम मजदूरी: ₹425/दिन (अकुशल), ₹512/दिन (कुशल)' : language === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಕನಿಷ್ಠ ಕೂಲಿ: ₹425/ದಿನ (ಅಕುಶಲ), ₹512/ದಿನ (ಕುಶಲ)' : 'Karnataka agriculture min wage: ₹425/day (unskilled), ₹512/day (skilled)'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-white shadow-sm text-primary' : 'text-krishisetu-text-muted hover:text-krishisetu-text-body'
            }`}>{tab[language as keyof typeof tab]}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'attendance' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-krishisetu-text-muted">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="font-mono text-sm font-bold text-krishisetu-text-primary">
              {language === 'hi' ? 'कुल बकाया' : 'Total'}: {formatCurrency(totalPending)}
            </p>
          </div>
          {workers.map((w) => (
            <div key={w.id} className="card-krishisetu p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm text-krishisetu-text-body">{w.name}</p>
                  <p className="text-xs text-krishisetu-text-muted">{w.skill_type} • {formatCurrency(w.daily_wage)}/day</p>
                </div>
                <div className="flex gap-1">
                  {['present', 'half_day', 'absent'].map((s) => (
                    <button key={s} onClick={() => setWorkerAttendance(w.id, s)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        attendance[w.id]?.status === s
                          ? s === 'present' ? 'bg-green-500 text-white' : s === 'half_day' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
                      }`}>
                      {s === 'present' ? 'P' : s === 'half_day' ? '½' : 'A'}
                    </button>
                  ))}
                </div>
              </div>
              {attendance[w.id]?.status && attendance[w.id]?.status !== 'absent' && (
                <input placeholder="Task description" value={attendance[w.id]?.task || ''} onChange={(e) => setWorkerTask(w.id, e.target.value)}
                  className="w-full rounded-md border border-krishisetu-border px-2.5 py-1.5 text-xs mt-1" />
              )}
            </div>
          ))}
          <button onClick={saveAttendance} className="btn-primary w-full">
            {language === 'hi' ? 'उपस्थिति सेव करें' : language === 'kn' ? 'ಹಾಜರಾತಿ ಉಳಿಸಿ' : 'Save Attendance'}
          </button>
        </div>
      )}

      {activeTab === 'workers' && (
        <div className="space-y-3">
          {workers.map((w) => (
            <div key={w.id} className="card-krishisetu p-3.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-krishisetu-text-body">{w.name}</p>
                <p className="text-xs text-krishisetu-text-muted">📞 {w.phone || 'N/A'} • {w.skill_type}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm font-bold text-krishisetu-text-primary">{formatCurrency(w.daily_wage)}/day</p>
                <button onClick={() => deleteWorker(w.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAddWorker(true)} className="btn-secondary w-full flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> {language === 'hi' ? 'मजदूर जोड़ें' : language === 'kn' ? 'ಕೆಲಸಗಾರ ಸೇರಿಸಿ' : 'Add Worker'}
          </button>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="space-y-3">
          {workerStats.map((w) => (
            <div key={w.id} className="card-krishisetu p-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm text-krishisetu-text-body">{w.name}</p>
                {w.pendingEarned > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 rounded-md p-2"><p className="font-mono font-bold">{w.totalDays}</p><p className="text-krishisetu-text-muted">Days</p></div>
                <div className="bg-gray-50 rounded-md p-2"><p className="font-mono font-bold">{formatCurrency(w.totalEarned)}</p><p className="text-krishisetu-text-muted">Earned</p></div>
                <div className="bg-amber-50 rounded-md p-2"><p className="font-mono font-bold text-amber-700">{formatCurrency(w.pendingEarned)}</p><p className="text-krishisetu-text-muted">Pending</p></div>
              </div>
              {w.pendingEarned > 0 && (
                <button onClick={() => markPaid(w.id)} className="btn-secondary w-full mt-2 text-xs flex items-center justify-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" /> {language === 'hi' ? 'भुगतान करें' : 'Mark Paid'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="card-krishisetu p-4">
            <h3 className="font-heading text-base font-semibold text-krishisetu-text-primary mb-3">
              📊 {language === 'hi' ? 'साप्ताहिक श्रम लागत' : 'Weekly Labor Cost'}
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" fontSize={11} tick={{ fill: '#6b7280' }} />
                  <YAxis fontSize={11} tick={{ fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #bbf7d0', fontSize: '12px' }}
                    formatter={(value: unknown) => [formatCurrency(Number(value || 0)), 'Cost']} />
                  <Bar dataKey="cost" fill="#166534" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {showAddWorker && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">Add Worker</h2>
              <button onClick={() => setShowAddWorker(false)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Name" value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
              <input placeholder="Phone" value={newWorker.phone} onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
              <input placeholder="Daily wage (₹)" type="number" value={newWorker.daily_wage} onChange={(e) => setNewWorker({ ...newWorker, daily_wage: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
              <select value={newWorker.skill_type} onChange={(e) => setNewWorker({ ...newWorker, skill_type: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm">
                {skillTypes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={addWorker} disabled={!newWorker.name} className="btn-primary w-full">Add Worker</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
