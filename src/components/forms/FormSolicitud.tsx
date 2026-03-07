'use client';

import { CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  enviarSolicitud,
  type ComercialPayload,
  type RepuestoPayload,
  type ServicioPayload,
} from '@/services/donCandido/SolicitudApiClient';

type Tab = 'repuesto' | 'servicio' | 'comercial';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'repuesto', label: 'Repuesto' },
  { value: 'servicio', label: 'Servicio Técnico' },
  { value: 'comercial', label: 'Comercial / Financiación' },
];

const INPUT =
  'w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium text-zinc-900 placeholder:text-zinc-400';
const INPUT_ERROR =
  'w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-red-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium text-zinc-900 placeholder:text-zinc-400';
const LABEL = 'block text-xs font-bold text-zinc-600 mb-1.5 uppercase tracking-wider';

interface FormState {
  nombre: string;
  telefono: string;
  email: string;
  cuit: string;
  maquina_tipo: string;
  modelo: string;
  numero_serie: string;
  descripcion_repuesto: string;
  descripcion_problema: string;
  localidad: string;
  provincia: string;
  producto_interes: string;
  requiere_financiacion: boolean;
  comentarios: string;
}

const INITIAL: FormState = {
  nombre: '',
  telefono: '',
  email: '',
  cuit: '',
  maquina_tipo: '',
  modelo: '',
  numero_serie: '',
  descripcion_repuesto: '',
  descripcion_problema: '',
  localidad: '',
  provincia: '',
  producto_interes: '',
  requiere_financiacion: false,
  comentarios: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(tab: Tab, form: FormState): Errors {
  const e: Errors = {};
  if (form.nombre.trim().length < 2) e.nombre = 'Ingresá tu nombre completo';
  if (form.telefono.trim().length < 8) e.telefono = 'Ingresá un teléfono válido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Ingresá un email válido';

  if (tab === 'repuesto') {
    if (form.maquina_tipo.trim().length < 2) e.maquina_tipo = 'Indicá el tipo de máquina';
    if (form.modelo.trim().length < 2) e.modelo = 'Indicá el modelo';
    if (form.descripcion_repuesto.trim().length < 10)
      e.descripcion_repuesto = 'Describí el repuesto (mínimo 10 caracteres)';
  }

  if (tab === 'servicio') {
    if (form.maquina_tipo.trim().length < 2) e.maquina_tipo = 'Indicá el tipo de máquina';
    if (form.modelo.trim().length < 2) e.modelo = 'Indicá el modelo';
    if (form.descripcion_problema.trim().length < 10)
      e.descripcion_problema = 'Describí el problema (mínimo 10 caracteres)';
    if (form.localidad.trim().length < 2) e.localidad = 'Indicá la localidad';
    if (form.provincia.trim().length < 2) e.provincia = 'Indicá la provincia';
  }

  if (tab === 'comercial') {
    if (form.producto_interes.trim().length < 2) e.producto_interes = 'Indicá el producto de interés';
    if (form.comentarios.trim().length < 5) e.comentarios = 'Agregá un comentario breve (mínimo 5 caracteres)';
  }

  return e;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FormSolicitud() {
  const [tab, setTab] = useState<Tab>('repuesto');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(tab, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setLoading(true);

    try {
      const base = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        cuit: form.cuit.trim() || undefined,
        website: '',
        form_started_at: startedAt.current,
      };

      let payload: RepuestoPayload | ServicioPayload | ComercialPayload;

      if (tab === 'repuesto') {
        payload = {
          ...base,
          tipo: 'repuesto',
          maquina_tipo: form.maquina_tipo.trim(),
          modelo: form.modelo.trim(),
          numero_serie: form.numero_serie.trim() || undefined,
          descripcion_repuesto: form.descripcion_repuesto.trim(),
        };
      } else if (tab === 'servicio') {
        payload = {
          ...base,
          tipo: 'servicio',
          maquina_tipo: form.maquina_tipo.trim(),
          modelo: form.modelo.trim(),
          numero_serie: form.numero_serie.trim() || undefined,
          descripcion_problema: form.descripcion_problema.trim(),
          localidad: form.localidad.trim(),
          provincia: form.provincia.trim(),
        };
      } else {
        payload = {
          ...base,
          tipo: 'comercial',
          producto_interes: form.producto_interes.trim(),
          requiere_financiacion: form.requiere_financiacion,
          comentarios: form.comentarios.trim(),
        };
      }

      const result = await enviarSolicitud(payload);
      setSuccess(result.numeroSolicitud);
      setForm(INITIAL);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'No se pudo enviar la solicitud. Intentá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle className="w-14 h-14 text-red-600 mb-4" />
        <h3 className="text-xl font-bold text-zinc-900 mb-2">¡Solicitud enviada!</h3>
        <p className="text-zinc-600 text-sm mb-1">
          Nos comunicaremos a la brevedad.
        </p>
        <p className="text-xs text-zinc-400 mb-8 font-mono">{success}</p>
        <button
          onClick={() => { setSuccess(null); startedAt.current = Date.now(); }}
          className="text-sm text-red-600 hover:text-red-700 font-semibold underline underline-offset-2"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
        {TABS.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleTabChange(t.value)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              tab === t.value
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={e => void handleSubmit(e)} noValidate className="space-y-4">
        {/* Honeypot oculto anti-spam */}
        <input
          type="text"
          name="website"
          value=""
          onChange={() => {}}
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />

        {/* Campos comunes */}
        <Field label="Nombre completo" error={errors.nombre}>
          <input
            type="text"
            value={form.nombre}
            onChange={e => set('nombre', e.target.value)}
            placeholder="Tu nombre"
            className={errors.nombre ? INPUT_ERROR : INPUT}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Teléfono" error={errors.telefono}>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => set('telefono', e.target.value)}
              placeholder="+54 9 ..."
              className={errors.telefono ? INPUT_ERROR : INPUT}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? INPUT_ERROR : INPUT}
            />
          </Field>
        </div>

        {/* Campos específicos por tab */}
        {(tab === 'repuesto' || tab === 'servicio') && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo de máquina" error={errors.maquina_tipo}>
                <input
                  type="text"
                  value={form.maquina_tipo}
                  onChange={e => set('maquina_tipo', e.target.value)}
                  placeholder="Ej: Tractor"
                  className={errors.maquina_tipo ? INPUT_ERROR : INPUT}
                />
              </Field>
              <Field label="Modelo" error={errors.modelo}>
                <input
                  type="text"
                  value={form.modelo}
                  onChange={e => set('modelo', e.target.value)}
                  placeholder="Ej: Puma 185"
                  className={errors.modelo ? INPUT_ERROR : INPUT}
                />
              </Field>
            </div>
            <Field label="Número de serie (opcional)">
              <input
                type="text"
                value={form.numero_serie}
                onChange={e => set('numero_serie', e.target.value)}
                placeholder="Nro. de chasis / VIN"
                className={INPUT}
              />
            </Field>
          </>
        )}

        {tab === 'repuesto' && (
          <Field label="¿Qué repuesto necesitás?" error={errors.descripcion_repuesto}>
            <textarea
              rows={4}
              value={form.descripcion_repuesto}
              onChange={e => set('descripcion_repuesto', e.target.value)}
              placeholder="Describí el repuesto o pieza que necesitás, código si lo tenés..."
              className={`${errors.descripcion_repuesto ? INPUT_ERROR : INPUT} resize-none`}
            />
          </Field>
        )}

        {tab === 'servicio' && (
          <>
            <Field label="Descripción del problema" error={errors.descripcion_problema}>
              <textarea
                rows={3}
                value={form.descripcion_problema}
                onChange={e => set('descripcion_problema', e.target.value)}
                placeholder="Describí el problema técnico o falla..."
                className={`${errors.descripcion_problema ? INPUT_ERROR : INPUT} resize-none`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Localidad" error={errors.localidad}>
                <input
                  type="text"
                  value={form.localidad}
                  onChange={e => set('localidad', e.target.value)}
                  placeholder="Tu localidad"
                  className={errors.localidad ? INPUT_ERROR : INPUT}
                />
              </Field>
              <Field label="Provincia" error={errors.provincia}>
                <input
                  type="text"
                  value={form.provincia}
                  onChange={e => set('provincia', e.target.value)}
                  placeholder="Tu provincia"
                  className={errors.provincia ? INPUT_ERROR : INPUT}
                />
              </Field>
            </div>
          </>
        )}

        {tab === 'comercial' && (
          <>
            <Field label="Producto de interés" error={errors.producto_interes}>
              <input
                type="text"
                value={form.producto_interes}
                onChange={e => set('producto_interes', e.target.value)}
                placeholder="Ej: Tractor Puma 185, Cosechadora Axial-Flow..."
                className={errors.producto_interes ? INPUT_ERROR : INPUT}
              />
            </Field>

            <Field label="CUIT / CUIL (opcional)">
              <input
                type="text"
                value={form.cuit}
                onChange={e => set('cuit', e.target.value)}
                placeholder="20-12345678-9"
                className={INPUT}
              />
            </Field>

            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="requiere_financiacion"
                checked={form.requiere_financiacion}
                onChange={e => set('requiere_financiacion', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <label
                htmlFor="requiere_financiacion"
                className="text-sm font-medium text-zinc-700 cursor-pointer"
              >
                Necesito financiación
              </label>
            </div>

            <Field label="Comentarios" error={errors.comentarios}>
              <textarea
                rows={3}
                value={form.comentarios}
                onChange={e => set('comentarios', e.target.value)}
                placeholder="Contanos tu situación, zona, hectáreas trabajadas, preferencias..."
                className={`${errors.comentarios ? INPUT_ERROR : INPUT} resize-none`}
              />
            </Field>
          </>
        )}

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-1 bg-red-600 hover:bg-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-colors shadow-sm uppercase tracking-wide flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Consulta'
          )}
        </button>
      </form>
    </div>
  );
}
