import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createLogger } from '@/lib/logger';

interface ContentDescription {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  content_type: string;
  tags: string[];
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const supabase = createClientComponentClient();
const logger = createLogger('ContentDescriptionService');

export class ContentDescriptionsService {
  /**
   * Get all content descriptions for a specific organization
   */
  static async getContentDescriptions(organizationId: string): Promise<ContentDescription[]> {
    try {
      const { data, error } = await supabase
        .from('content_descriptions')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching content descriptions', error);
      throw error;
    }
  }

  /**
   * Create a new content description
   */
  static async createContentDescription(
    organizationId: string,
    title: string,
    description: string,
    contentType: string = 'creative',
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ): Promise<ContentDescription> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('content_descriptions')
        .insert({
          organization_id: organizationId,
          title,
          description,
          content_type: contentType,
          tags,
          metadata,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating content description', error);
      throw error;
    }
  }

  /**
   * Update an existing content description
   */
  static async updateContentDescription(
    id: string,
    updates: Partial<Pick<ContentDescription, 'title' | 'description' | 'content_type' | 'tags' | 'metadata'>>
  ): Promise<ContentDescription> {
    try {
      const { data, error } = await supabase
        .from('content_descriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating content description', error);
      throw error;
    }
  }

  /**
   * Delete a content description
   */
  static async deleteContentDescription(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_descriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting content description', error);
      throw error;
    }
  }

  /**
   * Search content descriptions by title or description
   */
  static async searchContentDescriptions(
    organizationId: string,
    searchTerm: string
  ): Promise<ContentDescription[]> {
    try {
      const { data, error } = await supabase
        .from('content_descriptions')
        .select('*')
        .eq('organization_id', organizationId)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error searching content descriptions', error);
      throw error;
    }
  }

  /**
   * Get content descriptions by tags
   */
  static async getContentDescriptionsByTags(
    organizationId: string,
    tags: string[]
  ): Promise<ContentDescription[]> {
    try {
      const { data, error } = await supabase
        .from('content_descriptions')
        .select('*')
        .eq('organization_id', organizationId)
        .overlaps('tags', tags)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching content descriptions by tags', error);
      throw error;
    }
  }
}
