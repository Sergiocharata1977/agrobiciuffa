import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type CTAItem = {
    label: string;
    href: string;
};

interface CTASectionProps {
    titulo: string;
    subtitulo?: string;
    ctas: CTAItem[];
    variante?: 'rojo' | 'oscuro' | 'claro';
}

const containerVariants = {
    rojo: 'bg-red-600 text-white',
    oscuro: 'bg-zinc-900 text-white',
    claro: 'bg-zinc-50 text-zinc-900',
} as const;

export function CTASection({
    titulo,
    subtitulo,
    ctas,
    variante = 'rojo',
}: CTASectionProps) {
    const isLight = variante === 'claro';

    return (
        <section className={cn('w-full py-16', containerVariants[variante])}>
            <div className="container mx-auto px-6">
                <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{titulo}</h2>
                        {subtitulo ? (
                            <p className={cn('mt-4 text-base leading-7', isLight ? 'text-zinc-600' : 'text-white/80')}>
                                {subtitulo}
                            </p>
                        ) : null}
                    </div>

                    {ctas.length > 0 ? (
                        <div className="flex flex-col gap-3 sm:flex-row">
                            {ctas.map((cta) => (
                                <Button
                                    key={`${cta.href}-${cta.label}`}
                                    asChild
                                    size="lg"
                                    className={cn(
                                        'rounded-lg px-8 font-semibold',
                                        isLight
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-white text-zinc-900 hover:bg-zinc-100'
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
