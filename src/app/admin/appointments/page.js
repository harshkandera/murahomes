'use client';

import { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, Clock, CheckCircle2, XCircle, RefreshCw, Search, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_MAP = {
  pending:   { cls: 'bg-amber-50 text-amber-600',   label: 'Pending',   icon: <Clock size={10} /> },
  contacted: { cls: 'bg-blue-50 text-blue-600',     label: 'Contacted', icon: <Mail size={10} /> },
  confirmed: { cls: 'bg-emerald-50 text-emerald-600', label: 'Confirmed', icon: <CheckCircle2 size={10} /> },
  cancelled: { cls: 'bg-rose-50 text-rose-600',     label: 'Cancelled', icon: <XCircle size={10} /> },
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error();
      setAppointments(await res.json());
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = appointments.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
      <RefreshCw size={36} className="animate-spin" />
      <p className="tracking-widest uppercase text-xs font-bold">Loading Appointments...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight flex items-center gap-3">
            <Calendar className="text-primary opacity-80" />
            Showroom Appointments
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
            {appointments.length} total · {appointments.filter(a => a.status === 'pending').length} pending
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 w-64 rounded-xl border border-border bg-white px-10 text-sm focus:border-black focus:outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground italic">No appointments found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(appt => {
            const s = STATUS_MAP[appt.status] || STATUS_MAP.pending;
            return (
              <div key={appt.id} className="rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col gap-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground text-base">{appt.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted {new Date(appt.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${s.cls}`}>
                    {s.icon} {s.label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-primary shrink-0" />
                    <a href={`mailto:${appt.email}`} className="hover:text-foreground transition-colors truncate">{appt.email}</a>
                  </div>
                  {appt.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-primary shrink-0" />
                      <span>{appt.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-primary shrink-0" />
                    <span className="font-medium text-foreground">{appt.appointmentDate}</span>
                  </div>
                  {appt.message && (
                    <div className="flex items-start gap-2 pt-1">
                      <MessageSquare size={13} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed line-clamp-3">{appt.message}</p>
                    </div>
                  )}
                </div>

                {/* Status buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  {Object.keys(STATUS_MAP).map(st => (
                    <button
                      key={st}
                      onClick={() => updateStatus(appt.id, st)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        appt.status === st
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-muted-foreground border-border hover:border-black/40 hover:text-foreground'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
