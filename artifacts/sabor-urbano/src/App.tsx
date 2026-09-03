import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Instagram, MapPin, Menu as MenuIcon, Phone, Play, Send, Star, X } from 'lucide-react';
import octopusImage from '../attached_assets/generated_images/octopus.jpg';
import pastaImage from '../attached_assets/generated_images/pasta.jpg';
import interiorImage from '../attached_assets/generated_images/interior.jpg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Dish = { name: string; description: string; price: string; category: string; note?: string };
const dishes: Dish[] = [
  { name: 'Berenjena asada, miso de almendra', description: 'Yema curada, uva encurtida y aceite de hoja de higuera', price: '14', category: 'Para empezar', note: 'Vegetal' },
  { name: 'Pulpo a la brasa', description: 'Patata ahumada, aliño de pimentón y limón quemado', price: '22', category: 'Para empezar', note: 'Casa' },
  { name: 'Arroz meloso de monte', description: 'Setas de temporada, jugo de cebolla tostada y tomillo', price: '19', category: 'Del fuego', note: 'Vegetal' },
  { name: 'Presa ibérica, ciruela y mostaza', description: 'Calabaza asada, hojas amargas y demi-glace de vino', price: '26', category: 'Del fuego' },
  { name: 'Lubina, pilpil de aceituna', description: 'Puerro joven, hinojo y caldo de sus espinas', price: '25', category: 'Del fuego' },
  { name: 'Chocolate, aceite y sal', description: 'Ganache tibia, helado de pan y sal de escama', price: '10', category: 'Para cerrar' },
  { name: 'Torrija de brioche', description: 'Leche de canela, pera asada y caramelo de miso', price: '10', category: 'Para cerrar' },
];

const gallery = [
  { src: octopusImage, alt: 'Pulpo a la brasa sobre cerámica oscura', caption: 'Pulpo a la brasa' },
  { src: interiorImage, alt: 'Interior de Sabor Urbano con luz cálida', caption: 'La sala, al caer la tarde' },
  { src: pastaImage, alt: 'Pasta de setas en mesa de restaurante', caption: 'Arroz meloso de monte' },
];

const testimonials = [
  { quote: 'Un menú que entiende Madrid sin disfrazarlo. Cada plato tiene una idea y, sobre todo, un recuerdo.', name: 'Lucía M.', detail: 'Guía local · Madrid' },
  { quote: 'La sala tiene la energía justa: cálida, viva y atenta. Salimos hablando de la cena durante días.', name: 'Andrés R.', detail: 'Cliente habitual' },
  { quote: 'Técnica impecable, pero nunca por encima del sabor. El pulpo es razón suficiente para volver.', name: 'Clara V.', detail: 'Crítica gastronómica' },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Header({ onReserve }: { onReserve: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setOpen(false);
  return (
    <header className={`nav-shell fixed inset-x-0 top-0 z-40 text-[#fffef7] ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <a href="#inicio" onClick={close} className="focus-ring flex items-center gap-3" data-testid="link-home">
          <span className="flex h-9 w-9 items-center justify-center border border-[#d4af37] text-[15px] font-semibold text-[#d4af37]">SU</span>
          <span className="hidden text-[11px] font-bold uppercase tracking-[.28em] sm:block">Sabor Urbano</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {['La casa', 'Menú', 'Galería', 'Reservas'].map((item) => <a key={item} href={`#${item === 'La casa' ? 'historia' : item.toLowerCase()}`} className="focus-ring text-[11px] font-semibold uppercase tracking-[.17em] text-[#fffef7]/80 transition-colors hover:text-[#d4af37]" data-testid={`link-nav-${item.toLowerCase().replace(' ', '-')}`}>{item}</a>)}
        </nav>
        <div className="flex items-center gap-4">
          <a href="tel:+34915547821" className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] text-[#fffef7]/80 transition-colors hover:text-[#d4af37] xl:flex" data-testid="link-call-header"><Phone size={14} /> +34 915 547 821</a>
          <button onClick={onReserve} className="hidden bg-[#d4af37] px-5 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#1c1c1c] transition-colors hover:bg-[#fffef7] lg:block" data-testid="button-reserve-header">Reservar mesa</button>
          <button onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} className="focus-ring p-2 lg:hidden" data-testid="button-mobile-menu">{open ? <X size={23} /> : <MenuIcon size={23} />}</button>
        </div>
      </div>
      {open && <div className="border-t border-[#fffef7]/15 bg-[#1c1c1c] px-5 pb-7 pt-2 lg:hidden">
        {['La casa', 'Menú', 'Galería', 'Reservas'].map((item) => <a key={item} href={`#${item === 'La casa' ? 'historia' : item.toLowerCase()}`} onClick={close} className="block border-b border-[#fffef7]/10 py-4 text-sm uppercase tracking-[.15em]" data-testid={`link-mobile-${item.toLowerCase().replace(' ', '-')}`}>{item}</a>)}
        <a href="tel:+34915547821" className="flex items-center gap-2 pt-5 text-sm text-[#d4af37]" data-testid="link-call-mobile"><Phone size={15} /> +34 915 547 821</a>
      </div>}
    </header>
  );
}

function Hero({ onReserve }: { onReserve: () => void }) {
  return <section id="inicio" className="hero-grain relative flex min-h-[760px] items-end overflow-hidden bg-[#1c1c1c] text-[#fffef7] md:min-h-[840px]">
    <img src={interiorImage} alt="Sala de Sabor Urbano iluminada al atardecer" className="hero-image absolute inset-0 h-full w-full object-cover opacity-70" fetchPriority="high" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/45 to-[#1c1c1c]/20" />
    <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-20 pt-36 md:px-10 md:pb-28">
      <div className="max-w-[830px] reveal">
        <p className="eyebrow mb-6 text-[#d4af37]">Cocina de autor · Madrid centro</p>
        <h1 className="display max-w-[820px] text-[clamp(3.8rem,9vw,8.5rem)] leading-[.88] tracking-[-.05em]">Donde la<br /><em className="text-[#d4af37]">Tradición</em> se<br />Reinventa</h1>
        <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-center">
          <p className="max-w-[280px] text-sm leading-6 text-[#fffef7]/75">Cocina de autor con alma local. Un lugar para dejarse llevar por el sabor.</p>
          <button onClick={onReserve} className="group flex w-fit items-center gap-3 border border-[#d4af37] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.17em] text-[#fffef7] transition-colors hover:bg-[#d4af37] hover:text-[#1c1c1c]" data-testid="button-reserve-hero">Reservar una mesa <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
        </div>
      </div>
      <a href="#historia" className="focus-ring absolute bottom-8 right-5 hidden items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#fffef7]/55 md:flex" data-testid="link-scroll-story">Descubre la casa <ArrowDown size={15} className="text-[#d4af37]" /></a>
    </div>
  </section>;
}

function Story() {
  return <section id="historia" className="bg-[#fffcf0] px-5 py-24 md:px-10 md:py-36">
    <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-[.8fr_1.2fr] md:gap-24">
      <div className="reveal"><p className="eyebrow text-[#708238]">01 — La casa</p><div className="mt-6 gold-line" /><p className="mt-10 text-[11px] font-bold uppercase tracking-[.18em] text-[#1c1c1c]/55">Una mesa en el centro<br />de todo</p></div>
      <div className="reveal">
        <h2 className="display text-[clamp(2.6rem,5vw,5rem)] leading-[.98] tracking-[-.04em]">Lo local no es un<br /><em className="text-[#708238]">ingrediente.</em><br />Es el punto de partida.</h2>
        <p className="mt-9 max-w-[610px] text-lg leading-8 text-[#1c1c1c]/65">En Sabor Urbano cocinamos mirando a dos sitios a la vez: las técnicas que viajaron hasta aquí y los productos que no necesitan irse lejos. El resultado es una cocina reconocible, inquieta y honesta.</p>
        <div className="mt-12 grid max-w-[550px] grid-cols-2 gap-8 border-t border-[#1c1c1c]/15 pt-7 sm:grid-cols-3">
          <div><p className="display text-3xl">2018</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#1c1c1c]/50">Abrimos las puertas</p></div>
          <div><p className="display text-3xl">24</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#1c1c1c]/50">Productores cercanos</p></div>
          <div><p className="display text-3xl">7 km</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#1c1c1c]/50">Del campo a la mesa</p></div>
        </div>
      </div>
    </div>
  </section>;
}

function MenuSection() {
  const [category, setCategory] = useState('Todo');
  const categories = ['Todo', 'Para empezar', 'Del fuego', 'Para cerrar'];
  const filtered = useMemo(() => category === 'Todo' ? dishes : dishes.filter((dish) => dish.category === category), [category]);
  return <section id="menú" className="bg-[#e9e4d2] px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]">
      <div className="reveal flex flex-col justify-between gap-8 border-b border-[#1c1c1c]/20 pb-10 md:flex-row md:items-end">
        <div><p className="eyebrow text-[#708238]">02 — La carta</p><h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">Comer es<br /><em>conversar.</em></h2></div>
        <p className="max-w-[270px] text-sm leading-6 text-[#1c1c1c]/65">Una carta que cambia con el mercado. Pide al centro, sigue tu curiosidad.</p>
      </div>
      <div className="reveal mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías del menú">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} role="tab" aria-selected={category === item} className={`focus-ring px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] transition-colors ${category === item ? 'bg-[#1c1c1c] text-[#fffef7]' : 'border border-[#1c1c1c]/25 text-[#1c1c1c]/65 hover:border-[#1c1c1c]'}`} data-testid={`button-menu-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}
      </div>
      <div className="mt-7 grid gap-px bg-[#1c1c1c]/15 md:grid-cols-2">
        {filtered.map((dish, index) => <article key={dish.name} className="menu-card reveal bg-[#e9e4d2] p-6 md:p-8" style={{ transitionDelay: `${index * 45}ms` }} data-testid={`card-dish-${dish.name.toLowerCase().replaceAll(' ', '-')}`}>
          <div className="flex items-start justify-between gap-6"><div><div className="flex items-center gap-3"><h3 className="display text-2xl">{dish.name}</h3>{dish.note && <span className="border border-[#708238]/50 px-2 py-1 text-[9px] uppercase tracking-[.1em] text-[#708238]">{dish.note}</span>}</div><p className="mt-3 max-w-[390px] text-sm leading-6 text-[#1c1c1c]/60">{dish.description}</p></div><span className="display whitespace-nowrap text-xl text-[#708238]">{dish.price} €</span></div>
        </article>)}
      </div>
      <p className="mt-6 text-xs text-[#1c1c1c]/50">La carta puede variar según el mercado. Pregunta por opciones vegetarianas y alérgenos.</p>
    </div>
  </section>;
}

function Signature() {
  return <section className="bg-[#1c1c1c] px-5 py-24 text-[#fffef7] md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]">
      <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow text-[#d4af37]">03 — Lo que vuelve</p><h2 className="display mt-5 text-[clamp(2.8rem,5vw,5.4rem)] leading-[.92] tracking-[-.05em]">Algunos platos<br /><em className="text-[#d4af37]">dejan huella.</em></h2></div><p className="max-w-[280px] text-sm leading-6 text-[#fffef7]/55">Hay sabores que se recuerdan antes de volver a probarlos.</p></div>
      <div className="mt-14 grid gap-5 md:grid-cols-[1.35fr_.65fr]">
        <div className="image-hover reveal group relative min-h-[450px] overflow-hidden md:min-h-[590px]"><img src={octopusImage} alt="Pulpo a la brasa, plato insignia de Sabor Urbano" loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1c1c1c] p-7 pt-24"><p className="eyebrow text-[#d4af37]">La firma</p><h3 className="display mt-2 text-4xl">Pulpo a la brasa</h3><p className="mt-2 text-sm text-[#fffef7]/65">Patata ahumada · limón quemado · pimentón</p></div></div>
        <div className="image-hover reveal group relative min-h-[360px] overflow-hidden md:min-h-[590px]"><img src={pastaImage} alt="Plato de pasta con setas de temporada" loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1c1c1c] p-6 pt-24"><p className="eyebrow text-[#d4af37]">El bosque</p><h3 className="display mt-2 text-3xl">Arroz meloso de monte</h3></div></div>
      </div>
    </div>
  </section>;
}

function Gallery({ onOpen }: { onOpen: (index: number) => void }) {
  return <section id="galería" className="bg-[#fffcf0] px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]"><div className="reveal flex items-end justify-between"><div><p className="eyebrow text-[#708238]">04 — La mirada</p><h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">La noche<br /><em>también se ve.</em></h2></div><p className="hidden text-[10px] uppercase tracking-[.18em] text-[#1c1c1c]/50 md:block">Haz clic para ampliar</p></div>
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[220px_220px]">{gallery.map((item, index) => <button key={item.caption} onClick={() => onOpen(index)} className={`gallery-tile image-hover focus-ring relative overflow-hidden text-left ${index === 0 ? 'col-span-2 row-span-2' : index === 1 ? 'col-span-2' : 'col-span-2 md:col-span-2'}`} data-testid={`button-gallery-${index}`}><img src={item.src} alt={item.alt} loading="lazy" className="h-full min-h-[180px] w-full object-cover" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1c1c1c]/80 p-4 pt-12 text-xs text-[#fffef7]">{item.caption}</span></button>)}</div>
    </div>
  </section>;
}

function Testimonials() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setCurrent((value) => (value + 1) % testimonials.length), 6000); return () => window.clearInterval(timer); }, []);
  const item = testimonials[current];
  return <section className="bg-[#708238] px-5 py-24 text-[#fffef7] md:px-10 md:py-32"><div className="mx-auto max-w-[1040px] reveal"><div className="flex items-center gap-3"><Star size={15} fill="#d4af37" color="#d4af37" /><span className="eyebrow text-[#d4af37]">Lo dicen en la mesa</span></div><div className="quote-fade mt-10 min-h-[220px]" key={current}><blockquote className="display max-w-[950px] text-[clamp(2.2rem,5vw,5.2rem)] leading-[1.02] tracking-[-.035em]">“{item.quote}”</blockquote><p className="mt-10 text-sm font-semibold">{item.name} <span className="ml-2 font-normal text-[#fffef7]/60">/ {item.detail}</span></p></div><div className="mt-10 flex items-center justify-between border-t border-[#fffef7]/25 pt-5"><div className="flex gap-2">{testimonials.map((_, index) => <button key={index} aria-label={`Ver testimonio ${index + 1}`} onClick={() => setCurrent(index)} className={`h-1.5 transition-all ${index === current ? 'w-10 bg-[#d4af37]' : 'w-5 bg-[#fffef7]/35'}`} data-testid={`button-testimonial-${index}`} />)}</div><div className="flex gap-2"><button onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)} className="focus-ring border border-[#fffef7]/30 p-3 transition-colors hover:bg-[#fffef7] hover:text-[#708238]" aria-label="Testimonio anterior" data-testid="button-testimonial-prev"><ChevronLeft size={17} /></button><button onClick={() => setCurrent((current + 1) % testimonials.length)} className="focus-ring border border-[#fffef7]/30 p-3 transition-colors hover:bg-[#fffef7] hover:text-[#708238]" aria-label="Siguiente testimonio" data-testid="button-testimonial-next"><ChevronRight size={17} /></button></div></div></div></section>;
}

function Reservation({ onComplete }: { onComplete: () => void }) {
  const [error, setError] = useState('');
  const [form, setForm] = useState({ date: '', time: '21:00', guests: '2', name: '', email: '' });
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!form.date || !form.name.trim() || !form.email.includes('@')) { setError('Completa tu nombre, email y una fecha válida.'); return; } setError(''); onComplete(); };
  return <section id="reservas" className="bg-[#e9e4d2] px-5 py-24 md:px-10 md:py-32"><div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-[.8fr_1.2fr]"><div className="reveal"><p className="eyebrow text-[#708238]">05 — Tu mesa</p><h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">Haz sitio<br />para algo<br /><em>bueno.</em></h2><p className="mt-8 max-w-[290px] text-sm leading-6 text-[#1c1c1c]/65">Abrimos de martes a sábado. Para grupos de más de 8 personas, escríbenos y lo preparamos juntos.</p></div>
      <form onSubmit={submit} className="reveal border-t border-[#1c1c1c]/20 pt-8" noValidate><div className="grid gap-7 sm:grid-cols-2"><label className="block"><span className="eyebrow text-[#1c1c1c]/55">Fecha</span><span className="relative mt-3 block"><CalendarDays size={16} className="pointer-events-none absolute left-0 top-3 text-[#708238]" /><input type="date" value={form.date} onChange={update('date')} className="focus-ring w-full border-b border-[#1c1c1c]/25 bg-transparent py-2 pl-7 text-sm outline-none" data-testid="input-reservation-date" /></span></label><label className="block"><span className="eyebrow text-[#1c1c1c]/55">Hora</span><span className="relative mt-3 block"><Clock3 size={16} className="pointer-events-none absolute left-0 top-3 text-[#708238]" /><select value={form.time} onChange={update('time')} className="focus-ring w-full appearance-none border-b border-[#1c1c1c]/25 bg-transparent py-2 pl-7 text-sm outline-none" data-testid="select-reservation-time">{['20:00', '20:30', '21:00', '21:30', '22:00'].map((time) => <option key={time}>{time}</option>)}</select></span></label><label className="block"><span className="eyebrow text-[#1c1c1c]/55">Personas</span><select value={form.guests} onChange={update('guests')} className="focus-ring mt-3 w-full border-b border-[#1c1c1c]/25 bg-transparent py-2 text-sm outline-none" data-testid="select-reservation-guests">{[1, 2, 3, 4, 5, 6, 7, 8].map((guest) => <option key={guest} value={guest}>{guest} {guest === 1 ? 'persona' : 'personas'}</option>)}</select></label><label className="block"><span className="eyebrow text-[#1c1c1c]/55">Tu nombre</span><input value={form.name} onChange={update('name')} placeholder="Cómo te llamamos" className="focus-ring mt-3 w-full border-b border-[#1c1c1c]/25 bg-transparent py-2 text-sm outline-none placeholder:text-[#1c1c1c]/35" data-testid="input-reservation-name" /></label><label className="block sm:col-span-2"><span className="eyebrow text-[#1c1c1c]/55">Email</span><input type="email" value={form.email} onChange={update('email')} placeholder="Para confirmar la reserva" className="focus-ring mt-3 w-full border-b border-[#1c1c1c]/25 bg-transparent py-2 text-sm outline-none placeholder:text-[#1c1c1c]/35" data-testid="input-reservation-email" /></label></div>{error && <p className="mt-6 text-sm text-[#a23e34]" role="alert" data-testid="status-reservation-error">{error}</p>}<button type="submit" className="group mt-10 flex items-center gap-3 bg-[#1c1c1c] px-6 py-4 text-[11px] font-bold uppercase tracking-[.17em] text-[#fffef7] transition-colors hover:bg-[#708238]" data-testid="button-submit-reservation">Solicitar reserva <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button><p className="mt-4 text-[11px] text-[#1c1c1c]/45">Te confirmaremos la disponibilidad por email en menos de 24 horas.</p></form>
    </div></section>;
}

function Location() {
  return <section id="contacto" className="grid md:grid-cols-2"><div className="map-grid relative min-h-[420px] overflow-hidden"><div className="absolute inset-0 bg-[#708238]/10" /><div className="absolute left-[53%] top-[43%]"><div className="map-pin flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d4af37] text-[#1c1c1c]"><MapPin size={21} /></div><span className="absolute left-7 top-7 whitespace-nowrap bg-[#1c1c1c] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#fffef7]">Sabor Urbano</span></div><div className="absolute bottom-6 left-6 border-l-2 border-[#708238] bg-[#fffcf0]/90 px-4 py-3 text-[10px] uppercase tracking-[.14em] text-[#1c1c1c]/65">Calle del Barquillo<br />Madrid centro</div></div><div className="bg-[#1c1c1c] px-5 py-20 text-[#fffef7] md:px-16 md:py-28"><p className="eyebrow text-[#d4af37]">06 — Ven a vernos</p><h2 className="display mt-5 text-[clamp(2.8rem,5vw,5.4rem)] leading-[.92] tracking-[-.05em]">En el centro<br />de <em className="text-[#d4af37]">todo.</em></h2><div className="mt-12 space-y-6 text-sm text-[#fffef7]/65"><a href="https://maps.google.com/?q=Calle+del+Barquillo+Madrid" target="_blank" rel="noreferrer" className="focus-ring flex items-start gap-4 transition-colors hover:text-[#d4af37]" data-testid="link-map"><MapPin size={17} className="mt-0.5 text-[#d4af37]" /><span>Calle del Barquillo, 23<br />28004 Madrid</span></a><a href="tel:+34915547821" className="focus-ring flex items-center gap-4 transition-colors hover:text-[#d4af37]" data-testid="link-call-contact"><Phone size={17} className="text-[#d4af37]" /> +34 915 547 821</a><p className="flex items-center gap-4"><Clock3 size={17} className="text-[#d4af37]" /> Martes — Sábado · 19:30 — 00:30</p></div></div></section>;
}

function Footer() {
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (email.includes('@')) setSent(true); };
  return <footer className="bg-[#e9e4d2] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1fr_1fr_auto]"><div><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-[#1c1c1c] text-[15px] font-semibold">SU</span><span className="text-[11px] font-bold uppercase tracking-[.28em]">Sabor Urbano</span></div><p className="mt-5 max-w-[240px] text-sm leading-6 text-[#1c1c1c]/55">Una mesa para mirar la ciudad de otra manera.</p></div><div><p className="eyebrow text-[#708238]">Notas de la casa</p><p className="mt-4 max-w-[270px] text-sm leading-6 text-[#1c1c1c]/65">Noticias del menú, productores y alguna sorpresa. Una vez al mes.</p>{sent ? <p className="mt-5 text-sm font-semibold text-[#708238]" role="status" data-testid="status-newsletter-success">Gracias. Ya estás en la mesa.</p> : <form onSubmit={submit} className="mt-5 flex max-w-[300px] border-b border-[#1c1c1c]/30"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu email" className="focus-ring min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#1c1c1c]/40" data-testid="input-newsletter-email" /><button type="submit" aria-label="Suscribirse al boletín" className="focus-ring px-2 text-[#708238] transition-colors hover:text-[#1c1c1c]" data-testid="button-newsletter-submit"><Send size={16} /></button></form>}</div><div className="flex items-start gap-5 md:justify-self-end"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="focus-ring text-[#1c1c1c]/65 transition-colors hover:text-[#708238]" data-testid="link-instagram"><Instagram size={21} /></a><a href="#inicio" className="focus-ring text-[10px] uppercase tracking-[.15em] text-[#1c1c1c]/65 transition-colors hover:text-[#708238]" data-testid="link-back-top">Volver arriba ↑</a></div></div><div className="mx-auto mt-16 flex max-w-[1200px] flex-col justify-between gap-3 border-t border-[#1c1c1c]/15 pt-5 text-[10px] uppercase tracking-[.14em] text-[#1c1c1c]/40 md:flex-row"><span>© 2024 Sabor Urbano</span><span>Hecho para quedarse un rato</span></div></footer>;
}

function Home() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  useReveal();
  const scrollToReserve = () => document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' });
  return <div className="sabor-page min-h-[100dvh]"><Header onReserve={scrollToReserve} /><main><Hero onReserve={scrollToReserve} /><Story /><MenuSection /><Signature /><Gallery onOpen={setLightbox} /><Testimonials /><Reservation onComplete={() => setConfirmed(true)} /><Location /></main><Footer />
    {confirmed && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/75 px-5" role="dialog" aria-modal="true" aria-labelledby="reservation-confirmed-title"><div className="max-w-[470px] bg-[#fffcf0] p-8 md:p-12"><button onClick={() => setConfirmed(false)} aria-label="Cerrar confirmación" className="focus-ring float-right text-[#1c1c1c]/60 hover:text-[#1c1c1c]" data-testid="button-close-confirmation"><X size={20} /></button><p className="eyebrow text-[#708238]">Solicitud recibida</p><h2 id="reservation-confirmed-title" className="display mt-5 text-4xl leading-none">Tu mesa empieza<br />a tomar forma.</h2><p className="mt-5 text-sm leading-6 text-[#1c1c1c]/65">Gracias, {`ahí estaremos`}. Te enviaremos un email para confirmar todos los detalles de tu reserva.</p><button onClick={() => setConfirmed(false)} className="mt-8 bg-[#1c1c1c] px-5 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#fffef7]" data-testid="button-dismiss-confirmation">Perfecto</button></div></div>}
    {lightbox !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c1c]/95 p-5" role="dialog" aria-modal="true" aria-label="Galería ampliada"><button onClick={() => setLightbox(null)} aria-label="Cerrar galería" className="focus-ring absolute right-5 top-5 text-[#fffef7]" data-testid="button-close-lightbox"><X size={28} /></button><button onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)} aria-label="Imagen anterior" className="focus-ring absolute left-4 text-[#fffef7] md:left-10" data-testid="button-lightbox-prev"><ChevronLeft size={30} /></button><div className="max-h-[85vh] max-w-[1000px]"><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} className="max-h-[75vh] w-auto object-contain" /><p className="mt-4 text-center text-sm text-[#fffef7]/75">{gallery[lightbox].caption}</p></div><button onClick={() => setLightbox((lightbox + 1) % gallery.length)} aria-label="Siguiente imagen" className="focus-ring absolute right-4 text-[#fffef7] md:right-10" data-testid="button-lightbox-next"><ChevronRight size={30} /></button></div>}
  </div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;