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
function calcularPrecoComDesconto(precoOriginal, categoria) {
    const preco = typeof precoOriginal === "number"
        ? precoOriginal
        : parseFloat(String(precoOriginal).replace("R$", "").replace(",", "."));

    if (!window.currentPromotion || !window.currentPromotion.ativo) {
        return {
            original: formatCurrencyBR(preco),
            comDesconto: formatCurrencyBR(preco),
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

    const precoFinal = preco - preco * desconto;

    return {
        original: formatCurrencyBR(preco),
        comDesconto: formatCurrencyBR(precoFinal),
        desconto,
        temDesconto: desconto > 0
    };
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
    let precoString = String(precoOriginal);
    precoString = precoString.replace(/[^\d,.-]/g, "");
    precoString = precoString.replace(",", ".");

    const precoNumerico = parseFloat(precoString);

    if (isNaN(precoNumerico)) {
        return formatCurrencyBR(precoOriginal);
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
    
    // Armazenar o preço original
    currentBraidOriginalPrice = precoCalculado.comDesconto;
    
    if (precoCalculado.temDesconto) {
        modalPrice.innerHTML = `
            <span class="original-price">${(precoCalculado.original)}</span>
            <span class="discount-price">${(precoCalculado.comDesconto)}</span>
            <div class="discount-text">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
        `;
    } else {
        modalPrice.textContent = braid.price;
        currentBraidOriginalPrice = braid.price;
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
    
    originalPriceElement.textContent = currentBraidOriginalPrice;
    
    const precoNumerico = parseFloat(currentBraidOriginalPrice.replace('R$ ', '').replace(',', '.'));
    const precoComDescontoJumbo = precoNumerico - 100;
    
    const precoFinalFormatado = `R$ ${precoComDescontoJumbo.toFixed(2).replace('.', ',')}`;
    finalPriceElement.textContent = precoFinalFormatado;
    
    priceSummary.style.display = 'block';
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
 * Carrega notícias ordenadas por prioridade
 */
function loadNewsByPriority() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    const sortedNews = [...newsData].sort((a, b) => b.priority - a.priority);
    container.innerHTML = '';
    
    sortedNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        const priorityBadge = news.priority >= 4 ? `<div class="priority-badge priority-${news.priority}">Destaque</div>` : '';
        
        const mediaContent = news.video 
            ? `<div class="news-video">
                  <div class="video-badge">VÍDEO</div>
                  <video controls>
                      <source src="${news.video}" type="video/mp4">
                      Seu navegador não suporta o elemento de vídeo.
                  </video>
              </div>`
            : `<div class="news-image">
                  <img src="${news.image}" alt="${news.title}">
              </div>`;
        
        newsCard.innerHTML = `
            ${priorityBadge}
            ${mediaContent}
            <div class="news-content">
                <div class="news-date">${news.date}</div>
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <div class="news-priority">Prioridade: ${news.priority}/5</div>
            </div>
        `;
        
        container.appendChild(newsCard);
    });
}

/**
 * Carrega notícias em destaque na página inicial
 */
function loadFeaturedNews() {
    const container = document.getElementById('featured-news-container');
    if (!container) return;
    
    const featuredNews = newsData.filter(news => news.priority === 5);
    container.innerHTML = '';
    
    if (featuredNews.length === 0) return;
    
    featuredNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'featured-news-card';
        
        const mediaContent = news.video 
            ? `<div class="featured-news-video">
                  <div class="video-badge">VÍDEO</div>
                  <video controls>
                      <source src="${news.video}" type="video/mp4">
                      Seu navegador não suporta o elemento de vídeo.
                  </video>
              </div>`
            : `<div class="featured-news-image">
                  <img src="${news.image}" alt="${news.title}">
              </div>`;
        
        newsCard.innerHTML = `
            ${mediaContent}
            <div class="featured-news-content">
                <div class="featured-news-date">${news.date}</div>
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <a href="noticia.html" class="btn btn-outline">Ver Todas as Notícias</a>
            </div>
        `;
        
        container.appendChild(newsCard);
    });
}

/**
 * Carrega todos os vídeos
 */
function loadVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    videosData.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        
        videoCard.innerHTML = `
            <div class="video-wrapper">
                <div class="video-badge">${video.type.toUpperCase()}</div>
                <div class="video-duration">${video.duration}</div>
                <video controls>
                    <source src="${video.url}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            <div class="video-content">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        
        container.appendChild(videoCard);
    });
}

/**
 * Carrega vídeos em destaque na página inicial
 */
function loadFeaturedVideos() {
    const container = document.getElementById('featured-videos-container');
    if (!container) return;
    
    const featuredVideos = videosData.slice(0, 2);
    container.innerHTML = '';
    
    featuredVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'featured-video-card';
        
        videoCard.innerHTML = `
            <div class="featured-video-wrapper">
                <div class="video-badge">${video.type.toUpperCase()}</div>
                <div class="video-duration">${video.duration}</div>
                <video controls>
                    <source src="${video.url}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            <div class="featured-video-content">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        
        container.appendChild(videoCard);
    });
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
function setupForms() {
    // Formulário de agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('client-name').value;
            const cpf = document.getElementById('client-cpf').value;
            const phone = document.getElementById('client-phone').value;
            const jumboCliente = document.getElementById('jumbo-cliente').checked;
            const braidId = this.getAttribute('data-braid-id');
            const braidTitle = this.getAttribute('data-braid-title');
            const braidPrice = this.getAttribute('data-braid-price');
            const braidCode = this.getAttribute('data-braid-code');
            
            const selectedBraid = braidsData.find(braid => braid.id == braidId);
            const precoFinal = calcularPrecoFinalComJumbo(braidPrice, jumboCliente);
            
            let message = `🟤 *GIROSA BEAUTY - SOLICITAÇÃO DE AGENDAMENTO* 🟤

            👤 *DADOS DO CLIENTE*
            ├── Nome: ${name}
            ├── CPF: ${cpf}
            └── Telefone: ${phone}

            💇 *DETALHES DO SERVIÇO*
            ├── Código: ${braidCode}
            ├── Trança: ${braidTitle}
            ├── Preço original: ${braidPrice}`;

            if (jumboCliente) {
                message += `
            ├── Jumbo: Cliente (DESCONTO DE R$ 100,00)
            └── *VALOR FINAL: ${precoFinal}*`;
            } else {
                message += `
            ├── Jumbo: Empresa
            └── *VALOR FINAL: ${precoFinal}*`;
            }

            message += `
            
            📋 *INFORMAÇÕES ADICIONAIS*
            ${selectedBraid.description}

            📅 *PRÓXIMOS PASSOS*
            _1. Entrar em contato com o cliente_
            _2. Confirmar data e horário disponíveis_
            _3. Enviar confirmação por WhatsApp_

🔗 _Solicitação via Site Girosa Beauty_`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
            
            const modal = document.getElementById('braid-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            bookingForm.reset();
            resetJumboOptions();
        });
    }
    
    // Formulário de afiliação
    const affiliateForm = document.getElementById('affiliate-request-form');
    if (affiliateForm) {
        affiliateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('affiliate-name').value;
            const cpf = document.getElementById('affiliate-cpf').value;
            const suggestions = document.getElementById('affiliate-suggestions').value;
            
            const message = `Olá! Gostaria de solicitar afiliação no programa GB.\n\nDados do solicitante:\nNome: ${name}\nCPF: ${cpf}\n\nSugestões para melhorar o fluxo de clientes:\n${suggestions}`;
            const encodedMessage = encodeURIComponent(message);
            
            window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
            affiliateForm.reset();
        });
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
        });
    }

    // Carregar tranças (página de agendamento)
    if (document.getElementById('braids-container')) {
        loadPromotionFromDB().then(() => {
            loadBraidsFromDB().then(() => {
                loadBraids();
                setupFilters();
                setupModal();
            });
        });
    }

    // Carregar afiliados (página de afiliados)
    if (document.getElementById('affiliates-list')) {
        loadAfiliatesFromDB().then(() => {
            loadAffiliates();
        });
    }

    // Carregar notícias (página de notícias)
    if (document.getElementById('news-container')) {
        loadNewsByPriority();
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