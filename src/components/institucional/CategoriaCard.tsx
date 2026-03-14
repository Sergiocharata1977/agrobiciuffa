import { Button } from '@/components/ui';
import type { SlugCategoria } from '@/types/institucional';

const DEFAULT_CATEGORY_IMAGE =
    'https://images.unsplash.com/photo-1605648816402-9988184e1b82?q=80&w=1200&auto=format&fit=crop';

interface CategoriaCardProps {
    slug: SlugCategoria;
    nombre: string;
    descripcion: string;
    imagen_url?: string;
    href: string;
}

export function CategoriaCard({
    slug,
    nombre,
    descripcion,
    imagen_url = DEFAULT_CATEGORY_IMAGE,
    href,
}: CategoriaCardProps) {
    return (
        <article className="group w-full max-w-[280px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:border-red-200 hover:shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${imagen_url}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900 shadow-sm">
                    {slug.replace('-', ' ')}
                </span>
            </div>

            <div className="space-y-4 p-5">
                <div>
                    <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                        {nombre}
                    </span>
                    <p
                        className="mt-4 overflow-hidden text-sm leading-6 text-zinc-600"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {descripcion}
                    </p>
                </div>

                <Button
                    asChild
                    variant="outline"
                    className="w-full border-zinc-300 text-zinc-900 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                    <a href={href}>Ver mas</a>
                </Button>
            </div>
        </article>
    );
}
