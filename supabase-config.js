// supabase-config.js - VERSÃO COMPLETA E CORRETA

// Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://ryqlprvtsqzydvfkzuhu.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5cWxwcnZ0c3F6eWR2Zmt6dWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDkwNzUsImV4cCI6MjA3OTE4NTA3NX0.nIKe74s1_wfP-DB79w5PNdlveZF-Tqle6NUhg1qMW0I',
    tables: {
        services: 'services',
        promotions: 'promotions',
        services_with_price: 'services_with_price'
    }
};

// Função genérica para buscar dados do Supabase
async function fetchFromSupabase(table, query = '') {
    try {
        console.log(`Fetching from: ${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`);
        
        const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`, {
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Dados recebidos da tabela ${table}:`, data);
        return data;
    } catch (error) {
        console.error(`❌ Erro ao buscar dados da tabela ${table}:`, error);
        throw error;
    }
}

// Função para buscar serviços da VIEW "services_with_price"
async function fetchServices(filters = {}) {
    try {
        let query = '?select=*';
        
        // Adicionar filtros se fornecidos
        if (filters.gender && filters.gender !== 'all') {
            query += `&gender=eq.${filters.gender}`;
        }
        
        // Ordenar por nome
        query += '&order=name.asc';
        
        console.log('🔍 Query para serviços:', query);
        const services = await fetchFromSupabase(SUPABASE_CONFIG.tables.services_with_price, query);
        return services;
    } catch (error) {
        console.error('❌ Erro ao buscar serviços:', error);
        // Fallback para a tabela services
        return fetchServicesFromTable(filters);
    }
}

// Fallback: buscar da tabela services diretamente
async function fetchServicesFromTable(filters = {}) {
    try {
        let query = '?select=*';
        
        if (filters.gender && filters.gender !== 'all') {
            query += `&gender=eq.${filters.gender}`;
        }
        
        query += '&order=name.asc';
        
        const services = await fetchFromSupabase(SUPABASE_CONFIG.tables.services, query);
        
        // Calcular preço final manualmente
        return services.map(service => ({
            ...service,
            final_price: service.percentage_discount > 0 
                ? Math.round(service.original_price * (1 - service.percentage_discount) * 100) / 100
                : service.original_price
        }));
    } catch (error) {
        console.error('❌ Erro no fallback de serviços:', error);
        return [];
    }
}

// Função para buscar promoção ativa (da sua tabela promotions)
async function fetchActivePromotion() {
    try {
        const query = '?select=*&is_active=eq.true&limit=1';
        console.log('🔍 Buscando promoção ativa...');
        const promotions = await fetchFromSupabase(SUPABASE_CONFIG.tables.promotions, query);
        
        if (promotions && promotions.length > 0) {
            const promotion = promotions[0];
            console.log('✅ Promoção ativa encontrada:', promotion);
            return promotion;
        } else {
            console.log('ℹ️ Nenhuma promoção ativa');
            return null;
        }
    } catch (error) {
        console.error('❌ Erro ao buscar promoções:', error);
        return null;
    }
}

// Função para buscar um serviço específico por ID
async function fetchServiceById(serviceId) {
    try {
        const query = `?id=eq.${serviceId}`;
        const services = await fetchFromSupabase(SUPABASE_CONFIG.tables.services_with_price, query);
        return services[0] || null;
    } catch (error) {
        console.error(`❌ Erro ao buscar serviço ID ${serviceId}:`, error);
        return null;
    }
}

// Exportar funções
window.supabaseAPI = {
    fetchServices,
    fetchActivePromotion,
    fetchServiceById,
    config: SUPABASE_CONFIG
};

// Testar conexão
async function testSupabaseConnection() {
    try {
        console.log('🔗 Testando conexão com Supabase...');
        
        // Testar serviços
        const services = await fetchServices();
        console.log(`✅ Conexão estabelecida. Serviços: ${services.length}`);
        
        // Testar promoções
        const promotion = await fetchActivePromotion();
        if (promotion) {
            console.log(`🎉 Promoção ativa: ${promotion.name} (${Math.round(promotion.percentage_discount * 100)}% OFF)`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Falha na conexão com Supabase:', error);
        return false;
    }
}

// Testar conexão ao carregar
document.addEventListener('DOMContentLoaded', function() {
    testSupabaseConnection();
});