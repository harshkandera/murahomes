'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Calendar, MapPin, Phone, Mail, FileText,
  Download, Clock, CheckCircle2, XCircle, RefreshCw,
  ChevronDown, ChevronUp, ExternalLink, ArrowRight, ShoppingBag
} from 'lucide-react';

const STATUS_STEPS = ['pending', 'contacted', 'completed'];

const STATUS_CONFIG = {
  pending:   { label: 'En Revisión',  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: Clock },
  contacted: { label: 'En Proceso',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',  icon: Mail },
  completed: { label: 'Completado',   color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: CheckCircle2 },
  cancelled: { label: 'Cancelado',    color: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200',  icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ status }) {
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 text-rose-500 text-xs font-medium">
      <XCircle size={14} /> Pedido Cancelado
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(status);
  const labels = ['Pedido Realizado', 'En Proceso', 'Completado'];

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentStep;
        const active = i === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-black border-black' : 'bg-white border-border'
              }`}>
                {done
                  ? <CheckCircle2 size={14} className="text-white" />
                  : <div className="w-2 h-2 rounded-full bg-border" />
                }
              </div>
              <span className={`mt-1.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${
                active ? 'text-foreground' : done ? 'text-foreground/60' : 'text-muted-foreground'
              }`}>
                {labels[i]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-[2px] w-16 sm:w-24 mx-1 mb-5 transition-all ${i < currentStep ? 'bg-black' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const ref = `#${order.id.slice(-8).toUpperCase()}`;
  const fmt = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Card Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 cursor-pointer hover:bg-secondary/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-medium text-foreground">Pedido {ref}</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Package size={11} />
              {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="font-serif text-xl font-semibold">{fmt(order.totalPrice)}</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground shrink-0">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border px-6 pb-6 pt-5 space-y-6">

          {/* Progress Tracker */}
          <div className="overflow-x-auto">
            <ProgressBar status={order.status} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">
                Tu Selección
              </h4>
              {items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center bg-secondary/30 rounded-xl p-3 border border-border/40">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Package size={18} /></div>
                    }
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                      {item.brand} &nbsp;·&nbsp; Cant.: {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-sm font-medium shrink-0">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}

              {/* Total row */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total del Pedido</span>
                <span className="font-serif text-xl font-semibold">{fmt(order.totalPrice)}</span>
              </div>
            </div>

            {/* Right column: Delivery + Invoice */}
            <div className="space-y-4">
              {/* Delivery */}
              {order.address && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-2 mb-3">
                    Dirección de Entrega
                  </h4>
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2 items-start">
                      <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">{order.address}</p>
                        {order.city && <p>{order.city}</p>}
                        <p>{order.state}{order.pinCode ? ` — ${order.pinCode}` : ''}</p>
                      </div>
                    </div>
                    {order.customerPhone && (
                      <div className="flex gap-2 items-center">
                        <Phone size={13} className="text-primary shrink-0" />
                        <p>{order.customerPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invoice */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground border-b border-border pb-2 mb-3">
                  Factura
                </h4>
                {order.invoiceUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                      <CheckCircle2 size={13} />
                      {order.invoiceShared ? 'Factura enviada a tu email' : 'Factura lista'}
                    </div>
                    <a
                      href={order.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-10 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all"
                    >
                      <Download size={13} /> Descargar Factura
                    </a>
                  </div>
                ) : (
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/40 text-center">
                    <FileText size={20} className="mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-xs text-muted-foreground">La factura se compartirá una vez que tu pedido sea confirmado por nuestro equipo.</p>
                  </div>
                )}
              </div>

              {/* Support */}
              <a
                href={`mailto:info@mura-homes.com?subject=Pedido ${ref}`}
                className="flex items-center justify-center gap-2 w-full h-10 border border-border bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-black hover:text-foreground transition-all"
              >
                <Mail size={13} /> Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) router.push('/sign-in');
  }, [isLoaded, user]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    fetch('/api/orders', { signal: controller.signal })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, [user]);

  if (!isLoaded || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-px w-8 bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Mi Cuenta</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground">Mis Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.firstName ? `Bienvenido de nuevo, ${user.firstName}.` : 'Rastrea tus pedidos y descarga facturas a continuación.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10">
        {orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
              <ShoppingBag size={32} className="text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-serif text-xl text-foreground mb-1">Sin pedidos aún</p>
              <p className="text-sm text-muted-foreground">Cuando realices un pedido, aparecerá aquí.</p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all rounded-sm"
            >
              Explorar Colección <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground font-medium">{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</p>
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
