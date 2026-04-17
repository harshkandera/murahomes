'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, ArrowRight, RefreshCw, MapPin, Phone, User, Mail, Building2, Hash, CheckCircle2, ShoppingBag, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutModal({ open, onClose, cart, cartTotal, onSuccess }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState(null);

  useEffect(() => {
    if (open) {
      setOrderRef(null);
      if (user) {
        setForm(prev => ({
          ...prev,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email || '',
          phone: user.phone || '',
        }));
      }
    }
  }, [open, user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.state || !form.pinCode) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, ...form }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      const ref = data.inquiryId || data.id || data.consultationId;
      setOrderRef(ref ? ref.slice(-8).toUpperCase() : 'ORD-' + Date.now().toString(36).toUpperCase());
      onSuccess?.();
    } catch (err) {
      toast.error('Error al enviar el pedido', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);

  const handleBackToShopping = () => {
    setOrderRef(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={orderRef ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">

        {/* Success Screen */}
        {orderRef ? (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center animate-in zoom-in-50 duration-700">
                <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-medium text-foreground">¡Tu Solicitud Ha Sido Enviada!</h2>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Nuestro equipo revisará tu pedido y te enviará una factura en 24 horas.
              </p>
            </div>
            <div className="px-5 py-3 bg-secondary/40 rounded-lg text-xs font-mono text-muted-foreground tracking-widest">
              REF: {orderRef}
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              Se ha enviado una confirmación a <span className="font-medium text-foreground">{form.email}</span>
            </p>
            <button
              onClick={handleBackToShopping}
              className="flex items-center gap-2 mt-4 bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all"
            >
              <ShoppingBag size={15} /> Volver a Comprar
            </button>
          </div>
        ) : (
        <>
        {/* Header */}
        <div className="sticky top-0 bg-black text-white px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-2xl font-medium">Completar Tu Solicitud</h2>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Datos de Entrega y Contacto</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* Order Summary */}
          <div className="mb-8 p-5 bg-secondary/40 rounded-lg">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Resumen del Pedido</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.name} <span className="text-muted-foreground font-normal">×{item.quantity}</span></span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-serif text-xl font-medium">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Contact Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <User size={12} />Información de Contacto
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                    placeholder="tu@ejemplo.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                    Número de Teléfono
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin size={12} />Dirección de Entrega
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                    placeholder="Calle Mayor 123, Piso 4B"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                      Ciudad
                    </label>
                    <div className="relative">
                      <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                      Provincia <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                      placeholder="Provincia"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                      Código Postal <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        name="pinCode"
                        value={form.pinCode}
                        onChange={handleChange}
                        required
                        className="w-full h-11 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all bg-white"
                        placeholder="28001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic">
              * Todos los precios son orientativos. Un consultor de MuraHomes se pondrá en contacto contigo en 24 horas para confirmar disponibilidad y finalizar tu pedido.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isSubmitting ? (
                <><RefreshCw size={16} className="animate-spin" /> Procesando...</>
              ) : (
                <><Lock size={14} /> Enviar Pedido Seguro <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>

            {/* Payment trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-emerald-600">
                <Lock size={11} />
                <span className="text-[10px] font-semibold">SSL 256-bit</span>
              </div>
              <span className="text-border text-xs">·</span>
              <div className="h-6 px-2 bg-secondary rounded flex items-center">
                <span className="font-bold text-[11px] text-[#1A1F71] tracking-wider">VISA</span>
              </div>
              <div className="h-6 px-2 bg-secondary rounded flex items-center gap-0.5">
                <div className="w-4 h-4 rounded-full bg-red-500/70" />
                <div className="w-4 h-4 rounded-full bg-amber-400/70 -ml-2" />
              </div>
              <div className="h-6 px-2 bg-secondary rounded flex items-center">
                <span className="font-bold text-[11px]"><span className="text-[#009cde]">Pay</span><span className="text-[#003087]">Pal</span></span>
              </div>
              <div className="h-6 px-2 bg-[#FFB3C7]/20 rounded flex items-center">
                <span className="font-bold text-[11px] text-[#17120E]">klarna</span>
              </div>
            </div>
          </form>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
