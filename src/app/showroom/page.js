'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, MapPin, Clock, Phone, Mail, Calendar } from 'lucide-react';
import { event } from '@/lib/pixel';

const hours = [
  { day: 'Lunes – Viernes', time: '10:00 – 20:00' },
  { day: 'Sábado',          time: '10:00 – 18:00' },
  { day: 'Domingo',         time: 'Cerrado' },
];

export default function ShowroomPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          appointmentDate: form.date,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      event('Lead', { content_name: 'Showroom Appointment' });
      toast.success('Solicitud de Cita Enviada', {
        description: 'Nuestro equipo de diseño se pondrá en contacto contigo pronto para confirmar tu visita.',
      });
      setForm({ name: '', email: '', phone: '', date: '', message: '' });
    } catch {
      toast.error('Algo salió mal', { description: 'Por favor, inténtalo de nuevo o contáctanos directamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── PAGE HERO ────────────────────────────────────────────── */}
      <section className="relative bg-[#f9f7f4] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0ece4]" style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-black" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Bo. Txiki-Erdi, 7 · Usurbil, Gipuzkoa</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6">
                Visita Nuestro <span className="text-amber-500">Showroom</span>
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed mb-8 max-w-lg">
                Nuestro showroom insignia en Barcelona ocupa más de 929 m² — diseñado como una galería viva donde cada habitación cuenta una historia. Experimenta la escala, textura y comodidad de nuestras piezas de primera mano.
              </p>
              <a href="#book" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all group">
                Reservar una Cita <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/img4.jpg")' }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-serif text-xl">Showroom de Barcelona</p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">929 m²</p>
                </div>
                <div className="bg-amber-400 text-black rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider">
                  Abierto Hoy
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO BAR ────────────────────────────────────────────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {[
              { icon: MapPin,    label: 'Ubicación',         value: 'Bo. Txiki-Erdi, 7 · Usurbil, Gipuzkoa' },
              { icon: Clock,     label: 'Días Laborables',   value: 'Lun–Vie: 10:00 – 20:00' },
              { icon: Calendar,  label: 'Sábado',            value: '10:00 – 18:00 · Dom Cerrado' },
              { icon: Phone,     label: 'WhatsApp / Tel',    value: '+34 627 080 811' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-6">
                <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP PREVIEW + FORM ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Map + gallery */}
            <div className="space-y-5">
              <div
                className="w-full h-64 rounded-2xl bg-cover bg-center shadow-lg border border-border/50"
                style={{ backgroundImage: 'url("/images/img3.jpg")' }}
              />
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="h-40 rounded-2xl bg-cover bg-center shadow-md"
                  style={{ backgroundImage: 'url("/images/img1.jpg")' }}
                />
                <div
                  className="h-40 rounded-2xl bg-cover bg-center shadow-md"
                  style={{ backgroundImage: 'url("/images/img7.png")' }}
                />
              </div>
              <div className="bg-[#f9f7f4] rounded-2xl p-6 border border-border/50">
                <h3 className="font-serif text-lg font-semibold mb-3">Cómo Llegar</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex gap-2"><span className="font-semibold text-foreground min-w-20">Dirección:</span> Bo. Txiki-Erdi, 7, 20170 Usurbil, Gipuzkoa</div>
                  <div className="flex gap-2"><span className="font-semibold text-foreground min-w-20">En coche:</span> A-15, salida Usurbil · 10 min de Donostia</div>
                  <div className="flex gap-2"><span className="font-semibold text-foreground min-w-20">Aparcamiento:</span> Gratuito frente al local</div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div id="book" className="bg-white rounded-3xl border border-border shadow-xl p-8 lg:p-10 scroll-mt-24">
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 block mb-3">Consulta Privada</span>
                <h2 className="font-serif text-3xl font-semibold mb-2">Reservar una <span className="text-amber-500">Cita</span></h2>
                <p className="text-sm text-muted-foreground font-light">
                  Programa una sesión privada con uno de nuestros diseñadores de interiores sénior.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Nombre Completo *</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre completo" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Email *</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@ejemplo.com" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Teléfono</Label>
                    <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Fecha Preferida *</Label>
                    <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required className="h-11 bg-[#f9f7f4] border-border/60 focus-visible:ring-black" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Detalles del Proyecto</Label>
                  <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Cuéntanos sobre los espacios que deseas amueblar..." rows={4} className="bg-[#f9f7f4] border-border/60 focus-visible:ring-black resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando Solicitud...' : <>Solicitar Consulta <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Confirmaremos tu cita en 24 horas por email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────── */}
      <section className="py-14 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">¿No puedes visitarnos en persona?</p>
            <h3 className="font-serif text-2xl font-medium text-white">Compra nuestras colecciones online</h3>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all group shrink-0">
            Explorar Productos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
