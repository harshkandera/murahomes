'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { src: '/images/img3.jpg',  alt: 'Sofá tapizado de lujo' },
  { src: '/images/img2.jpg',  alt: 'Espacio de vida moderno' },
  { src: '/images/img9.jpg',  alt: 'Sillones elegantes' },
  { src: '/images/img10.jpg', alt: 'Sillón de acento contemporáneo' },
  { src: '/images/img11.jpg', alt: 'Colección de sofás de diseño' },
];

export default function HomeHero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent(i => (i + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(i => (i - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section className="relative w-full min-h-[92vh] bg-[#f9f7f4] overflow-hidden flex items-center">

      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-[#f0ece4] clip-right" style={{clipPath:'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'}} />
      <div className="absolute bottom-8 left-[8%] w-32 h-32 rounded-full border border-black/5" />
      <div className="absolute top-16 right-[38%] w-6 h-6 rounded-full bg-amber-400/30" />
      <div className="absolute bottom-24 right-[12%] w-3 h-3 rounded-full bg-black/10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">

          {/* Left — Text Content */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="h-px w-10 bg-black" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Colección Destacada 2025</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-semibold leading-[1.05] tracking-tight mb-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-100 fill-mode-both">
              <span className="block text-5xl md:text-6xl lg:text-7xl text-foreground">Espacios de Diseño.</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl text-amber-500">Vive Mejor.</span>
            </h1>

            {/* Sub */}
            <p className="text-base text-muted-foreground font-light leading-relaxed max-w-md mb-10 animate-in fade-in slide-in-from-left-4 duration-700 delay-200 fill-mode-both">
              Muebles de lujo mediterráneos seleccionados — cada pieza diseñada para elevar tu vida cotidiana a través del diseño atemporal y la calidad sin compromiso.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-both">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all duration-300"
              >
                Comprar Ahora
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black/20 pb-0.5 hover:border-black transition-all duration-300"
              >
                Nuestra Historia
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform opacity-60" />
              </Link>
            </div>

            {/* Social strip */}
            <div className="mt-12 pt-8 border-t border-black/10 flex items-center gap-6 animate-in fade-in duration-700 delay-500 fill-mode-both">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Síguenos</span>
              {['Instagram', 'Pinterest', 'Houzz'].map(s => (
                <a key={s} href="#" className="text-xs font-medium text-muted-foreground hover:text-black transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Right — Slideshow */}
          <div className="relative flex items-center justify-center h-[500px] lg:h-[680px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">

            {/* Main slideshow container */}
            <div
              className="relative z-10 w-full h-[90%] max-w-lg"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-[#f0ece4]">
                {slides.map((slide, i) => (
                  <div
                    key={slide.src}
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out rounded-2xl"
                    style={{
                      backgroundImage: `url("${slide.src}")`,
                      opacity: i === current ? 1 : 0,
                      zIndex: i === current ? 1 : 0,
                    }}
                    role="img"
                    aria-label={slide.alt}
                  />
                ))}
              </div>

              {/* Slide navigation arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                style={{ opacity: isPaused ? 1 : 0 }}
                aria-label="Diapositiva anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                style={{ opacity: isPaused ? 1 : 0 }}
                aria-label="Siguiente diapositiva"
              >
                <ChevronRight size={18} />
              </button>

              {/* Slide indicator dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === current ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Ir a diapositiva ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating glass card */}
              <div className="absolute -bottom-6 -left-8 z-30 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                  <ShoppingBag size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Novedades</p>
                  <p className="text-sm font-serif font-semibold">Primavera 2025</p>
                </div>
              </div>

              {/* Floating stat */}
              <div className="absolute -top-4 -right-6 z-30 bg-black text-white rounded-2xl shadow-xl px-5 py-4 text-center animate-in fade-in slide-in-from-top-4 duration-700 delay-800 fill-mode-both">
                <p className="text-2xl font-bold font-serif">500+</p>
                <p className="text-[9px] uppercase tracking-wider text-white/50 mt-0.5">Piezas</p>
              </div>
            </div>

            {/* Background decorative image */}
            <div
              className="absolute bottom-0 right-0 w-40 h-40 rounded-2xl bg-cover bg-center opacity-40 shadow-lg"
              style={{ backgroundImage: 'url("/images/img6.png")' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
