
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  ShieldCheck
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
    description: 'A sophisticated lavender-tinted gloss that adapts to your natural lip pH. Infused with cold-pressed grape seed oil for a non-sticky finish.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true
  },
  {
    id: '2',
    name: 'Dusty Rose Matte',
    price: 22.00,
    category: 'Matte',
    description: 'The perfect everyday neutral. Our whipped matte formula provides full-coverage pigment with a weightless feel.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true
  },
  {
    id: '3',
    name: 'Icy Plumper',
    price: 24.00,
    category: 'Plumper',
    description: 'Instant volume with a cooling sensation. Micro-reflecting pearls make lips appear fuller instantly.',
    image: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Berry Nectar Oil',
    price: 20.00,
    category: 'Tint',
    description: 'A cushiony lip oil that drenches lips in moisture. Leaves a delicate berry stain that lasts.',
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Twilight Sparkle',
    price: 19.00,
    category: 'Shine',
    description: 'Multi-dimensional glitter suspended in a clear base. Designed to be worn alone or layered.',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Champagne Satin',
    price: 21.00,
    category: 'Shine',
    description: 'A creamy, satin-finish gloss with warm gold undertones. It captures the essence of golden hour.',
    image: 'https://images.unsplash.com/photo-1631214499558-c8cc25624941?auto=format&fit=crop&q=80&w=800',
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
              className={`hover:text-indigo-950 dark:hover:text-purple-300 transition-colors ${currentPath === item.path ? 'text-indigo-950 border-b-2' : ''}`} 
              style={{ borderBottomColor: currentPath === item.path ? BRAND_PURPLE : 'transparent' }}
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
                  style={{ color: currentPath === item.path ? BRAND_PURPLE : undefined }}
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

// Fix: Use React.FC to handle the 'key' prop correctly in TypeScript JSX.
const ProductCard: React.FC<{ product: Product, addToCart: (p: Product) => void, isAdding: boolean }> = ({ product, addToCart, isAdding }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 aspect-[4/5] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <button 
        onClick={(e) => { e.stopPropagation(); if(!isAdding) addToCart(product); }}
        className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
        style={{ color: isAdding ? 'white' : BRAND_PURPLE, backgroundColor: isAdding ? BRAND_PURPLE : undefined }}
      >
        {isAdding ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={16} /></motion.div> : <ShoppingBag size={16} />}
        {isAdding ? "Adding..." : `Add To Bag — $${product.price.toFixed(2)}`}
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

const HomePage = ({ onNavigate, addToCart, addingId }: { onNavigate: (p: string) => void, addToCart: (p: Product) => void, addingId: string | null }) => {
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div className="animate-in fade-in duration-1000 bg-white dark:bg-slate-950">
      <section className="relative h-auto min-h-[85vh] py-40 md:py-64 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-purple-900/30 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 border border-purple-100" style={{ color: BRAND_PURPLE }}>
              High-Shine Botanical Hydration
            </span>
            <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-8 leading-[0.85]">
              Pure <br/><span className="italic font-normal">Luminance.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Experience non-sticky, mirror-like shine infused with cold-pressed botanical oils. Designed for kissable lips, everyday.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => onNavigate('products')} className="w-full sm:w-auto text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-all shadow-2xl" style={{ backgroundColor: BRAND_PURPLE }}>
                Shop Collection
              </button>
              <button onClick={() => onNavigate('story')} className="w-full sm:w-auto bg-white/80 dark:bg-slate-800 backdrop-blur-md text-indigo-950 dark:text-white border border-slate-100 dark:border-slate-700 px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-50 transition-all">
                The Mission
              </button>
            </div>
          </motion.div>
        </div>
        {/* Floating elements for visual interest since bg image is gone */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-700" />
      </section>

      {/* Botanical Spotlight */}
      <section className="py-32 px-4 bg-slate-50 dark:bg-slate-900 rounded-[4rem] mx-4 mb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>Ingredient Integrity</span>
                <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-tight">Hydration Meets <br/> Botanical Science</h2>
                <div className="space-y-8">
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm" style={{ color: BRAND_PURPLE }}><Leaf size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-2 dark:text-white">Cold-Pressed Grape Seed Oil</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Antioxidant-rich protection for sensitive lip skin.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-sm" style={{ color: BRAND_PURPLE }}><Droplets size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-2 dark:text-white">Hyaluronic Spheres</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Deeply penetrates for instant volume and moisture.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="relative">
                <img src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1000" className="w-full h-[600px] object-cover rounded-[3rem] shadow-2xl relative z-10" alt="Botanical Ingredients" />
            </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-4">The Essentials</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Hand-picked by our beauty experts for every skin tone.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} isAdding={addingId === product.id} />
          ))}
        </div>
      </section>

      {/* Refined Reviews Section */}
      <section className="py-32 px-4 bg-purple-50 dark:bg-slate-900 rounded-[4rem] mx-4 mb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-6">Community Stories</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Join thousands of women who've simplified their beauty routine with MayGloss.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-xl hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center text-center">
                <img src={review.avatar} className="w-20 h-20 rounded-full object-cover mb-8 ring-4 ring-purple-100 dark:ring-purple-900/30" alt={review.name} />
                <Quote size={40} className="text-purple-100 dark:text-slate-700 mb-6" />
                <p className="mb-8 text-slate-600 dark:text-slate-300 italic text-lg leading-relaxed font-serif">"{review.text}"</p>
                <div className="mt-auto">
                    <StarRating rating={review.rating} />
                    <h4 className="font-bold text-indigo-950 dark:text-white mt-4">{review.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- FAQ Page ---
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

// --- Legal/Info Pages ---
const InfoPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-12">{title}</h1>
    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6">
      {content}
    </div>
  </div>
);

// Fix: Implement missing ScrollToTop component to allow users to navigate back to top.
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

// --- Root Component ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Fix: Add missing searchQuery state used by Navbar.
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

  const addToCart = (product: Product) => {
    setAddingToCartId(product.id);
    setTimeout(() => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1 }];
        });
        setAddingToCartId(null);
        addNotification(`${product.name} added to bag!`, 'success');
    }, 600);
  };

  const renderContent = () => {
    if(isNavigating) return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <LoadingSpinner text="Refining your glow..." />
        </div>
    );

    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
      case 'products': return (
        <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
            <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-16 text-center">The Full Palette</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                {/* Fix: Use addingToCartId instead of undefined addingId. */}
                {PRODUCTS.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingToCartId === p.id} />)}
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
                                <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => navigateTo('home')} className="w-full bg-indigo-950 text-white py-6 rounded-full font-bold uppercase tracking-widest text-xs">Proceed to Bag Summary</button>
                </div>
            )}
        </div>
      );
      default: return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
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
