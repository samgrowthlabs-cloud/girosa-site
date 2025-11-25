// =============================================
// JAVASCRIPT ESPECÍFICO DA PÁGINA AGENDAR
// =============================================

/**
 * Carrega as tranças na página de agendamento
 */
function loadBraids() {
    const container = document.getElementById('braids-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Adicionar banner de promoção se houver promoção ativa
    if (window.currentPromotion && window.currentPromotion.ativo) {
        const promoBanner = document.createElement('div');
        const promo = window.currentPromotion;
        promoBanner.className = 'promo-banner';
        promoBanner.innerHTML = `
            <div class="promo-content">
                <i class="fas fa-tag"></i>
                <span>PROMOÇÃO ATIVA!</span>
                ${promo.desconto_all > 0 ? `<strong>Todos os tipos: ${(promo.desconto_all * 100)}% OFF</strong>` : ''}
                ${promo.desconto_mascu > 0 ? `<strong>Masculino: ${(promo.desconto_mascu * 100)}% OFF</strong>` : ''}
                ${promo.desconto_feminin > 0 ? `<strong>Feminino: ${(promo.desconto_feminin * 100)}% OFF</strong>` : ''}
            </div>
        `;
        container.parentNode.insertBefore(promoBanner, container);
    }
    
    braidsData.forEach((braid, index) => {
        const braidCard = document.createElement('div');
        braidCard.className = `braid-card ${braid.category}`;
        braidCard.setAttribute('data-category', braid.category);
        braidCard.setAttribute('data-title', braid.title.toLowerCase());
        
        const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
        
        braidCard.innerHTML = `
            <div class="braid-image">
                <img src="${braid.image}" alt="${braid.title}" onerror="this.src='https://images.unsplash.com/photo-1596704012031-4d64730fef1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'">
                ${precoCalculado.temDesconto ? '<div class="discount-badge">' + (precoCalculado.desconto * 100) + '% OFF</div>' : ''}
            </div>
            <div class="braid-info">
                <h3>${braid.title}</h3>
                <div class="braid-price">
                    ${precoCalculado.temDesconto ? 
                        `<span class="original-price">${formatCurrencyBR(braid.price)}</span>
                         <span class="discount-price">${precoCalculado.comDesconto}</span>` :
                        `<span>${formatCurrencyBR(braid.price)}</span>`
                    }
                </div>
            </div>
        `;
        
        braidCard.addEventListener('click', function() {
            currentBraidIndex = index;
            openBraidModal(braid);
        });
        
        container.appendChild(braidCard);
    });
}

/**
 * Abre o modal com os detalhes da trança selecionada
 */
function openBraidModal(braid) {
    const modal = document.getElementById('braid-modal');
    const modalImg = document.getElementById('modal-braid-img');
    const modalTitle = document.getElementById('modal-braid-title');
    const modalDescription = document.getElementById('modal-braid-description');
    const modalPrice = document.getElementById('modal-braid-price');
    
    if (!modal || !modalImg || !modalTitle || !modalDescription || !modalPrice) return;
    
    modalImg.src = braid.image;
    modalImg.alt = braid.title;
    modalTitle.textContent = braid.title;
    modalDescription.textContent = braid.description;

    resetZoom();
    
    // Calcular preço com desconto para o modal
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    // DEBUG: Verificar os valores
    console.log('Preço original da trança:', braid.price);
    console.log('Preço calculado:', precoCalculado);
    
    // Armazenar o preço original (já formatado)
    window.currentBraidOriginalPrice = precoCalculado.comDesconto;
    
    if (precoCalculado.temDesconto) {
        modalPrice.innerHTML = `
            <span class="original-price">${precoCalculado.original}</span>
            <span class="discount-price">${precoCalculado.comDesconto}</span>
            <div class="discount-text">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
        `;
    } else {
        // Usar o preço já formatado da função calcularPrecoComDesconto
        modalPrice.textContent = precoCalculado.comDesconto;
        window.currentBraidOriginalPrice = precoCalculado.comDesconto;
    }
    
    modal.style.display = 'block';
    
    // Armazenar dados da trança selecionada no formulário
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.setAttribute('data-braid-id', braid.id);
        bookingForm.setAttribute('data-braid-title', braid.title);
        bookingForm.setAttribute('data-braid-price', precoCalculado.comDesconto);
        bookingForm.setAttribute('data-braid-original-price', braid.price);
        bookingForm.setAttribute('data-braid-code', braid.code);
        
        // DEBUG
        console.log('Dados do formulário:', {
            id: braid.id,
            title: braid.title,
            price: precoCalculado.comDesconto,
            originalPrice: braid.price,
            code: braid.code
        });
    }
    
    // Resetar o checkbox do jumbo e esconder o resumo
    resetJumboOptions();
    
    // Configurar eventos do jumbo
    setupJumboEvents();
}

/**
 * Configura os controles de zoom no modal
 */
function setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const modalImg = document.getElementById('modal-braid-img');
    
    if (zoomInBtn && modalImg) {
        zoomInBtn.addEventListener('click', function() {
            currentZoom = Math.min(currentZoom + 0.25, 3);
            modalImg.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomOutBtn && modalImg) {
        zoomOutBtn.addEventListener('click', function() {
            currentZoom = Math.max(currentZoom - 0.25, 0.5);
            modalImg.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomResetBtn && modalImg) {
        zoomResetBtn.addEventListener('click', resetZoom);
    }
}

/**
 * Reseta o zoom para o nível padrão (1x)
 */
function resetZoom() {
    const modalImg = document.getElementById('modal-braid-img');
    currentZoom = 1;
    if (modalImg) {
        modalImg.style.transform = 'scale(1)';
    }
}

/**
 * Configura os controles de navegação entre tranças
 */
function setupNavigationControls() {
    const prevBtn = document.getElementById('prev-braid');
    const nextBtn = document.getElementById('next-braid');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousBraid);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextBraid);
    }
}

/**
 * Mostra a trança anterior na lista
 */
function showPreviousBraid() {
    if (braidsData.length === 0) return;
    
    currentBraidIndex = (currentBraidIndex - 1 + braidsData.length) % braidsData.length;
    openBraidModal(braidsData[currentBraidIndex]);
}

/**
 * Mostra a próxima trança na lista
 */
function showNextBraid() {
    if (braidsData.length === 0) return;
    
    currentBraidIndex = (currentBraidIndex + 1) % braidsData.length;
    openBraidModal(braidsData[currentBraidIndex]);
}

/**
 * Configura os filtros na página de agendamento
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchBox = document.querySelector('.search-box');
    
    if (filterButtons.length === 0 || !searchBox) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    searchBox.addEventListener('input', applyFilters);
}

/**
 * Aplica os filtros ativos na página de agendamento
 */
function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const searchBox = document.querySelector('.search-box');
    
    if (!activeFilter || !searchBox) return;
    
    const activeFilterValue = activeFilter.getAttribute('data-filter');
    const searchTerm = searchBox.value.toLowerCase();
    
    const braidCards = document.querySelectorAll('.braid-card');
    
    braidCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.getAttribute('data-title');
        
        const categoryMatch = activeFilterValue === 'all' || category === activeFilterValue;
        const searchMatch = title.includes(searchTerm);
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Configura o modal de detalhes das tranças
 */
function setupModal() {
    const modal = document.getElementById('braid-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            resetZoom();
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetZoom();
        }
    });
    
    setupZoomControls();
    setupNavigationControls();
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            resetZoom();
        }
    });
}

// =============================================
// SISTEMA COLAB-GB - BUSCA POR CÓDIGO
// =============================================

/**
 * Inicializa o sistema de busca por código
 */
function initColabGB() {
    const searchBtn = document.getElementById('search-braid-btn');
    const codeInput = document.getElementById('braid-code-input');
    
    loadCodesList();
    loadColabBraidsCatalog();
    
    if (searchBtn && codeInput) {
        searchBtn.addEventListener('click', searchBraidByCode);
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBraidByCode();
            }
        });
    }
    
    const shareBtn = document.getElementById('share-braid-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareBraidDetails);
    }
    
    const whatsappBtn = document.getElementById('whatsapp-braid-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendBraidViaWhatsApp);
    }
}

/**
 * Carrega a lista de códigos disponíveis
 */
function loadCodesList() {
    const codesList = document.getElementById('codes-list');
    if (!codesList) return;
    
    const femCodes = braidsData.filter(braid => braid.category === 'feminino');
    const masCodes = braidsData.filter(braid => braid.category === 'masculino');
    
    codesList.innerHTML = '';
    
    femCodes.forEach(braid => {
        const codeItem = document.createElement('div');
        codeItem.className = 'code-item';
        codeItem.textContent = braid.code;
        codeItem.style.cursor = 'pointer';
        codeItem.addEventListener('click', () => {
            document.getElementById('braid-code-input').value = braid.code;
            searchBraidByCode();
        });
        codesList.appendChild(codeItem);
    });
    
    masCodes.forEach(braid => {
        const codeItem = document.createElement('div');
        codeItem.className = 'code-item';
        codeItem.textContent = braid.code;
        codeItem.style.cursor = 'pointer';
        codeItem.addEventListener('click', () => {
            document.getElementById('braid-code-input').value = braid.code;
            searchBraidByCode();
        });
        codesList.appendChild(codeItem);
    });
}

/**
 * Busca trança por código
 */
function searchBraidByCode() {
    const codeInput = document.getElementById('braid-code-input');
    const resultsDiv = document.getElementById('search-results');
    const errorDiv = document.getElementById('error-message');
    
    if (!codeInput || !resultsDiv || !errorDiv) return;
    
    const searchCode = codeInput.value.trim().toUpperCase();
    
    if (!searchCode) {
        showError('Digite um código para buscar');
        return;
    }
    
    const foundBraid = braidsData.find(braid => braid.code === searchCode);
    
    if (foundBraid) {
        displayBraidResult(foundBraid);
        resultsDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showError(`Trança com código "${searchCode}" não encontrada`);
        resultsDiv.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}

/**
 * Exibe o resultado da busca por código
 */
function displayBraidResult(braid) {
    const imgElement = document.getElementById('result-braid-img');
    const titleElement = document.getElementById('result-braid-title');
    const codeElement = document.getElementById('result-braid-code');
    const categoryElement = document.getElementById('result-braid-category');
    const descriptionElement = document.getElementById('result-braid-description');
    const priceElement = document.getElementById('result-braid-price');
    const characteristicsElement = document.getElementById('result-braid-characteristics');
    
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    if (imgElement) imgElement.src = braid.image;
    if (imgElement) imgElement.alt = braid.title;
    if (titleElement) titleElement.textContent = braid.title;
    if (codeElement) codeElement.textContent = braid.code;
    
    if (categoryElement) {
        categoryElement.textContent = braid.category === 'feminino' ? 'Feminino' : 'Masculino';
    }
    
    if (descriptionElement) descriptionElement.textContent = braid.description;
    
    if (priceElement) {
        if (precoCalculado.temDesconto) {
            priceElement.innerHTML = `
                <span style="text-decoration: line-through; color: #999; margin-right: 10px;">${formatCurrencyBR(braid.price)}</span>
                <span>${precoCalculado.comDesconto}</span>
                <div style="color: #22c55e; font-size: 1rem; margin-top: 5px;">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
            `;
        } else {
            priceElement.textContent = formatCurrencyBR(braid.price);
        }
    }
    
    if (characteristicsElement && braid.characteristics) {
        characteristicsElement.innerHTML = '';
        braid.characteristics.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char;
            characteristicsElement.appendChild(li);
        });
    }
    
    calculateComissions(braid.price, precoCalculado);
    window.currentBraidResult = braid;
    window.currentBraidPrice = precoCalculado.comDesconto;
}

/**
 * Calcula comissões para diferentes níveis de afiliados
 */
function calculateComissions(originalPrice, precoCalculado) {
    const priceValue = parseFloat(precoCalculado.comDesconto.replace('R$ ', '').replace(',', '.'));
    
    const comissionBAS = (priceValue * 0.10).toFixed(2);
    const comissionINT = (priceValue * 0.13).toFixed(2);
    const comissionTOP = (priceValue * 0.15).toFixed(2);
    
    const basElement = document.getElementById('comission-bas');
    const intElement = document.getElementById('comission-int');
    const topElement = document.getElementById('comission-top');
    
    if (basElement) basElement.textContent = comissionBAS.replace('.', ',');
    if (intElement) intElement.textContent = comissionINT.replace('.', ',');
    if (topElement) topElement.textContent = comissionTOP.replace('.', ',');
}

/**
 * Carrega o catálogo completo de tranças para o sistema Colab-GB
 */
function loadColabBraidsCatalog() {
    const gridElement = document.getElementById('braids-grid-colab');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    braidsData.forEach(braid => {
        const card = document.createElement('div');
        card.className = 'braid-card-colab';
        
        const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
        
        card.innerHTML = `
            <div class="braid-image-colab">
                <img src="${braid.image}" alt="${braid.title}">
                <div class="braid-code-small">${braid.code}</div>
            </div>
            <div class="braid-info-colab">
                <div class="braid-category-colab">${braid.category === 'feminino' ? 'Feminino' : 'Masculino'}</div>
                <h4>${braid.title}</h4>
                <div class="braid-price-colab">
                    ${precoCalculado.temDesconto ? 
                        `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-right: 8px;">${formatCurrencyBR(braid.price)}</span>
                         <span>${precoCalculado.comDesconto}</span>` :
                        formatCurrencyBR(braid.price)
                    }
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('braid-code-input').value = braid.code;
            searchBraidByCode();
        });
        
        gridElement.appendChild(card);
    });
}

/**
 * Compartilha detalhes da trança
 */
function shareBraidDetails() {
    if (!window.currentBraidResult) return;
    
    const braid = window.currentBraidResult;
    const price = window.currentBraidPrice;
    
    const shareText = `💇 *${braid.title}* - ${braid.code}

💰 Preço: ${price}
📝 ${braid.description}

🔗 Disponível no Girosa Beauty
📞 Agende pelo site: girosabeauty.com`;

    if (navigator.share) {
        navigator.share({
            title: braid.title,
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Detalhes da trança copiados para a área de transferência!', 'success');
        });
    } else {
        prompt('Copie os detalhes da trança:', shareText);
    }
}

/**
 * Envia trança via WhatsApp
 */
function sendBraidViaWhatsApp() {
    if (!window.currentBraidResult) return;
    
    const braid = window.currentBraidResult;
    const price = window.currentBraidPrice;
    
    const message = `💇 *${braid.title}* - ${braid.code}

${braid.description}

💰 *Preço:* ${price}
📋 *Categoria:* ${braid.category === 'feminino' ? 'Feminino' : 'Masculino'}

✨ *Características:*
${braid.characteristics ? braid.characteristics.map(char => `• ${char}`).join('\n') : ''}

🔗 *Indicação Girosa Beauty*
_Esta trança está disponível para agendamento_`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

/**
 * Exibe mensagem de erro
 */
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) return;
    
    const errorContent = errorDiv.querySelector('.error-content');
    if (errorContent) {
        const h3 = errorContent.querySelector('h3');
        if (h3) h3.textContent = message;
    }
    
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =============================================
// INICIALIZAÇÃO DA PÁGINA AGENDAR - CORRIGIDA
// =============================================

/**
 * Inicializa a página de agendamento
 */
function initAgendarPage() {
    console.log('Inicializando página de agendamento...');
    
    // Mostrar loading inicial
    showLoading();
    
    // Carregar dados
    loadPromotionFromDB().then(() => {
        loadBraidsFromDB().then(() => {
            loadBraids();
            setupFilters();
            setupModal();
            
            // INICIALIZAR FORMULÁRIOS - CRÍTICO!
            setupForms();
            
            // Esconder loading após carregar tudo
            setTimeout(hideLoading, 1000);
        }).catch(error => {
            console.error('Erro ao carregar tranças:', error);
            hideLoading();
        });
    }).catch(error => {
        console.error('Erro ao carregar promoção:', error);
        hideLoading();
    });
    
    // Inicializar sistema COLAB-GB
    initColabGB();
    
    console.log('Página de agendamento inicializada com sucesso');
}

// Inicializar quando o DOM estiver carregado
if (document.getElementById('braids-container') || document.getElementById('colab-gb-section')) {
    document.addEventListener('DOMContentLoaded', initAgendarPage);
}

// =============================================
// FUNÇÕES DE LOADING - ADICIONAR NO agendar.js
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

/**
 * Formata valor para moeda brasileira (R$)
 */
function formatCurrencyBR(value) {
    if (value === null || value === undefined) return "R$ 0,00";

    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/**
 * Mostra uma notificação para o usuário
 */
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
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
        top: 100px;
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
    
    document.body.appendChild(notification);
    
    // Fechar notificação ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Adicionar estilos CSS para as animações se não existirem
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
        
        .skeleton-card {
            background: #fff;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .skeleton-image {
            width: 100%;
            height: 200px;
            background: #e5e7eb;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        
        .skeleton-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .skeleton-title {
            height: 20px;
            background: #e5e7eb;
            border-radius: 4px;
            width: 80%;
        }
        
        .skeleton-price {
            height: 16px;
            background: #e5e7eb;
            border-radius: 4px;
            width: 60%;
        }
        
        @keyframes pulse {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
            100% {
                opacity: 1;
            }
        }
        
        #loadingOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s ease;
        }
        
        #loadingOverlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #8b5cf6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}