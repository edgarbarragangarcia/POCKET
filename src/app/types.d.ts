// This file contains type declarations for modules that don't have their own type definitions

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Radix UI modules
declare module '@radix-ui/react-icons' {
  export const CaretSortIcon: React.FC<React.ComponentProps<'svg'>>;
  export const CheckIcon: React.FC<React.ComponentProps<'svg'>>;
  export const PlusCircledIcon: React.FC<React.ComponentProps<'svg'>>;
  export const ChevronRightIcon: React.FC<React.ComponentProps<'svg'>>;
  export const DotsHorizontalIcon: React.FC<React.ComponentProps<'svg'>>;
  export const Cross1Icon: React.FC<React.ComponentProps<'svg'>>;
}

declare module '@radix-ui/react-tabs' {
  export const Root: React.FC<any>;
  export const List: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
}

declare module '@radix-ui/react-toast' {
  export const Provider: React.FC<any>;
  export const Root: React.FC<any>;
  export const Title: React.FC<any>;
  export const Description: React.FC<any>;
  export const Action: React.FC<any>;
  export const Close: React.FC<any>;
  export const Viewport: React.FC<any>;
}

declare module '@radix-ui/react-dropdown-menu' {
  const Root: React.FC<any>;
  const Trigger: React.FC<any>;
  const Group: React.FC<any>;
  const Portal: React.FC<any>;
  const Sub: React.FC<any>;
  const RadioGroup: React.FC<any>;
  const SubTrigger: React.FC<any>;
  const SubContent: React.FC<any>;
  const Content: React.FC<any>;
  const Item: React.FC<any>;
  const CheckboxItem: React.FC<any>;
  const RadioItem: React.FC<any>;
  const Label: React.FC<any>;
  const Separator: React.FC<any>;
  const Shortcut: React.FC<any>;
  export { Root, Trigger, Group, Portal, Sub, RadioGroup, SubTrigger, SubContent, Content, Item, CheckboxItem, RadioItem, Label, Separator, Shortcut };
}

declare module '@radix-ui/react-label' {
  import * as React from 'react';
  const Root: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<'label'> & React.RefAttributes<HTMLLabelElement>>;
  export { Root };
}

// Utility libraries
declare module 'clsx' {
  export default function clsx(...inputs: any[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}

declare module 'class-variance-authority' {
  export function cva(base: string, variants?: any): (props?: Record<string, any>) => string;
  export type VariantProps<T extends (props?: Record<string, any>) => string> = {
    [K in keyof Parameters<T>[0]]: Parameters<T>[0][K];
  };
}

declare module 'lucide-react' {
  export const BarChart3: React.FC<React.ComponentProps<'svg'>>;
  export const TrendingUp: React.FC<React.ComponentProps<'svg'>>;
  export const Users: React.FC<React.ComponentProps<'svg'>>;
  export const Activity: React.FC<React.ComponentProps<'svg'>>;
  export const Eye: React.FC<React.ComponentProps<'svg'>>;
  export const EyeIcon: React.FC<React.ComponentProps<'svg'>>;
  export const EyeOffIcon: React.FC<React.ComponentProps<'svg'>>;
  export const BarChart: React.FC<React.ComponentProps<'svg'>>;
  export const ArrowUpRight: React.FC<React.ComponentProps<'svg'>>;
  export const Calendar: React.FC<React.ComponentProps<'svg'>>;
  export const Layers: React.FC<React.ComponentProps<'svg'>>;
  export const MoreHorizontal: React.FC<React.ComponentProps<'svg'>>;
  export const ExternalLink: React.FC<React.ComponentProps<'svg'>>;
  export const Pencil: React.FC<React.ComponentProps<'svg'>>;
  export const Trash2: React.FC<React.ComponentProps<'svg'>>;
  export const X: React.FC<React.ComponentProps<'svg'>>;
  export const Mail: React.FC<React.ComponentProps<'svg'>>;
  export const Shield: React.FC<React.ComponentProps<'svg'>>;
  export const UserCog: React.FC<React.ComponentProps<'svg'>>;
  export const Check: React.FC<React.ComponentProps<'svg'>>;
  export const ChevronDown: React.FC<React.ComponentProps<'svg'>>;
}

// Radix UI components missing type declarations
declare module '@radix-ui/react-popover' {
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
  export const Anchor: React.FC<any>;
  export const Arrow: React.FC<any>;
  export const Close: React.FC<any>;
}

declare module '@radix-ui/react-select' {
  export const Root: React.FC<any>;
  export const Group: React.FC<any>;
  export const Value: React.FC<any>;
  export const Trigger: React.ForwardRefExoticComponent<any>;
  export const Content: React.ForwardRefExoticComponent<any>;
  export const Label: React.ForwardRefExoticComponent<any>;
  export const Item: React.ForwardRefExoticComponent<any>;
  export const ItemText: React.FC<any>;
  export const ItemIndicator: React.FC<any>;
  export const ScrollUpButton: React.FC<any>;
  export const ScrollDownButton: React.FC<any>;
  export const Viewport: React.ForwardRefExoticComponent<any>;
  export const Separator: React.ForwardRefExoticComponent<any>;
  export const Icon: React.ForwardRefExoticComponent<any>;
  export const Portal: React.FC<any>;
}

// For dialog components
declare module '@radix-ui/react-dialog' {
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Portal: React.FC<any & { className?: string }>;
  export const Overlay: React.FC<any>;
  export const Content: React.FC<any>;
  export const Title: React.FC<any>;
  export const Description: React.FC<any>;
  export const Close: React.FC<any>;
}

// Other common modules
declare module 'next-themes' {
  export type ThemeProviderProps = {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    children: React.ReactNode;
  };
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}

// For any module that might need explicit declaration
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}
