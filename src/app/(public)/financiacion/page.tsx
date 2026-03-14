'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import {
    BadgeDollarSign,
    CircleDollarSign,
    Settings2,
} from 'lucide-react';

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
import type { FormFinanciacion } from '@/types/institucional';

type FormErrors = Partial<Record<keyof FormFinanciacion, string>>;

type InteresOption = {
    label: string;
    value: FormFinanciacion['interes'];
};

const fortalezas = [
    {
        titulo: 'Maquinaria nueva',
        descripcion:
            'Opciones orientadas a la incorporacion de equipos nuevos segun campanas y condiciones comerciales vigentes.',
        icono: <BadgeDollarSign className="h-5 w-5" />,
    },
    {
        titulo: 'Repuestos',
        descripcion:
            'Alternativas para sostener la operacion con piezas y abastecimiento segun disponibilidad comercial.',
        icono: <CircleDollarSign className="h-5 w-5" />,
    },
    {
        titulo: 'Posventa',
        descripcion:
            'Consultas para mantenimiento, servicios y necesidades operativas vinculadas al soporte tecnico.',
        icono: <Settings2 className="h-5 w-5" />,
    },
];

const interesOptions: InteresOption[] = [
    { value: 'maquinaria_nueva', label: 'Maquinaria Nueva' },
    { value: 'repuestos', label: 'Repuestos' },
    { value: 'servicio', label: 'Servicio / Posventa' },
    { value: 'usados', label: 'Usados' },
];

const emptyForm: FormFinanciacion = {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    localidad: '',
    interes: 'maquinaria_nueva',
    descripcion: '',
};

function validateForm(values: FormFinanciacion): FormErrors {
    const errors: FormErrors = {};
    const phoneDigits = values.telefono.replace(/\D/g, '');

    if (values.nombre.trim().length < 2) {
        errors.nombre = 'Ingresa tu nombre completo.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Ingresa un email valido.';
    }

    if (phoneDigits.length < 8) {
        errors.telefono = 'Ingresa un telefono valido de al menos 8 digitos.';
    }

    if (values.localidad.trim().length < 2) {
        errors.localidad = 'Ingresa tu localidad.';
    }

    if (!values.interes) {
        errors.interes = 'Selecciona un tipo de interes.';
    }

    if (values.descripcion && values.descripcion.trim().length > 500) {
        errors.descripcion = 'La descripcion no puede superar los 500 caracteres.';
    }

    return errors;
}

export default function FinanciacionPage() {
    const [formData, setFormData] = useState<FormFinanciacion>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        document.title = 'Financiacion | Agro Biciuffa SRL';
    }, []);

    const clearFieldError = (field: keyof FormFinanciacion) => {
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
        (field: keyof FormFinanciacion) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;

            setFormData((current) => ({ ...current, [field]: value }));
            clearFieldError(field);
        };

    const handleInteresChange = (value: FormFinanciacion['interes']) => {
        setFormData((current) => ({ ...current, interes: value }));
        clearFieldError('interes');
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            throw new Error('Revisa los campos marcados y vuelve a intentar.');
        }

        const payload: FormFinanciacion = {
            nombre: formData.nombre.trim(),
            empresa: formData.empresa?.trim() || undefined,
            email: formData.email.trim(),
            telefono: formData.telefono.trim(),
            localidad: formData.localidad.trim(),
            interes: formData.interes,
            descripcion: formData.descripcion?.trim() || undefined,
        };

        const response = await fetch('/api/public/financiacion', {
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
            throw new Error(
                data?.error || 'No pudimos enviar tu consulta de financiacion.'
            );
        }

        setErrors({});
        setFormData(emptyForm);
    };

    return (
        <main className="min-h-screen bg-white text-zinc-900">
            <PageHeader
                titulo="Financiacion"
                subtitulo="Alternativas de financiacion para maquinaria, repuestos y servicios"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Financiacion' },
                ]}
            />

            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">
                            Opciones comerciales
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
                            Consultas orientadas a cada necesidad operativa
                        </h2>
                        <p className="mt-5 text-base leading-7 text-zinc-600">
                            Contamos con alternativas de financiacion para maquinaria
                            nueva, repuestos y servicios de posventa segun la campana
                            vigente, la disponibilidad comercial y el perfil de cada
                            operacion.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                            <p className="text-sm font-semibold text-amber-900">
                                Las condiciones estan sujetas a evaluacion crediticia y
                                vigencia.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                            <p className="text-sm font-semibold text-amber-900">
                                No realizamos aprobaciones automaticas ni garantizamos
                                tasas por este medio.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            </section>

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-3xl">
                        <FormInstitucional
                            titulo="Consulta disponibilidad de financiacion"
                            descripcion="Completa tus datos y un asesor comercial se comunica con las opciones disponibles."
                            onSubmit={handleSubmit}
                            submitLabel="Enviar consulta"
                            successMessage="Gracias! Un asesor comercial se comunica con las opciones disponibles para tu caso."
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
                                        required
                                    />
                                    {errors.nombre ? (
                                        <p className="text-sm text-red-600">
                                            {errors.nombre}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="empresa">Empresa</Label>
                                    <Input
                                        id="empresa"
                                        name="empresa"
                                        value={formData.empresa ?? ''}
                                        onChange={handleChange('empresa')}
                                        placeholder="Opcional"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        placeholder="nombre@empresa.com"
                                        aria-invalid={Boolean(errors.email)}
                                        required
                                    />
                                    {errors.email ? (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Telefono</Label>
                                    <Input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={handleChange('telefono')}
                                        placeholder="Tu telefono de contacto"
                                        aria-invalid={Boolean(errors.telefono)}
                                        required
                                    />
                                    {errors.telefono ? (
                                        <p className="text-sm text-red-600">
                                            {errors.telefono}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localidad">Localidad</Label>
                                    <Input
                                        id="localidad"
                                        name="localidad"
                                        value={formData.localidad}
                                        onChange={handleChange('localidad')}
                                        placeholder="Ciudad o localidad"
                                        aria-invalid={Boolean(errors.localidad)}
                                        required
                                    />
                                    {errors.localidad ? (
                                        <p className="text-sm text-red-600">
                                            {errors.localidad}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interes-trigger">Interes</Label>
                                    <Select
                                        value={formData.interes}
                                        onValueChange={handleInteresChange}
                                    >
                                        <SelectTrigger
                                            id="interes-trigger"
                                            className="focus:ring-red-500"
                                            aria-invalid={Boolean(errors.interes)}
                                        >
                                            <SelectValue placeholder="Selecciona una opcion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {interesOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.interes ? (
                                        <p className="text-sm text-red-600">
                                            {errors.interes}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">
                                    Contanos mas sobre lo que necesitas
                                </Label>
                                <Textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion ?? ''}
                                    onChange={handleChange('descripcion')}
                                    placeholder="Describe brevemente tu necesidad o el equipo de interes"
                                    className="min-h-36"
                                    aria-invalid={Boolean(errors.descripcion)}
                                />
                                {errors.descripcion ? (
                                    <p className="text-sm text-red-600">
                                        {errors.descripcion}
                                    </p>
                                ) : null}
                            </div>
                        </FormInstitucional>
                    </div>
                </div>
            </section>

            <CTASection
                titulo="Buscas maquinaria nueva?"
                subtitulo="Explora la linea de productos disponible y conversa con el equipo comercial para avanzar segun tu necesidad."
                ctas={[{ label: 'Ver productos', href: '/productos' }]}
                variante="rojo"
            />
        </main>
    );
}
