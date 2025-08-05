import { User } from './user';
import { Tenant } from './tenant';

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: CampaignStatus;
  budget: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdBy: string;
  isDeleted: boolean;
  channels: CampaignChannel[];
  metrics: CampaignMetrics | null;
  tags: string[];
}

export interface CampaignChannel {
  id: string;
  campaignId: string;
  channelType: 'facebook' | 'instagram' | 'google' | 'email' | 'twitter' | 'linkedin' | 'tiktok' | 'other';
  budget: number;
  content: Record<string, any>;
  metrics: Record<string, any> | null;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  spend: number;
  roi: number;
  lastUpdated: Date;
}

export interface CampaignFilterOptions {
  status?: CampaignStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  channels?: string[];
  tags?: string[];
  sortBy?: 'createdAt' | 'startDate' | 'endDate' | 'budget' | 'roi';
  sortOrder?: 'asc' | 'desc';
}
