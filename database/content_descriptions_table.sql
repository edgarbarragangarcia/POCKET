-- Content Descriptions Table
-- This table stores content descriptions created in the Content Module
-- and relates to the existing schema structure

CREATE TABLE public.content_descriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  title character varying NOT NULL,
  description text NOT NULL,
  content_type character varying DEFAULT 'creative'::character varying,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT content_descriptions_pkey PRIMARY KEY (id),
  CONSTRAINT content_descriptions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE,
  CONSTRAINT content_descriptions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_content_descriptions_organization_id ON public.content_descriptions(organization_id);
CREATE INDEX idx_content_descriptions_created_by ON public.content_descriptions(created_by);
CREATE INDEX idx_content_descriptions_content_type ON public.content_descriptions(content_type);
CREATE INDEX idx_content_descriptions_created_at ON public.content_descriptions(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.content_descriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see content descriptions from organizations they belong to
CREATE POLICY "Users can view content descriptions from their organizations" ON public.content_descriptions
  FOR SELECT USING (
    organization_id IN (
      SELECT o.id FROM public.organizations o
      WHERE o.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.tenant_members tm
        JOIN public.tenants t ON tm.tenant_id = t.id
        WHERE tm.user_id = auth.uid()
        AND t.owner_id = o.user_id
      )
    )
  );

-- Policy: Users can insert content descriptions for organizations they belong to
CREATE POLICY "Users can create content descriptions for their organizations" ON public.content_descriptions
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT o.id FROM public.organizations o
      WHERE o.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.tenant_members tm
        JOIN public.tenants t ON tm.tenant_id = t.id
        WHERE tm.user_id = auth.uid()
        AND t.owner_id = o.user_id
      )
    )
    AND created_by = auth.uid()
  );

-- Policy: Users can update their own content descriptions
CREATE POLICY "Users can update their own content descriptions" ON public.content_descriptions
  FOR UPDATE USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policy: Users can delete their own content descriptions
CREATE POLICY "Users can delete their own content descriptions" ON public.content_descriptions
  FOR DELETE USING (created_by = auth.uid());

-- Add comments for documentation
COMMENT ON TABLE public.content_descriptions IS 'Stores content descriptions created in the Content Module for campaign building';
COMMENT ON COLUMN public.content_descriptions.id IS 'Unique identifier for the content description';
COMMENT ON COLUMN public.content_descriptions.organization_id IS 'Reference to the organization this content belongs to';
COMMENT ON COLUMN public.content_descriptions.title IS 'Title/name of the content piece';
COMMENT ON COLUMN public.content_descriptions.description IS 'Detailed description of the content';
COMMENT ON COLUMN public.content_descriptions.content_type IS 'Type of content (creative, copy, visual, etc.)';
COMMENT ON COLUMN public.content_descriptions.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN public.content_descriptions.metadata IS 'Additional metadata in JSON format (target audience, tone, etc.)';
COMMENT ON COLUMN public.content_descriptions.created_by IS 'User who created this content description';
