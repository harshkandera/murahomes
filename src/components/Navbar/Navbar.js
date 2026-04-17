'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { categories } from '@/data/products';
import { buttonVariants } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/Cart/CartDrawer';
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu, X, ShoppingBag, LayoutDashboard, LogOut, User } from 'lucide-react';
import logo from "@/../public/logo.png";

export default function Navbar({ dbRole, serverUserId }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isLoaded, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const role = user?.role || dbRole;
  const isAdmin = role === 'ADMIN';
  const loggedIn = isLoaded ? isSignedIn : !!serverUserId;

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  if (pathname?.startsWith('/admin')) return null;

  const displayName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center z-[51]">
            <Image src={logo} alt="MuraHomes" width={160} height={40} className="object-contain" priority />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/about">Nosotros</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="uppercase tracking-widest text-sm font-medium">Productos</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 w-[600px] p-6 gap-4">
                      <div className="col-span-4 flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="font-serif text-lg font-medium">Nuestras Colecciones</h3>
                        <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80 uppercase tracking-wider">Ver Todo &rarr;</Link>
                      </div>
                      {categories.map((cat) => (
                        <Link key={cat.id} href={`/products/${cat.id}`} className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-secondary/50 transition-colors">
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <span className="text-xl">{getCategoryIcon(cat.id)}</span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/brands">Nuestras Marcas</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/pedido-online">Pedido Online</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/showroom">Showroom</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {!isAdmin && (
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Abrir cesta">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <div className="hidden lg:flex items-center gap-4 border-l border-border pl-6">
              {loggedIn ? (
                <div className="relative flex items-center gap-3">
                  {isAdmin && (
                    <Link href="/admin" className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Panel de Administración">
                      <LayoutDashboard size={20} strokeWidth={1.5} />
                    </Link>
                  )}
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      {displayName.charAt(0) || 'U'}
                    </div>
                    <span>{displayName || 'Cuenta'}</span>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-border bg-white shadow-lg py-1">
                        {user?.email && <p className="px-4 py-2 text-[10px] text-muted-foreground border-b border-border truncate">{user.email}</p>}
                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">
                          <User size={14} /> Mis Pedidos
                        </Link>
                        <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/sign-in" className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
              )}
              <Link href="/showroom" className={buttonVariants({ variant: "default", size: "sm", className: "h-9 px-5" })}>
                Reservar Cita
              </Link>
            </div>

            <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menú">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col justify-center items-center transition-all duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col gap-8 text-center px-4">
            <Link href="/about" className="font-serif text-3xl font-medium tracking-wide">Nosotros</Link>
            <Link href="/products" className="font-serif text-3xl font-medium tracking-wide">Productos</Link>
            <Link href="/brands" className="font-serif text-3xl font-medium tracking-wide">Nuestras Marcas</Link>
            <Link href="/pedido-online" className="font-serif text-3xl font-medium tracking-wide">Pedido Online</Link>
            <Link href="/showroom" className="font-serif text-3xl font-medium tracking-wide">Showroom</Link>
            <div className="mt-8 flex flex-col gap-4">
              {loggedIn ? (
                <>
                  {isAdmin && <Link href="/admin" className="font-medium text-primary text-xl uppercase tracking-widest">Panel Admin</Link>}
                  <Link href="/account/orders" className="font-medium text-foreground text-xl uppercase tracking-widest">Mis Pedidos</Link>
                  <button onClick={signOut} className="text-xl font-medium text-rose-600 uppercase tracking-widest">Cerrar Sesión</button>
                </>
              ) : (
                <Link href="/sign-in" className="text-xl font-medium uppercase tracking-widest">Iniciar Sesión</Link>
              )}
              <Link href="/showroom" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>Reservar Cita</Link>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}

function getCategoryIcon(id) {
  const icons = { outdoor: '🌿', sofas: '🛋️', armchair: '💺', tables: '🪑', chairs: '🪜', bedroom: '🛏️', cabinets: '🗄️', lighting: '💡' };
  return icons[id] || '✦';
}
