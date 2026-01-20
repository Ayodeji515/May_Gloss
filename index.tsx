
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
  Eye,
  Leaf,
  Droplets,
  Sparkles,
  Camera,
  Heart,
  Loader2,
  Bell
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
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- Component Props Interfaces ---

interface ProductCardProps {
  product: Product;
  addToCart: (p: Product) => void;
  isAdding: boolean;
}

interface HomePageProps {
  onNavigate: (path: string) => void;
  addToCart: (p: Product) => void;
  addingId: string | null;
}

interface ProductsPageProps {
  addToCart: (p: Product) => void;
  searchQuery: string;
  addingId: string | null;
}

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
}

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onComplete: () => void;
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
    text: "Finally, a purple gloss that doesn't look tacky! It's so elegant and my lips feel incredibly hydrated.",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Isabella M.",
    rating: 5,
    text: "The matte formula is game-changing. It stayed on through a three-course dinner and didn't dry out.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Chloe W.",
    rating: 4,
    text: "I love the subtle scent and the packaging is stunning. The plumper really works!",
    date: "2 weeks ago"
  }
];

// --- Shared Components ---

const LoadingSpinner = ({ size = 18 }: { size?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  >
    <Loader2 size={size} />
  </motion.div>
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
          className="pointer-events-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4 min-w-[280px]"
        >
          <div className="p-2 rounded-full" style={{ backgroundColor: BRAND_PURPLE + '20', color: BRAND_PURPLE }}>
            <Bell size={18} />
          </div>
          <p className="text-sm font-bold text-indigo-950 dark:text-white flex-grow">{n.message}</p>
          <button onClick={() => remove(n.id)} className="text-slate-300 hover:text-slate-500">
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
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] p-4 rounded-full text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group"
          style={{ backgroundColor: BRAND_PURPLE }}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Navigation ---

const Navbar = ({ 
  cartCount, 
  onNavigate, 
  currentPath,
  darkMode,
  toggleDarkMode,
  searchQuery,
  setSearchQuery
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
    { label: 'Contact', path: 'contact' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
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

          <div className="flex-grow max-w-sm hidden md:block relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-950 transition-colors" />
            <input 
              type="text" 
              placeholder="Search our shades..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentPath !== 'products') onNavigate('products');
              }}
              className="w-full pl-12 pr-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-900 text-sm border border-transparent focus:border-purple-200 outline-none text-slate-700 dark:text-slate-200 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-950 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={() => handleNav('cart')}
              className="relative p-2.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-full hover:bg-indigo-950 hover:text-white transition-all"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ring-2 ring-white dark:ring-slate-950" style={{ backgroundColor: BRAND_PURPLE }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

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
                  className="text-2xl font-serif font-bold text-indigo-950 dark:text-white hover:text-purple-400 transition-colors"
                  style={{ color: currentPath === item.path ? BRAND_PURPLE : undefined }}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full px-6 py-4 rounded-full bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-purple-200"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Page Components ---

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, isAdding }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 aspect-[4/5] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <button 
        onClick={(e) => { e.stopPropagation(); if(!isAdding) addToCart(product); }}
        className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md text-indigo-950 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl hover:text-white flex items-center justify-center gap-3"
        style={{ color: isAdding ? 'white' : BRAND_PURPLE, backgroundColor: isAdding ? BRAND_PURPLE : undefined }}
        onMouseEnter={(e) => { if(!isAdding) { e.currentTarget.style.backgroundColor = BRAND_PURPLE; e.currentTarget.style.color = "white"; } }}
        onMouseLeave={(e) => { if(!isAdding) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.95)"; e.currentTarget.style.color = BRAND_PURPLE; } }}
      >
        {isAdding ? <LoadingSpinner size={16} /> : <ShoppingBag size={16} />}
        {isAdding ? "Adding..." : `Add to Bag — $${product.price.toFixed(2)}`}
      </button>
    </div>
    <div className="px-2">
      <h3 className="text-xl font-bold text-indigo-950 dark:text-white transition-colors mb-2">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{product.category}</span>
        <span className="text-lg font-bold text-indigo-950 dark:text-purple-400" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const HomePage = ({ onNavigate, addToCart, addingId }: HomePageProps) => {
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div className="animate-in fade-in duration-1000 bg-white dark:bg-slate-950">
      <section className="relative h-auto min-h-[95vh] py-40 md:py-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover grayscale-[20%] opacity-70 dark:opacity-40"
            alt="Luxurious Lipgloss Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-slate-950/40 dark:to-slate-950" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 dark:bg-purple-900/30 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 border border-purple-100" style={{ color: BRAND_PURPLE }}>
              Kissable Lips, Everyday
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-indigo-950 dark:text-white mb-8 leading-[0.9]">
              Mirror <br/><span className="italic font-normal">Shine.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Experience the hydration of a balm with the high-shine finish of a gloss. Botanical, non-sticky, and made for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-800 transition-all shadow-2xl"
                style={{ backgroundColor: BRAND_PURPLE }}
              >
                Shop The Collection
              </button>
              <button 
                onClick={() => onNavigate('story')}
                className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-indigo-950 border border-slate-100 px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-50 transition-all"
              >
                Our Mission
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Botanical Spotlight */}
      <section className="py-32 px-4 bg-slate-50 dark:bg-slate-900 rounded-[4rem] mx-4 mb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>Ingredient Integrity</span>
                <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-tight">Hydration Meets <br/> Botanical Science</h2>
                <div className="space-y-8">
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-3xl bg-white shadow-sm" style={{ color: BRAND_PURPLE }}><Leaf size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Cold-Pressed Grape Seed Oil</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Rich in antioxidants to protect and nourish sensitive lip skin throughout the day.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-3xl bg-white shadow-sm" style={{ color: BRAND_PURPLE }}><Droplets size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Micro-Hyaluronic Spheres</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Deeply penetrates for instant volume and long-lasting moisture retention.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-4 rounded-3xl bg-white shadow-sm" style={{ color: BRAND_PURPLE }}><Sparkles size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Botanical Vitamin E</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">A natural preservative and healing agent that keeps lips soft and healthy.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="relative">
                <div className="absolute -inset-4 rounded-[4rem] border-2 border-dashed border-purple-200 rotate-3" />
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
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart}
              isAdding={addingId === product.id}
            />
          ))}
        </div>
      </section>

      {/* Gloss Personality Quiz */}
      <section className="py-32 px-4 bg-indigo-950 text-white rounded-[4rem] mx-4 mb-32 overflow-hidden text-center">
        <div className="max-w-3xl mx-auto">
            <Sparkles className="mx-auto mb-8 animate-pulse" style={{ color: BRAND_PURPLE }} size={40} />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">Find Your Shine Signature</h2>
            <p className="text-purple-200 text-lg mb-12 leading-relaxed">Are you a 'High-Impact Shine' or 'Velvet Matte' muse? Discover your perfect finish.</p>
            <button className="bg-white text-indigo-950 px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl">
                Start Shade Quiz
            </button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto mb-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-4">What Our Community Says</h2>
          <p className="text-slate-500 dark:text-slate-400">Join 50,000+ happy glossy girls.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map(review => (
            <div key={review.id} className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-purple-50 dark:border-slate-700 relative overflow-hidden">
              <Quote size={80} className="absolute -top-4 -right-4 text-purple-50 dark:text-slate-700/50" />
              <div className="relative z-10">
                <StarRating rating={review.rating} />
                <p className="mt-6 mb-8 text-slate-600 dark:text-slate-300 italic text-lg leading-relaxed">"{review.text}"</p>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-6">
                  <span className="font-bold text-indigo-950 dark:text-white">{review.name}</span>
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const LookbookPage = () => (
    <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>The Muse Gallery</span>
            <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-8">Gloss in the Wild</h1>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">Tag us @MayGloss for a chance to be featured in our monthly lookbook.</p>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="relative group overflow-hidden rounded-3xl cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-${1600000000000 + (i * 123456)}?auto=format&fit=crop&q=80&w=800`} className="w-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105" alt="Muse" />
                    <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <span className="text-white text-xs font-bold">@muse_profile_{i}</span>
                        <span className="text-white/60 text-[10px]">Wearing: Champagne Satin</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const StoryPage = () => (
    <div className="pt-32 pb-32 px-4 max-w-4xl mx-auto">
        <div className="mb-20 rounded-[3rem] overflow-hidden shadow-2xl h-[400px]">
             <img src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="The Story" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 block" style={{ color: BRAND_PURPLE }}>Our Philosophy</span>
        <h1 className="text-6xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-tight italic">Born from botanical passion, refined for modern life.</h1>
        <div className="space-y-12 text-slate-600 text-lg leading-relaxed first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-4 first-letter:text-purple-400">
            <p>At MayGloss, we believe that beauty should never be a compromise between aesthetics and health. Our journey began in a small botanical lab, where we obsessed over a single problem: Why are high-shine lipglosses always so sticky and drying?</p>
            <p>After three years of research and formula iterations, we found the perfect balance. By replacing synthetic polymers with botanical oils and micro-hyaluronic spheres, we created a texture that feels like a luxurious serum.</p>
            <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 text-indigo-950 italic text-2xl font-serif">
                "We don't just sell gloss. We sell the confidence of healthy, radiant lips every single day."
            </div>
            <p>Every bottle is hand-poured and strictly cruelty-free, because we believe the planet deserves to shine just as much as you do.</p>
        </div>
    </div>
);

const ProductsPage = ({ addToCart, searchQuery, addingId }: ProductsPageProps) => {
  const [category, setCategory] = useState('All');
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [priceRange, setPriceRange] = useState('All');
  
  const categories = ['All', 'Shine', 'Matte', 'Plumper', 'Tint'];
  const priceOptions = ['All', 'Under $20', '$20 - $25', '$25+'];

  const list = useMemo(() => {
    let result = PRODUCTS;
    if (category !== 'All') result = result.filter(p => p.category === category);
    if (showBestSellers) result = result.filter(p => p.isBestSeller);
    if (priceRange === 'Under $20') result = result.filter(p => p.price < 20);
    else if (priceRange === '$20 - $25') result = result.filter(p => p.price >= 20 && p.price <= 25);
    else if (priceRange === '$25+') result = result.filter(p => p.price > 25);
    
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [category, searchQuery, showBestSellers, priceRange]);

  return (
    <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto bg-white dark:bg-slate-950 transition-colors">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-64 flex-shrink-0 space-y-12">
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-6">Collections</h3>
                <div className="flex flex-col gap-3">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} className={`text-sm text-left transition-all ${category === cat ? 'font-bold' : 'text-slate-400 hover:text-indigo-950'}`} style={{ color: category === cat ? BRAND_PURPLE : undefined }}>{cat}</button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-6">Investment</h3>
                <div className="flex flex-col gap-3">
                    {priceOptions.map(opt => (
                        <button key={opt} onClick={() => setPriceRange(opt)} className={`text-sm text-left transition-all ${priceRange === opt ? 'font-bold' : 'text-slate-400 hover:text-indigo-950'}`} style={{ color: priceRange === opt ? BRAND_PURPLE : undefined }}>{opt}</button>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={showBestSellers} onChange={(e) => setShowBestSellers(e.target.checked)} className="hidden" />
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${showBestSellers ? 'bg-purple-400 border-purple-400' : 'border-slate-200 group-hover:border-purple-200'}`} style={{ backgroundColor: showBestSellers ? BRAND_PURPLE : undefined }}>
                        {showBestSellers && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-950">Shop Best Sellers</span>
                </label>
            </div>
        </div>

        <div className="flex-grow">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {list.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    addToCart={addToCart}
                    isAdding={addingId === product.id}
                />
                ))}
            </div>
            {list.length === 0 && (
                <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
                <p className="text-slate-400 italic">No shades found matching these filters.</p>
                <button onClick={() => { setCategory('All'); setPriceRange('All'); setShowBestSellers(false); }} className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-indigo-950 pb-1">Reset Filters</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, updateQuantity, removeFromCart, onCheckout }: CartPageProps) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 60 ? 0 : 7.50;

  return (
    <div className="pt-32 pb-32 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-16">Shopping Bag</h1>
      {cart.length === 0 ? (
        <div className="text-center py-40">
          <ShoppingBag size={60} className="mx-auto text-slate-200 mb-8" />
          <h2 className="text-2xl font-serif font-bold mb-4">Your bag is empty.</h2>
          <p className="text-slate-400 mb-8">Ready to find your perfect shine?</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-8 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="w-28 h-28 rounded-3xl overflow-hidden bg-slate-100">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-indigo-950 dark:text-white text-lg">{item.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 rounded-full px-4 py-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400"><Minus size={12} /></button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400"><Plus size={12} /></button>
                    </div>
                    <p className="font-bold text-indigo-950 dark:text-purple-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 sticky top-32">
              <h2 className="text-xl font-bold mb-8">Summary</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-2xl text-indigo-950 dark:text-white">
                  <span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span>
                </div>
              </div>
              <button onClick={onCheckout} className="w-full text-white py-6 rounded-full font-bold shadow-2xl hover:bg-slate-800 transition-all text-xs tracking-widest uppercase" style={{ backgroundColor: BRAND_PURPLE }}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactPage = () => (
  <div className="pt-32 pb-32 px-4 max-w-5xl mx-auto">
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 md:p-20 border border-purple-50 dark:border-slate-800">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-6">Concierge</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Need shade matching? Our beauty advisors are available 24/7.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-10">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-purple-50 dark:bg-slate-800 rounded-3xl text-indigo-950"><MessageCircle size={28} /></div>
            <div>
              <h3 className="font-bold text-indigo-950 dark:text-white text-lg">Text With Us</h3>
              <p className="text-slate-500 text-sm mt-1">+1 (800) MAYGLOSS</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="p-4 bg-purple-50 dark:bg-slate-800 rounded-3xl text-indigo-950"><Instagram size={28} /></div>
            <div>
              <h3 className="font-bold text-indigo-950 dark:text-white text-lg">Direct Message</h3>
              <p className="text-slate-500 text-sm mt-1">@MayGlossLuxe</p>
            </div>
          </div>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Name" className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-purple-200" />
          <input type="email" placeholder="Email" className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-purple-200" />
          <textarea rows={4} placeholder="Your Message" className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-purple-200" />
          <button className="w-full text-white font-bold py-6 rounded-full shadow-2xl hover:bg-slate-800 transition-all text-xs tracking-widest uppercase" style={{ backgroundColor: BRAND_PURPLE }}>Send Enquiry</button>
        </form>
      </div>
    </div>
  </div>
);

const CheckoutPage = ({ cart, onBack, onComplete }: CheckoutPageProps) => {
  const [method, setMethod] = useState<'transfer' | 'whatsapp'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal > 60 ? subtotal : subtotal + 7.50;
  const whatsappUrl = `https://wa.me/234000000000?text=${encodeURIComponent(`New Order from MayGloss:\nItems: ${cart.map((i) => `${i.name} (x${i.quantity})`).join(', ')}\nTotal: $${total.toFixed(2)}`)}`;

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        onComplete();
    }, 1500);
  };

  return (
    <div className="pt-32 pb-32 px-4 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 mb-12 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-950 transition-colors"><ArrowLeft size={14} /> Back to Bag</button>
      <div className="grid md:grid-cols-2 gap-20">
        <div className="space-y-10">
          <h1 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white">Secure Payment</h1>
          <div className="space-y-4">
            <button onClick={() => setMethod('transfer')} className={`w-full p-6 rounded-3xl border text-left flex justify-between items-center transition-all ${method === 'transfer' ? 'border-indigo-950 bg-slate-50 ring-4 ring-indigo-950/5' : 'border-slate-100'}`}>
              <span className="font-bold">Bank Transfer</span>
              <CreditCard size={20} />
            </button>
            <button onClick={() => setMethod('whatsapp')} className={`w-full p-6 rounded-3xl border text-left flex justify-between items-center transition-all ${method === 'whatsapp' ? 'border-green-600 bg-green-50/30' : 'border-slate-100'}`}>
              <span className="font-bold text-green-700">WhatsApp Checkout</span>
              <MessageCircle size={20} className="text-green-600" />
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {method === 'transfer' ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="transfer" className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                <h3 className="font-bold text-lg mb-6">Payment Instructions</h3>
                <div className="space-y-4 text-sm">
                  <p className="flex justify-between"><span>Bank:</span> <span className="font-bold">MAYGLOSS GLOBAL LUXE</span></p>
                  <p className="flex justify-between"><span>Account:</span> <span className="font-bold">0123456789</span></p>
                  <p className="flex justify-between"><span>Beneficiary:</span> <span className="font-bold">MayGloss Cosmetics Ltd</span></p>
                </div>
                <button 
                    onClick={handleComplete} 
                    className="w-full bg-indigo-950 text-white py-5 rounded-full font-bold mt-10 text-[10px] tracking-widest uppercase flex items-center justify-center gap-3"
                >
                    {isProcessing ? <LoadingSpinner size={16} /> : "Confirm & Send Proof"}
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="whatsapp" className="p-10 bg-green-50 rounded-[2.5rem] border border-green-100 shadow-xl">
                <h3 className="font-bold text-green-800 text-lg mb-4">Direct Concierge</h3>
                <p className="text-green-700 text-sm mb-8 leading-relaxed">Place your order directly via WhatsApp. Our team will handle tracking personally.</p>
                <button onClick={() => window.open(whatsappUrl, '_blank')} className="w-full bg-green-600 text-white py-5 rounded-full font-bold text-[10px] tracking-widest uppercase">Start Chat Checkout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[3rem] h-fit">
          <h2 className="text-xl font-bold mb-8">Order Summary</h2>
          <div className="space-y-6 mb-8">
            {cart.map((i) => (
              <div key={i.id} className="flex gap-4 items-center">
                <img src={i.image} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-grow">
                  <p className="text-sm font-bold">{i.name}</p>
                  <p className="text-xs text-slate-400">Qty: {i.quantity}</p>
                </div>
                <span className="font-bold text-indigo-950 dark:text-purple-400">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-xl text-indigo-950 dark:text-white">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <footer className="bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6 border-t border-slate-100 dark:border-slate-900">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm" style={{ backgroundColor: BRAND_PURPLE }}>
                MG
             </div>
             <h2 className="text-2xl font-serif font-bold text-indigo-950 dark:text-white">MayGloss</h2>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Botanical hydration and mirror-like shine for every skin tone. Your natural beauty, amplified.</p>
        <div className="flex gap-6">
          <Instagram size={20} className="text-slate-400 hover:text-indigo-950 cursor-pointer transition-colors" />
          <Twitter size={20} className="text-slate-400 hover:text-indigo-950 cursor-pointer transition-colors" />
          <MessageCircle size={20} className="text-slate-400 hover:text-indigo-950 cursor-pointer transition-colors" />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Discover</h3>
        <ul className="space-y-4 text-sm text-slate-500">
          <li onClick={() => onNavigate('products')} className="hover:text-indigo-950 cursor-pointer transition-colors">The Collection</li>
          <li onClick={() => onNavigate('lookbook')} className="hover:text-indigo-950 cursor-pointer transition-colors">Muse Gallery</li>
          <li onClick={() => onNavigate('story')} className="hover:text-indigo-950 cursor-pointer transition-colors">Our Mission</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Service</h3>
        <ul className="space-y-4 text-sm text-slate-500">
          <li className="hover:text-indigo-950 cursor-pointer transition-colors">Shipping</li>
          <li className="hover:text-indigo-950 cursor-pointer transition-colors">Returns</li>
          <li className="hover:text-indigo-950 cursor-pointer transition-colors">Privacy</li>
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Journal</h3>
        <p className="text-sm text-slate-500 mb-6">Join our list for 10% off your first order.</p>
        <div className="flex border-b border-slate-200 pb-2">
          <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-sm flex-grow" />
          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-950">Join</button>
        </div>
      </div>
    </div>
    <div className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">
      © {new Date().getFullYear()} MayGloss Cosmetics. Kissable Lips, Everyday.
    </div>
  </footer>
);

// --- Root Component ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

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
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setAddingToCartId(product.id);
    
    // Simulate network delay for better UX (loading state visibility)
    setTimeout(() => {
      setCart(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        return [...prev, { ...product, quantity: 1 }];
      });
      setAddingToCartId(null);
      addNotification(`${product.name} added to bag!`, 'success');
    }, 600);
  }, [addNotification]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id: string) => {
    const item = cart.find(i => i.id === id);
    setCart(prev => prev.filter(i => i.id !== id));
    if(item) addNotification(`Removed ${item.name} from bag.`, 'info');
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const renderContent = () => {
    switch (currentPath) {
      case 'home': return <HomePage onNavigate={setCurrentPath} addToCart={addToCart} addingId={addingToCartId} />;
      case 'products': return <ProductsPage addToCart={addToCart} searchQuery={searchQuery} addingId={addingToCartId} />;
      case 'lookbook': return <LookbookPage />;
      case 'story': return <StoryPage />;
      case 'contact': return <ContactPage />;
      case 'cart': return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onCheckout={() => setCurrentPath('checkout')} />;
      case 'checkout': return <CheckoutPage cart={cart} onBack={() => setCurrentPath('cart')} onComplete={() => { setCart([]); setCurrentPath('home'); addNotification('Order placed successfully!', 'success'); }} />;
      default: return <HomePage onNavigate={setCurrentPath} addToCart={addToCart} addingId={addingToCartId} />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <Navbar 
        cartCount={cartCount} 
        onNavigate={setCurrentPath} 
        currentPath={currentPath} 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="min-h-screen pt-20">
        {renderContent()}
      </main>
      <Footer onNavigate={setCurrentPath} />
      
      <ScrollToTop />
      
      <NotificationToast notifications={notifications} remove={removeNotification} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
