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
let currentBraidOriginalPrice = '';

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

// Variável global para controlar a notícia atual no modal
let currentNewsList = [];
let currentModalNews = null;

// =============================================
// FUNÇÕES DE CARREGAMENTO DE DADOS
// =============================================

/**
 * Carrega a promoção ativa do banco de dados
 * @async
 */
async function loadPromotionFromDB() {
    try {
        const res = await fetch(
            "https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": "SUA_PUBLIC_KEY"
                }
            }
        );

        const data = await res.json();

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
        } else {
            // Nenhuma promoção cadastrada
            window.currentPromotion = {
                ativo: false,
                desconto_all: 0,
                desconto_feminin: 0,
                desconto_mascu: 0
            };
        }

        console.log("Promo carregada:", window.currentPromotion);

    } catch (err) {
        console.error("Erro ao carregar promoção:", err);
    }
}

/**
 * Carrega as tranças do banco de dados
 * @async
 */
async function loadBraidsFromDB() {
    try {
        const res = await fetch("https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": "SUA_PUBLIC_KEY"
            }
        });

        const data = await res.json();
        console.log("Braids carregados:", data.braids);

        braidsData.length = 0;
        braidsData.push(...data.braids);

    } catch (err) {
        console.error("Erro ao carregar tranças:", err);
    }
}

/**
 * Carrega os afiliados do banco de dados
 * @async
 */
async function loadAfiliatesFromDB() {
    try {
        const res = await fetch(
            "https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": "SUA_PUBLIC_KEY"
                }
            }
        );

        const data = await res.json();
        console.log("Afiliados carregados:", data.afiliate);

        afiliateData.length = 0;
        afiliateData.push(...data.afiliate);

    } catch (err) {
        console.error("Erro ao carregar afiliados:", err);
    }
}

/**
 * Carrega os vídeos do banco de dados
 * @async
 */
async function loadVideosFromDB() {
    try {
        const res = await fetch("https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": "SUA_PUBLIC_KEY"
            }
        });

        const data = await res.json();
        console.log("Vídeos carregados:", data.videos);

        videosData.length = 0;
        videosData.push(...data.videos);

    } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
    }
}

// =============================================
// FUNÇÕES DE UTILIDADE E CÁLCULOS
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

/**
 * Converte preço em string formatada (R$ 350,00) para número (350.00)
 */
function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    
    // Remove "R$", espaços e converte vírgula para ponto
    let cleaned = String(priceString)
        .replace('R$', '')
        .replace(/\./g, '') // Remove pontos de milhar
        .replace(',', '.')  // Converte vírgula decimal para ponto
        .trim();
    
    // Converte para número
    const number = parseFloat(cleaned);
    
    // Se não conseguir converter, retorna 0
    return isNaN(number) ? 0 : number;
}

// =============================================
// FUNÇÕES DE INTERFACE - SISTEMA JUMBO
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
    
    // Mostrar preço original
    originalPriceElement.textContent = currentBraidOriginalPrice;
    
    try {
        // Converter preço original para número
        const precoNumerico = parsePrice(currentBraidOriginalPrice);
        
        if (isNaN(precoNumerico)) {
            console.error('Erro ao converter preço no resumo:', currentBraidOriginalPrice);
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
// FUNÇÕES DE INTERFACE - FORMULÁRIOS
// =============================================

/**
 * Configura os formulários da aplicação
 */
function setupForms() {
    // Formulário de agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Ativar estado de loading
            setButtonLoading(submitButton, true, 'Enviando...');
            
            try {
                // Validar campos obrigatórios
                if (!validateBookingForm()) {
                    setButtonLoading(submitButton, false, originalButtonText);
                    return;
                }
                
                const name = document.getElementById('client-name').value.trim();
                const cpf = document.getElementById('client-cpf').value.trim();
                const phone = document.getElementById('client-phone').value.trim();
                const jumboCliente = document.getElementById('jumbo-cliente').checked;
                const braidId = this.getAttribute('data-braid-id');
                const braidTitle = this.getAttribute('data-braid-title');
                const braidPrice = this.getAttribute('data-braid-price');
                const braidOriginalPrice = this.getAttribute('data-braid-original-price');
                const braidCode = this.getAttribute('data-braid-code');
                
                // Encontrar a trança selecionada
                const selectedBraid = braidsData.find(braid => braid.id == braidId);
                if (!selectedBraid) {
                    showNotification('Trança não encontrada. Por favor, recarregue a página.', 'error');
                    setButtonLoading(submitButton, false, originalButtonText);
                    return;
                }
                
                // Calcular preço final
                const precoFinal = calcularPrecoFinalComJumbo(braidPrice, jumboCliente);
                
                // Formatar CPF para exibição
                const cpfFormatado = formatarCPF(cpf);
                
                // Criar mensagem para WhatsApp
                let message = `🟤 *GIROSA BEAUTY - SOLICITAÇÃO DE AGENDAMENTO* 🟤

👤 *DADOS DO CLIENTE*
├── *Nome:* ${name}
├── *CPF:* ${cpfFormatado}
└── *Telefone:* ${formatarTelefone(phone)}

💇 *DETALHES DO SERVIÇO*
├── *Código:* ${braidCode}
├── *Trança:* ${braidTitle}
├── *Preço original:* ${braidOriginalPrice}`;

                // Adicionar informações do jumbo
                if (jumboCliente) {
                    message += `
├── *Jumbo:* Cliente (DESCONTO DE R$ 100,00)
└── *VALOR FINAL:* ${precoFinal}*`;
                } else {
                    message += `
├── *Jumbo:* Empresa
└── *VALOR FINAL:* ${precoFinal}*`;
                }

                // Adicionar informações adicionais
                message += `

📋 *INFORMAÇÕES ADICIONAIS*
${selectedBraid.description || 'Sem descrição adicional.'}

📍 *CARACTERÍSTICAS:*
${selectedBraid.characteristics ? selectedBraid.characteristics.map(char => `• ${char}`).join('\\n') : '• Serviço padrão de alta qualidade'}

📅 *PRÓXIMOS PASSOS:*
_1. Entrar em contato com o cliente_
_2. Confirmar data e horário disponíveis_
_3. Enviar confirmação por WhatsApp_

⏰ *HORÁRIO DE ATENDIMENTO:*
Segunda a Sábado: 8h às 18h

🔗 _Solicitação via Site Girosa Beauty_`;

                // Codificar a mensagem para URL
                const encodedMessage = encodeURIComponent(message);
                
                // Simular um pequeno delay para melhor UX (remover em produção se desejar)
                await new Promise(resolve => setTimeout(resolve, 1));
                
                // Abrir WhatsApp
                const whatsappURL = `https://wa.me/5544999180116?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
                
                // Mostrar confirmação
                showNotification('Solicitação enviada com sucesso! Redirecionando para WhatsApp...', 'success');
                
                // Fechar modal após um tempo
                setTimeout(() => {
                    const modal = document.getElementById('braid-modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                    
                    // Resetar formulário
                    bookingForm.reset();
                    resetJumboOptions();
                    
                    // Restaurar botão
                    setButtonLoading(submitButton, false, originalButtonText);
                    
                }, 2000);
                
            } catch (error) {
                console.error('Erro no agendamento:', error);
                showNotification('Erro ao processar agendamento. Tente novamente.', 'error');
                setButtonLoading(submitButton, false, originalButtonText);
            }
        });
        
        // Adicionar máscaras aos campos
        const cpfInput = document.getElementById('client-cpf');
        const phoneInput = document.getElementById('client-phone');
        
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                this.value = formatarCPF(this.value);
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                this.value = formatarTelefone(this.value);
            });
        }
        
        // Validação em tempo real
        const formInputs = bookingForm.querySelectorAll('input[required]');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    // Formulário de afiliação
    const affiliateForm = document.getElementById('affiliate-request-form');
    if (affiliateForm) {
        affiliateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Ativar estado de loading
            setButtonLoading(submitButton, true, 'Enviando...');
            
            try {
                // Validar campos
                if (!validateAffiliateForm()) {
                    setButtonLoading(submitButton, false, originalButtonText);
                    return;
                }
                
                const name = document.getElementById('affiliate-name').value.trim();
                const cpf = document.getElementById('affiliate-cpf').value.trim();
                const suggestions = document.getElementById('affiliate-suggestions').value.trim();
                
                // Formatar CPF
                const cpfFormatado = formatarCPF(cpf);
                
                // Criar mensagem para WhatsApp
                const message = `🎯 *SOLICITAÇÃO DE AFILIAÇÃO - GIROSA BEAUTY* 🎯

👤 *DADOS DO SOLICITANTE:*
• *Nome:* ${name}
• *CPF:* ${cpfFormatado}

💡 *SUGESTÕES PARA MELHORAR O FLUXO DE CLIENTES:*
${suggestions || 'Nenhuma sugestão fornecida.'}

📋 *INFORMAÇÕES ADICIONAIS:*
• Solicitante demonstra interesse no programa de afiliados GB
• Aguarda retorno para próximos passos
• Contato via formulário do site

🔗 _Solicitação via Site Girosa Beauty_`;

                const encodedMessage = encodeURIComponent(message);
                
                // Simular delay para UX
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Abrir WhatsApp
                window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
                
                showNotification('Solicitação de afiliação enviada!', 'success');
                
                // Resetar formulário após sucesso
                setTimeout(() => {
                    affiliateForm.reset();
                    setButtonLoading(submitButton, false, originalButtonText);
                }, 1500);
                
            } catch (error) {
                console.error('Erro na solicitação de afiliação:', error);
                showNotification('Erro ao enviar solicitação. Tente novamente.', 'error');
                setButtonLoading(submitButton, false, originalButtonText);
            }
        });
        
        // Máscara para CPF no formulário de afiliação
        const affiliateCpfInput = document.getElementById('affiliate-cpf');
        if (affiliateCpfInput) {
            affiliateCpfInput.addEventListener('input', function(e) {
                this.value = formatarCPF(this.value);
            });
        }
    }
}

/**
 * Valida o formulário de agendamento
 */
function validateBookingForm() {
    const name = document.getElementById('client-name').value.trim();
    const cpf = document.getElementById('client-cpf').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    
    let isValid = true;
    
    // Validar nome
    if (!name) {
        showFieldError('client-name', 'Por favor, insira seu nome completo');
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
    } else if (!validarCPF(cpf)) {
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
    
    return isValid;
}

/**
 * Valida o formulário de afiliação
 */
function validateAffiliateForm() {
    const name = document.getElementById('affiliate-name').value.trim();
    const cpf = document.getElementById('affiliate-cpf').value.trim();
    
    let isValid = true;
    
    // Validar nome
    if (!name) {
        showFieldError('affiliate-name', 'Por favor, insira seu nome completo');
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
    } else if (!validarCPF(cpf)) {
        showFieldError('affiliate-cpf', 'CPF inválido');
        isValid = false;
    } else {
        clearFieldError('affiliate-cpf');
    }
    
    return isValid;
}

/**
 * Mostra erro em um campo específico
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
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
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    formGroup.appendChild(errorElement);
}

/**
 * Remove erro de um campo
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
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
    const value = field.value.trim();
    
    switch (field.id) {
        case 'client-name':
        case 'affiliate-name':
            if (!value) {
                showFieldError(field.id, 'Este campo é obrigatório');
            } else if (value.length < 3) {
                showFieldError(field.id, 'Mínimo 3 caracteres');
            } else {
                clearFieldError(field.id);
            }
            break;
            
        case 'client-cpf':
        case 'affiliate-cpf':
            if (!value) {
                showFieldError(field.id, 'CPF é obrigatório');
            } else if (!validarCPF(value)) {
                showFieldError(field.id, 'CPF inválido');
            } else {
                clearFieldError(field.id);
            }
            break;
            
        case 'client-phone':
            if (!value) {
                showFieldError(field.id, 'Telefone é obrigatório');
            } else if (value.replace(/\D/g, '').length < 10) {
                showFieldError(field.id, 'Telefone inválido');
            } else {
                clearFieldError(field.id);
            }
            break;
    }
}

/**
 * Formata CPF (000.000.000-00)
 */
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

/**
 * Formata telefone ((00) 00000-0000)
 */
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    return telefone.substring(0, 15);
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
    } else {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// =============================================
// FUNÇÕES DE UTILIDADE - NOTIFICAÇÕES
// =============================================

/**
 * Mostra uma notificação para o usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Fechar notificação ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Animação para a notificação
const style = document.createElement('style');
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// =============================================
// FUNÇÕES DE LOADING E ANIMAÇÕES
// =============================================

/**
 * Mostra a tela de carregamento
 */
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const skeletonLoading = document.getElementById('skeletonLoading');
    const braidsContainer = document.getElementById('braids-container');
    
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
    
    if (skeletonLoading) {
        skeletonLoading.style.display = 'grid';
        generateSkeletonCards();
    }
    
    if (braidsContainer) {
        braidsContainer.style.display = 'none';
    }
}

/**
 * Esconde a tela de carregamento
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const skeletonLoading = document.getElementById('skeletonLoading');
    const braidsContainer = document.getElementById('braids-container');
    
    // Primeiro esconde o skeleton
    if (skeletonLoading) {
        skeletonLoading.style.display = 'none';
    }
    
    // Depois mostra o conteúdo real
    if (braidsContainer) {
        braidsContainer.style.display = 'grid';
    }
    
    // Por último esconde o overlay com delay
    setTimeout(() => {
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }, 500);
}

/**
 * Gera os cards de skeleton loading
 */
function generateSkeletonCards() {
    const skeletonLoading = document.getElementById('skeletonLoading');
    if (!skeletonLoading) return;
    
    skeletonLoading.innerHTML = '';
    
    // Gera 6 cards de skeleton (pode ajustar conforme necessário)
    for (let i = 0; i < 6; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-price"></div>
            </div>
        `;
        skeletonLoading.appendChild(skeletonCard);
    }
}

// Efeito de scroll no header
function setupHeaderScroll() {
    const header = document.querySelector('header');
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    header.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrolled / scrollHeight) * 100;

        // Adiciona/remove classe scrolled
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Atualiza indicador de scroll
        scrollIndicator.style.width = `${scrollProgress}%`;
    });
}

// =============================================
// INICIALIZAÇÃO COMUM
// =============================================

/**
 * Inicializa funcionalidades comuns a todas as páginas
 */
function initCommon() {
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

    // Setup do header scroll
    setupHeaderScroll();

    // Setup dos formulários
    setupForms();

    console.log('Common JavaScript inicializado');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initCommon);