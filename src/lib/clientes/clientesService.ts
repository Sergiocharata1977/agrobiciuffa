import {
    type DocumentData,
    type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

import { getAdminDb } from '@/firebase/admin';
import type { Cliente, EquipoCliente } from '@/types/clientes';

const CLIENTES_COLLECTION = 'clientes';

function toIsoString(value: unknown): string {
    if (!value) {
        return new Date(0).toISOString();
    }

    if (typeof value === 'string') {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof value.toDate === 'function'
    ) {
        return value.toDate().toISOString();
    }

    return new Date(value as string | number).toISOString();
}

function mapCliente(snapshot: QueryDocumentSnapshot<DocumentData>): Cliente {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        email: typeof data.email === 'string' ? data.email : '',
        nombre: typeof data.nombre === 'string' ? data.nombre : '',
        telefono: typeof data.telefono === 'string' ? data.telefono : undefined,
        localidad: typeof data.localidad === 'string' ? data.localidad : undefined,
        cuit: typeof data.cuit === 'string' ? data.cuit : undefined,
        created_at: toIsoString(data.created_at),
        updated_at: toIsoString(data.updated_at),
        total_solicitudes:
            typeof data.total_solicitudes === 'number' ? data.total_solicitudes : 0,
        crm_id: typeof data.crm_id === 'string' ? data.crm_id : undefined,
    };
}

function mapEquipo(snapshot: QueryDocumentSnapshot<DocumentData>): EquipoCliente {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        cliente_id: typeof data.cliente_id === 'string' ? data.cliente_id : '',
        numero_serie: typeof data.numero_serie === 'string' ? data.numero_serie : '',
        marca: typeof data.marca === 'string' ? data.marca : '',
        modelo: typeof data.modelo === 'string' ? data.modelo : '',
        anio: typeof data.anio === 'number' ? data.anio : undefined,
        tipo:
            typeof data.tipo === 'string' && data.tipo.trim()
                ? data.tipo
                : 'Tractor',
        created_at: toIsoString(data.created_at),
    };
}

export async function listClientes(
    limit = 50,
    offset = 0
): Promise<{ clientes: Cliente[]; total: number }> {
    const db = getAdminDb();
    const clientesRef = db.collection(CLIENTES_COLLECTION);

    const [clientesSnapshot, totalSnapshot] = await Promise.all([
        clientesRef.orderBy('created_at', 'desc').offset(offset).limit(limit).get(),
        clientesRef.count().get(),
    ]);

    return {
        clientes: clientesSnapshot.docs.map(mapCliente),
        total: totalSnapshot.data().count,
    };
}

export async function getClienteById(id: string): Promise<Cliente | null> {
    const snapshot = await getAdminDb().collection(CLIENTES_COLLECTION).doc(id).get();

    if (!snapshot.exists) {
        return null;
    }

    return mapCliente(snapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function getEquiposByClienteId(id: string): Promise<EquipoCliente[]> {
    const snapshot = await getAdminDb()
        .collection('equipos')
        .where('cliente_id', '==', id)
        .orderBy('created_at', 'desc')
        .get();

    return snapshot.docs.map(mapEquipo);
}

export async function createCliente(
    data: Pick<Cliente, 'nombre' | 'email'> &
        Partial<Pick<Cliente, 'telefono' | 'localidad' | 'cuit'>>
): Promise<Cliente> {
    const now = new Date();
    const payload = {
        nombre: data.nombre.trim(),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono?.trim() || '',
        localidad: data.localidad?.trim() || '',
        cuit: data.cuit?.trim() || '',
        created_at: now,
        updated_at: now,
        total_solicitudes: 0,
    };

    const docRef = await getAdminDb().collection(CLIENTES_COLLECTION).add(payload);
    const snapshot = await docRef.get();

    return mapCliente(snapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function updateCliente(
    id: string,
    data: Partial<Pick<Cliente, 'nombre' | 'telefono' | 'localidad' | 'cuit'>>
): Promise<void> {
    await getAdminDb()
        .collection(CLIENTES_COLLECTION)
        .doc(id)
        .update({
            ...data,
            updated_at: new Date(),
        });
}
