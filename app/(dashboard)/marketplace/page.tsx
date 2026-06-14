'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, ExternalLink, Search } from 'lucide-react';

const categories = [
  { key: 'all', en: 'All', hi: 'सभी', kn: 'ಎಲ್ಲಾ' },
  { key: 'fertilizer', en: 'Fertilizers', hi: 'उर्वरक', kn: 'ರಸಗೊಬ್ಬರ' },
  { key: 'pesticide', en: 'Pesticides', hi: 'कीटनाशक', kn: 'ಕೀಟನಾಶಕ' },
  { key: 'seed', en: 'Seeds', hi: 'बीज', kn: 'ಬೀಜ' },
  { key: 'machinery', en: 'Machinery', hi: 'मशीनरी', kn: 'ಯಂತ್ರೋಪಕರಣ' },
  { key: 'tool', en: 'Tools', hi: 'उपकरण', kn: 'ಉಪಕರಣ' },
];

const sampleProducts = [
  { id: '1', name: 'Urea (46% N)', category: 'fertilizer', mrp: 267, unit: '/45kg bag', amazon_query: 'urea fertilizer 45kg bag', flipkart_query: 'urea fertilizer', tags: ['nitrogen', 'top-dressing'], subsidy: true, image_url: 'https://placehold.co/400x300/166534/ffffff?text=Urea+(46%25+N)' },
  { id: '2', name: 'DAP (Di-Ammonium Phosphate)', category: 'fertilizer', mrp: 1350, unit: '/50kg bag', amazon_query: 'DAP fertilizer 50kg', flipkart_query: 'DAP fertilizer bag', tags: ['phosphorus'], subsidy: true, image_url: 'https://placehold.co/400x300/166534/ffffff?text=DAP+Fertilizer' },
  { id: '3', name: 'NPK 17-17-17', category: 'fertilizer', mrp: 1450, unit: '/50kg bag', amazon_query: 'NPK fertilizer 17-17-17', flipkart_query: 'NPK compound fertilizer', tags: ['complex'], subsidy: false, image_url: 'https://placehold.co/400x300/166534/ffffff?text=NPK+17-17-17' },
  { id: '4', name: 'Neem Oil Pesticide', category: 'pesticide', mrp: 450, unit: '/liter', amazon_query: 'neem oil pesticide organic', flipkart_query: 'neem oil pesticide', tags: ['organic', 'natural'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Neem+Oil' },
  { id: '5', name: 'Chlorpyrifos 20% EC', category: 'pesticide', mrp: 380, unit: '/liter', amazon_query: 'chlorpyrifos 20 EC insecticide', flipkart_query: 'chlorpyrifos insecticide', tags: ['chemical'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Pesticide' },
  { id: '6', name: 'Hybrid Tomato Seeds', category: 'seed', mrp: 320, unit: '/10g pack', amazon_query: 'hybrid tomato seeds arka', flipkart_query: 'tomato seeds hybrid', tags: ['hybrid', 'disease-resistant'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Tomato+Seeds' },
  { id: '7', name: 'Ragi Seeds (GPU-28)', category: 'seed', mrp: 85, unit: '/kg', amazon_query: 'ragi finger millet seeds', flipkart_query: 'ragi seeds GPU 28', tags: ['millet', 'karnataka'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Ragi+Seeds' },
  { id: '8', name: 'Knapsack Sprayer (16L)', category: 'machinery', mrp: 2800, unit: '/unit', amazon_query: 'knapsack sprayer 16 liter agriculture', flipkart_query: 'knapsack sprayer pump', tags: ['spraying'], subsidy: true, image_url: 'https://placehold.co/400x300/1e3a8a/ffffff?text=Sprayer' },
  { id: '9', name: 'Drip Irrigation Kit', category: 'tool', mrp: 8500, unit: '/kit', amazon_query: 'drip irrigation kit 1 acre farm', flipkart_query: 'drip irrigation system', tags: ['irrigation', 'water-saving'], subsidy: true, image_url: 'https://placehold.co/400x300/1e3a8a/ffffff?text=Drip+Irrigation' },
  { id: '10', name: 'Hand Weeder Tool', category: 'tool', mrp: 350, unit: '/unit', amazon_query: 'hand weeder tool agriculture', flipkart_query: 'hand weeder garden', tags: ['weeding', 'manual'], subsidy: false, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Hand+Weeder' },
  { id: '11', name: 'Organic Vermicompost', category: 'fertilizer', mrp: 400, unit: '/50kg bag', amazon_query: 'vermicompost 50kg organic', flipkart_query: 'organic vermicompost', tags: ['organic', 'soil-health'], subsidy: false, image_url: 'https://placehold.co/400x300/451a03/ffffff?text=Vermicompost' },
  { id: '12', name: 'Brush Cutter (2-Stroke)', category: 'machinery', mrp: 12500, unit: '/unit', amazon_query: 'brush cutter 52cc', flipkart_query: 'brush cutter machine', tags: ['machinery', 'weeding'], subsidy: true, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Brush+Cutter' },
  { id: '13', name: 'MOP (Muriate of Potash)', category: 'fertilizer', mrp: 1700, unit: '/50kg bag', amazon_query: 'MOP fertilizer 50kg', flipkart_query: 'MOP fertilizer', tags: ['potassium', 'root-growth'], subsidy: true, image_url: 'https://placehold.co/400x300/166534/ffffff?text=MOP+Fertilizer' },
  { id: '14', name: 'Bio-Fertilizer (Rhizobium)', category: 'fertilizer', mrp: 150, unit: '/kg', amazon_query: 'rhizobium bio fertilizer', flipkart_query: 'bio fertilizer', tags: ['organic', 'nitrogen-fixing'], subsidy: false, image_url: 'https://placehold.co/400x300/451a03/ffffff?text=Bio-Fertilizer' },
  { id: '15', name: 'Mancozeb 75% WP', category: 'pesticide', mrp: 400, unit: '/kg', amazon_query: 'mancozeb 75 wp fungicide', flipkart_query: 'mancozeb fungicide', tags: ['fungicide', 'chemical'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Mancozeb+75%25' },
  { id: '16', name: 'Trichoderma Viride', category: 'pesticide', mrp: 200, unit: '/kg', amazon_query: 'trichoderma viride bio fungicide', flipkart_query: 'trichoderma viride', tags: ['bio-fungicide', 'organic'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Trichoderma' },
  { id: '17', name: 'Bt Cotton Seeds', category: 'seed', mrp: 800, unit: '/450g pack', amazon_query: 'bt cotton seeds', flipkart_query: 'cotton seeds', tags: ['bt', 'cash-crop'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Cotton+Seeds' },
  { id: '18', name: 'Paddy Seeds (IR-64)', category: 'seed', mrp: 40, unit: '/kg', amazon_query: 'paddy seeds ir 64', flipkart_query: 'paddy seeds', tags: ['rice', 'high-yield'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Paddy+Seeds' },
  { id: '19', name: 'Rotavator (5ft)', category: 'machinery', mrp: 95000, unit: '/unit', amazon_query: 'tractor rotavator 5 feet', flipkart_query: 'rotavator', tags: ['tractor-implement', 'tillage'], subsidy: true, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Rotavator' },
  { id: '20', name: 'Solar Water Pump (5HP)', category: 'machinery', mrp: 150000, unit: '/unit', amazon_query: 'solar water pump 5hp agriculture', flipkart_query: 'solar pump', tags: ['solar', 'irrigation'], subsidy: true, image_url: 'https://placehold.co/400x300/1e3a8a/ffffff?text=Solar+Pump' },
  { id: '21', name: 'Secateurs (Pruning Shears)', category: 'tool', mrp: 250, unit: '/unit', amazon_query: 'secateurs pruning shears heavy duty', flipkart_query: 'pruning shears', tags: ['pruning', 'horticulture'], subsidy: false, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Secateurs' },
  { id: '22', name: 'Sickle (Serrated Edge)', category: 'tool', mrp: 120, unit: '/unit', amazon_query: 'agriculture sickle serrated', flipkart_query: 'sickle tool', tags: ['harvesting', 'manual'], subsidy: false, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Sickle' },
  { id: '23', name: 'Zinc Sulfate (21%)', category: 'fertilizer', mrp: 600, unit: '/10kg bag', amazon_query: 'zinc sulfate fertilizer agriculture', flipkart_query: 'zinc sulfate', tags: ['micronutrient'], subsidy: false, image_url: 'https://placehold.co/400x300/166534/ffffff?text=Zinc+Sulfate' },
  { id: '24', name: 'Imidacloprid 17.8% SL', category: 'pesticide', mrp: 900, unit: '/liter', amazon_query: 'imidacloprid insecticide agriculture', flipkart_query: 'imidacloprid', tags: ['insecticide', 'systemic'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Imidacloprid' },
  { id: '25', name: 'Onion Seeds (N-53)', category: 'seed', mrp: 1200, unit: '/kg', amazon_query: 'onion seeds n53', flipkart_query: 'onion seeds', tags: ['vegetable', 'rabi'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Onion+Seeds' },
  { id: '26', name: 'Maize Seeds (Hybrid)', category: 'seed', mrp: 650, unit: '/4kg bag', amazon_query: 'hybrid maize seeds', flipkart_query: 'maize seeds', tags: ['hybrid', 'cereals'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Maize+Seeds' },
  { id: '27', name: 'Power Tiller (9HP)', category: 'machinery', mrp: 120000, unit: '/unit', amazon_query: 'power tiller 9hp agriculture', flipkart_query: 'power tiller machine', tags: ['tillage', 'machinery'], subsidy: true, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Power+Tiller' },
  { id: '28', name: 'SSP (Single Super Phosphate)', category: 'fertilizer', mrp: 450, unit: '/50kg bag', amazon_query: 'SSP fertilizer 50kg', flipkart_query: 'single super phosphate fertilizer', tags: ['phosphorus', 'sulfur'], subsidy: true, image_url: 'https://placehold.co/400x300/166534/ffffff?text=SSP+Fertilizer' },
  { id: '29', name: 'Chaff Cutter Machine', category: 'machinery', mrp: 18500, unit: '/unit', amazon_query: 'chaff cutter machine agriculture motor', flipkart_query: 'chaff cutter', tags: ['livestock', 'fodder'], subsidy: true, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Chaff+Cutter' },
  { id: '30', name: 'Carbendazim 50% WP', category: 'pesticide', mrp: 650, unit: '/kg', amazon_query: 'carbendazim 50 wp fungicide', flipkart_query: 'carbendazim', tags: ['fungicide', 'systemic'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Carbendazim' },
  { id: '31', name: 'Wheel Hoe Weeder', category: 'tool', mrp: 1200, unit: '/unit', agriculture_query: 'wheel hoe weeder manual', flipkart_query: 'wheel hoe weeder', tags: ['weeding', 'manual-machinery'], subsidy: false, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Wheel+Hoe' },
  { id: '32', name: 'Gypsum (Calcium Sulfate)', category: 'fertilizer', mrp: 200, unit: '/50kg bag', amazon_query: 'agricultural gypsum powder 50kg', flipkart_query: 'gypsum agriculture', tags: ['calcium', 'soil-amendment'], subsidy: true, image_url: 'https://placehold.co/400x300/166534/ffffff?text=Gypsum' },
  { id: '33', name: 'Yellow Sticky Traps', category: 'tool', mrp: 150, unit: '/10 pieces', amazon_query: 'yellow sticky traps agriculture insects', flipkart_query: 'yellow sticky trap', tags: ['pest-control', 'organic'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Sticky+Traps' },
  { id: '34', name: 'Wheat Seeds (Lok-1)', category: 'seed', mrp: 55, unit: '/kg', amazon_query: 'wheat seeds lok 1 agriculture', flipkart_query: 'wheat seeds lok 1', tags: ['wheat', 'rabi'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Wheat+Seeds' },
  { id: '35', name: 'Submersible Pump (3HP)', category: 'machinery', mrp: 24000, unit: '/unit', amazon_query: 'submersible water pump 3hp agriculture', flipkart_query: 'submersible borewell pump 3hp', tags: ['irrigation', 'borewell'], subsidy: true, image_url: 'https://placehold.co/400x300/1e3a8a/ffffff?text=Submersible+Pump' },
  { id: '36', name: 'Thiamethoxam 25% WG', category: 'pesticide', mrp: 1200, unit: '/kg', amazon_query: 'thiamethoxam 25 wg insecticide', flipkart_query: 'thiamethoxam', tags: ['insecticide', 'systemic'], subsidy: false, image_url: 'https://placehold.co/400x300/15803d/ffffff?text=Thiamethoxam' },
  { id: '37', name: 'Water Soluble NPK (19:19:19)', category: 'fertilizer', mrp: 150, unit: '/kg', amazon_query: 'water soluble npk 19 19 19', flipkart_query: 'npk 19 19 19', tags: ['foliar', 'drip-fertigation'], subsidy: false, image_url: 'https://placehold.co/400x300/166534/ffffff?text=NPK+19-19-19' },
  { id: '38', name: 'Groundnut Seeds (TMV-2)', category: 'seed', mrp: 110, unit: '/kg', amazon_query: 'groundnut seeds tmv 2', flipkart_query: 'groundnut seeds', tags: ['oilseeds', 'kharif'], subsidy: false, image_url: 'https://placehold.co/400x300/ca8a04/ffffff?text=Groundnut+Seeds' },
  { id: '39', name: 'Mulching Sheet (30 Micron)', category: 'tool', mrp: 2100, unit: '/400m roll', amazon_query: 'agriculture mulching paper sheet 30 micron', flipkart_query: 'mulching paper roll', tags: ['weed-control', 'moisture-retention'], subsidy: true, image_url: 'https://placehold.co/400x300/1e3a8a/ffffff?text=Mulching+Sheet' },
  { id: '40', name: 'Mini Tractor (15HP)', category: 'machinery', mrp: 280000, unit: '/unit', amazon_query: 'mini tractor 15hp agriculture', flipkart_query: 'mini tractor', tags: ['tractor', 'compact'], subsidy: true, image_url: 'https://placehold.co/400x300/334155/ffffff?text=Mini+Tractor' },
];

export default function MarketplacePage() {
  const { language } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = sampleProducts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const title = language === 'hi' ? 'बाज़ार 🛒' : language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ 🛒' : 'Marketplace 🛒';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-krishisetu-text-primary">{title}</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-krishisetu-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'hi' ? 'उत्पाद खोजें...' : language === 'kn' ? 'ಉತ್ಪನ್ನ ಹುಡುಕಿ...' : 'Search products...'}
          className="w-full rounded-xl border border-krishisetu-border bg-white pl-9 pr-3 py-3 text-base focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-krishisetu-text-muted hover:bg-gray-200'
            }`}
          >
            {cat[language as keyof typeof cat] || cat.en}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <motion.div key={product.id} whileHover={{ y: -3 }} className="card-krishisetu overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="w-12 h-12 text-primary/30" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-krishisetu-text-body leading-tight flex-1">
                  {product.name}
                </h3>
                {product.subsidy && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-semibold ml-1 flex-shrink-0">
                    SUBSIDY
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-lg font-bold text-krishisetu-text-primary">
                  {formatCurrency(product.mrp)}
                </span>
                <span className="text-xs text-krishisetu-text-muted">{product.unit}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`https://www.amazon.in/s?k=${encodeURIComponent(product.amazon_query)}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  Amazon <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(product.flipkart_query)}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Flipkart <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
