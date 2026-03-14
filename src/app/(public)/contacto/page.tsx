'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    Clock3,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Wrench,
} from 'lucide-react';

import { FormInstitucional } from '@/components/institucional/FormInstitucional';
import { PageHeader } from '@/components/institucional/PageHeader';
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/components/ui';
import type { FormContacto } from '@/types/institucional';

type AreaOption = {
    value: FormContacto['area'];
    label: string;
};

type FormErrors = Partial<Record<keyof FormContacto, string>>;

const areaOptions: AreaOption[] = [
    { value: 'ventas', label: 'Ventas' },
    { value: 'repuestos', label: 'Repuestos' },
    { value: 'servicio_tecnico', label: 'Servicio Técnico' },
    { value: 'administracion', label: 'Administración' },
    { value: 'otro', label: 'Otro' },
];

const emptyForm: FormContacto = {
    nombre: '',
    empresa: '',
    localidad: '',
    telefono: '',
    email: '',
    area: 'ventas',
    mensaje: '',
};

function normalizeAreaParam(value: string | null): FormContacto['area'] | null {
    if (!value) {
        return null;
    }

    const normalized = value.toLowerCase().trim().replace(/-/g, '_');
    return areaOptions.some((option) => option.value === normalized)
        ? (normalized as FormContacto['area'])
        : null;
}

function validateForm(values: FormContacto): FormErrors {
    const errors: FormErrors = {};
    const onlyDigitsPhone = values.telefono.replace(/\D/g, '');

    if (values.nombre.trim().length < 2) {
        errors.nombre = 'Ingresá tu nombre completo.';
    }

    if (values.localidad.trim().length < 2) {
        errors.localidad = 'Ingresá tu localidad.';
    }

    if (onlyDigitsPhone.length < 8) {
        errors.telefono = 'Ingresá un teléfono válido de al menos 8 dígitos.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Ingresá un email válido.';
    }

    if (!values.area) {
        errors.area = 'Seleccioná un área.';
    }

    if (values.mensaje.trim().length < 10) {
        errors.mensaje = 'Contanos un poco más para poder ayudarte.';
    }

    return errors;
}

export default function ContactoPage() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<FormContacto>(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('Gracias. Te contactamos pronto.');

    useEffect(() => {
        document.title = 'Contacto | Agro Biciuffa SRL';
    }, []);

    useEffect(() => {
        const areaFromQuery = normalizeAreaParam(searchParams.get('area'));

        if (areaFromQuery) {
            setFormData((current) => ({ ...current, area: areaFromQuery }));
            setErrors((current) => {
                if (!current.area) {
                    return current;
                }

                const nextErrors = { ...current };
                delete nextErrors.area;
                return nextErrors;
            });
        }
    }, [searchParams]);

    const handleChange =
        (field: keyof FormContacto) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = event.target.value;

            setFormData((current) => ({ ...current, [field]: value }));
            setErrors((current) => {
                if (!current[field]) {
                    return current;
                }

                const nextErrors = { ...current };
                delete nextErrors[field];
                return nextErrors;
            });
        };

    const handleAreaChange = (value: FormContacto['area']) => {
        setFormData((current) => ({ ...current, area: value }));
        setErrors((current) => {
            if (!current.area) {
                return current;
            }

            const nextErrors = { ...current };
            delete nextErrors.area;
            return nextErrors;
        });
    };

    const handleSubmit = async () => {
        const nextErrors = validateForm(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            throw new Error('Revisá los campos marcados y volvé a intentar.');
        }

        const response = await fetch('/api/public/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                nombre: formData.nombre.trim(),
                empresa: formData.empresa?.trim() || undefined,
                localidad: formData.localidad.trim(),
                telefono: formData.telefono.trim(),
                email: formData.email.trim(),
                mensaje: formData.mensaje.trim(),
            }),
        });

        const data = (await response.json().catch(() => null)) as
            | { success?: boolean; error?: string }
            | null;

        if (!response.ok || !data?.success) {
            throw new Error(data?.error || 'No pudimos enviar tu consulta. Intenta nuevamente.');
        }

        setSuccessMessage(`¡Gracias ${formData.nombre.trim()}! Nos comunicamos pronto.`);
        setErrors({});
        setFormData((current) => ({
            ...emptyForm,
            area: current.area,
        }));
    };

    return (
        <>
            <PageHeader
                titulo="Contacto"
                subtitulo="Estamos para ayudarte"
                breadcrumb={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Contacto' },
                ]}
            />

            <section className="bg-zinc-50 py-16">
                <div className="container mx-auto grid gap-8 px-6 xl:grid-cols-[1.5fr_1fr]">
                    <div>
                        <FormInstitucional
                            titulo="Envianos tu consulta"
                            descripcion="Completá el formulario y derivaremos tu mensaje al área correspondiente."
                            onSubmit={handleSubmit}
                            submitLabel="Enviar consulta"
                            successMessage={successMessage}
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
                                    {errors.nombre ? (
                                        <p className="text-sm text-red-600">{errors.nombre}</p>
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
                                    <Label htmlFor="localidad">Localidad</Label>
                                    <Input
                                        id="localidad"
                                        name="localidad"
                                        value={formData.localidad}
                                        onChange={handleChange('localidad')}
                                        placeholder="Ciudad o localidad"
                                        aria-invalid={Boolean(errors.localidad)}
                                    />
                                    {errors.localidad ? (
                                        <p className="text-sm text-red-600">{errors.localidad}</p>
                                    ) : null}
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
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        placeholder="nombre@empresa.com"
                                        aria-invalid={Boolean(errors.email)}
                                    />
                                    {errors.email ? (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area-trigger">Área</Label>
                                    <Select value={formData.area} onValueChange={handleAreaChange}>
                                        <SelectTrigger
                                            id="area-trigger"
                                            className="focus:ring-red-500"
                                            aria-invalid={Boolean(errors.area)}
                                        >
                                            <SelectValue placeholder="Seleccioná un área" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areaOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.area ? (
                                        <p className="text-sm text-red-600">{errors.area}</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mensaje">Mensaje</Label>
                                <Textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange('mensaje')}
                                    placeholder="Contanos el motivo de tu consulta"
                                    className="min-h-36"
                                    aria-invalid={Boolean(errors.mensaje)}
                                />
                                {errors.mensaje ? (
                                    <p className="text-sm text-red-600">{errors.mensaje}</p>
                                ) : null}
                            </div>
                        </FormInstitucional>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                Datos de contacto
                            </h2>
                            <div className="mt-6 space-y-5 text-sm text-zinc-600">
                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-zinc-900">Dirección</p>
                                        <p>[placeholder] Dirección comercial de Agro Biciuffa</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-zinc-900">Teléfono</p>
                                        <p>[placeholder] Teléfono principal</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-zinc-900">WhatsApp</p>
                                        <a
                                            href="https://wa.me/54XXXXXXXXX"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="transition-colors hover:text-red-600"
                                        >
                                            wa.me/54XXXXXXXXX
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-zinc-900">Email</p>
                                        <p>[placeholder] Email de contacto</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                    <div>
                                        <p className="font-semibold text-zinc-900">Horarios</p>
                                        <p>Lun-Vie 8-18</p>
                                        <p>Sáb 8-13</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                            <iframe
                                title="Ubicación de Agro Biciuffa"
                                src="https://www.google.com/maps?q=Ubicaci%C3%B3n%20de%20Agro%20Biciuffa&z=13&output=embed"
                                className="h-72 w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                                Accesos rápidos
                            </h2>
                            <div className="mt-5 flex flex-col gap-3">
                                <Button
                                    asChild
                                    size="lg"
                                    className="justify-center bg-red-600 text-white hover:bg-red-700"
                                >
                                    <Link href="/repuestos">Consultar Repuesto</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="justify-center border-zinc-300 text-zinc-900 hover:bg-zinc-50"
                                >
                                    <Link href="/servicio-tecnico">
                                        <Wrench className="mr-2 h-4 w-4" />
                                        Servicio Técnico
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
