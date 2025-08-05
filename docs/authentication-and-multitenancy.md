# Authentication and Multi-Tenancy Architecture

This document outlines the authentication and multi-tenancy architecture for the Campaign Management SaaS application.

## Authentication System

The application uses Supabase Auth for authentication, providing a secure and reliable authentication system with JWT token-based sessions.

### Authentication Flow

1. **Registration**
   - User registers with email and password through the `/register` page
   - Email verification is sent to the user's email (optional)
   - Upon successful registration, a new user record is created in the Supabase `auth.users` table

2. **Login**
   - User logs in with email and password through the `/login` page
   - Upon successful login, JWT tokens are generated and stored
   - The application redirects to the dashboard or onboarding flow for new users

3. **Password Reset**
   - User requests password reset through the `/forgot-password` page
   - A password reset email is sent to the user's email
   - User clicks the link in the email and is redirected to the password reset page
   - Upon successful password reset, the user is redirected to login

4. **Session Management**
   - JWT tokens are stored securely and refreshed as needed
   - The `AuthProvider` context manages authentication state across the application
   - User sessions can be terminated through the logout functionality
   - Session persistence is maintained across page refreshes

## Multi-Tenancy Architecture

The application uses a multi-tenant architecture where each tenant (organization) has its own isolated data while sharing the application infrastructure.

### Database Schema

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│       tenants       │     │    tenant_members   │     │  tenant_invitations │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id                  │     │ id                  │     │ id                  │
│ name                │◄────┤ tenant_id           │     │ tenant_id           │
│ slug                │     │ user_id             │     │ email               │
│ plan                │     │ role                │     │ role                │
│ owner_id            │     │ joined_at           │     │ status              │
│ settings            │     │ invited_by          │     │ created_at          │
│ logo_url            │     └─────────────────────┘     │ expires_at          │
│ status              │                                 │ invited_by          │
│ created_at          │     ┌─────────────────────┐     └─────────────────────┘
│ updated_at          │     │      campaigns      │                            
└─────────────────────┘     ├─────────────────────┤     ┌─────────────────────┐
                            │ id                  │     │       profiles      │
                            │ tenant_id           │◄────┤ id                  │
                            │ name                │     │ user_id             │
                            │ status              │     │ display_name        │
                            │ created_at          │     │ avatar_url          │
                            │ updated_at          │     │ created_at          │
                            └─────────────────────┘     └─────────────────────┘
```

### Row-Level Security (RLS) Policies

Supabase's Row-Level Security (RLS) is used to enforce data isolation between tenants:

1. **Tenant Access Policy**
   ```sql
   CREATE POLICY "Users can view their own tenants"
   ON tenants
   FOR SELECT
   USING (auth.uid() IN (
     SELECT user_id FROM tenant_members WHERE tenant_id = tenants.id
   ));
   ```

2. **Tenant Data Access Policy**
   ```sql
   CREATE POLICY "Users can access their tenant data"
   ON campaigns
   FOR ALL
   USING (auth.uid() IN (
     SELECT user_id FROM tenant_members WHERE tenant_id = campaigns.tenant_id
   ));
   ```

3. **Role-Based Access Policy**
   ```sql
   CREATE POLICY "Only owners and admins can modify tenant settings"
   ON tenants
   FOR UPDATE
   USING (auth.uid() IN (
     SELECT user_id FROM tenant_members 
     WHERE tenant_id = tenants.id AND role IN ('owner', 'admin')
   ));
   ```

### Tenant Context Management

1. **Tenant Provider**
   - `TenantProvider` component wraps the application and provides tenant context
   - The provider manages tenant state, switching, creation, and updates
   - It interfaces with Supabase to perform CRUD operations on tenants
   - Access control logic is embedded in the provider methods

2. **Tenant Switching**
   - Users can belong to multiple tenants
   - The active tenant is stored in local storage for persistence
   - Tenant switching is managed through the `TenantSwitcher` component
   - The current tenant context determines which data is displayed in the UI

3. **Tenant Member Management**
   - Owners and admins can invite new members to their tenant
   - Invitations are sent via email and tracked in the `tenant_invitations` table
   - Users can accept invitations to join a tenant
   - Owners and admins can remove members from their tenant

## Integration Between Auth and Multi-Tenancy

1. **User Registration**
   - New users automatically create a default tenant upon registration
   - They are assigned the "owner" role in this tenant
   - First-time login redirects to an onboarding flow to customize tenant settings

2. **Tenant Context Initialization**
   - On login, the `TenantProvider` fetches all tenants the user belongs to
   - The last active tenant (or default tenant) is set as the current tenant
   - The tenant context is initialized before rendering protected routes

3. **Route Protection**
   - Protected routes require authentication via a route middleware
   - Tenant-specific routes require tenant membership
   - Role-specific routes require specific tenant roles

## Security Considerations

1. **JWT Token Security**
   - Tokens are stored securely in memory and refreshed properly
   - HTTP-only cookies are used where appropriate for token storage
   - Token expiration and refresh mechanisms are implemented

2. **Data Isolation**
   - Row-Level Security ensures complete data isolation between tenants
   - Database triggers validate operations against RLS policies
   - API endpoints validate tenant membership and roles

3. **Invitation Security**
   - Invitations have expiration times
   - Invitation tokens are securely generated and validated
   - Email verification ensures invitations go to the intended recipient

## Implementation Details

1. **Supabase Configuration**
   - Authentication is configured in Supabase with appropriate settings
   - Database triggers enforce business rules and maintain data integrity
   - RLS policies are implemented on all tenant-related tables

2. **Frontend Components**
   - `AuthProvider` manages auth state and operations
   - `TenantProvider` manages tenant state and operations
   - UI components for login, registration, tenant switching, etc.

3. **API Endpoints**
   - RESTful endpoints for tenant management
   - Webhook handlers for auth events (signup, login, etc.)
   - Background jobs for invitation processing and cleanup

## Future Enhancements

1. **Single Sign-On (SSO)**
   - Integration with OAuth providers (Google, Microsoft, etc.)
   - SAML support for enterprise customers
   - Organization-wide authentication policies

2. **Advanced Permission System**
   - Fine-grained permissions beyond basic roles
   - Custom role creation for enterprise plans
   - Permission templates for different use cases

3. **Audit Logging**
   - Comprehensive audit logs for security events
   - User activity tracking within tenants
   - Admin dashboard for security monitoring
