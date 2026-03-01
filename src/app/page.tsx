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
            <nav className="absolute top-0 w-full z-50 border-b border-white/20 bg-white/10 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-white font-bold text-2xl tracking-tighter">
                            AGRO<span className="text-green-500">BICIUFFA</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
                        <Link href="#maquinaria" className="hover:text-green-400 transition-colors">Maquinaria</Link>
                        <Link href="#postventa" className="hover:text-green-400 transition-colors">Postventa</Link>
                        <Link href="#empresa" className="hover:text-green-400 transition-colors">Empresa</Link>
                        <Link href="#contacto" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-md transition-all font-semibold">
                            Contactar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 1. HERO PRINCIPAL */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-50">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2600&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-slate-50" />

                <div className="container relative z-20 mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/80 backdrop-blur-sm text-zinc-800 font-semibold border border-white/50 text-xs tracking-widest uppercase mb-6 shadow-sm">
                        Concesionario Oficial Case IH
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6 mt-4 drop-shadow-md">
                        Agro Biciuffa
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light mb-10 drop-shadow">
                        Potencia, tecnología y respaldo para el agro argentino.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#maquinaria"
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            Ver Maquinaria <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            href="#contacto"
                            className="w-full sm:w-auto px-8 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium rounded-lg border border-white/40 transition-all flex items-center justify-center"
                        >
                            Solicitar Asesoramiento
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN MAQUINARIA */}
            <section id="maquinaria" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="mb-16 md:flex justify-between items-end border-b border-slate-200 pb-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 tracking-tight">Equipos y <span className="text-green-600 font-semibold">Soluciones</span></h2>
                            <p className="text-zinc-500 mt-4 text-lg max-w-xl font-light">El poderío de Case IH a tu disposición para maximizar el rendimiento de tus campañas.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Tarjeta 1 */}
                        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                                <h3 className="absolute bottom-5 left-6 text-xl font-semibold text-white tracking-wide drop-shadow-sm">Tractores Puma</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-zinc-500 mb-6 font-light leading-relaxed">Fuerza inteligente y eficiencia comprobada para los trabajos más exigentes del campo.</p>
                                <button className="font-medium text-green-600 text-sm flex items-center gap-1 group-hover:text-green-700 transition-colors">
                                    Ver Modelos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                                <h3 className="absolute bottom-5 left-6 text-xl font-semibold text-white tracking-wide drop-shadow-sm">Pulverizadoras Patriot</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-zinc-500 mb-6 font-light leading-relaxed">Precisión milimétrica y tecnología de aplicación líder en el mercado para proteger tus cultivos.</p>
                                <button className="font-medium text-green-600 text-sm flex items-center gap-1 group-hover:text-green-700 transition-colors">
                                    Ver Modelos <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="relative h-56 overflow-hidden bg-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-colors">
                                <Droplet className="w-16 h-16 text-slate-300 group-hover:text-green-500/50 transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent mix-blend-multiply" />
                                <h3 className="absolute bottom-5 left-6 text-xl font-semibold text-white tracking-wide drop-shadow-sm z-10">Lubricantes Akcela</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-zinc-500 mb-6 font-light leading-relaxed">La protección oficial Case IH. Máximo rendimiento y vida útil prolongada para tu motor.</p>
                                <button className="font-medium text-green-600 text-sm flex items-center gap-1 group-hover:text-green-700 transition-colors">
                                    Conocer Más <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN SERVICIO Y POSTVENTA */}
            <section id="postventa" className="py-24 bg-white text-zinc-800 relative overflow-hidden border-t border-slate-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-800">Potencia y <span className="text-green-600 font-semibold">Respaldo</span></h2>
                        <p className="text-zinc-500 text-lg font-light leading-relaxed">Un equipo de profesionales altamente capacitados listos para mantener tu maquinaria rindiendo al máximo, en todo momento.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                                <Wrench className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-800">Servicio Técnico Oficial</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed">Técnicos certificados por Case IH, con herramientas especializadas y diagnóstico avanzado.</p>
                        </div>
                        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                                <Settings className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-800">Repuestos Genuinos</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed">Garantizamos la originalidad y durabilidad de cada componente para tu maquinaria.</p>
                        </div>
                        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                                <HeadphonesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-800">Asistencia en Campo</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed">Soporte técnico directo donde está la acción. No frenamos tu cosecha.</p>
                        </div>
                        <div className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3 text-zinc-800">Atención Especializada</h3>
                            <p className="text-zinc-500 font-light text-sm leading-relaxed">Asesoramiento comercial y técnico persolizado adaptado a tus necesidades productivas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SECCIÓN EMPRESA */}
            <section id="empresa" className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-md">
                                <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574341147253-33fa07300438?q=80&w=1200&auto=format&fit=crop")' }} />
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white border border-slate-100 text-zinc-800 p-6 opacity-95 rounded-xl shadow-xl hidden md:block backdrop-blur-sm">
                                <p className="text-4xl font-bold mb-1 text-green-600">20+</p>
                                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Años de trayectoria</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-zinc-800">Nuestra <span className="text-green-600 font-semibold">Empresa</span></h2>
                            <p className="text-lg text-zinc-600 mb-6 font-light leading-relaxed">
                                Más que maquinaria, ofrecemos <strong className="font-semibold text-zinc-800">respaldo, experiencia y compromiso</strong> con el productor argentino.
                            </p>
                            <p className="text-zinc-500 mb-10 font-light leading-relaxed text-sm">
                                En Agro Biciuffa SRL nos enorgullecemos de ser la representación oficial de Case IH, acercando tecnología de clase mundial al campo. Nuestra visión es acompañar el crecimiento de cada cliente con soluciones tecnológicas de vanguardia, asegurando solidez en cada inversión.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Concesionario Oficial Case IH', 'Infraestructura de primer nivel', 'Garantía oficial y servicio certificado'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-600 font-light text-sm">
                                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                            <Tractor className="w-2.5 h-2.5 text-green-600" />
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
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden relative shadow-sm border border-slate-200 flex flex-col md:flex-row items-center">
                        <div className="p-10 md:p-14 lg:w-2/3 relative z-10">
                            <BadgePercent className="w-12 h-12 text-green-600 mb-4 opacity-80" />
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 tracking-tight mb-4">Financiación a tu medida</h2>
                            <p className="text-zinc-500 mb-8 max-w-xl font-light leading-relaxed text-sm">
                                Opciones de financiación adaptadas al flujo de caja del productor argentino. Trabajamos con los principales bancos y ofrecemos créditos directos.
                            </p>
                            <button className="px-6 py-3 bg-white border border-slate-200 hover:border-green-300 hover:bg-green-50 text-green-700 font-medium rounded-lg shadow-sm transition-all text-sm flex items-center gap-2">
                                Consultar Financiación <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="lg:w-1/3 self-stretch flex items-center justify-center p-10 relative overflow-hidden hidden md:flex border-l border-white/50">
                            <div className="absolute inset-0 bg-grid-slate-100/[0.2] bg-[size:16px_16px]" />
                            <span className="text-green-600/10 text-[180px] leading-none font-bold absolute -right-4 -bottom-8 select-none tracking-tighter">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CONTACTO */}
            <section id="contacto" className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-800">Comunicate con <span className="text-green-600 font-semibold">Nosotros</span></h2>
                            <p className="text-zinc-500 mb-12 font-light">Estamos listos para asesorarte en tu próxima adquisición.</p>

                            <div className="space-y-8 mb-10">
                                <div className="flex pl-4 gap-5 border-l border-slate-300">
                                    <Phone className="w-6 h-6 text-zinc-400 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-xs tracking-wider text-zinc-500 uppercase mb-1">Teléfono</h4>
                                        <p className="text-zinc-800 font-medium">+54 9 0340 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-5 border-l border-slate-300">
                                    <MessageCircle className="w-6 h-6 text-green-500 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-xs tracking-wider text-zinc-500 uppercase mb-1">WhatsApp Comercial</h4>
                                        <p className="text-zinc-800 font-medium">+54 9 0340 987-6543</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-5 border-l border-slate-300">
                                    <Mail className="w-6 h-6 text-zinc-400 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-xs tracking-wider text-zinc-500 uppercase mb-1">Email</h4>
                                        <p className="text-zinc-800 font-medium">ventas@agrobiciuffa.com.ar</p>
                                    </div>
                                </div>
                                <div className="flex pl-4 gap-5 border-l border-slate-300">
                                    <MapPin className="w-6 h-6 text-zinc-400 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-xs tracking-wider text-zinc-500 uppercase mb-1">Dirección</h4>
                                        <p className="text-zinc-800 font-medium text-sm leading-relaxed">Ruta Nacional 9 Km 230,<br />Provincia de Santa Fe, Argentina.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario minimalista */}
                        <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-semibold tracking-tight mb-8 text-zinc-800">Envianos un mensaje</h3>
                            <form className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Nombre completo</label>
                                    <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm font-light text-zinc-800 placeholder:text-zinc-400" placeholder="Tu nombre" />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Teléfono</label>
                                        <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm font-light text-zinc-800 placeholder:text-zinc-400" placeholder="Tu número" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
                                        <input type="email" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm font-light text-zinc-800 placeholder:text-zinc-400" placeholder="tu@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Consulta</label>
                                    <textarea rows={4} className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm font-light text-zinc-800 placeholder:text-zinc-400 resize-none" placeholder="¿En qué podemos asesorarte?" />
                                </div>
                                <button type="button" className="w-full py-3 mt-2 bg-zinc-800 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                                    Enviar Consulta
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-10 text-zinc-500 text-sm">
                <div className="container mx-auto px-6 flex flex-col items-center justify-center">
                    <div className="text-zinc-800 font-bold text-xl tracking-tight mb-2">
                        AGRO<span className="text-green-500">BICIUFFA</span>
                    </div>
                    <p className="mb-4 font-light text-xs">Concesionario Oficial Case IH en Argentina.</p>
                    <div className="w-12 h-px bg-slate-200 mb-4" />
                    <p className="font-light text-xs text-slate-400">&copy; {new Date().getFullYear()} Agro Biciuffa SRL. Todos los derechos reservados.</p>
                </div>
            </footer>
        </main>
    );
}
