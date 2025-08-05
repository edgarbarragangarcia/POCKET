-- Crear tabla para tenants (organizaciones)
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

-- Crear tabla para miembros de tenants
CREATE TABLE IF NOT EXISTS public.tenant_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invitation_id UUID,
    UNIQUE(tenant_id, user_id)
);

-- Crear tabla para invitaciones a tenants
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

-- Crear tabla para campañas
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

-- Crear políticas RLS (Row Level Security)
-- Permitir a los usuarios ver solo los tenants a los que pertenecen
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_select_policy ON public.tenants
    FOR SELECT
    USING (
        id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        ) OR owner_id = auth.uid()
    );

-- Permitir a los propietarios actualizar sus tenants
CREATE POLICY tenant_update_policy ON public.tenants
    FOR UPDATE
    USING (owner_id = auth.uid());

-- Políticas para tenant_members
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY member_select_policy ON public.tenant_members
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

-- Solo los propietarios o admins pueden gestionar miembros
CREATE POLICY member_insert_policy ON public.tenant_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenant_members
            WHERE tenant_id = tenant_members.tenant_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        ) OR 
        -- Permitir al usuario aceptar invitaciones a sí mismo
        (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
            SELECT email FROM public.tenant_invitations 
            WHERE tenant_id = tenant_members.tenant_id AND status = 'pending'
        )
    );

-- Políticas para tenant_invitations
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY invitation_select_policy ON public.tenant_invitations
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        ) OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Solo los propietarios o admins pueden crear invitaciones
CREATE POLICY invitation_insert_policy ON public.tenant_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenant_members
            WHERE tenant_id = tenant_invitations.tenant_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Políticas para campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY campaign_select_policy ON public.campaigns
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()
        )
    );

-- Solo los miembros de un tenant pueden crear campañas en ese tenant
CREATE POLICY campaign_insert_policy ON public.campaigns
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenant_members
            WHERE tenant_id = campaigns.tenant_id 
            AND user_id = auth.uid()
        )
    );

-- Solo el creador o admins/propietarios pueden actualizar campañas
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

-- Crear funciones y triggers para mantener campos de fecha actualizados
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
