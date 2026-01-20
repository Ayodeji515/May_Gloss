
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
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Data Types ---

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Shine' | 'Matte' | 'Plumper' | 'Tint';
  description: string;
  image: string;
  images: string[]; // Added for gallery support
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

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amethyst Glow',
    price: 18.00,
    category: 'Shine',
    description: 'A sophisticated lavender-tinted gloss that adapts to your natural lip pH. Infused with cold-pressed grape seed oil for a non-sticky finish. This multi-tasking formula provides high shine while deeply nourishing the delicate lip barrier.',
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
    description: 'The perfect everyday neutral. Our whipped matte formula provides full-coverage pigment with a weightless feel. Designed to stay all day without drying or cracking.',
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
    description: 'Instant volume with a cooling sensation. Micro-reflecting pearls make lips appear fuller instantly while cross-linked hyaluronic acid ensures long-term hydration.',
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
    description: 'A cushiony lip oil that drenches lips in moisture. Leaves a delicate berry stain that lasts. Perfect for the "clean girl" aesthetic.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601054704854-1a2e79dea4d3?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '5',
    name: 'Twilight Sparkle',
    price: 19.00,
    category: 'Shine',
    description: 'Multi-dimensional glitter suspended in a clear base. Designed to be worn alone for a starry effect or layered over your favorite lipstick.',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '6',
    name: 'Champagne Satin',
    price: 21.00,
    category: 'Shine',
    description: 'A creamy, satin-finish gloss with warm gold undertones. It captures the essence of golden hour in a single swipe.',
    image: 'https://images.unsplash.com/photo-1631214499558-c8cc25624941?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1631214499558-c8cc25624941?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800'
    ],
    isBestSeller: true
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
    rating: 4,
    text: "I love the subtle scent and the packaging is stunning. The plumper really works without that painful stinging!",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  }
];

// --- Shared Components ---

const LoadingSpinner = ({ size = 24, text }: { size?: number, text?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="text-purple-400"
      style={{ color: BRAND_PURPLE }}
    >
      <Loader2 size={size} />
    </motion.div>
    {text && <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{text}</p>}
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < rating ? `fill-[${BRAND_PURPLE}] text-[${BRAND_PURPLE}]` : "text-gray-300"} 
        style={{ color: i < rating ? BRAND_PURPLE : undefined, fill: i < rating ? BRAND_PURPLE : undefined }}
      />
    ))}
  </div>
);

const NotificationToast = ({ notifications, remove }: { notifications: Notification[], remove: (id: string) => void }) => (
  <div className="fixed bottom-8 left-8 z-[200] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[300px]"
        >
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

// --- Navigation ---

const Navbar = ({ 
  cartCount, 
  onNavigate, 
  currentPath,
  darkMode,
  toggleDarkMode,
}: { 
  cartCount: number; 
  onNavigate: (path: string) => void;
  currentPath: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: 'home' },
    { label: 'Shop', path: 'products' },
    { label: 'Muse', path: 'lookbook' },
    { label: 'Our Story', path: 'story' },
    { label: 'FAQ', path: 'faq' },
  ];

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-b border-purple-100 dark:border-slate-800 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-indigo-900 dark:text-purple-400 z-[130]">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div onClick={() => handleNav('home')} className="flex items-center gap-2 cursor-pointer group">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl overflow-hidden" style={{ backgroundColor: BRAND_PURPLE }}>
                MG
             </div>
             <h1 className="text-xl md:text-2xl font-serif font-bold text-indigo-950 dark:text-purple-300 tracking-tight">MayGloss</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => handleNav(item.path)} 
              className={`hover:text-indigo-950 dark:hover:text-purple-300 transition-colors ${currentPath.startsWith(item.path) ? 'text-indigo-950 border-b-2' : ''}`} 
              style={{ borderBottomColor: currentPath.startsWith(item.path) ? BRAND_PURPLE : 'transparent' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-950 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => handleNav('cart')} className="relative p-2.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-full hover:bg-indigo-950 hover:text-white transition-all">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ring-2 ring-white dark:ring-slate-950" style={{ backgroundColor: BRAND_PURPLE }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[115] bg-white dark:bg-slate-950 pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-8 text-center mt-12">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="text-3xl font-serif font-bold text-indigo-950 dark:text-white"
                  style={{ color: currentPath.startsWith(item.path) ? BRAND_PURPLE : undefined }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Page Components ---

const ProductCard: React.FC<{ product: Product, addToCart: (p: Product) => void, isAdding: boolean, onViewDetails: (p: Product) => void }> = ({ product, addToCart, isAdding, onViewDetails }) => (
  <div onClick={() => onViewDetails(product)} className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 aspect-[4/5] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <button 
        onClick={(e) => { e.stopPropagation(); if(!isAdding) addToCart(product); }}
        className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
        style={{ color: isAdding ? 'white' : BRAND_PURPLE, backgroundColor: isAdding ? BRAND_PURPLE : undefined }}
      >
        {isAdding ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={16} /></motion.div> : <ShoppingBag size={16} />}
        {isAdding ? "Adding..." : `Quick Add — $${product.price.toFixed(2)}`}
      </button>
    </div>
    <div className="px-2 text-center">
      <h3 className="text-xl font-bold text-indigo-950 dark:text-white transition-colors mb-2">{product.name}</h3>
      <div className="flex justify-between items-center max-w-[200px] mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{product.category}</span>
        <span className="text-lg font-bold text-indigo-950 dark:text-purple-400" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

// --- NEW Component: Product Detail Page ---
const ProductDetailPage = ({ product, addToCart, addingId, onNavigate }: { product: Product, addToCart: (p: Product, q: number) => void, addingId: string | null, onNavigate: (p: string) => void }) => {
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const zoomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-12">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-950">Home</button>
        <ChevronRight size={10} />
        <button onClick={() => onNavigate('products')} className="hover:text-indigo-950">Shop</button>
        <ChevronRight size={10} />
        <span className="text-indigo-950 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)}
                className={`w-20 h-20 md:w-24 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? 'border-purple-400 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                style={{ borderColor: activeImg === img ? BRAND_PURPLE : 'transparent' }}
              >
                <img src={img} className="w-full h-full object-cover" alt={`${product.name} view ${i}`} />
              </button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div 
            ref={zoomRef}
            className="flex-grow relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-slate-900 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPos(p => ({ ...p, show: false }))}
          >
            <motion.img 
              key={activeImg}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              src={activeImg} 
              className="w-full h-full object-cover"
              alt={product.name}
            />
            
            {/* Zoom Overlay */}
            <AnimatePresence>
              {zoomPos.show && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: `url(${activeImg})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%'
                  }}
                />
              )}
            </AnimatePresence>

            <div className="absolute top-6 right-6 p-4 bg-white/50 backdrop-blur-md rounded-full text-indigo-950">
              <Maximize2 size={20} />
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-center">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>
              Botanical Beauty / {product.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-indigo-950 dark:text-white mb-6 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-6 mb-8">
              <span className="text-3xl font-bold text-indigo-950 dark:text-purple-400" style={{ color: BRAND_PURPLE }}>
                ${product.price.toFixed(2)}
              </span>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <StarRating rating={5} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">(24 Reviews)</span>
              </div>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 italic">
              "{product.description}"
            </p>
          </div>

          <div className="space-y-8 mb-12">
            <div className="flex items-center gap-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-950 dark:text-slate-300">Quantity</span>
              <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 rounded-full px-6 py-3 border border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-slate-400 hover:text-indigo-950 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-slate-400 hover:text-indigo-950 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={addingId === product.id}
              className="w-full text-white py-6 rounded-[2rem] font-bold shadow-2xl hover:bg-slate-800 transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 active:scale-95 disabled:opacity-70"
              style={{ backgroundColor: BRAND_PURPLE }}
            >
              {addingId === product.id ? <LoadingSpinner size={16} /> : <ShoppingBag size={18} />}
              {addingId === product.id ? "Processing..." : `Add to Bag — $${(product.price * quantity).toFixed(2)}`}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <Truck size={18} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <RotateCcw size={18} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">30-Day Glowing Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <section className="mt-40">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-indigo-950 dark:text-white">Complete Your Routine</h2>
          <p className="text-slate-400 mt-2">Muses also adored these signature shades</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PRODUCTS.filter(p => p.id !== product.id).slice(0, 3).map(p => (
             <ProductCard 
                key={p.id} 
                product={p} 
                addToCart={(prod) => addToCart(prod, 1)} 
                isAdding={addingId === p.id} 
                onViewDetails={(prod) => onNavigate(`product-${prod.id}`)}
             />
          ))}
        </div>
      </section>
    </div>
  );
};

const FAQPage = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Is MayGloss vegan and cruelty-free?", a: "Absolutely. Every single MayGloss formula is 100% vegan and we are proudly certified cruelty-free. We never test on animals, nor do we use animal-derived ingredients." },
    { q: "How long does shipping usually take?", a: "Orders are processed within 24-48 hours. Domestic shipping typically takes 3-5 business days, while international orders can take 7-14 business days depending on the location." },
    { q: "Can I return my gloss if the shade isn't right?", a: "Yes! We offer a 30-day 'Perfect Shine' guarantee. If you're not completely happy with your shade, you can return or exchange it for a different color within 30 days of purchase." },
    { q: "How should I store my MayGloss?", a: "Store your glosses in a cool, dry place away from direct sunlight. High temperatures can affect the botanical oil consistency. Ensure the cap is tightly closed after each use." },
    { q: "Are the plumping glosses painful?", a: "Not at all. Our Icy Plumper uses cooling botanical extracts and micro-hyaluronic spheres to create volume without the stinging or burning sensation common in traditional plumpers." }
  ];

  return (
    <div className="pt-32 pb-32 px-6 max-w-3xl mx-auto">
      <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-12 text-center">Common Enquiries</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center text-left gap-4">
              <span className="font-bold text-lg text-indigo-950 dark:text-white">{faq.q}</span>
              <Plus size={20} className={`transform transition-transform ${open === i ? 'rotate-45' : ''}`} style={{ color: BRAND_PURPLE }} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-12">{title}</h1>
    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6">
      {content}
    </div>
  </div>
);

const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-10 right-10 p-4 rounded-full bg-white dark:bg-slate-900 shadow-2xl z-[150] text-indigo-950 dark:text-white border border-purple-50"
        >
          <ChevronUp size={24} style={{ color: BRAND_PURPLE }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- FIX: Added missing HomePage component ---
const HomePage = ({ onNavigate, addToCart, addingId }: { onNavigate: (p: string) => void, addToCart: (p: Product) => void, addingId: string | null }) => {
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white mb-6 block drop-shadow-lg">
              Est. 2024 / Botanical Alchemy
            </span>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              Pure <br />
              <span className="italic" style={{ color: BRAND_PURPLE }}>Luminance.</span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-lg leading-relaxed drop-shadow-md">
              Discover high-performance lipcare infused with cold-pressed botanicals and mirror-like shine. 
              Non-sticky. Vegan. Unapologetically radiant.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => onNavigate('products')}
                className="bg-white text-indigo-950 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-indigo-950 hover:text-white transition-all shadow-2xl"
              >
                Explore Collection
              </button>
              <button 
                onClick={() => onNavigate('story')}
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
              >
                Our Story
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Features */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 hidden md:flex justify-between gap-12 text-white/80">
          <div className="flex items-center gap-4">
            <Leaf size={20} className="text-purple-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">100% Vegan Formulas</span>
          </div>
          <div className="flex items-center gap-4">
            <Droplets size={20} className="text-purple-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Hyaluronic Hydration</span>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck size={20} className="text-purple-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cruelty-Free Certified</span>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>Curated Essentials</span>
            <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Best Sellers</h2>
          </div>
          <button 
            onClick={() => onNavigate('products')}
            className="text-xs font-bold uppercase tracking-[0.2em] border-b-2 pb-2 hover:opacity-70 transition-opacity"
            style={{ borderBottomColor: BRAND_PURPLE }}
          >
            View All Shades
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {bestSellers.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
              isAdding={addingId === product.id} 
              onViewDetails={(p) => onNavigate(`product-${p.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="bg-slate-50 dark:bg-slate-900 py-32 rounded-[4rem] mx-4 mb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl relative z-10" alt="Ethos" />
             <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-30 z-0" style={{ backgroundColor: BRAND_PURPLE }} />
          </div>
          <div>
            <Quote size={48} className="text-purple-300 mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-8 leading-tight">
              "We believe that <span className="italic">conscious beauty</span> should be an effortless luxury."
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
              Every MayGloss product is engineered with the highest quality botanical extracts. 
              We replace harsh synthetic thickeners with nourishing seed oils, creating a shine 
              that heals while it highlights.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Sparkles className="mb-4" style={{ color: BRAND_PURPLE }} />
                <h4 className="font-bold text-indigo-950 dark:text-white mb-2">Mirror Shine</h4>
                <p className="text-sm text-slate-400">High-refractive index oils for a glass-like finish.</p>
              </div>
              <div>
                <Droplets className="mb-4" style={{ color: BRAND_PURPLE }} />
                <h4 className="font-bold text-indigo-950 dark:text-white mb-2">Serum Base</h4>
                <p className="text-sm text-slate-400">Lip-treatment formula that stays silky, never sticky.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-4">Muse Testimonials</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-purple-400 text-purple-400" />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                  <img src={review.avatar} className="w-12 h-12 rounded-full object-cover" alt={review.name} />
                  <div>
                    <h4 className="font-bold text-indigo-950 dark:text-white">{review.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic mb-6">"{review.text}"</p>
                <StarRating rating={review.rating} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Root Component ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const isDark = localStorage.getItem('maygloss_theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('maygloss_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('maygloss_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem('maygloss_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('maygloss_cart', JSON.stringify(cart));
  }, [cart]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const navigateTo = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      setCurrentPath(path);
      setIsNavigating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        addNotification(`${quantity}x ${product.name} added to bag!`, 'success');
    }, 600);
  };

  const removeFromCart = (id: string) => {
    const item = cart.find(i => i.id === id);
    setCart(prev => prev.filter(i => i.id !== id));
    if(item) addNotification(`Removed ${item.name} from bag.`, 'info');
  };

  const renderContent = () => {
    if(isNavigating) return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <LoadingSpinner text="Refining your glow..." />
        </div>
    );

    // Product Detail Routing
    if (currentPath.startsWith('product-')) {
      const prodId = currentPath.split('-')[1];
      const product = PRODUCTS.find(p => p.id === prodId);
      if (product) {
        return <ProductDetailPage 
          product={product} 
          addToCart={addToCart} 
          addingId={addingToCartId} 
          onNavigate={navigateTo} 
        />;
      }
    }

    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={(p) => addToCart(p, 1)} addingId={addingToCartId} />;
      case 'products': return (
        <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-16 text-center">The Full Palette</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                {PRODUCTS.map(p => <ProductCard key={p.id} product={p} addToCart={(prod) => addToCart(prod, 1)} isAdding={addingToCartId === p.id} onViewDetails={(prod) => navigateTo(`product-${prod.id}`)} />)}
            </div>
        </div>
      );
      case 'story': return (
          <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
              <h1 className="text-6xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-tight italic">Botanical Passion.</h1>
              <img src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=1200" className="w-full h-[400px] object-cover rounded-[3rem] mb-12 shadow-2xl" alt="Our Mission" />
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">At MayGloss, we believe that beauty should never be a compromise. Our journey began in a small botanical lab, where we obsessed over one problem: Why are high-shine lipglosses always so sticky and drying?</p>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">By replacing synthetic polymers with cold-pressed botanical oils and micro-hyaluronic spheres, we created a texture that feels like a luxurious serum.</p>
          </div>
      );
      case 'lookbook': return (
          <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
              <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-16 text-center">The Muse Gallery</h1>
              <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <img key={i} src={`https://images.unsplash.com/photo-${1600000000000 + (i * 123456)}?auto=format&fit=crop&q=80&w=800`} className="w-full rounded-[2rem] shadow-lg" alt="Muse" />
                ))}
              </div>
          </div>
      );
      case 'faq': return <FAQPage />;
      case 'shipping': return <InfoPage title="Shipping Policy" content={<p>All MayGloss orders are handled with botanical care. We ship globally from our labs in California. Orders over $60 qualify for complimentary priority shipping.</p>} />;
      case 'returns': return <InfoPage title="Return & Exchange" content={<p>We stand by our formulas. If you are not 100% glowing after using MayGloss, we offer simple 30-day returns on all products.</p>} />;
      case 'privacy': return <InfoPage title="Privacy Concierge" content={<p>Your data is as safe as your lips. We never sell your personal information and use end-to-end encryption for all secure payments.</p>} />;
      case 'contact': return (
        <div className="pt-32 pb-32 px-6 max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-8">Let's Connect</h1>
            <p className="text-slate-500 mb-12">Email us at concierge@maygloss.com or reach out via Instagram @MayGloss.</p>
            <div className="flex justify-center gap-8">
                <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] shadow-sm flex flex-col items-center">
                    <MessageCircle size={32} className="text-purple-400 mb-4" />
                    <span className="font-bold">Live Chat</span>
                </div>
                <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] shadow-sm flex flex-col items-center">
                    <Phone size={32} className="text-purple-400 mb-4" />
                    <span className="font-bold">Call Us</span>
                </div>
            </div>
        </div>
      );
      case 'cart': return (
        <div className="pt-32 pb-32 px-4 max-w-5xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-16">Shopping Bag</h1>
            {cart.length === 0 ? (
                <div className="text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-slate-200 mb-8" />
                    <p className="text-slate-400">Your bag is currently empty.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-8 items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl">
                            <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-slate-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => navigateTo('home')} className="w-full bg-indigo-950 text-white py-6 rounded-full font-bold uppercase tracking-widest text-xs">Checkout securely</button>
                </div>
            )}
        </div>
      );
      default: return <HomePage onNavigate={navigateTo} addToCart={(p) => addToCart(p, 1)} addingId={addingToCartId} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <Navbar 
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)} 
        onNavigate={navigateTo} 
        currentPath={currentPath} 
        darkMode={darkMode}
        toggleDarkMode={() => { setDarkMode(!darkMode); addNotification(`Mode switched.`, 'info'); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="min-h-screen pt-20">
        <AnimatePresence mode="wait">
            <motion.div key={currentPath + isNavigating} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 pt-32 pb-12 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
                 <h2 className="text-2xl font-serif font-bold text-indigo-950 dark:text-white">MayGloss</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Botanical hydration and mirror-like shine for every skin tone. Your natural beauty, amplified.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Discover</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('products')} className="hover:text-indigo-950 cursor-pointer transition-colors">The Collection</li>
              <li onClick={() => navigateTo('lookbook')} className="hover:text-indigo-950 cursor-pointer transition-colors">Muse Gallery</li>
              <li onClick={() => navigateTo('story')} className="hover:text-indigo-950 cursor-pointer transition-colors">Our Mission</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Concierge</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('faq')} className="hover:text-indigo-950 cursor-pointer transition-colors">Support FAQ</li>
              <li onClick={() => navigateTo('shipping')} className="hover:text-indigo-950 cursor-pointer transition-colors">Shipping Care</li>
              <li onClick={() => navigateTo('returns')} className="hover:text-indigo-950 cursor-pointer transition-colors">Returns & Refunds</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Legals</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('privacy')} className="hover:text-indigo-950 cursor-pointer transition-colors">Privacy Promise</li>
              <li onClick={() => navigateTo('contact')} className="hover:text-indigo-950 cursor-pointer transition-colors">Direct Enquiry</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">
          © {new Date().getFullYear()} MayGloss Cosmetics. Pure Luminance.
        </div>
      </footer>

      <ScrollToTop />
      <NotificationToast notifications={notifications} remove={id => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
