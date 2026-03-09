import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Powers — Modulos especializados para tu sistema Don Candido IA',
  description:
    'Activa solo lo que necesitas. Cada Power agrega un modulo especializado a tu sistema Don Candido IA.',
};

export const revalidate = 300;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PowerTier = 'base' | 'opcional' | 'premium';

type PowerPreview = {
  id: string;
  name: string;
  description: string;
  tier: PowerTier;
  icon: string;
  color?: string;
  tags?: string[];
  features?: string[];
};

type TierGroup = {
  tier: PowerTier;
  title: string;
  subtitle: string;
  powers: PowerPreview[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTierColor(tier: string): string {
  if (tier === 'base') return 'bg-emerald-500';
  if (tier === 'premium') return 'bg-sky-500';
  return 'bg-amber-500';
}

function getTierBadge(tier: string): string {
  if (tier === 'base') return 'bg-emerald-100 text-emerald-700';
  if (tier === 'premium') return 'bg-sky-100 text-sky-700';
  return 'bg-amber-100 text-amber-700';
}

function getTierLabel(tier: string): string {
  if (tier === 'base') return 'Base';
  if (tier === 'premium') return 'Premium';
  return 'Opcional';
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchPowers(): Promise<PowerPreview[]> {
  const baseUrl = process.env.NEXT_PUBLIC_9001APP_URL;
  if (!baseUrl) return [];

  try {
    const res = await fetch(`${baseUrl}/api/public/capabilities`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json() as { success?: boolean; data?: PowerPreview[] };
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Sub-component: PowerPreviewCard
// ---------------------------------------------------------------------------

function PowerPreviewCard({ power }: { power: PowerPreview }) {
  return (
    <a href={`/powers/${power.id}`} className="block group">
      <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-white ${getTierColor(power.tier)}`}
          >
            {power.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {power.name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getTierBadge(power.tier)}`}
            >
              {getTierLabel(power.tier)}
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
          {power.description}
        </p>

        {power.features?.slice(0, 2).map((f) => (
          <div key={f} className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <span className="text-emerald-500">&#10003;</span> {f}
          </div>
        ))}

        <div className="mt-4 text-sm text-blue-600 group-hover:underline">
          Ver mas &#8594;
        </div>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PowersPage() {
  const powers = await fetchPowers();

  const tierGroups: TierGroup[] = [
    {
      tier: 'base',
      title: 'Gestion y Calidad',
      subtitle: 'Modulos incluidos en el plan base para operar con ISO 9001.',
      powers: powers.filter((p) => p.tier === 'base'),
    },
    {
      tier: 'opcional',
      title: 'Comercial y Operaciones',
      subtitle: 'Agrega capacidades CRM, dealer y operaciones especializadas.',
      powers: powers.filter((p) => p.tier === 'opcional'),
    },
    {
      tier: 'premium',
      title: 'Avanzado',
      subtitle: 'Modulos premium para organizaciones con necesidades complejas.',
      powers: powers.filter((p) => p.tier === 'premium'),
    },
  ];

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Powers</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Activa solo lo que necesitas. Cada Power agrega un modulo especializado a
            tu sistema Don Candido IA.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* Sections by tier */}
        {tierGroups.map(
          (group) =>
            group.powers.length > 0 && (
              <section key={group.tier}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">{group.title}</h2>
                  <p className="text-slate-500 mt-1">{group.subtitle}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.powers.map((power) => (
                    <PowerPreviewCard key={power.id} power={power} />
                  ))}
                </div>
              </section>
            ),
        )}

        {/* Empty state when no powers are returned */}
        {powers.length === 0 && (
          <section className="text-center py-16">
            <p className="text-slate-500 text-lg">
              No hay Powers disponibles en este momento.
            </p>
          </section>
        )}

        {/* Final CTA */}
        <section className="text-center py-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            &#191;Necesitas algo especifico?
          </h2>
          <p className="text-slate-600 mb-6">
            Habla con nosotros y disenamos la solucion para tu negocio.
          </p>
          <a
            href="https://wa.me/5493425000000"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Contactar &#8594;
          </a>
        </section>

      </div>
    </main>
  );
}
