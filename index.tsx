
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
  Sparkle, 
  Globe, 
  Award, 
  FlaskConical,
  Bot,
  Share2,
  Copy,
  Facebook
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

const SYSTEM_INSTRUCTION = "You are a luxury beauty consultant for MayGloss. Your expertise is STRICTLY LIMITED to MayGloss products and the brand itself. You must ONLY answer questions about MayGloss products (Amethyst Glow, Dusty Rose Matte, Icy Plumper, Berry Nectar Oil, Twilight Sparkle, Champagne Satin), their ingredients, application rituals, and company story. If a user asks about anything unrelated to MayGloss, general knowledge, other brands, or off-topic subjects, you must politely decline and guide them back to our lip care collection. Stay elegant, helpful, and maintain a high-end brand voice.";

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

// --- AI Chat Logic ---

const ChatInterface = ({ messages, setMessages, loading, setLoading, input, setInput, isRecording, setIsRecording }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', parts: text };
    setMessages((prev: any) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.parts }] })),
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      setMessages((prev: any) => [...prev, { role: 'model', parts: response.text || "I couldn't generate a response." }]);
    } catch (e) {
      setMessages((prev: any) => [...prev, { role: 'model', parts: "I'm having a connection issue with the lab. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported.");
    const rec = new SpeechRecognition();
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); sendMessage(e.results[0][0].transcript); };
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-6 pr-2 space-y-4">
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-950 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm'}`}>
              <p className="text-sm leading-relaxed">{m.parts}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><LoadingSpinner size={14} text="Consulting..." /></div>}
        <div ref={scrollRef} />
      </div>
      <div className="flex gap-3 items-center bg-stone-50 dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
        <input 
          value={input} onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask about shades or ingredients..." 
          className="flex-grow bg-transparent px-4 py-2 outline-none text-sm"
        />
        <button onClick={startVoice} className={`p-2.5 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
          <Mic size={18} />
        </button>
        <button onClick={() => sendMessage(input)} className="p-2.5 bg-indigo-950 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Navbar Component ---

const Navbar = ({ cartCount, onNavigate, currentPath, darkMode, toggleDarkMode, searchQuery, setSearchQuery }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMobileShopOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-purple-50 dark:border-slate-900 h-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
        
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="lg:hidden p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-950 dark:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <div onClick={() => handleNav('home')} className="flex items-center gap-2 cursor-pointer group">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl transition-transform group-hover:rotate-12" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
             <h1 className="hidden sm:block text-2xl font-serif font-bold text-indigo-950 dark:text-purple-300">MayGloss</h1>
          </div>
        </div>

        {/* Center: Desktop Links & Search */}
        <div className="flex-grow flex items-center justify-center gap-10">
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => handleNav('home')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'home' ? 'text-indigo-950 border-b-2' : ''}`} style={{ borderBottomColor: currentPath === 'home' ? BRAND_PURPLE : 'transparent' }}>Home</button>
            <div 
              className="relative h-20 flex items-center cursor-pointer group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={`flex items-center gap-1 hover:text-indigo-950 ${currentPath === 'products' ? 'text-indigo-950' : ''}`}>
                Shop <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {/* Dropdown Bridge */}
              <div className="absolute top-full left-0 w-full h-4" />
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full -left-10 w-64 pt-2"
                  >
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
                      <div className="flex flex-col gap-1">
                        {['Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                          <button key={c} onClick={() => handleNav('products')} className="w-full text-left p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center justify-between group/item">
                            {c} Collection <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => handleNav('lookbook')} className="hover:text-indigo-950 transition-colors">Lookbook</button>
          </div>

          {/* Persistent Search Bar */}
          <div className="hidden md:flex flex-grow max-w-sm relative group ml-4">
             <input 
                type="text"
                placeholder="Find your radiance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(currentPath !== 'products') onNavigate('products'); }}
                className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:border-purple-200 dark:focus:border-purple-900/50 rounded-full py-2.5 pl-5 pr-12 text-xs outline-none focus:ring-4 ring-purple-100 dark:ring-purple-900/10 transition-all"
             />
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={16} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={toggleDarkMode} className="p-2.5 text-slate-400 hover:text-indigo-950 dark:hover:text-white transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => handleNav('cart')} className="relative p-2.5 bg-indigo-950 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-400 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 shadow-lg">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
                  <span className="font-serif font-bold text-xl text-indigo-950 dark:text-white">MayGloss</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={26} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-grow p-8 flex flex-col gap-8 overflow-y-auto">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => { if(currentPath !== 'products') onNavigate('products'); }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm outline-none"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </div>

                <div className="flex flex-col gap-6">
                  <button onClick={() => handleNav('home')} className="text-4xl font-serif font-bold text-left hover:text-purple-400 transition-colors">Home</button>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                      className="text-4xl font-serif font-bold text-left flex items-center justify-between w-full hover:text-purple-400 transition-colors"
                    >
                      Shop <ChevronDown size={28} className={`transition-transform ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isMobileShopOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-5 pl-6 border-l-2 border-purple-100 dark:border-purple-900/50 overflow-hidden">
                          {['All', 'Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                            <button key={c} onClick={() => handleNav('products')} className="text-left text-xl font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-indigo-950 dark:hover:text-white">{c} Collection</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={() => handleNav('lookbook')} className="text-4xl font-serif font-bold text-left hover:text-purple-400 transition-colors">Lookbook</button>
                  <button onClick={() => handleNav('consultant')} className="text-4xl font-serif font-bold text-purple-400 text-left flex items-center gap-4">AI Expert <Sparkle size={32} /></button>
                  <button onClick={() => handleNav('cart')} className="text-4xl font-serif font-bold text-left hover:text-purple-400 transition-colors">My Bag</button>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                 <div className="flex gap-6">
                    <Instagram size={22} className="text-slate-400" />
                    <Twitter size={22} className="text-slate-400" />
                    <Facebook size={22} className="text-slate-400" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">v2.1 Lab Edition</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- ProductCard Component ---

const ProductCard = ({ product, addToCart, isAdding, onViewDetails }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    onClick={() => onViewDetails(product)} 
    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[3rem] p-4 transition-all hover:shadow-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
  >
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 aspect-[4/5] mb-6 shadow-inner">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <button 
        onClick={(e) => { e.stopPropagation(); if(!isAdding) addToCart(product, 1); }} 
        className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl flex items-center justify-center gap-3 z-20" 
        style={{ color: BRAND_PURPLE }}
      >
        {isAdding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />}
        {isAdding ? "Adding..." : `Quick Add — $${product.price.toFixed(2)}`}
      </button>
    </div>
    <div className="px-4 pb-4 text-center">
      <h3 className="text-xl font-bold text-indigo-950 dark:text-white mb-2 group-hover:text-purple-400 transition-colors">{product.name}</h3>
      <div className="flex justify-between items-center max-w-[200px] mx-auto opacity-70">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.category}</span>
        <span className="text-sm font-bold" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</span>
      </div>
    </div>
  </motion.div>
);

// --- ProductDetailPage Component ---

const ProductDetailPage = ({ product, addToCart, addingId, onNavigate, onNotify }: any) => {
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleShare = async () => {
    const shareData = {
      title: `MayGloss | ${product.name}`,
      text: `Indulge in botanical radiance with ${product.name} from MayGloss. Pure hydration, mirror-like shine.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        onNotify("Link copied to clipboard!");
      } catch (err) { onNotify("Unable to copy link."); }
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto relative">
      <button onClick={() => onNavigate('products')} className="absolute top-24 left-6 p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl hover:scale-110 transition-transform z-10 group">
        <ArrowLeft size={24} className="text-indigo-950 dark:text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-12">
        <div className="flex flex-col gap-6">
          <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-white dark:border-slate-800">
            <motion.img key={activeImg} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} src={activeImg} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button key={i} onClick={() => setActiveImg(img)} className={`w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? 'border-purple-400 scale-95 shadow-lg' : 'border-transparent opacity-60'}`} style={{ borderColor: activeImg === img ? BRAND_PURPLE : 'transparent' }}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] block text-purple-400">Botanical Alchemy / {product.category}</span>
            <button onClick={handleShare} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-indigo-950 dark:text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2 group">
              <Share2 size={18} className="group-hover:text-purple-400 transition-colors" />
              <span className="text-[10px] uppercase font-bold tracking-widest pr-1">Share</span>
            </button>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-6 mb-8">
            <p className="text-3xl font-bold" style={{ color: BRAND_PURPLE }}>${product.price.toFixed(2)}</p>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <StarRating rating={5} />
          </div>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 italic font-serif">"{product.description}"</p>
          
          <div className="space-y-8 mb-12">
            <div className="flex items-center gap-8">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-950 dark:text-slate-200">Quantity</span>
              <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 rounded-full px-8 py-4 shadow-inner">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-purple-400 transition-colors"><Minus size={18} /></button>
                <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-purple-400 transition-colors"><Plus size={18} /></button>
              </div>
            </div>
            <button 
              onClick={() => addToCart(product, quantity)} 
              className="w-full text-white py-6 rounded-full font-bold shadow-2xl transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 disabled:opacity-50" 
              style={{ backgroundColor: BRAND_PURPLE }}
              disabled={addingId === product.id}
            >
              {addingId === product.id ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} />}
              {addingId === product.id ? "Adding to Bag..." : "Add to Shopping Bag"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
             <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Zap size={14} style={{ color: BRAND_PURPLE }} /> Ingredients</h4>
                <p className="text-slate-500 leading-relaxed">{product.ingredients.join(', ')}</p>
             </div>
             <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-black uppercase tracking-widest mb-3 flex items-center gap-2"><FlaskConical size={14} style={{ color: BRAND_PURPLE }} /> Ritual</h4>
                <p className="text-slate-500 leading-relaxed">{product.ritual}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HomePage Component ---

const HomePage = ({ onNavigate, addToCart, addingId }: any) => {
  const bestSellers = PRODUCTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-90 dark:opacity-40" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-950 dark:text-purple-400 mb-6 block">Botanical High-Shine Lab</span>
            <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-8 leading-tight">Beyond <br/>The Gloss</h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light mb-12 leading-relaxed">Experience a serum-infused ritual that transforms your lips into mirror-like reflections of nature's purity.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button onClick={() => onNavigate('products')} className="px-12 py-6 bg-indigo-950 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all">Shop The Palette</button>
              <button onClick={() => onNavigate('consultant')} className="px-12 py-6 bg-white dark:bg-slate-900 text-indigo-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"><Bot size={18} /> AI Consultant</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-50 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Leaf size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">100% Vegan</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Droplets size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hyaluronic Acid</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Derm Tested</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Sparkles size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mirror Finish</span>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-4 block">Seasonal Edit</span>
          <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Most Loved Edits</h2>
          <p className="mt-4 text-slate-500">The essential shades chosen by our community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {bestSellers.map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingId === p.id} onViewDetails={(prod: any) => onNavigate(`product-${prod.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
};

// --- App Root Component ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // AI State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: "Welcome to MayGloss. I'm your beauty concierge. How can I help you find your radiance today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
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

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderContent = () => {
    if (isNavigating) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-400" size={40} /></div>;

    if (currentPath.startsWith('product-')) {
      const id = currentPath.split('-')[1];
      const p = PRODUCTS.find(prod => prod.id === id);
      return p ? <ProductDetailPage product={p} addToCart={addToCart} addingId={addingToCartId} onNavigate={navigateTo} onNotify={addNotification} /> : null;
    }

    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
      case 'products': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">The Palette</h1>
            <p className="text-slate-500 font-light text-xl">Discover our complete collection of botanical high-shines.</p>
          </motion.div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingToCartId === p.id} onViewDetails={(prod: any) => navigateTo(`product-${prod.id}`)} />)}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 font-light">
              <Sparkles className="mx-auto mb-6 opacity-20" size={48} />
              No shades match your search criteria.
            </div>
          )}
        </div>
      );
      case 'consultant': return (
        <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto h-[80vh] flex flex-col">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Beauty Concierge</h1>
            <p className="text-slate-400 mt-2 uppercase tracking-[0.3em] text-[10px] font-black">Personalized Shade Mastery</p>
          </div>
          <div className="flex-grow bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 overflow-hidden">
            <ChatInterface 
              messages={messages} setMessages={setMessages} 
              loading={loading} setLoading={setLoading} 
              input={input} setInput={setInput} 
              isRecording={isRecording} setIsRecording={setIsRecording} 
            />
          </div>
        </div>
      );
      case 'cart': return (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12">Shopping Bag</h1>
          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-50 dark:border-slate-800">
              <ShoppingBag className="mx-auto mb-8 text-slate-200" size={80} />
              <p className="text-slate-400 text-xl font-light mb-10">Your bag is currently echoing silence...</p>
              <button onClick={() => navigateTo('products')} className="px-10 py-4 bg-indigo-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">Discover Shades</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map(item => (
                <div key={item.id} className="flex gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-lg">
                  <img src={item.image} className="w-24 h-24 rounded-3xl object-cover shadow-inner" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-bold text-2xl">{item.name}</h3>
                    <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">{item.category} / {item.quantity} units</p>
                    <p className="text-indigo-950 dark:text-purple-400 font-bold mt-2 text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors"><Trash2 size={24} /></button>
                </div>
              ))}
              <div className="p-12 bg-indigo-950 text-white rounded-[4rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="text-center md:text-left">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Estimated Total</span>
                    <h3 className="text-5xl font-serif font-bold">${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</h3>
                 </div>
                 <button className="bg-white text-indigo-950 px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition-all shadow-xl">Secure Checkout</button>
              </div>
            </div>
          )}
        </div>
      );
      case 'lookbook': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-serif font-bold">The Muse Gallery</h1>
            <p className="text-slate-400 mt-4 text-xl">Inspiration from our radiant community.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="relative group overflow-hidden rounded-[3rem] shadow-xl">
                 <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Muse" />
                 <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      );
      default: return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 transition-colors duration-500">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onNavigate={navigateTo} 
        currentPath={currentPath} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
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
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Botanical hydration and mirror-like shine for every skin tone. Your natural beauty, amplified through conscious science.</p>
            <div className="flex gap-6">
               <Instagram size={22} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
               <Twitter size={22} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
               <Facebook size={22} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-purple-400">The Collection</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('home')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Home</li>
              <li onClick={() => navigateTo('products')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">The Palette</li>
              <li onClick={() => navigateTo('lookbook')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Lookbook</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-purple-400">Support</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('faq')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Help FAQ</li>
              <li onClick={() => navigateTo('shipping')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Shipping</li>
              <li onClick={() => navigateTo('returns')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Returns</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-purple-400">Legals</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Terms of Ritual</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">© {new Date().getFullYear()} MayGloss Beauty. All Radiant Rights Reserved.</div>
      </footer>

      <NotificationToast notifications={notifications} remove={id => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
