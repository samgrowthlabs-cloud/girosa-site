// pages/servicos/servicos.js - VERSÃO COMPLETA ATUALIZADA

// ===== VARIÁVEIS GLOBAIS =====
let allServices = [];
let currentFilter = 'all';
let activePromotion = null;

// ===== FUNÇÕES DE INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de serviços (NOVA VERSÃO)...');
    
    // Atualizar ano no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Iniciar carregamento
    initializePage();
});

async function initializePage() {
    try {
        // 1. Configurar animações iniciais
        setupAnimations();
        
        // 2. Carregar promoção ativa
        await loadActivePromotion();
        
        // 3. Configurar filtros
        setupFilters();
        
        // 4. Carregar serviços
        await loadServices();
        
        // 5. Configurar interações
        setupInteractions();
        
        // 6. Inicializar tema da promoção (DEPOIS DOS SERVIÇOS)
        initializePromotionTheme();
        
        console.log('✅ Página inicializada com sucesso!');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError('Erro ao carregar a página. Por favor, recarregue.');
    }
}

// ===== ANIMAÇÕES INICIAIS =====
function setupAnimations() {
    // Adicionar estilos de animação CSS dinâmicos
    const animationStyles = document.createElement('style');
    animationStyles.id = 'dynamic-animations';
    animationStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        .hero-animate {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .filter-animate {
            animation: slideInUp 0.8s ease-out 0.2s forwards;
            opacity: 0;
        }
        
        .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Aplicar classes de animação
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('hero-animate');
        
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) filterSection.classList.add('filter-animate');
    }, 100);
}

// ===== CARREGAR PROMOÇÃO ATIVA =====
async function loadActivePromotion() {
    try {
        console.log('🎯 Carregando promoção ativa...');
        
        // Verificar se supabaseAPI existe
        if (!window.supabaseAPI || !window.supabaseAPI.fetchActivePromotion) {
            console.warn('⚠️ supabaseAPI não está disponível');
            return;
        }
        
        activePromotion = await window.supabaseAPI.fetchActivePromotion();
        
        if (activePromotion) {
            console.log('✅ Promoção ativa encontrada:', activePromotion);
            updatePromotionBadge();
        } else {
            console.log('ℹ️ Nenhuma promoção ativa no momento');
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
    
    // Aplicar estilos imediatamente
    applyPromotionStyles(bgColor, textColor);
    
    // Adicionar estilos dinâmicos
    addDynamicPromotionStyles(bgColor, textColor);
    
    // Observar mudanças no DOM
    setupPromotionObserver();
}

// ===== APLICAR ESTILOS DA PROMOÇÃO =====
function applyPromotionStyles(bgColor, textColor) {
    try {
        // ===== HEADER PRINCIPAL =====
        const header = document.getElementById('main-header');
        if (header && bgColor) {
            header.style.backgroundColor = bgColor;
            header.style.transition = 'background-color 0.5s ease, box-shadow 0.5s ease';
            header.style.boxShadow = `0 5px 20px ${hexToRgba(bgColor, 0.3)}`;
            
            if (textColor) {
                // Logo
                const logo = header.querySelector('.logo-text');
                if (logo) {
                    logo.style.color = textColor;
                    logo.style.textShadow = `0 2px 4px ${hexToRgba(textColor, 0.3)}`;
                }
                
                // Links de navegação
                const navLinks = header.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.style.color = textColor;
                    link.style.transition = 'all 0.3s ease';
                    
                    link.addEventListener('mouseenter', () => {
                        link.style.color = lightenColor(textColor, 30);
                        link.style.transform = 'translateY(-2px)';
                    });
                    
                    link.addEventListener('mouseleave', () => {
                        link.style.color = textColor;
                        link.style.transform = 'translateY(0)';
                    });
                });
                
                // Ícones do menu
                const togglerIcon = header.querySelector('.navbar-toggler i');
                if (togglerIcon) {
                    togglerIcon.style.color = textColor;
                }
                
                const toggler = header.querySelector('.navbar-toggler');
                if (toggler) {
                    toggler.style.borderColor = textColor;
                }
            }
        }
        
        // ===== SERVICES HERO =====
        const heroSection = document.querySelector('.services-hero');
        if (heroSection && bgColor) {
            const heroGradient = `
                linear-gradient(135deg, ${hexToRgba(bgColor, 0.85)} 0%, rgba(0, 0, 0, 0.8) 100%), 
                url('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')
            `;
            
            heroSection.style.background = heroGradient;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.transition = 'background 0.8s ease';
            
            // Efeito de brilho animado
            const glowEffect = document.createElement('div');
            glowEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 30% 50%, ${hexToRgba(bgColor, 0.4)} 0%, transparent 70%);
                pointer-events: none;
                z-index: 1;
                animation: float 8s ease-in-out infinite;
            `;
            heroSection.appendChild(glowEffect);
        }
        
        // ===== FILTROS COM CORES DA PROMOÇÃO =====
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && bgColor) {
            activeFilter.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
            activeFilter.style.borderColor = bgColor;
            if (textColor) {
                activeFilter.style.color = textColor;
                activeFilter.style.boxShadow = `0 6px 20px ${hexToRgba(bgColor, 0.4)}`;
            }
        }
        
        // ===== FOOTER =====
        const footer = document.querySelector('footer');
        if (footer && bgColor) {
            footer.style.backgroundColor = darkenColor(bgColor, 40);
            footer.style.transition = 'background-color 0.5s ease';
        }
        
        // ===== ADICIONAR CLASSE PARA CSS =====
        document.body.classList.add('promotion-active');
        document.body.setAttribute('data-promotion-bg', bgColor);
        if (textColor) document.body.setAttribute('data-promotion-text', textColor);
        
        console.log('✅ Estilos da promoção aplicados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao aplicar estilos:', error);
    }
}

// ===== ADICIONAR CSS DINÂMICO DA PROMOÇÃO =====
function addDynamicPromotionStyles(bgColor, textColor) {
    // Remover estilos anteriores
    const existingStyle = document.getElementById('promotion-dynamic-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'promotion-dynamic-styles';
    
    // Criar variações de cores
    const darkerBg = darkenColor(bgColor, 20);
    const lighterBg = lightenColor(bgColor, 20);
    const bgRgba = hexToRgba(bgColor, 0.1);
    const textRgba = textColor ? hexToRgba(textColor, 0.9) : 'rgba(255, 255, 255, 0.9)';
    
    style.textContent = `
        /* ===== TEMA DA PROMOÇÃO DINÂMICO ===== */
        :root {
            --promotion-primary: ${bgColor};
            --promotion-dark: ${darkerBg};
            --promotion-light: ${lighterBg};
            --promotion-text: ${textColor || '#ffffff'};
            --promotion-gradient: linear-gradient(135deg, ${bgColor}, ${darkerBg});
            --promotion-glow: ${hexToRgba(bgColor, 0.3)};
        }
        
        .promotion-active {
            --primary-color: ${bgColor} !important;
            --primary-dark: ${darkerBg} !important;
            --primary-light: ${lighterBg} !important;
        }
        
        /* Header com promoção */
        .promotion-active #main-header {
            background: var(--promotion-gradient) !important;
            animation: headerGlow 3s ease-in-out infinite alternate !important;
        }
        
        @keyframes headerGlow {
            from { box-shadow: 0 5px 20px ${hexToRgba(bgColor, 0.3)}; }
            to { box-shadow: 0 5px 30px ${hexToRgba(bgColor, 0.5)}; }
        }
        
        .promotion-active .logo-text {
            color: ${textColor || '#ffffff'} !important;
            text-shadow: 0 2px 10px ${hexToRgba(textColor || '#ffffff', 0.3)} !important;
        }
        
        .promotion-active .nav-link {
            color: ${textColor || '#ffffff'} !important;
            position: relative;
            overflow: hidden;
        }
        
        .promotion-active .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: ${textColor || '#ffffff'};
            transition: width 0.3s ease;
        }
        
        .promotion-active .nav-link:hover::after {
            width: 100%;
        }
        
        .promotion-active .nav-link.active {
            font-weight: 700 !important;
        }
        
        .promotion-active .nav-link.active::after {
            width: 100%;
        }
        
        /* Hero section com promoção */
        .promotion-active .services-hero {
            background: linear-gradient(135deg, ${hexToRgba(bgColor, 0.85)} 0%, rgba(0, 0, 0, 0.8) 100%), 
                       url('https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80') !important;
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
            background: radial-gradient(circle at 70% 30%, ${hexToRgba(bgColor, 0.2)} 0%, transparent 50%);
            pointer-events: none;
            z-index: 1;
            animation: float 10s ease-in-out infinite alternate;
        }
        
        .promotion-active .services-hero h1 {
            background: linear-gradient(135deg, ${textColor || '#ffffff'}, ${lightenColor(textColor || '#ffffff', 30)}) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            text-shadow: 0 4px 15px ${hexToRgba(bgColor, 0.4)} !important;
        }
        
        /* Filtros ativos com promoção */
        .promotion-active .filter-btn.active {
            background: var(--promotion-gradient) !important;
            border-color: transparent !important;
            color: ${textColor || '#ffffff'} !important;
            box-shadow: 0 8px 25px ${hexToRgba(bgColor, 0.4)} !important;
            transform: translateY(-3px) !important;
        }
        
        /* Cards de serviço com promoção */
        .promotion-active .service-item.with-promotion {
            border: 2px solid transparent !important;
            background: linear-gradient(white, white) padding-box,
                        var(--promotion-gradient) border-box !important;
            box-shadow: 0 15px 35px ${hexToRgba(bgColor, 0.15)} !important;
        }
        
        .promotion-active .promotion-ribbon {
            background: var(--promotion-gradient) !important;
            color: ${textColor || '#ffffff'} !important;
            box-shadow: 0 4px 15px ${hexToRgba(bgColor, 0.4)} !important;
        }
        
        .promotion-active .discount-price {
            color: ${bgColor} !important;
            text-shadow: 0 2px 5px ${hexToRgba(bgColor, 0.1)} !important;
        }
        
        .promotion-active .discount-badge {
            background: var(--promotion-gradient) !important;
            color: ${textColor || '#ffffff'} !important;
        }
        
        .promotion-active .btn-service-detail.promotion-btn {
            background: var(--promotion-gradient) !important;
            box-shadow: 0 10px 30px ${hexToRgba(bgColor, 0.4)} !important;
        }
        
        .promotion-active .btn-service-detail.promotion-btn:hover {
            box-shadow: 0 15px 40px ${hexToRgba(bgColor, 0.6)} !important;
            transform: translateY(-5px) scale(1.02) !important;
        }
        
        /* Efeitos de hover para promoção */
        .promotion-active .service-feature i {
            transition: all 0.3s ease !important;
        }
        
        .promotion-active .service-feature:hover i {
            color: ${bgColor} !important;
            transform: scale(1.2) !important;
        }
        
        /* Footer com promoção */
        .promotion-active footer {
            background: ${darkenColor(bgColor, 40)} !important;
            border-top: 3px solid ${bgColor} !important;
        }
    `;
    
    document.head.appendChild(style);
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
        
        // Resetar elementos
        const elementsToReset = [
            '#main-header',
            '.logo-text',
            '.nav-link',
            '.navbar-toggler',
            '.navbar-toggler i',
            '.filter-btn',
            '.service-item',
            '.discount-price',
            '.discount-badge',
            '.btn-service-detail',
            'footer'
        ];
        
        elementsToReset.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.removeAttribute('style');
                element.classList.remove('with-promotion', 'promotion-btn');
                
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

// ===== CONFIGURAR OBSERVADOR PARA PROMOÇÃO =====
function setupPromotionObserver() {
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
    
    if (!bgColor) return;
    
    // Aplicar a novos botões de serviço
    document.querySelectorAll('.btn-service-detail:not([data-promotion-applied])').forEach(button => {
        if (bgColor) {
            button.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
            button.setAttribute('data-promotion-applied', 'true');
        }
        if (textColor) {
            button.style.color = textColor;
        }
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
            badge.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
            badge.setAttribute('data-promotion-applied', 'true');
        }
        if (textColor) {
            badge.style.color = textColor;
        }
    });
    
    // Aplicar a novas ribbons
    document.querySelectorAll('.promotion-ribbon:not([data-promotion-applied])').forEach(ribbon => {
        if (bgColor) {
            ribbon.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
            ribbon.setAttribute('data-promotion-applied', 'true');
        }
        if (textColor) {
            ribbon.style.color = textColor;
        }
    });
}

// ===== ATUALIZAR BADGE DE PROMOÇÃO =====
function updatePromotionBadge() {
    if (!activePromotion) return;
    
    // Criar badge flutuante se não existir
    let promotionBadge = document.getElementById('promotion-floating-badge');
    if (!promotionBadge) {
        promotionBadge = document.createElement('div');
        promotionBadge.id = 'promotion-floating-badge';
        promotionBadge.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, ${activePromotion.header_bg_color}, ${darkenColor(activePromotion.header_bg_color, 20)});
            color: ${activePromotion.header_text_color || '#ffffff'};
            padding: 12px 20px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            transform: translateX(150%);
            transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            cursor: pointer;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        promotionBadge.innerHTML = `
            <i class="fas fa-bolt" style="font-size: 1.1rem;"></i>
            <span>${activePromotion.name} - ${Math.round(activePromotion.percentage_discount * 100)}% OFF</span>
            <i class="fas fa-chevron-right ms-2" style="font-size: 0.8rem;"></i>
        `;
        
        promotionBadge.addEventListener('click', () => {
            // Scroll até a primeira promoção
            const firstPromotion = document.querySelector('.service-item.with-promotion');
            if (firstPromotion) {
                firstPromotion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Destaque visual
                firstPromotion.style.animation = 'none';
                setTimeout(() => {
                    firstPromotion.style.animation = 'promotionPulse 0.5s ease 2';
                }, 10);
            }
        });
        
        document.body.appendChild(promotionBadge);
        
        // Animar entrada
        setTimeout(() => {
            promotionBadge.style.transform = 'translateX(0)';
        }, 1000);
    }
}

// ===== CONFIGURAR FILTROS =====
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        // Configurar cores iniciais
        if (button.classList.contains('active') && activePromotion?.header_bg_color) {
            const bgColor = activePromotion.header_bg_color;
            const textColor = activePromotion.header_text_color;
            
            button.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
            button.style.borderColor = bgColor;
            if (textColor) {
                button.style.color = textColor;
                button.style.boxShadow = `0 6px 20px ${hexToRgba(bgColor, 0.4)}`;
            }
        }
        
        button.addEventListener('click', function() {
            // Som de clique suave
            playClickSound();
            
            // Animar clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.removeAttribute('style');
                
                // Resetar cores padrão
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.style.boxShadow = '';
            });
            
            this.classList.add('active');
            
            // Aplicar cor da promoção se houver
            if (activePromotion && activePromotion.header_bg_color) {
                const bgColor = activePromotion.header_bg_color;
                const textColor = activePromotion.header_text_color;
                
                this.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
                this.style.borderColor = bgColor;
                this.style.transition = 'all 0.3s ease';
                
                if (textColor) {
                    this.style.color = textColor;
                    this.style.boxShadow = `0 8px 25px ${hexToRgba(bgColor, 0.4)}`;
                }
            }
            
            // Aplicar filtro
            currentFilter = this.dataset.filter;
            console.log(`🔍 Aplicando filtro: ${currentFilter}`);
            
            applyFilter();
            
            // Scroll suave para serviços
            const servicesSection = document.querySelector('.all-services');
            if (servicesSection) {
                setTimeout(() => {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        });
    });
    
    // Efeito hover para filtros
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
    
    console.log('✅ Filtros configurados com animações');
}

// ===== CONFIGURAR INTERAÇÕES =====
function setupInteractions() {
    // Efeito de scroll suave
    window.addEventListener('scroll', debounce(handleScroll, 50));
    
    // Configurar cards para terem efeitos de hover
    document.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.service-item');
        if (card) {
            card.style.zIndex = '10';
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.service-item');
        if (card) {
            card.style.zIndex = '';
        }
    });
    
    console.log('✅ Interações configuradas');
}

// ===== CARREGAR SERVIÇOS =====
async function loadServices() {
    const loadingElement = document.getElementById('services-loading');
    const container = document.getElementById('services-container');
    
    // Mostrar loading com efeito
    if (loadingElement) {
        loadingElement.style.display = 'flex';
        // Adicionar shimmer effect
        loadingElement.innerHTML = `
            <div class="spinner"></div>
            <p>Carregando serviços...</p>
            <div class="loading-grid" style="
                display: none;
                width: 100%;
                max-width: 1200px;
                margin-top: 40px;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 30px;
            ">
                ${Array(6).fill().map(() => `
                    <div class="service-item loading-shimmer" style="
                        height: 500px;
                        border-radius: 20px;
                        opacity: 0.7;
                    "></div>
                `).join('')}
            </div>
        `;
    }
    
    if (container) {
        container.innerHTML = '';
    }
    
    try {
        console.log('🔄 Carregando serviços...');
        
        // Verificar se a API está disponível
        if (!window.supabaseAPI || !window.supabaseAPI.fetchServices) {
            throw new Error('API de serviços não está disponível');
        }
        
        // Simular carregamento para efeito visual
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Carregar serviços
        allServices = await window.supabaseAPI.fetchServices();
        console.log(`✅ ${allServices.length} serviços carregados com sucesso`);
        
        // Adicionar delay para animação
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (allServices.length === 0) {
            showNoServicesMessage();
        } else {
            displayServices(allServices);
            showSuccess(`${allServices.length} serviços disponíveis!`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar serviços:', error);
        showServicesError();
    } finally {
        if (loadingElement) {
            // Animar saída do loading
            loadingElement.style.opacity = '0';
            loadingElement.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingElement.style.display = 'none';
                loadingElement.style.opacity = '1';
            }, 500);
        }
    }
}

// ===== APLICAR FILTRO =====
function applyFilter() {
    if (!allServices || allServices.length === 0) {
        console.log('⚠️ Nenhum serviço para filtrar');
        return;
    }
    
    // Animar transição
    const container = document.getElementById('services-container');
    if (container) {
        container.style.opacity = '0.5';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    setTimeout(() => {
        displayServices(allServices);
        
        if (container) {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }
        
        // Mostrar contagem de resultados
        const filteredCount = countFilteredServices();
        showFilterResults(filteredCount);
    }, 300);
}

// ===== CONTAR SERVIÇOS FILTRADOS =====
function countFilteredServices() {
    if (!allServices || allServices.length === 0) return 0;
    
    if (currentFilter === 'all') return allServices.length;
    
    return allServices.filter(service => {
        const serviceGender = service.gender || 'unissex';
        const filterGender = currentFilter;
        
        if (filterGender === 'ambos') return serviceGender === 'unissex';
        if (filterGender === 'unissex') return serviceGender === 'unissex';
        return serviceGender === filterGender;
    }).length;
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
            if (filterGender === 'unissex') return serviceGender === 'unissex';
            return serviceGender === filterGender;
        });
    }
    
    // Verificar se há serviços após filtro
    if (filteredServices.length === 0) {
        showNoServicesForFilter();
        return;
    }
    
    // Exibir serviços com animação
    container.innerHTML = filteredServices
        .map((service, index) => createServiceItem(service, index))
        .join('');
    
    // Animar entrada dos cards
    animateServiceItems();
    
    // Configurar eventos para os cards
    setupServiceCards();
}

// ===== ANIMAR ENTRADA DOS ITENS =====
function animateServiceItems() {
    const items = document.querySelectorAll('.service-item');
    
    items.forEach((item, index) => {
        // Reset para garantir animação
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px) scale(0.95)';
        item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        // Animar com delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
    });
}

// ===== CONFIGURAR CARDS DE SERVIÇO =====
function setupServiceCards() {
    const cards = document.querySelectorAll('.service-item');
    
    cards.forEach(card => {
        // Efeito de clique
        card.addEventListener('click', function(e) {
            // Não acionar se clicar no botão de detalhes
            if (!e.target.closest('.btn-service-detail')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Abrir detalhes do serviço
                const serviceId = this.dataset.serviceId;
                if (serviceId) {
                    setTimeout(() => {
                        openServiceDetail(parseInt(serviceId));
                    }, 200);
                }
            }
        });
        
        // Efeitos de hover melhorados
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
            
            // Animar preço
            const price = this.querySelector('.discount-price');
            if (price) {
                price.style.transform = 'scale(1.05)';
                price.style.transition = 'transform 0.3s ease';
            }
            
            // Animar badge
            const badge = this.querySelector('.discount-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1) rotate(5deg)';
                badge.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
            
            // Resetar preço
            const price = this.querySelector('.discount-price');
            if (price) {
                price.style.transform = 'scale(1)';
            }
            
            // Resetar badge
            const badge = this.querySelector('.discount-badge');
            if (badge) {
                badge.style.transform = 'scale(1) rotate(0)';
            }
        });
    });
}

// ===== CRIAR ITEM DE SERVIÇO =====
function createServiceItem(service, index) {
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
    const originalPrice = parseFloat(service.original_price || 0).toFixed(2).replace('.', ',');
    const finalPriceFormatted = finalPrice.toFixed(2).replace('.', ',');
    
    // Cores da promoção (se disponível)
    const bgColor = activePromotion?.header_bg_color;
    const textColor = activePromotion?.header_text_color;
    
    // Duração formatada
    const duration = service.duration ? `${service.duration} min` : 'Duração variável';
    
    return `
        <div class="service-item ${hasPromotion ? 'with-promotion' : ''}" 
             data-service-id="${service.id}"
             style="animation-delay: ${index * 0.1}s">
            
            ${hasPromotion ? `
                <div class="promotion-ribbon" 
                     style="${bgColor ? `background: linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 20)});` : ''}
                            ${textColor ? `color: ${textColor};` : ''}">
                    <i class="fas fa-tag me-1"></i>
                    ${promotionPercent}% OFF
                </div>
            ` : ''}
            
            <div class="service-image">
                ${service.image_url ? `
                    <img src="${service.image_url}" 
                         alt="${service.name}" 
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
                ` : `
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.2rem;
                        font-weight: 600;
                    ">
                        <i class="fas fa-spa fa-3x"></i>
                    </div>
                `}
            </div>
            
            <div class="service-content">
                <div class="service-header">
                    <h3 class="service-title">${service.name}</h3>
                    <span class="service-gender">${getGenderLabel(service.gender)}</span>
                </div>
                
                <p class="service-description">${service.description || 'Serviço profissional com qualidade premium'}</p>
                
                <div class="service-price">
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
                        <div class="price-display">
                            <span class="price-prefix" style="font-size: 1rem; color: #666;">R$</span>
                            <span class="discount-price" style="${bgColor ? `color: ${bgColor};` : ''}">
                                ${finalPriceFormatted.split(',')[0]}
                                <span style="font-size: 1.4rem;">,${finalPriceFormatted.split(',')[1]}</span>
                            </span>
                        </div>
                        
                        ${hasPromotion ? `
                            <span class="discount-badge" 
                                  style="${bgColor ? `background: linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)});` : ''}
                                         ${textColor ? `color: ${textColor};` : ''}">
                                <i class="fas fa-bolt me-1"></i>PROMOÇÃO
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="service-features">
                    <div class="service-feature">
                        <i class="fas fa-clock" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <span>${duration}</span>
                    </div>
                    
                    <div class="service-feature">
                        <i class="fas fa-star" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <span>Qualidade garantida</span>
                    </div>
                    
                    ${hasPromotion ? `
                        <div class="service-feature">
                            <i class="fas fa-gift" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                            <span>${activePromotion.name}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${service.includes_jumbo || service.discount_with_jumbo ? `
                    <div class="jumbo-info" 
                         style="${bgColor ? `border-left-color: ${bgColor}; background: linear-gradient(90deg, ${hexToRgba(bgColor, 0.1)} 0%, transparent 100%);` : ''}">
                        <i class="fas fa-info-circle" style="${bgColor ? `color: ${bgColor};` : ''}"></i>
                        <span>
                            ${service.includes_jumbo ? 
                                '✅ <strong>Inclui jumbo do salão</strong>' : 
                                `💰 <strong>Traga seu jumbo</strong> e ganhe ${jumboDiscountPercent}% extra`}
                        </span>
                    </div>
                ` : ''}
            </div>
            
            <div class="service-footer">
                <button class="btn-service-detail ${hasPromotion ? 'promotion-btn' : ''}" 
                        onclick="openServiceDetail(${service.id})"
                        style="${bgColor ? `background: linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)});` : ''}
                               ${textColor ? `color: ${textColor};` : ''}
                               border: none;">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${hasPromotion ? 'AGENDAR COM DESCONTO' : 'Agendar Agora'}</span>
                    <i class="fas fa-arrow-right ms-2"></i>
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
    
    if (promotionGender === 'ambos' || promotionGender === 'unissex') return true;
    if (promotionGender === 'masculino' && serviceGender === 'masculino') return true;
    if (promotionGender === 'feminino' && serviceGender === 'feminino') return true;
    if (serviceGender === 'unissex' && (promotionGender === 'ambos' || promotionGender === 'unissex')) return true;
    
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
    
    // Aplicar desconto do jumbo (se não incluir jumbo)
    if (service.discount_with_jumbo && service.percentage_discount && !service.includes_jumbo) {
        const jumboDiscount = price * parseFloat(service.percentage_discount);
        price -= jumboDiscount;
    }
    
    // Arredondar para 2 casas decimais
    return Math.round(price * 100) / 100;
}

// ===== ABRIR DETALHE DO SERVIÇO =====
function openServiceDetail(serviceId) {
    console.log(`📝 Abrindo detalhe do serviço ${serviceId}`);
    
    // Efeito de clique
    playClickSound();
    
    const service = allServices.find(s => s.id === serviceId);
    if (!service) {
        showError('Serviço não encontrado.');
        return;
    }
    
    // Animar card clicado
    const clickedCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (clickedCard) {
        clickedCard.style.animation = 'scaleIn 0.3s ease';
        setTimeout(() => {
            clickedCard.style.animation = '';
        }, 300);
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
    
    // Salvar no localStorage com feedback
    try {
        localStorage.setItem('selectedService', JSON.stringify(bookingData));
        
        // Mostrar feedback visual
        showSuccess(`<i class="fas fa-check-circle me-2"></i> "${service.name}" selecionado!`);
        
        // Animar redirecionamento
        setTimeout(() => {
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.5s ease';
        }, 300);
        
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
        'feminino': '👩 Feminino',
        'masculino': '👨 Masculino', 
        'unissex': '👥 Unissex',
        'ambos': '👥 Unissex'
    };
    return labels[gender] || '👥 Unissex';
}

// ===== MANIPULAÇÃO DE SCROLL =====
function handleScroll() {
    const header = document.getElementById('main-header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
        if (scrollTop > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = activePromotion?.header_bg_color 
                ? `0 5px 20px ${hexToRgba(activePromotion.header_bg_color, 0.3)}`
                : '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
    }
    
    // Badge flutuante da promoção
    const promotionBadge = document.getElementById('promotion-floating-badge');
    if (promotionBadge) {
        if (scrollTop > 300) {
            promotionBadge.style.top = '80px';
        } else {
            promotionBadge.style.top = '100px';
        }
    }
}

// ===== FUNÇÕES DE DEBOUNCE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== FUNÇÕES DE CORES =====
function lightenColor(color, percent) {
    if (!color || !color.startsWith('#')) return '#ffffff';
    
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    
    return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

function darkenColor(color, percent) {
    if (!color || !color.startsWith('#')) return '#000000';
    
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    
    return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
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

// ===== FEEDBACK VISUAL =====
function showFilterResults(count) {
    const message = document.getElementById('filter-results-message');
    
    if (!message) {
        const newMessage = document.createElement('div');
        newMessage.id = 'filter-results-message';
        newMessage.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.95rem;
            z-index: 9998;
            display: flex;
            align-items: center;
            gap: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(newMessage);
    }
    
    const filterMsg = document.getElementById('filter-results-message');
    const filterText = currentFilter === 'all' ? 'Todos os serviços' : 
                      currentFilter === 'feminino' ? 'Serviços femininos' :
                      currentFilter === 'masculino' ? 'Serviços masculinos' : 'Serviços unissex';
    
    filterMsg.innerHTML = `
        <i class="fas fa-filter" style="color: var(--primary-color);"></i>
        <span>${count} ${count === 1 ? 'serviço encontrado' : 'serviços encontrados'} em "${filterText}"</span>
    `;
    
    // Animar entrada
    setTimeout(() => {
        filterMsg.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Animar saída
    setTimeout(() => {
        filterMsg.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            if (filterMsg.parentNode) {
                filterMsg.remove();
            }
        }, 500);
    }, 3000);
}

function showNoServicesMessage() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="no-services-message" style="
                text-align: center;
                padding: 80px 20px;
                max-width: 600px;
                margin: 0 auto;
            ">
                <div style="
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, var(--gray-light), #f8f9fa);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    border: 3px solid rgba(0,0,0,0.1);
                ">
                    <i class="fas fa-spa fa-3x" style="color: var(--gray-color);"></i>
                </div>
                <h3 style="font-size: 2rem; color: var(--primary-color); margin-bottom: 15px; font-weight: 700;">
                    Nenhum serviço cadastrado
                </h3>
                <p style="color: var(--gray-color); font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
                    Estamos preparando os melhores serviços para você. Em breve teremos novidades!
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()" style="
                    padding: 12px 30px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-redo"></i>
                    Recarregar Página
                </button>
            </div>
        `;
    }
}

function showNoServicesForFilter() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="no-services-message" style="
                text-align: center;
                padding: 80px 20px;
                max-width: 600px;
                margin: 0 auto;
            ">
                <div style="
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, var(--gray-light), #f8f9fa);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    transform: rotate(45deg);
                ">
                    <i class="fas fa-filter fa-2x" style="color: var(--gray-color); transform: rotate(-45deg);"></i>
                </div>
                <h3 style="font-size: 1.8rem; color: var(--primary-color); margin-bottom: 15px; font-weight: 700;">
                    Nenhum serviço encontrado
                </h3>
                <p style="color: var(--gray-color); font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
                    Não há serviços disponíveis para o filtro selecionado.<br>
                    Tente outro filtro ou volte para ver todos os serviços.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="resetFilter()" style="
                        padding: 12px 30px;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-times"></i>
                        Limpar Filtro
                    </button>
                    <button class="btn btn-outline-secondary" onclick="loadServices()" style="
                        padding: 12px 30px;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-redo"></i>
                        Recarregar Serviços
                    </button>
                </div>
            </div>
        `;
    }
}

function showServicesError() {
    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = `
            <div class="no-services-message" style="
                text-align: center;
                padding: 80px 20px;
                max-width: 600px;
                margin: 0 auto;
            ">
                <div style="
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #fee, #fff5f5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    border: 3px solid #f8d7da;
                ">
                    <i class="fas fa-exclamation-triangle fa-2x" style="color: #dc3545;"></i>
                </div>
                <h3 style="font-size: 1.8rem; color: #dc3545; margin-bottom: 15px; font-weight: 700;">
                    Erro ao carregar serviços
                </h3>
                <p style="color: var(--gray-color); font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
                    Não foi possível conectar ao banco de dados.<br>
                    Por favor, verifique sua conexão e tente novamente.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-danger" onclick="window.location.reload()" style="
                        padding: 12px 30px;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-redo"></i>
                        Tentar Novamente
                    </button>
                    <button class="btn btn-outline-secondary" onclick="window.location.href='../../index.html'" style="
                        padding: 12px 30px;
                        font-weight: 600;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-home"></i>
                        Voltar ao Início
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
            
            // Aplicar cores da promoção se houver
            if (activePromotion?.header_bg_color) {
                const bgColor = activePromotion.header_bg_color;
                const textColor = activePromotion.header_text_color;
                
                btn.style.background = `linear-gradient(135deg, ${bgColor}, ${darkenColor(bgColor, 15)})`;
                btn.style.borderColor = bgColor;
                if (textColor) {
                    btn.style.color = textColor;
                    btn.style.boxShadow = `0 8px 25px ${hexToRgba(bgColor, 0.4)}`;
                }
            }
        }
    });
    
    currentFilter = 'all';
    displayServices(allServices);
    showFilterResults(allServices.length);
}

// ===== SONS DE FEEDBACK =====
function playClickSound() {
    try {
        // Criar som de clique suave
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback silencioso se AudioContext não estiver disponível
        console.log('AudioContext não disponível para efeitos sonoros');
    }
}

// ===== NOTIFICAÇÕES =====
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
        animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border-radius: 15px;
        border: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        background: rgba(40, 167, 69, 0.95);
        color: white;
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-shrink-0" style="
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            ">
                <i class="fas fa-check" style="font-size: 1.2rem;"></i>
            </div>
            <div class="flex-grow-1">
                <div style="font-weight: 600; font-size: 1rem;">Sucesso!</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
            </div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" 
                    style="filter: invert(1); opacity: 0.7;"></button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => alertDiv.remove(), 500);
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
        animation: slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border-radius: 15px;
        border: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        background: rgba(220, 53, 69, 0.95);
        color: white;
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="flex-shrink-0" style="
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem;"></i>
            </div>
            <div class="flex-grow-1">
                <div style="font-weight: 600; font-size: 1rem;">Erro!</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
            </div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" 
                    style="filter: invert(1); opacity: 0.7;"></button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => alertDiv.remove(), 500);
        }
    }, 5000);
}

// ===== ANIMAÇÃO CSS ADICIONAL =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
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
    
    @keyframes promotionPulse {
        0%, 100% { 
            box-shadow: 0 0 0 0 rgba(var(--promotion-rgb, 0, 123, 255), 0.7);
        }
        70% { 
            box-shadow: 0 0 0 15px rgba(var(--promotion-rgb, 0, 123, 255), 0);
        }
    }
    
    .service-item {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* Melhorar acessibilidade para foco */
    .btn-service-detail:focus,
    .filter-btn:focus {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(additionalStyles);

// ===== EXPORTAR FUNÇÕES GLOBAIS =====
window.openServiceDetail = openServiceDetail;
window.resetFilter = resetFilter;
window.loadServices = loadServices;
window.applyFilter = applyFilter;

console.log('✅ Script de serviços V2.0 carregado com sucesso!');