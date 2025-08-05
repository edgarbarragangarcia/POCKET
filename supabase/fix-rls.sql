-- Primero eliminar todas las políticas existentes que puedan estar causando la recursión
DROP POLICY IF EXISTS member_select_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_insert_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_update_policy ON public.tenant_members;
DROP POLICY IF EXISTS member_delete_policy ON public.tenant_members;

-- Desactivar RLS temporalmente para la tabla tenant_members
ALTER TABLE public.tenant_members DISABLE ROW LEVEL SECURITY;

-- Reactivar RLS y crear políticas no recursivas
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

-- Política para seleccionar: un usuario puede ver miembros de tenants a los que pertenece
-- Esta política usa auth.uid() directamente sin consultas recursivas
CREATE POLICY member_select_policy ON public.tenant_members
    FOR SELECT
    USING (
        -- El usuario puede ver su propia membresía
        user_id = auth.uid()
        OR 
        -- O puede ver miembros de tenants donde es miembro (sin recursión)
        EXISTS (
            SELECT 1 
            FROM public.tenant_members AS tm
            WHERE tm.tenant_id = tenant_members.tenant_id
            AND tm.user_id = auth.uid()
        )
    );

-- Política para insertar: solo los usuarios con rol 'owner' o 'admin' pueden añadir miembros
CREATE POLICY member_insert_policy ON public.tenant_members
    FOR INSERT
    WITH CHECK (
        -- El usuario puede añadirse a sí mismo (para primera creación o aceptar invitaciones)
        user_id = auth.uid()
        OR
        -- O el usuario es owner/admin del tenant (sin recursión)
        EXISTS (
            SELECT 1 
            FROM public.tenant_members AS tm
            WHERE tm.tenant_id = tenant_members.tenant_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'admin')
        )
    );

-- Política para actualizar: solo los usuarios con rol 'owner' o 'admin' pueden actualizar miembros
CREATE POLICY member_update_policy ON public.tenant_members
    FOR UPDATE
    USING (
        -- El usuario puede actualizar su propia membresía
        user_id = auth.uid()
        OR
        -- O el usuario es owner/admin del tenant (sin recursión)
        EXISTS (
            SELECT 1 
            FROM public.tenant_members AS tm
            WHERE tm.tenant_id = tenant_members.tenant_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'admin')
        )
    );

-- Política para eliminar: solo los usuarios con rol 'owner' o 'admin' pueden eliminar miembros
CREATE POLICY member_delete_policy ON public.tenant_members
    FOR DELETE
    USING (
        -- El usuario puede eliminar su propia membresía
        user_id = auth.uid()
        OR
        -- O el usuario es owner/admin del tenant (sin recursión)
        EXISTS (
            SELECT 1 
            FROM public.tenant_members AS tm
            WHERE tm.tenant_id = tenant_members.tenant_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('owner', 'admin')
        )
    );
