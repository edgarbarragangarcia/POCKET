'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// La interfaz debe coincidir con la que usamos en PersonaManager
interface UserPersona {
  id?: string;
  name: string;
  age?: number;
  gender?: string;
  occupation?: string;
  goals?: string[];
  frustrations?: string[];
  motivations?: string[];
  bio?: string;
}

interface PersonaDialogProps {
  persona?: UserPersona;
  onSave: (persona: Omit<UserPersona, 'id'>) => Promise<void>;
  children: React.ReactNode; // Para usar como DialogTrigger
}

export function PersonaDialog({ persona, onSave, children }: PersonaDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<UserPersona, 'id'>>({
    name: persona?.name || '',
    age: persona?.age,
    gender: persona?.gender || '',
    occupation: persona?.occupation || '',
    bio: persona?.bio || '',
    goals: persona?.goals || [],
    frustrations: persona?.frustrations || [],
    motivations: persona?.motivations || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Convertimos cada línea del textarea en un elemento del array
    const arrayValue = value.split('\n').filter(item => item.trim() !== '');
    setFormData((prev) => ({ ...prev, [id]: arrayValue }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('El nombre es obligatorio.');
      return;
    }
    await onSave(formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{persona ? 'Editar' : 'Crear'} User Persona</DialogTitle>
          <DialogDescription>
            Rellena los detalles del perfil de tu cliente ideal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ej: Carlos, el Cauteloso" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input id="age" type="number" value={formData.age || ''} onChange={handleChange} placeholder="Ej: 35" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Ocupación</Label>
            <Input id="occupation" value={formData.occupation} onChange={handleChange} placeholder="Ej: Gerente de Proyectos" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea id="bio" value={formData.bio} onChange={handleChange} placeholder="Describe brevemente al persona..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goals">Metas</Label>
              <Textarea id="goals" value={formData.goals?.join('\n')} onChange={handleArrayChange} placeholder="Una meta por línea..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frustrations">Frustraciones</Label>
              <Textarea id="frustrations" value={formData.frustrations?.join('\n')} onChange={handleArrayChange} placeholder="Una frustración por línea..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivations">Motivaciones</Label>
              <Textarea id="motivations" value={formData.motivations?.join('\n')} onChange={handleArrayChange} placeholder="Una motivación por línea..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
