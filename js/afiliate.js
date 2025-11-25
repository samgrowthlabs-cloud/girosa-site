// =============================================
// JAVASCRIPT ESPECÍFICO DA PÁGINA AFILIATE - CORRIGIDO
// =============================================

/**
 * Carrega os afiliados na página de afiliados
 */
async function loadAffiliates() {
    const container = document.getElementById('affiliates-list');
    if (!container) {
        console.log('❌ Container de afiliados não encontrado');
        return;
    }

    try {
        // Carregar dados do Supabase
        const affiliates = await loadAfiliatesFromDB();
        console.log('📊 Afiliados carregados:', affiliates);

        // Limpar container
        container.innerHTML = "";

        // Verificar se há dados
        if (!affiliates || affiliates.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 20px; color: #666;">
                        Nenhum afiliado cadastrado no momento
                    </td>
                </tr>
            `;
            return;
        }

        // Adicionar afiliados
        affiliates.forEach(affiliate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${affiliate.name || 'N/A'}</td>
                <td>${affiliate.number || 'N/A'}</td>
                <td>
                    <span class="affiliate-type-badge ${getAffiliateTypeClass(affiliate.type)}">
                        ${getAffiliateTypeLabel(affiliate.type)}
                    </span>
                </td>
            `;
            container.appendChild(row);
        });

        console.log('✅ Afiliados renderizados com sucesso');

    } catch (error) {
        console.error('❌ Erro ao carregar afiliados:', error);
        container.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 20px; color: #ef4444;">
                    Erro ao carregar afiliados: ${error.message}
                </td>
            </tr>
        `;
    }
}

/**
 * Retorna a classe CSS para o tipo de afiliado
 */
function getAffiliateTypeClass(type) {
    const typeMap = {
        'bas': 'type-bas',
        'int': 'type-int', 
        'top': 'type-top'
    };
    return typeMap[type] || 'type-bas';
}

/**
 * Retorna o label para o tipo de afiliado
 */
function getAffiliateTypeLabel(type) {
    const labelMap = {
        'BAS': 'BÁSICO',
        'INT': 'INTERMEDIÁRIO',
        'TOP': 'TOP'
    };
    return labelMap[type] || 'BÁSICO';
}

/**
 * Inicializa a página de afiliados
 */
function initAfiliatePage() {
    console.log('🚀 Inicializando página de afiliados...');
    
    // Carregar e exibir afiliados
    loadAffiliates();
    
    console.log('✅ Página de afiliados inicializada');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('affiliates-list')) {
        initAfiliatePage();
    }
});

// REMOVA OU COMENTE ESTA FUNÇÃO CONFLITANTE:
/*
function setupAffiliateForm() {
    const form = document.getElementById('affiliate-request-form');
    if (!form) {
        console.log('❌ Formulário de afiliação não encontrado');
        return;
    }

    console.log('✅ Formulário de afiliação encontrado');

    // Configurar máscaras
    const cpfInput = document.getElementById('affiliate-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            this.value = formatarCPF(this.value);
        });
    }

    // O envio do formulário já é tratado pelo common.js
    // Esta função é apenas para configurações específicas
}
*/