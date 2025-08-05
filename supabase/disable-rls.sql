-- Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS member_select_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_insert_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_update_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_delete_policy ON public.tenant_members;

-- Deshabilitar RLS completamente para la tabla tenant_members
ALTER TABLE public.tenant_members DISABLE ROW LEVEL SECURITY;

-- También deshabilitar RLS para las otras tablas relacionadas para evitar problemas
ALTER TABLE public.tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas de las otras tablas si existen
DROP POLICY IF EXISTS tenant_select_policy ON public.tenants;
DROP POLICY IF EXISTS tenant_update_policy ON public.tenants;
DROP POLICY IF EXISTS invitation_select_policy ON public.tenant_invitations;
DROP POLICY IF EXISTS invitation_insert_policy ON public.tenant_invitations;
DROP POLICY IF EXISTS campaign_select_policy ON public.campaigns;
DROP POLICY IF EXISTS campaign_insert_policy ON public.campaigns;
DROP POLICY IF EXISTS campaign_update_policy ON public.campaigns;
