'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash, 
  Edit2, 
  Layers,
  RefreshCw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteModal from '@/components/DeleteModal/DeleteModal';

export default function AdminBrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brands');
      if (!res.ok) throw new Error('Failed to fetch brands');
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      toast.error('Error loading brand registry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteData) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/brands/${deleteData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${deleteData.name} removed from registry`);
      fetchBrands();
    } catch (error) {
      toast.error('Failed to remove brand');
    } finally {
      setIsDeleting(false);
      setDeleteData(null);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          Brand Registry
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-48 sm:w-64 rounded-md border border-border bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>
          <Link 
            href="/admin/brands/new"
            className="flex items-center gap-1.5 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 transition-all shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Brand</span>
          </Link>
          <button 
            onClick={fetchBrands}
            className="p-2 rounded-md border border-border bg-white text-muted-foreground hover:bg-secondary transition-colors"
            title="Refresh Registry"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Brand</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Description</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground">Slug</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-widest text-[10px] text-muted-foreground text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground italic">Restoring brand registry...</td>
                  </tr>
                ))
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">No brands found matching your search.</td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="group hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-secondary/50 shadow-sm flex items-center justify-center">
                          <Layers size={20} className="text-primary/60" />
                        </div>
                        <span className="font-medium text-foreground">{brand.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-muted-foreground font-light tracking-wide line-clamp-2 max-w-xs">
                        {brand.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        {brand.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground outline-none">
                          <MoreHorizontal size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-lg bg-white border border-border shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMenuItem 
                            className="flex items-center gap-2.5 text-sm py-2 px-3 rounded-md text-foreground cursor-pointer focus:bg-secondary/80 focus:text-primary transition-all"
                            onClick={() => router.push(`/admin/brands/${brand.id}`)}
                          >
                            <Edit2 size={15} />
                            Edit Brand
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2.5 text-sm py-2 px-3 rounded-md text-destructive focus:text-white cursor-pointer focus:bg-destructive transition-all"
                            onClick={() => setDeleteData({ id: brand.id, name: brand.name })}
                          >
                            <Trash size={15} />
                            Remove Brand
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {!loading && filteredBrands.length > 0 && (
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground px-2">
          <span>Displaying {filteredBrands.length} brands in the santiago bros registry</span>
        </div>
      )}

      {deleteData && (
        <DeleteModal
          itemName={deleteData.name}
          isDeleting={isDeleting}
          onCancel={() => setDeleteData(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
