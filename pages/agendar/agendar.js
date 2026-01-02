// pages/agendar/agendar.js - VERSÃO COMPLETA COM CORES DA PROMOÇÃO

// ===== VARIÁVEIS GLOBAIS =====
let selectedService = null;
let selectedJumboOption = 'salon'; // 'salon' ou 'own'
let activePromotion = null;
let formData = {
    name: '',
    phone: '',
    cpf: '',
    date: '',
    time: '',
    observations: ''
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de agendamento...');
    
    // Atualizar ano no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Inicializar página
    initBookingPage();
    
    // Configurar eventos
    setupEventListeners();
    
    // Restaurar dados do formulário
    restoreFormData();
});

// ===== INICIALIZAR PÁGINA DE AGENDAMENTO =====
function initBookingPage() {
    console.log('📋 Inicializando agendamento...');
    
    // Carregar serviço selecionado
    loadSelectedService();
    
    // Verificar se tem serviço selecionado
    if (!selectedService) {
        showError('Nenhum serviço selecionado. Redirecionando para serviços...', true);
        setTimeout(() => {
            window.location.href = '../servicos/index.html';
        }, 3000);
        return;
    }
    
    // Carregar promoção ativa
    if (selectedService.header_bg_color) {
        activePromotion = {
            header_bg_color: selectedService.header_bg_color,
            header_text_color: selectedService.header_text_color,
            name: selectedService.promotion_name,
            percentage_discount: selectedService.promotion_percentage
        };
        console.log('✅ Promoção carregada do serviço:', activePromotion);
    }
    
    // Aplicar tema da promoção
    applyPromotionTheme();
    
    // Atualizar interface
    updateServiceDisplay();
    updatePriceSummary();
    
    // Configurar formulário
    setupForm();
    
    // Configurar máscaras
    setupMasks();
    
    console.log('✅ Página de agendamento inicializada');
}

// ===== APLICAR TEMA DA PROMOÇÃO =====
function applyPromotionTheme() {
    if (!activePromotion || !activePromotion.header_bg_color) {
        console.log('ℹ️ Nenhuma promoção para aplicar tema');
        removePromotionStyles();
        return;
    }
    
    console.log('🎨 Aplicando tema da promoção no agendamento...');
    
    const bgColor = activePromotion.header_bg_color;
    const textColor = activePromotion.header_text_color;
    
    // 1. Header Principal
    const header = document.getElementById('main-header');
    if (header && bgColor) {
        header.style.backgroundColor = bgColor;
        header.style.transition = 'background-color 0.5s ease';
        
        if (textColor) {
            const navLinks = header.querySelectorAll('.nav-link');
            const logo = header.querySelector('.logo-text');
            const toggler = header.querySelector('.navbar-toggler i');
            
            if (logo) logo.style.color = textColor;
            navLinks.forEach(link => link.style.color = textColor);
            if (toggler) toggler.style.color = textColor;
        }
    }
    
    // 2. Botão de WhatsApp (AGENDAR AGORA)
    const whatsappButton = document.querySelector('.btn-whatsapp, .btn-submit');
    if (whatsappButton && bgColor) {
        whatsappButton.style.backgroundColor = bgColor;
        whatsappButton.style.borderColor = bgColor;
        whatsappButton.style.boxShadow = `0 4px 15px ${hexToRgba(bgColor, 0.3)}`;
        
        if (textColor) whatsappButton.style.color = textColor;
        
        // Adicionar efeito hover
        whatsappButton.addEventListener('mouseenter', function() {
            if (bgColor) {
                const hoverColor = darkenColor(bgColor, 20);
                this.style.backgroundColor = hoverColor;
                this.style.borderColor = hoverColor;
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = `0 6px 20px ${hexToRgba(bgColor, 0.4)}`;
            }
        });
        
        whatsappButton.addEventListener('mouseleave', function() {
            if (bgColor) {
                this.style.backgroundColor = bgColor;
                this.style.borderColor = bgColor;
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = `0 4px 15px ${hexToRgba(bgColor, 0.3)}`;
            }
        });
    }
    
    // 3. Botões Secundários
    const secondaryButtons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    secondaryButtons.forEach(button => {
        if (bgColor) {
            button.style.borderColor = bgColor;
            if (!button.classList.contains('btn-outline-primary')) {
                button.style.backgroundColor = bgColor;
            }
        }
        if (textColor && !button.classList.contains('btn-outline-primary')) {
            button.style.color = textColor;
        }
    });
    
    // 4. Preços e Valores
    const priceElements = document.querySelectorAll('.discount-price, .final-price-summary, .total-value');
    priceElements.forEach(element => {
        if (bgColor) {
            element.style.color = bgColor;
            element.style.fontWeight = '700';
        }
    });
    
    // 5. Badges e Tags
    const badges = document.querySelectorAll('.badge, .discount-badge, .jumbo-discount-badge');
    badges.forEach(badge => {
        if (bgColor) {
            badge.style.backgroundColor = bgColor;
            badge.style.borderColor = bgColor;
        }
        if (textColor) badge.style.color = textColor;
    });
    
    // 6. Cards e Containers
    const cards = document.querySelectorAll('.service-summary, .price-summary, .booking-card');
    cards.forEach(card => {
        if (bgColor) {
            card.style.borderTop = `3px solid ${bgColor}`;
            card.style.boxShadow = `0 5px 15px ${hexToRgba(bgColor, 0.1)}`;
        }
    });
    
    // 7. Footer
    const footer = document.querySelector('footer');
    if (footer && bgColor) {
        footer.style.backgroundColor = darkenColor(bgColor, 40);
        footer.style.transition = 'background-color 0.5s ease';
    }
    
    // 8. Títulos
    const titles = document.querySelectorAll('.section-title, .booking-header h1');
    titles.forEach(title => {
        if (bgColor) {
            title.style.color = darkenColor(bgColor, 20);
        }
    });
    
    // 9. Adicionar CSS Dinâmico
    addBookingPromotionStyles(bgColor, textColor);
    
    // 10. Adicionar classe para CSS
    document.body.classList.add('promotion-active');
    
    console.log('✅ Tema da promoção aplicado no agendamento');
}

// ===== ADICIONAR CSS DINÂMICO PARA AGENDAMENTO =====
function addBookingPromotionStyles(bgColor, textColor) {
    // Remover estilos anteriores
    const existingStyle = document.getElementById('booking-promotion-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'booking-promotion-styles';
    
    // Criar variações de cores
    const darkerBg = darkenColor(bgColor, 30);
    const lighterBg = lightenColor(bgColor, 30);
    const bgRgba = hexToRgba(bgColor, 0.1);
    const bgRgbaStrong = hexToRgba(bgColor, 0.3);
    
    style.textContent = `
        /* ===== TEMA DA PROMOÇÃO NO AGENDAMENTO ===== */
        .booking-promotion-active {
            --promotion-primary: ${bgColor};
            --promotion-dark: ${darkerBg};
            --promotion-light: ${lighterBg};
            --promotion-text: ${textColor || '#ffffff'};
            --promotion-rgba: ${bgRgba};
        }
        
        /* ===== BOTÃO WHATSAPP DESTACADO ===== */
        .btn-whatsapp, .btn-submit {
            background: linear-gradient(45deg, ${bgColor}, ${darkerBg}) !important;
            border: none !important;
            color: ${textColor || '#ffffff'} !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            box-shadow: 0 5px 20px ${bgRgbaStrong} !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        .btn-whatsapp:hover, .btn-submit:hover {
            background: linear-gradient(45deg, ${darkerBg}, ${bgColor}) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px ${hexToRgba(bgColor, 0.4)} !important;
        }
        
        .btn-whatsapp::after, .btn-submit::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            transform: rotate(30deg);
            transition: transform 0.5s ease;
        }
        
        .btn-whatsapp:hover::after, .btn-submit:hover::after {
            transform: rotate(30deg) translate(50%, 50%);
        }
        
        /* ===== BOTÕES DE AÇÃO ===== */
        .btn-primary {
            background-color: ${bgColor} !important;
            border-color: ${bgColor} !important;
            color: ${textColor || '#ffffff'} !important;
        }
        
        .btn-outline-primary {
            border-color: ${bgColor} !important;
            color: ${bgColor} !important;
        }
        
        .btn-outline-primary:hover {
            background-color: ${bgColor} !important;
            color: ${textColor || '#ffffff'} !important;
        }
        
        /* ===== PREÇOS DESTACADOS ===== */
        .discount-price, .final-price-summary, .total-value {
            color: ${bgColor} !important;
            text-shadow: 0 2px 4px ${hexToRgba(bgColor, 0.2)} !important;
        }
        
        /* ===== BADGES ===== */
        .badge.bg-primary, .discount-badge, .jumbo-discount-badge {
            background-color: ${bgColor} !important;
            border-color: ${bgColor} !important;
            color: ${textColor || '#ffffff'} !important;
        }
        
        /* ===== CARDS ===== */
        .service-summary, .price-summary, .booking-card {
            border-color: ${bgColor} !important;
            background: linear-gradient(135deg, #ffffff 0%, ${hexToRgba(bgColor, 0.02)} 100%) !important;
        }
        
        /* ===== HEADER DO CARD ===== */
        .summary-header {
            background: linear-gradient(135deg, ${hexToRgba(bgColor, 0.05)}, ${hexToRgba(bgColor, 0.1)}) !important;
            border-bottom: 2px solid ${hexToRgba(bgColor, 0.2)} !important;
        }
        
        /* ===== FORMULÁRIO ===== */
        .form-control:focus {
            border-color: ${bgColor} !important;
            box-shadow: 0 0 0 0.25rem ${hexToRgba(bgColor, 0.25)} !important;
        }
        
        /* ===== OPÇÕES DE JUMBO ===== */
        .jumbo-option:hover {
            border-color: ${bgColor} !important;
            background-color: ${hexToRgba(bgColor, 0.05)} !important;
        }
        
        .jumbo-option input:checked + label {
            color: ${bgColor} !important;
            font-weight: 600 !important;
        }
        
        /* ===== FOOTER ===== */
        .promotion-active footer {
            background: linear-gradient(135deg, ${darkerBg}, ${darkenColor(bgColor, 50)}) !important;
        }
        
        /* ===== MENSAGEM DE PROMOÇÃO ===== */
        .promotion-alert {
            background: linear-gradient(45deg, ${hexToRgba(bgColor, 0.1)}, ${hexToRgba(bgColor, 0.05)}) !important;
            border-left: 4px solid ${bgColor} !important;
            color: ${darkenColor(bgColor, 20)} !important;
        }
        
        /* ===== ANIMAÇÃO PULSE ===== */
        @keyframes promotionPulse {
            0% { box-shadow: 0 0 0 0 ${hexToRgba(bgColor, 0.4)}; }
            70% { box-shadow: 0 0 0 10px ${hexToRgba(bgColor, 0)}; }
            100% { box-shadow: 0 0 0 0 ${hexToRgba(bgColor, 0)}; }
        }
        
        .pulse-animation {
            animation: promotionPulse 2s infinite !important;
        }
        
        /* ===== RESPONSIVIDADE ===== */
        @media (max-width: 768px) {
            .btn-whatsapp, .btn-submit {
                font-size: 1rem !important;
                padding: 12px 20px !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== REMOVER ESTILOS DA PROMOÇÃO =====
function removePromotionStyles() {
    console.log('🎨 Removendo estilos da promoção...');
    
    try {
        document.body.classList.remove('promotion-active');
        
        const dynamicStyles = document.getElementById('booking-promotion-styles');
        if (dynamicStyles) dynamicStyles.remove();
        
        // Resetar elementos
        const elementsToReset = [
            '#main-header',
            '.btn-whatsapp',
            '.btn-submit',
            '.btn-primary',
            '.btn-outline-primary',
            '.discount-price',
            '.final-price-summary',
            '.total-value',
            '.badge',
            '.discount-badge',
            '.jumbo-discount-badge',
            '.service-summary',
            '.price-summary',
            '.booking-card',
            'footer'
        ];
        
        elementsToReset.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.removeAttribute('style');
            });
        });
        
        // Remover eventos de hover do botão WhatsApp
        const whatsappButton = document.querySelector('.btn-whatsapp, .btn-submit');
        if (whatsappButton) {
            const newButton = whatsappButton.cloneNode(true);
            whatsappButton.parentNode.replaceChild(newButton, whatsappButton);
        }
        
        console.log('✅ Estilos da promoção removidos');
    } catch (error) {
        console.error('❌ Erro ao remover estilos:', error);
    }
}

// ===== FUNÇÕES AUXILIARES PARA CORES =====
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R > 0 ? (R < 255 ? R : 255) : 0) * 0x10000 +
        (G > 0 ? (G < 255 ? G : 255) : 0) * 0x100 +
        (B > 0 ? (B < 255 ? B : 255) : 0)
    ).toString(16).slice(1);
}

function hexToRgba(hex, alpha = 1) {
    if (!hex || hex.length < 6) return `rgba(0, 0, 0, ${alpha})`;
    
    hex = hex.replace('#', '');
    
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ===== CARREGAR SERVIÇO SELECIONADO =====
function loadSelectedService() {
    console.log('📥 Carregando serviço selecionado...');
    
    try {
        const savedService = localStorage.getItem('selectedService');
        
        if (savedService) {
            selectedService = JSON.parse(savedService);
            console.log('✅ Serviço carregado:', selectedService);
        } else {
            console.warn('⚠️ Nenhum serviço encontrado no localStorage');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar serviço:', error);
        showError('Erro ao carregar serviço selecionado.');
    }
}

// ===== ATUALIZAR EXIBIÇÃO DO SERVIÇO =====
function updateServiceDisplay() {
    if (!selectedService) return;
    
    console.log('🔄 Atualizando exibição do serviço...');
    
    const bgColor = activePromotion?.header_bg_color;
    const textColor = activePromotion?.header_text_color;
    
    // Atualizar título
    const titleElement = document.getElementById('booking-service-title');
    if (titleElement) {
        titleElement.textContent = selectedService.name;
        if (bgColor) titleElement.style.color = darkenColor(bgColor, 20);
    }
    
    // Atualizar descrição
    const descElement = document.getElementById('booking-service-desc');
    if (descElement) {
        descElement.textContent = selectedService.description || 'Serviço profissional de beleza';
    }
    
    // Atualizar resumo do serviço
    const summaryElement = document.getElementById('service-summary');
    if (summaryElement) {
        const finalPrice = calculateFinalPrice();
        const hasPromotion = selectedService.has_promotion && selectedService.promotion_percentage > 0;
        const promotionPercent = hasPromotion ? Math.round(selectedService.promotion_percentage * 100) : 0;
        
        // Adicionar badge de promoção se houver
        const promotionBadge = hasPromotion && bgColor ? 
            `<span class="badge bg-primary ms-2" style="background-color: ${bgColor} !important; color: ${textColor || '#ffffff'} !important;">
                <i class="fas fa-tag me-1"></i>${promotionPercent}% OFF
            </span>` : '';
        
        summaryElement.innerHTML = `
            <div class="summary-header" style="${bgColor ? `background: linear-gradient(135deg, ${hexToRgba(bgColor, 0.05)}, ${hexToRgba(bgColor, 0.1)}); border-bottom: 2px solid ${hexToRgba(bgColor, 0.2)};` : ''}">
                <h3>${selectedService.name} ${promotionBadge}</h3>
                <div class="summary-price">
                    ${hasPromotion ? `
                        <span class="original-price-summary" style="color: #666;">
                            De R$ ${parseFloat(selectedService.original_price).toFixed(2)}
                        </span>
                    ` : ''}
                    <span class="final-price-summary" style="${bgColor ? `color: ${bgColor}; font-weight: 700;` : ''}">
                        R$ ${finalPrice.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <div class="summary-details">
                <div class="detail-row">
                    <div class="detail-label">Descrição:</div>
                    <div class="detail-value">${selectedService.description || 'Serviço profissional de beleza'}</div>
                </div>
                
                ${selectedService.duration ? `
                    <div class="detail-row">
                        <div class="detail-label">Duração:</div>
                        <div class="detail-value">${selectedService.duration} minutos</div>
                    </div>
                ` : ''}
                
                <div class="detail-row">
                    <div class="detail-label">Para:</div>
                    <div class="detail-value">${getGenderLabel(selectedService.gender)}</div>
                </div>
                
                ${hasPromotion ? `
                    <div class="detail-row">
                        <div class="detail-label">Promoção:</div>
                        <div class="detail-value">
                            <span class="text-success" style="${bgColor ? `color: ${bgColor} !important;` : ''}">
                                <i class="fas fa-tag me-1"></i>
                                ${selectedService.promotion_name || 'Promoção'} - ${promotionPercent}% OFF
                            </span>
                        </div>
                    </div>
                ` : ''}
                
                ${selectedService.includes_jumbo || selectedService.discount_with_jumbo ? `
                    <div class="detail-row">
                        <div class="detail-label">Jumbo:</div>
                        <div class="detail-value">
                            ${selectedService.includes_jumbo ? 
                                '✅ <strong>Inclui jumbo do salão</strong>' : 
                                `💰 <strong>Aceita jumbo próprio</strong> com desconto de ${Math.round((selectedService.percentage_discount || 0) * 100)}%`}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Configurar opções de jumbo
    const jumboSection = document.getElementById('jumbo-options-section');
    if (jumboSection) {
        if (selectedService.includes_jumbo || selectedService.discount_with_jumbo) {
            jumboSection.style.display = 'block';
            
            // Configurar opções disponíveis
            if (selectedService.includes_jumbo && selectedService.discount_with_jumbo) {
                document.getElementById('jumbo-salon').disabled = false;
                document.getElementById('jumbo-own').disabled = false;
                document.getElementById('jumbo-salon').checked = true;
                selectedJumboOption = 'salon';
                
                // Atualizar label do jumbo próprio
                const ownLabel = document.querySelector('label[for="jumbo-own"]');
                if (ownLabel && selectedService.percentage_discount > 0) {
                    const discountPercent = Math.round(selectedService.percentage_discount * 100);
                    ownLabel.innerHTML = `
                        Trazer meu jumbo próprio
                        <span class="jumbo-discount-badge" style="${bgColor ? `background-color: ${bgColor}; color: ${textColor || '#ffffff'};` : ''}">
                            ${discountPercent}% OFF
                        </span>
                    `;
                }
            } else if (selectedService.includes_jumbo) {
                document.getElementById('jumbo-salon').disabled = false;
                document.getElementById('jumbo-own').disabled = true;
                document.getElementById('jumbo-salon').checked = true;
                selectedJumboOption = 'salon';
            } else if (selectedService.discount_with_jumbo) {
                document.getElementById('jumbo-salon').disabled = true;
                document.getElementById('jumbo-own').disabled = false;
                document.getElementById('jumbo-own').checked = true;
                selectedJumboOption = 'own';
                
                const ownLabel = document.querySelector('label[for="jumbo-own"]');
                if (ownLabel && selectedService.percentage_discount > 0) {
                    const discountPercent = Math.round(selectedService.percentage_discount * 100);
                    ownLabel.innerHTML = `
                        Trazer meu jumbo próprio
                        <span class="jumbo-discount-badge" style="${bgColor ? `background-color: ${bgColor}; color: ${textColor || '#ffffff'};` : ''}">
                            ${discountPercent}% OFF
                        </span>
                    `;
                }
            }
        } else {
            jumboSection.style.display = 'none';
        }
    }
}

// ===== CALCULAR PREÇO FINAL =====
function calculateFinalPrice() {
    if (!selectedService) return 0;
    
    let price = parseFloat(selectedService.original_price);
    
    // PROMOÇÃO (sempre decimal: 0.20 = 20%)
    if (selectedService.has_promotion && selectedService.promotion_percentage > 0) {
        price -= price * selectedService.promotion_percentage;
    }
    
    // JUMBO PRÓPRIO
    if (selectedJumboOption === 'own' && 
        selectedService.discount_with_jumbo && 
        selectedService.percentage_discount > 0) {
        price -= price * selectedService.percentage_discount;
    }
    
    return Math.round(price * 100) / 100;
}

// ===== CONFIGURAR FORMULÁRIO =====
function setupForm() {
    console.log('📝 Configurando formulário...');
    
    // Configurar data mínima (amanhã)
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Configurar horário padrão
    const timeInput = document.getElementById('preferred-time');
    if (timeInput) {
        timeInput.value = '14:00';
    }
    
    // Adicionar efeito visual nos campos do formulário
    if (activePromotion?.header_bg_color) {
        const bgColor = activePromotion.header_bg_color;
        const formInputs = document.querySelectorAll('.form-control');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = bgColor;
                this.style.boxShadow = `0 0 0 0.25rem ${hexToRgba(bgColor, 0.25)}`;
            });
            
            input.addEventListener('blur', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
        });
    }
}

// ===== CONFIGURAR MÁSCARAS =====
function setupMasks() {
    // Máscara de CPF
    const cpfInput = document.getElementById('client-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
            formData.cpf = value;
        });
    }
    
    // Máscara de telefone
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length === 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            } else if (value.length === 10) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
            formData.phone = value;
        });
    }
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupEventListeners() {
    // Evento de alteração da opção de jumbo
    const jumboOptions = document.querySelectorAll('input[name="jumbo-option"]');
    jumboOptions.forEach(option => {
        option.addEventListener('change', function() {
            console.log(`🔄 Opção de jumbo alterada: ${this.value}`);
            selectedJumboOption = this.value;
            updatePriceSummary();
            saveFormData();
            
            // Efeito visual na seleção
            if (activePromotion?.header_bg_color) {
                this.parentElement.style.borderColor = activePromotion.header_bg_color;
                setTimeout(() => {
                    this.parentElement.style.borderColor = '';
                }, 300);
            }
        });
    });
    
    // Eventos de input para salvar dados
    const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
    
    // Evento de envio do formulário
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📤 Submetendo formulário...');
            submitBooking();
        });
    }
    
    // Tecla Enter para submeter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            submitBooking();
        }
    });
}

// ===== ATUALIZAR RESUMO DO PREÇO =====
function updatePriceSummary() {
    const summaryElement = document.getElementById('price-summary');
    if (!summaryElement || !selectedService) return;
    
    console.log('💰 Atualizando resumo do preço...');
    
    const bgColor = activePromotion?.header_bg_color;
    const textColor = activePromotion?.header_text_color;
    
    const finalPrice = calculateFinalPrice();
    const hasPromotion = selectedService.has_promotion && selectedService.promotion_percentage > 0;
    const hasJumboDiscount = selectedJumboOption === 'own' && 
                            selectedService.discount_with_jumbo && 
                            selectedService.percentage_discount > 0;
    
    // Calcular descontos
    let promotionDiscount = 0;
    let jumboDiscount = 0;
    let priceAfterPromotion = parseFloat(selectedService.original_price);
    
    if (hasPromotion) {
        promotionDiscount = priceAfterPromotion * selectedService.promotion_percentage;
        priceAfterPromotion -= promotionDiscount;
    }
    
    if (hasJumboDiscount) {
        jumboDiscount = priceAfterPromotion * selectedService.percentage_discount;
    }
    
    const totalDiscount = promotionDiscount + jumboDiscount;
    const discountPercentage = (totalDiscount / parseFloat(selectedService.original_price) * 100).toFixed(1);
    
    let html = `
        <div class="price-summary" style="${bgColor ? `border-color: ${bgColor}; background: linear-gradient(135deg, #ffffff 0%, ${hexToRgba(bgColor, 0.02)} 100%);` : ''}">
            <h4 style="${bgColor ? `color: ${darkenColor(bgColor, 20)}; border-bottom-color: ${hexToRgba(bgColor, 0.2)};` : ''}">
                <i class="fas fa-calculator me-2"></i>
                Resumo do Valor
                ${hasPromotion ? `
                    <span class="badge bg-primary ms-2" style="${bgColor ? `background-color: ${bgColor} !important; color: ${textColor || '#ffffff'} !important;` : ''}">
                        <i class="fas fa-bolt me-1"></i>COM DESCONTO
                    </span>
                ` : ''}
            </h4>
            
            <div class="price-breakdown">
                <div class="price-row">
                    <span class="price-label">Valor original:</span>
                    <span class="price-value">R$ ${parseFloat(selectedService.original_price).toFixed(2)}</span>
                </div>
    `;
    
    if (hasPromotion) {
        html += `
            <div class="price-row" style="${bgColor ? `background-color: ${hexToRgba(bgColor, 0.05)}; border-radius: 8px; padding: 8px 12px;` : ''}">
                <span class="price-label">
                    <i class="fas fa-tag me-1"></i>
                    ${selectedService.promotion_name || 'Promoção'} (${Math.round(selectedService.promotion_percentage * 100)}% OFF):
                </span>
                <span class="price-value" style="${bgColor ? `color: ${bgColor}; font-weight: 600;` : 'color: var(--success-color);'}">
                    - R$ ${promotionDiscount.toFixed(2)}
                </span>
            </div>
        `;
    }
    
    if (hasJumboDiscount) {
        const jumboDiscountPercent = Math.round(selectedService.percentage_discount * 100);
        html += `
            <div class="price-row" style="${bgColor ? `background-color: ${hexToRgba(bgColor, 0.05)}; border-radius: 8px; padding: 8px 12px;` : ''}">
                <span class="price-label">
                    <i class="fas fa-gift me-1"></i>
                    Desconto jumbo próprio (${jumboDiscountPercent}%):
                </span>
                <span class="price-value" style="${bgColor ? `color: ${bgColor}; font-weight: 600;` : 'color: var(--primary-color);'}">
                    - R$ ${jumboDiscount.toFixed(2)}
                </span>
            </div>
        `;
    }
    
    html += `
            </div>
            
            ${totalDiscount > 0 ? `
                <div class="total-discount" style="${bgColor ? `background: linear-gradient(45deg, ${hexToRgba(bgColor, 0.1)}, ${hexToRgba(bgColor, 0.05)}); border-left: 4px solid ${bgColor};` : ''}">
                    <div class="discount-info">
                        <i class="fas fa-piggy-bank me-2" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <div>
                            <div class="discount-amount" style="${bgColor ? `color: ${bgColor}; font-weight: 700;` : ''}">
                                Você economizou R$ ${totalDiscount.toFixed(2)}
                            </div>
                            <div class="discount-percent-total" style="color: var(--gray-color);">
                                ${discountPercentage}% de desconto
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="price-total" style="${bgColor ? `background: linear-gradient(135deg, ${hexToRgba(bgColor, 0.05)}, ${hexToRgba(bgColor, 0.1)}); border-color: ${hexToRgba(bgColor, 0.2)};` : ''}">
                <span class="total-label">
                    <strong>Total a pagar:</strong>
                </span>
                <span class="total-value" style="${bgColor ? `color: ${bgColor}; font-weight: 700; font-size: 1.8rem;` : ''}">
                    <strong>R$ ${finalPrice.toFixed(2)}</strong>
                </span>
            </div>
            
            ${hasPromotion ? `
                <div class="promotion-note" style="${bgColor ? `background-color: ${hexToRgba(bgColor, 0.1)}; border-left: 3px solid ${bgColor}; color: ${darkenColor(bgColor, 20)};` : ''}">
                    <i class="fas fa-star me-1"></i>
                    <small>Preço promocional válido durante a ${selectedService.promotion_name || 'promoção ativa'}</small>
                </div>
            ` : ''}
        </div>
    `;
    
    summaryElement.innerHTML = html;
}

// ===== ENVIAR AGENDAMENTO (WHATSAPP) =====
function submitBooking() {
    console.log('📤 Iniciando envio do agendamento...');
    
    if (!selectedService) {
        showError('Serviço não encontrado.', true);
        return;
    }
    
    // Coletar dados do formulário
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const cpf = document.getElementById('client-cpf').value.trim();
    const date = document.getElementById('preferred-date').value;
    const time = document.getElementById('preferred-time').value;
    const observations = document.getElementById('observations').value.trim();
    
    // Validar dados obrigatórios
    if (!validateForm(name, phone, date, time)) {
        return;
    }
    
    // Validar telefone
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showError('Telefone inválido. Informe DDD + número (10 ou 11 dígitos).');
        return;
    }
    
    // Validar CPF (se informado)
    if (cpf) {
        const cpfDigits = cpf.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            showError('CPF inválido. Deve conter 11 dígitos.');
            return;
        }
    }
    
    // Calcular preço final
    const finalPrice = calculateFinalPrice();
    
    // Formatar data
    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Montar mensagem para WhatsApp
    let message = `*🛍️ NOVO AGENDAMENTO - GIROSA BEAUTY*%0A%0A`;
    
    // SERVIÇO
    message += `*📋 SERVIÇO:*%0A`;
    message += `• ${selectedService.name}%0A`;
    message += `• Valor original: R$ ${parseFloat(selectedService.original_price).toFixed(2)}%0A`;
    
    // DESCONTOS APLICADOS
    let discounts = [];
    
    // Desconto da promoção
    if (selectedService.has_promotion) {
        const promotionDiscount = parseFloat(selectedService.original_price) * selectedService.promotion_percentage;
        const promotionPercent = Math.round(selectedService.promotion_percentage * 100);
        discounts.push(`🎁 ${selectedService.promotion_name}: ${promotionPercent}% (-R$ ${promotionDiscount.toFixed(2)})`);
    }
    
    // Desconto do jumbo próprio
    if (selectedJumboOption === 'own' && selectedService.discount_with_jumbo) {
        const priceAfterPromotion = selectedService.has_promotion ? 
            parseFloat(selectedService.final_price) : 
            parseFloat(selectedService.original_price);
        
        const jumboDiscount = priceAfterPromotion * selectedService.percentage_discount;
        const jumboPercent = Math.round(selectedService.percentage_discount * 100);
        discounts.push(`🧴 Jumbo próprio: ${jumboPercent}% (-R$ ${jumboDiscount.toFixed(2)})`);
    }
    
    if (discounts.length > 0) {
        message += `%0A*💰 DESCONTOS APLICADOS:*%0A`;
        discounts.forEach(d => message += `• ${d}%0A`);
    }
    
    // VALOR FINAL
    message += `%0A*💵 VALOR FINAL:*%0A`;
    message += `• R$ ${finalPrice.toFixed(2)}%0A`;
    
    // DADOS DO CLIENTE
    message += `%0A*👤 DADOS DO CLIENTE:*%0A`;
    message += `• Nome: ${name}%0A`;
    message += `• Telefone: ${phone}%0A`;
    if (cpf) message += `• CPF: ${cpf}%0A`;
    
    // AGENDAMENTO
    message += `%0A*📅 AGENDAMENTO:*%0A`;
    message += `• Data: ${formattedDate}%0A`;
    message += `• Horário: ${time}%0A`;
    
    // JUMBO
    message += `%0A*🧴 JUMBO:*%0A`;
    message += `• ${selectedJumboOption === 'salon' ? 'Usará jumbo do salão' : 'Tragou jumbo próprio'}%0A`;
    
    // OBSERVAÇÕES
    if (observations) {
        message += `%0A*📝 OBSERVAÇÕES:*%0A${observations}%0A`;
    }
    
    // MENSAGEM DE PROMOÇÃO SE HOUVER
    if (selectedService.has_promotion) {
        const promotionPercent = Math.round(selectedService.promotion_percentage * 100);
        message += `%0A*🎉 PROMOÇÃO APLICADA:*%0A`;
        message += `• ${selectedService.promotion_name} - ${promotionPercent}% OFF%0A`;
    }
    
    // RODAPÉ
    message += `%0A_📞 Este agendamento foi feito através do site. Por favor, confirme a disponibilidade._`;
    
    // Número do WhatsApp
    const whatsappNumber = '554499180116';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    console.log('📲 Abrindo WhatsApp...');
    
    // Efeito visual no botão antes de enviar
    const submitButton = document.querySelector('.btn-submit');
    if (submitButton && activePromotion?.header_bg_color) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <i class="fas fa-paper-plane me-2"></i>
            ENVIANDO PARA WHATSAPP...
            <span class="spinner-border spinner-border-sm ms-2" role="status"></span>
        `;
        submitButton.disabled = true;
        
        // Restaurar botão após 2 segundos
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
    
    // Mostrar confirmação
    showSuccess('Redirecionando para o WhatsApp...', activePromotion?.header_bg_color);
    
    // Salvar histórico
    saveBookingHistory(name, phone, date, time, finalPrice);
    
    // Limpar formulário após envio
    setTimeout(() => {
        localStorage.removeItem('selectedService');
        localStorage.removeItem('bookingFormData');
        window.location.href = '../servicos/index.html';
    }, 3000);
    
    // Abrir WhatsApp em nova aba
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

// ===== SALVAR HISTÓRICO =====
function saveBookingHistory(name, phone, date, time, price) {
    try {
        const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        
        const booking = {
            id: Date.now(),
            service: selectedService.name,
            client: name,
            phone: phone,
            date: date,
            time: time,
            price: price,
            timestamp: new Date().toISOString(),
            has_promotion: selectedService.has_promotion,
            promotion_name: selectedService.promotion_name
        };
        
        history.unshift(booking);
        
        if (history.length > 10) {
            history.pop();
        }
        
        localStorage.setItem('bookingHistory', JSON.stringify(history));
        console.log('📋 Histórico de agendamento salvo');
    } catch (error) {
        console.error('❌ Erro ao salvar histórico:', error);
    }
}

// ===== FUNÇÕES AUXILIARES =====
function getGenderLabel(gender) {
    const labels = {
        'feminino': 'Feminino',
        'masculino': 'Masculino',
        'unissex': 'Unissex',
        'ambos': 'Unissex'
    };
    return labels[gender] || 'Unissex';
}

function validateForm(name, phone, date, time) {
    let isValid = true;
    let errorMessage = '';
    
    if (!name) errorMessage = 'Por favor, informe seu nome.';
    else if (!phone) errorMessage = 'Por favor, informe seu telefone.';
    else if (!date) errorMessage = 'Por favor, selecione uma data.';
    else if (!time) errorMessage = 'Por favor, selecione um horário.';
    
    if (errorMessage) {
        showError(errorMessage);
        isValid = false;
    }
    
    return isValid;
}

function saveFormData() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    formData = {
        name: document.getElementById('client-name').value,
        phone: document.getElementById('client-phone').value,
        cpf: document.getElementById('client-cpf').value,
        date: document.getElementById('preferred-date').value,
        time: document.getElementById('preferred-time').value,
        observations: document.getElementById('observations').value,
        jumboOption: selectedJumboOption
    };
    
    try {
        localStorage.setItem('bookingFormData', JSON.stringify(formData));
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

function restoreFormData() {
    try {
        const savedData = localStorage.getItem('bookingFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            formData = data;
            
            document.getElementById('client-name').value = data.name || '';
            document.getElementById('client-phone').value = data.phone || '';
            document.getElementById('client-cpf').value = data.cpf || '';
            document.getElementById('preferred-date').value = data.date || '';
            document.getElementById('preferred-time').value = data.time || '';
            document.getElementById('observations').value = data.observations || '';
            
            if (data.jumboOption) {
                selectedJumboOption = data.jumboOption;
                const jumboOption = document.querySelector(`input[name="jumbo-option"][value="${data.jumboOption}"]`);
                if (jumboOption) {
                    jumboOption.checked = true;
                }
            }
        }
    } catch (error) {
        console.error('❌ Erro ao restaurar dados:', error);
    }
}

// ===== FUNÇÕES DE FEEDBACK =====
function showSuccess(message, bgColor = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 2000;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        ${bgColor ? `background: linear-gradient(45deg, ${hexToRgba(bgColor, 0.1)}, ${hexToRgba(bgColor, 0.05)}); 
                     border-left: 4px solid ${bgColor}; 
                     color: ${darkenColor(bgColor, 20)};` : ''}
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

function showError(message, isCritical = false) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${isCritical ? 'danger' : 'warning'} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 2000;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, isCritical ? 5000 : 3000);
}

// ===== ADICIONAR ANIMAÇÕES CSS =====
function addAnimations() {
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
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .btn-submit {
            transition: all 0.3s ease !important;
        }
        
        .btn-submit:hover {
            animation: pulse 0.5s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== INICIALIZAÇÃO ADICIONAL =====
addAnimations();

// ===== EXPORTAR FUNÇÕES =====
window.calculateFinalPrice = calculateFinalPrice;
window.updatePriceSummary = updatePriceSummary;
window.submitBooking = submitBooking;

console.log('✅ Script de agendamento carregado com sucesso!');