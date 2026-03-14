'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users } from 'lucide-react';

import { Alert } from '@/components/layout/Alert';
import { EmptyState } from '@/components/layout/EmptyState';
import { PageLoading } from '@/components/layout/LoadingSpinner';
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
import type { Cliente } from '@/types/clientes';

interface ClientesResponse {
    clientes: Cliente[];
    total: number;
}

interface CreateClienteForm {
    nombre: string;
    email: string;
    telefono: string;
}

const EMPTY_FORM: CreateClienteForm = {
    nombre: '',
    email: '',
    telefono: '',
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
    }).format(new Date(value));
}

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('admin_token') : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export default function AdminClientesPage() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateClienteForm>(EMPTY_FORM);

    useEffect(() => {
        let isMounted = true;

        async function loadClientes() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/admin/clientes', {
                    headers: getAuthHeaders(),
                });

                const payload = (await response.json()) as
                    | ClientesResponse
                    | { error?: string };

                if (!response.ok) {
                    throw new Error('error' in payload ? payload.error || 'No se pudo cargar.' : 'No se pudo cargar.');
                }

                const data = payload as ClientesResponse;

                if (!isMounted) {
                    return;
                }

                setClientes(data.clientes);
                setTotal(data.total);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'No se pudo cargar la lista de clientes.'
                );
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadClientes();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredClientes = clientes.filter((cliente) => {
        const term = search.trim().toLowerCase();
        if (!term) {
            return true;
        }

        return (
            cliente.nombre.toLowerCase().includes(term) ||
            cliente.email.toLowerCase().includes(term)
        );
    });

    async function handleCreateCliente(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsCreating(true);
            setCreateError(null);

            const response = await fetch('/api/admin/clientes', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(form),
            });

            const payload = (await response.json()) as
                | { success: true; cliente: Cliente }
                | { success: false; error?: string };

            if (!response.ok || !payload.success) {
                throw new Error(
                    'error' in payload ? payload.error || 'No se pudo crear el cliente.' : 'No se pudo crear el cliente.'
                );
            }

            setClientes((current) => [payload.cliente, ...current]);
            setTotal((current) => current + 1);
            setForm(EMPTY_FORM);
            setIsCreateOpen(false);
        } catch (createClientError) {
            setCreateError(
                createClientError instanceof Error
                    ? createClientError.message
                    : 'No se pudo crear el cliente.'
            );
        } finally {
            setIsCreating(false);
        }
    }

    if (isLoading) {
        return <PageLoading text="Cargando clientes..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500">Inicio &gt; Clientes</p>
                    <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Clientes</h1>
                    <p className="mt-2 text-sm text-zinc-600">
                        Gestiona la base de clientes y consulta su historial operativo.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => {
                        setCreateError(null);
                        setIsCreateOpen(true);
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar cliente
                </Button>
            </div>

            {error ? (
                <Alert variant="error" title="No se pudo cargar clientes">
                    {error}
                </Alert>
            ) : null}

            <Card className="border-zinc-200 shadow-sm">
                <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div>
                        <CardTitle className="text-xl text-zinc-950">Base de clientes</CardTitle>
                        <CardDescription>
                            {filteredClientes.length} de {total} clientes visibles
                        </CardDescription>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por nombre o email"
                            className="border-zinc-300 pl-9 focus-visible:ring-zinc-400"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {filteredClientes.length === 0 ? (
                        <EmptyState
                            icon={<Users className="h-8 w-8 text-zinc-400" />}
                            title="No hay clientes para mostrar"
                            description="Ajusta el buscador o crea un nuevo cliente desde el panel."
                            action={{
                                label: 'Agregar cliente',
                                onClick: () => setIsCreateOpen(true),
                            }}
                        />
                    ) : (
                        <>
                            <div className="hidden overflow-hidden rounded-xl border border-zinc-200 lg:block">
                                <Table>
                                    <TableHeader className="bg-zinc-50">
                                        <TableRow className="hover:bg-zinc-50">
                                            <TableHead className="text-zinc-600">Nombre</TableHead>
                                            <TableHead className="text-zinc-600">Email</TableHead>
                                            <TableHead className="text-zinc-600">Telefono</TableHead>
                                            <TableHead className="text-zinc-600">Localidad</TableHead>
                                            <TableHead className="text-zinc-600">Solicitudes</TableHead>
                                            <TableHead className="text-zinc-600">Registro</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredClientes.map((cliente) => (
                                            <TableRow
                                                key={cliente.id}
                                                className="cursor-pointer border-zinc-200 hover:bg-zinc-100/70"
                                                onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
                                            >
                                                <TableCell className="font-medium text-zinc-900">
                                                    {cliente.nombre}
                                                </TableCell>
                                                <TableCell className="text-zinc-700">{cliente.email}</TableCell>
                                                <TableCell className="text-zinc-700">
                                                    {cliente.telefono || 'Sin dato'}
                                                </TableCell>
                                                <TableCell className="text-zinc-700">
                                                    {cliente.localidad || 'Sin dato'}
                                                </TableCell>
                                                <TableCell className="text-zinc-700">
                                                    {cliente.total_solicitudes}
                                                </TableCell>
                                                <TableCell className="text-zinc-700">
                                                    {formatDate(cliente.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="grid gap-4 lg:hidden">
                                {filteredClientes.map((cliente) => (
                                    <Link
                                        key={cliente.id}
                                        href={`/admin/clientes/${cliente.id}`}
                                        className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-zinc-950">{cliente.nombre}</p>
                                                <p className="text-sm text-zinc-600">{cliente.email}</p>
                                            </div>
                                            <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                                                {cliente.total_solicitudes} solicitudes
                                            </div>
                                        </div>
                                        <div className="mt-4 grid gap-2 text-sm text-zinc-600">
                                            <p>Telefono: {cliente.telefono || 'Sin dato'}</p>
                                            <p>Localidad: {cliente.localidad || 'Sin dato'}</p>
                                            <p>Registro: {formatDate(cliente.created_at)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="border-zinc-200">
                    <DialogHeader>
                        <DialogTitle>Agregar cliente</DialogTitle>
                        <DialogDescription>
                            Crea un cliente base para luego asociarle solicitudes y equipos.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleCreateCliente}>
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                value={form.nombre}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, nombre: event.target.value }))
                                }
                                placeholder="Nombre y apellido o razon social"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, email: event.target.value }))
                                }
                                placeholder="cliente@empresa.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telefono">Telefono</Label>
                            <Input
                                id="telefono"
                                value={form.telefono}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, telefono: event.target.value }))
                                }
                                placeholder="+54 9 ..."
                            />
                        </div>

                        {createError ? (
                            <Alert variant="error" title="Alta fallida">
                                {createError}
                            </Alert>
                        ) : null}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="border-zinc-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreating}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                {isCreating ? 'Guardando...' : 'Crear cliente'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
