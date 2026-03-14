import { cn } from '@/lib/utils';

const DEFAULT_HEADER_IMAGE =
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1600&auto=format&fit=crop';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface PageHeaderProps {
    titulo: string;
    subtitulo?: string;
    breadcrumb?: BreadcrumbItem[];
    imagen_fondo?: string;
}

export function PageHeader({
    titulo,
    subtitulo,
    breadcrumb = [],
    imagen_fondo = DEFAULT_HEADER_IMAGE,
}: PageHeaderProps) {
    return (
        <section className="relative overflow-hidden py-20">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${imagen_fondo}")` }}
            />
            <div className="absolute inset-0 bg-zinc-950/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/75 via-zinc-950/45 to-zinc-950/60" />

            <div className="container relative z-10 mx-auto px-6">
                {breadcrumb.length > 0 ? (
                    <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
                        {breadcrumb.map((item, index) => (
                            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                                {item.href ? (
                                    <a href={item.href} className="transition-colors hover:text-white">
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-white">{item.label}</span>
                                )}
                                {index < breadcrumb.length - 1 ? <span>/</span> : null}
                            </span>
                        ))}
                    </nav>
                ) : null}

                <div className="max-w-3xl">
                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                        {titulo}
                    </h1>
                    {subtitulo ? (
                        <p className={cn('mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg')}>
                            {subtitulo}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
