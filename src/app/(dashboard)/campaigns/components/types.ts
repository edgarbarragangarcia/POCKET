export interface Module {
  type: 'company' | 'product' | 'dynamic' | 'product_instance' | 'user_persona' | 'content_instance';
  name: string;
  description: string;
  dependencies?: string[];
  productId?: string;
  companyId?: string;
  price?: number;
  userPersonaId?: string;
  contentId?: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  company_id: string;
  sku?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserPersona {
  id: string;
  organization_id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  goals: string[];
  frustrations: string[];
  motivations: string[];
  bio: string;
  created_at: string;
  updated_at?: string;
}

export interface ModuleInstance extends Module {
  id: string;
  position: { x: number; y: number };
  data: Module;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface Organization {
  id: string; // Este es el ID de tipo UUID
  name: string;
  created_at: string;
}

export interface ContentDescription {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  content_type?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}
