/**
 * Tenant Model
 * 
 * Represents an organization or customer that has access to the application.
 * Multi-tenancy is implemented at the database level using Supabase RLS policies.
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  plan: SubscriptionPlan;
  isActive: boolean;
  logoUrl?: string;
  settings: TenantSettings;
  ownerId: string;
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface TenantSettings {
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: {
    aiAssistant: boolean;
    advancedAnalytics: boolean;
    multiLanguageCampaigns: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    maxUsers: number;
    maxCampaignsPerMonth: number;
    maxStorageGb: number;
  };
  locales: string[];
  defaultLocale: string;
  customDomain?: string;
}

export interface TenantInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: TenantRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: Date;
  expiresAt: Date;
}

export enum TenantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface TenantMember {
  id: string;
  userId: string;
  tenantId: string;
  role: TenantRole;
  joinedAt: Date;
  invitationId?: string;
  email?: string; // Added to support display in the members table
  displayName?: string; // Added for user display name
  invitedBy?: string | null; // Added to track who invited this member
}
