/**
 * CMS Integration Examples
 * Supports Contentful, Sanity, and other headless CMS
 */

// ===== CONTENTFUL CMS =====
export const setupContentful = () => {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  if (!space || !accessToken) {
    console.warn('⚠️  Contentful not configured');
    return null;
  }

  const baseUrl = `https://cdn.contentful.com/spaces/${space}/environments/${environment}`;

  return {
    fetchEntries: async (contentType: string) => {
      const res = await fetch(
        `${baseUrl}/entries?content_type=${contentType}&access_token=${accessToken}`
      );
      if (!res.ok) throw new Error('Failed to fetch from Contentful');
      return res.json();
    },
    fetchEntry: async (id: string) => {
      const res = await fetch(
        `${baseUrl}/entries/${id}?access_token=${accessToken}`
      );
      if (!res.ok) throw new Error('Failed to fetch entry from Contentful');
      return res.json();
    },
  };
};

// ===== SANITY CMS =====
export const setupSanity = () => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId) {
    console.warn('⚠️  Sanity not configured');
    return null;
  }

  const baseUrl = `https://${projectId}.api.sanity.io/v2021-03-25/data/query/${dataset}`;

  return {
    query: async (query: string, params?: Record<string, any>) => {
      const url = new URL(baseUrl);
      url.searchParams.set('query', query);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(`$${key}`, JSON.stringify(value));
        });
      }

      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Sanity query failed');
      return res.json();
    },
  };
};

// ===== STRAPI CMS =====
export const setupStrapi = () => {
  const baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  const token = process.env.STRAPI_API_TOKEN;

  return {
    fetchCollection: async (collection: string) => {
      const res = await fetch(`${baseUrl}/api/${collection}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Failed to fetch ${collection}`);
      return res.json();
    },
    fetchItem: async (collection: string, id: string) => {
      const res = await fetch(`${baseUrl}/api/${collection}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Failed to fetch item from ${collection}`);
      return res.json();
    },
  };
};

// ===== NOTION CMS =====
export const setupNotion = () => {
  const token = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    console.warn('⚠️  Notion not configured');
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': '2022-06-28',
  };

  return {
    queryDatabase: async (filter?: Record<string, any>) => {
      const res = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ filter }),
        }
      );
      if (!res.ok) throw new Error('Notion query failed');
      return res.json();
    },
  };
};

// ===== SHARED CMS INTERFACE =====
export interface CMSProvider {
  fetchEntries?: (type: string) => Promise<any>;
  fetchEntry?: (id: string) => Promise<any>;
  query?: (query: string, params?: Record<string, any>) => Promise<any>;
  queryDatabase?: (filter?: Record<string, any>) => Promise<any>;
}

// Initialize available CMS providers
export const initializeCMS = (): Record<string, CMSProvider> => {
  return {
    contentful: setupContentful() || {},
    sanity: setupSanity() || {},
    strapi: setupStrapi() || {},
    notion: setupNotion() || {},
  };
};
