// sobre.js - Buscar avaliações reais do Google e integração com Uber

// Configurações do seu negócio
const BUSINESS_CONFIG = {
    placeId: 'ChIJTSoV6HTX7JQRr3OyYCdAF90',
    businessName: 'Girosa Beauty',
    businessAddress: 'Rua pioneiro josé antônio pires 882, Maringá - PR, 87013-000'
};

// Função para buscar avaliações reais do Google
async function fetchGoogleReviews() {
    try {
        console.log('📡 Buscando avaliações reais do Google...');
        
        // Usando a API do Google Places (simulação - na prática você precisaria de uma API key)
        const response = await fetch(`/api/google-reviews?placeid=${BUSINESS_CONFIG.placeId}`);
        
        if (response.ok) {
            const reviews = await response.json();
            displayRealReviews(reviews);
        } else {
            // Fallback para reviews estáticos enquanto não tem API
            displayFallbackReviews();
        }
    } catch (error) {
        console.error('❌ Erro ao buscar avaliações:', error);
        displayFallbackReviews();
    }
}



// Exibir avaliações reais
function displayRealReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    reviewsList.innerHTML = '';

    // Ordenar por data (mais recentes primeiro)
    reviews.sort((a, b) => new Date(b.time) - new Date(a.time));

    reviews.forEach(review => {
        const reviewItem = createReviewItem(review);
        reviewsList.appendChild(reviewItem);
    });

    // Atualizar estatísticas
    updateRatingStats(reviews);
}

// Criar item de review
function createReviewItem(review) {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const starIcons = Array.from({length: 5}, (_, i) => 
        `<i class="fas fa-star${i < review.rating ? '' : '-half-alt'}"></i>`
    ).join('');

    reviewItem.innerHTML = `
        <div class="review-header">
            <div class="reviewer-name">${review.author_name}</div>
            <div class="review-date">${review.relative_time_description}</div>
        </div>
        <div class="review-stars">
            ${starIcons}
        </div>
        <div class="review-text">
            "${review.text}"
        </div>
        <div class="review-rating">
            <span class="rating-badge">${review.rating}.0</span>
            <span class="review-service">Serviço Girosa Beauty</span>
        </div>
    `;

    return reviewItem;
}

// Atualizar estatísticas de rating
function updateRatingStats(reviews) {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingNumber = document.querySelector('.rating-number');
    const totalReviewsElement = document.querySelector('.total-reviews');
    
    if (ratingNumber) {
        ratingNumber.textContent = averageRating.toFixed(1);
    }
    
    if (totalReviewsElement) {
        totalReviewsElement.textContent = `Baseado em ${totalReviews} avaliações no Google`;
    }
}

// Integração com Uber
function setupUberIntegration() {
    const uberBtn = document.getElementById('uber-btn');
    if (!uberBtn) return;

    uberBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openUberRide();
    });
}

// Abrir Uber com destino pré-definido
function openUberRide() {
    // Endereço do Girosa Beauty (substitua pelo endereço real)
    const destination = {
        address: BUSINESS_CONFIG.businessAddress,
        latitude: -23.4273,  // Coordenadas de Maringá-PR (ajuste para seu endereço exato)
        longitude: -51.9375
    };

    // URL do Uber com destino pré-definido
    const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(destination.address)}&dropoff[latitude]=${destination.latitude}&dropoff[longitude]=${destination.longitude}`;
    
    // Abrir Uber
    window.open(uberUrl, '_blank', 'noopener,noreferrer');
    
    // Tracking (opcional)
    console.log('🚗 Abrindo Uber para:', destination.address);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página Sobre...');
    
    // Buscar avaliações reais
    fetchGoogleReviews();
    
    // Configurar botão do Uber
    setupUberIntegration();
    
    console.log('✅ Página Sobre inicializada');
});

// Função para copiar endereço
function copyAddress() {
    const address = document.getElementById('business-address').textContent;
    
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Endereço copiado!', 'success');
    }).catch(err => {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Endereço copiado!', 'success');
    });
}

// Função de notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--black);
        color: var(--white);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}