'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, FileText, Pencil, UserRound, Wrench } from 'lucide-react';

import { Alert } from '@/components/layout/Alert';
import { EmptyState } from '@/components/layout/EmptyState';
import { PageLoading } from '@/components/layout/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { SolicitudAdmin } from '@/types/admin';
import type { Cliente, EquipoCliente } from '@/types/clientes';

interface ClienteDetailResponse {
    cliente: Cliente;
    equipos: EquipoCliente[];
    solicitudes: SolicitudAdmin[];
}

interface EditClienteForm {
    nombre: string;
    telefono: string;
    localidad: string;
    cuit: string;
}

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('admin_token') : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function getEstadoVariant(estado: string): 'secondary' | 'warning' | 'success' | 'info' {
    if (estado === 'completada' || estado === 'entregada') {
        return 'success';
    }

    if (estado === 'aprobada') {
        return 'info';
    }

    if (
        estado === 'diagnostico' ||
        estado === 'presupuestada' ||
        estado === 'verificando_stock' ||
        estado === 'cotizada' ||
        estado === 'en_trabajo' ||
        estado === 'en_preparacion'
    ) {
        return 'warning';
    }

    return 'secondary';
}

function formatEstado(estado: string): string {
    return estado.replaceAll('_', ' ');
}

function getKanbanHref(solicitud: SolicitudAdmin): string {
    if (solicitud.tipo === 'repuesto') {
        return `/admin/repuestos?solicitud=${solicitud.id}`;
    }

    return `/admin/taller?solicitud=${solicitud.id}`;
}

export default function AdminClienteDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [equipos, setEquipos] = useState<EquipoCliente[]>([]);
    const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [form, setForm] = useState<EditClienteForm>({
        nombre: '',
        telefono: '',
        localidad: '',
        cuit: '',
    });

    useEffect(() => {
        let isMounted = true;

        async function loadCliente() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/admin/clientes/${params.id}`, {
                    headers: getAuthHeaders(),
                });

                const payload = (await response.json()) as
                    | ClienteDetailResponse
                    | { error?: string };

                if (!response.ok) {
                    throw new Error('error' in payload ? payload.error || 'No se pudo cargar.' : 'No se pudo cargar.');
                }

                const data = payload as ClienteDetailResponse;

                if (!isMounted) {
                    return;
                }

                setCliente(data.cliente);
                setEquipos(data.equipos);
                setSolicitudes(data.solicitudes);
                setForm({
                    nombre: data.cliente.nombre,
                    telefono: data.cliente.telefono || '',
                    localidad: data.cliente.localidad || '',
                    cuit: data.cliente.cuit || '',
                });
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'No se pudo cargar el cliente.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCliente();

        return () => {
            isMounted = false;
        };
    }, [params.id]);

    async function handleSaveCliente(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsSaving(true);
            setSaveError(null);

            const response = await fetch(`/api/admin/clientes/${params.id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(form),
            });

            const payload = (await response.json()) as
                | { success: true }
                | { success: false; error?: string };

            if (!response.ok || !payload.success) {
                throw new Error(
                    'error' in payload ? payload.error || 'No se pudo actualizar el cliente.' : 'No se pudo actualizar el cliente.'
                );
            }

            setCliente((current) =>
                current
                    ? {
                        ...current,
                        nombre: form.nombre,
                        telefono: form.telefono || undefined,
                        localidad: form.localidad || undefined,
                        cuit: form.cuit || undefined,
                    }
                    : current
            );
            setIsEditOpen(false);
        } catch (updateError) {
            setSaveError(
                updateError instanceof Error
                    ? updateError.message
                    : 'No se pudo actualizar el cliente.'
            );
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <PageLoading text="Cargando ficha del cliente..." />;
    }

    if (error || !cliente) {
        return (
            <div className="space-y-6">
                <p className="text-sm font-medium text-zinc-500">Inicio &gt; Clientes</p>
                <Alert variant="error" title="No se pudo abrir la ficha">
                    {error || 'Cliente no encontrado.'}
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                <Link href="/admin" className="transition-colors hover:text-zinc-900">
                    Inicio
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/admin/clientes" className="transition-colors hover:text-zinc-900">
                    Clientes
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-zinc-900">{cliente.nombre}</span>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-zinc-950">{cliente.nombre}</h1>
                    <p className="mt-2 text-sm text-zinc-600">
                        Cliente registrado el {formatDate(cliente.created_at)}.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => {
                        setSaveError(null);
                        setIsEditOpen(true);
                    }}
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar datos
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="border-zinc-200">
                    <CardHeader>
                        <CardTitle className="text-xl text-zinc-950">Datos del cliente</CardTitle>
                        <CardDescription>Informacion principal y datos de contacto.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Email</p>
                            <p className="mt-2 text-sm font-medium text-zinc-900">{cliente.email}</p>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Telefono</p>
                            <p className="mt-2 text-sm font-medium text-zinc-900">
                                {cliente.telefono || 'Sin dato'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Localidad</p>
                            <p className="mt-2 text-sm font-medium text-zinc-900">
                                {cliente.localidad || 'Sin dato'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">CUIT</p>
                            <p className="mt-2 text-sm font-medium text-zinc-900">
                                {cliente.cuit || 'Sin dato'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200">
                    <CardHeader>
                        <CardTitle className="text-xl text-zinc-950">Resumen</CardTitle>
                        <CardDescription>Actividad vinculada al cliente.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl border border-zinc-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-zinc-100 p-2 text-zinc-700">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Solicitudes totales</p>
                                    <p className="text-2xl font-semibold text-zinc-950">{solicitudes.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-zinc-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-zinc-100 p-2 text-zinc-700">
                                    <Wrench className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Equipos registrados</p>
                                    <p className="text-2xl font-semibold text-zinc-950">{equipos.length}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-zinc-200">
                <CardHeader>
                    <CardTitle className="text-xl text-zinc-950">Equipos registrados</CardTitle>
                    <CardDescription>Unidades asociadas al cliente en la base operativa.</CardDescription>
                </CardHeader>
                <CardContent>
                    {equipos.length === 0 ? (
                        <EmptyState
                            icon={<Wrench className="h-8 w-8 text-zinc-400" />}
                            title="Sin equipos registrados"
                            description="Todavia no hay equipos vinculados a este cliente."
                        />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {equipos.map((equipo) => (
                                <div
                                    key={equipo.id}
                                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                                >
                                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                        {equipo.tipo}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-zinc-950">
                                        {equipo.marca} {equipo.modelo}
                                    </p>
                                    <p className="mt-3 font-mono text-sm text-zinc-700">
                                        {equipo.numero_serie}
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-500">
                                        {equipo.anio ? `Ano ${equipo.anio}` : 'Ano no informado'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-zinc-200">
                <CardHeader>
                    <CardTitle className="text-xl text-zinc-950">Historial de solicitudes</CardTitle>
                    <CardDescription>
                        Cada solicitud navega al kanban operativo correspondiente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {solicitudes.length === 0 ? (
                        <EmptyState
                            icon={<FileText className="h-8 w-8 text-zinc-400" />}
                            title="Sin solicitudes"
                            description="Este cliente aun no tiene solicitudes registradas."
                        />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-zinc-200">
                            <Table>
                                <TableHeader className="bg-zinc-50">
                                    <TableRow className="hover:bg-zinc-50">
                                        <TableHead className="text-zinc-600">Fecha</TableHead>
                                        <TableHead className="text-zinc-600">Tipo</TableHead>
                                        <TableHead className="text-zinc-600">Estado</TableHead>
                                        <TableHead className="text-zinc-600">Descripcion</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {solicitudes.map((solicitud) => (
                                        <TableRow
                                            key={solicitud.id}
                                            className="cursor-pointer border-zinc-200 hover:bg-zinc-100/70"
                                            onClick={() => router.push(getKanbanHref(solicitud))}
                                        >
                                            <TableCell className="text-zinc-700">
                                                {formatDate(solicitud.created_at)}
                                            </TableCell>
                                            <TableCell className="font-medium capitalize text-zinc-900">
                                                {solicitud.tipo}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getEstadoVariant(solicitud.estado)} className="capitalize">
                                                    {formatEstado(solicitud.estado)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-zinc-700">
                                                {solicitud.descripcion || 'Sin descripcion'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="border-zinc-200">
                    <DialogHeader>
                        <DialogTitle>Editar cliente</DialogTitle>
                        <DialogDescription>
                            Actualiza los datos operativos. El email se mantiene como referencia principal.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleSaveCliente}>
                        <div className="space-y-2">
                            <Label htmlFor="edit-nombre">Nombre</Label>
                            <Input
                                id="edit-nombre"
                                value={form.nombre}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, nombre: event.target.value }))
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-telefono">Telefono</Label>
                            <Input
                                id="edit-telefono"
                                value={form.telefono}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, telefono: event.target.value }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-localidad">Localidad</Label>
                            <Input
                                id="edit-localidad"
                                value={form.localidad}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, localidad: event.target.value }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-cuit">CUIT</Label>
                            <Input
                                id="edit-cuit"
                                value={form.cuit}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, cuit: event.target.value }))
                                }
                            />
                        </div>

                        {saveError ? (
                            <Alert variant="error" title="No se pudo guardar">
                                {saveError}
                            </Alert>
                        ) : null}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                                className="border-zinc-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
