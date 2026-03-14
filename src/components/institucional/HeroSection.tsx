'use client';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const DEFAULT_HERO_IMAGE =
    'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2600&auto=format&fit=crop';

type HeroCTA = {
    label: string;
    href: string;
    variant: 'primary' | 'outline';
};

interface HeroSectionProps {
    titulo: string;
    subtitulo?: string;
    imagen_url?: string;
    ctas: HeroCTA[];
    tag?: string;
}

export function HeroSection({
    titulo,
    subtitulo,
    imagen_url = DEFAULT_HERO_IMAGE,
    ctas,
    tag,
}: HeroSectionProps) {
    return (
        <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-zinc-950 py-24">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${imagen_url}")` }}
            />
            <div className="absolute inset-0 bg-zinc-950/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/35 to-zinc-950/75" />

            <div className="container relative z-10 mx-auto px-6 text-center">
                <div className="mx-auto max-w-4xl">
                    {tag ? (
                        <span className="mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                            <span className="mr-2 text-red-500">■</span>
                            {tag}
                        </span>
                    ) : null}

                    <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                        {titulo}
                    </h1>

                    {subtitulo ? (
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
                            {subtitulo}
                        </p>
                    ) : null}

                    {ctas.length > 0 ? (
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {ctas.map((cta) => (
                                <Button
                                    key={`${cta.href}-${cta.label}`}
                                    asChild
                                    size="lg"
                                    className={cn(
                                        'min-w-[180px] rounded-lg px-8 text-sm font-semibold',
                                        cta.variant === 'primary'
                                            ? 'bg-red-600 text-white shadow-sm hover:bg-red-700'
                                            : 'border border-white bg-transparent text-white hover:bg-white/10'
                                    )}
                                >
                                    <a href={cta.href}>{cta.label}</a>
                                </Button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
