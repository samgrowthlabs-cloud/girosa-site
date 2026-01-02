// script.js - Página Principal com Sistema Completo de Promoções

// ===== VARIÁVEIS GLOBAIS =====
let activePromotion = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página principal inicializando...');
    
    // Iniciar carregamento
    initHomePage();
});

// ===== FUNÇÃO DE INICIALIZAÇÃO =====
async function initHomePage() {
    try {
        // Atualizar ano no footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Carregar promoção ativa
        await loadPromotion();
        
        // Aplicar tema se houver promoção
        if (activePromotion) {
            console.log('🎨 Aplicando tema da promoção...');
            initializePromotionTheme();
        } else {
            console.log('ℹ️ Nenhuma promoção ativa encontrada');
            removePromotionStyles();
        }
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError('Erro ao carregar a página. Por favor, recarregue.');
    }
}

// ===== CARREGAR PROMOÇÃO =====
async function loadPromotion() {
    try {
        console.log('🎯 Carregando promoções...');
        
        // Verificar se supabaseAPI existe
        if (!window.supabaseAPI || !window.supabaseAPI.fetchActivePromotion) {
            console.error('❌ supabaseAPI não está disponível');
            return;
        }
        
        activePromotion = await window.supabaseAPI.fetchActivePromotion();
        
        if (activePromotion) {
            console.log('✅ Promoção ativa encontrada:', activePromotion);
            updatePromotionDisplay(activePromotion);
            updatePromotionBadge();
        } else {
            console.log('ℹ️ Nenhuma promoção ativa encontrada');
            hidePromotionSection();
        }
    } catch (error) {
        console.error('❌ Erro ao carregar promoção:', error);
        hidePromotionSection();
    }
}

// ===== ATUALIZAR EXIBIÇÃO DA PROMOÇÃO =====
function updatePromotionDisplay(promotion) {
    const titleElement = document.getElementById('promotion-title');
    const descElement = document.getElementById('promotion-desc');
    const discountElement = document.getElementById('promotion-discount');
    
    if (titleElement) {
        titleElement.textContent = promotion.name || 'Promoção Especial';
    }
    
    if (descElement && promotion.description) {
        descElement.textContent = promotion.description;
    }
    
    if (discountElement && promotion.percentage_discount) {
        const discountPercent = Math.round(promotion.percentage_discount * 100);
        discountElement.innerHTML = `
            <span class="discount-number">${discountPercent}%</span>
            <span class="discount-label">OFF</span>
        `;
    }
    
    // Mostrar seção de promoção
    const promotionSection = document.getElementById('promotion-section');
    if (promotionSection) {
        promotionSection.style.display = 'block';
        console.log('✅ Seção de promoção exibida');
    }
}

// ===== INICIALIZAR TEMA DA PROMOÇÃO =====
function initializePromotionTheme() {
    if (!activePromotion) {
        console.log('ℹ️ Nenhuma promoção para aplicar tema');
        removePromotionStyles();
        return;
    }
    
    const bgColor = activePromotion.header_bg_color;
    const textColor = activePromotion.header_text_color;
    
    if (!bgColor) {
        console.log('⚠️ Cor de fundo da promoção não definida');
        return;
    }
    
    console.log(`🎨 Cores da promoção: BG=${bgColor}, Text=${textColor || 'default'}`);
    
    // Aplicar estilos imediatamente
    applyPromotionStyles(bgColor, textColor);
    
    // Adicionar CSS dinâmico
    addDynamicPromotionStyles(bgColor, textColor);
    
    // Adicionar classe para CSS
    document.body.classList.add('promotion-active');
    
    // Aplicar cores aos elementos existentes
    applyColorsToElements(bgColor, textColor);
    
    console.log('✅ Tema da promoção aplicado');
}

// ===== APLICAR ESTILOS DA PROMOÇÃO =====
function applyPromotionStyles(bgColor, textColor) {
    try {
        // ===== 1. HEADER PRINCIPAL =====
        const header = document.getElementById('main-header');
        if (header && bgColor) {
            // Aplicar background color
            header.style.backgroundColor = bgColor;
            header.style.transition = 'background-color 0.5s ease';
            
            // Aplicar cor do texto se definida
            if (textColor) {
                // Logo
                const logo = header.querySelector('.logo-text');
                if (logo) {
                    logo.style.color = textColor;
                }
                
                // Links de navegação
                const navLinks = header.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.style.color = textColor;
                    link.style.transition = 'color 0.3s ease';
                    
                    // Garantir hover também
                    const originalColor = textColor;
                    link.addEventListener('mouseenter', () => {
                        link.style.color = lightenColor(originalColor, 20);
                    });
                    link.addEventListener('mouseleave', () => {
                        link.style.color = originalColor;
                    });
                });
                
                // Ícones do menu hamburguer
                const togglerIcon = header.querySelector('.navbar-toggler i');
                if (togglerIcon) {
                    togglerIcon.style.color = textColor;
                }
                
                // Botão do menu hamburguer
                const toggler = header.querySelector('.navbar-toggler');
                if (toggler) {
                    toggler.style.borderColor = textColor;
                }
            }
        }
        
        // ===== 2. BOTÕES PRINCIPAIS =====
        const primaryButtons = document.querySelectorAll('.btn-primary, .btn-agendar');
        primaryButtons.forEach(button => {
            if (bgColor) {
                button.style.backgroundColor = bgColor;
                button.style.borderColor = bgColor;
            }
            if (textColor) {
                button.style.color = textColor;
            }
        });
        
        // ===== 3. SEÇÃO DE PROMOÇÃO =====
        const promotionCard = document.querySelector('.promotion-card');
        if (promotionCard && bgColor) {
            promotionCard.style.backgroundColor = bgColor;
            promotionCard.style.borderColor = bgColor;
            
            if (textColor) {
                const textElements = promotionCard.querySelectorAll('h3, p, span');
                textElements.forEach(el => {
                    el.style.color = textColor;
                });
            }
        }
        
        // ===== 4. FOOTER =====
        const footer = document.querySelector('footer');
        if (footer && bgColor) {
            footer.style.backgroundColor = darkenColor(bgColor, 40);
            footer.style.transition = 'background-color 0.5s ease';
        }
        
        console.log('✅ Estilos da promoção aplicados');
    } catch (error) {
        console.error('❌ Erro ao aplicar estilos:', error);
    }
}

// ===== ADICIONAR CSS DINÂMICO =====
function addDynamicPromotionStyles(bgColor, textColor) {
    // Remover estilos anteriores
    const existingStyle = document.getElementById('promotion-dynamic-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'promotion-dynamic-styles';
    
    // Criar variações de cores
    const darkerBg = darkenColor(bgColor, 30);
    const lighterBg = lightenColor(bgColor, 30);
    const bgRgba = hexToRgba(bgColor, 0.1);
    const textRgba = textColor ? hexToRgba(textColor, 0.8) : 'rgba(255, 255, 255, 0.8)';
    
    style.textContent = `
        /* ===== TEMA DA PROMOÇÃO ===== */
        :root {
            --promotion-primary: ${bgColor};
            --promotion-dark: ${darkerBg};
            --promotion-light: ${lighterBg};
            --promotion-text: ${textColor || '#ffffff'};
            --promotion-text-light: ${textColor ? lightenColor(textColor, 20) : '#ffffff'};
        }
        
        /* Override das cores principais */
        .promotion-active {
            --primary-color: ${bgColor} !important;
            --primary-dark: ${darkerBg} !important;
            --primary-light: ${lighterBg} !important;
        }
        
        /* ===== HEADER ===== */
        .promotion-active #main-header {
            background-color: ${bgColor} !important;
            animation: none !important;
            opacity: 1 !important;
        }
        
        .promotion-active .logo-text {
            color: ${textColor || '#ffffff'} !important;
        }
        
        .promotion-active .nav-link {
            color: ${textColor || '#ffffff'} !important;
            transition: color 0.3s ease !important;
        }
        
        .promotion-active .nav-link:hover {
            color: ${textColor ? lightenColor(textColor, 20) : '#ffffff'} !important;
        }
        
        .promotion-active .nav-link.active {
            font-weight: 600 !important;
            border-bottom: 2px solid ${textColor || '#ffffff'} !important;
        }
        
        .promotion-active .navbar-toggler {
            border-color: ${textColor || '#ffffff'} !important;
        }
        
        .promotion-active .navbar-toggler i {
            color: ${textColor || '#ffffff'} !important;
        }
        
        /* ===== BOTÕES ===== */
        .btn-primary, .btn-agendar {
            background-color: ${bgColor} !important;
            border-color: ${bgColor} !important;
            color: ${textColor || '#ffffff'} !important;
            transition: all 0.3s ease !important;
        }
        
        .btn-primary:hover, .btn-agendar:hover {
            background-color: ${darkerBg} !important;
            border-color: ${darkerBg} !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px ${hexToRgba(bgColor, 0.3)} !important;
        }
        
        /* ===== SEÇÃO DE PROMOÇÃO ===== */
        .promotion-active .promotion-card {
            background: linear-gradient(135deg, ${bgColor}, ${darkerBg}) !important;
            border: none !important;
            box-shadow: 0 10px 30px ${hexToRgba(bgColor, 0.3)} !important;
        }
        
        .promotion-active .promotion-card h3,
        .promotion-active .promotion-card p,
        .promotion-active .promotion-card span {
            color: ${textColor || '#ffffff'} !important;
        }
        
        /* ===== BADGE DE PROMOÇÃO ===== */
        .promotion-badge {
            background: linear-gradient(45deg, ${bgColor}, ${darkerBg}) !important;
            color: ${textColor || '#ffffff'} !important;
            animation: promotionPulse 2s infinite !important;
        }
        
        @keyframes promotionPulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        
        /* ===== HERO SECTION ===== */
        .promotion-active .hero-section {
            position: relative;
        }
        
        .promotion-active .hero-section::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, ${hexToRgba(bgColor, 0.1)}, transparent);
            pointer-events: none;
            z-index: 1;
        }
        
        /* ===== FOOTER ===== */
        .promotion-active footer {
            background: linear-gradient(135deg, ${darkerBg}, ${darkenColor(bgColor, 50)}) !important;
        }
        
        /* ===== RESPONSIVIDADE ===== */
        @media (max-width: 768px) {
            /* Header mobile */
            .promotion-active .navbar-collapse {
                background-color: ${bgColor} !important;
            }
            
            .promotion-active .navbar-nav {
                background-color: ${bgColor} !important;
            }
            
            .promotion-active .nav-link {
                border-bottom: 1px solid ${textRgba} !important;
            }
            
            .promotion-active .nav-link.active {
                background-color: ${hexToRgba(textColor || '#ffffff', 0.1)} !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== APLICAR CORES A ELEMENTOS =====
function applyColorsToElements(bgColor, textColor) {
    // Preços e badges
    document.querySelectorAll('.discount-number, .discount-label').forEach(el => {
        if (bgColor) {
            el.style.color = textColor || '#ffffff';
        }
    });
    
    // Ícones
    document.querySelectorAll('.fa-bolt').forEach(icon => {
        if (textColor) icon.style.color = textColor;
    });
}

// ===== ATUALIZAR BADGE DE PROMOÇÃO =====
function updatePromotionBadge() {
    if (!activePromotion) return;
    
    const promotionBadge = document.getElementById('promotion-badge');
    if (promotionBadge) {
        const discountPercent = Math.round(activePromotion.percentage_discount * 100);
        promotionBadge.innerHTML = `
            <i class="fas fa-bolt me-1"></i>
            <strong>${activePromotion.name}</strong> - ${discountPercent}% OFF
            <i class="fas fa-bolt ms-1"></i>
        `;
        promotionBadge.style.display = 'inline-block';
        
        // Animar entrada
        setTimeout(() => {
            promotionBadge.style.opacity = '1';
            promotionBadge.style.transform = 'scale(1)';
        }, 100);
    }
}

// ===== ESCONDER SEÇÃO DE PROMOÇÃO =====
function hidePromotionSection() {
    const promotionSection = document.getElementById('promotion-section');
    if (promotionSection) {
        promotionSection.style.display = 'none';
        console.log('ℹ️ Seção de promoção ocultada');
    }
}

// ===== REMOVER ESTILOS DA PROMOÇÃO =====
function removePromotionStyles() {
    console.log('🎨 Removendo estilos da promoção...');
    
    try {
        document.body.classList.remove('promotion-active');
        
        const dynamicStyles = document.getElementById('promotion-dynamic-styles');
        if (dynamicStyles) dynamicStyles.remove();
        
        // Resetar elementos
        const elementsToReset = [
            '#main-header',
            '.logo-text',
            '.nav-link',
            '.navbar-toggler',
            '.navbar-toggler i',
            '.btn-primary',
            '.btn-agendar',
            '.promotion-card',
            '.promotion-card h3',
            '.promotion-card p',
            '.promotion-card span',
            'footer'
        ];
        
        elementsToReset.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.removeAttribute('style');
                
                // Remover event listeners específicos
                if (element.classList.contains('nav-link')) {
                    const newElement = element.cloneNode(true);
                    element.parentNode.replaceChild(newElement, element);
                }
            });
        });
        
        console.log('✅ Estilos removidos com sucesso');
    } catch (error) {
        console.error('❌ Erro ao remover estilos:', error);
    }
}

// ===== FUNÇÕES AUXILIARES =====
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
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
    }, 5000);
}

// ===== FUNÇÕES DE CORES =====
function lightenColor(color, percent) {
    if (!color || !color.startsWith('#')) return '#ffffff';
    
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0xFF) + amt);
    const B = Math.min(255, (num & 0xFF) + amt);
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function darkenColor(color, percent) {
    if (!color || !color.startsWith('#')) return '#000000';
    
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0xFF) - amt);
    const B = Math.max(0, (num & 0xFF) - amt);
    
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

// ===== ADICIONAR ANIMAÇÃO CSS =====
function addAnimationStyles() {
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
        
        .promotion-badge {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// ===== INICIALIZAÇÃO ADICIONAL =====
// Adicionar estilos de animação
addAnimationStyles();

console.log('✅ Script da página principal carregado com sucesso!');