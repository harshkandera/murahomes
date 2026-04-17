'use client';

import Link from 'next/link';

export default function Hero({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  overlayImage,
  eyebrow,
  align = 'center',
  height = 'full', // 'full' | 'half'
}) {
  const isHalf = height === 'half';

  return (
    <section className={`relative w-full ${isHalf ? 'h-[60vh] min-h-[400px]' : 'h-screen min-h-[680px]'} flex items-end overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {overlayImage && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ 
              backgroundImage: `url(${overlayImage})`,
              animation: 'heroKenBurns 18s ease-in-out infinite alternate'
            }}
          />
        )}
        {/* Dark gradient overlay — bottom-heavy for text on bottom layout */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Content — sits at bottom */}
      <div className={`relative z-10 w-full pb-16 md:pb-24 ${isHalf ? 'pb-12 md:pb-16' : ''}`}>
        <div className={`container mx-auto px-6 lg:px-12 ${align === 'center' ? 'text-center max-w-4xl mx-auto' : 'max-w-5xl'}`}>
          
          {eyebrow && (
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {eyebrow}
            </span>
          )}

          <h1 className={`font-serif font-medium leading-[1.05] text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both tracking-tight
            ${isHalf ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl'}`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`text-white/65 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both
              ${align === 'center' ? 'mx-auto' : ''}
              ${isHalf ? 'text-base md:text-lg max-w-xl' : 'text-lg md:text-xl max-w-2xl'} mb-10`}>
              {subtitle}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <Link 
                href={ctaLink} 
                className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-400 transition-all duration-300"
              >
                {ctaText}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isHalf && (
        <div className="absolute bottom-8 right-10 z-10 flex flex-col items-center gap-2 animate-in fade-in duration-1000 delay-700 fill-mode-both">
          <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40 font-semibold" style={{writingMode:'vertical-rl'}}>Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" style={{animation:'scrollPulse 2s ease-in-out infinite'}} />
        </div>
      )}

      {/* Decorative corner bracket */}
      <div className="absolute top-8 left-8 z-10 opacity-30">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M0 32V4a4 4 0 014-4h28" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="absolute top-8 right-8 z-10 opacity-30">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M32 32V4a4 4 0 00-4-4H0" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>

      <style>{`
        @keyframes heroKenBurns {
          0% { transform: scale(1.05) translateX(0); }
          100% { transform: scale(1.12) translateX(-1%); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
