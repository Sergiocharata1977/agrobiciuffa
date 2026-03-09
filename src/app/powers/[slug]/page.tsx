import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 300;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PowerTier = 'base' | 'opcional' | 'premium';

type PowerDetail = {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  tier: PowerTier;
  icon: string;
  color?: string;
  tags?: string[];
  features?: string[];
  benefits?: string[];
  target_audience?: string;
  how_it_works?: string;
  dependencies?: string[];
  version: string;
};

type CapabilityResponse = {
  success: boolean;
  data: PowerDetail;
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

async function fetchPower(slug: string): Promise<PowerDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_9001APP_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/public/capabilities/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as CapabilityResponse;
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const power = await fetchPower(params.slug);
  if (!power) {
    return { title: 'Power no encontrado' };
  }
  return {
    title: `${power.name} — Power de Don Candido IA`,
    description: power.description,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PowerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const power = await fetchPower(params.slug);

  if (!power) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
            <a href="/" className="hover:text-slate-900 transition-colors">
              Inicio
            </a>
            <span>&#8250;</span>
            <a href="/powers" className="hover:text-slate-900 transition-colors">
              Powers
            </a>
            <span>&#8250;</span>
            <span className="text-slate-900">{power.name}</span>
          </nav>

          <div className="flex flex-wrap items-start gap-6">
            {/* Large icon */}
            <div
              className={`h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0 ${getTierColor(power.tier)}`}
            >
              {power.name[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{power.name}</h1>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${getTierBadge(power.tier)}`}
                >
                  {getTierLabel(power.tier)}
                </span>
              </div>

              <p className="text-lg text-slate-600">{power.description}</p>

              {power.long_description && (
                <p className="mt-3 text-slate-600 whitespace-pre-line text-base leading-relaxed">
                  {power.long_description}
                </p>
              )}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-8">
            <a
              href="https://doncandidoia.com/dashboard/capabilities"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Activalo desde tu panel &#8594;
            </a>
          </div>

        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Para quien es */}
        {power.target_audience && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              &#191;Para quien es?
            </h2>
            <p className="text-slate-600 text-lg">{power.target_audience}</p>
          </section>
        )}

        {/* Que incluye */}
        {power.features && power.features.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              &#191;Que incluye?
            </h2>
            <ul className="space-y-3">
              {power.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="text-emerald-500 mt-0.5 shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Beneficios */}
        {power.benefits && power.benefits.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Beneficios</h2>
            <ul className="space-y-3">
              {power.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="text-sky-500 mt-0.5 shrink-0">&#8594;</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Como funciona */}
        {power.how_it_works && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              &#191;Como funciona?
            </h2>
            <p className="text-slate-600 leading-relaxed">{power.how_it_works}</p>
          </section>
        )}

        {/* Disponibilidad */}
        <section className="bg-slate-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Disponibilidad</h2>
          <p className="text-slate-600">
            Este Power esta disponible en el plan{' '}
            <strong>{getTierLabel(power.tier)}</strong>.
          </p>
          {power.dependencies && power.dependencies.length > 0 && (
            <p className="text-slate-600 mt-2">
              Requiere: {power.dependencies.join(', ')} activados.
            </p>
          )}
        </section>

        {/* Final CTA */}
        <section className="text-center py-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            &#191;Listo para activarlo?
          </h2>
          <a
            href="https://doncandidoia.com/dashboard/capabilities"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-800 transition-colors"
          >
            Activalo desde tu panel de control &#8594;
          </a>
        </section>

      </div>
    </main>
  );
}
