import Link from 'next/link';
import {
    Tractor,
    Wrench,
    Settings,
    HeadphonesIcon,
    Star,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    ChevronRight,
    BadgePercent,
    Droplet
} from 'lucide-react';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
            {/* Navbar Placeholder - Minimal */}
            <nav className="absolute top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-white font-black text-2xl tracking-tighter">
                            AGRO<span className="text-red-600">BICIUFFA</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
                        <Link href="#maquinaria" className="hover:text-red-500 transition-colors">Maquinaria</Link>
                        <Link href="#postventa" className="hover:text-red-500 transition-colors">Postventa</Link>
                        <Link href="#empresa" className="hover:text-red-500 transition-colors">Empresa</Link>
                        <Link href="#contacto" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all font-bold">
                            Contactar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 1. HERO PRINCIPAL */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2600&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="container relative z-20 mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-3 rounded-full bg-red-600/20 text-red-500 font-bold border border-red-500/30 text-sm tracking-widest uppercase mb-6">
                        Concesionario Oficial Case IH
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
                        Agro Biciuffa
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto font-light mb-10">
                        Potencia, tecnología y respaldo para el agro argentino.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#maquinaria"
                            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] transition-all hover:scale-105 uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                        >
                            Ver Maquinaria <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="#contacto"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded border border-white/30 transition-all uppercase tracking-wide text-sm"
                        >
                            Solicitar Asesoramiento
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN MAQUINARIA */}
            <section id="maquinaria" className="py-24 bg-zinc-100">
                <div className="container mx-auto px-6">
                    <div className="mb-16 md:flex justify-between items-end">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase text-zinc-900 tracking-tight">Equipos y <span className="text-red-600">Soluciones</span></h2>
                            <p className="text-zinc-500 mt-4 text-lg max-w-xl">El poderío de Case IH a tu disposición para maximizar el rendimiento de tus campañas.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Tarjeta 1 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300">
                            <div className="relative h-64 overflow-hidden bg-zinc-200">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white uppercase tracking-wider">Tractores Puma</h3>
                            </div>
                            <div className="p-8">
                                <p className="text-zinc-600 mb-6">Fuerza inteligente y eficiencia comprobada para los trabajos más exigentes del campo.</p>
                                <button className="font-bold text-red-600 uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Ver Modelos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300">
                            <div className="relative h-64 overflow-hidden bg-zinc-200">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white uppercase tracking-wider">Pulverizadoras Patriot</h3>
                            </div>
                            <div className="p-8">
                                <p className="text-zinc-600 mb-6">Precisión milimétrica y tecnología de aplicación líder en el mercado para proteger tus cultivos.</p>
                                <button className="font-bold text-red-600 uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Ver Modelos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300">
                            <div className="relative h-64 overflow-hidden bg-zinc-200">
                                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <Droplet className="w-24 h-24 text-red-600 opacity-80" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white uppercase tracking-wider">Lubricantes Akcela</h3>
                            </div>
                            <div className="p-8">
                                <p className="text-zinc-600 mb-6">La protección oficial Case IH. Máximo rendimiento y vida útil prolongada para tu motor.</p>
                                <button className="font-bold text-red-600 uppercase text-sm tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Conocer Más <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN SERVICIO Y POSTVENTA */}
            <section id="postventa" className="py-24 bg-white text-zinc-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Potencia y <span className="text-red-500">Respaldo</span></h2>
                        <p className="text-zinc-600 text-lg">Un equipo de profesionales altamente capacitados listos para mantener tu maquinaria rindiendo al máximo, en todo momento.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 group-hover:border-red-500/50 transition-colors shadow-xl shadow-zinc-300">
                                <Wrench className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 tracking-wide text-zinc-900">Servicio Técnico Oficial</h3>
                            <p className="text-zinc-600 font-light">Técnicos certificados por Case IH, con herramientas especializadas y diagnóstico avanzado.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 group-hover:border-red-500/50 transition-colors shadow-xl shadow-zinc-300">
                                <Settings className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 tracking-wide text-zinc-900">Repuestos Genuinos</h3>
                            <p className="text-zinc-600 font-light">Garantizamos la originalidad y durabilidad de cada componente para tu maquinaria.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 group-hover:border-red-500/50 transition-colors shadow-xl shadow-zinc-300">
                                <HeadphonesIcon className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 tracking-wide text-zinc-900">Asistencia en Campo</h3>
                            <p className="text-zinc-600 font-light">Soporte técnico directo donde está la acción. No frenamos tu cosecha.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 group-hover:border-red-500/50 transition-colors shadow-xl shadow-zinc-300">
                                <Star className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold uppercase mb-3 tracking-wide text-zinc-900">Atención Especializada</h3>
                            <p className="text-zinc-600 font-light">Asesoramiento comercial y técnico persolizado adaptado a tus necesidades productivas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SECCIÓN EMPRESA */}
            <section id="empresa" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-square md:aspect-[4/3] rounded-sm overflow-hidden bg-zinc-200">
                                {/* Use a robust industrial/dealership image */}
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574341147253-33fa07300438?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-black/10" />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-red-600 text-white p-8 rounded-sm shadow-xl hidden md:block">
                                <p className="text-5xl font-black mb-2">20+</p>
                                <p className="uppercase tracking-widest text-sm font-bold opacity-90">Años de trayectoria</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Nuestra <span className="text-red-600">Empresa</span></h2>
                            <p className="text-xl text-zinc-600 mb-6 font-light leading-relaxed">
                                Más que maquinaria, ofrecemos <strong className="font-bold text-zinc-900">respaldo, experiencia y compromiso</strong> con el productor argentino.
                            </p>
                            <p className="text-zinc-500 mb-10 leading-relaxed">
                                En Agro Biciuffa SRL nos enorgullecemos de ser la representación oficial de Case IH, acercando tecnología de clase mundial al campo. Nuestra visión es acompañar el crecimiento de cada cliente con soluciones tecnológicas de vanguardia, asegurando solidez en cada inversión.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {['Concesionario Oficial Case IH', 'Infraestructura de primer nivel', 'Garantía oficial y servicio certificado'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                            <Tractor className="w-3 h-3 text-red-600" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. SECCIÓN FINANCIACIÓN */}
            <section className="py-20 bg-white border-y border-zinc-200">
                <div className="container mx-auto px-6">
                    <div className="bg-zinc-100 rounded-2xl overflow-hidden relative shadow-2xl shadow-zinc-800/20 flex flex-col md:flex-row items-center border border-zinc-200">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                        <div className="p-12 md:p-16 lg:w-2/3 relative z-10">
                            <BadgePercent className="w-16 h-16 text-red-600 mb-6" />
                            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight mb-4">Financiación a tu medida</h2>
                            <p className="text-zinc-600 text-lg mb-8 max-w-xl">
                                Opciones de financiación adaptadas al flujo de caja del productor argentino. Trabajamos con los principales bancos y ofrecemos créditos directos Case IH.
                            </p>
                            <button className="px-8 py-4 bg-red-600 hover:bg-black text-white font-bold rounded shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] transition-all uppercase tracking-wide text-sm">
                                Consultar Financiación
                            </button>
                        </div>
                        <div className="lg:w-1/3 bg-zinc-900 self-stretch flex items-center justify-center p-12 relative overflow-hidden hidden md:flex shadow-inner">
                            <span className="text-red-600 opacity-90 text-[200px] leading-none font-black absolute -right-10 -bottom-10 select-none">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CONTACTO */}
            <section id="contacto" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Comunicate con <span className="text-red-600">Nosotros</span></h2>
                            <p className="text-zinc-500 mb-10 text-lg">Estamos listos para asesorarte en tu próxima adquisición.</p>

                            <div className="space-y-8 mb-12">
                                <div className="flex pl-4 gap-6 border-l-2 border-red-600">
                                    <Phone className="w-8 h-8 text-red-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold uppercase text-sm tracking-widest text-zinc-900 mb-1">Teléfono</h4>
                                        <p className="text-zinc-600 text-lg">+54 9 0340 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-6 border-l-2 border-red-600">
                                    <MessageCircle className="w-8 h-8 text-green-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold uppercase text-sm tracking-widest text-zinc-900 mb-1">WhatsApp Comercial</h4>
                                        <p className="text-zinc-600 text-lg">+54 9 0340 987-6543</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-6 border-l-2 border-red-600">
                                    <Mail className="w-8 h-8 text-red-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold uppercase text-sm tracking-widest text-zinc-900 mb-1">Email</h4>
                                        <p className="text-zinc-600 text-lg">ventas@agrobiciuffa.com.ar</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-6 border-l-2 border-red-600">
                                    <MapPin className="w-8 h-8 text-red-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold uppercase text-sm tracking-widest text-zinc-900 mb-1">Dirección</h4>
                                        <p className="text-zinc-600 text-lg">Ruta Nacional 9 Km 230,<br />Provincia de Santa Fe, Argentina.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario minimalista */}
                        <div className="bg-zinc-50 p-10 rounded-xl border border-zinc-200">
                            <h3 className="text-2xl font-bold uppercase tracking-tight mb-8">Envianos un mensaje</h3>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wide text-zinc-700 mb-2">Nombre completo</label>
                                    <input type="text" className="w-full px-4 py-3 rounded bg-white border border-zinc-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors" placeholder="Tu nombre" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wide text-zinc-700 mb-2">Teléfono</label>
                                        <input type="text" className="w-full px-4 py-3 rounded bg-white border border-zinc-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors" placeholder="Tu número" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wide text-zinc-700 mb-2">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded bg-white border border-zinc-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors" placeholder="tu@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wide text-zinc-700 mb-2">Consulta</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded bg-white border border-zinc-300 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors resize-none" placeholder="¿En qué podemos asesorarte?" />
                                </div>
                                <button type="button" className="w-full py-4 bg-zinc-950 hover:bg-red-600 text-white font-bold rounded uppercase tracking-widest text-sm transition-colors">
                                    Enviar Consulta
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-100 border-t border-zinc-200 py-12 text-zinc-500 text-sm">
                <div className="container mx-auto px-6 text-center">
                    <div className="text-zinc-900 font-black text-2xl tracking-tighter mb-6">
                        AGRO<span className="text-red-600">BICIUFFA</span>
                    </div>
                    <p className="mb-4">Concesionario Oficial Case IH en Argentina.</p>
                    <p>&copy; {new Date().getFullYear()} Agro Biciuffa SRL. Todos los derechos reservados.</p>
                </div>
            </footer>
        </main>
    );
}
