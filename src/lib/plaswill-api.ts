/**
 * Cliente TypeScript Oficial da API Corporativa Institucional da Plaswill
 * Endpoint oficial: https://ged.plaswill.tech/api/v1/plaswill
 */

export interface PlaswillMetadata {
  api_version: string;
  content_version: string;
  status: "published" | "draft" | "pending_review";
  language: string;
  last_updated: string;
  documentation: string;
}

export interface Identification {
  trade_name: string;
  legal_name: string;
  cnpj: string;
  state_registration: string;
  foundation_date: string;
  headquarters: string;
  years_in_market: number;
  official_website: string;
  tagline: string;
  short_description: string;
  full_description: string;
  industry_segment: string;
}

export interface Institutional {
  what_we_do: string;
  history: string;
  purpose: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface Differentiator {
  title: string;
  description: string;
  evidence: string;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  technical_specs: string;
  material: string;
  application: string;
  key_benefits: string[];
}

export interface TargetSegments {
  client_profiles: string[];
  served_industries: string[];
  key_problems_solved: string[];
  verified_clients_served: string[];
}

export interface CommercialContact {
  official_website: string;
  general_email: string;
  dpo_email: string;
  phone_numbers: Array<{
    number: string;
    display: string;
    label: string;
  }>;
  whatsapp_channels: Array<{
    number: string;
    display: string;
    label: string;
    direct_link: string;
  }>;
  physical_address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    state_code: string;
    postal_code: string;
    country: string;
    google_maps_url: string;
  };
  social_links: {
    instagram: string;
    linkedin: string;
    facebook: string;
  };
}

export interface Branding {
  colors: {
    primary_yellow: string;
    corporate_petroleum_blue: string;
    corporate_petroleum_hover: string;
    dark_industrial_bg: string;
    neutral_surface: string;
  };
  typography: {
    primary_font: string;
    secondary_font: string;
    fallback_font: string;
  };
  assets: {
    logo_svg: string;
    logo_png: string;
    photo_factory: string;
    photo_aerial: string;
  };
}

export interface PlaswillProfileResponse {
  metadata: PlaswillMetadata;
  company: {
    identification: Identification;
    institutional: Institutional;
    differentiators: Differentiator[];
    products: Product[];
    target_segments: TargetSegments;
    commercial_contact: CommercialContact;
    branding: Branding;
  };
}

export interface PlaswillProductsResponse {
  metadata: PlaswillMetadata;
  total_products: number;
  products: Product[];
}

export interface PlaswillCompanyResponse {
  metadata: PlaswillMetadata;
  identification: Identification;
  institutional: Institutional;
  differentiators: Differentiator[];
  target_segments: TargetSegments;
}

export interface PlaswillContactResponse {
  metadata: PlaswillMetadata;
  commercial_contact: CommercialContact;
}

export interface PlaswillBrandingResponse {
  metadata: PlaswillMetadata;
  branding: Branding;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_PLASWILL_API_URL || "https://ged.plaswill.tech/api/v1/plaswill";

/**
 * Busca o perfil corporativo completo da Plaswill (Next.js ISR revalidation ou SSR).
 */
export async function getPlaswillProfile(
  revalidateSeconds: number = 3600
): Promise<PlaswillProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    next: { revalidate: revalidateSeconds, tags: ["plaswill-profile"] },
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar perfil Plaswill: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Busca os produtos do catálogo técnico com especificações e benefícios.
 */
export async function getPlaswillProducts(
  revalidateSeconds: number = 3600
): Promise<PlaswillProductsResponse> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    next: { revalidate: revalidateSeconds, tags: ["plaswill-products"] },
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar catálogo de produtos: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Busca canais de contato, endereços e redes sociais oficiais.
 */
export async function getPlaswillContact(
  revalidateSeconds: number = 3600
): Promise<PlaswillContactResponse> {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    next: { revalidate: revalidateSeconds, tags: ["plaswill-contact"] },
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar canais de contato: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Busca os tokens de branding (paleta de cores, tipografia, URLs de logotipos).
 */
export async function getPlaswillBranding(
  revalidateSeconds: number = 3600
): Promise<PlaswillBrandingResponse> {
  const res = await fetch(`${API_BASE_URL}/branding`, {
    next: { revalidate: revalidateSeconds, tags: ["plaswill-branding"] },
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar tokens de branding: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
