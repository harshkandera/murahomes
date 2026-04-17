import {
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Package,
  Layers,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

function StatCard({ label, value, icon: Icon, sub, accent }) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all hover:shadow-md ${accent ? 'bg-black text-white border-black' : 'bg-white border-border'}`}>
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${accent ? 'bg-white/10' : 'bg-secondary'}`}>
          <Icon size={18} className={accent ? 'text-white' : 'text-primary'} />
        </div>
        <ArrowUpRight size={16} className={accent ? 'text-white/40' : 'text-muted-foreground/40'} />
      </div>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${accent ? 'text-white/50' : 'text-muted-foreground'}`}>{label}</p>
        <p className={`text-3xl font-bold font-serif tracking-tight ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
        {sub && <p className={`text-xs mt-1 ${accent ? 'text-white/40' : 'text-muted-foreground'}`}>{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   { cls: 'bg-amber-50 text-amber-600',   icon: <Clock size={9} />,        label: 'Pending' },
    contacted: { cls: 'bg-blue-50 text-blue-600',     icon: <Mail size={9} />,         label: 'Contacted' },
    completed: { cls: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle2 size={9}/>, label: 'Completed' },
    cancelled: { cls: 'bg-rose-50 text-rose-600',     icon: <AlertCircle size={9} />,  label: 'Cancelled' },
  };
  const s = map[status] || { cls: 'bg-secondary text-muted-foreground', icon: null, label: status };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

export default async function AdminDashboard() {
  const [productCount, brandCount, consultations] = await Promise.all([
    prisma.product.count(),
    prisma.brand.count(),
    prisma.consultation.findMany({ orderBy: { createdAt: 'desc' }, take: 6 })
  ]);

  const totalValue     = consultations.reduce((a, c) => a + c.totalPrice, 0);
  const pendingCount   = consultations.filter(c => c.status === 'pending').length;

  const fmt = (p) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">MuraHomes — Admin Overview</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-black text-white rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black/80 transition-all"
        >
          + New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Inquiry Volume"   value={fmt(totalValue)}            icon={DollarSign}   sub={`${consultations.length} total requests`} accent />
        <StatCard label="Products"         value={productCount.toString()}     icon={Package}      sub="In catalog" />
        <StatCard label="Brands"           value={brandCount.toString()}       icon={Layers}       sub="Active partners" />
        <StatCard label="Pending Orders"   value={pendingCount.toString()}     icon={Clock}        sub="Awaiting review" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Consultations — 2/3 width */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary" />
              <span className="font-semibold text-sm">Recent Consultations</span>
            </div>
            <Link href="/admin/consultations" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-black transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {consultations.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm italic">No consultations yet.</div>
            ) : (
              consultations.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href="/admin/consultations"
                  className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary font-serif shrink-0">
                      {inquiry.customerName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-black transition-colors truncate">{inquiry.customerName}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                        {inquiry.items[0]?.name}{inquiry.items.length > 1 ? ` +${inquiry.items.length - 1} more` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                    <StatusBadge status={inquiry.status} />
                    <span className="text-[10px] text-muted-foreground">{fmt(inquiry.totalPrice)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column — quick links */}
        <div className="flex flex-col gap-4">

          {/* Quick nav cards */}
          {[
            { label: 'Manage Products', href: '/admin/products', icon: Package, count: productCount, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Manage Brands',   href: '/admin/brands',   icon: Layers,  count: brandCount,   color: 'text-blue-600',  bg: 'bg-blue-50' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-border bg-white p-5 flex items-center justify-between hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2.5 ${item.bg}`}>
                  <item.icon size={16} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-black transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.count} entries</p>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-muted-foreground/40 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          ))}

          {/* Highlight card */}
          <div className="rounded-2xl border border-border bg-black text-white p-5 mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Pro Tip</p>
            <p className="text-sm font-medium leading-relaxed mb-4">
              Mark featured products to ensure they appear on the homepage for customers.
            </p>
            <Link
              href="/admin/products"
              className="block text-center bg-white text-black rounded-lg py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Edit Featured Products
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
