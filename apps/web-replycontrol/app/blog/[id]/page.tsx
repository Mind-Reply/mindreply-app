/**
 * Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
 * For maximum performance and SEO
 */

import { notFound } from 'next/navigation';
import { cache } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

// Reusable data fetching function with React cache
const getData = cache(async (id: string) => {
  if (!API_BASE_URL) return null;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/data/${id}`,
      {
        next: {
          revalidate: parseInt(process.env.ISR_REVALIDATE_SECONDS || '3600', 10),
        },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error('Data fetch error:', error);
    return null;
  }
});

// ===== STATIC PAGE EXAMPLE =====
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) notFound();

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}

// Static params generation for SSG
export async function generateStaticParams() {
  if (!API_BASE_URL) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/data/all`);
    const data = await res.json();

    return data.map((item: any) => ({
      id: item.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) {
    return {
      title: 'Not Found',
      description: 'The requested page was not found',
    };
  }

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      image: data.image,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      image: data.image,
    },
  };
}

// Revalidate on-demand
export const revalidate = 3600;
