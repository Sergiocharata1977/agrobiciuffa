import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  HeadphonesIcon,
  MapPin,
  Package,
  Settings,
  Shield,
  Tractor,
  User,
  Wrench,
  Zap,
} from 'lucide-react';

import { FormSolicitud } from '@/components/forms/FormSolicitud';
import { CTASection } from '@/components/institucional/CTASection';
import { CategoriaCard } from '@/components/institucional/CategoriaCard';
import { FortalezaCard } from '@/components/institucional/FortalezaCard';
import { HeroSection } from '@/components/institucional/HeroSection';
import type { SlugCategoria } from '@/types/institucional';

const ChatWidget = dynamic(
  () => import('@/components/ChatWidget').then(mod => mod.ChatWidget),
  { ssr: false }
);

const accesosRapidos = [
  {
    titulo: 'Maquinaria',
    descripcion: 'Explora el portfolio completo de equipos CASE IH para cada escala productiva.',
    href: '/productos',
    icono: Tractor,
  },
  {
    titulo: 'Repuestos',
    descripcion: 'Solicita piezas originales y consumibles con respaldo oficial y respuesta ágil.',
    href: '/repuestos',
    icono: Package,
  },
  {
    titulo: 'Servicio Técnico',
    descripcion: 'Coordina asistencia en taller o en campo con técnicos certificados.',
    href: '/servicio-tecnico',
    icono: Wrench,
  },
  {
    titulo: 'Mi Cuenta',
    descripcion: 'Ingresa al portal para seguir solicitudes, equipos y gestiones comerciales.',
    href: '/portal',
    icono: User,
  },
] as const;

const categorias: Array<{
  slug: SlugCategoria;
  nombre: string;
  descripcion: string;
  href: string;
  imagen_url: string;
}> = [
  {
    slug: 'tractores',
    nombre: 'Tractores',
    descripcion: 'Potencia, confort y eficiencia para siembra, transporte y labores intensivas.',
    href: '/productos?categoria=tractores',
    imagen_url:
      'https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'cosechadoras',
    nombre: 'Cosechadoras',
    descripcion: 'Equipos de alta capacidad para campañas exigentes con máxima productividad.',
    href: '/productos?categoria=cosechadoras',
    imagen_url:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'pulverizadores',
    nombre: 'Pulverizadoras',
    descripcion: 'Aplicación precisa y cobertura uniforme para proteger cada hectárea.',
    href: '/productos?categoria=pulverizadores',
    imagen_url:
      'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'sembradoras',
    nombre: 'Sembradoras',
    descripcion: 'Tecnología de implantación para lograr uniformidad y rendimiento desde el inicio.',
    href: '/productos?categoria=sembradoras',
    imagen_url:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'heno-forraje',
    nombre: 'Heno y Forraje',
    descripcion: 'Soluciones para corte, recolección y manejo eficiente de forrajes.',
    href: '/productos?categoria=heno-forraje',
    imagen_url:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  },
  {
    slug: 'tecnologia-precision',
    nombre: 'Tecnología de Precisión',
    descripcion: 'Herramientas conectadas para medir, optimizar y decidir con mejores datos.',
    href: '/productos?categoria=tecnologia-precision',
    imagen_url:
      'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1200&auto=format&fit=crop',
  },
];

const fortalezas = [
  {
    titulo: 'Técnicos Capacitados',
    descripcion:
      'Personal formado en fábrica con herramientas de diagnóstico especializadas.',
    icono: <Settings className="h-5 w-5" />,
  },
  {
    titulo: 'Stock de Repuestos',
    descripcion:
      'Repuestos originales CASE IH disponibles para respuesta rápida.',
    icono: <Package className="h-5 w-5" />,
  },
  {
    titulo: 'Atención Personalizada',
    descripcion:
      'Asesoramiento comercial y técnico adaptado a tu establecimiento.',
    icono: <HeadphonesIcon className="h-5 w-5" />,
  },
  {
    titulo: 'Cobertura Regional',
    descripcion:
      'Presencia en toda la zona con servicio en taller y en campo.',
    icono: <MapPin className="h-5 w-5" />,
  },
  {
    titulo: 'Respaldo de Marca',
    descripcion:
      'Garantía y soporte oficial CASE IH en cada operación.',
    icono: <Shield className="h-5 w-5" />,
  },
  {
    titulo: 'Posventa Garantizada',
    descripcion:
      'Seguimiento del equipo durante toda su vida útil.',
    icono: <Zap className="h-5 w-5" />,
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      <HeroSection
        titulo="Maquinaria, Repuestos y Servicio Técnico CASE IH"
        subtitulo="Concesionario oficial. Acompañamos al productor antes, durante y después de la compra."
        tag="Concesionario Oficial CASE IH"
        imagen_url="https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2600&auto=format&fit=crop"
        ctas={[
          { label: 'Ver Productos', href: '/productos', variant: 'primary' },
          {
            label: 'Contactar un Asesor',
            href: '/contacto',
            variant: 'outline',
          },
        ]}
      />

      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex flex-col gap-3 md:max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
              Accesos rápidos
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Soluciones conectadas con cada necesidad del campo
            </h2>
            <p className="text-base leading-7 text-zinc-600">
              Accede directo a las áreas clave de Agro Biciuffa y encuentra el equipo,
              repuesto o soporte que necesitas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {accesosRapidos.map(item => {
              const Icono = item.icono;

              return (
                <Link
                  key={item.titulo}
                  href={item.href}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <Icono className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {item.descripcion}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-transform group-hover:translate-x-1">
                    Ir a la sección
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
              Líneas de negocio
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              Todo lo que necesitás en un solo lugar
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Desde maquinaria de alta potencia hasta herramientas de agricultura de
              precisión, reunimos el ecosistema CASE IH para acompañar cada etapa del
              ciclo productivo.
            </p>
          </div>

          <div className="mt-12 grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categorias.map(categoria => (
              <CategoriaCard key={categoria.slug} {...categoria} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
              Fortalezas
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              ¿Por qué elegir Agro Biciuffa?
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Combinamos trayectoria comercial, soporte técnico y cercanía operativa
              para que cada inversión en maquinaria tenga continuidad y respaldo real.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {fortalezas.map(fortaleza => (
              <div
                key={fortaleza.titulo}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-2"
              >
                <FortalezaCard {...fortaleza} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
                Resumen institucional
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Agro Biciuffa SRL, respaldo comercial y técnico para una producción sin pausas
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
                Acompañamos al productor con una propuesta integral que une trayectoria,
                compromiso de atención, cobertura territorial y soporte oficial CASE IH.
                Nuestro equipo comercial y posventa trabaja para que cada cliente tome
                decisiones con información clara, disponibilidad de recursos y una red de
                asistencia preparada para responder en campaña.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="space-y-5">
                <div>
                  <p className="text-3xl font-bold text-white">20+ años</p>
                  <p className="mt-1 text-sm text-white/70">
                    vinculados al desarrollo de productores y contratistas de la región.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">Cobertura regional</p>
                  <p className="mt-1 text-sm text-white/70">
                    servicio comercial, técnico y de repuestos en taller y en campo.
                  </p>
                </div>
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors hover:text-white"
                >
                  Conocer más sobre nosotros
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">
                Contacto rápido
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                Inicia tu consulta ahora y continúa el seguimiento desde el portal
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                Conservamos el formulario principal para captar consultas comerciales,
                técnicas y de repuestos, y además centralizamos la atención institucional
                en la página de contacto.
              </p>

              <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-sm leading-6 text-zinc-600">
                  Si prefieres una atención guiada, usa la página de contacto para hablar
                  con un asesor, derivar tu consulta al área correcta y recibir seguimiento
                  personalizado.
                </p>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Ir a contacto
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                Envíanos una solicitud
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Carga pedidos de productos, servicio técnico o repuestos desde la home.
              </p>
              <div className="mt-6">
                <FormSolicitud />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        variante="rojo"
        titulo="¿Listo para optimizar tu campo?"
        subtitulo="Hablá con un asesor o iniciá tu consulta ahora mismo."
        ctas={[
          { label: 'Contactar Asesor', href: '/contacto' },
          { label: 'Solicitar Repuesto', href: '/repuestos' },
        ]}
      />

      <ChatWidget />
    </main>
  );
}
