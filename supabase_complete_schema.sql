-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA SUPABASE
-- Sistema de Gestión de Campañas de Marketing
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para actualizar automáticamente la columna updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLA: tenants (Organizaciones/Inquilinos)
-- =====================================================

DROP TABLE IF EXISTS public.tenants CASCADE;
CREATE TABLE public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  logo_url TEXT,
  settings JSONB DEFAULT '{
    "brandColors": {
      "primary": "#3B82F6",
      "secondary": "#8B5CF6",
      "accent": "#10B981"
    },
    "features": {
      "aiAssistant": false,
      "advancedAnalytics": false,
      "multiLanguageCampaigns": false,
      "customIntegrations": false,
      "prioritySupport": false,
      "maxUsers": 5,
      "maxCampaignsPerMonth": 10,
      "maxStorageGb": 5
    },
    "locales": ["es-ES"],
    "defaultLocale": "es-ES"
  }',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para tenants
CREATE INDEX idx_tenants_owner_id ON public.tenants(owner_id);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_is_active ON public.tenants(is_active);

-- Trigger para updated_at en tenants
CREATE TRIGGER on_tenants_update
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: tenant_members (Miembros de Organizaciones)
-- =====================================================

DROP TABLE IF EXISTS public.tenant_members CASCADE;
CREATE TABLE public.tenant_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, tenant_id)
);

-- Índices para tenant_members
CREATE INDEX idx_tenant_members_user_id ON public.tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant_id ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_role ON public.tenant_members(role);

-- =====================================================
-- TABLA: tenant_invitations (Invitaciones a Organizaciones)
-- =====================================================

DROP TABLE IF EXISTS public.tenant_invitations CASCADE;
CREATE TABLE public.tenant_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days') NOT NULL,
  UNIQUE(tenant_id, email)
);

-- Índices para tenant_invitations
CREATE INDEX idx_tenant_invitations_tenant_id ON public.tenant_invitations(tenant_id);
CREATE INDEX idx_tenant_invitations_email ON public.tenant_invitations(email);
CREATE INDEX idx_tenant_invitations_status ON public.tenant_invitations(status);
CREATE INDEX idx_tenant_invitations_expires_at ON public.tenant_invitations(expires_at);

-- =====================================================
-- TABLA: organizations (Organizaciones - Compatibilidad)
-- =====================================================

DROP TABLE IF EXISTS public.organizations CASCADE;
CREATE TABLE public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para organizations
CREATE INDEX idx_organizations_user_id ON public.organizations(user_id);
CREATE INDEX idx_organizations_tenant_id ON public.organizations(tenant_id);

-- Trigger para updated_at en organizations
CREATE TRIGGER on_organizations_update
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: campaigns (Campañas de Marketing)
-- =====================================================

DROP TABLE IF EXISTS public.campaigns CASCADE;
CREATE TABLE public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'archived')),
  budget DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para campaigns
CREATE INDEX idx_campaigns_tenant_id ON public.campaigns(tenant_id);
CREATE INDEX idx_campaigns_created_by ON public.campaigns(created_by);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_start_date ON public.campaigns(start_date);
CREATE INDEX idx_campaigns_is_deleted ON public.campaigns(is_deleted);

-- Trigger para updated_at en campaigns
CREATE TRIGGER on_campaigns_update
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: campaign_channels (Canales de Campañas)
-- =====================================================

DROP TABLE IF EXISTS public.campaign_channels CASCADE;
CREATE TABLE public.campaign_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('facebook', 'instagram', 'google', 'email', 'twitter', 'linkedin', 'tiktok', 'other')),
  budget DECIMAL(10,2) DEFAULT 0,
  content JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para campaign_channels
CREATE INDEX idx_campaign_channels_campaign_id ON public.campaign_channels(campaign_id);
CREATE INDEX idx_campaign_channels_channel_type ON public.campaign_channels(channel_type);

-- Trigger para updated_at en campaign_channels
CREATE TRIGGER on_campaign_channels_update
  BEFORE UPDATE ON public.campaign_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: products (Productos)
-- =====================================================

DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para products
CREATE INDEX idx_products_organization_id ON public.products(organization_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- Trigger para updated_at en products
CREATE TRIGGER on_products_update
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: user_personas (Perfiles de Usuario)
-- =====================================================

DROP TABLE IF EXISTS public.user_personas CASCADE;
CREATE TABLE public.user_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT,
  gender TEXT,
  occupation TEXT,
  goals TEXT[],
  frustrations TEXT[],
  motivations TEXT[],
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para user_personas
CREATE INDEX idx_user_personas_organization_id ON public.user_personas(organization_id);

-- Trigger para updated_at en user_personas
CREATE TRIGGER on_user_personas_update
  BEFORE UPDATE ON public.user_personas
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TABLA: content_descriptions (Descripciones de Contenido)
-- =====================================================

DROP TABLE IF EXISTS public.content_descriptions CASCADE;
CREATE TABLE public.content_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT DEFAULT 'creative',
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para content_descriptions
CREATE INDEX idx_content_descriptions_organization_id ON public.content_descriptions(organization_id);
CREATE INDEX idx_content_descriptions_created_by ON public.content_descriptions(created_by);
CREATE INDEX idx_content_descriptions_content_type ON public.content_descriptions(content_type);
CREATE INDEX idx_content_descriptions_created_at ON public.content_descriptions(created_at);

-- Trigger para updated_at en content_descriptions
CREATE TRIGGER on_content_descriptions_update
  BEFORE UPDATE ON public.content_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- CONFIGURACIÓN DE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_descriptions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA TENANTS
-- =====================================================

-- Los usuarios pueden ver los tenants donde son miembros
CREATE POLICY "Users can view their tenants" ON public.tenants
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.tenant_members WHERE tenant_id = tenants.id
    )
  );

-- Solo los propietarios pueden actualizar tenants
CREATE POLICY "Only owners can update tenants" ON public.tenants
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT user_id FROM public.tenant_members 
      WHERE tenant_id = tenants.id AND role = 'owner'
    )
  );

-- Los usuarios autenticados pueden crear tenants
CREATE POLICY "Authenticated users can create tenants" ON public.tenants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- =====================================================
-- POLÍTICAS RLS PARA TENANT_MEMBERS
-- =====================================================

-- Los usuarios pueden ver miembros de tenants donde son propietarios
CREATE POLICY "Users can view members of their tenants" ON public.tenant_members
  FOR SELECT USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    ) OR user_id = auth.uid()
  );

-- Los propietarios pueden insertar miembros
CREATE POLICY "Owners can insert members" ON public.tenant_members
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- Los propietarios pueden actualizar miembros
CREATE POLICY "Owners can update members" ON public.tenant_members
  FOR UPDATE USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- Los propietarios pueden eliminar miembros
CREATE POLICY "Owners can delete members" ON public.tenant_members
  FOR DELETE USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA TENANT_INVITATIONS
-- =====================================================

-- Los usuarios pueden ver invitaciones de sus tenants
CREATE POLICY "Users can view invitations of their tenants" ON public.tenant_invitations
  FOR SELECT USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- Solo los propietarios pueden gestionar invitaciones
CREATE POLICY "Owners can manage invitations" ON public.tenant_invitations
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA ORGANIZATIONS
-- =====================================================

-- Los usuarios pueden ver sus propias organizaciones
CREATE POLICY "Users can view their organizations" ON public.organizations
  FOR SELECT USING (
    auth.uid() = user_id OR
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    )
  );

-- Los usuarios pueden gestionar sus propias organizaciones
CREATE POLICY "Users can manage their organizations" ON public.organizations
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA CAMPAIGNS
-- =====================================================

-- Los usuarios pueden acceder a campañas de sus tenants
CREATE POLICY "Users can access their tenant campaigns" ON public.campaigns
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM public.tenants 
      WHERE owner_id = auth.uid()
    ) OR created_by = auth.uid()
  );

-- =====================================================
-- POLÍTICAS RLS PARA CAMPAIGN_CHANNELS
-- =====================================================

-- Los usuarios pueden acceder a canales de campañas de sus tenants
CREATE POLICY "Users can access campaign channels" ON public.campaign_channels
  FOR ALL USING (
    campaign_id IN (
      SELECT id FROM public.campaigns 
      WHERE tenant_id IN (
        SELECT id FROM public.tenants 
        WHERE owner_id = auth.uid()
      ) OR created_by = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA PRODUCTS
-- =====================================================

-- Los usuarios pueden ver productos de sus organizaciones
CREATE POLICY "Users can view products from their organizations" ON public.products
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM public.organizations 
      WHERE user_id = auth.uid() OR
      tenant_id IN (
        SELECT id FROM public.tenants 
        WHERE owner_id = auth.uid()
      )
    )
  );

-- Los usuarios pueden gestionar productos de sus organizaciones
CREATE POLICY "Users can manage products from their organizations" ON public.products
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM public.organizations 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA USER_PERSONAS
-- =====================================================

-- Los usuarios pueden gestionar personas de sus organizaciones
CREATE POLICY "Users can manage personas from their organizations" ON public.user_personas
  FOR ALL USING (
    auth.uid() = (
      SELECT user_id FROM public.organizations 
      WHERE id = organization_id
    )
  );

-- =====================================================
-- POLÍTICAS RLS PARA CONTENT_DESCRIPTIONS
-- =====================================================

-- Los usuarios pueden ver descripciones de contenido de sus organizaciones
CREATE POLICY "Users can view content descriptions from their organizations" ON public.content_descriptions
  FOR SELECT USING (
    organization_id IN (
      SELECT o.id FROM public.organizations o
      WHERE o.user_id = auth.uid()
      OR o.tenant_id IN (
        SELECT id FROM public.tenants
        WHERE owner_id = auth.uid()
      )
    )
  );

-- Los usuarios pueden crear descripciones de contenido para sus organizaciones
CREATE POLICY "Users can create content descriptions for their organizations" ON public.content_descriptions
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT o.id FROM public.organizations o
      WHERE o.user_id = auth.uid()
      OR o.tenant_id IN (
        SELECT id FROM public.tenants
        WHERE owner_id = auth.uid()
      )
    )
    AND created_by = auth.uid()
  );

-- Los usuarios pueden actualizar sus propias descripciones de contenido
CREATE POLICY "Users can update their own content descriptions" ON public.content_descriptions
  FOR UPDATE USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Los usuarios pueden eliminar sus propias descripciones de contenido
CREATE POLICY "Users can delete their own content descriptions" ON public.content_descriptions
  FOR DELETE USING (created_by = auth.uid());

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

-- Comentarios para tenants
COMMENT ON TABLE public.tenants IS 'Organizaciones o inquilinos del sistema multi-tenant';
COMMENT ON COLUMN public.tenants.slug IS 'Identificador único legible para URLs';
COMMENT ON COLUMN public.tenants.settings IS 'Configuraciones específicas del tenant en formato JSON';

-- Comentarios para tenant_members
COMMENT ON TABLE public.tenant_members IS 'Miembros de cada organización con sus roles';
COMMENT ON COLUMN public.tenant_members.role IS 'Rol del usuario: owner, admin, editor, viewer';

-- Comentarios para campaigns
COMMENT ON TABLE public.campaigns IS 'Campañas de marketing creadas por los usuarios';
COMMENT ON COLUMN public.campaigns.metrics IS 'Métricas de rendimiento de la campaña en formato JSON';

-- Comentarios para products
COMMENT ON TABLE public.products IS 'Productos o servicios de cada organización';
COMMENT ON COLUMN public.products.sku IS 'Código único de producto (Stock Keeping Unit)';

-- Comentarios para user_personas
COMMENT ON TABLE public.user_personas IS 'Perfiles de usuario objetivo para campañas de marketing';
COMMENT ON COLUMN public.user_personas.goals IS 'Objetivos del persona';
COMMENT ON COLUMN public.user_personas.frustrations IS 'Frustraciones o puntos de dolor';
COMMENT ON COLUMN public.user_personas.motivations IS 'Motivaciones que impulsan al persona';

-- Comentarios para content_descriptions
COMMENT ON TABLE public.content_descriptions IS 'Descripciones de contenido para construcción de campañas';
COMMENT ON COLUMN public.content_descriptions.metadata IS 'Metadatos adicionales como audiencia objetivo, tono, etc.';

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar datos de ejemplo solo si no existen
-- Nota: Reemplaza los UUIDs con valores reales según sea necesario

/*
-- Ejemplo de tenant
INSERT INTO public.tenants (id, name, slug, owner_id) 
VALUES (
  'example-tenant-id',
  'Mi Empresa',
  'mi-empresa',
  'user-id-from-auth'
) ON CONFLICT (slug) DO NOTHING;

-- Ejemplo de organización
INSERT INTO public.organizations (id, name, user_id, tenant_id)
VALUES (
  'example-org-id',
  'Mi Organización',
  'user-id-from-auth',
  'example-tenant-id'
) ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================

-- Este esquema proporciona:
-- 1. Sistema multi-tenant completo
-- 2. Gestión de usuarios y roles
-- 3. Campañas de marketing con canales
-- 4. Productos y servicios
-- 5. Perfiles de usuario (personas)
-- 6. Descripciones de contenido
-- 7. Seguridad a nivel de fila (RLS)
-- 8. Índices para optimización
-- 9. Triggers para auditoría
-- 10. Comentarios para documentación