'use client';

import { useEffect, useState } from 'react';

export interface ProductoCatalogo {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  marca?: string;
  modelo?: string;
  precio_contado?: number;
  precio_lista?: number;
  imagenes: string[];
  destacado: boolean;
}

const BASE_URL = (process.env.NEXT_PUBLIC_9001APP_URL ?? '').replace(/\/$/, '');
const TENANT_SLUG = (process.env.NEXT_PUBLIC_TENANT_SLUG ?? '').trim();

function normalizeProducto(raw: unknown): ProductoCatalogo | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as Record<string, unknown>;
  if (typeof item.id !== 'string' || typeof item.nombre !== 'string') {
    return null;
  }

  return {
    id: item.id,
    nombre: item.nombre,
    descripcion:
      typeof item.descripcion === 'string' ? item.descripcion : undefined,
    categoria: typeof item.categoria === 'string' ? item.categoria : 'otro',
    marca: typeof item.marca === 'string' ? item.marca : undefined,
    modelo: typeof item.modelo === 'string' ? item.modelo : undefined,
    precio_contado:
      typeof item.precio_contado === 'number' ? item.precio_contado : undefined,
    precio_lista:
      typeof item.precio_lista === 'number' ? item.precio_lista : undefined,
    imagenes: Array.isArray(item.imagenes)
      ? item.imagenes.filter((image): image is string => typeof image === 'string')
      : [],
    destacado: item.destacado === true,
  };
}

function extractProductos(payload: unknown): ProductoCatalogo[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = (payload as { data?: unknown }).data;
  const list = Array.isArray(data) ? data : [];

  return list
    .map(normalizeProducto)
    .filter((producto): producto is ProductoCatalogo => producto !== null);
}

export function useProductosCatalogo() {
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [loading, setLoading] = useState(Boolean(BASE_URL));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!BASE_URL) {
      setProductos([]);
      setLoading(false);
      setError('NEXT_PUBLIC_9001APP_URL no configurado');
      return;
    }

    const controller = new AbortController();

    async function loadProductos() {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${BASE_URL}/api/public/productos`);
        if (TENANT_SLUG) {
          url.searchParams.set('tenant', TENANT_SLUG);
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar el catalogo');
        }

        const data = (await response.json()) as unknown;
        setProductos(extractProductos(data));
      } catch (fetchError) {
        if (controller.signal.aborted) return;

        setProductos([]);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'No se pudo cargar el catalogo'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProductos();

    return () => controller.abort();
  }, []);

  return { productos, loading, error };
}
