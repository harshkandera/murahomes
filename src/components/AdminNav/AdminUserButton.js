'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown } from 'lucide-react';

export default function AdminUserButton({ user }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const name = user ? `${user.firstName} ${user.lastName}` : 'Admin';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block font-medium text-foreground">{name}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-border bg-white shadow-lg py-1">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-xs font-medium text-foreground">{name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
