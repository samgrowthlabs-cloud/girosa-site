// pages/servicos/servicos.js - VERSÃO CORRIGIDA (HEADER FIXED)

// ===== VARIÁVEIS GLOBAIS =====
let allServices = [];
let currentFilter = 'all';
let activePromotion = null;

// ===== FUNÇÕES DE INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de serviços...');
    
    // Atualizar ano no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Iniciar carregamento
    initializePage();
});

async function initializePage() {
    try {
        // 1. Carregar promoção ativa
        await loadActivePromotion();
        
        // 2. Configurar filtros
        setupFilters();
        
        // 3. Carregar serviços
        await loadServices();
        
        // 4. Inicializar tema da promoção (AGORA DEPOIS DOS SERVIÇOS)
        initializePromotionTheme();
        
        console.log('✅ Página inicializada com sucesso');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError('Erro ao carregar a página. Por favor, recarregue.');
    }
}

// ===== CARREGAR PROMOÇÃO ATIVA =====
async function loadActivePromotion() {
    try {
        console.log('🎯 Carregando promoção ativa...');
        
        // Verificar se supabaseAPI existe
        if (!window.supabaseAPI || !window.supabaseAPI.fetchActivePromotion) {
            console.error('❌ supabaseAPI não está disponível');
            return;
        }
        
        activePromotion = await window.supabaseAPI.fetchActivePromotion();
        
        if (activePromotion) {
            console.log('✅ Promoção ativa encontrada:', activePromotion);
            updatePromotionBadge();
        } else {
            console.log('ℹ️ Nenhuma promoção ativa');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar promoção:', error);
    }
}

// ===== INICIALIZAR TEMA DA PROMOÇÃO =====
function initializePromotionTheme() {
    if (!activePromotion) {
        console.log('ℹ️ Nenhuma promoção para aplicar tema');
        removePromotionStyles();
        return;
    }
    
    console.log('🎨 Inicializando tema da promoção...');
    
    const bgColor = activePromotion.header_bg_color;
    const textColor = activePromotion.header_text_color;
    
    if (!bgColor) {
        console.log('⚠️ Cor de fundo da promoção não definida');
        return;
    }
    
    console.log(`🎨 Cores da promoção: BG=${bgColor}, Text=${textColor || 'default'}`);
    
    // Aplicar estilos imediatamente (FOCUS NO HEADER)
    applyPromotionStyles(bgColor, textColor);
    
    // Adicionar estilos dinâmicos
    addDynamicPromotionStyles(bgColor, textColor);
    
    // Observar mudanças no DOM para aplicar cores dinamicamente
    setupPromotionObserver();
}

// ===== APLICAR ESTILOS DA PROMOÇÃO =====
function applyPromotionStyles(bgColor, textColor) {
    try {
        // ===== 1. HEADER PRINCIPAL (CORRIGIDO) =====
        const header = document.getElementById('main-header');
        if (header && bgColor) {
            // Aplicar background color
            header.style.backgroundColor = bgColor;
            header.style.transition = 'background-color 0.5s ease';
            
            // CORREÇÃO: Aplicar cor do texto a TODOS os elementos do header
            if (textColor) {
                // Logo
                const logo = header.querySelector('.logo-text');
                if (logo) {
                    logo.style.color = textColor;
                    console.log('✅ Logo colorida:', textColor);
                }
                
                // Links de navegação
                const navLinks = header.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.style.color = textColor;
                    link.style.transition = 'color 0.3s ease';
                    
                    // Garantir hover também
                    link.addEventListener('mouseenter', () => {
                        link.style.color = lightenColor(textColor, 20);
                    });
                    link.addEventListener('mouseleave', () => {
                        link.style.color = textColor;
                    });
                });
                console.log(`✅ ${navLinks.length} links de navegação coloridos`);
                
                // Ícones do menu hamburguer
                const togglerIcon = header.querySelector('.navbar-toggler i');
                if (togglerIcon) {
                    togglerIcon.style.color = textColor;
                    console.log('✅ Ícone do menu colorido');
                }
                
                // Texto do botão do menu hamburguer
                const toggler = header.querySelector('.navbar-toggler');
                if (toggler) {
                    toggler.style.borderColor = textColor;
                    console.log('✅ Botão menu colorido');
                }
            }
        }
        
        // ===== 2. SERVICES HERO =====
        const heroSection = document.querySelector('.services-hero');
        if (heroSection && bgColor) {
            // Criar gradiente com a cor da promoção
            const heroGradient = `
                linear-gradient(rgba(0, 0, 0, 0.7), ${hexToRgba(bgColor, 0.8)}), 
                url('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
            `;
            
            heroSection.style.background = heroGradient;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.transition = 'background 0.5s ease';
            
            // Adicionar efeito de brilho sutil
            heroSection.style.position = 'relative';
            heroSection.style.overflow = 'hidden';
            
            const glowEffect = document.createElement('div');
            glowEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, ${hexToRgba(bgColor, 0.3)} 0%, transparent 70%);
                pointer-events: none;
                z-index: 1;
            `;
            heroSection.appendChild(glowEffect);
            
            console.log('✅ Hero section estilizado com cor da promoção');
        }
        
        // ===== 3. BOTÕES PRINCIPAIS =====
        const primaryButtons = document.querySelectorAll('.btn-primary, .btn-agendar');
        primaryButtons.forEach(button => {
            if (bgColor) {
                button.style.backgroundColor = bgColor;
                button.style.borderColor = bgColor;
            }
            if (textColor) {
                button.style.color = textColor;
                // Garantir que texto dentro dos botões também mude
                const buttonTexts = button.querySelectorAll('span, i, div');
                buttonTexts.forEach(text => text.style.color = textColor);
            }
        });
        
        // ===== 4. FOOTER =====
        const footer = document.querySelector('footer');
        if (footer && bgColor) {
            footer.style.backgroundColor = darkenColor(bgColor, 40);
            footer.style.transition = 'background-color 0.5s ease';
        }
        
        // ===== 5. ADICIONAR CLASSE PARA CSS =====
        document.body.classList.add('promotion-active');
        document.body.setAttribute('data-promotion-bg', bgColor);
        if (textColor) document.body.setAttribute('data-promotion-text', textColor);
        
        console.log('✅ Estilos da promoção aplicados (header e hero corrigidos)');
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
    const bgRgbaStrong = hexToRgba(bgColor, 0.3);
    const textRgba = textColor ? hexToRgba(textColor, 0.8) : 'rgba(255, 255, 255, 0.8)';
    
    style.textContent = `
        /* ===== TEMA DA PROMOÇÃO ===== */
        :root {
            --promotion-primary: ${bgColor};
            --promotion-dark: ${darkerBg};
            --promotion-light: ${lighterBg};
            --promotion-text: ${textColor || '#ffffff'};
            --promotion-text-light: ${textColor ? lightenColor(textColor, 20) : '#ffffff'};
            --promotion-rgba: ${bgRgba};
            --promotion-rgba-strong: ${bgRgbaStrong};
        }
        
        /* Override das cores principais */
        .promotion-active {
            --primary-color: ${bgColor} !important;
            --primary-dark: ${darkerBg} !important;
            --primary-light: ${lighterBg} !important;
        }
        
        /* ===== HEADER CORRIGIDO (SEM ANIMAÇÃO PROBLEMÁTICA) ===== */
        .promotion-active #main-header {
            background-color: ${bgColor} !important;
            /* REMOVIDO: animation: promotionPulse 2s infinite */
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
            background-color: ${hexToRgba(textColor || '#ffffff', 0.1)} !important;
            border-radius: 4px;
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
        
        /* ===== SERVICES HERO ===== */
        .promotion-active .services-hero {
            background: linear-gradient(rgba(0, 0, 0, 0.7), ${hexToRgba(bgColor, 0.8)}), 
                       url('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') !important;
            background-size: cover !important;
            background-position: center !important;
            position: relative;
            overflow: hidden;
        }
        
        .promotion-active .services-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, ${hexToRgba(bgColor, 0.3)} 0%, transparent 70%);
            pointer-events: none;
            z-index: 1;
        }
        
        .promotion-active .services-hero h1 {
            color: ${textColor || '#ffffff'} !important;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            position: relative;
            z-index: 2;
        }
        
        .promotion-active .services-hero p {
            color: ${textColor ? lightenColor(textColor, 20) : '#ffffff'} !important;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 2;
        }
        
        /* ===== BADGE DE PROMOÇÃO NO TOPO (MANTEM ANIMAÇÃO SÓ AQUI) ===== */
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
        
        /* ... resto do CSS permanece igual ... */
    `;
    
    document.head.appendChild(style);
}

// ===== CONFIGURAR OBSERVADOR PARA PROMOÇÃO =====
function setupPromotionObserver() {
    // Observar mudanças no DOM para aplicar cores a novos elementos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0 && activePromotion) {
                setTimeout(() => {
                    applyPromotionColorsToNewElements();
                }, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ===== APLICAR CORES A NOVOS ELEMENTOS =====
function applyPromotionColorsToNewElements() {
    if (!activePromotion) return;
    
    const bgColor = activePromotion.header_bg_color;
    const textColor = activePromotion.header_text_color;
    
    // Garantir que o header sempre tenha as cores corretas
    const header = document.getElementById('main-header');
    if (header && bgColor) {
        header.style.backgroundColor = bgColor;
        if (textColor) {
            // Aplicar cor do texto a todos os elementos do header
            const logo = header.querySelector('.logo-text');
            if (logo) logo.style.color = textColor;
            
            const navLinks = header.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.style.color = textColor);
            
            const togglerIcon = header.querySelector('.navbar-toggler i');
            if (togglerIcon) togglerIcon.style.color = textColor;
        }
    }
    
    // Aplicar a novos botões de serviço
    document.querySelectorAll('.btn-service-detail:not([data-promotion-applied])').forEach(button => {
        if (bgColor) {
            button.style.backgroundColor = bgColor;
            button.style.borderColor = bgColor;
            button.setAttribute('data-promotion-applied', 'true');
        }
        if (textColor) button.style.color = textColor;
    });
    
    // Aplicar a novos preços
    document.querySelectorAll('.discount-price:not([data-promotion-applied])').forEach(price => {
        if (bgColor) {
            price.style.color = bgColor;
            price.setAttribute('data-promotion-applied', 'true');
        }
    });
    
    // Aplicar a novos badges
    document.querySelectorAll('.discount-badge:not([data-promotion-applied])').forEach(badge => {
        if (bgColor) {
            badge.style.backgroundColor = bgColor;
            badge.setAttribute('data-promotion-applied', 'true');
        }
        if (textColor) badge.style.color = textColor;
    });
}

// ===== REMOVER ESTILOS DA PROMOÇÃO =====
function removePromotionStyles() {
    console.log('🎨 Removendo estilos da promoção...');
    
    try {
        // Remover classe do body
        document.body.classList.remove('promotion-active');
        document.body.removeAttribute('data-promotion-bg');
        document.body.removeAttribute('data-promotion-text');
        
        // Remover estilos dinâmicos
        const dynamicStyles = document.getElementById('promotion-dynamic-styles');
        if (dynamicStyles) dynamicStyles.remove();
        
        // Resetar elementos ESPECIALMENTE O HEADER
        const elementsToReset = [
            '#main-header',
            '.logo-text',
            '.nav-link',
            '.navbar-toggler',
            '.navbar-toggler i',
            '.btn-primary',
            '.btn-service-detail',
            '.btn-agendar',
            '.discount-price',
            '.discount-badge',
            '.service-item.with-promotion',
            '.filter-btn.active',
            '.service-feature i',
            'footer'
        ];
        
        elementsToReset.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.removeAttribute('style');
                element.removeAttribute('data-promotion-applied');
                
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
        promotionBadge.style.display = 'block';
        
        // Aplicar cores se disponíveis
        if (activePromotion.header_bg_color) {
            promotionBadge.style.backgroundColor = activePromotion.header_bg_color;
        }
        if (activePromotion.header_text_color) {
            promotionBadge.style.color = activePromotion.header_text_color;
        }
        
        // Animar entrada
        setTimeout(() => {
            promotionBadge.style.opacity = '1';
            promotionBadge.style.transform = 'translateY(0)';
        }, 100);
    }
}

// ===== FUNÇÕES AUXILIARES PARA CORES =====
function lightenColor(color, percent) {
    if (!color || !color.startsWith('#')) return '#ffffff';
    
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
    if (!color || !color.startsWith('#')) return '#000000';
    
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

// ===== CONFIGURAR FILTROS =====
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Atualizar botão ativo
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.removeAttribute('style');
            });
            
            this.classList.add('active');
            
            // Aplicar cor da promoção se houver
            if (activePromotion && activePromotion.header_bg_color) {
                this.style.backgroundColor = activePromotion.header_bg_color;
                this.style.borderColor = activePromotion.header_bg_color;
                if (activePromotion.header_text_color) {
                    this.style.color = activePromotion.header_text_color;
                }
            }
            
            // Aplicar filtro
            currentFilter = this.dataset.filter;
            console.log(`🔍 Aplicando filtro: ${currentFilter}`);
            
            applyFilter();
        });
    });
    
    console.log('✅ Filtros configurados');
}

// ===== CARREGAR SERVIÇOS =====
async function loadServices() {
    const loadingElement = document.getElementById('services-loading');
    const container = document.getElementById('services-container');
    
    // Mostrar loading
    if (loadingElement) loadingElement.style.display = 'flex';
    if (container) container.innerHTML = '';
    
    try {
        console.log('🔄 Carregando serviços...');
        
        if (!window.supabaseAPI || !window.supabaseAPI.fetchServices) {
            throw new Error('API não disponível');
        }
        
        allServices = await window.supabaseAPI.fetchServices();
        console.log(`✅ ${allServices.length} serviços carregados`);
        
        if (allServices.length === 0) {
            showNoServicesMessage();
        } else {
            displayServices(allServices);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar serviços:', error);
        showServicesError();
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// ===== APLICAR FILTRO =====
function applyFilter() {
    if (!allServices || allServices.length === 0) {
        console.log('⚠️ Nenhum serviço para filtrar');
        return;
    }
    
    displayServices(allServices);
}

// ===== EXIBIR SERVIÇOS =====
function displayServices(services) {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    // Filtrar serviços
    let filteredServices = services;
    if (currentFilter !== 'all') {
        filteredServices = services.filter(service => {
            const serviceGender = service.gender || 'unissex';
            const filterGender = currentFilter;
            
            if (filterGender === 'ambos') return serviceGender === 'unissex';
            return serviceGender === filterGender;
        });
    }
    
    // Verificar se há serviços após filtro
    if (filteredServices.length === 0) {
        showNoServicesForFilter();
        return;
    }
    
    // Exibir serviços
    container.innerHTML = filteredServices.map(service => createServiceItem(service)).join('');
}

// ===== CRIAR ITEM DE SERVIÇO =====
function createServiceItem(service) {
    // Verificar se a promoção se aplica
    const promotionApplies = checkPromotionApplies(service);
    const hasPromotion = promotionApplies && activePromotion;
    
    // Calcular preço final
    const finalPrice = calculateFinalPrice(service, promotionApplies);
    const promotionPercent = hasPromotion ? Math.round(activePromotion.percentage_discount * 100) : 0;
    
    // Desconto do jumbo próprio
    const jumboDiscountPercent = service.percentage_discount ? 
        Math.round(service.percentage_discount * 100) : 0;
    
    // Preços formatados
    const originalPrice = parseFloat(service.original_price || 0).toFixed(2);
    const finalPriceFormatted = finalPrice.toFixed(2);
    
    // Cores da promoção (se disponível)
    const bgColor = activePromotion?.header_bg_color;
    const textColor = activePromotion?.header_text_color;
    
    return `
        <div class="service-item ${hasPromotion ? 'with-promotion' : ''}" 
             data-service-id="${service.id}">
            
            ${hasPromotion ? `
                <div class="promotion-ribbon" style="${bgColor ? `background: linear-gradient(45deg, ${bgColor}, ${darkenColor(bgColor, 20)}); color: ${textColor || '#ffffff'};` : ''}">
                    <i class="fas fa-tag me-1"></i>
                    ${promotionPercent}% OFF
                </div>
            ` : ''}
            
            ${service.image_url ? `
                <div class="service-image">
                    <img src="${service.image_url}" alt="${service.name}" loading="lazy">
                </div>
            ` : ''}
            
            <div class="service-content">
                <div class="service-header">
                    <h3 class="service-title">${service.name}</h3>
                    <span class="service-gender">${getGenderLabel(service.gender)}</span>
                </div>
                
                <p class="service-description">${service.description || 'Serviço profissional'}</p>
                
                <div class="service-price">
                    <div class="price-container">
                        ${hasPromotion ? `
                            <div class="original-price-container">
                                <span class="original-price">R$ ${originalPrice}</span>
                                <span class="promotion-save" style="${bgColor ? `color: ${bgColor};` : ''}">
                                    <i class="fas fa-piggy-bank me-1"></i>
                                    Economize ${promotionPercent}%
                                </span>
                            </div>
                        ` : ''}
                        
                        <div class="final-price-container">
                            <span class="discount-price" style="${bgColor ? `color: ${bgColor};` : ''}">R$ ${finalPriceFormatted}</span>
                            ${hasPromotion ? `
                                <span class="discount-badge" style="${bgColor ? `background-color: ${bgColor}; color: ${textColor || '#ffffff'};` : ''}">
                                    <i class="fas fa-bolt me-1"></i>PROMOÇÃO
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="service-features">
                    <div class="service-feature">
                        <i class="fas fa-clock" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <span>${service.duration ? `${service.duration} min` : 'Duração variável'}</span>
                    </div>
                    ${hasPromotion ? `
                        <div class="service-feature">
                            <i class="fas fa-tag" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                            <span>${activePromotion.name}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${service.includes_jumbo || service.discount_with_jumbo ? `
                    <div class="jumbo-info" style="${bgColor ? `border-left-color: ${bgColor}; background-color: ${hexToRgba(bgColor, 0.05)};` : ''}">
                        <i class="fas fa-info-circle" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <span>
                            ${service.includes_jumbo ? 
                                '✅ Inclui jumbo do salão' : 
                                `💰 Traga seu jumbo e ganhe ${jumboDiscountPercent}% de desconto`}
                        </span>
                    </div>
                ` : ''}
            </div>
            
            <div class="service-footer">
                <button class="btn-service-detail ${hasPromotion ? 'promotion-btn' : ''}" 
                        onclick="openServiceDetail(${service.id})"
                        style="${bgColor ? `background: linear-gradient(45deg, ${bgColor}, ${darkenColor(bgColor, 20)}); border: none; color: ${textColor || '#ffffff'};` : ''}">
                    <i class="fas fa-calendar-alt"></i>
                    ${hasPromotion ? 'AGENDAR COM DESCONTO' : 'Agendar Este Serviço'}
                </button>
            </div>
        </div>
    `;
}

// ===== VERIFICAR SE A PROMOÇÃO SE APLICA =====
function checkPromotionApplies(service) {
    if (!activePromotion) return false;
    
    const serviceGender = service.gender || 'unissex';
    const promotionGender = activePromotion.gender || 'ambos';
    
    console.log(`🔍 Verificando promoção: Serviço=${serviceGender}, Promoção=${promotionGender}`);
    
    if (promotionGender === 'ambos') return true;
    if (promotionGender === 'masculino' && serviceGender === 'masculino') return true;
    if (promotionGender === 'feminino' && serviceGender === 'feminino') return true;
    if (serviceGender === 'unissex' && promotionGender === 'ambos') return true;
    
    return false;
}

// ===== CALCULAR PREÇO FINAL =====
function calculateFinalPrice(service, promotionApplies = null) {
    if (!service || !service.original_price) return 0;
    
    let price = parseFloat(service.original_price);
    
    // Verificar se deve aplicar promoção
    const applies = promotionApplies !== null ? promotionApplies : checkPromotionApplies(service);
    
    // Aplicar desconto da PROMOÇÃO ATIVA
    if (applies && activePromotion && activePromotion.percentage_discount > 0) {
        const discount = price * parseFloat(activePromotion.percentage_discount);
        price -= discount;
        console.log(`💰 Aplicando promoção de ${Math.round(activePromotion.percentage_discount * 100)}%: R$ ${discount.toFixed(2)}`);
    }
    
    // Arredondar para 2 casas decimais
    return Math.round(price * 100) / 100;
}

// ===== ABRIR DETALHE DO SERVIÇO =====
function openServiceDetail(serviceId) {
    console.log(`📝 Abrindo detalhe do serviço ${serviceId}`);
    
    const service = allServices.find(s => s.id === serviceId);
    if (!service) {
        showError('Serviço não encontrado.');
        return;
    }
    
    // Preparar dados para o agendamento
    const bookingData = {
        id: service.id,
        name: service.name,
        description: service.description,
        original_price: service.original_price,
        final_price: calculateFinalPrice(service, checkPromotionApplies(service)),
        percentage_discount: service.percentage_discount || 0,
        gender: service.gender,
        includes_jumbo: service.includes_jumbo,
        discount_with_jumbo: service.discount_with_jumbo,
        duration: service.duration,
        image_url: service.image_url,
        // Informações da promoção
        has_promotion: activePromotion && checkPromotionApplies(service),
        promotion_name: activePromotion?.name,
        promotion_percentage: activePromotion?.percentage_discount,
        // Cores da promoção
        header_bg_color: activePromotion?.header_bg_color,
        header_text_color: activePromotion?.header_text_color
    };
    
    // Salvar no localStorage
    try {
        localStorage.setItem('selectedService', JSON.stringify(bookingData));
        showSuccess(`Serviço "${service.name}" selecionado!`);
        
        // Redirecionar para página de agendamento
        setTimeout(() => {
            window.location.href = '../agendar/index.html';
        }, 800);
        
    } catch (error) {
        console.error('❌ Erro ao salvar serviço:', error);
        showError('Não foi possível salvar o serviço selecionado.');
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

function showNoServicesMessage() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-spa fa-4x mb-3" style="color: var(--gray-color);"></i>
                <h3 class="mb-3">Nenhum serviço cadastrado</h3>
                <p class="text-muted mb-4">Em breve teremos novidades!</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    <i class="fas fa-redo me-2"></i>Recarregar
                </button>
            </div>
        `;
    }
}

function showNoServicesForFilter() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-filter fa-3x mb-3" style="color: var(--gray-color);"></i>
                <h3 class="mb-3">Nenhum serviço encontrado</h3>
                <p class="text-muted mb-4">Não há serviços para o filtro selecionado.</p>
                <button class="btn btn-outline-primary" onclick="resetFilter()">
                    <i class="fas fa-times me-2"></i>Limpar Filtro
                </button>
            </div>
        `;
    }
}

function showServicesError() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x mb-3" style="color: var(--warning-color);"></i>
                <h3 class="mb-3">Erro ao carregar serviços</h3>
                <p class="text-muted mb-4">Não foi possível conectar ao banco de dados.</p>
                <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-redo me-2"></i>Tentar Novamente
                    </button>
                    <button class="btn btn-outline-secondary" onclick="window.location.href='../../index.html'">
                        <i class="fas fa-home me-2"></i>Voltar ao Início
                    </button>
                </div>
            </div>
        `;
    }
}

function resetFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('style');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    currentFilter = 'all';
    displayServices(allServices);
}

// ===== FUNÇÕES DE FEEDBACK =====
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
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

function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.style.cssText = `
        position: fixed;
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
            transform: translateY(-20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .service-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ===== INICIALIZAÇÃO ADICIONAL =====
// Adicionar estilos de animação
addAnimationStyles();

// ===== EXPORTAR FUNÇÕES =====
window.openServiceDetail = openServiceDetail;
window.resetFilter = resetFilter;
window.loadServices = loadServices;

console.log('✅ Script de serviços carregado com sucesso! (Header Corrigido)');