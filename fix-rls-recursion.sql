-- ================================================
-- FIX PARA POLÍTICAS RLS CON RECURSION INFINITA
-- ================================================
-- Este archivo corrige las políticas RLS que causaban
-- recursion infinita en la tabla tenant_members
-- ================================================

-- 1. DESHABILITAR RLS TEMPORALMENTE (opcional)
-- ALTER TABLE public.tenant_members DISABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR LAS POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS member_select_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_insert_policy ON public.tenant_members;
DROP POLICY IF EXISTS invitation_select_policy ON public.tenant_invitations;
DROP POLICY IF EXISTS invitation_insert_policy ON public.tenant_invitations;

-- 3. CREAR NUEVAS POLÍTICAS SIN RECURSION

-- POLÍTICA PARA SELECT EN TENANT_MEMBERS
CREATE POLICY member_select_policy ON public.tenant_members
    FOR SELECT
    USING (
        user_id = auth.uid()
    );

-- POLÍTICA PARA INSERT EN TENANT_MEMBERS
CREATE POLICY member_insert_policy ON public.tenant_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE id = tenant_members.tenant_id 
            AND owner_id = auth.uid()
        )
    );

-- POLÍTICA PARA SELECT EN TENANT_INVITATIONS
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

-- POLÍTICA PARA INSERT EN TENANT_INVITATIONS
CREATE POLICY invitation_insert_policy ON public.tenant_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE id = tenant_invitations.tenant_id 
            AND owner_id = auth.uid()
        )
    );

-- 4. VERIFICAR LAS POLÍTICAS
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE tablename IN ('tenant_members', 'tenant_invitations')
ORDER BY tablename, policyname;

-- 5. INSTRUCCIONES DE USO
-- Copiar y pegar este SQL en el SQL Editor de Supabase
-- Luego reiniciar la aplicación para verificar que el error desaparece
-- ================================================