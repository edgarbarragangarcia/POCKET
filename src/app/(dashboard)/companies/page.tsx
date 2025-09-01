'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Building2, TrendingUp, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';

interface Company {
  id: string;
  name: string;
  description: string;
  stats?: {
    campaigns: number;
    members: number;
    growth: string;
  };
  color: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([
    { 
      id: '1', 
      name: 'MarketingIAO', 
      description: 'Soluciones de marketing digital innovadoras.',
      stats: { campaigns: 12, members: 8, growth: '+24%' },
      color: 'from-purple-500 via-pink-500 to-red-500'
    },
    { 
      id: '2', 
      name: 'Tech Innovators', 
      description: 'Desarrollo de software y consultoría tecnológica.',
      stats: { campaigns: 8, members: 5, growth: '+18%' },
      color: 'from-blue-500 via-cyan-500 to-teal-500'
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">


      {/* Companies Grid */}
        <div className="px-6 pb-12 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {companies.map((company, index) => (
              <Card key={company.id} className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 min-h-[450px] pt-6">
                {/* Background */}
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-all duration-500"></div>
                
                {/* Border Effect */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-all duration-500"></div>
                
                <CardHeader className="relative z-10 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-600 shadow-lg">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-all duration-300">
                    {company.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {company.description}
                  </p>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-8 px-6 pb-6">
                  {/* Stats */}
                  {company.stats && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{company.stats.campaigns}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Campañas</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{company.stats.members}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Miembros</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <Sparkles className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-green-600">{company.stats.growth}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Crecimiento</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Link href={`/company?id=${company.id}`} className="block">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white border-0">
                      <Building2 className="mr-2 h-4 w-4" />
                      Ver Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Company Card */}
             <Card className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 min-h-[450px] pt-6">
               {/* Background */}
               <div className="absolute inset-0 bg-gray-500/5 group-hover:bg-gray-500/10 transition-all duration-500"></div>
               
               {/* Border Effect */}
               <div className="absolute inset-0 bg-gray-500/0 group-hover:bg-gray-500/5 transition-all duration-500"></div>
               
               <CardHeader className="relative z-10 pb-6">
                 <div className="flex items-center justify-between mb-4">
                   <div className="p-3 rounded-xl bg-gray-600 shadow-lg">
                     <PlusCircle className="h-6 w-6 text-white" />
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-bold text-gray-900 dark:text-white">
                       +
                     </div>
                   </div>
                 </div>
                 <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-gray-600 transition-all duration-300">
                   Crear Nueva Compañía
                 </CardTitle>
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                   Expande tu portafolio empresarial y gestiona múltiples organizaciones
                 </p>
               </CardHeader>
               
               <CardContent className="relative z-10 space-y-8 px-6 pb-6">
                 {/* Stats Placeholder */}
                 <div className="grid grid-cols-3 gap-4">
                   <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                     <PlusCircle className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                     <div className="text-lg font-bold text-gray-900 dark:text-white">∞</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Potencial</div>
                   </div>
                   <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                     <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                     <div className="text-lg font-bold text-gray-900 dark:text-white">+</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Equipo</div>
                   </div>
                   <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                     <Sparkles className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                     <div className="text-lg font-bold text-green-600">∞%</div>
                     <div className="text-xs text-gray-600 dark:text-gray-400">Crecimiento</div>
                   </div>
                 </div>
                 
                 {/* Action Button */}
                 <Link href="/company" className="block">
                   <Button className="w-full bg-gray-600 hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white border-0">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Crear Compañía
                   </Button>
                 </Link>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}