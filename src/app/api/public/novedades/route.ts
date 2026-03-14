import {
    type DocumentData,
    type Query,
    type QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

import { getAdminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

type Novedad = {
    id: string;
    titulo?: string;
    resumen?: string;
    contenido?: string;
    imagen?: string;
    tags: string[];
    publicada: boolean;
    publicada_at?: string;
    created_at?: string;
    [key: string]: unknown;
};

function toPositiveInt(value: string | null, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function toIsoString(value: unknown): string | undefined {
    if (!value) {
        return undefined;
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

    const date = new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function mapNovedad(snapshot: QueryDocumentSnapshot<DocumentData>): Novedad {
    const data = snapshot.data();

    return {
        id: snapshot.id,
        ...data,
        tags: Array.isArray(data.tags)
            ? data.tags.filter((tag): tag is string => typeof tag === 'string')
            : [],
        publicada: data.publicada === true,
        publicada_at: toIsoString(data.publicada_at),
        created_at: toIsoString(data.created_at),
    };
}

function buildBaseQuery(tag?: string): Query<DocumentData> {
    let query: Query<DocumentData> = getAdminDb()
        .collection('novedades')
        .where('publicada', '==', true);

    if (tag) {
        query = query.where('tags', 'array-contains', tag);
    }

    return query;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = toPositiveInt(searchParams.get('limit'), 6);
        const offset = toPositiveInt(searchParams.get('offset'), 0);
        const tag = searchParams.get('tag')?.trim() || undefined;

        const baseQuery = buildBaseQuery(tag);
        const [snapshot, totalSnapshot] = await Promise.all([
            baseQuery.orderBy('publicada_at', 'desc').offset(offset).limit(limit).get(),
            baseQuery.count().get(),
        ]);

        const total = totalSnapshot.data().count;

        if (total === 0) {
            return NextResponse.json({ novedades: [], total: 0 });
        }

        return NextResponse.json({
            novedades: snapshot.docs.map(mapNovedad),
            total,
        });
    } catch (error) {
        console.error('Error listing novedades:', error);

        return NextResponse.json(
            { success: false, error: 'No se pudieron obtener las novedades.' },
            { status: 500 }
        );
    }
}
