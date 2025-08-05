export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  isVerified: boolean;
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    desktop?: boolean;
  };
  language?: string;
  timezone?: string;
  dashboardLayout?: Record<string, any>;
}

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';
