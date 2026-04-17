'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Error al iniciar sesión'); return; }
      setUser(data);
      toast.success(`¡Bienvenido de nuevo, ${data.firstName}!`);
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-black px-8 py-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2">Bienvenido de Nuevo</p>
            <h1 className="font-serif text-3xl text-white font-normal">Iniciar Sesión</h1>
            <p className="text-white/40 text-xs mt-2">MuraHomes · Colección de Lujo</p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                <input
                  type="email" required autoFocus
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full h-11 px-3 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all"
                  placeholder="tu@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full h-11 px-3 pr-10 border border-border rounded-xl text-sm focus:border-black focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full h-12 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/80 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Iniciar Sesión'}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿No tienes cuenta?{' '}
              <Link href="/sign-up" className="text-foreground font-medium hover:underline">Crear una</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
