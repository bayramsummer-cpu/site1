/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Zap, 
  Sword, 
  Shield, 
  ShieldCheck,
  Copy, 
  Check, 
  ExternalLink, 
  Menu, 
  X,
  UserPlus,
  Heart,
  ChevronRight,
  Box,
  Coins,
  Gem,
  Package,
  Github,
  Twitter,
  MessageSquare,
  LogIn,
  LogOut,
  User as UserIcon,
  ShoppingCart,
  BookOpen,
  Info,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Mock data for rankings
const RANKINGS = [
  { id: 1, name: 'StevePvP', kills: 1240, deaths: 320, kdr: 3.87, rank: 'PRO', country: 'tr' },
  { id: 2, name: 'AlexTheGreat', kills: 1102, deaths: 412, kdr: 2.67, rank: 'ELİT', country: 'us' },
  { id: 3, name: 'CreeperHunter', kills: 985, deaths: 450, kdr: 2.18, rank: 'ELİT', country: 'de' },
  { id: 4, name: 'DiamondKing', kills: 850, deaths: 420, kdr: 2.02, rank: 'KIDEMLİ', country: 'tr' },
  { id: 5, name: 'NetherLord', kills: 720, deaths: 380, kdr: 1.89, rank: 'KIDEMLİ', country: 'gb' },
  { id: 6, name: 'VoidWalker', kills: 650, deaths: 350, kdr: 1.85, rank: 'SAVAŞÇI', country: 'fr' },
  { id: 7, name: 'Enderman_99', kills: 580, deaths: 320, kdr: 1.81, rank: 'SAVAŞÇI', country: 'tr' },
  { id: 8, name: 'RedstonePro', kills: 520, deaths: 300, kdr: 1.73, rank: 'ÜYE', country: 'nl' },
  { id: 9, name: 'SkyBlocker', kills: 490, deaths: 280, kdr: 1.75, rank: 'ÜYE', country: 'tr' },
  { id: 10, name: 'PvpMasterTR', kills: 450, deaths: 260, kdr: 1.73, rank: 'ÜYE', country: 'tr' },
  { id: 11, name: 'ShadowNinja', kills: 410, deaths: 240, kdr: 1.71, rank: 'ÜYE', country: 'jp' },
  { id: 12, name: 'DragonSlayer', kills: 380, deaths: 220, kdr: 1.72, rank: 'ÜYE', country: 'us' },
  { id: 13, name: 'Miner4Life', kills: 350, deaths: 210, kdr: 1.66, rank: 'ÜYE', country: 'ca' },
  { id: 14, name: 'CraftyFox', kills: 320, deaths: 200, kdr: 1.60, rank: 'ÜYE', country: 'au' },
  { id: 15, name: 'BedWarsGod', kills: 300, deaths: 190, kdr: 1.58, rank: 'ÜYE', country: 'tr' },
];

const FEATURES = [
  {
    icon: <Sword className="w-6 h-6 text-minecraft-red" />,
    title: "Özel Kitler",
    description: "Rekabetçi PvP için dengelenmiş benzersiz kitler. Oyun tarzını seç."
  },
  {
    icon: <Shield className="w-6 h-6 text-minecraft-green" />,
    title: "Hile Koruması",
    description: "Herkes için adil bir oyun sağlayan gelişmiş sunucu taraflı koruma."
  },
  {
    icon: <Zap className="w-6 h-6 text-minecraft-gold" />,
    title: "Sıfır Gecikme",
    description: "Küresel veri merkezlerinde bulunan yüksek performanslı donanımlar."
  }
];

const STORE_ITEMS = [
  {
    id: 1,
    category: 'KASALAR',
    title: 'Efsanevi Kasa',
    description: 'İçinden %5 şansla sınırsız VIP+ veya özel kılıçlar çıkar.',
    price: '45.00 TL',
    icon: <Box className="w-8 h-8 text-minecraft-gold" />,
    color: 'border-minecraft-gold',
    glow: 'glow-gold'
  },
  {
    id: 2,
    category: 'KASALAR',
    title: 'ThisWaze Özel Kasa',
    description: 'Sadece bu ay geçerli, eşsiz kozmetikler ve efektler içerir.',
    price: '75.00 TL',
    icon: <Package className="w-8 h-8 text-minecraft-red" />,
    color: 'border-minecraft-red',
    glow: 'shadow-[0_0_20px_rgba(255,85,85,0.2)]'
  },
  {
    id: 3,
    category: 'PARA',
    title: '100,000 Coin Paketi',
    description: 'Oyun içi markette dilediğince harcayabileceğin yüklü miktar.',
    price: '30.00 TL',
    icon: <Coins className="w-8 h-8 text-minecraft-green" />,
    color: 'border-minecraft-green',
    glow: 'glow-green'
  },
  {
    id: 4,
    category: 'PARA',
    title: 'Milyoner Paketi',
    description: '1,000,000 Coin ile sunucunun en zengini sen ol!',
    price: '120.00 TL',
    icon: <Gem className="w-8 h-8 text-minecraft-gold" />,
    color: 'border-minecraft-gold',
    glow: 'glow-gold'
  }
];

const GUIDE_ITEMS = [
  {
    title: "Nasıl Başlarım?",
    description: "Sunucuya ilk girdiğinde '/kit başlangıç' komutu ile temel ekipmanlarını al. Başlangıç bölgesindeki görevleri tamamlayarak ilk coinlerini kazanmaya başla.",
    icon: <UserPlus className="w-6 h-6 text-minecraft-green" />
  },
  {
    title: "Para Nasıl Kasılır?",
    description: "Maden bölgesinde değerli taşlar kazarak, günlük görevleri yaparak veya '/ah' (Açık Artırma) üzerinden diğer oyuncularla ticaret yaparak servetini katla.",
    icon: <Coins className="w-6 h-6 text-minecraft-gold" />
  },
  {
    title: "Market Sistemi",
    description: "Kazandığın coinleri '/market' komutuyla harcayabilirsin. Zırhlar, büyülü kitaplar ve nadir eşyalar seni bekliyor. Ayrıca oyuncu marketlerinden ucuza eşya bulabilirsin.",
    icon: <ShoppingCart className="w-6 h-6 text-minecraft-red" />
  },
  {
    title: "PvP ve Rütbeler",
    description: "Arenada rakiplerini yenerek öldürme puanı kazan. Puanların arttıkça rütben yükselir ve özel kitlerin kilidi açılır. Sıralamada ilk 3'e girenleri her ay büyük ödüller bekliyor!",
    icon: <Trophy className="w-6 h-6 text-minecraft-gold" />
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'login' | 'success'>('select');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [paymentLoginData, setPaymentLoginData] = useState({ id: '', password: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const serverIP = "play.thiswaze.net";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const copyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate bank login/processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
    }, 2000);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setTimeout(() => {
      setPaymentStep('select');
      setSelectedMethod(null);
      setPaymentLoginData({ id: '', password: '' });
    }, 300);
  };

  const paymentMethods = [
    { id: 'kuveyt', name: 'Kuveyt Türk', color: '#006633', short: 'KT', hover: 'hover:border-minecraft-green', text: 'text-minecraft-green' },
    { id: 'akbank', name: 'Akbank', color: '#E30613', short: 'AK', hover: 'hover:border-minecraft-red', text: 'text-minecraft-red' },
    { id: 'papara', name: 'Papara', color: '#000000', short: 'P', hover: 'hover:border-[#FF00FF]', text: 'text-[#FF00FF]' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-minecraft-green selection:text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-minecraft-green rounded-lg flex items-center justify-center glow-green">
              <Sword className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter minecraft-font">THISWAZE</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'Ana Sayfa', id: 'home' },
              { name: 'Rehber', id: 'guide' },
              { name: 'Sıralama', id: 'rankings' },
              { name: 'Özellikler', id: 'features' },
              { name: 'Mağaza', id: 'store' },
              { name: 'Discord', id: 'discord', external: 'https://discord.com/channels/@me' }
            ].map((item) => (
              <a 
                key={item.id} 
                href={item.external || `#${item.id}`} 
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-sm font-semibold text-white/70 hover:text-minecraft-green transition-colors uppercase tracking-wider"
              >
                {item.name}
              </a>
            ))}
            
            <div className="h-6 w-[1px] bg-white/10 mx-2" />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-bold">{user.displayName}</span>
                </div>
                <button onClick={handleLogout} className="text-white/40 hover:text-minecraft-red transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="px-5 py-2 bg-minecraft-green text-black font-bold rounded-full text-sm hover:scale-105 transition-all active:scale-95 flex items-center gap-2 glow-green"
              >
                <LogIn size={16} />
                GİRİŞ YAP
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {[
                { name: 'Ana Sayfa', id: 'home' },
                { name: 'Rehber', id: 'guide' },
                { name: 'Sıralama', id: 'rankings' },
                { name: 'Özellikler', id: 'features' },
                { name: 'Mağaza', id: 'store' },
                { name: 'Discord', id: 'discord', external: 'https://discord.com/channels/@me' }
              ].map((item) => (
                <a 
                  key={item.id} 
                  href={item.external || `#${item.id}`} 
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-black tracking-tighter minecraft-font hover:text-minecraft-green transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              <div className="h-[1px] w-full bg-white/10 my-4" />
              
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full" />
                    <span className="text-xl font-bold">{user.displayName}</span>
                  </div>
                  <button onClick={handleLogout} className="p-3 bg-white/5 rounded-xl text-minecraft-red">
                    <LogOut size={24} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="w-full py-5 bg-minecraft-green text-black font-black rounded-xl text-xl flex items-center justify-center gap-3"
                >
                  <LogIn size={24} />
                  GİRİŞ YAP
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-minecraft-green/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-minecraft-gold/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/minecraft/1920/1080')] bg-cover bg-center opacity-20 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-minecraft-green/10 border border-minecraft-green/20 text-minecraft-green text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-minecraft-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-minecraft-green"></span>
              </span>
              Sunucu Çevrimiçi • 243 Oyuncu
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
              KUSURSUZ <span className="text-minecraft-green">PVP</span> <br /> DENEYİMİ
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-medium">
              En rekabetçi Minecraft PvP topluluğuna katılın. Özel kitler, 
              dereceli arenalar ve gerçek ödüllü haftalık turnuvalar.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={copyIP}
                  className="w-full sm:w-auto px-10 py-5 bg-minecraft-green text-black font-black rounded-xl hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-3 glow-green"
                >
                  {copied ? <Check size={20} /> : <Zap size={20} />}
                  {copied ? 'IP KOPYALANDI!' : 'SUNUCUYA KATIL'}
                </button>
                <a 
                  href="#store"
                  className="w-full sm:w-auto px-10 py-5 glass-card font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                >
                  <Trophy size={20} className="text-minecraft-gold" />
                  MAĞAZAYI GÖR
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button 
                  onClick={copyIP}
                  className="flex items-center gap-2 text-white/40 font-mono text-sm bg-white/5 py-2 px-4 rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
                >
                  {copied ? <Check size={14} className="text-minecraft-green" /> : <Copy size={14} className="group-hover:text-minecraft-green transition-colors" />}
                  <span>SUNUCU IP:</span>
                  <span className="text-minecraft-green font-bold tracking-wider">{serverIP}</span>
                </button>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-minecraft-green/60 bg-minecraft-green/5 py-2 px-4 rounded-full border border-minecraft-green/10 uppercase">
                  <ShieldCheck size={12} />
                  GÜVENLİ BAĞLANTI • HERKESE AÇIK
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section id="rankings" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">SUNUCU <span className="text-minecraft-gold">SIRALAMASI</span></h2>
              <p className="text-white/50 max-w-md">ThisWaze'in en iyi savaşçıları. Sıralamalar rekabetçi performansa göre her saat başı güncellenir.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">TÜM ZAMANLAR</button>
              <button className="px-4 py-2 bg-minecraft-gold text-black rounded-lg text-sm font-bold">AYLIK</button>
            </div>
          </div>

          {/* Server Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-minecraft-green">
              <div className="w-12 h-12 bg-minecraft-green/10 rounded-xl flex items-center justify-center text-minecraft-green">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Aktif Oyuncu</p>
                <h3 className="text-2xl font-black minecraft-font">243</h3>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-minecraft-gold">
              <div className="w-12 h-12 bg-minecraft-gold/10 rounded-xl flex items-center justify-center text-minecraft-gold">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Toplam Giriş</p>
                <h3 className="text-2xl font-black minecraft-font">12,450</h3>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-minecraft-red">
              <div className="w-12 h-12 bg-minecraft-red/10 rounded-xl flex items-center justify-center text-minecraft-red">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Beğeni Sayısı</p>
                <h3 className="text-2xl font-black minecraft-font">4,820</h3>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Sıra</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Oyuncu</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Öldürme</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Ölüm</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">KDR</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Kademe</th>
                  </tr>
                </thead>
                <tbody>
                  {RANKINGS.map((player, index) => (
                    <tr key={player.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-minecraft-gold text-black glow-gold' : 
                          index === 1 ? 'bg-slate-300 text-black' : 
                          index === 2 ? 'bg-amber-700 text-white' : 'text-white/40'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://mc-heads.net/avatar/${player.name}/32`} 
                            alt={player.name}
                            className="w-8 h-8 rounded bg-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold tracking-tight group-hover:text-minecraft-green transition-colors">{player.name}</span>
                            <div className="flex items-center gap-1.5">
                              <img 
                                src={`https://flagcdn.com/w20/${player.country}.png`}
                                alt={player.country}
                                className="w-4 h-auto rounded-sm opacity-60"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[10px] uppercase text-white/30 font-bold">{player.country}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-minecraft-green font-bold">{player.kills}</td>
                      <td className="px-6 py-4 font-mono text-minecraft-red font-bold">{player.deaths}</td>
                      <td className="px-6 py-4 font-mono font-bold">{player.kdr}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-black uppercase tracking-widest border border-white/10">
                          {player.rank}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-white/5 text-center">
              <button className="text-sm font-bold text-minecraft-green hover:underline flex items-center gap-2 mx-auto">
                TÜM LİDERLİK TABLOSUNU GÖR <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">NEDEN <span className="text-minecraft-green">THISWAZE?</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">PvP meraklıları tarafından topluluk için inşa edildi. Performans, denge ve eğlenceye odaklanıyoruz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass-card p-8 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-minecraft-green/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section id="guide" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-minecraft-green/5 rounded-full blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">SUNUCU <span className="text-minecraft-green">REHBERİ</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">ThisWaze dünyasında nasıl hayatta kalacağını ve nasıl en zengin olacağını öğren.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {GUIDE_ITEMS.map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 10 }}
                className="glass-card p-8 flex gap-6 group border-l-4 border-transparent hover:border-minecraft-green transition-all"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-minecraft-green/20 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-minecraft-green transition-colors">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-minecraft-green/10 to-transparent border border-minecraft-green/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-minecraft-green rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(85,255,85,0.3)]">
                <BookOpen size={40} className="text-black" />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 uppercase">Market Sistemini Keşfet</h4>
                <p className="text-white/70">
                  Sunucumuzda gelişmiş bir ekonomi sistemi bulunmaktadır. Kazandığın coinleri <strong>/market</strong> komutuyla harcayabilir, 
                  diğer oyuncuların kurduğu marketlerden alışveriş yapabilir veya kendi marketini kurarak zengin olabilirsin!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section id="store" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-minecraft-gold/5 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">SUNUCU <span className="text-minecraft-gold">MAĞAZASI</span></h2>
            <p className="text-white/50 max-w-2xl mx-auto">Karakterini güçlendir, özel kasalar aç ve oyun içi ekonomide öne geç.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORE_ITEMS.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -10 }}
                className={`glass-card p-8 flex flex-col border-t-4 ${item.color} ${item.glow}`}
              >
                <div className="text-[10px] font-black tracking-widest text-white/30 mb-4 uppercase">{item.category}</div>
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 mb-8 flex-grow">{item.description}</p>
                <div className="mt-auto">
                  <div className="text-2xl font-black minecraft-font mb-4">{item.price}</div>
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setIsPaymentModalOpen(true);
                    }}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-minecraft-gold transition-colors active:scale-95"
                  >
                    SATIN AL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-dashed border-2 border-white/10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-minecraft-green/10 rounded-full flex items-center justify-center text-minecraft-green">
                <Shield size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold">Güvenli Ödeme</h4>
                <p className="text-white/50 text-sm">Tüm işlemleriniz 256-bit SSL ile korunmaktadır.</p>
              </div>
            </div>
            <button className="px-8 py-4 glass-card hover:bg-white/10 transition-colors font-bold flex items-center gap-2">
              TÜM ÜRÜNLERİ GÖR <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="discord" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-[#5865F2] p-12 md:p-20 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/discord/1200/600')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10">
              <MessageSquare size={64} className="mx-auto mb-8 text-white" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">DISCORD'A KATIL</h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                En son güncellemeleri alın, çekilişlere katılın ve resmi topluluğumuzdaki 
                binlerce diğer oyuncuyla sohbet edin.
              </p>
              <a 
                href="https://discord.com/channels/@me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-12 py-5 bg-white text-[#5865F2] font-black rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-2xl"
              >
                TOPLULUĞA KATIL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-minecraft-green rounded flex items-center justify-center">
                <Sword className="text-black w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter minecraft-font">THISWAZE</span>
            </div>
            
            <div className="flex gap-8">
              <a href="tel:+905051438633" className="text-white/40 hover:text-minecraft-green transition-colors flex items-center gap-2 text-sm font-bold">
                <Phone size={18} />
                +90 505 143 86 33
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><MessageSquare size={20} /></a>
            </div>

            <p className="text-white/30 text-sm">
              © 2026 ThisWaze. Resmi bir Minecraft ürünü değildir.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePaymentModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-minecraft-gold" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tighter mb-1 uppercase">
                    {paymentStep === 'select' && 'ÖDEME YÖNTEMİ SEÇ'}
                    {paymentStep === 'login' && `${selectedMethod?.name} GİRİŞ`}
                    {paymentStep === 'success' && 'ÖDEME BAŞARILI'}
                  </h3>
                  <p className="text-white/50 text-sm">{selectedItem?.title} - <span className="text-minecraft-gold font-bold">{selectedItem?.price}</span></p>
                </div>
                <button 
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {paymentStep === 'select' && (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method);
                        setPaymentStep('login');
                      }}
                      className={`w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group ${method.hover} transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                          style={{ backgroundColor: method.color, border: method.id === 'papara' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
                        >
                          {method.short}
                        </div>
                        <div className="text-left">
                          <div className={`font-bold group-hover:${method.text} transition-colors`}>{method.name}</div>
                          <div className="text-xs text-white/40">
                            {method.id === 'papara' ? 'Anında Transfer' : 'Havale / EFT / Kart'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`text-white/20 group-hover:${method.text} group-hover:translate-x-1 transition-all`} />
                    </button>
                  ))}
                </div>
              )}

              {paymentStep === 'login' && (
                <form onSubmit={handlePaymentLogin} className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-2">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: selectedMethod?.color }}
                    >
                      {selectedMethod?.short}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{selectedMethod?.name} İnternet Bankacılığı</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">Güvenli Giriş</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">
                        {selectedMethod?.id === 'papara' ? 'PAPARA NUMARASI / E-POSTA' : 'MÜŞTERİ / T.C. KİMLİK NO'}
                      </label>
                      <input 
                        required
                        type="text"
                        value={paymentLoginData.id}
                        onChange={(e) => setPaymentLoginData({...paymentLoginData, id: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-minecraft-gold transition-colors"
                        placeholder="Giriş yapın..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">ŞİFRE</label>
                      <input 
                        required
                        type="password"
                        value={paymentLoginData.password}
                        onChange={(e) => setPaymentLoginData({...paymentLoginData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-minecraft-gold transition-colors"
                        placeholder="••••••"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentStep('select')}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
                    >
                      GERİ
                    </button>
                    <button 
                      disabled={isProcessing}
                      type="submit"
                      className="flex-[2] py-4 bg-minecraft-gold text-black font-bold rounded-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>GİRİŞ YAP VE ÖDE</>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {paymentStep === 'success' && (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-minecraft-green/20 text-minecraft-green rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Shield size={40} />
                  </motion.div>
                  <h4 className="text-xl font-bold mb-2">İşlem Başarıyla Tamamlandı!</h4>
                  <p className="text-white/50 text-sm mb-8">
                    Ödemeniz onaylandı. {selectedItem?.title} kısa süre içinde hesabınıza tanımlanacaktır.
                  </p>
                  <button 
                    onClick={closePaymentModal}
                    className="w-full py-4 bg-minecraft-green text-black font-bold rounded-xl hover:glow-green transition-all"
                  >
                    HARİKA!
                  </button>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 text-xs text-white/30">
                <Shield size={14} />
                <span>256-bit SSL sertifikası ile uçtan uca şifrelenmiş güvenli ödeme.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
