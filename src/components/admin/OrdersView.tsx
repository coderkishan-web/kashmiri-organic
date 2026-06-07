'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, MapPin, Phone, User, Clock, ChevronRight, X } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-950/60 text-yellow-200 border-yellow-500/20',
  paid:       'bg-blue-950/60 text-blue-200 border-blue-500/20',
  processing: 'bg-orange-950/60 text-orange-200 border-orange-500/20',
  shipped:    'bg-indigo-950/60 text-indigo-200 border-indigo-500/20',
  delivered:  'bg-green-950/60 text-green-200 border-green-500/20',
  cancelled:  'bg-red-950/60 text-red-200 border-red-500/20',
};

export default function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        setOrders(updated);
        setSelectedOrder((prev: any) => prev?.id === id ? { ...prev, status: newStatus } : prev);
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o =>
    (o.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.user_phone || '').includes(searchQuery) ||
    (o.user_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parseItems = (raw: string) => {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

      {/* LEFT — Orders List */}
      <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-bg-cream/5 border border-bg-beige/10 rounded-2xl overflow-hidden luxury-shadow flex flex-col transition-all duration-200`}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-bg-beige/10 flex items-center justify-between bg-brand-green/50 sticky top-0 z-10 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-brand-gold" />
            <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Orders</span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-bg-cream/40" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-bg-cream/5 border border-bg-beige/10 text-bg-cream text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-brand-gold/50 w-44"
            />
          </div>
        </div>

        {/* Table head */}
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-bg-beige/10 bg-brand-green/95 sticky top-0 z-10">
          <span className="col-span-3 text-[9px] uppercase font-bold tracking-wider text-brand-gold">Order ID</span>
          <span className="col-span-4 text-[9px] uppercase font-bold tracking-wider text-brand-gold">Customer</span>
          <span className="col-span-2 text-[9px] uppercase font-bold tracking-wider text-brand-gold">Amount</span>
          <span className="col-span-2 text-[9px] uppercase font-bold tracking-wider text-brand-gold">Status</span>
          <span className="col-span-1"></span>
        </div>

        {/* Scrollable rows — 4 rows visible */}
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden max-h-[340px] divide-y divide-bg-beige/10">
          {loading ? (
            <p className="text-bg-cream/50 text-xs p-6">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-bg-cream/40 text-xs text-center py-12">No orders found.</p>
          ) : (
            filteredOrders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full grid grid-cols-12 px-4 py-3.5 text-left transition-all hover:bg-bg-beige/5 text-xs ${
                  selectedOrder?.id === order.id ? 'bg-bg-beige/8 border-l-2 border-brand-gold' : ''
                }`}
              >
                <span className="col-span-3 font-mono text-brand-gold font-semibold truncate text-[10px]">
                  #{(order.id || '').slice(0, 10)}
                </span>
                <span className="col-span-4 text-bg-cream/80 truncate">{order.user_name || order.user_phone}</span>
                <span className="col-span-2 font-serif text-bg-cream font-bold">
                  ₹{(order.total_amount || 0).toLocaleString('en-IN')}
                </span>
                <span className="col-span-2">
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${STATUS_STYLES[order.status] || 'bg-bg-beige/10 text-bg-cream border-bg-beige/10'}`}>
                    {order.status}
                  </span>
                </span>
                <ChevronRight className="col-span-1 w-3.5 h-3.5 text-bg-cream/30 self-center ml-auto" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT — Order Detail Panel (only shown when order is selected) */}
      {selectedOrder && (
        <div className="lg:col-span-5 bg-bg-cream/5 border border-bg-beige/10 rounded-2xl luxury-shadow flex flex-col animate-in fade-in duration-200">
          <div className="flex flex-col h-full">
            {/* Detail header */}
            <div className="px-5 py-4 border-b border-bg-beige/10 flex items-start justify-between shrink-0">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold block">Order Details</span>
                <h3 className="font-serif text-base font-bold text-bg-cream mt-0.5">
                  #{selectedOrder.id?.slice(0, 16)}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-bg-cream/40 hover:text-bg-cream transition-colors mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 overflow-y-auto [&::-webkit-scrollbar]:hidden flex-1">

              {/* Status updater */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold">Update Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="bg-bg-cream/10 border border-bg-beige/10 text-bg-cream text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-gold cursor-pointer"
                >
                  {['pending','paid','processing','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s} className="bg-brand-green text-bg-cream capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Customer info */}
              <div className="bg-bg-beige/5 rounded-xl p-4 flex flex-col gap-3 border border-bg-beige/10">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold">Customer</span>
                <div className="flex items-center gap-2 text-xs text-bg-cream/80">
                  <User className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>{selectedOrder.user_name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-bg-cream/80">
                  <Phone className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>{selectedOrder.user_phone || 'N/A'}</span>
                </div>
                {selectedOrder.delivery_address && (
                  <div className="flex items-start gap-2 text-xs text-bg-cream/80">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {[selectedOrder.delivery_address, selectedOrder.delivery_city, selectedOrder.delivery_pincode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-bg-cream/60">
                  <Clock className="w-3.5 h-3.5 text-brand-gold/50 shrink-0" />
                  <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Items breakdown */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold">Items Ordered</span>
                <div className="flex flex-col divide-y divide-bg-beige/10 bg-bg-beige/5 rounded-xl border border-bg-beige/10 overflow-hidden">
                  {parseItems(selectedOrder.items).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-xs">
                      <div>
                        <p className="font-semibold text-bg-cream">{item.name}</p>
                        <p className="text-bg-cream/50 text-[10px] mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-serif font-bold text-brand-gold">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-bg-beige/10 pt-4">
                <span className="text-xs font-bold text-bg-cream/60 uppercase tracking-wider">Total Amount</span>
                <span className="font-serif text-xl font-bold text-brand-gold">
                  ₹{(selectedOrder.total_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
