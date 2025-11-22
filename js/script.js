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
// Variáveis globais
let currentNewsList = [];
let currentModalNews = null;
/**
 * Dados das notícias (fixas no código)
 * @type {Array}
 */
const newsData = [
    // Exemplo de estrutura:
    // {
    //     title: "Nova Localização",
    //     date: "15 de Novembro, 2023",
    //     content: "Estamos felizes em anunciar nossa nova unidade...",
    //     image: "https://exemplo.com/imagem.jpg",
    //     priority: 5,
    //     video: null
    // }
];

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
/**
 * Calcula o preço com desconto baseado na promoção atual e categoria - MELHORADA
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

// =============================================
// FUNÇÕES DE INTERFACE - MODAL E NAVEGAÇÃO
// =============================================

/**
 * Abre o modal com os detalhes da trança selecionada
 * @param {Object} braid - Objeto da trança selecionada
 */
/**
 * Abre o modal com os detalhes da trança selecionada - MELHORADA
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
    currentBraidOriginalPrice = precoCalculado.comDesconto;
    
    if (precoCalculado.temDesconto) {
        modalPrice.innerHTML = `
            <span class="original-price">${precoCalculado.original}</span>
            <span class="discount-price">${precoCalculado.comDesconto}</span>
            <div class="discount-text">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
        `;
    } else {
        // Usar o preço já formatado da função calcularPrecoComDesconto
        modalPrice.textContent = precoCalculado.comDesconto;
        currentBraidOriginalPrice = precoCalculado.comDesconto;
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
// FUNÇÕES DE INTERFACE - CARREGAMENTO DE CONTEÚDO
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
    
    braidsData.forEach(braid => {
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
            openBraidModal(braid);
        });
        
        container.appendChild(braidCard);
    });
}

/**
 * Carrega os afiliados na página de afiliados
 */
function loadAffiliates() {
    const container = document.getElementById('affiliates-list');
    if (!container) return;

    container.innerHTML = "";

    afiliateData.forEach(affiliate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${affiliate.name}</td>
            <td>${affiliate.number}</td>
            <td>${affiliate.type}</td>
        `;
        container.appendChild(row);
    });
}

/**
 * Carrega notícias do banco de dados
 */
async function loadNewsFromDB() {
    try {
        console.log('Carregando notícias...');
        
        const res = await fetch(
            "https://ryqlprvtsqzydvfkzuhu.supabase.co/functions/v1/clever-handler?action=get_news",
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
        console.log("Notícias carregadas:", data.news);

        // Armazenar e renderizar
        currentNewsList = data.news || [];
        renderNews(currentNewsList);

    } catch (err) {
        console.error("Erro ao carregar notícias:", err);
        showErrorNews();
    }
}

/**
 * Renderiza as notícias na página
 */
function renderNews(newsList) {
    const container = document.getElementById("news-container");
    if (!container) return;

    // Mostrar loading
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando notícias...</p>
        </div>
    `;

    setTimeout(() => {
        if (!newsList || newsList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>Nenhuma notícia disponível</h3>
                    <p>Volte em breve para novas atualizações.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        // Ordenar por prioridade e data
        const sortedNews = [...newsList].sort((a, b) => {
            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }
            return new Date(b.created_at) - new Date(a.created_at);
        });

        sortedNews.forEach(news => {
            const card = createNewsCard(news);
            container.appendChild(card);
        });

        // Configurar eventos de vídeo após renderizar
        setupVideoEvents();

    }, 500);
}

/**
 * Cria um card de notícia - COM BADGES CORRIGIDOS
 */
function createNewsCard(news) {
    const card = document.createElement("div");
    card.className = "news-card";
    card.setAttribute('data-news-id', news.id);

    // Determinar tipo de mídia
    const hasVideo = news.video && isValidUrl(news.video);
    const hasImage = news.image && isValidUrl(news.image);
    const mediaType = hasVideo ? 'video' : hasImage ? 'image' : 'none';

    card.innerHTML = `
        <div class="news-media" data-news-id="${news.id}">
            <!-- Badges no canto superior direito - CORRIGIDO -->
            <div class="news-badges">
                ${mediaType !== 'none' ? `
                    <div class="media-type-badge">
                        ${mediaType === 'video' ? '🎥 Vídeo' : '🖼️ Imagem'}
                    </div>
                ` : ''}
                
                ${news.priority >= 4 ? `
                    <div class="priority-badge">
                        ⭐ Destaque
                    </div>
                ` : ''}
            </div>
            
            ${hasVideo ? `
                <video muted loop playsinline>
                    <source src="${news.video}" type="video/mp4">
                </video>
                <div class="video-overlay">
                    <div class="play-icon">▶</div>
                </div>
            ` : hasImage ? `
                <img src="${news.image}" alt="${escapeHtml(news.title)}" loading="lazy">
            ` : `
                <div style="background: #f8f9fa; height: 100%; display: flex; align-items: center; justify-content: center; color: #666;">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">📰</div>
                        <div>Sem mídia</div>
                    </div>
                </div>
            `}
        </div>

        <div class="news-content">
            <div class="news-date">
                ${formatNewsDate(news.created_at)}
            </div>
            
            <h3>${escapeHtml(news.title)}</h3>
            <p>${escapeHtml(news.description || '')}</p>

            <div class="news-footer">
                <div class="reactions">
                    <button class="reaction-btn like" onclick="handleReaction(this, 'like')">
                        👍 Legal
                    </button>
                    <button class="reaction-btn neutral" onclick="handleReaction(this, 'neutral')">
                        😊 Gostei
                    </button>
                    <button class="reaction-btn dislike" onclick="handleReaction(this, 'dislike')">
                        ❌ Tanto Faz
                    </button>
                </div>
            </div>
        </div>
    `;

    // Tornar card clicável
    card.addEventListener('click', (e) => {
        // Não abrir modal se clicar nos botões de reação ou nos badges
        if (!e.target.closest('.reaction-btn') && !e.target.closest('.news-badges')) {
            openNewsModal(news);
        }
    });

    return card;
}

/**
 * Configura eventos para vídeos - CORRIGIDO
 */
function setupVideoEvents() {
    // Event delegation para áreas de mídia
    document.addEventListener('click', function(e) {
        const mediaArea = e.target.closest('.news-media');
        if (mediaArea) {
            e.preventDefault();
            e.stopPropagation();
            
            const newsId = mediaArea.getAttribute('data-news-id');
            const news = currentNewsList.find(n => n.id == newsId);
            
            if (news) {
                openNewsModal(news);
            }
        }
    });

    // Eventos específicos para overlays de vídeo
    const videoOverlays = document.querySelectorAll('.video-overlay');
    videoOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const mediaArea = this.closest('.news-media');
            const newsId = mediaArea.getAttribute('data-news-id');
            const news = currentNewsList.find(n => n.id == newsId);
            
            if (news) {
                openNewsModal(news);
            }
        });
    });
}

/**
 * Abre o modal da notícia - CORRIGIDO PARA VÍDEOS
 */
function openNewsModal(news) {
    const modal = document.getElementById('news-modal');
    if (!modal) {
        console.error('Modal não encontrado!');
        return;
    }

    currentModalNews = news;

    // Preencher dados do modal
    const modalTitle = modal.querySelector('.modal-header h2');
    const modalDate = modal.querySelector('.modal-date');
    const modalMedia = modal.querySelector('.modal-media');
    const modalDescription = modal.querySelector('.modal-description');

    if (modalTitle) modalTitle.textContent = news.title;
    if (modalDate) modalDate.textContent = formatNewsDate(news.created_at);
    if (modalDescription) modalDescription.textContent = news.description || '';

    // Configurar mídia - CORRIGIDO PARA CENTRALIZAR
    const hasVideo = news.video && isValidUrl(news.video);
    const hasImage = news.image && isValidUrl(news.image);

    if (hasVideo) {
        modalMedia.innerHTML = `
            <video controls autoplay playsinline style="width: 100%; max-height: 60vh; object-fit: contain;">
                <source src="${news.video}" type="video/mp4">
                Seu navegador não suporta o vídeo.
            </video>
        `;
    } else if (hasImage) {
        modalMedia.innerHTML = `
            <img src="${news.image}" alt="${news.title}" style="max-width: 100%; max-height: 60vh; object-fit: contain;">
        `;
    } else {
        modalMedia.innerHTML = `
            <div style="background: #f8f9fa; height: 200px; display: flex; align-items: center; justify-content: center; color: #666;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📰</div>
                    <div>Sem mídia para exibir</div>
                </div>
            </div>
        `;
    }

    // Mostrar modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    console.log('Modal aberto com sucesso para:', news.title);
}

/**
 * Fecha o modal
 */
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
        
        // Parar vídeos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        currentModalNews = null;
        
        console.log('Modal fechado com sucesso!');
    }
}

/**
 * Configura os eventos do modal
 */
function setupNewsModal() {
    const modal = document.getElementById('news-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    
    console.log('Configurando modal...');
    
    // Evento do botão fechar
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clicou no X para fechar');
            closeNewsModal();
        });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Clicou fora do modal para fechar');
                closeNewsModal();
            }
        });
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            console.log('Pressionou ESC para fechar');
            closeNewsModal();
        }
    });

    // Prevenir que eventos se propaguem para o conteúdo do modal
    const modalContent = modal?.querySelector('.news-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Funções auxiliares
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatNewsDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data inválida';
    }
}

function showErrorNews() {
    const container = document.getElementById("news-container");
    if (!container) return;

    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">📰</div>
            <h3>Erro ao carregar notícias</h3>
            <p>Não foi possível carregar as notícias no momento.</p>
            <button onclick="loadNewsFromDB()" class="retry-btn">
                🔄 Tentar Novamente
            </button>
        </div>
    `;
}



// =============================================
// FUNÇÕES DE INTERFACE - FILTROS E FORMULÁRIOS
// =============================================

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

/**
 * Configura os formulários da aplicação
 */
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
                        `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-right: 8px;">${braid.price}</span>
                         <span>${precoCalculado.comDesconto}</span>` :
                        braid.price
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
            alert('Detalhes da trança copiados para a área de transferência!');
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
// INICIALIZAÇÃO DA APLICAÇÃO
// =============================================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    
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

    // Carregar tranças (página de agendamento)
    if (document.getElementById('braids-container')) {
        // Mostrar loading inicial
        showLoading();
        
        loadPromotionFromDB().then(() => {
            loadBraidsFromDB().then(() => {
                loadBraids();
                setupFilters();
                setupModal();
                
                // Esconder loading após carregar tudo
                setTimeout(hideLoading, 1000); // Delay para melhor experiência
            }).catch(error => {
                console.error('Erro ao carregar tranças:', error);
                hideLoading();
            });
        }).catch(error => {
            console.error('Erro ao carregar promoção:', error);
            hideLoading();
        });
    }

    // Carregar afiliados (página de afiliados)
    if (document.getElementById('affiliates-list')) {
        loadAfiliatesFromDB().then(() => {
            loadAffiliates();
        });
    }

    setupNewsModal();

    if (document.getElementById('news-container')) {
        loadNewsFromDB();
    }
    
    // Carregar notícias em destaque (página inicial)
    if (document.getElementById('featured-news-container')) {
        loadFeaturedNews();
    }
    
    // Carregar vídeos em destaque (página inicial)
    if (document.getElementById('featured-videos-container')) {
        loadVideosFromDB().then(() => {
            loadFeaturedVideos();
        });
    }
    
    // Carregar todos os vídeos (página de notícias)
    if (document.getElementById('videos-container')) {
        loadVideos();
    }
    
    // Configurar formulários
    setupForms();
});

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


