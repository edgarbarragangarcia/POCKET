import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  parentTitle?: string;
  parentHref?: string;
}

export function PageHeader({ title, parentTitle, parentHref }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {parentTitle && parentHref && (
        <Link href={parentHref} className="flex items-center text-sm text-gray-400 hover:text-gray-300 mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {parentTitle}
        </Link>
      )}
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}