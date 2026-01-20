
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
  Mic,
  MicOff,
  Send,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

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

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

// --- BRAND CONSTANTS ---
const BRAND_PURPLE = "#C187FF";
const WHATSAPP_NUMBER = "+2348000000000"; 
const BANK_DETAILS = {
  accountName: "MayGloss Beauty LTD",
  accountNumber: "1023948576",
  bankName: "Zenith Radiant Bank"
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
  },
  {
    id: '5',
    name: 'Twilight Sparkle',
    price: 19.00,
    category: 'Shine',
    description: 'Multi-dimensional glitter suspended in a clear base. Captures the moonlight on your lips.',
    ingredients: ['Plant-based Glitter', 'Castor Seed Oil', 'Organic Wax'],
    ritual: 'Apply as a topper for extra drama or alone for a starry night aesthetic.',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '6',
    name: 'Champagne Satin',
    price: 21.00,
    category: 'Shine',
    description: 'A warm gold shimmer that feels like a sunset on your lips.',
    ingredients: ['Almond Oil', 'Mica', 'Vitamin C'],
    ritual: 'The perfect glow for golden hour selfies.',
    image: 'https://images.unsplash.com/photo-1631214499558-c8cc25624941?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1631214499558-c8cc25624941?auto=format&fit=crop&q=80&w=800'
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

// --- AI Consultant Component ---

const AIConsultant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: "Hello, I'm your MayGloss Beauty Consultant. How can I help you find your perfect radiance today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', parts: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.parts }] })),
        config: {
          systemInstruction: "You are a luxury beauty consultant for MayGloss. You are elegant, helpful, and an expert in lip hydration and aesthetics. You recommend MayGloss products (Amethyst Glow, Dusty Rose Matte, Icy Plumper, Berry Nectar Oil, Twilight Sparkle, Champagne Satin) based on user needs. Keep responses concise and high-end."
        }
      });
      setMessages(prev => [...prev, { role: 'model', parts: response.text || "I'm sorry, I couldn't process that. Try again?" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', parts: "Our beauty server is currently resting. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600"><Sparkle size={32} /></div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white">AI Beauty Guide</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Personalized Recommendations</p>
        </div>
      </div>

      <div className="flex-grow bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 p-8 overflow-y-auto mb-6">
        <div className="flex flex-col gap-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-6 py-4 rounded-3xl ${m.role === 'user' ? 'bg-indigo-950 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-950 dark:text-slate-200'}`}>
                <p className="text-sm leading-relaxed">{m.parts}</p>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><LoadingSpinner size={16} text="Consulting our experts..." /></div>}
          <div ref={scrollRef} />
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-full border border-slate-100 dark:border-slate-800 shadow-lg">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about shades, ingredients, or rituals..." 
          className="flex-grow bg-transparent px-4 py-2 outline-none text-sm"
        />
        <button onClick={startVoice} className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}>
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button onClick={() => sendMessage(input)} className="p-3 bg-indigo-950 text-white rounded-full hover:scale-110 transition-transform">
          <Send size={20} />
        </button>
      </div>
    </div>
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
          <button onClick={() => handleNav('home')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'home' ? 'text-indigo-950 border-b-2' : ''}`} style={{ borderBottomColor: currentPath === 'home' ? BRAND_PURPLE : 'transparent' }}>Home</button>
          <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className={`flex items-center gap-1 hover:text-indigo-950 transition-colors ${currentPath === 'products' ? 'text-indigo-950' : ''}`}>
              Shop <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 p-4 overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {['All', 'Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                      <button key={c} onClick={() => handleNav('products')} className="text-left hover:text-indigo-950 dark:hover:text-purple-300 transition-colors text-[10px] uppercase font-bold tracking-widest">{c} Collection</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => handleNav('lookbook')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'lookbook' ? 'text-indigo-950' : ''}`}>Muse</button>
          <button onClick={() => handleNav('consultant')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-600 transition-all hover:scale-105 ${currentPath === 'consultant' ? 'ring-2 ring-purple-300' : ''}`}><Sparkle size={14} /> AI Guide</button>
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
            {['home', 'products', 'lookbook', 'consultant', 'story', 'faq', 'cart'].map(p => (
              <button key={p} onClick={() => handleNav(p)} className="text-4xl font-serif font-bold text-indigo-950 dark:text-white capitalize text-left">{p === 'consultant' ? 'AI Guide' : p}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Page Content & Pages ---

const HomePage = ({ onNavigate, addToCart, addingId }: any) => {
  return (
    <div className="bg-stone-50 dark:bg-slate-950">
      <section className="py-48 md:py-64 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 border border-purple-100" style={{ color: BRAND_PURPLE }}>Botanical Radiance Alchemy</span>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-[0.85]">Pure <br/><span className="italic font-normal">Luminance.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">Experience high-shine, non-sticky lipcare infused with cold-pressed botanical oils. Designed for lasting hydration and a mirror-like glow.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('products')} className="w-full sm:w-auto text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-2xl" style={{ backgroundColor: BRAND_PURPLE }}>Shop Collection</button>
            <button onClick={() => onNavigate('consultant')} className="w-full sm:w-auto bg-indigo-950 text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2"><Sparkle size={16} /> Consult AI</button>
          </div>
        </motion.div>
      </section>

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

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Community Praise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800">
                <StarRating rating={r.rating} />
                <p className="my-6 italic text-slate-600 dark:text-slate-400 leading-relaxed font-serif">"{r.text}"</p>
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
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl">
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
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-indigo-950 dark:text-white mb-6 leading-tight">{product.name}</h1>
          <p className="text-2xl font-bold mb-8" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</p>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 italic">"{product.description}"</p>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-center gap-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-950 dark:text-slate-200">Quantity</span>
              <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 rounded-full px-6 py-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-purple-400"><Minus size={16} /></button>
                <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-purple-400"><Plus size={16} /></button>
              </div>
            </div>
            <button onClick={() => addToCart(product, quantity)} className="w-full text-white py-6 rounded-[2rem] font-bold shadow-2xl transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4" style={{ backgroundColor: BRAND_PURPLE }}>
              {addingId === product.id ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} />}
              {addingId === product.id ? "Processing..." : "Add to Bag"}
            </button>
          </div>

          <div className="p-8 bg-stone-100 dark:bg-slate-900 rounded-3xl">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4">The Ritual</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{product.ritual}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Static Content Components ---

const LegalPage = ({ title, content }: any) => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-16">{title}</h1>
    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-8 text-lg">
      {content}
    </div>
  </div>
);

const StoryContent = () => (
  <div className="space-y-12">
    <p className="text-2xl font-serif italic text-indigo-900 dark:text-purple-200">"We don't just create gloss; we engineer radiance."</p>
    <p>MayGloss was founded on a singular obsession: mirror-like shine without the compromise of comfort. Our journey began in a botanical conservatory, where we discovered that cold-pressed seed oils could replicate the cushiony feel of synthetic polymers without the toxicity.</p>
    <img src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=1200" className="w-full rounded-[3rem] shadow-2xl" alt="Lab Alchemy" />
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-xl font-bold mb-4">Conscious Science</h3>
        <p>Every batch is dermatologically tested and pH-balanced to your lips. We believe beauty should be as healthy as it is captivating.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">The Luminous Bond</h3>
        <p>Our proprietary Luminous Bond™ technology binds hyaluronic spheres to your natural lip texture for 8 hours of weightless hydration.</p>
      </div>
    </div>
  </div>
);

const FAQContent = () => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "What makes MayGloss different from drugstore brands?", a: "Most drugstore glosses use petroleum-based jellies. We use 100% botanical seed oils and micro-hyaluronic spheres for a luxury, serum-like feel." },
    { q: "Are the plumping effects painful?", a: "Not at all. Our Icy Plumper uses cooling peppermint and botanical peptides to stimulate blood flow gently, avoiding the stinging associated with ginger or capsicum based products." },
    { q: "Is the packaging eco-friendly?", a: "Yes. Our tubes are made from 30% PCR (post-consumer recycled) plastic and our secondary boxes are FSC-certified compostable paper." },
    { q: "Can I use the glosses as toppers?", a: "Absolutely. Our 'Shine' and 'Tint' formulas are designed to layer beautifully over lipsticks or liners without disturbing the base pigment." }
  ];
  return (
    <div className="space-y-6">
      {faqs.map((f, i) => (
        <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6">
          <button onClick={() => setOpen(i)} className="w-full text-left flex justify-between items-center group">
            <span className="font-bold text-xl group-hover:text-purple-400 transition-colors">{f.q}</span>
            <ChevronDown className={`transition-transform duration-300 ${open === i ? 'rotate-180 text-purple-400' : ''}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="mt-4 text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const OrderSuccess = ({ method, orderId }: any) => (
  <div className="pt-48 pb-32 px-6 max-w-2xl mx-auto text-center">
    <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-10 text-green-500">
      <CheckCircle2 size={48} />
    </div>
    <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white mb-6">Radiance is En Route!</h1>
    <p className="text-slate-500 mb-12">Your order <span className="font-bold text-indigo-950 dark:text-white">#{orderId}</span> is being prepared with care.</p>
    
    {method === 'bank' && (
      <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] text-left mb-12 border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-950 dark:text-white"><Banknote size={20} /> Payment Concierge</h3>
        <p className="text-sm text-slate-500 mb-6">Complete your order by transferring to our secure account:</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2"><span>Bank:</span> <span className="font-bold">{BANK_DETAILS.bankName}</span></div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2"><span>Account:</span> <span className="font-bold">{BANK_DETAILS.accountName}</span></div>
          <div className="flex justify-between pb-2"><span>Number:</span> <span className="font-bold text-lg tracking-widest">{BANK_DETAILS.accountNumber}</span></div>
        </div>
      </div>
    )}

    <div className="flex flex-col gap-4">
      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hi MayGloss! My Order ID is #${orderId}. I've just made a ${method === 'bank' ? 'bank transfer' : 'direct order'}.`)} className="bg-green-500 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-green-600 transition-all">
        <MessageCircle size={20} /> Confirm on WhatsApp
      </button>
      <button onClick={() => window.location.reload()} className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-indigo-950 transition-colors">Return to Home</button>
    </div>
  </div>
);

// --- Root Component ---

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
    if (isNavigating) return <div className="h-screen flex items-center justify-center"><LoadingSpinner text="Refining your glow..." /></div>;
    
    if (currentPath.startsWith('product-')) {
      const id = currentPath.split('-')[1];
      const p = PRODUCTS.find(prod => prod.id === id);
      return p ? <ProductDetailPage product={p} addToCart={addToCart} addingId={addingToCartId} onNavigate={navigateTo} /> : null;
    }

    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
      case 'products': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-center mb-16">The Full Palette</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-white font-black tracking-widest text-[10px] uppercase mb-2">Signature Look</span>
                    <h3 className="text-white font-serif text-2xl mb-4">{p.name}</h3>
                    <button className="bg-white text-indigo-950 px-6 py-2 rounded-full font-bold text-[10px] uppercase">Shop Look</button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      );
      case 'consultant': return <AIConsultant />;
      case 'story': return <LegalPage title="Our Radiant Story" content={<StoryContent />} />;
      case 'faq': return <LegalPage title="Beauty Enquiries" content={<FAQContent />} />;
      case 'cart': return (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12">Shopping Bag</h1>
          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm">
              <ShoppingBag className="mx-auto mb-6 text-slate-200" size={64} />
              <p className="text-slate-400">Your bag is currently empty.</p>
              <button onClick={() => navigateTo('products')} className="mt-8 font-bold text-xs uppercase tracking-widest border-b-2" style={{ color: BRAND_PURPLE, borderBottomColor: BRAND_PURPLE }}>Discover Shades</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map(item => (
                <div key={item.id} className="flex gap-6 items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800">
                  <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-slate-400 text-sm">{item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
              <div className="p-12 bg-indigo-950 text-white rounded-[3.5rem] shadow-2xl space-y-10">
                <div className="flex justify-between items-center text-3xl font-serif">
                  <span>Bag Total</span>
                  <span className="font-bold">${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => placeOrder('bank')} className="bg-white text-indigo-950 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                    <Banknote size={16} /> Pay via Bank Transfer
                  </button>
                  <button onClick={() => placeOrder('whatsapp')} className="bg-green-500 text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                    <MessageCircle size={16} /> Order via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'shipping': return <LegalPage title="Shipping Concierge" content={<p>All MayGloss orders are handled with botanical care. We ship globally from our labs in London and California. Orders over $60 qualify for complimentary priority shipping. Standard domestic transit is 3-5 days. International orders typically arrive in 7-14 business days. Track your radiance through our secure portal.</p>} />;
      case 'returns': return <LegalPage title="Glow Guarantee" content={<p>We stand by our alchemy. If you are not 100% radiant after using MayGloss, we offer simple 30-day returns on all products. Items must be in their original botanical packaging. For hygiene reasons, opened products must demonstrate a genuine fault for a full refund. Shades can be exchanged for free within 14 days of receipt.</p>} />;
      case 'privacy': return <LegalPage title="Privacy Promise" content={<p>Your data is handled with the same integrity as our formulas. We never sell your personal information. We use bank-grade encryption for all secure payments and our servers are 100% carbon-neutral. We only store data necessary to refine your experience.</p>} />;
      case 'terms': return <LegalPage title="Ritual Terms" content={<p>By using the MayGloss site, you agree to our terms of service. Our products are for cosmetic use only. We reserve the right to refuse orders that appear to be for resale without prior agreement. Prices are listed in USD and are subject to change without notice based on botanical ingredient fluctuations.</p>} />;
      case 'policy': return <LegalPage title="Safety Policy" content={<p>MayGloss is 100% Vegan and Cruelty-Free. Our labs are regularly inspected for ethical compliance. While our formulas are hypoallergenic, we always recommend a patch test behind the ear before full application, as some botanical extracts (like peppermint or berry oils) can be potent.</p>} />;
      case 'contact': return <LegalPage title="Let's Connect" content={<p>Need a personal shade match? Our concierge is available daily. Email: concierge@maygloss.com | WhatsApp: {WHATSAPP_NUMBER} | Instagram: @MayGlossBeauty. Typical response time is under 4 hours.</p>} />;
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
            <div className="flex gap-4">
               <Instagram size={18} className="text-slate-400 hover:text-purple-400 cursor-pointer" />
               <Twitter size={18} className="text-slate-400 hover:text-purple-400 cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Discover</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('home')} className="hover:text-indigo-950 cursor-pointer transition-colors">Home</li>
              <li onClick={() => navigateTo('products')} className="hover:text-indigo-950 cursor-pointer transition-colors">The Palette</li>
              <li onClick={() => navigateTo('lookbook')} className="hover:text-indigo-950 cursor-pointer transition-colors">Muse Gallery</li>
              <li onClick={() => navigateTo('consultant')} className="hover:text-indigo-950 cursor-pointer transition-colors">AI Guide</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Concierge</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('faq')} className="hover:text-indigo-950 cursor-pointer transition-colors">Help FAQ</li>
              <li onClick={() => navigateTo('shipping')} className="hover:text-indigo-950 cursor-pointer transition-colors">Shipping Care</li>
              <li onClick={() => navigateTo('returns')} className="hover:text-indigo-950 cursor-pointer transition-colors">Returns & Refunds</li>
              <li onClick={() => navigateTo('contact')} className="hover:text-indigo-950 cursor-pointer transition-colors">Direct Enquiry</li>
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
