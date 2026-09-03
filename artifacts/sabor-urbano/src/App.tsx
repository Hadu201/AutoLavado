import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Droplets, Instagram, MapPin, Menu as MenuIcon, Phone, ShieldCheck, Sparkles, Star, Timer, X } from 'lucide-react';
import heroImage from '../attached_assets/generated_images/urban_car_hero.jpg';
import foamImage from '../attached_assets/generated_images/foam_detail.jpg';
import interiorImage from '../attached_assets/generated_images/interior_detail.jpg';
import wheelImage from '../attached_assets/generated_images/wheel_detail.jpg';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Service = { name: string; description: string; duration: string; price: string; category: string; label?: string };
const services: Service[] = [
  { name: 'Lavado urbano', description: 'Prelavado a presión, espuma activa, secado a mano y cristales.', duration: '45 min', price: '24 €', category: 'Lavado', label: 'Más elegido' },
  { name: 'Brillo de ciudad', description: 'Lavado urbano más descontaminado ligero y acabado de neumáticos.', duration: '70 min', price: '42 €', category: 'Lavado' },
  { name: 'Interior Reset', description: 'Aspirado profundo, vapor, plásticos satinados y tratamiento de tapicería.', duration: '90 min', price: '58 €', category: 'Interior' },
  { name: 'Cabina nueva', description: 'Interior Reset con limpieza de techo, ozono y protección antiolor.', duration: '2 h 15 min', price: '96 €', category: 'Interior', label: 'Para volver a estrenar' },
  { name: 'Corrección de pintura', description: 'Pulido técnico en una etapa para devolver claridad y reflejo al barniz.', duration: '3 h 30 min', price: '165 €', category: 'Detailing' },
  { name: 'Urbano Ceramic', description: 'Preparación de pintura y coating cerámico con protección de hasta 12 meses.', duration: '1 día', price: '295 €', category: 'Detailing', label: 'Protección anual' },
];

const categories = ['Todo', 'Lavado', 'Interior', 'Detailing'];
const gallery = [
  { src: foamImage, alt: 'Espuma blanca cubriendo el capó de un coche grafito', caption: '01 / Espuma activa' },
  { src: interiorImage, alt: 'Interior de coche negro impecablemente detallado', caption: '02 / Interior reset' },
  { src: wheelImage, alt: 'Llanta de aleación pulida con gotas de agua', caption: '03 / Ruedas y acabado' },
  { src: heroImage, alt: 'Coche grafito recién lavado bajo luz azul', caption: '04 / Listo para salir' },
];

const testimonials = [
  { quote: 'Dejé el coche mientras hacía dos recados y volvió con un brillo que no recordaba.', name: 'Marta G.', detail: 'Volvo XC40 · Chamberí' },
  { quote: 'No es solo que lo limpien. Se nota que miran cada junta, cada rueda, cada detalle.', name: 'Álvaro P.', detail: 'Cupra Formentor · Cliente habitual' },
  { quote: 'Reservé por la mañana, lo recogí después de comer. Rápido, claro y muy bien hecho.', name: 'Nuria R.', detail: 'Toyota Yaris · Madrid' },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .1 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Header({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setOpen(false);
  const nav = [{ label: 'El método', href: '#metodo' }, { label: 'Servicios', href: '#servicios' }, { label: 'Galería', href: '#galeria' }, { label: 'Reservar', href: '#reservar' }];
  return (
    <header className={`nav-shell fixed inset-x-0 top-0 z-40 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <a href="#inicio" onClick={close} className="focus-ring flex items-center gap-3" data-testid="link-home">
          <span className="flex h-9 w-9 items-center justify-center border border-[#2d8cff] text-[14px] font-bold tracking-[-.08em] text-[#b9e769]">BU</span>
          <span className="hidden text-[11px] font-bold uppercase tracking-[.27em] sm:block">Brillo Urbano</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {nav.map((item) => <a key={item.href} href={item.href} className="focus-ring text-[10px] font-bold uppercase tracking-[.17em] text-[#f4f7fb]/75 transition-colors hover:text-[#b9e769]" data-testid={`link-nav-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</a>)}
        </nav>
        <div className="flex items-center gap-4">
          <a href="tel:+34915547821" className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#f4f7fb]/75 transition-colors hover:text-[#b9e769] xl:flex" data-testid="link-call-header"><Phone size={14} /> +34 915 547 821</a>
          <button onClick={onBook} className="hidden bg-[#2d8cff] px-5 py-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#f4f7fb] transition-colors hover:bg-[#b9e769] hover:text-[#0b1119] lg:block" data-testid="button-reserve-header">Reservar lavado</button>
          <button onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} className="focus-ring p-2 lg:hidden" data-testid="button-mobile-menu">{open ? <X size={23} /> : <MenuIcon size={23} />}</button>
        </div>
      </div>
      {open && <div className="border-t border-[#f4f7fb]/15 bg-[#0b1119] px-5 pb-7 pt-2 lg:hidden">
        {nav.map((item) => <a key={item.href} href={item.href} onClick={close} className="block border-b border-[#f4f7fb]/10 py-4 text-sm uppercase tracking-[.15em]" data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}>{item.label}</a>)}
        <a href="tel:+34915547821" className="flex items-center gap-2 pt-5 text-sm text-[#b9e769]" data-testid="link-call-mobile"><Phone size={15} /> +34 915 547 821</a>
      </div>}
    </header>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return <section id="inicio" className="hero-grain relative flex min-h-[750px] items-end overflow-hidden bg-[#0b1119] md:min-h-[850px]">
    <img src={heroImage} alt="Coche grafito recién detallado en un estudio urbano" className="hero-image absolute inset-0 h-full w-full object-cover opacity-75" fetchPriority="high" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1119] via-[#0b1119]/55 to-[#0b1119]/15" />
    <div className="absolute right-6 top-32 hidden text-right md:block"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f4f7fb]/55">Lavado & detailing</p><p className="mt-2 text-[10px] uppercase tracking-[.2em] text-[#b9e769]">Madrid · 2024</p></div>
    <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-20 pt-36 md:px-10 md:pb-28">
      <div className="hero-copy max-w-[900px] reveal">
        <p className="eyebrow mb-6 text-[#b9e769]">Cuidado automotriz · Madrid centro</p>
        <h1 className="display max-w-[900px] text-[clamp(4.5rem,12vw,11rem)] leading-[.78] tracking-[-.055em]">Tu coche.<br /><em className="text-[#2d8cff]">En su mejor</em><br />momento.</h1>
        <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-center">
          <p className="max-w-[290px] text-sm leading-6 text-[#f4f7fb]/72">Lavado y detailing de precisión, sin convertir el cuidado de tu coche en una tarea de todo el día.</p>
          <button onClick={onBook} className="group flex w-fit items-center gap-3 border border-[#2d8cff] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.17em] text-[#f4f7fb] transition-colors hover:bg-[#2d8cff]" data-testid="button-reserve-hero">Reservar una cita <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
        </div>
      </div>
      <a href="#metodo" className="focus-ring absolute bottom-8 right-5 hidden items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#f4f7fb]/55 md:flex" data-testid="link-scroll-story">Ver cómo trabajamos <ArrowDown size={15} className="text-[#b9e769]" /></a>
    </div>
  </section>;
}

function Method() {
  const points = [
    { icon: Droplets, number: '01', title: 'Preparamos', text: 'Ablandamos la suciedad antes de tocar la pintura. Menos fricción, mejor acabado.' },
    { icon: Sparkles, number: '02', title: 'Afinamos', text: 'Trabajamos a mano las zonas que una limpieza rápida siempre deja atrás.' },
    { icon: ShieldCheck, number: '03', title: 'Protegemos', text: 'Entregamos el coche limpio hoy y más fácil de mantener mañana.' },
  ];
  return <section id="metodo" className="bg-[#f1f5f9] px-5 py-24 md:px-10 md:py-36">
    <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-[.75fr_1.25fr] md:gap-24">
      <div className="reveal"><p className="eyebrow text-[#2d8cff]">01 — El método</p><div className="blue-line mt-6" /><p className="mt-10 text-[11px] font-bold uppercase tracking-[.18em] text-[#0f1724]/55">Precisión visible<br />en cada reflejo</p></div>
      <div className="reveal">
        <h2 className="display text-[clamp(3.2rem,6vw,6.3rem)] leading-[.84] tracking-[-.04em]">No limpiamos<br />coches. <em className="text-[#2d8cff]">Los<br />ponemos a punto.</em></h2>
        <p className="mt-9 max-w-[620px] text-lg leading-8 text-[#0f1724]/65">Brillo Urbano nace para quienes cuidan lo que conducen. Hemos quitado lo innecesario del proceso y hemos dejado solo lo que se nota: productos correctos, manos expertas y un ritmo que encaja en tu ciudad.</p>
        <div className="mt-12 grid max-w-[600px] grid-cols-2 gap-8 border-t border-[#0f1724]/15 pt-7 sm:grid-cols-3">
          <div><p className="display text-4xl text-[#2d8cff]">7 años</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0f1724]/50">Puliendo detalles</p></div>
          <div><p className="display text-4xl text-[#2d8cff]">38 min</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0f1724]/50">Lavado medio</p></div>
          <div><p className="display text-4xl text-[#2d8cff]">4.9/5</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0f1724]/50">Valoración media</p></div>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-24 grid max-w-[1200px] gap-px bg-[#0f1724]/15 md:grid-cols-3">
      {points.map(({ icon: Icon, number, title, text }, index) => <article key={number} className="reveal bg-[#e6edf4] p-7 md:p-9" style={{ transitionDelay: `${index * 90}ms` }} data-testid={`card-method-${number}`}>
        <div className="flex items-center justify-between"><span className="display text-4xl text-[#2d8cff]">{number}</span><Icon size={21} strokeWidth={1.5} className="text-[#2d8cff]" /></div><h3 className="display mt-14 text-3xl">{title}</h3><p className="mt-3 text-sm leading-6 text-[#0f1724]/60">{text}</p>
      </article>)}
    </div>
  </section>;
}

function Services() {
  const [category, setCategory] = useState('Todo');
  const filtered = useMemo(() => category === 'Todo' ? services : services.filter((service) => service.category === category), [category]);
  return <section id="servicios" className="bg-[#dce6ef] px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]">
      <div className="reveal flex flex-col justify-between gap-8 border-b border-[#0f1724]/20 pb-10 md:flex-row md:items-end">
        <div><p className="eyebrow text-[#2d8cff]">02 — Servicios</p><h2 className="display mt-5 text-[clamp(3.3rem,7vw,7rem)] leading-[.78] tracking-[-.05em]">Elige tu<br /><em>nivel de brillo.</em></h2></div>
        <p className="max-w-[290px] text-sm leading-6 text-[#0f1724]/65">Desde un lavado que cabe entre reuniones hasta una protección para todo el año.</p>
      </div>
      <div className="reveal mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías de servicios">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} role="tab" aria-selected={category === item} className={`focus-ring px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] transition-colors ${category === item ? 'bg-[#0b1119] text-[#f4f7fb]' : 'border border-[#0f1724]/25 text-[#0f1724]/65 hover:border-[#0f1724]'}`} data-testid={`button-menu-${item.toLowerCase()}`}>{item}</button>)}
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {filtered.map((service, index) => <article key={service.name} className="service-card reveal border border-[#0f1724]/15 bg-[#e6edf4] p-6 md:p-8" style={{ transitionDelay: `${index * 45}ms` }} data-testid={`card-service-${service.name.toLowerCase().replaceAll(' ', '-')}`}>
          <div className="flex items-start justify-between gap-6"><div><div className="flex flex-wrap items-center gap-3"><h3 className="display text-3xl">{service.name}</h3>{service.label && <span className="border border-[#2d8cff]/60 px-2 py-1 text-[9px] uppercase tracking-[.1em] text-[#1473df]">{service.label}</span>}</div><p className="mt-3 max-w-[430px] text-sm leading-6 text-[#0f1724]/60">{service.description}</p></div><span className="display whitespace-nowrap text-2xl text-[#1473df]">{service.price}</span></div>
          <div className="mt-7 flex items-center gap-2 border-t border-[#0f1724]/12 pt-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#0f1724]/50"><Timer size={14} className="text-[#2d8cff]" /> {service.duration} <span className="mx-1 text-[#0f1724]/20">/</span> {service.category}</div>
        </article>)}
      </div>
      <p className="mt-6 text-xs text-[#0f1724]/50">Precios orientativos para turismos. Te recomendamos reservar para asegurar tu franja.</p>
    </div>
  </section>;
}

function Signature({ onBook }: { onBook: () => void }) {
  return <section className="signature-section bg-[#0b1119] px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]">
      <div className="reveal flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow text-[#b9e769]">03 — Trabajo fino</p><h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.8] tracking-[-.05em]">Lo que hace<br />que <em className="text-[#2d8cff]">mires atrás.</em></h2></div><p className="max-w-[280px] text-sm leading-6 text-[#f4f7fb]/55">La diferencia vive en las superficies que casi nadie mira. Nosotros sí.</p></div>
      <div className="mt-14 grid gap-5 md:grid-cols-[1.35fr_.65fr]">
        <div className="image-hover reveal group relative min-h-[450px] overflow-hidden md:min-h-[590px]"><img src={foamImage} alt="Espuma activa en el capó de un coche" loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1119] p-7 pt-24"><p className="eyebrow text-[#b9e769]">El ritual</p><h3 className="display mt-2 text-4xl">Lavado sin prisa</h3><p className="mt-2 text-sm text-[#f4f7fb]/65">Espuma activa · dos cubos · secado a mano</p></div></div>
        <div className="image-hover reveal group relative min-h-[360px] overflow-hidden md:min-h-[590px]"><img src={interiorImage} alt="Interior de coche tratado con detalle" loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1119] p-6 pt-24"><p className="eyebrow text-[#b9e769]">La cabina</p><h3 className="display mt-2 text-3xl">Interior Reset</h3><p className="mt-2 text-sm text-[#f4f7fb]/65">Vapor · aspirado · protección</p></div></div>
      </div>
      <div className="reveal mt-12 flex flex-col items-start justify-between gap-5 border-t border-[#f4f7fb]/15 pt-6 sm:flex-row sm:items-center"><p className="text-sm text-[#f4f7fb]/60">¿No sabes cuál necesita tu coche? Te orientamos en 2 minutos.</p><button onClick={onBook} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#b9e769] transition-colors hover:text-[#f4f7fb]" data-testid="button-signature-book">Hablar con el estudio <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></button></div>
    </div>
  </section>;
}

function Gallery({ onOpen }: { onOpen: (index: number) => void }) {
  return <section id="galeria" className="bg-[#f1f5f9] px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1200px]"><div className="reveal flex items-end justify-between"><div><p className="eyebrow text-[#2d8cff]">04 — La mirada</p><h2 className="display mt-5 text-[clamp(3.2rem,7vw,7rem)] leading-[.78] tracking-[-.05em]">La prueba<br /><em>está en la luz.</em></h2></div><p className="hidden text-[10px] uppercase tracking-[.18em] text-[#0f1724]/50 md:block">Haz clic para ampliar</p></div>
      <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[220px_220px]">{gallery.map((item, index) => <button key={item.caption} onClick={() => onOpen(index)} className={`gallery-tile image-hover focus-ring relative overflow-hidden text-left ${index === 0 ? 'col-span-2 row-span-2' : index === 1 ? 'col-span-2' : 'col-span-2 md:col-span-1'}`} data-testid={`button-gallery-${index}`}><img src={item.src} alt={item.alt} loading="lazy" className="h-full min-h-[180px] w-full object-cover" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1119]/85 p-4 pt-12 text-xs text-[#f4f7fb]">{item.caption}</span></button>)}</div>
    </div>
  </section>;
}

function Testimonials() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setCurrent((value) => (value + 1) % testimonials.length), 6000); return () => window.clearInterval(timer); }, []);
  const item = testimonials[current];
  return <section className="testimonials-section bg-[#2d8cff] px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[1040px] reveal"><div className="flex items-center gap-3"><span className="flex gap-0.5 text-[#b9e769]" aria-label="5 de 5 estrellas">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} fill="currentColor" strokeWidth={1.5} />)}</span><span className="eyebrow text-[#f4f7fb]/75">Lo dicen al recogerlo</span></div><div className="quote-fade mt-10 min-h-[220px]" key={current}><blockquote className="display max-w-[950px] text-[clamp(2.5rem,5vw,5.5rem)] leading-[.9] tracking-[-.035em]">“{item.quote}”</blockquote><p className="mt-10 text-sm font-semibold">{item.name} <span className="ml-2 font-normal text-[#f4f7fb]/65">/ {item.detail}</span></p></div><div className="mt-10 flex items-center justify-between border-t border-[#f4f7fb]/25 pt-5"><div className="flex gap-2">{testimonials.map((_, index) => <button key={index} aria-label={`Ver reseña ${index + 1}`} onClick={() => setCurrent(index)} className={`h-1.5 transition-all ${index === current ? 'w-10 bg-[#b9e769]' : 'w-5 bg-[#f4f7fb]/35'}`} data-testid={`button-testimonial-${index}`} />)}</div><div className="flex gap-2"><button onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)} className="focus-ring border border-[#f4f7fb]/30 p-3 transition-colors hover:bg-[#f4f7fb] hover:text-[#2d8cff]" aria-label="Reseña anterior" data-testid="button-testimonial-prev"><ChevronLeft size={17} /></button><button onClick={() => setCurrent((current + 1) % testimonials.length)} className="focus-ring border border-[#f4f7fb]/30 p-3 transition-colors hover:bg-[#f4f7fb] hover:text-[#2d8cff]" aria-label="Siguiente reseña" data-testid="button-testimonial-next"><ChevronRight size={17} /></button></div></div></div></section>;
}

type Booking = { date: string; time: string; vehicle: string; name: string; email: string; phone: string };
function Reservation({ onComplete }: { onComplete: (booking: Booking) => void }) {
  const [error, setError] = useState('');
  const [form, setForm] = useState<Booking>({ date: '', time: '09:30', vehicle: 'Turismo', name: '', email: '', phone: '' });
  const update = (key: keyof Booking) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.date || !form.name.trim() || !form.email.includes('@') || form.phone.trim().length < 9) { setError('Completa nombre, email, teléfono y una fecha válida.'); return; } setError(''); onComplete(form); };
  return <section id="reservar" className="bg-[#b9e769] px-5 py-24 md:px-10 md:py-32"><div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-[.8fr_1.2fr]"><div className="reveal"><p className="eyebrow text-[#1473df]">05 — Tu cita</p><h2 className="display mt-5 text-[clamp(3.5rem,7vw,7rem)] leading-[.78] tracking-[-.05em]">Tu coche<br />tiene una<br /><em className="text-[#1473df]">hora libre.</em></h2><p className="mt-8 max-w-[300px] text-sm leading-6 text-[#0f1724]/65">Reserva tu franja. Nosotros nos encargamos del resto. Si tienes dudas sobre el servicio, llámanos y lo vemos contigo.</p><a href="tel:+34915547821" className="focus-ring mt-8 flex w-fit items-center gap-3 text-[11px] font-bold uppercase tracking-[.16em] text-[#0f1724] transition-colors hover:text-[#1473df]" data-testid="link-call-booking"><Phone size={16} /> +34 915 547 821</a></div>
      <form onSubmit={submit} className="reveal border-t border-[#0f1724]/25 pt-8" noValidate><div className="grid gap-7 sm:grid-cols-2"><label className="block"><span className="eyebrow text-[#0f1724]/55">Fecha</span><span className="relative mt-3 block"><CalendarDays size={16} className="pointer-events-none absolute left-0 top-3 text-[#1473df]" /><input type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={update('date')} className="booking-input focus-ring w-full py-2 pl-7 text-sm outline-none" data-testid="input-reservation-date" /></span></label><label className="block"><span className="eyebrow text-[#0f1724]/55">Hora</span><span className="relative mt-3 block"><Clock3 size={16} className="pointer-events-none absolute left-0 top-3 text-[#1473df]" /><select value={form.time} onChange={update('time')} className="booking-input focus-ring w-full appearance-none py-2 pl-7 text-sm outline-none" data-testid="select-reservation-time">{['08:30', '09:30', '11:00', '13:30', '16:00', '18:00'].map((time) => <option key={time}>{time}</option>)}</select></span></label><label className="block"><span className="eyebrow text-[#0f1724]/55">Tipo de vehículo</span><select value={form.vehicle} onChange={update('vehicle')} className="booking-input focus-ring mt-3 w-full py-2 text-sm outline-none" data-testid="select-reservation-vehicle">{['Turismo', 'SUV / 4x4', 'Coupé', 'Furgoneta', 'Moto'].map((vehicle) => <option key={vehicle}>{vehicle}</option>)}</select></label><label className="block"><span className="eyebrow text-[#0f1724]/55">Tu nombre</span><input value={form.name} onChange={update('name')} placeholder="Cómo te llamamos" className="booking-input focus-ring mt-3 w-full py-2 text-sm outline-none placeholder:text-[#0f1724]/35" data-testid="input-reservation-name" /></label><label className="block"><span className="eyebrow text-[#0f1724]/55">Email</span><input type="email" value={form.email} onChange={update('email')} placeholder="Para confirmar la cita" className="booking-input focus-ring mt-3 w-full py-2 text-sm outline-none placeholder:text-[#0f1724]/35" data-testid="input-reservation-email" /></label><label className="block"><span className="eyebrow text-[#0f1724]/55">Teléfono</span><input type="tel" value={form.phone} onChange={update('phone')} placeholder="600 000 000" className="booking-input focus-ring mt-3 w-full py-2 text-sm outline-none placeholder:text-[#0f1724]/35" data-testid="input-reservation-phone" /></label></div>{error && <p className="mt-6 text-sm text-[#a62d32]" role="alert" data-testid="status-reservation-error">{error}</p>}<button type="submit" className="group mt-10 flex items-center gap-3 bg-[#0b1119] px-6 py-4 text-[11px] font-bold uppercase tracking-[.17em] text-[#f4f7fb] transition-colors hover:bg-[#2d8cff]" data-testid="button-submit-reservation">Confirmar solicitud <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button><p className="mt-4 text-[11px] text-[#0f1724]/50">Te escribiremos para confirmar disponibilidad. Sin pagos y sin compromiso.</p></form>
    </div></section>;
}

function Location() {
  return <section id="contacto" className="grid md:grid-cols-2"><div className="map-grid relative min-h-[420px] overflow-hidden"><div className="absolute inset-0 bg-[#2d8cff]/10" /><div className="absolute left-[53%] top-[43%]"><div className="map-pin flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#2d8cff] text-[#f4f7fb]"><MapPin size={21} /></div><span className="absolute left-7 top-7 whitespace-nowrap bg-[#0b1119] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#f4f7fb]">Brillo Urbano</span></div><div className="absolute bottom-6 left-6 border-l-2 border-[#2d8cff] bg-[#f1f5f9]/90 px-4 py-3 text-[10px] uppercase tracking-[.14em] text-[#0f1724]/65">Calle del Barquillo<br />Madrid centro</div></div><div className="location-details bg-[#0b1119] px-5 py-20 md:px-16 md:py-28"><p className="eyebrow text-[#b9e769]">06 — Ven a vernos</p><h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.8] tracking-[-.05em]">En el centro<br />de tu <em className="text-[#2d8cff]">ruta.</em></h2><div className="mt-12 space-y-6 text-sm"><a href="https://maps.google.com/?q=Calle+del+Barquillo+Madrid" target="_blank" rel="noreferrer" className="focus-ring flex items-start gap-4 transition-colors hover:text-[#b9e769]" data-testid="link-map"><MapPin size={17} className="mt-0.5 text-[#b9e769]" /><span>Calle del Barquillo, 23<br />28004 Madrid</span></a><a href="tel:+34915547821" className="focus-ring flex items-center gap-4 transition-colors hover:text-[#b9e769]" data-testid="link-call-contact"><Phone size={17} className="text-[#b9e769]" /> +34 915 547 821</a><p className="flex items-start gap-4"><Clock3 size={17} className="mt-0.5 text-[#b9e769]" /><span>Lunes — Viernes · 08:30 — 19:30<br />Sábado · 09:00 — 14:00</span></p></div></div></section>;
}

function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); if (email.includes('@')) setSent(true); };
  return <footer className="bg-[#dce6ef] px-5 py-16 md:px-10 md:py-20"><div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1fr_1fr_auto]"><div><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-[#0f1724] text-[14px] font-bold tracking-[-.08em]">BU</span><span className="text-[11px] font-bold uppercase tracking-[.28em]">Brillo Urbano</span></div><p className="mt-5 max-w-[260px] text-sm leading-6 text-[#0f1724]/55">El estudio de lavado y detailing para coches que tienen ciudad por delante.</p></div><div><p className="eyebrow text-[#1473df]">Kilómetros de cuidado</p><p className="mt-4 max-w-[290px] text-sm leading-6 text-[#0f1724]/65">Consejos de mantenimiento, huecos de última hora y promociones puntuales. Dos veces al mes.</p>{sent ? <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#1473df]" role="status" data-testid="status-newsletter-success"><Check size={16} /> Apuntado. Nos vemos en ruta.</p> : <form onSubmit={submit} className="mt-5 flex max-w-[310px] border-b border-[#0f1724]/30"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu email" className="focus-ring min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#0f1724]/40" data-testid="input-newsletter-email" /><button type="submit" aria-label="Suscribirse a consejos y promociones" className="focus-ring px-2 text-[#1473df] transition-colors hover:text-[#0f1724]" data-testid="button-newsletter-submit"><ArrowRight size={16} /></button></form>}</div><div className="flex items-start gap-5 md:justify-self-end"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="focus-ring text-[#0f1724]/65 transition-colors hover:text-[#1473df]" data-testid="link-instagram"><Instagram size={21} /></a><a href="#inicio" className="focus-ring text-[10px] uppercase tracking-[.15em] text-[#0f1724]/65 transition-colors hover:text-[#1473df]" data-testid="link-back-top">Volver arriba ↑</a></div></div><div className="mx-auto mt-16 flex max-w-[1200px] flex-col justify-between gap-3 border-t border-[#0f1724]/15 pt-5 text-[10px] uppercase tracking-[.14em] text-[#0f1724]/40 md:flex-row"><span>© 2024 Brillo Urbano</span><span>Hecho para que tu coche vuelva a destacar</span></div></footer>;
}

function BookingModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1119]/80 px-5" role="dialog" aria-modal="true" aria-labelledby="reservation-confirmed-title"><div className="w-full max-w-[500px] bg-[#f1f5f9] p-8 md:p-12"><button onClick={onClose} aria-label="Cerrar confirmación" className="focus-ring float-right text-[#0f1724]/60 hover:text-[#0f1724]" data-testid="button-close-confirmation"><X size={20} /></button><p className="eyebrow text-[#1473df]">Solicitud recibida</p><h2 id="reservation-confirmed-title" className="display mt-5 text-5xl leading-[.82]">Tu cita ya<br />está en camino.</h2><p className="mt-5 text-sm leading-6 text-[#0f1724]/65">Gracias, {booking.name}. Hemos guardado tu preferencia para el {booking.date} a las {booking.time}. Te escribiremos a {booking.email} para confirmar el hueco.</p><div className="mt-7 grid grid-cols-2 gap-3 border-y border-[#0f1724]/15 py-5 text-[10px] font-bold uppercase tracking-[.14em]"><span className="text-[#0f1724]/50">Vehículo<br /><strong className="mt-1 block text-[#0f1724]">{booking.vehicle}</strong></span><span className="text-[#0f1724]/50">Teléfono<br /><strong className="mt-1 block text-[#0f1724]">{booking.phone}</strong></span></div><button onClick={onClose} className="mt-8 bg-[#0b1119] px-5 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#f4f7fb] transition-colors hover:bg-[#2d8cff]" data-testid="button-dismiss-confirmation">Perfecto</button></div></div>;
}

function Home() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  useReveal();
  const scrollToBook = () => document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' });
  return <div className="sabor-page min-h-[100dvh]"><Header onBook={scrollToBook} /><main><Hero onBook={scrollToBook} /><Method /><Services /><Signature onBook={scrollToBook} /><Gallery onOpen={setLightbox} /><Testimonials /><Reservation onComplete={setBooking} /><Location /></main><Footer />
    {booking && <BookingModal booking={booking} onClose={() => setBooking(null)} />}
    {lightbox !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1119]/95 p-5" role="dialog" aria-modal="true" aria-label="Galería ampliada"><button onClick={() => setLightbox(null)} aria-label="Cerrar galería" className="focus-ring absolute right-5 top-5 text-[#f4f7fb]" data-testid="button-close-lightbox"><X size={28} /></button><button onClick={() => setLightbox((lightbox - 1 + gallery.length) % gallery.length)} aria-label="Imagen anterior" className="focus-ring absolute left-4 text-[#f4f7fb] md:left-10" data-testid="button-lightbox-prev"><ChevronLeft size={30} /></button><div className="max-h-[85vh] max-w-[1000px]"><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} className="max-h-[75vh] w-auto object-contain" /><p className="mt-4 text-center text-sm text-[#f4f7fb]/75">{gallery[lightbox].caption}</p></div><button onClick={() => setLightbox((lightbox + 1) % gallery.length)} aria-label="Siguiente imagen" className="focus-ring absolute right-4 text-[#f4f7fb] md:right-10" data-testid="button-lightbox-next"><ChevronRight size={30} /></button></div>}
  </div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;