'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Plus,
  Layers,
  Upload,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import DropZone from '@/components/DropZone/DropZone';

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: ''
  });

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'brands/logos');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed');
      }
      const data = await res.json();

      setFormData(prev => ({ ...prev, logo: data.url }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Brand logo upload error:', error);
      toast.error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Creation failed');
      
      toast.success(`${formData.name} added to brand registry`);
      router.push('/admin/brands');
    } catch (error) {
      toast.error('Failed to register new brand');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/brands" 
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-muted-foreground shadow-sm hover:translate-x-[-4px] hover:bg-secondary hover:text-foreground transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">New Brand</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Introducing a new brand partner to the santiago bros registry.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-black px-10 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
            Register Brand
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-24">
        <section className="rounded-2xl border border-border bg-white p-8 space-y-8 shadow-sm hover:shadow-md transition-all duration-500">
          <h2 className="text-xl font-serif text-foreground flex items-center gap-3">
            <Layers size={22} className="text-primary opacity-80" />
            Brand Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Brand Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 text-lg font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                placeholder="e.g. Mediterranean Artisans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">URL Identifier (Slug)</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full h-12 px-5 rounded-xl border border-border bg-secondary/5 text-sm font-mono text-muted-foreground focus:outline-none transition-all duration-300"
                placeholder="mediterranean-artisans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Brand Narrative</label>
              <textarea 
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-5 rounded-xl border border-border bg-secondary/10 text-base leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                placeholder="Describe the essence and heritage of this brand partner..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground ml-1">Logo Link or Upload (Optional)</label>
              <input 
                type="text" 
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                className="w-full h-14 px-5 rounded-xl border border-border bg-secondary/10 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all duration-300"
                placeholder="/images/brands/brand-name.svg"
              />
              <DropZone
                onFileDrop={handleFileUpload}
                uploading={uploading}
                preview={formData.logo}
                label="Drop logo here or click to browse"
                sublabel="SVG, PNG recommended"
                aspectClass="h-40"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
