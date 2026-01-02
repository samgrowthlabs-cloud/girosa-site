// Script específico para página sobre

document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});

// Inicialização da página sobre
async function initAboutPage() {
    // Atualizar ano no footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Carregar promoção ativa
    await loadPromotion();
}

// Carregar promoção
async function loadPromotion() {
    try {
        const promotions = await supabaseAPI.fetchActivePromotions();
        
        if (promotions && promotions.length > 0) {
            updateHeaderColors(promotions[0]);
        }
    } catch (error) {
        console.error('Erro ao carregar promoção:', error);
    }
}

// Atualizar cores do header
function updateHeaderColors(promotion) {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    if (promotion.header_bg_color) {
        header.style.backgroundColor = promotion.header_bg_color;
    }
    
    if (promotion.header_text_color) {
        const navLinks = header.querySelectorAll('.nav-link');
        const logo = header.querySelector('.logo-text');
        
        if (logo) logo.style.color = promotion.header_text_color;
        navLinks.forEach(link => {
            link.style.color = promotion.header_text_color;
        });
    }
}