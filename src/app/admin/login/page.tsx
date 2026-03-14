'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuthClient } from '@/firebase/config';
import type { UserRole } from '@/types/auth';

type AdminRole = Extract<UserRole, 'admin' | 'mecanico' | 'repuestero'>;

const REDIRECT_BY_ROLE: Record<AdminRole, string> = {
    admin: '/admin',
    mecanico: '/admin/taller',
    repuestero: '/admin/repuestos',
};

function isAdminRole(role: UserRole): role is AdminRole {
    return role === 'admin' || role === 'mecanico' || role === 'repuestero';
}

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? window.localStorage.getItem('admin_token') : null;
        if (!token) {
            return;
        }

        document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const credentials = await signInWithEmailAndPassword(getAuthClient(), email, password);
            const [idToken, idTokenResult] = await Promise.all([
                credentials.user.getIdToken(true),
                credentials.user.getIdTokenResult(true),
            ]);

            const role = (idTokenResult.claims.role as UserRole | undefined) ?? 'cliente';

            if (!isAdminRole(role)) {
                await getAuthClient().signOut();
                setError('Tu usuario no tiene permisos para ingresar al panel admin.');
                return;
            }

            window.localStorage.setItem('admin_token', idToken);
            document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax`;

            router.replace(REDIRECT_BY_ROLE[role]);
            router.refresh();
        } catch (submitError) {
            console.error(submitError);
            setError('No se pudo iniciar sesion. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10"
            style={{ fontFamily: 'system-ui, Arial, sans-serif' }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,16,46,0.10),_transparent_38%)]" />

            <Card className="relative w-full max-w-md border-zinc-200 shadow-xl">
                <CardHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl text-zinc-900">Ingreso administrador</CardTitle>
                        <CardDescription className="text-zinc-600">
                            Accede al panel operativo de Agrobiciufa con tu cuenta asignada.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label className="text-zinc-700" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="admin@agrobiciufa.com"
                                className="border-zinc-300 focus-visible:ring-red-600"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-700" htmlFor="password">
                                Contrasena
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="••••••••"
                                className="border-zinc-300 focus-visible:ring-red-600"
                                required
                            />
                        </div>

                        {error ? (
                            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            className="h-11 w-full bg-red-600 text-white hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                'Ingresar al panel'
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-600">
                        Si no tienes permisos, vuelve a la{' '}
                        <Link className="font-medium text-red-600 hover:text-red-700" href="/">
                            web principal
                        </Link>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
