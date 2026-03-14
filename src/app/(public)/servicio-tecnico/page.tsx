'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Cpu, MapPin, Users } from 'lucide-react';

import { CTASection } from '@/components/institucional/CTASection';
import { FormInstitucional } from '@/components/institucional/FormInstitucional';
import { FortalezaCard } from '@/components/institucional/FortalezaCard';
import { PageHeader } from '@/components/institucional/PageHeader';
import {
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/components/ui';
import type { FormServicio } from '@/types/institucional';

type TipoAtencionUi = 'En taller' | 'En campo' | 'Sin preferencia';
type UrgenciaUi = 'Normal' | 'Urgente — equipo parado';

type FormValues = FormServicio & {
    urgencia: NonNullable<FormServicio['urgencia']>;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const fortalezas = [
    {
        titulo: 'Diagnóstico Electrónico',
        descripcion: 'Equipamiento de diagnóstico oficial CASE IH para todos los sistemas.',
        icono: <Cpu className="h-5 w-5" />,
    },
    {
        titulo: 'Técnicos Certificados',
        descripcion: 'Personal capacitado y actualizado permanentemente por fábrica.',
        icono: <Users className="h-5 w-5" />,
    },
    {
        titulo: 'Servicio en Campo',
        descripcion: 'Atención en taller o asistencia directa en el establecimiento.',
        icono: <MapPin className="h-5 w-5" />,
    },
] as const;

const tipoAtencionLabels: Record<FormServicio['tipo_atencion'], TipoAtencionUi> = {
    taller: 'En taller',
    campo: 'En campo',
    cualquiera: 'Sin preferencia',
};

const urgenciaLabels: Record<NonNullable<FormServicio['urgencia']>, UrgenciaUi> = {
    normal: 'Normal',
    urgente: 'Urgente — equipo parado',
};

const initialForm: FormValues = {
    nombre: '',
    telefono: '',
    email: '',
    localidad: '',
    maquina_marca: 'CASE IH',
    maquina_modelo: '',
    maquina_serie: '',
    descripcion_problema: '',
    tipo_atencion: 'taller',
    urgencia: 'normal',
};

function validateForm(values: FormValues): FormErrors {
    const errors: FormErrors = {};
    const phoneDigits = values.telefono.replace(/\D/g, '');

    if (values.nombre.trim().length < 2) {
        errors.nombre = 'Ingresá tu nombre completo.';
    }

    if (phoneDigits.length < 8) {
        errors.telefono = 'Ingresá un teléfono válido de al menos 8 dígitos.';
    }

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Ingresá un email válido o dejalo vacío.';
    }

    if (values.localidad.trim().length < 2) {
        errors.localidad = 'Indicá dónde se encuentra el equipo.';
    }

    if (values.maquina_marca.trim().length < 2) {
        errors.maquina_marca = 'Indicá la marca del equipo.';
    }

    if (values.maquina_modelo.trim().length < 2) {
        errors.maquina_modelo = 'Indicá el modelo del equipo.';
    }

    if (values.descripcion_problema.trim().length < 10) {
        errors.descripcion_problema = 'Describí la falla o necesidad de mantenimiento.';
    }

    return errors;
}

export default function ServicioTecnicoPage() {
    const [formData, setFormData] = useState<FormValues>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});

    const clearFieldError = (field: keyof FormValues) => {
        setErrors((current) => {
            if (!current[field]) {
                return current;
            }

            const nextErrors = { ...current };
            delete nextErrors[field];
            return nextErrors;
        });
    };

    const handleChange =
        (field: keyof FormValues) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { value } = event.target;

            setFormData((current) => ({ ...current, [field]: value }));
            clearFieldError(field);
        };

    const handleTipoAtencionChange = (value: FormServicio['tipo_atencion']) => {
        setFormData((current) => ({ ...current, tipo_atencion: value }));
        clearFieldError('tipo_atencion');
    };

    const handleUrgenciaChange = (value: NonNullable<FormServicio['urgencia']>) => {
        setFormData((current) => ({ ...current, urgencia: value }));
        clearFieldError('urgencia');
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            throw new Error('Revisá los campos marcados y volvé a intentar.');
        }

        const payload = {
            tipo: 'servicio',
            cliente_nombre: formData.nombre.trim(),
            cliente_telefono: formData.telefono.trim(),
            cliente_email: formData.email?.trim() || undefined,
            localidad: formData.localidad.trim(),
            equipo_modelo: `${formData.maquina_marca.trim()} ${formData.maquina_modelo.trim()}`,
            equipo_serie: formData.maquina_serie?.trim() || undefined,
            descripcion: formData.descripcion_problema.trim(),
            tipo_atencion: tipoAtencionLabels[formData.tipo_atencion],
            urgencia: urgenciaLabels[formData.urgencia],
        };

        const response = await fetch('/api/public/solicitudes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = (await response.json().catch(() => null)) as
            | { success?: boolean; error?: string }
            | null;

        if (!response.ok || !data?.success) {
            throw new Error(data?.error || 'No se pudo registrar la solicitud.');
        }

        setErrors({});
        setFormData(initialForm);
    };

    return (
        <>
            <PageHeader
                titulo="Servicio Técnico"
                subtitulo="Atención preventiva y correctiva por técnicos capacitados CASE IH"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Servicio técnico' },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                                    Respaldo de taller
                                </p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                                    Nuestro servicio técnico
                                </h2>
                            </div>

                            <p className="text-base leading-7 text-zinc-600">
                                Contamos con capacidad operativa para atender mantenimiento preventivo,
                                reparaciones correctivas y revisiones programadas, con foco en reducir
                                tiempos muertos y devolver el equipo al trabajo en condiciones
                                confiables.
                            </p>

                            <p className="text-base leading-7 text-zinc-600">
                                Nuestro taller trabaja con técnicos capacitados por fábrica, acceso a
                                diagnóstico electrónico oficial, herramientas especiales y literatura
                                técnica actualizada para intervenir sobre los distintos sistemas CASE IH
                                con criterios de fábrica.
                            </p>

                            <div className="grid gap-6 md:grid-cols-3">
                                {fortalezas.map((fortaleza) => (
                                    <div
                                        key={fortaleza.titulo}
                                        className="rounded-3xl border border-zinc-200 bg-zinc-50 shadow-sm"
                                    >
                                        <FortalezaCard
                                            icono={fortaleza.icono}
                                            titulo={fortaleza.titulo}
                                            descripcion={fortaleza.descripcion}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-sm">
                            <div
                                role="img"
                                aria-label="Técnico trabajando en el taller de servicio"
                                className="min-h-[340px] w-full bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        'url("https://images.unsplash.com/photo-1502740479091-635887520276?q=80&w=1600&auto=format&fit=crop")',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-3xl">
                        <FormInstitucional
                            titulo="Solicitá asistencia técnica"
                            descripcion="Completá el formulario y un técnico se comunica para coordinar la atención."
                            onSubmit={handleSubmit}
                            submitLabel="Enviar solicitud"
                            successMessage="¡Solicitud recibida! Un técnico se comunica pronto para coordinar la atención."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange('nombre')}
                                        placeholder="Tu nombre y apellido"
                                        aria-invalid={Boolean(errors.nombre)}
                                    />
                                    {errors.nombre ? <p className="text-sm text-red-600">{errors.nombre}</p> : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={handleChange('telefono')}
                                        placeholder="Tu teléfono de contacto"
                                        aria-invalid={Boolean(errors.telefono)}
                                    />
                                    {errors.telefono ? (
                                        <p className="text-sm text-red-600">{errors.telefono}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email ?? ''}
                                        onChange={handleChange('email')}
                                        placeholder="Opcional"
                                        aria-invalid={Boolean(errors.email)}
                                    />
                                    {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localidad">¿Dónde se encuentra el equipo?</Label>
                                    <Input
                                        id="localidad"
                                        name="localidad"
                                        value={formData.localidad}
                                        onChange={handleChange('localidad')}
                                        placeholder="Localidad o establecimiento"
                                        aria-invalid={Boolean(errors.localidad)}
                                    />
                                    {errors.localidad ? (
                                        <p className="text-sm text-red-600">{errors.localidad}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maquina_marca">Marca</Label>
                                    <Input
                                        id="maquina_marca"
                                        name="maquina_marca"
                                        value={formData.maquina_marca}
                                        onChange={handleChange('maquina_marca')}
                                        aria-invalid={Boolean(errors.maquina_marca)}
                                    />
                                    {errors.maquina_marca ? (
                                        <p className="text-sm text-red-600">{errors.maquina_marca}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maquina_modelo">Modelo</Label>
                                    <Input
                                        id="maquina_modelo"
                                        name="maquina_modelo"
                                        value={formData.maquina_modelo}
                                        onChange={handleChange('maquina_modelo')}
                                        placeholder="Ej: Puma 210"
                                        aria-invalid={Boolean(errors.maquina_modelo)}
                                    />
                                    {errors.maquina_modelo ? (
                                        <p className="text-sm text-red-600">{errors.maquina_modelo}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maquina_serie">Número de serie</Label>
                                    <Input
                                        id="maquina_serie"
                                        name="maquina_serie"
                                        value={formData.maquina_serie ?? ''}
                                        onChange={handleChange('maquina_serie')}
                                        placeholder="Opcional"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo_atencion">Tipo de atención</Label>
                                    <Select value={formData.tipo_atencion} onValueChange={handleTipoAtencionChange}>
                                        <SelectTrigger id="tipo_atencion" aria-invalid={Boolean(errors.tipo_atencion)}>
                                            <SelectValue placeholder="Seleccioná una opción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="taller">En taller</SelectItem>
                                            <SelectItem value="campo">En campo</SelectItem>
                                            <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="urgencia">Urgencia</Label>
                                    <Select value={formData.urgencia} onValueChange={handleUrgenciaChange}>
                                        <SelectTrigger id="urgencia" aria-invalid={Boolean(errors.urgencia)}>
                                            <SelectValue placeholder="Seleccioná el nivel de urgencia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="urgente">Urgente — equipo parado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion_problema">
                                    Describí la falla o necesidad de mantenimiento
                                </Label>
                                <Textarea
                                    id="descripcion_problema"
                                    name="descripcion_problema"
                                    value={formData.descripcion_problema}
                                    onChange={handleChange('descripcion_problema')}
                                    placeholder="Detallá síntomas, mantenimiento requerido o contexto de la falla"
                                    className="min-h-36"
                                    aria-invalid={Boolean(errors.descripcion_problema)}
                                />
                                {errors.descripcion_problema ? (
                                    <p className="text-sm text-red-600">{errors.descripcion_problema}</p>
                                ) : null}
                            </div>
                        </FormInstitucional>
                    </div>
                </div>
            </section>

            <CTASection
                variante="rojo"
                titulo="¿Necesitás un repuesto para el equipo?"
                subtitulo="Si además de asistencia técnica tenés que consultar piezas o componentes, derivá la gestión al área de repuestos."
                ctas={[{ label: 'Ir a repuestos', href: '/repuestos' }]}
            />
        </>
    );
}
