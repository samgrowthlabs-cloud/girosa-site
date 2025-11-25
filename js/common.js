// =============================================
// VARIÁVEIS GLOBAIS E CONFIGURAÇÕES
// =============================================

/**
 * Armazena a promoção atual carregada do banco de dados
 * @type {Object|null}
 */
window.currentPromotion = null;

/**
 * Índice da trança atual no modal de navegação
 * @type {number}
 */
let currentBraidIndex = 0;

/**
 * Nível de zoom atual na imagem do modal
 * @type {number}
 */
let currentZoom = 1;

/**
 * Preço original da trança atualmente visualizada (sem desconto do jumbo)
 * @type {string}
 */
window.currentBraidOriginalPrice = ''; // TORNAR GLOBAL

/**
 * Dados das tranças carregados do banco de dados
 * @type {Array}
 */
let braidsData = [];

/**
 * Dados dos afiliados carregados do banco de dados
 * @type {Array}
 */
let afiliateData = [];

/**
 * Dados dos vídeos carregados do banco de dados
 * @type {Array}
 */
let videosData = [];

// =============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS - CORRIGIDAS
// =============================================

/**
 * Carrega a promoção ativa do banco de dados
 * @async
 */
async function loadPromotionFromDB() {
    try {
        console.log('📊 Carregando promoção do banco de dados...');
        
        const res = await fetch(
            "https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("📊 Dados recebidos:", data);

        // Pega a primeira promoção da tabela
        const promo = data.promotions && data.promotions.length > 0
            ? data.promotions[0]
            : null;

        if (promo) {
            window.currentPromotion = {
                ativo: promo.ativo ?? false,
                desconto_all: promo.desconto_all ?? 0,
                desconto_feminin: promo.desconto_feminin ?? 0,
                desconto_mascu: promo.desconto_mascu ?? 0
            };
            console.log("✅ Promoção carregada:", window.currentPromotion);
        } else {
            // Nenhuma promoção cadastrada
            window.currentPromotion = {
                ativo: false,
                desconto_all: 0,
                desconto_feminin: 0,
                desconto_mascu: 0
            };
            console.log("ℹ️ Nenhuma promoção ativa encontrada");
        }

    } catch (err) {
        console.error("❌ Erro ao carregar promoção:", err);
        // Fallback para evitar quebras
        window.currentPromotion = {
            ativo: false,
            desconto_all: 0,
            desconto_feminin: 0,
            desconto_mascu: 0
        };
    }
}

/**
 * Carrega as tranças do banco de dados
 * @async
 */
async function loadBraidsFromDB() {
    try {
        console.log('📊 Carregando tranças do banco de dados...');
        
        const res = await fetch("https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Tranças carregadas:", data.braids);

        braidsData.length = 0;
        braidsData.push(...data.braids);

    } catch (err) {
        console.error("❌ Erro ao carregar tranças:", err);
        // Fallback com dados vazios para evitar quebras
        braidsData = [];
    }
}

// =============================================
// FUNÇÕES DE UTILIDADE E CÁLCULOS - CORRIGIDAS
// =============================================

/**
 * Converte preço em string formatada (R$ 350,00) para número (350.00)
 */
function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    if (!priceString) return 0;
    
    try {
        // Remove "R$", espaços e converte vírgula para ponto
        let cleaned = String(priceString)
            .replace('R$', '')
            .replace(/\s/g, '')
            .replace(/\./g, '') // Remove pontos de milhar
            .replace(',', '.')  // Converte vírgula decimal para ponto
            .trim();
        
        // Converte para número
        const number = parseFloat(cleaned);
        
        // Se não conseguir converter, retorna 0
        return isNaN(number) ? 0 : number;
    } catch (error) {
        console.error('Erro ao converter preço:', priceString, error);
        return 0;
    }
}

/**
 * Carrega os afiliados do banco de dados
 * @async
 */
async function loadAfiliatesFromDB() {
    try {
        console.log('📊 Carregando afiliados do banco de dados...');
        
        const res = await fetch(
            "https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Afiliados carregados:", data.afiliate);

        // Atualizar os dados globais
        window.afiliateData = data.afiliate || [];
        
        return window.afiliateData;

    } catch (err) {
        console.error("❌ Erro ao carregar afiliados:", err);
        // Fallback para evitar quebras
        window.afiliateData = [];
        return [];
    }
}

/**
 * Calcula preço final considerando desconto do jumbo
 * @param {string|number} precoOriginal - Preço original
 * @param {boolean} jumboCliente - Se é cliente jumbo
 * @returns {string} Preço final formatado
 */
function calcularPrecoFinalComJumbo(precoOriginal, jumboCliente) {
    // Converte o preço original para número
    const precoNumerico = parsePrice(precoOriginal);
    
    if (isNaN(precoNumerico)) {
        console.error('Erro ao converter preço:', precoOriginal);
        return formatCurrencyBR(0);
    }

    if (!jumboCliente) {
        return formatCurrencyBR(precoNumerico);
    }

    const precoComDesconto = Math.max(precoNumerico - 100, 0);
    return formatCurrencyBR(precoComDesconto);
}

// =============================================
// FUNÇÕES DE INTERFACE - SISTEMA JUMBO - CORRIGIDAS
// =============================================

/**
 * Configura os eventos relacionados ao sistema Jumbo
 */
function setupJumboEvents() {
    const jumboCheckbox = document.getElementById('jumbo-cliente');
    const priceSummary = document.getElementById('price-summary');
    
    if (jumboCheckbox && priceSummary) {
        jumboCheckbox.addEventListener('change', function() {
            if (this.checked) {
                showPriceSummary();
            } else {
                hidePriceSummary();
            }
        });
    }
}

/**
 * Mostra o resumo de preços com desconto do jumbo
 */
function showPriceSummary() {
    const priceSummary = document.getElementById('price-summary');
    const originalPriceElement = document.getElementById('summary-original-price');
    const finalPriceElement = document.getElementById('summary-final-price');
    
    if (!priceSummary || !originalPriceElement || !finalPriceElement) return;
    
    // Usar o preço original global
    const precoOriginal = window.currentBraidOriginalPrice;
    
    if (!precoOriginal) {
        console.error('Preço original não definido');
        return;
    }
    
    // Mostrar preço original
    originalPriceElement.textContent = precoOriginal;
    
    try {
        // Converter preço original para número
        const precoNumerico = parsePrice(precoOriginal);
        
        if (isNaN(precoNumerico)) {
            console.error('Erro ao converter preço no resumo:', precoOriginal);
            finalPriceElement.textContent = formatCurrencyBR(0);
        } else {
            // Calcular preço final com desconto do jumbo
            const precoComDescontoJumbo = Math.max(precoNumerico - 100, 0);
            finalPriceElement.textContent = formatCurrencyBR(precoComDescontoJumbo);
        }
        
        priceSummary.style.display = 'block';
    } catch (error) {
        console.error('Erro no cálculo do resumo:', error);
        finalPriceElement.textContent = formatCurrencyBR(0);
        priceSummary.style.display = 'block';
    }
}

/**
 * Esconde o resumo de preços do jumbo
 */
function hidePriceSummary() {
    const priceSummary = document.getElementById('price-summary');
    if (priceSummary) {
        priceSummary.style.display = 'none';
    }
}

/**
 * Reseta as opções do jumbo para o estado inicial
 */
function resetJumboOptions() {
    const jumboCheckbox = document.getElementById('jumbo-cliente');
    const priceSummary = document.getElementById('price-summary');
    
    if (jumboCheckbox) {
        jumboCheckbox.checked = false;
    }
    
    if (priceSummary) {
        priceSummary.style.display = 'none';
    }
}

// =============================================
// FUNÇÕES DE FORMATAÇÃO E UTILITÁRIOS - ADICIONAR NO common.js
// =============================================

/**
 * Formata CPF (000.000.000-00)
 */
function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.substring(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

/**
 * Formata telefone ((00) 00000-0000)
 */
function formatarTelefone(telefone) {
    if (!telefone) return '';
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.substring(0, 11);
    
    if (telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
        telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
        telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    return telefone;
}

/**
 * Valida CPF
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação simples (pode ser substituída por validação mais robusta)
    return cpf.length === 11;
}

/**
 * Define estado de loading no botão
 */
function setButtonLoading(button, isLoading, loadingText = 'Aguarde...') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <div class="btn-loading-spinner"></div>
            ${loadingText}
        `;
        button.classList.add('loading');
        
        // Adicionar estilos CSS para as animações se não existirem
        if (!document.querySelector('#common-styles')) {
            const style = document.createElement('style');
            style.id = 'common-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .form-control.error {
                    border-color: #000000ff !important;
                    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
                }
                
                .btn-loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }
                
                button.loading {
                    opacity: 0.8;
                    cursor: not-allowed;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        button.disabled = false;
        button.innerHTML = button.getAttribute('data-original-text') || 'Solicitar Agendamento';
        button.classList.remove('loading');
    }
}

/**
 * Mostra erro em um campo específico
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remover erro anterior
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Adicionar estilo de erro
    field.classList.add('error');
    
    // Adicionar mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 500;
    `;
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
}

/**
 * Remove erro de um campo
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.classList.remove('error');
    
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Valida um campo individual
 */
function validateField(field) {
    if (!field) return;
    
    const value = field.value.trim();
    const fieldId = field.id;
    
    switch (fieldId) {
        case 'client-name':
        case 'affiliate-name':
            if (!value) {
                showFieldError(fieldId, 'Este campo é obrigatório');
            } else if (value.length < 3) {
                showFieldError(fieldId, 'Mínimo 3 caracteres');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'client-cpf':
        case 'affiliate-cpf':
            if (!value) {
                showFieldError(fieldId, 'CPF é obrigatório');
            } else if (!validarCPF(value.replace(/\D/g, ''))) {
                showFieldError(fieldId, 'CPF inválido');
            } else {
                clearFieldError(fieldId);
            }
            break;
            
        case 'client-phone':
            if (!value) {
                showFieldError(fieldId, 'Telefone é obrigatório');
            } else if (value.replace(/\D/g, '').length < 10) {
                showFieldError(fieldId, 'Telefone inválido');
            } else {
                clearFieldError(fieldId);
            }
            break;
    }
}

/**
 * Valida o formulário de agendamento
 */
function validateBookingForm() {
    const name = document.getElementById('client-name');
    const cpf = document.getElementById('client-cpf');
    const phone = document.getElementById('client-phone');
    
    if (!name || !cpf || !phone) {
        showNotification('Erro: Campos do formulário não encontrados', 'error');
        return false;
    }
    
    const nameValue = name.value.trim();
    const cpfValue = cpf.value.trim();
    const phoneValue = phone.value.trim();
    
    let isValid = true;
    
    // Validar nome
    if (!nameValue) {
        showFieldError('client-name', 'Por favor, insira seu nome completo');
        isValid = false;
    } else if (nameValue.length < 3) {
        showFieldError('client-name', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    } else {
        clearFieldError('client-name');
    }
    
    // Validar CPF
    if (!cpfValue) {
        showFieldError('client-cpf', 'Por favor, insira seu CPF');
        isValid = false;
    } else if (!validarCPF(cpfValue.replace(/\D/g, ''))) {
        showFieldError('client-cpf', 'CPF inválido');
        isValid = false;
    } else {
        clearFieldError('client-cpf');
    }
    
    // Validar telefone
    if (!phoneValue) {
        showFieldError('client-phone', 'Por favor, insira seu telefone');
        isValid = false;
    } else if (phoneValue.replace(/\D/g, '').length < 10) {
        showFieldError('client-phone', 'Telefone inválido');
        isValid = false;
    } else {
        clearFieldError('client-phone');
    }
    
    return isValid;
}

/**
 * Valida o formulário de afiliação
 */
function validateAffiliateForm() {
    const name = document.getElementById('affiliate-name');
    const cpf = document.getElementById('affiliate-cpf');
    
    if (!name || !cpf) {
        showNotification('Erro: Campos do formulário não encontrados', 'error');
        return false;
    }
    
    const nameValue = name.value.trim();
    const cpfValue = cpf.value.trim();
    
    let isValid = true;
    
    // Validar nome
    if (!nameValue) {
        showFieldError('affiliate-name', 'Por favor, insira seu nome completo');
        isValid = false;
    } else if (nameValue.length < 3) {
        showFieldError('affiliate-name', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    } else {
        clearFieldError('affiliate-name');
    }
    
    // Validar CPF
    if (!cpfValue) {
        showFieldError('affiliate-cpf', 'Por favor, insira seu CPF');
        isValid = false;
    } else if (!validarCPF(cpfValue.replace(/\D/g, ''))) {
        showFieldError('affiliate-cpf', 'CPF inválido');
        isValid = false;
    } else {
        clearFieldError('affiliate-cpf');
    }
    
    return isValid;
}

// =============================================
// FUNÇÕES DE INTERFACE - FORMULÁRIOS - CORRIGIDAS
// =============================================

/**
 * Configura os formulários da aplicação
 */
function setupForms() {
    console.log('🔧 Configurando formulários...');
    
    // Formulário de agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        console.log('✅ Formulário de agendamento encontrado');
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Formulário de agendamento enviado - INICIANDO ENVIO WhatsApp');
            
            // Obter dados do formulário
            const name = document.getElementById('client-name').value.trim();
            const cpf = document.getElementById('client-cpf').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const jumboCliente = document.getElementById('jumbo-cliente').checked;
            const braidTitle = this.getAttribute('data-braid-title');
            const braidPrice = this.getAttribute('data-braid-price');
            const braidCode = this.getAttribute('data-braid-code');
            
            console.log('📦 Dados capturados:', {
                name, cpf, phone, jumboCliente, braidTitle, braidPrice, braidCode
            });
            
            // 🔥 VALIDAÇÃO COM MENSAGENS DE ERRO 🔥
            let isValid = true;
            
            // Validar nome
            if (!name) {
                showFieldError('client-name', 'Por favor, preencha seu nome completo');
                isValid = false;
            } else if (name.length < 3) {
                showFieldError('client-name', 'Nome deve ter pelo menos 3 caracteres');
                isValid = false;
            } else {
                clearFieldError('client-name');
            }
            
            // Validar CPF
            if (!cpf) {
                showFieldError('client-cpf', 'Por favor, insira seu CPF');
                isValid = false;
            } else if (!validarCPF(cpf.replace(/\D/g, ''))) {
                showFieldError('client-cpf', 'CPF inválido');
                isValid = false;
            } else {
                clearFieldError('client-cpf');
            }
            
            // Validar telefone
            if (!phone) {
                showFieldError('client-phone', 'Por favor, insira seu telefone');
                isValid = false;
            } else if (phone.replace(/\D/g, '').length < 10) {
                showFieldError('client-phone', 'Telefone inválido');
                isValid = false;
            } else {
                clearFieldError('client-phone');
            }
            
            // Validar trança selecionada
            if (!braidTitle) {
                alert('Por favor, selecione uma trança primeiro');
                isValid = false;
            }
            
            if (!isValid) {
                console.log('❌ Formulário inválido, não enviando');
                return;
            }
            
            // Calcular preço final - VERSÃO SUPER ROBUSTA
            let precoFinal = braidPrice;
            if (jumboCliente) {
                console.log('💰 Calculando desconto do jumbo...');
                
                // Método 1: Remove todos os não-numéricos
                let valor = parseFloat(braidPrice.replace(/[^\d,]/g, '').replace(',', '.'));
                
                // Método 2: Se falhou, extrai números manualmente
                if (isNaN(valor)) {
                    const numeros = braidPrice.match(/\d+/g);
                    valor = numeros ? parseFloat(numeros.join('')) : 350;
                }
                
                // Método 3: Se ainda falhou, usa valor fixo baseado no preço visual
                if (isNaN(valor)) {
                    if (braidPrice.includes('350')) valor = 350;
                    else if (braidPrice.includes('300')) valor = 300;
                    else if (braidPrice.includes('400')) valor = 400;
                    else valor = 350;
                }
                
                console.log('💰 Valor calculado:', valor);
                
                // Aplica desconto
                valor = Math.max(valor - 100, 0);
                
                // Formata o resultado
                precoFinal = valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
                
                console.log('💰 Preço final:', precoFinal);
            }
            
            // Criar mensagem para WhatsApp - SIMPLES E FUNCIONAL
            let message = `*NOVA SOLICITAÇÃO DE AGENDAMENTO - GIROSA BEAUTY*

*DADOS DO CLIENTE:*
Nome: ${name}
CPF: ${cpf}
Telefone: ${phone}

*SERVIÇO SOLICITADO:*
Trança: ${braidTitle}
Código: ${braidCode}
Preço: ${braidPrice}
${jumboCliente ? 'Jumbo do Cliente: SIM (Desconto de R$ 100,00)' : 'Jumbo: da Empresa'}
*VALOR FINAL: ${precoFinal}*

_Data da solicitação: ${new Date().toLocaleString('pt-BR')}_`;
            
            console.log('📤 Mensagem para WhatsApp:', message);
            
            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Número da Girosa Beauty
            const whatsappURL = `https://wa.me/5544999180116?text=${encodedMessage}`;
            console.log('🔗 URL do WhatsApp:', whatsappURL);
            
            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Mostrar confirmação
            alert('✅ Solicitação enviada com sucesso! Redirecionando para WhatsApp...');
            
            // Fechar modal
            const modal = document.getElementById('braid-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Resetar formulário
            bookingForm.reset();
            
        });
        
        console.log('✅ Formulário de agendamento configurado');
    }
    

}

// =============================================
// INICIALIZAÇÃO COMUM - CORRIGIDA
// =============================================

/**
 * Inicializa funcionalidades comuns a todas as páginas
 */
function initCommon() {
    console.log('🔧 Inicializando Common JavaScript...');
    
    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Setup dos formulários (será chamado também pela página específica)
    // Não forçar setupForms() aqui para evitar duplicação
    
    console.log('✅ Common JavaScript inicializado');
}

// =============================================
// FUNÇÕES DE CÁLCULO DE PREÇOS - ADICIONAR NO common.js
// =============================================

/**
 * Calcula o preço com desconto baseado na promoção atual e categoria
 * @param {number|string} precoOriginal - Preço original da trança
 * @param {string} categoria - Categoria da trança (feminino/masculino)
 * @returns {Object} Objeto com preços formatados e informações de desconto
 */
function calcularPrecoComDesconto(precoOriginal, categoria) {
    try {
        // Converter para número, lidando com diferentes formatos
        let precoNumerico;
        
        if (typeof precoOriginal === "number") {
            precoNumerico = precoOriginal;
        } else {
            // Remove "R$" e converte para número
            const precoString = String(precoOriginal)
                .replace('R$', '')
                .replace(/\./g, '') // Remove pontos
                .replace(',', '.')  // Converte vírgula para ponto
                .trim();
            
            precoNumerico = parseFloat(precoString);
            
            // Se não conseguir converter, usa 0
            if (isNaN(precoNumerico)) {
                console.warn('Não foi possível converter o preço:', precoOriginal);
                precoNumerico = 0;
            }
        }

        if (!window.currentPromotion || !window.currentPromotion.ativo) {
            return {
                original: formatCurrencyBR(precoNumerico),
                comDesconto: formatCurrencyBR(precoNumerico),
                desconto: 0,
                temDesconto: false
            };
        }

        let desconto = 0;

        if (window.currentPromotion.desconto_all)
            desconto = window.currentPromotion.desconto_all;

        if (categoria === "feminino" && window.currentPromotion.desconto_feminin)
            desconto = window.currentPromotion.desconto_feminin;

        if (categoria === "masculino" && window.currentPromotion.desconto_mascu)
            desconto = window.currentPromotion.desconto_mascu;

        const precoFinal = precoNumerico - (precoNumerico * desconto);

        return {
            original: formatCurrencyBR(precoNumerico),
            comDesconto: formatCurrencyBR(precoFinal),
            desconto,
            temDesconto: desconto > 0
        };
    } catch (error) {
        console.error('Erro no cálculo de desconto:', error);
        // Retorna valores padrão em caso de erro
        return {
            original: formatCurrencyBR(0),
            comDesconto: formatCurrencyBR(0),
            desconto: 0,
            temDesconto: false
        };
    }
}

/**
 * Formata valor para moeda brasileira (R$)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em Real
 */
function formatCurrencyBR(value) {
    if (value === null || value === undefined) return "R$ 0,00";

    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/**
 * Converte preço em string formatada (R$ 350,00) para número (350.00)
 */
function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    if (!priceString) return 0;
    
    try {
        // Remove "R$", espaços e converte vírgula para ponto
        let cleaned = String(priceString)
            .replace('R$', '')
            .replace(/\s/g, '')
            .replace(/\./g, '') // Remove pontos de milhar
            .replace(',', '.')  // Converte vírgula decimal para ponto
            .trim();
        
        // Converte para número
        const number = parseFloat(cleaned);
        
        // Se não conseguir converter, retorna 0
        return isNaN(number) ? 0 : number;
    } catch (error) {
        console.error('Erro ao converter preço:', priceString, error);
        return 0;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCommon);

document.addEventListener('DOMContentLoaded', function() {
    // DEIXE APENAS ISSO (sem formatação):
    console.log('✅ Página carregada - sem formatação de campos');
    
    // Ou remova completamente esta função se não precisa de nada
});



// SOLUÇÃO DE EMERGÊNCIA 
console.log('🔧 INICIANDO SOLUÇÃO DE EMERGÊNCIA PARA AFILIADOR');

// Forçar configuração do formulário de afiliação
setTimeout(function() {
    const affiliateForm = document.getElementById('affiliate-request-form');
    if (affiliateForm) {
        console.log('🚨 CONFIGURANDO FORMULÁRIO DE AFILIACAO FORÇADAMENTE');
        
        // Remover event listeners existentes (se houver)
        const newForm = affiliateForm.cloneNode(true);
        affiliateForm.parentNode.replaceChild(newForm, affiliateForm);
        
        // Configurar novo evento
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🚨 FORMULÁRIO DE AFILIACAO ENVIADO - EMERGÊNCIA');
            
            const name = document.getElementById('affiliate-name').value.trim();
            const cpf = document.getElementById('affiliate-cpf').value.trim();
            const suggestions = document.getElementById('affiliate-suggestions').value.trim();
            
            // 🔥 VALIDAÇÃO COM MENSAGENS DE ERRO 🔥
            let isValid = true;
            
            // Validar nome
            if (!name) {
                showFieldError('affiliate-name', 'Por favor, preencha seu nome completo');
                isValid = false;
            } else if (name.length < 3) {
                showFieldError('affiliate-name', 'Nome deve ter pelo menos 3 caracteres');
                isValid = false;
            } else {
                clearFieldError('affiliate-name');
            }
            
            // Validar CPF
            if (!cpf) {
                showFieldError('affiliate-cpf', 'Por favor, insira seu CPF');
                isValid = false;
            } else if (!validarCPF(cpf.replace(/\D/g, ''))) {
                showFieldError('affiliate-cpf', 'CPF inválido');
                isValid = false;
            } else {
                clearFieldError('affiliate-cpf');
            }
            
            if (!isValid) {
                console.log('❌ Formulário de afiliação inválido, não enviando');
                return;
            }
            
            const message = `*SOLICITAÇÃO DE AFILIAÇÃO - GIROSA BEAUTY*

*DADOS:*
Nome: ${name}
CPF: ${cpf}

*SUGESTÕES:*
${suggestions || 'Nenhuma'}

_Data: ${new Date().toLocaleString('pt-BR')}_`;
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
            alert('✅ Afiliação enviada!');
            newForm.reset();
        });
        
        console.log('✅ FORMULÁRIO DE AFILIACAO CONFIGURADO - EMERGÊNCIA');
    }
}, 1000);