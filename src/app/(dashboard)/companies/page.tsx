'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';

interface Company {
  id: string;
  name: string;
  description: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'MarketingIAO', description: 'Soluciones de marketing digital innovadoras.' },
    { id: '2', name: 'Tech Innovators', description: 'Desarrollo de software y consultoría tecnológica.' },
  ]);

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <PageHeader title="Mis Compañías" />
          <Link href="/company">
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Nueva Compañía
            </Button>
          </Link>
        </div>

        <div className="flex flex-row gap-4 overflow-x-auto pb-4">
          {companies.map((company) => (
            <Card key={company.id} className="relative overflow-hidden rounded-3xl shadow-xl border-gray-800 border-[8px] bg-gray-900 text-white"
              style={{
                width: '320px', // iPhone-like width
                height: '600px', // iPhone-like height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              {/* Simulate iPhone notch/speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-b-xl"></div>
              
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">{company.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center text-center">
                <p className="text-gray-400">{company.description}</p>
              </CardContent>
              <div className="text-center pb-4">
                <Link href={`/company?id=${company.id}`}>
                  <Button variant="outline" className="w-full">Ver Detalles</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}