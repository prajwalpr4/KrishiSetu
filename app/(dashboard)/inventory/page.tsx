'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, AlertTriangle, Download, X, ArrowDown, ArrowUp } from 'lucide-react';

interface LocalItem {
  id: string; name: string; category: string; quantity: number; unit: string;
  purchase_price: number; low_stock_alert: number; supplier: string;
}

interface LocalTransaction {
  id: string; item_name: string; type: 'in' | 'out'; quantity: number; reason: string; date: string;
}

const categoryTabs = ['All', 'Seed', 'Fertilizer', 'Pesticide', 'Produce', 'Equipment'];

export default function InventoryPage() {
  const { language } = useAppStore();
  const [items, setItems] = useState<LocalItem[]>([]);
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Fertilizer', quantity: '', unit: 'bags', purchase_price: '', low_stock_alert: '', supplier: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/inventory');
        const data = await res.json();
        if (data.items) setItems(data.items);
        if (data.transactions) setTransactions(data.transactions);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory);
  const lowStockCount = items.filter((i) => i.quantity <= i.low_stock_alert).length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.purchase_price, 0);

  const adjustStock = async (id: string, type: 'in' | 'out') => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adjust_stock', item_id: id, type, amount: 1 })
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.map(i => i.id === id ? { ...i, quantity: data.new_quantity } : i));
        setTransactions([data.transaction, ...transactions]);
      }
    } catch (e) { console.error(e); }
  };

  const addItem = async () => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_item',
          name: newItem.name,
          category: newItem.category,
          quantity: parseFloat(newItem.quantity) || 0,
          unit: newItem.unit,
          purchase_price: parseFloat(newItem.purchase_price) || 0,
          low_stock_alert: parseFloat(newItem.low_stock_alert) || 1,
          supplier: newItem.supplier
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setItems([data.item, ...items]);
        setShowAddForm(false);
        setNewItem({ name: '', category: 'Fertilizer', quantity: '', unit: 'bags', purchase_price: '', low_stock_alert: '', supplier: '' });
      }
    } catch (e) { console.error(e); }
  };

  const exportCSV = () => {
    const csv = 'Name,Category,Quantity,Unit,Price,Supplier\n' +
      items.map((i) => `"${i.name}","${i.category}",${i.quantity},"${i.unit}",${i.purchase_price},"${i.supplier}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'krishisetu_inventory.csv'; a.click();
  };

  const title = language === 'hi' ? 'स्टॉक प्रबंधन 📦' : language === 'kn' ? 'ದಾಸ್ತಾನು 📦' : 'Inventory 📦';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-1 text-sm">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-1 text-sm">
            <Plus className="w-4 h-4" /> {language === 'hi' ? 'जोड़ें' : language === 'kn' ? 'ಸೇರಿಸಿ' : 'Add'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-krishisetu p-3 text-center">
          <p className="text-2xl font-bold text-krishisetu-text-primary font-mono">{items.length}</p>
          <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'कुल आइटम' : 'Total Items'}</p>
        </div>
        <div className="card-krishisetu p-3 text-center">
          <p className={`text-2xl font-bold font-mono ${lowStockCount > 0 ? 'text-accent' : 'text-success'}`}>{lowStockCount}</p>
          <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'कम स्टॉक' : 'Low Stock'}</p>
        </div>
        <div className="card-krishisetu p-3 text-center">
          <p className="text-2xl font-bold text-krishisetu-text-primary font-mono">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-krishisetu-text-muted">{language === 'hi' ? 'कुल मूल्य' : 'Total Value'}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {categoryTabs.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const isLow = item.quantity <= item.low_stock_alert;
          return (
            <motion.div key={item.id} whileHover={{ x: 2 }}
              className={`card-krishisetu p-3.5 flex items-center justify-between ${isLow ? 'border-red-200 bg-red-50/30' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-krishisetu-text-body">{item.name}</h3>
                  {isLow && <AlertTriangle className="w-3.5 h-3.5 text-accent" />}
                </div>
                <p className="text-xs text-krishisetu-text-muted mt-0.5">
                  {item.category} • {item.supplier} • {formatCurrency(item.purchase_price)}/{item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adjustStock(item.id, 'out')} className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200">
                  <Minus className="w-3.5 h-3.5 text-red-600" />
                </button>
                <span className={`font-mono text-base font-bold min-w-[3ch] text-center ${isLow ? 'text-accent' : 'text-krishisetu-text-primary'}`}>
                  {item.quantity}
                </span>
                <button onClick={() => adjustStock(item.id, 'in')} className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200">
                  <Plus className="w-3.5 h-3.5 text-green-600" />
                </button>
                <span className="text-xs text-krishisetu-text-muted">{item.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 className="font-heading text-base font-semibold text-krishisetu-text-primary mb-2">
            {language === 'hi' ? 'हाल के लेन-देन' : 'Recent Transactions'}
          </h2>
          <div className="space-y-1">
            {transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-sm py-1.5">
                {t.type === 'in' ? <ArrowDown className="w-3.5 h-3.5 text-green-500" /> : <ArrowUp className="w-3.5 h-3.5 text-red-500" />}
                <span className="text-krishisetu-text-body">{t.item_name}</span>
                <span className={`font-mono text-xs ${t.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'in' ? '+' : '-'}{t.quantity}
                </span>
                <span className="text-xs text-krishisetu-text-muted ml-auto">{t.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-semibold">Add Item</h2>
                <button onClick={() => setShowAddForm(false)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm">
                  {categoryTabs.filter(c => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <input placeholder="Qty" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} className="flex-1 rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                  <input placeholder="Unit" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="w-24 rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                </div>
                <input placeholder="Price per unit" type="number" value={newItem.purchase_price} onChange={(e) => setNewItem({ ...newItem, purchase_price: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <input placeholder="Supplier" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} className="w-full rounded-lg border border-krishisetu-border px-3 py-2.5 text-sm" />
                <button onClick={addItem} disabled={!newItem.name} className="btn-primary w-full">Add Item</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
