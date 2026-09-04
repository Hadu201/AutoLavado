import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CarFront,
  Check,
  Clock3,
  Droplets,
  MapPin,
  Menu as MenuIcon,
  Phone,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const brandImage =
  'https://res.cloudinary.com/dsleqvjr/image/upload/v1788479431/ChatGPT_Image_12_jul_2026_21_06_42.png';
const whatsappUrl =
  'https://wa.me/56935950592?text=Hola%2C%20quiero%20reservar%20un%20servicio%20en%20SPA%20CAR%20WASH%20SANTIAGO.';

type PriceRow = {
  name: string;
  car: string;
  suv: string;
  category: string;
  featured?: boolean;
};

const priceRows: PriceRow[] = [
  { name: 'Lavado y Aspirado Full', car: '$25.000', suv: '$25.000', category: 'Lavado', featured: true },
  { name: 'Lavado Exterior', car: '$15.000', suv: '$20.000', category: 'Lavado' },
  { name: 'Aspirado', car: '$15.000', suv: '$20.000', category: 'Interior' },
  { name: 'Limpieza de Techo', car: '$25.000', suv: '$30.000', category: 'Interior' },
  { name: 'Limpieza de Alfombra', car: '$40.000', suv: '$50.000', category: 'Interior' },
  { name: 'Lavado Tapiz', car: '$70.000', suv: '$80.000', category: 'Interior', featured: true },
  { name: 'Limpieza Humectación de Cuero', car: '$50.000', suv: '$60.000', category: 'Interior' },
  { name: 'Pulido por Llanta', car: '$10.000', suv: '$10.000', category: 'Pulido' },
  { name: 'Pulido Focos Delanteros + Sellante', car: '$30.000', suv: '$30.000', category: 'Pulido' },
  { name: 'Pulido Carrocería', car: '$100.000', suv: '$120.000', category: 'Pulido', featured: true },
  { name: 'Grabado de Patente (Ácido)', car: '$5.000', suv: '$5.000', category: 'Adicionales' },
  { name: 'Grabado de Patente (Tallado)', car: '$8.000', suv: '$8.000', category: 'Adicionales' },
  { name: 'Servicio de Ceramizado', car: '$250.000', suv: '$300.000', category: 'Protección', featured: true },
  { name: 'Servicio Pre-Venta (Full + Pulido + Tapiz + Techo + Alfombra)', car: '$250.000', suv: '$300.000', category: 'Protección', featured: true },
];

const categories = ['Todos', 'Lavado', 'Interior', 'Pulido', 'Protección'];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
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
  const nav = [
    { label: 'La experiencia', href: '#experiencia' },
    { label: 'Tarifario', href: '#tarifario' },
    { label: 'Compromisos', href: '#compromisos' },
    { label: 'Reserva', href: '#reservas' },
  ];
  return (
    <header className={`nav-shell fixed inset-x-0 top-0 z-40 ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <a href="#inicio" onClick={close} className="focus-ring flex items-center gap-3" data-testid="link-home">
          <span className="brand-mark flex h-9 w-9 items-center justify-center border text-[12px] font-bold tracking-[-.08em]">SC</span>
          <span className="hidden text-[11px] font-bold uppercase tracking-[.19em] sm:block">SPA CAR WASH SANTIAGO</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring text-[10px] font-bold uppercase tracking-[.15em] text-[#f7fbff]/75 transition-colors hover:text-[#55b9ff]"
              data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#f7fbff]/75 transition-colors hover:text-[#b9e769] xl:flex"
            data-testid="link-whatsapp-header"
          >
            <Phone size={14} /> +56 9 3595 0592
          </a>
          <button
            onClick={onBook}
            className="hidden bg-[#55b9ff] px-5 py-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#06111c] transition-colors hover:bg-[#b9e769] lg:block"
            data-testid="button-reserve-header"
          >
            Reserva ahora
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="focus-ring p-2 lg:hidden"
            data-testid="button-mobile-menu"
          >
            {open ? <X size={23} /> : <MenuIcon size={23} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#f7fbff]/15 bg-[#07121e] px-5 pb-7 pt-2 lg:hidden">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="block border-b border-[#f7fbff]/10 py-4 text-sm uppercase tracking-[.13em]"
              data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
            >
              {item.label}
            </a>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 pt-5 text-sm text-[#b9e769]" data-testid="link-whatsapp-mobile">
            <Phone size={15} /> Reservar por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="inicio" className="hero-grain relative flex min-h-[760px] items-end overflow-hidden bg-[#07121e] md:min-h-[850px]">
      <img src={brandImage} alt="SPA CAR WASH SANTIAGO" className="hero-image absolute inset-0 h-full w-full object-cover opacity-80" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07121e] via-[#07121e]/55 to-[#07121e]/15" />
      <div className="absolute right-6 top-32 hidden text-right md:block">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f7fbff]/55">Autolavado & detailing</p>
        <p className="mt-2 text-[10px] uppercase tracking-[.2em] text-[#b9e769]">Valdivia · Nivel -1</p>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-20 pt-36 md:px-10 md:pb-28">
        <div className="hero-copy max-w-[930px] reveal">
          <p className="eyebrow mb-6 text-[#b9e769]">Cuidado automotriz · Mall Plaza de los Ríos</p>
          <h1 className="display max-w-[930px] text-[clamp(4rem,12vw,11rem)] leading-[.78] tracking-[-.055em]">
            ¡Tu auto en las<br /><em className="text-[#55b9ff]">mejores manos!</em>
          </h1>
          <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-center">
            <p className="max-w-[330px] text-sm leading-6 text-[#f7fbff]/75">
              Limpieza profesional, acabados impecables y la puntualidad que tu día necesita.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex w-fit items-center gap-3 border border-[#55b9ff] px-5 py-3.5 text-[11px] font-bold uppercase tracking-[.17em] text-[#f7fbff] transition-colors hover:bg-[#55b9ff] hover:text-[#06111c]"
              data-testid="button-reserve-hero"
            >
              Reserva ahora <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
        <button onClick={onBook} className="focus-ring absolute bottom-8 right-5 hidden items-center gap-3 text-[10px] uppercase tracking-[.2em] text-[#f7fbff]/55 md:flex" data-testid="link-scroll-reservation">
          Asegura tu hora <ArrowDown size={15} className="text-[#b9e769]" />
        </button>
      </div>
    </section>
  );
}

function Experience() {
  const points = [
    { icon: Droplets, number: '01', title: 'Limpieza profesional', text: 'Productos adecuados y manos expertas para cuidar cada superficie de tu vehículo.' },
    { icon: Sparkles, number: '02', title: 'Acabados impecables', text: 'Nos detenemos en los detalles que transforman una limpieza en una verdadera renovación.' },
    { icon: ShieldCheck, number: '03', title: 'Rápido y puntual', text: 'Tu auto queda listo cuando lo necesitas, con un proceso claro y sin sorpresas.' },
  ];
  return (
    <section id="experiencia" className="bg-[#f1f6fa] px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-[.75fr_1.25fr] md:gap-24">
        <div className="reveal">
          <p className="eyebrow text-[#168fe0]">01 — Nuestra promesa</p>
          <div className="blue-line mt-6" />
          <p className="mt-10 text-[11px] font-bold uppercase tracking-[.18em] text-[#0b1a29]/55">Tu auto vuelve<br />a destacar</p>
        </div>
        <div className="reveal">
          <h2 className="display text-[clamp(3.2rem,6vw,6.3rem)] leading-[.84] tracking-[-.04em]">
            Cuidamos cada<br />detalle. <em className="text-[#168fe0]">Se nota<br />a primera vista.</em>
          </h2>
          <p className="mt-9 max-w-[620px] text-lg leading-8 text-[#0b1a29]/65">
            En SPA CAR WASH SANTIAGO trabajamos para que tu vehículo se sienta nuevo otra vez. Estamos ubicados por la entrada de Arauco, en el Nivel -1 de Mall Plaza de los Ríos, Valdivia.
          </p>
          <div className="mt-12 grid max-w-[600px] grid-cols-2 gap-8 border-t border-[#0b1a29]/15 pt-7 sm:grid-cols-3">
            <div><p className="display text-4xl text-[#168fe0]">100%</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0b1a29]/50">Satisfacción</p></div>
            <div><p className="display text-4xl text-[#168fe0]">Nivel -1</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0b1a29]/50">Mall Plaza</p></div>
            <div><p className="display text-4xl text-[#168fe0]">Valdivia</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-[#0b1a29]/50">Estamos aquí</p></div>
          </div>
        </div>
      </div>
      <div id="compromisos" className="mx-auto mt-24 grid max-w-[1200px] gap-px bg-[#0b1a29]/15 md:grid-cols-3">
        {points.map(({ icon: Icon, number, title, text }, index) => (
          <article key={number} className="reveal bg-[#e4edf4] p-7 md:p-9" style={{ transitionDelay: `${index * 90}ms` }} data-testid={`card-promise-${number}`}>
            <div className="flex items-center justify-between"><span className="display text-4xl text-[#168fe0]">{number}</span><Icon size={21} strokeWidth={1.5} className="text-[#168fe0]" /></div>
            <h3 className="display mt-14 text-3xl">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#0b1a29]/60">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Tariff() {
  const [category, setCategory] = useState('Todos');
  const filtered = useMemo(() => category === 'Todos' ? priceRows : priceRows.filter((row) => row.category === category), [category]);
  return (
    <section id="tarifario" className="bg-[#dce8f1] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="reveal flex flex-col justify-between gap-8 border-b border-[#0b1a29]/20 pb-10 md:flex-row md:items-end">
          <div><p className="eyebrow text-[#168fe0]">02 — Tarifario mural</p><h2 className="display mt-5 text-[clamp(3.3rem,7vw,7rem)] leading-[.78] tracking-[-.05em]">Elige el<br /><em>cuidado justo.</em></h2></div>
          <p className="max-w-[320px] text-sm leading-6 text-[#0b1a29]/65">Precios transparentes para autos, camionetas y camionetas grandes / 4x4.</p>
        </div>
        <div className="reveal mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorías del tarifario">
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} role="tab" aria-selected={category === item} className={`focus-ring px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] transition-colors ${category === item ? 'bg-[#07121e] text-[#f7fbff]' : 'border border-[#0b1a29]/25 text-[#0b1a29]/65 hover:border-[#0b1a29]'}`} data-testid={`button-price-${item.toLowerCase()}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-7 overflow-x-auto border border-[#0b1a29]/15 bg-[#f5f9fc]">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-[#07121e] text-[#f7fbff]">
              <tr>
                <th className="px-5 py-5 text-[10px] font-bold uppercase tracking-[.14em]">Servicio</th>
                <th className="px-5 py-5 text-right text-[10px] font-bold uppercase tracking-[.14em]">Autos / Camionetas</th>
                <th className="px-5 py-5 text-right text-[10px] font-bold uppercase tracking-[.14em]">Camionetas grandes / 4x4</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr key={row.name} className="price-row border-b border-[#0b1a29]/10 last:border-b-0" data-testid={`row-price-${index}`}>
                  <td className="px-5 py-5"><div className="flex items-center gap-3"><span className={`price-dot ${row.featured ? 'is-featured' : ''}`} /><span className="display text-2xl">{row.name}</span></div><span className="ml-5 text-[10px] font-bold uppercase tracking-[.12em] text-[#0b1a29]/40">{row.category}</span></td>
                  <td className="px-5 py-5 text-right text-base font-semibold text-[#168fe0]">{row.car}</td>
                  <td className="px-5 py-5 text-right text-base font-semibold text-[#168fe0]">{row.suv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-[#0b1a29]/55">El Servicio Pre-Venta incluye Full + Pulido + Tapiz + Techo + Alfombra.</p>
      </div>
    </section>
  );
}

function Feature() {
  return (
    <section className="feature-section bg-[#07121e] px-5 py-24 text-[#f7fbff] md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[.8fr_1.2fr] md:items-center">
        <div className="reveal">
          <p className="eyebrow text-[#b9e769]">03 — La diferencia</p>
          <h2 className="display mt-5 text-[clamp(3.2rem,6vw,6.3rem)] leading-[.82] tracking-[-.05em]">Un acabado<br />que habla<br /><em className="text-[#55b9ff]">por sí solo.</em></h2>
          <p className="mt-8 max-w-[330px] text-sm leading-6 text-[#f7fbff]/65">Solicita tu servicio con nuestro recepcionista y asegura un acabado impecable para tu auto.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="group mt-9 flex w-fit items-center gap-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#b9e769] transition-colors hover:text-[#f7fbff]" data-testid="button-feature-whatsapp">
            Solicita tu servicio <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <div className="image-hover reveal relative min-h-[460px] overflow-hidden md:min-h-[620px]">
          <img src={brandImage} alt="Vehículo atendido por SPA CAR WASH SANTIAGO" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07121e] p-7 pt-28">
            <p className="eyebrow text-[#b9e769]">Sellos de compromiso</p>
            <p className="mt-3 max-w-[540px] text-2xl font-semibold leading-snug">Limpieza Profesional · Acabados Impecables · Rápido y Puntual · 100% Satisfacción</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reservation() {
  return (
    <section id="reservas" className="reservation-section bg-[#b9e769] px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div className="reveal">
          <p className="eyebrow text-[#0876bd]">04 — Reserva ahora</p>
          <h2 className="display mt-5 text-[clamp(3.6rem,8vw,8rem)] leading-[.76] tracking-[-.06em]">Tu auto en<br /><em className="text-[#0876bd]">las mejores<br />manos.</em></h2>
        </div>
        <div className="reveal md:pb-2">
          <p className="max-w-[430px] text-lg leading-8 text-[#06111c]/70">La reserva se gestiona únicamente por WhatsApp. Envía tu solicitud y asegura tu hora sin hablar directamente con el estudio.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="group mt-9 flex w-fit items-center gap-3 bg-[#07121e] px-7 py-5 text-[11px] font-bold uppercase tracking-[.18em] text-[#f7fbff] transition-colors hover:bg-[#168fe0]" data-testid="button-reserve-whatsapp">
            Reservar ahora por WhatsApp <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#06111c]/55"><Phone size={14} /> +56 9 3595 0592</p>
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="ubicacion" className="grid md:grid-cols-2">
      <div className="map-grid relative min-h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-[#55b9ff]/10" />
        <div className="absolute left-[53%] top-[43%]">
          <div className="map-pin flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#55b9ff] text-[#07121e]"><MapPin size={21} /></div>
          <span className="absolute left-7 top-7 whitespace-nowrap bg-[#07121e] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#f7fbff]">SPA CAR WASH SANTIAGO</span>
        </div>
        <div className="absolute bottom-6 left-6 border-l-2 border-[#168fe0] bg-[#f1f6fa]/90 px-4 py-3 text-[10px] uppercase tracking-[.14em] text-[#0b1a29]/65">Entrada de Arauco<br />Nivel -1</div>
      </div>
      <div className="location-details bg-[#07121e] px-5 py-20 text-[#f7fbff] md:px-16 md:py-28">
        <p className="eyebrow text-[#b9e769]">05 — Encuéntranos</p>
        <h2 className="display mt-5 text-[clamp(3rem,6vw,6rem)] leading-[.8] tracking-[-.05em]">Por la entrada<br />de <em className="text-[#55b9ff]">Arauco.</em></h2>
        <div className="mt-12 space-y-6 text-sm">
          <a href="https://maps.google.com/?q=Mall+Plaza+de+los+Rios+Valdivia" target="_blank" rel="noreferrer" className="focus-ring flex items-start gap-4 transition-colors hover:text-[#b9e769]" data-testid="link-map">
            <MapPin size={17} className="mt-0.5 text-[#b9e769]" /><span>Mall Plaza de los Ríos<br />Valdivia · Entrada de Arauco · Nivel -1</span>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="focus-ring flex items-center gap-4 transition-colors hover:text-[#b9e769]" data-testid="link-whatsapp-contact">
            <Phone size={17} className="text-[#b9e769]" /> +56 9 3595 0592 · WhatsApp
          </a>
          <p className="flex items-start gap-4"><Clock3 size={17} className="mt-0.5 text-[#b9e769]" /><span>Reserva tu hora por WhatsApp<br />y llega directo a nuestro Nivel -1</span></p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#dce8f1] px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <div className="flex items-center gap-3"><span className="brand-mark flex h-9 w-9 items-center justify-center border text-[12px] font-bold">SC</span><span className="text-[11px] font-bold uppercase tracking-[.19em]">SPA CAR WASH SANTIAGO</span></div>
          <p className="mt-5 max-w-[280px] text-sm leading-6 text-[#0b1a29]/55">Tu auto en las mejores manos. Limpieza profesional y acabados impecables en Valdivia.</p>
        </div>
        <div>
          <p className="eyebrow text-[#168fe0]">Reserva directa</p>
          <p className="mt-4 max-w-[290px] text-sm leading-6 text-[#0b1a29]/65">Las reservas se realizan únicamente por WhatsApp.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 flex w-fit items-center gap-2 text-sm font-bold text-[#168fe0] transition-colors hover:text-[#0b1a29]" data-testid="link-footer-whatsapp"><Phone size={16} /> +56 9 3595 0592</a>
        </div>
        <div className="flex items-start gap-5 md:justify-self-end">
          <a href="#inicio" className="focus-ring text-[10px] uppercase tracking-[.15em] text-[#0b1a29]/65 transition-colors hover:text-[#168fe0]" data-testid="link-back-top">Volver arriba ↑</a>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1200px] flex-col justify-between gap-3 border-t border-[#0b1a29]/15 pt-5 text-[10px] uppercase tracking-[.14em] text-[#0b1a29]/40 md:flex-row"><span>© 2026 SPA CAR WASH SANTIAGO</span><span>Entrada de Arauco · Nivel -1 · Valdivia</span></div>
    </footer>
  );
}

function Home() {
  useReveal();
  const scrollToBook = () => document.getElementById('reservas')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <div className="carwash-page min-h-[100dvh]">
      <Header onBook={scrollToBook} />
      <main><Hero onBook={scrollToBook} /><Experience /><Tariff /><Feature /><Reservation /><Location /></main>
      <Footer />
    </div>
  );
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;