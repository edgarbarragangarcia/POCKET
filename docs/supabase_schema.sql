-- Tabla para almacenar los User Personas
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

-- Comentarios para mayor claridad
COMMENT ON TABLE public.user_personas IS 'Almacena los perfiles de user persona para cada organización.';
COMMENT ON COLUMN public.user_personas.organization_id IS 'Referencia a la organización a la que pertenece este persona.';
COMMENT ON COLUMN public.user_personas.name IS 'Nombre del arquetipo de persona (ej. "Carlos, el Cauteloso").';
COMMENT ON COLUMN public.user_personas.goals IS 'Lista de objetivos que el persona quiere alcanzar.';
COMMENT ON COLUMN public.user_personas.frustrations IS 'Lista de frustraciones o puntos de dolor del persona.';
COMMENT ON COLUMN public.user_personas.motivations IS 'Lista de motivaciones que impulsan al persona.';
COMMENT ON COLUMN public.user_personas.bio IS 'Una breve biografía o resumen del persona.';

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios gestionar los personas de su propia organización
CREATE POLICY "Permitir acceso completo a los personas de la propia organización"
ON public.user_personas
FOR ALL
USING (
  auth.uid() = (
    SELECT user_id FROM public.organizations WHERE id = organization_id
  )
);

-- Función para actualizar automáticamente la columna updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para ejecutar la función en cada actualización
CREATE TRIGGER on_user_personas_update
BEFORE UPDATE ON public.user_personas
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
