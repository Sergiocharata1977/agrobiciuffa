'use client';

import { useState } from 'react';

import { Button, Input, Label, Textarea } from '@/components/ui';
import type { SlugCategoria } from '@/types/institucional';

type ConsultaCategoriaFormProps = {
    categoriaNombre: string;
    categoriaSlug: SlugCategoria;
};

type FormState = {
    nombre: string;
    email: string;
    telefono: string;
    localidad: string;
    mensaje: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE = (categoriaNombre: string): FormState => ({
    nombre: '',
    email: '',
    telefono: '',
    localidad: '',
    mensaje: `Hola, quiero recibir asesoramiento comercial sobre la categoria ${categoriaNombre}.`,
});

function validate(form: FormState): FormErrors {
    const errors: FormErrors = {};

    if (form.nombre.trim().length < 2) {
        errors.nombre = 'Ingresa tu nombre.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = 'Ingresa un email valido.';
    }

    if (form.telefono.trim().length < 8) {
        errors.telefono = 'Ingresa un telefono valido.';
    }

    if (form.localidad.trim().length < 2) {
        errors.localidad = 'Ingresa tu localidad.';
    }

    if (form.mensaje.trim().length < 10) {
        errors.mensaje = 'Escribe un mensaje mas detallado.';
    }

    return errors;
}

export function ConsultaCategoriaForm({
    categoriaNombre,
    categoriaSlug,
}: ConsultaCategoriaFormProps) {
    const [form, setForm] = useState<FormState>(() => INITIAL_STATE(categoriaNombre));
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));

        if (errors[field]) {
            setErrors((current) => ({ ...current, [field]: undefined }));
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validation = validate(form);

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setLoading(true);
        setSubmitError(null);
        setSuccess(null);

        try {
            const mensaje = [
                `Consulta por categoria: ${categoriaNombre} (${categoriaSlug}).`,
                form.mensaje.trim(),
            ].join('\n\n');

            const response = await fetch('/api/public/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: form.nombre.trim(),
                    email: form.email.trim(),
                    telefono: form.telefono.trim(),
                    localidad: form.localidad.trim(),
                    area: 'ventas',
                    mensaje,
                }),
            });

            const payload = (await response.json()) as { success?: boolean; error?: string };

            if (!response.ok || !payload.success) {
                throw new Error(payload.error ?? 'No se pudo enviar la consulta.');
            }

            setSuccess('Consulta enviada. Un asesor comercial se contactara a la brevedad.');
            setForm(INITIAL_STATE(categoriaNombre));
            setErrors({});
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : 'No se pudo enviar la consulta.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                    {`Consulta sobre ${categoriaNombre}`}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Completa tus datos y envia una consulta comercial enfocada en esta
                    categoria.
                </p>
            </div>

            <form className="space-y-4" noValidate onSubmit={(event) => void handleSubmit(event)}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            value={form.nombre}
                            onChange={(event) => updateField('nombre', event.target.value)}
                            placeholder="Tu nombre"
                        />
                        {errors.nombre ? (
                            <p className="text-sm text-red-600">{errors.nombre}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(event) => updateField('email', event.target.value)}
                            placeholder="tu@email.com"
                        />
                        {errors.email ? (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="telefono">Telefono</Label>
                        <Input
                            id="telefono"
                            type="tel"
                            value={form.telefono}
                            onChange={(event) => updateField('telefono', event.target.value)}
                            placeholder="+54 9 ..."
                        />
                        {errors.telefono ? (
                            <p className="text-sm text-red-600">{errors.telefono}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="localidad">Localidad</Label>
                        <Input
                            id="localidad"
                            value={form.localidad}
                            onChange={(event) => updateField('localidad', event.target.value)}
                            placeholder="Tu localidad"
                        />
                        {errors.localidad ? (
                            <p className="text-sm text-red-600">{errors.localidad}</p>
                        ) : null}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje</Label>
                    <Textarea
                        id="mensaje"
                        rows={6}
                        value={form.mensaje}
                        onChange={(event) => updateField('mensaje', event.target.value)}
                        placeholder="Describe tu consulta"
                    />
                    {errors.mensaje ? (
                        <p className="text-sm text-red-600">{errors.mensaje}</p>
                    ) : null}
                </div>

                {submitError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                    </div>
                ) : null}

                {success ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                ) : null}

                <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                    disabled={loading}
                >
                    {loading ? 'Enviando consulta...' : 'Enviar consulta'}
                </Button>
            </form>
        </div>
    );
}
