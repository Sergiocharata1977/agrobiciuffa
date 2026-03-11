'use client';

import { CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  useProductosCatalogo,
  type ProductoCatalogo,
} from '@/hooks/useProductosCatalogo';
import {
  enviarSolicitud,
  type ComercialPayload,
  type RepuestoPayload,
  type ServicioPayload,
} from '@/services/donCandido/SolicitudApiClient';

type Tab = 'repuesto' | 'servicio' | 'comercial';

const TABS: Array<{ value: Tab; label: string }> = [
  { value: 'comercial', label: 'Producto' },
  { value: 'servicio', label: 'Servicio tecnico' },
  { value: 'repuesto', label: 'Repuesto' },
];

const INPUT =
  'w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium text-zinc-900 placeholder:text-zinc-400';
const INPUT_ERROR =
  'w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-red-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium text-zinc-900 placeholder:text-zinc-400';
const LABEL =
  'block text-xs font-bold text-zinc-600 mb-1.5 uppercase tracking-wider';

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
  producto_id: string;
  producto_nombre: string;
  precio_referencia: number | null;
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
  producto_id: '',
  producto_nombre: '',
  precio_referencia: null,
  requiere_financiacion: false,
  comentarios: '',
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(tab: Tab, form: FormState, hidePersonalData = false): Errors {
  const errors: Errors = {};

  if (!hidePersonalData && form.nombre.trim().length < 2) {
    errors.nombre = 'Ingresa tu nombre completo';
  }

  if (form.telefono.trim().length < 8) {
    errors.telefono = 'Ingresa un telefono valido';
  }

  if (!hidePersonalData && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Ingresa un email valido';
  }

  if (tab === 'repuesto') {
    if (form.maquina_tipo.trim().length < 2) {
      errors.maquina_tipo = 'Indica el tipo de maquina';
    }

    if (form.modelo.trim().length < 2) {
      errors.modelo = 'Indica el modelo';
    }

    if (form.descripcion_repuesto.trim().length < 10) {
      errors.descripcion_repuesto =
        'Describe el repuesto con al menos 10 caracteres';
    }
  }

  if (tab === 'servicio') {
    if (form.maquina_tipo.trim().length < 2) {
      errors.maquina_tipo = 'Indica el tipo de maquina';
    }

    if (form.modelo.trim().length < 2) {
      errors.modelo = 'Indica el modelo';
    }

    if (form.descripcion_problema.trim().length < 10) {
      errors.descripcion_problema =
        'Describe el problema con al menos 10 caracteres';
    }

    if (form.localidad.trim().length < 2) {
      errors.localidad = 'Indica la localidad';
    }

    if (form.provincia.trim().length < 2) {
      errors.provincia = 'Indica la provincia';
    }
  }

  if (tab === 'comercial') {
    if (form.producto_interes.trim().length < 2) {
      errors.producto_interes = 'Indica el producto de interes';
    }

    if (form.comentarios.trim().length < 5) {
      errors.comentarios = 'Agrega un comentario breve';
    }
  }

  return errors;
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
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

function formatProductoOption(producto: ProductoCatalogo) {
  const identity = [producto.marca, producto.modelo]
    .map(value => value?.trim())
    .filter(Boolean)
    .join(' ');
  const baseName = identity ? `${identity} - ${producto.nombre}` : producto.nombre;

  if (typeof producto.precio_contado === 'number') {
    return `${baseName} (desde ${currencyFormatter.format(producto.precio_contado)})`;
  }

  return baseName;
}

function getProductoNombre(producto: ProductoCatalogo) {
  const identity = [producto.marca, producto.modelo]
    .map(value => value?.trim())
    .filter(Boolean)
    .join(' ');

  return identity ? `${identity} - ${producto.nombre}` : producto.nombre;
}

export function FormSolicitud({
  initialValues,
  initialTab,
  hidePersonalData = false,
}: {
  initialValues?: Partial<FormState>;
  initialTab?: Tab;
  hidePersonalData?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'comercial');
  const [form, setForm] = useState<FormState>({ ...INITIAL, ...initialValues });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());
  const { productos, loading: productosLoading, error: productosError } =
    useProductosCatalogo();
  const catalogoDisponible = productos.length > 0 && !productosError;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function setField(
    key: keyof FormState,
    value: string | boolean | number | null
  ) {
    setForm(prev => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }

  function handleTabChange(newTab: Tab) {
    setTab(newTab);
    setErrors({});
    setSubmitError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validate(tab, form, hidePersonalData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
          producto_id: form.producto_id || undefined,
          producto_nombre: form.producto_nombre.trim() || undefined,
          precio_referencia: form.precio_referencia,
          producto_interes:
            form.producto_nombre.trim() || form.producto_interes.trim(),
          requiere_financiacion: form.requiere_financiacion,
          comentarios: form.comentarios.trim(),
        };
      }

      const result = await enviarSolicitud(payload);
      setSuccess(result.numeroSolicitud);
      setForm(INITIAL);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar la solicitud. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle className="mb-4 h-14 w-14 text-red-600" />
        <h3 className="mb-2 text-xl font-bold text-zinc-900">
          Solicitud enviada
        </h3>
        <p className="mb-1 text-sm text-zinc-600">
          Nos comunicaremos a la brevedad.
        </p>
        <p className="mb-8 font-mono text-xs text-zinc-400">{success}</p>
        <button
          type="button"
          onClick={() => {
            setSuccess(null);
            startedAt.current = Date.now();
          }}
          className="text-sm font-semibold text-red-600 underline underline-offset-2 hover:text-red-700"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {TABS.map(item => (
          <button
            key={item.value}
            type="button"
            onClick={() => handleTabChange(item.value)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
              tab === item.value
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mb-5 text-sm text-zinc-500">
        Elige si quieres pedir un producto, coordinar un servicio tecnico o
        consultar por un repuesto.
      </p>

      <form onSubmit={event => void handleSubmit(event)} noValidate className="space-y-4">
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

        {!hidePersonalData && (
          <>
            <Field label="Nombre completo" error={errors.nombre}>
              <input
                type="text"
                value={form.nombre}
                onChange={event => setField('nombre', event.target.value)}
                placeholder="Tu nombre"
                className={errors.nombre ? INPUT_ERROR : INPUT}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefono" error={errors.telefono}>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={event => setField('telefono', event.target.value)}
                  placeholder="+54 9 ..."
                  className={errors.telefono ? INPUT_ERROR : INPUT}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={event => setField('email', event.target.value)}
                  placeholder="tu@email.com"
                  className={errors.email ? INPUT_ERROR : INPUT}
                />
              </Field>
            </div>
          </>
        )}

        {hidePersonalData && (
          <Field label="Telefono de contacto" error={errors.telefono}>
            <input
              type="tel"
              value={form.telefono}
              onChange={event => setField('telefono', event.target.value)}
              placeholder="+54 9 ..."
              className={errors.telefono ? INPUT_ERROR : INPUT}
            />
          </Field>
        )}

        {(tab === 'repuesto' || tab === 'servicio') && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo de maquina" error={errors.maquina_tipo}>
                <input
                  type="text"
                  value={form.maquina_tipo}
                  onChange={event => setField('maquina_tipo', event.target.value)}
                  placeholder="Ej: Tractor"
                  className={errors.maquina_tipo ? INPUT_ERROR : INPUT}
                />
              </Field>
              <Field label="Modelo" error={errors.modelo}>
                <input
                  type="text"
                  value={form.modelo}
                  onChange={event => setField('modelo', event.target.value)}
                  placeholder="Ej: Puma 185"
                  className={errors.modelo ? INPUT_ERROR : INPUT}
                />
              </Field>
            </div>

            <Field label="Numero de serie (opcional)">
              <input
                type="text"
                value={form.numero_serie}
                onChange={event => setField('numero_serie', event.target.value)}
                placeholder="Nro. de chasis / VIN"
                className={INPUT}
              />
            </Field>
          </>
        )}

        {tab === 'repuesto' && (
          <Field
            label="Que repuesto necesitas?"
            error={errors.descripcion_repuesto}
          >
            <textarea
              rows={4}
              value={form.descripcion_repuesto}
              onChange={event =>
                setField('descripcion_repuesto', event.target.value)
              }
              placeholder="Describe el repuesto o pieza que necesitas, y el codigo si lo tienes..."
              className={`${errors.descripcion_repuesto ? INPUT_ERROR : INPUT} resize-none`}
            />
          </Field>
        )}

        {tab === 'servicio' && (
          <>
            <Field
              label="Descripcion del problema"
              error={errors.descripcion_problema}
            >
              <textarea
                rows={3}
                value={form.descripcion_problema}
                onChange={event =>
                  setField('descripcion_problema', event.target.value)
                }
                placeholder="Describe la falla o el problema tecnico..."
                className={`${errors.descripcion_problema ? INPUT_ERROR : INPUT} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Localidad" error={errors.localidad}>
                <input
                  type="text"
                  value={form.localidad}
                  onChange={event => setField('localidad', event.target.value)}
                  placeholder="Tu localidad"
                  className={errors.localidad ? INPUT_ERROR : INPUT}
                />
              </Field>
              <Field label="Provincia" error={errors.provincia}>
                <input
                  type="text"
                  value={form.provincia}
                  onChange={event => setField('provincia', event.target.value)}
                  placeholder="Tu provincia"
                  className={errors.provincia ? INPUT_ERROR : INPUT}
                />
              </Field>
            </div>
          </>
        )}

        {tab === 'comercial' && (
          <>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-600">
              Usa este formulario para tractores, cosechadoras, pulverizadoras,
              lubricantes y consultas comerciales o de financiacion.
            </div>

            <Field
              label="Producto de interes"
              error={errors.producto_interes}
            >
              {productosLoading ? (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando catalogo...
                </div>
              ) : catalogoDisponible ? (
                <select
                  value={form.producto_id}
                  onChange={event => {
                    const productoSeleccionado = productos.find(
                      producto => producto.id === event.target.value
                    );

                    setForm(prev => ({
                      ...prev,
                      producto_id: productoSeleccionado?.id ?? '',
                      producto_nombre: productoSeleccionado
                        ? getProductoNombre(productoSeleccionado)
                        : '',
                      precio_referencia:
                        productoSeleccionado?.precio_contado ?? null,
                      producto_interes: productoSeleccionado
                        ? getProductoNombre(productoSeleccionado)
                        : '',
                    }));

                    if (errors.producto_interes) {
                      setErrors(prev => ({
                        ...prev,
                        producto_interes: undefined,
                      }));
                    }
                  }}
                  className={errors.producto_interes ? INPUT_ERROR : INPUT}
                >
                  <option value="">Selecciona un producto del catalogo</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {formatProductoOption(producto)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={form.producto_interes}
                  onChange={event => {
                    setField('producto_interes', event.target.value);
                    setField('producto_id', '');
                    setField('producto_nombre', '');
                    setField('precio_referencia', null);
                  }}
                  placeholder="Describi el producto de tu interes"
                  className={errors.producto_interes ? INPUT_ERROR : INPUT}
                />
              )}
            </Field>

            <Field label="CUIT / CUIL (opcional)">
              <input
                type="text"
                value={form.cuit}
                onChange={event => setField('cuit', event.target.value)}
                placeholder="20-12345678-9"
                className={INPUT}
              />
            </Field>

            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="requiere_financiacion"
                checked={form.requiere_financiacion}
                onChange={event =>
                  setField('requiere_financiacion', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <label
                htmlFor="requiere_financiacion"
                className="cursor-pointer text-sm font-medium text-zinc-700"
              >
                Necesito financiacion
              </label>
            </div>

            <Field label="Comentarios" error={errors.comentarios}>
              <textarea
                rows={3}
                value={form.comentarios}
                onChange={event => setField('comentarios', event.target.value)}
                placeholder="Contanos tu zona, tipo de trabajo, hectareas y preferencias..."
                className={`${errors.comentarios ? INPUT_ERROR : INPUT} resize-none`}
              />
            </Field>
          </>
        )}

        {submitError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {submitError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar consulta'
          )}
        </button>
      </form>
    </div>
  );
}
