-- Insert sample products for testing
-- Replace 'your-organization-id' with your actual organization ID

-- Sample products for Ingenes
INSERT INTO products (
  id,
  organization_id,
  name,
  description,
  price,
  sku,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'your-organization-id', -- Replace with actual organization ID
  'Tratamiento de Fertilidad Básico',
  'Paquete completo de tratamiento de fertilidad que incluye consultas, estudios y procedimientos básicos.',
  15000.00,
  'TFB-001',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'your-organization-id', -- Replace with actual organization ID
  'Tratamiento de Fertilidad Premium',
  'Paquete premium que incluye todos los servicios básicos más tratamientos avanzados y seguimiento personalizado.',
  25000.00,
  'TFP-001',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'your-organization-id', -- Replace with actual organization ID
  'Consulta de Evaluación',
  'Consulta inicial para evaluación de fertilidad con especialista certificado.',
  2500.00,
  'CE-001',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'your-organization-id', -- Replace with actual organization ID
  'Estudios de Laboratorio',
  'Paquete completo de estudios de laboratorio para diagnóstico de fertilidad.',
  5000.00,
  'EL-001',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'your-organization-id', -- Replace with actual organization ID
  'Preservación de Fertilidad',
  'Servicios de preservación de óvulos y esperma para futuras necesidades reproductivas.',
  18000.00,
  'PF-001',
  NOW(),
  NOW()
);

-- Verify the insertion
SELECT id, name, description, price, sku 
FROM products 
WHERE organization_id = 'your-organization-id'
ORDER BY name;
