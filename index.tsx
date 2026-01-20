
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
  Bot
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
      'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?auto=format&fit=crop&get=80&w=800',
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
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scroll} className="fixed bottom-24 right-8 z-[150] p-4 rounded-full bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 text-indigo-950 dark:text-purple-400">
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- AI Components ---

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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.parts }] })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });
      setMessages((prev: any) => [...prev, { role: 'model', parts: response.text || "I'm sorry, I couldn't process that. Try again?" }]);
    } catch (e) {
      setMessages((prev: any) => [...prev, { role: 'model', parts: "I'm having a little trouble connecting to my beauty lab. Please try again in a moment." }]);
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-6 pr-2 scrollbar-hide space-y-6">
        {messages.map((m: any, i: number) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-3xl ${m.role === 'user' ? 'bg-indigo-950 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-indigo-950 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700'}`}>
              <p className="text-sm leading-relaxed">{m.parts}</p>
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><LoadingSpinner size={14} text="Consulting..." /></div>}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-3 items-center bg-white dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 ring-purple-100 transition-all">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type your radiance question..." 
          className="flex-grow bg-transparent px-4 py-2 outline-none text-sm placeholder:text-slate-400"
        />
        <button onClick={startVoice} className={`p-2.5 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400'}`}>
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button onClick={() => sendMessage(input)} className="p-2.5 bg-indigo-950 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-md">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Page & Widget AI Components ---

const AIConsultant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: "Welcome to the full consultation experience. I'm your MayGloss Beauty Expert. How can I refine your look today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto flex flex-col h-[85vh]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-3xl text-purple-600 shadow-sm"><Sparkle size={40} /></div>
        <div>
          <h1 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Beauty Concierge</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Personalized Shade Mastery</p>
        </div>
      </motion.div>

      <div className="flex-grow bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 flex flex-col overflow-hidden">
        <ChatInterface 
          messages={messages} 
          setMessages={setMessages} 
          loading={loading} 
          setLoading={setLoading} 
          input={input} 
          setInput={setInput} 
          isRecording={isRecording} 
          setIsRecording={setIsRecording} 
        />
      </div>
    </div>
  );
};

const GlobalChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: "Hi! Need a quick shade match or ingredient info? I'm here to help." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><Bot size={20} /></div>
                <div>
                  <h3 className="font-bold text-sm">MayGloss AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-grow p-6 bg-stone-50/50 dark:bg-slate-900/50 overflow-hidden">
              <ChatInterface 
                messages={messages} 
                setMessages={setMessages} 
                loading={loading} 
                setLoading={setLoading} 
                input={input} 
                setInput={setInput} 
                isRecording={isRecording} 
                setIsRecording={setIsRecording} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-5 rounded-full shadow-2xl text-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative group" 
        style={{ backgroundColor: BRAND_PURPLE }}
      >
        <div className="absolute inset-0 rounded-full bg-purple-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

// --- Product Card: Enhanced for full-card clickability ---

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
             <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl transition-transform group-hover:scale-110" style={{ backgroundColor: BRAND_PURPLE }}>MG</div>
             <h1 className="text-xl md:text-2xl font-serif font-bold text-indigo-950 dark:text-purple-300">MayGloss</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <button onClick={() => handleNav('home')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'home' ? 'text-indigo-950 border-b-2' : ''}`} style={{ borderBottomColor: currentPath === 'home' ? BRAND_PURPLE : 'transparent' }}>Home</button>
          <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className={`flex items-center gap-1 hover:text-indigo-950 transition-colors ${currentPath === 'products' ? 'text-indigo-950' : ''}`}>
              Shop <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 p-4 overflow-hidden z-[130]"
                >
                  <div className="flex flex-col gap-4">
                    {['All', 'Shine', 'Matte', 'Plumper', 'Tint'].map(c => (
                      <button key={c} onClick={() => handleNav('products')} className="text-left hover:text-indigo-950 dark:hover:text-purple-300 transition-colors text-[10px] uppercase font-bold tracking-widest p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">{c} Collection</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => handleNav('lookbook')} className={`hover:text-indigo-950 transition-colors ${currentPath === 'lookbook' ? 'text-indigo-950' : ''}`}>Muse</button>
          <button onClick={() => handleNav('consultant')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 transition-all hover:scale-105 ${currentPath === 'consultant' ? 'ring-2 ring-purple-300' : ''}`}><Sparkle size={14} /> AI Guide</button>
          <button onClick={() => handleNav('story')} className="hover:text-indigo-950 transition-colors">Story</button>
          <button onClick={() => handleNav('faq')} className="hover:text-indigo-950 transition-colors">FAQ</button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:text-indigo-950 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => handleNav('cart')} className="relative p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-indigo-950 hover:text-white transition-all shadow-sm">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg" style={{ backgroundColor: BRAND_PURPLE }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 25 }} 
            className="fixed inset-0 z-[115] bg-stone-50 dark:bg-slate-950 pt-24 px-6 lg:hidden flex flex-col gap-8 overflow-y-auto"
          >
            {['home', 'products', 'lookbook', 'consultant', 'story', 'faq', 'cart'].map(p => (
              <button key={p} onClick={() => handleNav(p)} className="text-4xl font-serif font-bold text-indigo-950 dark:text-white capitalize text-left hover:text-purple-400 transition-colors">{p === 'consultant' ? 'AI Guide' : p}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HomePage = ({ onNavigate, addToCart, addingId }: any) => {
  return (
    <div className="bg-stone-50 dark:bg-slate-950">
      <section className="py-48 md:py-64 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 border border-purple-100 shadow-sm" style={{ color: BRAND_PURPLE }}>Botanical Radiance Alchemy</span>
          <h1 className="text-6xl md:text-9xl font-serif font-bold text-indigo-950 dark:text-white mb-10 leading-[0.85]">Pure <br/><span className="italic font-normal">Luminance.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">Experience high-shine, non-sticky lipcare infused with cold-pressed botanical oils. Designed for lasting hydration and a mirror-like glow.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('products')} className="w-full sm:w-auto text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-2xl hover:scale-105 active:scale-95" style={{ backgroundColor: BRAND_PURPLE }}>Shop Collection</button>
            <button onClick={() => onNavigate('consultant')} className="w-full sm:w-auto bg-indigo-950 text-white px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"><Sparkle size={16} /> Consult AI</button>
          </div>
        </motion.div>
      </section>

      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-4 block">Seasonal Edit</span>
          <h2 className="text-4xl font-serif font-bold text-indigo-950 dark:text-white mb-4">Our Signature Selection</h2>
          <p className="text-slate-500 max-w-md mx-auto">Discover the shades that captured the hearts of our community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PRODUCTS.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingId === p.id} onViewDetails={(prod: any) => onNavigate(`product-${prod.id}`)} />
          ))}
        </div>
      </section>

      <section className="py-32 bg-indigo-950 text-white rounded-[4rem] mx-4 mb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-20 text-center">
          <div className="group">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-400 transition-colors">
                <Leaf size={32} />
             </div>
             <h3 className="text-2xl font-serif font-bold mb-4">100% Botanical</h3>
             <p className="text-slate-400 text-sm leading-relaxed">No synthetic fillers. We use cold-pressed berry, grape, and almond oils to nourish your delicate lip skin naturally.</p>
          </div>
          <div className="group">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-400 transition-colors">
                <Globe size={32} />
             </div>
             <h3 className="text-2xl font-serif font-bold mb-4">Planet Focused</h3>
             <p className="text-slate-400 text-sm leading-relaxed">From FSC-certified paper to high-recycled glass bottles, our packaging is as conscious as our formulas.</p>
          </div>
          <div className="group">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-400 transition-colors">
                <Award size={32} />
             </div>
             <h3 className="text-2xl font-serif font-bold mb-4">Ethically Certified</h3>
             <p className="text-slate-400 text-sm leading-relaxed">Proudly cruelty-free and vegan since inception. We never test on animals, nor do we source from suppliers who do.</p>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl font-serif font-bold text-indigo-950 dark:text-white">Community Praise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-800 transition-transform hover:-translate-y-2">
                <StarRating rating={r.rating} />
                <p className="my-6 italic text-slate-600 dark:text-slate-400 leading-relaxed font-serif">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} className="w-10 h-10 rounded-full object-cover shadow-md" alt={r.name} />
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

const ProductDetailPage = ({ product, addToCart, addingId, onNavigate }: any) => {
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto relative">
      <button 
        onClick={() => onNavigate('products')} 
        className="absolute top-24 left-6 p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl hover:scale-110 transition-transform z-10 group"
      >
        <X size={24} className="text-indigo-950 dark:text-white group-hover:rotate-90 transition-transform" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mt-12">
        <div className="flex flex-col gap-6">
          <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-white dark:border-slate-800">
            <motion.img key={activeImg} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} src={activeImg} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {product.images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(img)} 
                className={`w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? 'border-purple-400 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                style={{ borderColor: activeImg === img ? BRAND_PURPLE : 'transparent' }}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: BRAND_PURPLE }}>Botanical Alchemy / {product.category}</span>
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

          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-stone-100 dark:bg-slate-900 rounded-[2.5rem] border border-stone-200 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Zap size={14} style={{ color: BRAND_PURPLE }} /> The Ingredients</h4>
                <ul className="text-[10px] text-slate-500 space-y-1">
                   {product.ingredients.slice(0, 4).map(ing => <li key={ing}>{ing}</li>)}
                </ul>
             </div>
             <div className="p-6 bg-stone-100 dark:bg-slate-900 rounded-[2.5rem] border border-stone-200 dark:border-slate-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2"><FlaskConical size={14} style={{ color: BRAND_PURPLE }} /> The Ritual</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{product.ritual.slice(0, 80)}...</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Static Content Components ---

const LegalPage = ({ title, content }: any) => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-16">{title}</motion.h1>
    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-12 text-lg font-light">
      {content}
    </div>
  </div>
);

const StoryContent = () => (
  <div className="space-y-16">
    <p className="text-3xl md:text-4xl font-serif italic text-indigo-900 dark:text-purple-200 leading-snug">"We don't just create gloss; we engineer a new standard of radiance that honors your skin and the planet."</p>
    
    <div className="flex flex-col md:flex-row gap-12 items-center">
       <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-bold text-indigo-950 dark:text-white">Our Humble Beginnings</h3>
          <p>MayGloss was founded in 2024 by a group of botanical chemists who were tired of the sticky, synthetic standard. We believed that luxury should feel like a serum, not like glue. Our journey began in a small botanical conservatory in London, experimenting with hundreds of cold-pressed seed oils to find the perfect 'Luminous Bond'.</p>
       </div>
       <div className="flex-1">
          <img src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=800" className="w-full rounded-[3rem] shadow-2xl" alt="Lab Alchemy" />
       </div>
    </div>

    <div className="bg-slate-100 dark:bg-slate-900 p-12 rounded-[3.5rem] space-y-8">
       <h3 className="text-3xl font-serif font-bold text-center">The Botanical Standard</h3>
       <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2"><Sparkles size={20} className="text-purple-400" /> Conscious Science</h4>
            <p className="text-sm">Every batch is dermatologically tested, pH-balanced, and stabilized using natural antioxidants. We replace harsh synthetic preservatives with rosemary and Vitamin E extracts.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2"><Droplets size={20} className="text-purple-400" /> Deep Hydration</h4>
            <p className="text-sm">Our proprietary Hyaluron-Bond™ technology binds moisture-locking spheres to your natural lip texture, ensuring the shine lasts as long as the hydration.</p>
          </div>
       </div>
    </div>

    <p>Today, MayGloss is more than a beauty brand. It's a testament to the power of nature combined with rigorous aesthetic standards. We remain 100% vegan, cruelty-free, and fiercely committed to making the world a more radiant place—one swipe at a time.</p>
  </div>
);

const FAQContent = () => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "What makes MayGloss different from drugstore brands?", a: "Most mass-market glosses use petroleum-based jellies and synthetic polymers. MayGloss uses high-refractive index botanical seed oils (like Raspberry and Grape seed) and micro-hyaluronic spheres. This creates a serum-like luxury feel that nourishes your lips over time rather than just sitting on top of them." },
    { q: "Are the plumping effects painful?", a: "Not at all. Our Icy Plumper uses cooling peppermint extracts and advanced botanical peptides to stimulate blood flow gently. We have completely removed ginger, capsicum, and other irritants associated with the 'stinging' sensation of traditional plumpers." },
    { q: "Is the packaging truly eco-friendly?", a: "Yes. Our tubes are made from 30% Post-Consumer Recycled (PCR) plastic, and our secondary outer packaging is FSC-certified compostable paper printed with soy-based inks. We are actively working toward 100% biodegradable components by 2026." },
    { q: "How long does a single application last?", a: "Our 'Shine' and 'Tint' formulas typically provide 4-6 hours of consistent high-gloss shine. Even after the shine fades, the botanical oils continue to provide hydration for up to 8 hours." },
    { q: "Are your products safe for sensitive skin?", a: "Absolutely. All MayGloss formulas are dermatologist-tested and hypoallergenic. However, because we use potent botanical extracts, we always suggest a small patch test behind the ear if you have a known history of plant allergies." }
  ];
  return (
    <div className="space-y-8">
      {faqs.map((f, i) => (
        <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-8">
          <button onClick={() => setOpen(i)} className="w-full text-left flex justify-between items-center group">
            <span className="font-bold text-2xl group-hover:text-purple-400 transition-colors leading-tight">{f.q}</span>
            <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform duration-300 ${open === i ? 'rotate-180 bg-purple-100 dark:bg-purple-900/30' : ''}`}>
               <ChevronDown className={open === i ? 'text-purple-600' : ''} />
            </div>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="mt-6 text-slate-500 leading-relaxed font-light text-xl bg-stone-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-stone-100 dark:border-slate-800">{f.a}</p>
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
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-10 text-green-500">
      <CheckCircle2 size={48} />
    </motion.div>
    <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">Radiance is En Route!</h1>
    <p className="text-slate-500 mb-12 text-xl font-light">Your order <span className="font-bold text-indigo-950 dark:text-white">#{orderId}</span> is being prepared with artisanal care.</p>
    
    {method === 'bank' && (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] text-left mb-12 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-indigo-950 dark:text-white"><Banknote size={24} style={{ color: BRAND_PURPLE }} /> Payment Concierge</h3>
        <p className="text-sm text-slate-500 mb-8 font-light">To finalize your order, please transfer the total amount to our secure bank account. Your order will be activated immediately upon confirmation.</p>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-3"><span>Bank Institution:</span> <span className="font-bold">{BANK_DETAILS.bankName}</span></div>
          <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-3"><span>Account Holder:</span> <span className="font-bold">{BANK_DETAILS.accountName}</span></div>
          <div className="flex justify-between pb-3"><span>Account Number:</span> <span className="font-bold text-2xl tracking-[0.2em]" style={{ color: BRAND_PURPLE }}>{BANK_DETAILS.accountNumber}</span></div>
        </div>
      </motion.div>
    )}

    <div className="flex flex-col gap-6">
      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hi MayGloss! My Order ID is #${orderId}. I've just made a ${method === 'bank' ? 'bank transfer' : 'direct order'}. Please confirm my radiance.`)} className="bg-green-500 text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-green-600 transition-all hover:scale-105 active:scale-95">
        <MessageCircle size={24} /> Confirm via WhatsApp
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">The Palette</h1>
            <p className="text-slate-500 font-light text-xl">Discover our complete collection of botanical high-shines.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} isAdding={addingToCartId === p.id} onViewDetails={(prod: any) => navigateTo(`product-${prod.id}`)} />)}
          </div>
        </div>
      );
      case 'lookbook': return (
        <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-indigo-950 dark:text-white mb-6">The Muse Gallery</h1>
            <p className="text-slate-500 font-light text-xl">Inspiration from our radiant community across the globe.</p>
          </motion.div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
             {PRODUCTS.concat(PRODUCTS).map((p, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="group relative overflow-hidden rounded-[3rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all" 
                 onClick={() => navigateTo(`product-${p.id}`)}
               >
                 <img src={p.image} className="w-full group-hover:scale-110 transition-transform duration-1000" alt="Muse" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                    <span className="text-white font-black tracking-widest text-[10px] uppercase mb-3 px-3 py-1 bg-white/20 rounded-full">Signature Edit</span>
                    <h3 className="text-white font-serif text-3xl mb-6">{p.name}</h3>
                    <button className="bg-white text-indigo-950 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-110 active:scale-95 transition-transform">Shop Shade</button>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      );
      case 'consultant': return <AIConsultant />;
      case 'story': return <LegalPage title="Botanical Passion" content={<StoryContent />} />;
      case 'faq': return <LegalPage title="Beauty Enquiries" content={<FAQContent />} />;
      case 'cart': return (
        <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12">Shopping Bag</h1>
          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm border border-slate-50 dark:border-slate-800">
              <ShoppingBag className="mx-auto mb-8 text-slate-200" size={80} />
              <p className="text-slate-400 text-xl font-light mb-10">Your bag is currently echoing silence...</p>
              <button onClick={() => navigateTo('products')} className="px-10 py-4 bg-indigo-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">Discover Shades</button>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map(item => (
                <div key={item.id} className="flex gap-8 items-center bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-50 dark:border-slate-800 transition-all hover:shadow-lg">
                  <img src={item.image} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-inner" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-bold text-2xl text-indigo-950 dark:text-white">{item.name}</h3>
                    <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">{item.category} / {item.quantity} units</p>
                    <p className="text-indigo-950 dark:text-purple-400 font-bold mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-400 p-4 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors"><Trash2 size={24} /></button>
                </div>
              ))}
              <div className="p-12 bg-indigo-950 text-white rounded-[4rem] shadow-2xl space-y-12">
                <div className="flex justify-between items-center text-4xl font-serif">
                  <span className="font-light">Total Radiance</span>
                  <span className="font-bold">${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button onClick={() => placeOrder('bank')} className="bg-white text-indigo-950 py-6 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <Banknote size={20} /> Pay via Bank Transfer
                  </button>
                  <button onClick={() => placeOrder('whatsapp')} className="bg-green-500 text-white py-6 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <MessageCircle size={20} /> Order via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'shipping': return <LegalPage title="Shipping Concierge" content={
        <div className="space-y-8">
           <p>All MayGloss orders are handled with botanical care. We currently ship globally from our logistics centers in London, California, and Lagos. Our goal is to ensure your radiance arrives swiftly and securely.</p>
           <h3 className="text-2xl font-bold">Delivery Times</h3>
           <p>Domestic (standard): 3-5 business days. <br/>International (standard): 7-14 business days. <br/>Priority Express: 1-2 business days (domestic) or 3-5 days (global).</p>
           <p>Orders exceeding $60 qualify for complimentary priority shipping. You will receive a secure tracking link as soon as our couriers have collected your parcel.</p>
        </div>
      } />;
      case 'returns': return <LegalPage title="Returns & Refunds" content={
        <div className="space-y-8">
          <p>We believe in our alchemy. If for any reason you are not completely satisfied with your MayGloss purchase, we offer a generous 30-day return window from the date of receipt.</p>
          <h3 className="text-2xl font-bold">The Process</h3>
          <p>1. Contact concierge@maygloss.com with your order ID. <br/>2. Return the product in its original botanical outer packaging. <br/>3. Once inspected, we will issue a full refund to your original payment method within 5-7 business days.</p>
          <p>Please note that for hygiene reasons, we cannot accept returns for heavily used items unless they demonstrate a manufacturing defect. Shade exchanges are always complimentary within 14 days.</p>
        </div>
      } />;
      case 'privacy': return <LegalPage title="Privacy Concierge" content={
        <div className="space-y-8">
          <p>At MayGloss, your trust is our most valuable ingredient. We handle your personal data with the same integrity we apply to our formulas. We never sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          <p>We use bank-grade SSL encryption for all financial transactions and our servers are 100% carbon-neutral. We only store information necessary to provide you with an exceptional, personalized beauty experience. You have the right to request deletion of your data at any time through our privacy concierge.</p>
        </div>
      } />;
      case 'terms': return <LegalPage title="Terms of Service" content={
        <div className="space-y-8">
          <p>By using the MayGloss platform, you enter into a ritual of service agreement. All products are intended for cosmetic, personal use only. Resale of MayGloss products without a certified partnership agreement is prohibited.</p>
          <p>We reserve the right to cancel any order that demonstrates signs of fraudulent activity or non-compliance with our botanical fair-trade guidelines. Prices are displayed in USD and are subject to minor adjustments based on global botanical harvesting costs.</p>
        </div>
      } />;
      case 'policy': return <LegalPage title="Safety & Purity" content={
        <div className="space-y-8">
          <p>MayGloss is 100% Vegan and Cruelty-Free. Our formulas are PETA certified and developed in labs that adhere to strict ethical and ecological standards. We have eliminated over 1,400 restricted substances from our manufacturing process, far exceeding global regulatory requirements.</p>
          <p>While our formulas are hypoallergenic, botanical extracts are potent. We recommend a patch test behind the ear 24 hours prior to full use, especially for individuals with known nut or seed allergies (as we utilize almond and grape seed oils).</p>
        </div>
      } />;
      case 'contact': return <LegalPage title="Direct Concierge" content={
        <div className="space-y-8 text-center bg-white dark:bg-slate-900 p-16 rounded-[4rem] shadow-2xl">
          <MessageCircle size={48} className="mx-auto mb-8 text-purple-400" />
          <p className="text-2xl font-serif">Need a personal shade match or have a question about our alchemy?</p>
          <div className="grid md:grid-cols-2 gap-12 mt-12 text-left">
             <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-[10px]">Email Support</h4>
                <p className="text-xl">concierge@maygloss.com</p>
             </div>
             <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-[10px]">Instant Message</h4>
                <p className="text-xl">WhatsApp: {WHATSAPP_NUMBER}</p>
             </div>
          </div>
          <p className="mt-16 text-slate-400 font-light italic">Our global concierge typically responds within 4 hours.</p>
        </div>
      } />;
      case 'success': return <OrderSuccess method={orderMethod} orderId={Math.floor(Math.random() * 90000) + 10000} />;
      default: return <HomePage onNavigate={navigateTo} addToCart={addToCart} addingId={addingToCartId} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 selection:bg-purple-200">
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
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Botanical hydration and mirror-like shine for every skin tone. Your natural beauty, amplified through conscious science.</p>
            <div className="flex gap-6">
               <Instagram size={22} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
               <Twitter size={22} className="text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>The Collection</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('home')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Home</li>
              <li onClick={() => navigateTo('products')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">The Palette</li>
              <li onClick={() => navigateTo('lookbook')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Muse Gallery</li>
              <li onClick={() => navigateTo('consultant')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors flex items-center gap-2">AI Guide <Sparkle size={12} className="text-purple-400" /></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Support</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('faq')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Help FAQ</li>
              <li onClick={() => navigateTo('shipping')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Shipping Info</li>
              <li onClick={() => navigateTo('returns')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Returns & Exchanges</li>
              <li onClick={() => navigateTo('contact')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Contact Concierge</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8" style={{ color: BRAND_PURPLE }}>Legals</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li onClick={() => navigateTo('privacy')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Privacy Promise</li>
              <li onClick={() => navigateTo('terms')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li onClick={() => navigateTo('policy')} className="hover:text-indigo-950 dark:hover:text-white cursor-pointer transition-colors">Safety Policy</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">© {new Date().getFullYear()} MayGloss Beauty. All Radiant Rights Reserved.</div>
      </footer>

      <GlobalChatWidget />
      <ScrollToTop />
      <NotificationToast notifications={notifications} remove={id => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
