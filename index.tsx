
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  ChevronUp, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CheckCircle2,
  Phone,
  CreditCard,
  Search,
  Sun,
  Moon,
  Star,
  Quote,
  Leaf,
  Droplets,
  Sparkles,
  Camera,
  Heart,
  Loader2,
  Bell,
  HelpCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  ChevronDown,
  Info,
  Zap,
  Banknote,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data Types ---

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Shine' | 'Matte' | 'Plumper' | 'Tint';
  description: string;
  ingredients: string[];
  ritual: string;
  image: string;
  images: string[];
  isBestSeller?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- BRAND CONSTANTS ---
const BRAND_PURPLE = "#C187FF";
const WHATSAPP_NUMBER = "+2348000000000"; // Placeholder
const BANK_DETAILS = {
  accountName: "MayGloss Beauty LTD",
  accountNumber: "XXXXXXXXXX", // User to provide later
  bankName: "Global Radiant Bank"
};

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amethyst Glow',
    price: 18.00,
    category: 'Shine',
    description: 'A sophisticated lavender-tinted gloss that adapts to your natural lip pH. Infused with cold-pressed grape seed oil for a non-sticky finish.',
    ingredients: ['Vitis Vinifera (Grape) Seed Oil', 'Hyaluronic Acid', 'Shea Butter', 'Vitamin E', 'Mica'],
    ritual: 'Swipe onto bare lips for a custom tint, or layer over lipstick for a high-wattage finish.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800'
    ],
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Dusty Rose Matte',
    price: 22.00,
    category: 'Matte',
    description: 'The perfect everyday neutral. Our whipped matte formula provides full-coverage pigment with a weightless feel.',
    ingredients: ['Kaolin Clay', 'Aloe Barbadensis Leaf Extract', 'Sunflower Seed Wax', 'Natural Pigments'],
    ritual: 'Apply one thin coat for a natural stain, or build for a full-coverage velvet look. Dries in 60 seconds.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=800'
    ],
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Icy Plumper',
    price: 24.00,
    category: 'Plumper',
    description: 'Instant volume with a cooling sensation. Micro-reflecting pearls make lips appear fuller instantly.',
    ingredients: ['Mentha Piperita (Peppermint) Oil', 'Palmitoyl Tripeptide-1', 'Coconut Oil', 'Hyaluronic Acid'],
    ritual: 'Apply daily as a lip treatment. A slight cooling sensation is expected as the botanical actives work.',
    image: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1557053910-d9eaba703fa8?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '4',
    name: 'Berry Nectar Oil',
    price: 20.00,
    category: 'Tint',
    description: 'A cushiony lip oil that drenches lips in moisture. Leaves a delicate berry stain that lasts.',
    ingredients: ['Rubus Idaeus (Raspberry) Seed Oil', 'Jojoba Ester', 'Rosehip Oil', 'Fruit AHAs'],
    ritual: 'Use as a base for lipstick or wear alone for the ultimate hydrated lip glow.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601054704854-1a2e79dea4d3?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sophia L.",
    rating: 5,
    text: "Finally, a purple gloss that doesn't look tacky! It's so elegant and my lips feel incredibly hydrated all day.",
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Isabella M.",
    rating: 5,
    text: "The matte formula is game-changing. It stayed on through a three-course dinner and didn't dry out my lips at all.",
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 3,
    name: "Chloe W.",
    rating: 5,
    text: "I love the subtle scent and the packaging is stunning. The plumper really works without that painful stinging!",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 4,
    name: "Amara J.",
    rating: 4,
    text: "I was skeptical about botanical glosses but MayGloss converted me. No stickiness, just pure shine.",
    date: "3 weeks ago",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200"
  }
];

// --- Shared Components ---

const LoadingSpinner = ({ size = 24, text }: { size?: number, text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-purple-400" style={{ color: BRAND_PURPLE }}>
      <Loader2 size={size} />
    </motion.div>
    {text && <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{text}</p>}
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "fill-current" : "text-gray-300"} style={{ color: i < rating ? BRAND_PURPLE : undefined }} />
    ))}
  </div>
);

const NotificationToast = ({ notifications, remove }: { notifications: Notification[], remove: (id: string) => void }) => (
  <div className="fixed bottom-8 left-8 z-[200] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div key={n.id} initial={{ opacity: 0, x: -20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -20, scale: 0.9 }} className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[300px]">
          <div className="p-2 rounded-full" style={{ backgroundColor: BRAND_PURPLE + '20', color: BRAND_PURPLE }}>
            <Bell size={18} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-indigo-950 dark:text-white">{n.message}</p>
          </div>
          <button onClick={() => remove(n.id)} className="text-slate-300 hover:text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);
  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scroll} className="fixed bottom-8 right-8 z-[150] p-4 rounded-full bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 text-indigo-950 dark:text-purple-400">
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Navigation ---

const Navbar = ({ cartCount, onNavigate, currentPath, darkMode, toggleDarkMode }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] bg-stone-50/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-purple-100 dark:border-slate-800 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-indigo-950 dark:text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div onClick={() => handleNav('home')} className="flex items-center gap-2 cursor-pointer group">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
             <h1 className="text-xl md:text-2xl font-serif font-bold text-indigo-950 dark:text-purple-300">MayGloss</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className={`flex items-center gap-1 hover:text-indigo-950 transition-colors ${currentPath === 'products' ? 'text-indigo-950' : ''}`}>
              Shop <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 p-4 overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {['All', 'Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                      <button key={c} onClick={() => handleNav('products')} className="text-left hover:text-indigo-950 dark:hover:text-purple-300 transition-colors">{c} Collection</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => handleNav('lookbook')} className="hover:text-indigo-950 transition-colors">Muse</button>
          <button onClick={() => handleNav('story')} className="hover:text-indigo-950 transition-colors">Story</button>
          <button onClick={() => handleNav('faq')} className="hover:text-indigo-950 transition-colors">FAQ</button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:text-indigo-950">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => handleNav('cart')} className="relative p-2.5 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-indigo-950 hover:text-white transition-all">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center" style={{ backgroundColor: BRAND_PURPLE }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-[115] bg-stone-50 dark:bg-slate-950 pt-24 px-6 lg:hidden flex flex-col gap-8">
            {['home', 'products', 'lookbook', 'story', 'faq', 'cart'].map(p => (
              <button key={p} onClick={() => handleNav(p)} className="text-4xl font-serif font-bold text-indigo-950 dark:text-white capitalize text-left">{p}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Main Page Sections ---

const HomePage = ({ onNavigate, addToCart, addingId }: any) => {
  return (
    <div className="bg-stone-50 dark:bg-slate-950">
      {/* Hero Section - Clean, High Padding, No BG Image */}
      <section className="py-48 md:py-64 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 border border-purple-100" style={{ color: BRAND_PURPLE }}>Botanical Radiance Alchemy</span>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-[0.85]">Pure <br/><span className="italic font-normal">Luminance.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">Experience high-shine, non-sticky lipcare infused with cold-pressed botanical oils. Designed for lasting hydration and a mirror-like glow.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('products')} className="w-full sm:w-auto text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-2xl" style={{ backgroundColor: BRAND_PURPLE }}>Shop Collection</button>
            <button onClick={() => onNavigate('story')} className="w-full sm:w-auto bg-white/80 dark:bg-slate-800 text-indigo-950 dark:text-white border border-slate-100 dark:border-slate-700 px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-100 transition-all">The Mission</button>
          </div>
        </motion.div>
      </section>

      {/* Featured Grid */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-4">Our Signature Selection</h2>
          <p className="text-slate-500 max-w-md mx-auto">Discover the shades that captured the hearts of our community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PRODUCTS.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingId === p.id} onViewDetails={(prod: any) => onNavigate(`product-${prod.id}`)} />
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 bg-white dark:bg-slate-900 rounded-[4rem] mx-4 mb-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 text-center">
          <div>
            <Leaf className="mx-auto mb-6 text-purple-400" size={40} />
            <h3 className="text-xl font-serif font-bold mb-4">Plant-Powered</h3>
            <p className="text-sm text-slate-500 leading-relaxed">We replace synthetic polymers with cold-pressed seed oils for a naturally cushiony feel.</p>
          </div>
          <div>
            <Sparkles className="mx-auto mb-6 text-purple-400" size={40} />
            <h3 className="text-xl font-serif font-bold mb-4">Mirror Finish</h3>
            <h3 className="text-sm text-slate-500 leading-relaxed">Advanced refractive index technology ensures a glass-like shine that doesn't quit.</h3>
          </div>
          <div>
            <Droplets className="mx-auto mb-6 text-purple-400" size={40} />
            <h3 className="text-xl font-serif font-bold mb-4">8hr Hydration</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Clinically proven to boost lip moisture by 40% after just one application.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Community Praise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {REVIEWS.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800">
                <StarRating rating={r.rating} />
                <p className="my-6 italic text-slate-600 dark:text-slate-400 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} className="w-10 h-10 rounded-full object-cover" alt={r.name} />
                  <span className="font-bold text-xs">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, addToCart, isAdding, onViewDetails }: any) => (
  <div onClick={() => onViewDetails(product)} className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 aspect-[4/5] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <button onClick={(e) => { e.stopPropagation(); if(!isAdding) addToCart(product, 1); }} className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl flex items-center justify-center gap-3" style={{ color: BRAND_PURPLE }}>
        {isAdding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />}
        {isAdding ? "Adding..." : `Quick Add — $${product.price.toFixed(2)}`}
      </button>
    </div>
    <div className="px-2 text-center">
      <h3 className="text-xl font-bold text-indigo-950 dark:text-white mb-2">{product.name}</h3>
      <div className="flex justify-between items-center max-w-[200px] mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{product.category}</span>
        <span className="text-lg font-bold" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

// --- Product Detail with Exit Icon ---

const ProductDetailPage = ({ product, addToCart, addingId, onNavigate }: any) => {
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto relative">
      <button onClick={() => onNavigate('home')} className="absolute top-24 left-6 p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform z-10">
        <X size={24} className="text-indigo-950 dark:text-white" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-12">
        <div className="flex flex-col gap-6">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900">
            <motion.img key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={activeImg} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {product.images.map((img: string, i: number) => (
              <button key={i} onClick={() => setActiveImg(img)} className={`w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 ${activeImg === img ? 'border-purple-400' : 'border-transparent opacity-60'}`} style={{ borderColor: activeImg === img ? BRAND_PURPLE : 'transparent' }}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>Botanical Alchemy / {product.category}</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-indigo-950 dark:text-white mb-6">{product.name}</h1>
          <p className="text-2xl font-bold mb-8" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</p>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">{product.description}</p>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-center gap-8">
              <span className="text-xs font-bold uppercase tracking-widest">Quantity</span>
              <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 rounded-full px-6 py-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                <span className="font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
              </div>
            </div>
            <button onClick={() => addToCart(product, quantity)} className="w-full text-white py-6 rounded-[2rem] font-bold shadow-2xl transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4" style={{ backgroundColor: BRAND_PURPLE }}>
              {addingId === product.id ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} />}
              {addingId === product.id ? "Adding..." : "Add to Bag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Static Pages Content ---

const LegalPage = ({ title, content }: any) => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-16">{title}</h1>
    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-8 text-lg">
      {content}
    </div>
  </div>
);

// --- Story & FAQ Data ---

const StoryContent = () => (
  <>
    <p>MayGloss was born out of a desire for high-performance lipcare that doesn't compromise on purity. We noticed a gap in the market: glosses were either too sticky, too synthetic, or lacked the pigment we craved.</p>
    <p>Our founder, a botanical chemist with a passion for radiance, spent three years in the lab perfecting our "Luminous Bond" technology. By replacing harsh plastics with cushiony seed oils, we created a formula that heals as it highlights.</p>
    <img src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1200" className="w-full rounded-[3rem] my-12" alt="Alchemy" />
    <p>Today, MayGloss is more than a beauty brand. It's a testament to the power of nature and the beauty of conscious science. We are 100% vegan, cruelty-free, and committed to sustainable luxury.</p>
  </>
);

const FAQContent = () => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "Is the formula non-sticky?", a: "Yes. Our unique blend of botanical oils creates a cushiony barrier without the tackiness found in traditional glosses." },
    { q: "How long does it stay on?", a: "Our glosses provide 4-6 hours of consistent shine and up to 8 hours of moisture." },
    { q: "Is your packaging sustainable?", a: "We use 30% recycled glass for our bottles and our boxes are FSC certified compostable paper." },
    { q: "Do you ship internationally?", a: "We ship to over 50 countries globally with carbon-neutral shipping partners." }
  ];
  return (
    <div className="space-y-6">
      {faqs.map((f, i) => (
        <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6">
          <button onClick={() => setOpen(i)} className="w-full text-left flex justify-between items-center">
            <span className="font-bold text-xl">{f.q}</span>
            <ChevronDown className={`transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-slate-500">{f.a}</motion.p>}
        </div>
      ))}
    </div>
  );
};

// --- Checkout System ---

const OrderSuccess = ({ method, orderId }: any) => (
  <div className="pt-48 pb-32 px-6 max-w-2xl mx-auto text-center">
    <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-10 text-green-500">
      <CheckCircle2 size={48} />
    </div>
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-6">Order Received!</h1>
    <p className="text-slate-500 mb-12">Thank you for choosing MayGloss. Your order ID is <span className="font-bold text-indigo-950 dark:text-white">#{orderId}</span>.</p>
    
    {method === 'bank' && (
      <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] text-left mb-12">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Banknote size={20} /> Payment Instructions</h3>
        <p className="text-sm text-slate-500 mb-6">Please transfer the total amount to the following account to confirm your order:</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Bank Name:</span> <span className="font-bold">{BANK_DETAILS.bankName}</span></div>
          <div className="flex justify-between"><span>Account Name:</span> <span className="font-bold">{BANK_DETAILS.accountName}</span></div>
          <div className="flex justify-between"><span>Account Number:</span> <span className="font-bold">{BANK_DETAILS.accountNumber}</span></div>
        </div>
      </div>
    )}

    <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hi MayGloss! My Order ID is #${orderId}. I've just made a ${method === 'bank' ? 'bank transfer' : 'direct order'}.`)} className="bg-green-500 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 mx-auto shadow-xl hover:bg-green-600 transition-all">
      <MessageCircle size={20} /> Chat on WhatsApp
    </button>
  </div>
);

// --- Main App ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [orderMethod, setOrderMethod] = useState<'bank' | 'whatsapp'>('bank');

  useEffect(() => {
    const dark = localStorage.getItem('maygloss_dark') === 'true';
    setDarkMode(dark);
    if (dark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('maygloss_dark', newDark.toString());
    document.documentElement.classList.toggle('dark');
  };

  const addNotification = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const navigateTo = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      setCurrentPath(path);
      setIsNavigating(false);
      window.scrollTo(0, 0);
    }, 400);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setAddingToCartId(product.id);
    setTimeout(() => {
      setCart(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { ...product, quantity }];
      });
      setAddingToCartId(null);
      addNotification(`${product.name} added to bag!`);
    }, 600);
  };

  const placeOrder = (method: 'bank' | 'whatsapp') => {
    setOrderMethod(method);
    navigateTo('success');
    setCart([]);
  };

  const renderContent = () => {
    if (isNavigating) return <div className="h-screen flex items-center justify-center"><LoadingSpinner text="Elevating your shine..." /></div>;
    
    if (currentPath.startsWith('product-')) {
      const id = currentPath.split('-')[1];
      const p = PRODUCTS.find(prod => prod.id === id);
      return p ? <ProductDetailPage product={p} addToCart={addToCart} addingId={addingToCartId} onNavigate={navigateTo} /> : null;
    }

    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
      case 'products': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-center mb-16">The Palette</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingToCartId === p.id} onViewDetails={(prod: any) => navigateTo(`product-${prod.id}`)} />)}
          </div>
        </div>
      );
      case 'lookbook': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-center mb-16">The Muse Gallery</h1>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
             {PRODUCTS.concat(PRODUCTS).map((p, i) => (
               <div key={i} className="group relative overflow-hidden rounded-[2.5rem] cursor-pointer" onClick={() => navigateTo(`product-${p.id}`)}>
                 <img src={p.image} className="w-full group-hover:scale-110 transition-transform duration-700" alt="Muse" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold tracking-widest text-xs uppercase">View Look</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      );
      case 'story': return <LegalPage title="Botanical Alchemy" content={<StoryContent />} />;
      case 'faq': return <LegalPage title="Enquiries FAQ" content={<FAQContent />} />;
      case 'cart': return (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>
          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm">
              <ShoppingBag className="mx-auto mb-6 text-slate-200" size={64} />
              <p className="text-slate-400">Your bag is currently empty.</p>
              <button onClick={() => navigateTo('products')} className="mt-8 font-bold text-xs uppercase tracking-widest" style={{ color: BRAND_PURPLE }}>Discover Shades</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map(item => (
                <div key={item.id} className="flex gap-6 items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-slate-400 text-sm">{item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 p-2"><Trash2 size={20} /></button>
                </div>
              ))}
              <div className="p-10 bg-indigo-950 text-white rounded-[3rem] shadow-2xl space-y-8">
                <div className="flex justify-between items-center text-2xl font-serif">
                  <span>Total</span>
                  <span className="font-bold">${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => placeOrder('bank')} className="bg-white text-indigo-950 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                    <Banknote size={16} /> Pay via Bank Transfer
                  </button>
                  <button onClick={() => placeOrder('whatsapp')} className="bg-green-500 text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                    <MessageCircle size={16} /> Order on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'shipping': return <LegalPage title="Shipping Policy" content={<p>We offer premium expedited shipping globally. Orders are processed within 24-48 hours. Domestic orders typically arrive in 3-5 days, international in 7-14. All orders over $60 qualify for complimentary courier delivery.</p>} />;
      case 'returns': return <LegalPage title="Returns & Exchanges" content={<p>We stand by the quality of our alchemy. If you are not 100% satisfied with your glow, we offer a 30-day return window. Items must be in original packaging. Exchanges for different shades are always free of charge.</p>} />;
      case 'privacy': return <LegalPage title="Privacy promise" content={<p>Your data is handled with the same care as our botanical extracts. We use end-to-end encryption for all transactions and never share your details with third parties for marketing purposes.</p>} />;
      case 'terms': return <LegalPage title="Terms & Conditions" content={<p>By using MayGloss, you agree to our terms of service. Our products are for cosmetic use only. We reserve the right to cancel orders that appear fraudulent. Prices are subject to change without notice.</p>} />;
      case 'policy': return <LegalPage title="Cookie & Safety Policy" content={<p>Our formulas are dermatologically tested and hypoallergenic. We use small amounts of essential oils which may cause reactions in extremely sensitive individuals. Please patch test before full application.</p>} />;
      case 'contact': return <LegalPage title="Direct Enquiry" content={<p>For collaboration or support, reach out to concierge@maygloss.com. Our typical response time is under 12 hours.</p>} />;
      case 'success': return <OrderSuccess method={orderMethod} orderId={Math.floor(Math.random() * 90000) + 10000} />;
      default: return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={navigateTo} currentPath={currentPath} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div key={currentPath + isNavigating} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-stone-100 dark:bg-slate-900 pt-32 pb-12 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
                 <h2 className="text-2xl font-serif font-bold text-indigo-950 dark:text-white">MayGloss</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Botanical hydration and mirror-like shine for every skin tone. Your natural beauty, amplified through science.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Discover</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('products')} className="hover:text-indigo-950 cursor-pointer transition-colors">The Palette</li>
              <li onClick={() => navigateTo('lookbook')} className="hover:text-indigo-950 cursor-pointer transition-colors">Muse Gallery</li>
              <li onClick={() => navigateTo('story')} className="hover:text-indigo-950 cursor-pointer transition-colors">Our Story</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Concierge</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('faq')} className="hover:text-indigo-950 cursor-pointer transition-colors">Help FAQ</li>
              <li onClick={() => navigateTo('shipping')} className="hover:text-indigo-950 cursor-pointer transition-colors">Shipping Care</li>
              <li onClick={() => navigateTo('returns')} className="hover:text-indigo-950 cursor-pointer transition-colors">Returns & Refunds</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Legals</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('privacy')} className="hover:text-indigo-950 cursor-pointer transition-colors">Privacy Promise</li>
              <li onClick={() => navigateTo('terms')} className="hover:text-indigo-950 cursor-pointer transition-colors">Terms of Service</li>
              <li onClick={() => navigateTo('policy')} className="hover:text-indigo-950 cursor-pointer transition-colors">Safety Policy</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">© {new Date().getFullYear()} MayGloss Beauty. All Radiant Rights Reserved.</div>
      </footer>

      <ScrollToTop />
      <NotificationToast notifications={notifications} remove={id => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
