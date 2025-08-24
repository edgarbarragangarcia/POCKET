-- ================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - MARKETINGIA
-- ================================================
-- Este archivo contiene el esquema completo para configurar
-- la base de datos en Supabase
-- ================================================

-- 1. HABILITAR EXTENSIONES NECESARIAS
-- ================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLA DE ORGANIZACIONES (TENANTS)
-- ================================================
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    is_active BOOLEAN DEFAULT true,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE MIEMBROS DE ORGANIZACIONES
-- ================================================
CREATE TABLE IF NOT EXISTS public.tenant_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID,
    UNIQUE(tenant_id, user_id)
);

-- 4. TABLA DE INVITACIONES
-- ================================================
CREATE TABLE IF NOT EXISTS public.tenant_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    UNIQUE(tenant_id, email)
);

-- 5. TABLA DE CAMPAÑAS
-- ================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE USER PERSONAS
-- ================================================
CREATE TABLE public.user_personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
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

-- 7. TABLA DE DESCRIPCIONES DE CONTENIDO
-- ================================================
CREATE TABLE public.content_descriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title character varying NOT NULL,
  description text NOT NULL,
  content_type character varying DEFAULT 'creative'::character varying,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 8. TABLA DE PRODUCTOS (OPCIONAL)
-- ================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    sku VARCHAR(100),
    category VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. FUNCIONES ÚTILES
-- ================================================
-- Función para actualizar automáticamente la columna updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ================================================
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_personas_update
    BEFORE UPDATE ON public.user_personas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_descriptions_update
    BEFORE UPDATE ON public.content_descriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ================================================
CREATE INDEX idx_content_descriptions_organization_id ON public.content_descriptions(organization_id);
CREATE INDEX idx_content_descriptions_created_by ON public.content_descriptions(created_by);
CREATE INDEX idx_content_descriptions_content_type ON public.content_descriptions(content_type);
CREATE INDEX idx_content_descriptions_created_at ON public.content_descriptions(created_at);
CREATE INDEX idx_user_personas_organization_id ON public.user_personas(organization_id);
CREATE INDEX idx_campaigns_tenant_id ON public.campaigns(tenant_id);
CREATE INDEX idx_campaigns_created_by ON public.campaigns(created_by);
CREATE INDEX idx_tenant_members_tenant_id ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_id ON public.tenant_members(user_id);
CREATE INDEX idx_products_organization_id ON public.products(organization_id);

-- 12. CONFIGURACIÓN DE SEGURIDAD (ROW LEVEL SECURITY)
-- ================================================
-- Habilitar RLS en todas las tablas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE RLS PARA TENANTS
CREATE POLICY tenant_select_policy ON public.tenants
    FOR SELECT
    USING (
        id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        ) OR owner_id = auth.uid()
    );

CREATE POLICY tenant_update_policy ON public.tenants
    FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY tenant_insert_policy ON public.tenants
    FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- POLÍTICAS DE RLS PARA MIEMBROS
CREATE POLICY member_select_policy ON public.tenant_members
    FOR SELECT
    USING (
        user_id = auth.uid()
    );

CREATE POLICY member_insert_policy ON public.tenant_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE id = tenant_members.tenant_id 
            AND owner_id = auth.uid()
        )
    );

-- POLÍTICAS DE RLS PARA INVITACIONES
CREATE POLICY invitation_select_policy ON public.tenant_invitations
    FOR SELECT
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE id = tenant_invitations.tenant_id 
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY invitation_insert_policy ON public.tenant_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE id = tenant_invitations.tenant_id 
            AND owner_id = auth.uid()
        )
    );

-- POLÍTICAS DE RLS PARA CAMPAÑAS
CREATE POLICY campaign_select_policy ON public.campaigns
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY campaign_insert_policy ON public.campaigns
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenant_members
            WHERE tenant_id = campaigns.tenant_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY campaign_update_policy ON public.campaigns
    FOR UPDATE
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.tenant_members
            WHERE tenant_id = campaigns.tenant_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- POLÍTICAS DE RLS PARA USER PERSONAS
CREATE POLICY user_personas_select_policy ON public.user_personas
    FOR SELECT
    USING (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY user_personas_insert_policy ON public.user_personas
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

-- POLÍTICAS DE RLS PARA DESCRIPCIONES DE CONTENIDO
CREATE POLICY content_descriptions_select_policy ON public.content_descriptions
    FOR SELECT
    USING (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY content_descriptions_insert_policy ON public.content_descriptions
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
        AND created_by = auth.uid()
    );

-- POLÍTICAS DE RLS PARA PRODUCTOS
CREATE POLICY products_select_policy ON public.products
    FOR SELECT
    USING (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY products_insert_policy ON public.products
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
            UNION
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

-- 13. COMENTARIOS DE DOCUMENTACIÓN
-- ================================================
COMMENT ON TABLE public.tenants IS 'Almacena las organizaciones/tenants del sistema';
COMMENT ON TABLE public.tenant_members IS 'Gestiona los miembros de cada organización';
COMMENT ON TABLE public.tenant_invitations IS 'Almacena las invitaciones pendientes a organizaciones';
COMMENT ON TABLE public.campaigns IS 'Almacena las campañas de marketing por organización';
COMMENT ON TABLE public.user_personas IS 'Almacena los perfiles de user persona para cada organización';
COMMENT ON TABLE public.content_descriptions IS 'Almacena descripciones de contenido para campañas';
COMMENT ON TABLE public.products IS 'Almacena productos/servicios de las organizaciones';

-- 14. DATOS INICIALES DE PRUEBA (OPCIONAL)
-- ================================================
-- Descomentar si deseas agregar datos de prueba
-- INSERT INTO public.tenants (name, slug, plan, owner_id) VALUES 
-- ('Demo Organization', 'demo-org', 'free', (SELECT id FROM auth.users LIMIT 1));

-- 15. VERIFICACIÓN DE INSTALACIÓN
-- ================================================
-- Ejecutar después de la instalación para verificar:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public';

-- ================================================
-- FIN DEL ESQUEMA
-- ================================================
-- GUARDAR ESTE ARCHIVO COMO: database-schema-complete.sql
-- EJECUTAR EN SUPABASE: Copiar y pegar todo el contenido
-- en el SQL Editor de tu proyecto Supabase
-- ================================================