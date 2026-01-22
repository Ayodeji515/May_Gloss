
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
  Facebook,
  Wallet,
  Building2,
  Lock,
  Target,
  Users,
  Eye,
  Microscope,
  Sprout,
  HeartHandshake
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
const WHATSAPP_NUMBER = "+2348123456789"; 
const BANK_DETAILS_NG = [
  { bankName: "GTBank", accountName: "MayGloss Beauty LTD", accountNumber: "0123456789" },
  { bankName: "Kuda Microfinance Bank", accountName: "MayGloss Beauty LTD", accountNumber: "2039485761" },
  { bankName: "OPay (MFB)", accountName: "MayGloss Beauty LTD", accountNumber: "8123456789" }
];

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
      // Fix: Follow guidelines for initialization and usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMsg].map(m => ({ 
          role: m.role, 
          parts: [{ text: m.parts }] 
        })),
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      // Fix: Correct usage of response.text as a property
      setMessages((prev: any) => [...prev, { role: 'model', parts: response.text || "I'm sorry, I couldn't process that request right now." }]);
    } catch (e) {
      console.error(e);
      setMessages((prev: any) => [...prev, { role: 'model', parts: "Consultation currently offline. Please check your network." }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported.");
    const rec = new SpeechRecognition();
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e: any) => { 
      const transcript = e.results[0][0].transcript;
      setInput(transcript); 
      sendMessage(transcript); 
    };
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
          placeholder="Ask our AI expert..." 
          className="flex-grow bg-transparent px-4 py-2 outline-none text-sm dark:text-white"
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

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMobileShopOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[120] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-purple-50 dark:border-slate-900 h-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
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
              <div className="absolute top-full left-0 w-full h-4" />
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full -left-10 w-64 pt-2">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6">
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
            <button onClick={() => handleNav('story')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'story' ? 'text-indigo-950 border-b-2' : ''}`} style={{ borderBottomColor: currentPath === 'story' ? BRAND_PURPLE : 'transparent' }}>Story</button>
            <button onClick={() => handleNav('about')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'about' ? 'text-indigo-950 border-b-2' : ''}`} style={{ borderBottomColor: currentPath === 'about' ? BRAND_PURPLE : 'transparent' }}>About</button>
            <button onClick={() => handleNav('consultant')} className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-full hover:scale-105 transition-all"><Sparkle size={14} /> AI Expert</button>
          </div>

          <div className="hidden md:flex flex-grow max-w-sm relative group ml-4">
             <input type="text" placeholder="Find your radiance..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { if(currentPath !== 'products') onNavigate('products'); }} className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:border-purple-200 dark:focus:border-purple-900/50 rounded-full py-2.5 pl-5 pr-12 text-xs outline-none focus:ring-4 ring-purple-100 dark:ring-purple-900/10 transition-all dark:text-white" />
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={16} />
          </div>
        </div>

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

      {/* Mobile Sidebar - 100% Height */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md" />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
                  <span className="font-serif font-bold text-2xl text-indigo-950 dark:text-white">MayGloss</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 rounded-full bg-slate-100 dark:bg-slate-900 hover:scale-110 transition-transform">
                  <X size={28} className="text-slate-500" />
                </button>
              </div>

              <div className="flex-grow p-10 flex flex-col gap-10 overflow-y-auto">
                <div className="flex flex-col gap-8">
                  <button onClick={() => handleNav('home')} className="text-5xl font-serif font-bold text-left hover:text-purple-400 transition-colors dark:text-white">Home</button>
                  <div className="space-y-6">
                    <button onClick={() => setIsMobileShopOpen(!isMobileShopOpen)} className="text-5xl font-serif font-bold text-left flex items-center justify-between w-full hover:text-purple-400 transition-colors dark:text-white">
                      Shop <ChevronDown size={32} className={`transition-transform ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isMobileShopOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-6 pl-6 border-l-4 border-purple-200 dark:border-purple-900/50 overflow-hidden">
                          {['All', 'Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                            <button key={c} onClick={() => handleNav('products')} className="text-left text-2xl font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-indigo-950 dark:hover:text-white transition-colors">{c} Collection</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={() => handleNav('story')} className="text-5xl font-serif font-bold text-left hover:text-purple-400 transition-colors dark:text-white">Our Story</button>
                  <button onClick={() => handleNav('about')} className="text-5xl font-serif font-bold text-left hover:text-purple-400 transition-colors dark:text-white">About Us</button>
                  <button onClick={() => handleNav('lookbook')} className="text-5xl font-serif font-bold text-left hover:text-purple-400 transition-colors dark:text-white">Lookbook</button>
                  <button onClick={() => handleNav('consultant')} className="text-5xl font-serif font-bold text-purple-400 text-left flex items-center gap-4 transition-transform hover:translate-x-2">AI Expert <Sparkle size={32} /></button>
                </div>
              </div>

              <div className="p-10 bg-stone-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                 <div className="flex gap-8">
                    <Instagram size={28} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                    <Twitter size={28} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                    <Facebook size={28} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                 </div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Radiance v2.1</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- HomePage ---

const HomePage = ({ onNavigate, addToCart, addingId }: any) => {
  const bestSellers = PRODUCTS.slice(0, 3);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1596462502278-27bf87f6f164?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-90 dark:opacity-40" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-950 dark:text-purple-400 mb-6 block">Botanical High-Shine Lab</span>
            <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-8 leading-tight">Beyond <br/>The Gloss</h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-light mb-12 leading-relaxed">Experience a serum-infused ritual that transforms your lips into mirror-like reflections of nature's purity.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button onClick={() => onNavigate('products')} className="px-12 py-6 bg-indigo-950 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all">Shop The Palette</button>
              <button onClick={() => onNavigate('about')} className="px-12 py-6 bg-white dark:bg-slate-900 text-indigo-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Explore The Vision</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-50 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
            <Leaf size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">100% Vegan</span>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
            <Droplets size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hyaluronic Acid</span>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
            <ShieldCheck size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Derm Tested</span>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
            <Sparkles size={24} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mirror Finish</span>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-stone-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-24">
          <div className="flex-1 space-y-10">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white leading-tight">Radical <br/>Transparency</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">We believe beauty shouldn't be a mystery. From our cold-pressed seed oils to our sustainable packaging, every decision is made with the health of your lips and our planet at the core.</p>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs text-purple-400">Cold Pressed</h4>
                  <p className="text-sm text-slate-400 italic">Retaining maximum nutrients for deeper cellular repair.</p>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black uppercase tracking-widest text-xs text-purple-400">Lab Proven</h4>
                  <p className="text-sm text-slate-400 italic">Every formula is tested for 24-hour hydration stability.</p>
               </div>
            </div>
            <button onClick={() => onNavigate('story')} className="text-xs font-black uppercase tracking-[0.3em] text-indigo-950 dark:text-white border-b-2 border-purple-400 pb-2 hover:opacity-70 transition-opacity">Read Our Lab Story</button>
          </div>
          <div className="flex-1 relative">
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Lab Work" />
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center p-8 text-center text-[10px] font-black uppercase tracking-widest text-purple-600 shadow-xl border border-white dark:border-slate-800">
                Crafted in Small Batches
             </div>
          </div>
        </div>
      </section>

      {/* Ingredient Deep-Dive */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-4 block">The Alchemy</span>
          <h2 className="text-5xl md:text-6xl font-serif font-bold dark:text-white">Botanical Intelligence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
           <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-stone-100 dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                 <Microscope size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold dark:text-white">Molecular Shine</h3>
              <p className="text-slate-400 font-light leading-relaxed">Our 'Luminous Bond' technology reflects light at the molecular level, creating a 3D mirror finish without the use of sticky polymers.</p>
           </div>
           <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-stone-100 dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                 <Sprout size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold dark:text-white">Phyto-Serums</h3>
              <p className="text-slate-400 font-light leading-relaxed">Infused with Vitis Vinifera and Raspberry Seed oils, our glosses function as a high-potency serum that heals while it beautifies.</p>
           </div>
           <div className="text-center space-y-6 group">
              <div className="w-20 h-20 bg-stone-100 dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                 <Target size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold dark:text-white">Precision Tint</h3>
              <p className="text-slate-400 font-light leading-relaxed">Micro-encapsulated pigments react to your lip's natural pH, delivering a custom radiance that is uniquely yours.</p>
           </div>
        </div>
      </section>

      {/* Ritual CTA */}
      <section className="py-32 bg-indigo-950 text-white mx-6 rounded-[5rem] overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-10 grayscale" />
         <div className="relative z-10 max-w-4xl mx-auto text-center px-8">
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 leading-tight">Elevate Your <br/>Daily Ritual</h2>
            <p className="text-xl text-slate-400 font-light mb-12 max-w-2xl mx-auto">Join the MayGloss community and receive personalized beauty consultations, early access to new shades, and the secrets of botanical radiance.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 px-8 py-5 rounded-full text-white outline-none focus:ring-2 ring-purple-400 min-w-[300px]" />
               <button className="bg-white text-indigo-950 px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition-all">Subscribe</button>
            </div>
         </div>
      </section>
    </div>
  );
};

// --- About Page ---

const AboutPage = () => {
  return (
    <div className="pt-40 pb-32">
       <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
             <h1 className="text-7xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-8">Our Vision</h1>
             <p className="text-2xl text-slate-500 dark:text-slate-400 font-light max-w-3xl mx-auto">Democratizing luxury radiance through botanical science and uncompromising ethical standards.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-40">
             <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-50 dark:border-slate-800 space-y-8">
                <Target size={40} className="text-purple-400" />
                <h3 className="text-3xl font-serif font-bold dark:text-white">Our Mission</h3>
                <p className="text-slate-500 leading-relaxed font-light">To bridge the gap between high-fashion aesthetics and clean botanical skincare, proving that elegance never requires compromise.</p>
             </div>
             <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-50 dark:border-slate-800 space-y-8">
                <Eye size={40} className="text-purple-400" />
                <h3 className="text-3xl font-serif font-bold dark:text-white">Our Values</h3>
                <p className="text-slate-500 leading-relaxed font-light">Transparency, Purity, and Empowerment. We believe in beauty that feels as good as it looks, backed by radical honesty.</p>
             </div>
             <div className="p-12 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-50 dark:border-slate-800 space-y-8">
                <HeartHandshake size={40} className="text-purple-400" />
                <h3 className="text-3xl font-serif font-bold dark:text-white">Our Impact</h3>
                <p className="text-slate-500 leading-relaxed font-light">100% Carbon Neutral shipping and 100% recyclable components. We aren't just here for your lips; we're here for the world.</p>
             </div>
          </div>

          <div className="space-y-24">
             <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-4 block">The Hands Behind MayGloss</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold dark:text-white">Our Foundational Team</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { name: "Dr. Elara Vance", role: "Chief Botanical Chemist", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
                  { name: "Marcus Thorne", role: "Creative Director", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
                  { name: "Sienna Bloom", role: "Sustainability Lead", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
                  { name: "Julian Rossi", role: "Global Concierge", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" }
                ].map((member, i) => (
                  <div key={i} className="group cursor-pointer">
                     <div className="aspect-[3/4] rounded-[3rem] overflow-hidden mb-6 relative">
                        <img src={member.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={member.name} />
                        <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h4 className="text-2xl font-serif font-bold dark:text-white">{member.name}</h4>
                     <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{member.role}</p>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Our Story Page ---

const StoryPage = () => {
  return (
    <div className="pt-40 pb-32">
       <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
             <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 block">The MayGloss Genesis</span>
                <h1 className="text-7xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white leading-tight">Born in a <br/>Botanical <br/>Observatory</h1>
             </div>
             
             <p className="text-3xl font-serif italic text-indigo-900 dark:text-purple-200 leading-relaxed border-l-4 border-purple-200 pl-8">"I was tired of glosses that felt like plastic. I wanted something that felt like a secret whispered from a garden." — Dr. Elara Vance, Founder</p>

             <div className="space-y-12 text-xl text-slate-500 dark:text-slate-400 font-light leading-loose">
                <p>The MayGloss story began in 2021, not in a corporate high-rise, but in a damp, light-filled botanical conservatory in the heart of London. Our founder, Dr. Elara Vance, was a botanical chemist with a radical idea: lipgloss could—and should—be a therapeutic serum first, and a cosmetic second.</p>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                   <img src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800" className="rounded-[4rem] shadow-2xl" alt="Process" />
                   <p>She spent eighteen months experimenting with cold-pressed seed oils, rejecting over 400 formulas until she hit upon the 'Luminous Bond'—a molecular structure that mimics the natural lipids of the lips while providing a non-sticky, mirror-like finish.</p>
                </div>
                <p>Today, MayGloss remains true to that initial discovery. We still manufacture in small batches to ensure formula stability. We still source our Vitis Vinifera directly from family-owned vineyards. And we still believe that every swipe of our gloss is a small, quiet act of self-care and botanical reverence.</p>
             </div>

             <div className="p-16 bg-stone-100 dark:bg-slate-900 rounded-[5rem] text-center space-y-10">
                <h3 className="text-4xl font-serif font-bold dark:text-white">The Botanical Promise</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">0%</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synthetic Wax</p>
                   </div>
                   <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">100%</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vegan Formula</p>
                   </div>
                   <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">400+</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tested Formulas</p>
                   </div>
                   <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">∞</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pure Radiance</p>
                   </div>
                </div>
             </div>
          </motion.div>
       </div>
    </div>
  );
};

// --- Missing Components Implementation ---

// Fix: Implement ProductCard component
const ProductCard = ({ product, addToCart, isAdding, onViewDetails }: { product: Product, addToCart: (p: Product) => void, isAdding: boolean, onViewDetails: (p: Product) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
  >
    <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      <div className="absolute top-6 left-6 flex flex-col gap-2">
         {product.isBestSeller && <span className="bg-purple-400 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Best Seller</span>}
         <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-indigo-950 dark:text-purple-300 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">{product.category}</span>
      </div>
      <button onClick={() => onViewDetails(product)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="bg-white dark:bg-slate-800 text-indigo-950 dark:text-white p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform">
            <Maximize2 size={24} />
         </div>
      </button>
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-serif font-bold text-indigo-950 dark:text-white group-hover:text-purple-400 transition-colors">{product.name}</h3>
        <span className="text-xl font-bold text-indigo-950 dark:text-purple-300">${product.price.toFixed(2)}</span>
      </div>
      <p className="text-slate-400 text-sm font-light mb-8 line-clamp-2">{product.description}</p>
      <button 
        onClick={() => addToCart(product)}
        disabled={isAdding}
        className="w-full bg-indigo-950 text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
      >
        {isAdding ? <Loader2 className="animate-spin" size={16} /> : <ShoppingBag size={16} />} 
        {isAdding ? 'Adding...' : 'Add to Bag'}
      </button>
    </div>
  </motion.div>
);

// Fix: Implement ProductDetailPage component
const ProductDetailPage = ({ product, addToCart, addingId, onNavigate }: any) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
      <button onClick={() => onNavigate('products')} className="mb-12 flex items-center gap-2 text-slate-400 hover:text-indigo-950 dark:hover:text-white transition-colors group uppercase text-[10px] font-black tracking-widest">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Palette
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-6">
          <div className="aspect-square rounded-[4rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-2xl">
            <img src={selectedImage} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button key={i} onClick={() => setSelectedImage(img)} className={`w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all shrink-0 ${selectedImage === img ? 'border-purple-400 scale-95' : 'border-transparent opacity-60'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <span className="text-purple-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{product.category} Collection</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">{product.name}</h1>
            <p className="text-3xl font-bold text-indigo-950 dark:text-purple-300 mb-8">${product.price.toFixed(2)}</p>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 border-y border-slate-100 dark:border-slate-800 py-12">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-950 dark:text-white">
                <FlaskConical size={14} className="text-purple-400" /> Ingredients
              </h4>
              <ul className="space-y-2">
                {product.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-300" /> {ing}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-950 dark:text-white">
                <Sparkles size={14} className="text-purple-400" /> Ritual
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed italic">{product.ritual}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900 px-8 py-5 rounded-full border border-slate-100 dark:border-slate-800">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-slate-400 hover:text-purple-400"><Minus size={18} /></button>
              <span className="font-bold text-xl w-6 text-center text-indigo-950 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-slate-400 hover:text-purple-400"><Plus size={18} /></button>
            </div>
            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={addingId === product.id}
              className="flex-grow bg-indigo-950 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
            >
              {addingId === product.id ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />} 
              {addingId === product.id ? 'Adding to Bag...' : 'Add to Shopping Bag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Implement OrderSuccess component
const OrderSuccess = ({ method, orderId }: { method: string, orderId: number }) => (
  <div className="pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[80vh]">
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-10 max-w-2xl">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-500 mb-8">
         <CheckCircle2 size={48} />
      </div>
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white">Radiance Confirmed</h1>
      <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">Your order <span className="font-bold text-purple-500">#MG-{orderId}</span> has been received by our botanical lab. Prepare for your transformation.</p>
      
      {method === 'bank' && (
        <div className="bg-stone-50 dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-left space-y-6">
          <div className="flex items-center gap-3 text-purple-400">
             <Building2 size={24} />
             <h3 className="font-black uppercase tracking-widest text-xs">Nigeria Bank Transfer Details</h3>
          </div>
          <div className="space-y-4">
             {BANK_DETAILS_NG.map((bank, i) => (
               <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{bank.bankName}</p>
                     <p className="font-bold text-indigo-950 dark:text-white">{bank.accountNumber}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(bank.accountNumber); alert("Account number copied!"); }} className="p-3 text-purple-400 hover:bg-purple-50 rounded-full transition-colors">
                     <Copy size={16} />
                  </button>
               </div>
             ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
         <button onClick={() => window.location.href = '/'} className="px-12 py-5 bg-indigo-950 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition-all shadow-2xl">Back to Gallery</button>
         <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`)} className="px-12 py-5 bg-white dark:bg-slate-900 text-indigo-950 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <MessageCircle size={16} /> Chat Concierge
         </button>
      </div>
    </motion.div>
  </div>
);

// --- Main App Root ---

const App = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderMethod, setOrderMethod] = useState<'stripe' | 'bank' | 'whatsapp'>('stripe');
  const [orderId, setOrderId] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Fix: Chat state for persistence across renders
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatRecording, setIsChatRecording] = useState(false);

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
    setTimeout(() => { setCurrentPath(path); setIsNavigating(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
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

  const handleCheckout = (method: 'stripe' | 'bank' | 'whatsapp') => {
    setOrderMethod(method);
    setOrderId(Math.floor(100000 + Math.random() * 900000));
    setIsCheckingOut(true);

    if (method === 'whatsapp') {
      const itemsText = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');
      const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
      window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hello MayGloss! I want to order: ${itemsText}. Total: $${total.toFixed(2)}.`);
      setIsCheckingOut(false);
      return;
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      navigateTo('success');
      setCart([]);
    }, 2000);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const renderContent = () => {
    if (isNavigating) return <div className="h-screen flex items-center justify-center"><LoadingSpinner text="Refining your glow..." /></div>;
    if (currentPath.startsWith('product-')) {
      const id = currentPath.split('-')[1];
      const p = PRODUCTS.find(prod => prod.id === id);
      return p ? <ProductDetailPage product={p} addToCart={addToCart} addingId={addingToCartId} onNavigate={navigateTo} onNotify={addNotification} /> : null;
    }
    switch (currentPath) {
      case 'home': return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
      case 'about': return <AboutPage />;
      case 'story': return <StoryPage />;
      case 'products': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">The Palette</h1>
            <p className="text-slate-500 dark:text-slate-400 font-light text-xl">Discover our complete collection of botanical high-shines.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingToCartId === p.id} onViewDetails={(prod: any) => navigateTo(`product-${prod.id}`)} />)}
          </div>
        </div>
      );
      case 'consultant': return (
        <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto h-[80vh] flex flex-col">
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-serif font-bold dark:text-white">Beauty Concierge</h1>
            <p className="text-slate-400 mt-2 uppercase tracking-[0.3em] text-[10px] font-black">Personalized Shade Mastery</p>
          </div>
          <div className="flex-grow bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 overflow-hidden">
             {/* Fix: Use persistent chat state */}
             <ChatInterface 
               messages={chatMessages} 
               setMessages={setChatMessages} 
               loading={isChatLoading} 
               setLoading={setIsChatLoading} 
               input={chatInput} 
               setInput={setChatInput} 
               isRecording={isChatRecording} 
               setIsRecording={setIsChatRecording} 
             />
          </div>
        </div>
      );
      case 'cart': return (
        <div className="pt-40 pb-32 px-6 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-16 text-center dark:text-white">Shopping Bag</h1>
          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[4rem] shadow-sm border border-slate-50 dark:border-slate-800">
              <ShoppingBag className="mx-auto mb-8 text-slate-100 dark:text-slate-800" size={100} />
              <p className="text-slate-400 text-2xl font-light mb-10">Echoes of silence fill your bag...</p>
              <button onClick={() => navigateTo('products')} className="px-12 py-5 bg-indigo-950 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-110 transition-transform shadow-2xl">Start Your Collection</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 space-y-8">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-xl">
                    <img src={item.image} className="w-24 h-24 rounded-3xl object-cover shadow-inner" alt={item.name} />
                    <div className="flex-grow">
                      <h3 className="font-bold text-2xl text-indigo-950 dark:text-white">{item.name}</h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">{item.category} Collection</p>
                      <div className="flex items-center gap-4 mt-3">
                         <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
                            <button onClick={() => { if(item.quantity > 1) setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)); }} className="text-slate-400 hover:text-purple-400"><Minus size={14} /></button>
                            <span className="font-bold text-sm w-4 text-center dark:text-white">{item.quantity}</span>
                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))} className="text-slate-400 hover:text-purple-400"><Plus size={14} /></button>
                         </div>
                         <p className="text-indigo-950 dark:text-purple-400 font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors"><Trash2 size={24} /></button>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-950 text-white p-12 rounded-[4rem] shadow-2xl space-y-10 sticky top-32">
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-serif">Total Radiance</span>
                    <span className="text-4xl font-bold font-serif">${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => handleCheckout('stripe')} disabled={isCheckingOut} className="w-full bg-white text-indigo-950 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                    {isCheckingOut && orderMethod === 'stripe' ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />} Proceed via Stripe
                  </button>
                  <button onClick={() => handleCheckout('bank')} disabled={isCheckingOut} className="w-full bg-purple-500 text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                    {isCheckingOut && orderMethod === 'bank' ? <Loader2 className="animate-spin" size={20} /> : <Building2 size={20} />} Bank Transfer (Nigeria)
                  </button>
                  <button onClick={() => handleCheckout('whatsapp')} className="w-full bg-green-500 text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <MessageCircle size={20} /> Order via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'success': return <OrderSuccess method={orderMethod} orderId={orderId} />;
      default: return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-purple-200 bg-white dark:bg-slate-950 transition-colors">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={navigateTo} currentPath={currentPath} darkMode={darkMode} toggleDarkMode={toggleDarkMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-purple-400">Company</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('about')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">About Us</li>
              <li onClick={() => navigateTo('story')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Our Story</li>
              <li className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Foundational Team</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-purple-400">Concierge</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>Help FAQ</li>
              <li>Shipping Ritual</li>
              <li>Radiance Returns</li>
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
