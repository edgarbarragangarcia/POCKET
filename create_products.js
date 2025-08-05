// Script to create sample products for testing
// Run this with: node create_products.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleProducts() {
  try {
    // First, get the organization ID (assuming you have at least one organization)
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(1);

    if (orgError) {
      console.error('Error fetching organizations:', orgError);
      return;
    }

    if (!organizations || organizations.length === 0) {
      console.error('No organizations found. Please create an organization first.');
      return;
    }

    const organizationId = organizations[0].id;
    console.log(`Using organization: ${organizations[0].name} (${organizationId})`);

    // Sample products for Ingenes
    const sampleProducts = [
      {
        organization_id: organizationId,
        name: 'Tratamiento de Fertilidad Básico',
        description: 'Paquete completo de tratamiento de fertilidad que incluye consultas, estudios y procedimientos básicos.',
        price: 15000.00,
        sku: 'TFB-001'
      },
      {
        organization_id: organizationId,
        name: 'Tratamiento de Fertilidad Premium',
        description: 'Paquete premium que incluye todos los servicios básicos más tratamientos avanzados y seguimiento personalizado.',
        price: 25000.00,
        sku: 'TFP-001'
      },
      {
        organization_id: organizationId,
        name: 'Consulta de Evaluación',
        description: 'Consulta inicial para evaluación de fertilidad con especialista certificado.',
        price: 2500.00,
        sku: 'CE-001'
      },
      {
        organization_id: organizationId,
        name: 'Estudios de Laboratorio',
        description: 'Paquete completo de estudios de laboratorio para diagnóstico de fertilidad.',
        price: 5000.00,
        sku: 'EL-001'
      },
      {
        organization_id: organizationId,
        name: 'Preservación de Fertilidad',
        description: 'Servicios de preservación de óvulos y esperma para futuras necesidades reproductivas.',
        price: 18000.00,
        sku: 'PF-001'
      }
    ];

    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (error) {
      console.error('Error inserting products:', error);
      return;
    }

    console.log('✅ Successfully created sample products:');
    data.forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - $${product.price}`);
    });

    console.log('\n🎉 Products created successfully! You can now use them in the Campaign Builder.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createSampleProducts();
