'use client';

import { useState, type ChangeEvent } from 'react';

import { FormInstitucional } from '@/components/institucional/FormInstitucional';
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
import type { FormRepuesto } from '@/types/institucional';

type FormErrors = Partial<Record<keyof FormRepuesto, string>>;

const initialForm: FormRepuesto = {
    nombre: '',
    email: '',
    telefono: '',
    localidad: '',
    maquina_marca: 'CASE IH',
    maquina_modelo: '',
    maquina_serie: '',
    descripcion_repuesto: '',
    codigo_repuesto: '',
    urgencia: 'normal',
};

function validateForm(values: FormRepuesto): FormErrors {
    const errors: FormErrors = {};
    const digitsOnlyPhone = values.telefono.replace(/\D/g, '');

    if (values.nombre.trim().length < 2) {
        errors.nombre = 'Ingresá tu nombre completo.';
    }

    if (digitsOnlyPhone.length < 8) {
        errors.telefono = 'Ingresá un teléfono válido.';
    }

    if (values.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Ingresá un email válido o dejalo vacío.';
    }

    if (values.localidad?.trim() && values.localidad.trim().length < 2) {
        errors.localidad = 'Ingresá una localidad válida.';
    }

    if (values.maquina_marca.trim().length < 2) {
        errors.maquina_marca = 'Indicá la marca de la máquina.';
    }

    if (values.maquina_modelo.trim().length < 2) {
        errors.maquina_modelo = 'Indicá el modelo del equipo.';
    }

    if (values.descripcion_repuesto.trim().length < 10) {
        errors.descripcion_repuesto = 'Describí la pieza o falla con más detalle.';
    }

    if (!values.urgencia) {
        errors.urgencia = 'Seleccioná la urgencia.';
    }

    return errors;
}

export function FormRepuestoSection() {
    const [formData, setFormData] = useState<FormRepuesto>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});

    const clearError = (field: keyof FormRepuesto) => {
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
        (field: keyof FormRepuesto) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;

            setFormData((current) => ({ ...current, [field]: value }));
            clearError(field);
        };

    const handleUrgenciaChange = (value: NonNullable<FormRepuesto['urgencia']>) => {
        setFormData((current) => ({ ...current, urgencia: value }));
        clearError('urgencia');
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            throw new Error('Revisá los campos marcados y volvé a intentar.');
        }

        const payload = {
            tipo: 'repuesto' as const,
            cliente_nombre: formData.nombre.trim(),
            cliente_telefono: formData.telefono.trim(),
            cliente_email: formData.email?.trim() || undefined,
            localidad: formData.localidad?.trim() || undefined,
            equipo_modelo: `${formData.maquina_marca.trim()} ${formData.maquina_modelo.trim()}`.trim(),
            equipo_serie: formData.maquina_serie?.trim() || undefined,
            descripcion: formData.descripcion_repuesto.trim(),
            codigo_repuesto: formData.codigo_repuesto?.trim() || undefined,
            urgencia: formData.urgencia ?? 'normal',
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
            throw new Error(data?.error || 'No pudimos registrar tu consulta de repuestos.');
        }

        setErrors({});
        setFormData(initialForm);
    };

    return (
        <section className="bg-zinc-50 py-16">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-3xl">
                    <FormInstitucional
                        titulo="Solicitá tu repuesto"
                        descripcion="Completá el formulario y te contactamos con disponibilidad y precio."
                        onSubmit={handleSubmit}
                        submitLabel="Enviar consulta"
                        successMessage="¡Consulta recibida! Un asesor de repuestos te contacta a la brevedad."
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
                                <Label htmlFor="localidad">Localidad</Label>
                                <Input
                                    id="localidad"
                                    name="localidad"
                                    value={formData.localidad ?? ''}
                                    onChange={handleChange('localidad')}
                                    placeholder="Opcional"
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
                                    placeholder="Ej: Puma 185, Axial-Flow 7130"
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
                                    placeholder="Número de serie del equipo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="codigo_repuesto">Código de repuesto</Label>
                                <Input
                                    id="codigo_repuesto"
                                    name="codigo_repuesto"
                                    value={formData.codigo_repuesto ?? ''}
                                    onChange={handleChange('codigo_repuesto')}
                                    placeholder="Código de parte si lo tenés"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion_repuesto">Descripción del repuesto</Label>
                            <Textarea
                                id="descripcion_repuesto"
                                name="descripcion_repuesto"
                                value={formData.descripcion_repuesto}
                                onChange={handleChange('descripcion_repuesto')}
                                placeholder="Describí la pieza o falla"
                                className="min-h-36"
                                aria-invalid={Boolean(errors.descripcion_repuesto)}
                            />
                            {errors.descripcion_repuesto ? (
                                <p className="text-sm text-red-600">{errors.descripcion_repuesto}</p>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="urgencia-trigger">Urgencia</Label>
                            <Select
                                value={formData.urgencia ?? 'normal'}
                                onValueChange={handleUrgenciaChange}
                            >
                                <SelectTrigger
                                    id="urgencia-trigger"
                                    className="focus:ring-red-500"
                                    aria-invalid={Boolean(errors.urgencia)}
                                >
                                    <SelectValue placeholder="Seleccioná la urgencia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="urgente">Urgente</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.urgencia ? (
                                <p className="text-sm text-red-600">{errors.urgencia}</p>
                            ) : null}
                        </div>
                    </FormInstitucional>
                </div>
            </div>
        </section>
    );
}
