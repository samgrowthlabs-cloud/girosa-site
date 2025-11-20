// Dados das tranças - FÁCIL DE MODIFICAR
// Para adicionar mais tranças, basta adicionar um novo objeto ao array braidsData
const braidsData = [

    // FEMININO ------------------------------------------------------------------
    /* {
        id:,
        code: "FEM"
        title: ,
        description: ,
        price: ,
        image: ,
        category: "feminino"
    } */
    
    {
        id: 1,
        code: "FEM01",
        title: "Boho fulani braids",
        description: "Tranças estilo box braids, perfeitas para um visual moderno e duradouro.",
        price: "R$ 350,00",
        image: "../fotos/femino/boho fulani braids.jpg",
        category: "feminino"
    },
    {
        id: 2,
        code: "FEM02",
        title: "Box Braids curto",
        description: "Tranças tradicionais nagô, ideais para quem busca um visual clássico e elegante.",
        price: "R$ 350,00",
        image: "../fotos/femino/box braids curto.jpg",
        category: "feminino"
    },
    {
        id: 3,
        code: "FEM03",
        title: "Box Braid",
        description: "Tranças masculinas curtas, perfeitas para um visual discreto e estiloso.",
        price: "R$ 350,00",
        image: "../fotos/femino/box-braids-.jpg",
        category: "feminino"
    },
    {
        id: 4,
        code: "FEM04",
        title: "Box Braid longas",
        description: "Tranças com adornos especiais para um visual único e personalizado.",
        price: "R$ 350,00",
        image: "../fotos/femino/box-braids-longas.jpg",
        category: "feminino"
    },
    {
        id: 5,
        code: "FEM05",
        title: "Box braid",
        description: "Tranças masculinas longas para quem busca um visual marcante.",
        price: "R$ 350,00",
        image: "../fotos/femino/box-braids.jpg",
        category: "feminino"
    },
    {
        id: 6,
        code: "FEM06",
        title: "Box Braid Curto",
        description: "Tranças estilo crochet braids, uma técnica versátil e moderna.",
        price: "R$ 350,00",
        image: "../fotos/femino/Boxbraids curto.jpg",
        category: "feminino"
    },
    {
        id: 7,
        code: "FEM07",
        title: "Box Braid Longo",
        description: "Tranças masculinas longas para quem busca um visual marcante.",
        price: "R$ 350,00",
        image: "../fotos/femino/Box Braid Longas.jpg",
        category: "feminino"
    },

    // FIM FEMININO ---------------------------------------------------------------------------//



    // MASCULINO ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    /* {
        id: ,
        code: "MASC01",
        title: "",
        description: "",
        price: "R$ ",
        image: "",
        category: "masculino"
    } */
    {
        id: 7,
        code: "MASC01",
        title: "nagô Masculino",
        description: "Tranças masculinas longas para quem busca um visual marcante.",
        price: "R$ 200,00",
        image: "../fotos/masculino/nago.jpg",
        category: "masculino"
    },

    {
        id: 8,
        code: "MASC02",
        title: "nagô Masculino",
        description: "Tranças masculinas longas para quem busca um visual marcante.",
        price: "R$ 200,00",
        image: "../fotos/masculino/download (7).jpg",
        category: "masculino"
    },

    {
        id: 9,
        code: "MASC03",
        title: "Trança Masculino",
        description: "",
        price: "R$ 250,00",
        image: "../fotos/masculino/download (8).jpg",
        category: "masculino"
    },

    {
        id: 10,
        code: "MASC04",
        title: "Nagô Masculino",
        description: "",
        price: "R$ 250,00",
        image: "../fotos/masculino/download (10).jpg",
        category: "masculino"
    }

];

// Dados dos afiliados - FÁCIL DE MODIFICAR
// Para adicionar mais afiliados, basta adicionar um novo objeto ao array affiliatesData
const affiliatesData = [
    { name: "SGL", number: "GB0001", type: "TOP" },

];

// Sistema de Prioridade para Notícias - FÁCIL DE MODIFICAR
// Prioridade: 5 (mais alta) a 1 (mais baixa)
// As notícias com prioridade 5 aparecerão na página inicial
const newsData = [
    //Exemplo de uso
    /*{
        title: "Nova Localização",
        date: "15 de Novembro, 2023",
        content: "Estamos felizes em anunciar nossa nova unidade no centro da cidade. Venha nos visitar!",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        priority: 5, // Prioridade máxima - aparece na página inicial
        video: null // URL do vídeo (opcional)
    }*/,

];


// Sistema de Vídeos - FÁCIL DE MODIFICAR
// Adicione URLs de vídeos de até 20 segundos
// Pode ser qualquer tipo: depoimentos, reformas, novidades, etc.

// exemplo de uso
/*const videosData = [
    {
        title: "Depoimento de Cliente Satisfeito",
        url: "#", // Substitua pela URL do seu vídeo
        description: "Joana compartilha sua experiência incrível no Girosa Beauty",
        type: "depoimento",
        duration: "15s"
    },
    {
        title: "Reforma do Nosso Espaço",
        url: "#", // Substitua pela URL do seu vídeo
        description: "Conheça nosso salão reformado e as novas instalações",
        type: "reforma",
        duration: "18s"
    },

]; */
const videosData = [
   {
    title: "Video de samgrowthlabs",
    url: "https://player.cloudinary.com/embed/?cloud_name=dlk1ke395&public_id=samgrowthlabs_qqclbv&profile=cld-default",
    description: "",
    type: "passado",
    duration: "20s"
    },

];

// Sistema de Promoções - FÁCIL DE MODIFICAR
// Para ativar promoções, defina os valores entre 0 e 1 (ex: 0.1 = 10% de desconto)
// Se deixar como null, não haverá promoção para essa categoria
const promocao_all = null;      // Promoção para todos os tipos (ex: 0.1 para 10% off)
const promocao_mascu = null;    // Promoção apenas para masculino
const promocao_femini = null;   // Promoção apenas para feminino

// Exemplos de como usar:
// const promocao_all = 0.1;     // 10% de desconto para todos
// const promocao_mascu = 0.15;  // 15% de desconto apenas para masculino
// const promocao_femini = 0.2;  // 20% de desconto apenas para feminino

// Variáveis para controle de zoom e navegação
let currentBraidIndex = 0;
let currentZoom = 1;

// Variável global para armazenar o preço original da trança
let currentBraidOriginalPrice = '';
// Função para carregar notícias por prioridade
function loadNewsByPriority() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    // Ordenar notícias por prioridade (maior primeiro)
    const sortedNews = [...newsData].sort((a, b) => b.priority - a.priority);
    
    container.innerHTML = '';
    
    sortedNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // Adicionar badge de prioridade
        const priorityBadge = news.priority >= 4 ? `<div class="priority-badge priority-${news.priority}">Destaque</div>` : '';
        
        // Se tiver vídeo, mostrar player de vídeo
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

// Função para abrir o modal com os detalhes da trança
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
    
    // Armazenar o preço original (sem desconto do jumbo)
    currentBraidOriginalPrice = precoCalculado.comDesconto;
    
    if (precoCalculado.temDesconto) {
        modalPrice.innerHTML = `
            <span class="original-price">${braid.price}</span>
            <span class="discount-price">${precoCalculado.comDesconto}</span>
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

// Função para configurar os eventos do jumbo
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

// Função para mostrar o resumo de preços com desconto do jumbo
function showPriceSummary() {
    const priceSummary = document.getElementById('price-summary');
    const originalPriceElement = document.getElementById('summary-original-price');
    const finalPriceElement = document.getElementById('summary-final-price');
    
    if (!priceSummary || !originalPriceElement || !finalPriceElement) return;
    
    // Mostrar preço original
    originalPriceElement.textContent = currentBraidOriginalPrice;
    
    // Calcular preço final com desconto do jumbo
    const precoNumerico = parseFloat(currentBraidOriginalPrice.replace('R$ ', '').replace(',', '.'));
    const precoComDescontoJumbo = precoNumerico - 100;
    
    // Formatar preço final
    const precoFinalFormatado = `R$ ${precoComDescontoJumbo.toFixed(2).replace('.', ',')}`;
    finalPriceElement.textContent = precoFinalFormatado;
    
    // Mostrar resumo
    priceSummary.style.display = 'block';
}

// Função para esconder o resumo de preços
function hidePriceSummary() {
    const priceSummary = document.getElementById('price-summary');
    if (priceSummary) {
        priceSummary.style.display = 'none';
    }
}

// Função para resetar as opções do jumbo
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

// Função para calcular o preço final considerando o jumbo
function calcularPrecoFinalComJumbo(precoOriginal, jumboCliente) {
    if (!jumboCliente) {
        return precoOriginal;
    }
    
    const precoNumerico = parseFloat(precoOriginal.replace('R$ ', '').replace(',', '.'));
    const precoComDescontoJumbo = precoNumerico - 100;
    
    // Garantir que o preço não fique negativo
    const precoFinal = Math.max(precoComDescontoJumbo, 0);
    
    return `R$ ${precoFinal.toFixed(2).replace('.', ',')}`;
}

// Funções de zoom
function setupZoomControls() {
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const modalImg = document.getElementById('modal-braid-img');
    
    if (zoomInBtn && modalImg) {
        zoomInBtn.addEventListener('click', function() {
            currentZoom = Math.min(currentZoom + 0.25, 3); // Zoom máximo 3x
            modalImg.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomOutBtn && modalImg) {
        zoomOutBtn.addEventListener('click', function() {
            currentZoom = Math.max(currentZoom - 0.25, 0.5); // Zoom mínimo 0.5x
            modalImg.style.transform = `scale(${currentZoom})`;
        });
    }
    
    if (zoomResetBtn && modalImg) {
        zoomResetBtn.addEventListener('click', resetZoom);
    }
}

function resetZoom() {
    const modalImg = document.getElementById('modal-braid-img');
    currentZoom = 1;
    if (modalImg) {
        modalImg.style.transform = 'scale(1)';
    }
}

// Funções de navegação
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

function showPreviousBraid() {
    if (braidsData.length === 0) return;
    
    currentBraidIndex = (currentBraidIndex - 1 + braidsData.length) % braidsData.length;
    const braid = braidsData[currentBraidIndex];
    updateModalContent(braid);
}

function showNextBraid() {
    if (braidsData.length === 0) return;
    
    currentBraidIndex = (currentBraidIndex + 1) % braidsData.length;
    const braid = braidsData[currentBraidIndex];
    updateModalContent(braid);
}


function updateModalContent(braid) {
    const modalImg = document.getElementById('modal-braid-img');
    const modalTitle = document.getElementById('modal-braid-title');
    const modalDescription = document.getElementById('modal-braid-description');
    const modalPrice = document.getElementById('modal-braid-price');
    
    if (modalImg) modalImg.src = braid.image;
    if (modalImg) modalImg.alt = braid.title;
    if (modalTitle) modalTitle.textContent = braid.title;
    if (modalDescription) modalDescription.textContent = braid.description;
    
    // Resetar zoom ao mudar de imagem
    resetZoom();
    
    // Calcular preço com desconto
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    if (modalPrice) {
        if (precoCalculado.temDesconto) {
            modalPrice.innerHTML = `
                <span class="original-price">${braid.price}</span>
                <span class="discount-price">${precoCalculado.comDesconto}</span>
                <div class="discount-text">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
            `;
        } else {
            modalPrice.textContent = braid.price;
        }
    }
    
    // Atualizar formulário
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.setAttribute('data-braid-id', braid.id);
        bookingForm.setAttribute('data-braid-title', braid.title);
        bookingForm.setAttribute('data-braid-price', precoCalculado.comDesconto);
        bookingForm.setAttribute('data-braid-original-price', braid.price);
    }
}

// Função para carregar notícias em destaque na página inicial
function loadFeaturedNews() {
    const container = document.getElementById('featured-news-container');
    if (!container) return;
    
    // Filtrar notícias com prioridade 5 (as mais importantes)
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

// Função para carregar todos os vídeos
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

// Função para carregar vídeos em destaque (página inicial)
function loadFeaturedVideos() {
    const container = document.getElementById('featured-videos-container');
    if (!container) return;
    
    // Pegar apenas os primeiros 2 vídeos para destaque
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

// Função para calcular preço com desconto
function calcularPrecoComDesconto(precoOriginal, categoria) {
    // Converter preço string para número
    const precoNumerico = parseFloat(precoOriginal.replace('R$ ', '').replace(',', '.'));
    let desconto = 0;
    
    // Aplicar desconto conforme categoria e promoções ativas
    if (promocao_all !== null) {
        desconto = promocao_all;
    }
    
    if (categoria === 'masculino' && promocao_mascu !== null) {
        desconto = promocao_mascu;
    }
    
    if (categoria === 'feminino' && promocao_femini !== null) {
        desconto = promocao_femini;
    }
    
    // Calcular preço com desconto
    const precoComDesconto = precoNumerico * (1 - desconto);
    
    return {
        original: precoOriginal,
        comDesconto: `R$ ${precoComDesconto.toFixed(2).replace('.', ',')}`,
        desconto: desconto,
        temDesconto: desconto > 0
    };
}

// Função para verificar se há alguma promoção ativa
function haPromocaoAtiva() {
    return promocao_all !== null || promocao_mascu !== null || promocao_femini !== null;
}

// Função para carregar vídeos promocionais na página de notícias
function loadPromotionalVideosForNews() {
    const container = document.getElementById('promotional-videos-news');
    if (!container) return;
    
    container.innerHTML = '';
    
    promotionalVideos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'promo-video-card';
        
        videoCard.innerHTML = `
            <div class="promo-video">
                <video controls>
                    <source src="${video.url}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            <div class="promo-video-content">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        
        container.appendChild(videoCard);
    });
}

// Sistema COLAB-GB - Busca por Código
function initColabGB() {
    const searchBtn = document.getElementById('search-braid-btn');
    const codeInput = document.getElementById('braid-code-input');
    const resultsDiv = document.getElementById('search-results');
    const errorDiv = document.getElementById('error-message');
    
    // Carregar lista de códigos
    loadCodesList();
    
    // Carregar catálogo completo
    loadColabBraidsCatalog();
    
    if (searchBtn && codeInput) {
        // Buscar ao clicar no botão
        searchBtn.addEventListener('click', searchBraidByCode);
        
        // Buscar ao pressionar Enter
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBraidByCode();
            }
        });
    }
    
    // Compartilhar trança
    const shareBtn = document.getElementById('share-braid-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareBraidDetails);
    }
    
    // WhatsApp da trança
    const whatsappBtn = document.getElementById('whatsapp-braid-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendBraidViaWhatsApp);
    }
}

function loadCodesList() {
    const codesList = document.getElementById('codes-list');
    if (!codesList) return;
    
    // Agrupar códigos por categoria
    const femCodes = braidsData.filter(braid => braid.category === 'feminino');
    const masCodes = braidsData.filter(braid => braid.category === 'masculino');
    
    codesList.innerHTML = '';
    
    // Adicionar códigos femininos
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
    
    // Adicionar códigos masculinos
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
    
    // Buscar trança pelo código
    const foundBraid = braidsData.find(braid => braid.code === searchCode);
    
    if (foundBraid) {
        displayBraidResult(foundBraid);
        resultsDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        
        // Scroll para o resultado
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showError(`Trança com código "${searchCode}" não encontrada`);
        resultsDiv.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}

function displayBraidResult(braid) {
    // Elementos do resultado
    const imgElement = document.getElementById('result-braid-img');
    const titleElement = document.getElementById('result-braid-title');
    const codeElement = document.getElementById('result-braid-code');
    const categoryElement = document.getElementById('result-braid-category');
    const descriptionElement = document.getElementById('result-braid-description');
    const priceElement = document.getElementById('result-braid-price');
    const characteristicsElement = document.getElementById('result-braid-characteristics');
    
    // Calcular preço com desconto (se houver promoção)
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    // Preencher informações
    if (imgElement) imgElement.src = braid.image;
    if (imgElement) imgElement.alt = braid.title;
    if (titleElement) titleElement.textContent = braid.title;
    if (codeElement) codeElement.textContent = braid.code;
    
    // Categoria formatada
    if (categoryElement) {
        categoryElement.textContent = braid.category === 'feminino' ? 'Feminino' : 'Masculino';
    }
    
    if (descriptionElement) descriptionElement.textContent = braid.description;
    
    // Preço
    if (priceElement) {
        if (precoCalculado.temDesconto) {
            priceElement.innerHTML = `
                <span style="text-decoration: line-through; color: #999; margin-right: 10px;">${braid.price}</span>
                <span>${precoCalculado.comDesconto}</span>
                <div style="color: #22c55e; font-size: 1rem; margin-top: 5px;">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
            `;
        } else {
            priceElement.textContent = braid.price;
        }
    }
    
    // Características
    if (characteristicsElement && braid.characteristics) {
        characteristicsElement.innerHTML = '';
        braid.characteristics.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char;
            characteristicsElement.appendChild(li);
        });
    }
    
    // Calcular comissões
    calculateComissions(braid.price, precoCalculado);
    
    // Armazenar trança atual para compartilhamento
    window.currentBraidResult = braid;
    window.currentBraidPrice = precoCalculado.comDesconto;
}

function calculateComissions(originalPrice, precoCalculado) {
    // Extrair valor numérico do preço
    const priceValue = parseFloat(precoCalculado.comDesconto.replace('R$ ', '').replace(',', '.'));
    
    // Calcular comissões
    const comissionBAS = (priceValue * 0.10).toFixed(2);
    const comissionINT = (priceValue * 0.13).toFixed(2);
    const comissionTOP = (priceValue * 0.15).toFixed(2);
    
    // Atualizar elementos
    const basElement = document.getElementById('comission-bas');
    const intElement = document.getElementById('comission-int');
    const topElement = document.getElementById('comission-top');
    
    if (basElement) basElement.textContent = comissionBAS.replace('.', ',');
    if (intElement) intElement.textContent = comissionINT.replace('.', ',');
    if (topElement) topElement.textContent = comissionTOP.replace('.', ',');
}

function loadColabBraidsCatalog() {
    const gridElement = document.getElementById('braids-grid-colab');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    braidsData.forEach(braid => {
        const card = document.createElement('div');
        card.className = 'braid-card-colab';
        
        // Calcular preço com desconto
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
        
        // Ao clicar no card, buscar essa trança
        card.addEventListener('click', () => {
            document.getElementById('braid-code-input').value = braid.code;
            searchBraidByCode();
        });
        
        gridElement.appendChild(card);
    });
}

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
        // Compartilhamento nativo (dispositivos móveis)
        navigator.share({
            title: braid.title,
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        // Copiar para área de transferência
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Detalhes da trança copiados para a área de transferência!');
        });
    } else {
        // Fallback
        prompt('Copie os detalhes da trança:', shareText);
    }
}

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

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) return;
    
    const errorContent = errorDiv.querySelector('.error-content');
    if (errorContent) {
        const h3 = errorContent.querySelector('h3');
        if (h3) h3.textContent = message;
    }
    
    errorDiv.style.display = 'block';
    
    // Scroll para o erro
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Sistema de autenticação (DEVE vir primeiro)
    initAuthSystem();
    
    // Carregar tranças (apenas na página de agendamento)
    if (document.getElementById('braids-container')) {
        loadBraids();
        setupFilters();
        setupModal();
    }
    
    // Carregar afiliados (apenas na página de afiliados)
    if (document.getElementById('affiliates-list')) {
        loadAffiliates();
    }
    
    // Carregar notícias (apenas na página de notícias)
    if (document.getElementById('news-container')) {
        loadNewsByPriority();
    }
    
    // Carregar notícias em destaque (apenas na página inicial)
    if (document.getElementById('featured-news-container')) {
        loadFeaturedNews();
    }
    
    // Carregar vídeos em destaque (página inicial)
    if (document.getElementById('featured-videos-container')) {
        loadFeaturedVideos();
    }
    
    // Carregar todos os vídeos (página de notícias)
    if (document.getElementById('videos-container')) {
        loadVideos();
    }
    
    // Configurar formulários (se existirem na página)
    setupForms();
});

// Função para carregar as tranças na página de agendamento
function loadBraids() {
    const container = document.getElementById('braids-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Adicionar banner de promoção se houver promoção ativa
    if (haPromocaoAtiva()) {
        const promoBanner = document.createElement('div');
        promoBanner.className = 'promo-banner';
        promoBanner.innerHTML = `
            <div class="promo-content">
                <i class="fas fa-tag"></i>
                <span>PROMOÇÃO ATIVA!</span>
                ${promocao_all !== null ? `<strong>Todos os tipos: ${(promocao_all * 100)}% OFF</strong>` : ''}
                ${promocao_mascu !== null ? `<strong>Masculino: ${(promocao_mascu * 100)}% OFF</strong>` : ''}
                ${promocao_femini !== null ? `<strong>Feminino: ${(promocao_femini * 100)}% OFF</strong>` : ''}
            </div>
        `;
        container.parentNode.insertBefore(promoBanner, container);
    }
    
    braidsData.forEach(braid => {
        const braidCard = document.createElement('div');
        braidCard.className = `braid-card ${braid.category}`;
        braidCard.setAttribute('data-category', braid.category);
        braidCard.setAttribute('data-title', braid.title.toLowerCase());
        
        // Calcular preço com desconto
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
                        `<span class="original-price">${braid.price}</span>
                         <span class="discount-price">${precoCalculado.comDesconto}</span>` :
                        `<span>${braid.price}</span>`
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

// Função para carregar os afiliados na página de afiliados
function loadAffiliates() {
    const container = document.getElementById('affiliates-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    affiliatesData.forEach(affiliate => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${affiliate.name}</td>
            <td>${affiliate.number}</td>
            <td>${affiliate.type}</td>
        `;
        
        container.appendChild(row);
    });
}

// Função para carregar as notícias na página de notícias
function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    newsData.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}">
            </div>
            <div class="news-content">
                <div class="news-date">${news.date}</div>
                <h3>${news.title}</h3>
                <p>${news.content}</p>
            </div>
        `;
        
        container.appendChild(newsCard);
    });
}

// Função para configurar os filtros na página de agendamento
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchBox = document.querySelector('.search-box');
    
    if (filterButtons.length === 0 || !searchBox) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Aplicar filtros
            applyFilters();
        });
    });
    
    searchBox.addEventListener('input', applyFilters);
}

// Função para aplicar os filtros na página de agendamento
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

// Função para configurar o modal na página de agendamento
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
    
    // Configurar controles de zoom e navegação
    setupZoomControls();
    setupNavigationControls();
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            resetZoom();
        }
    });
}

// Função para abrir o modal com os detalhes da trança
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
    
    // Calcular preço com desconto para o modal
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    if (precoCalculado.temDesconto) {
        modalPrice.innerHTML = `
            <span class="original-price">${braid.price}</span>
            <span class="discount-price">${precoCalculado.comDesconto}</span>
            <div class="discount-text">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
        `;
    } else {
        modalPrice.textContent = braid.price;
    }
    
    modal.style.display = 'block';
    
    // Armazenar dados da trança selecionada no formulário - ATUALIZADO
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.setAttribute('data-braid-id', braid.id);
        bookingForm.setAttribute('data-braid-title', braid.title);
        bookingForm.setAttribute('data-braid-price', precoCalculado.comDesconto);
        bookingForm.setAttribute('data-braid-original-price', braid.price);
        bookingForm.setAttribute('data-braid-code', braid.code); // NOVO: código da trança
    }
}


// Função para configurar os formulários - ATUALIZADA COM JUMBO
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
            
            // Encontrar a trança selecionada
            const selectedBraid = braidsData.find(braid => braid.id == braidId);
            
            // Calcular preço final considerando o jumbo
            const precoFinal = calcularPrecoFinalComJumbo(braidPrice, jumboCliente);
            
            // Criar mensagem para WhatsApp COM INFORMAÇÃO DO JUMBO
            let message = `🟤 *GIROSA BEAUTY - SOLICITAÇÃO DE AGENDAMENTO* 🟤

👤 *DADOS DO CLIENTE*
├── Nome: ${name}
├── CPF: ${cpf}
└── Telefone: ${phone}

💇 *DETALHES DO SERVIÇO*
├── Código: ${braidCode}
├── Trança: ${braidTitle}
├── Preço original: ${braidPrice}`;

            // Adicionar informação do jumbo e preço final
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

            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Redirecionar para WhatsApp
            window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
            
            // Fechar modal
            const modal = document.getElementById('braid-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Limpar formulário
            bookingForm.reset();
            resetJumboOptions();
        });
    }
    
    // Formulário de afiliação (mantido igual)
    const affiliateForm = document.getElementById('affiliate-request-form');
    if (affiliateForm) {
        affiliateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('affiliate-name').value;
            const cpf = document.getElementById('affiliate-cpf').value;
            const suggestions = document.getElementById('affiliate-suggestions').value;
            
            // Criar mensagem para WhatsApp
            const message = `Olá! Gostaria de solicitar afiliação no programa GB.\n\nDados do solicitante:\nNome: ${name}\nCPF: ${cpf}\n\nSugestões para melhorar o fluxo de clientes:\n${suggestions}`;
            
            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Redirecionar para WhatsApp
            window.open(`https://wa.me/5544999180116?text=${encodedMessage}`, '_blank');
            
            // Limpar formulário
            affiliateForm.reset();
        });
    }
}


// Sistema de Autenticação SIMPLES e FUNCIONAL
const ACCESS_CODES = {
    primary: ["COLAB2024", "GIROSA123", "BEAUTY456"],
    affiliates: ["GB001", "GB002", "GB003", "GB004", "GB005"],
    master: "MASTER123"
};

function initAuthSystem() {
    if (!document.getElementById('login-modal')) {
        return;
    }
    
    // Verificar se já está autenticado
    if (localStorage.getItem('colab_gb_authenticated') === 'true') {
        grantAccess();
        return;
    }
    
    // Mostrar modal de login
    showLoginModal();
    
    // Configurar evento de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.display = 'flex';
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.style.display = 'none';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const accessCode = document.getElementById('access-code').value.trim();
    const affiliateCode = document.getElementById('affiliate-code').value.trim().toUpperCase();
    const errorDiv = document.getElementById('login-error');
    
    // Limpar erro anterior
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    
    // Validar código de acesso
    if (validateAccessCode(accessCode, affiliateCode)) {
        successfulLogin();
    } else {
        showError('Código de acesso incorreto');
    }
}

function validateAccessCode(accessCode, affiliateCode) {
    // Verificar código mestre
    if (accessCode === ACCESS_CODES.master) {
        return true;
    }
    
    // Verificar códigos primários
    if (ACCESS_CODES.primary.includes(accessCode)) {
        return true;
    }
    
    // Verificar códigos de afiliado
    if (ACCESS_CODES.affiliates.includes(accessCode)) {
        return true;
    }
    
    // Verificar combinação
    if (affiliateCode && ACCESS_CODES.affiliates.includes(affiliateCode)) {
        return true;
    }
    
    return false;
}

function successfulLogin() {
    // Marcar como autenticado
    localStorage.setItem('colab_gb_authenticated', 'true');
    
    // Conceder acesso
    grantAccess();
}

function grantAccess() {
    // Esconder modal de login
    hideLoginModal();
    
    // Mostrar conteúdo restrito
    const contentDiv = document.getElementById('colab-content');
    if (contentDiv) {
        contentDiv.style.display = 'block';
    }
    
    // Inicializar sistema COLAB-GB
    initColabGB();
    
    // Configurar botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    // Limpar autenticação
    localStorage.removeItem('colab_gb_authenticated');
    
    // Recarregar a página
    window.location.reload();
}

function showError(message) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        const errorText = document.getElementById('error-message-text');
        if (errorText) {
            errorText.textContent = message;
        }
        errorDiv.style.display = 'flex';
    }
}

// Sistema COLAB-GB (mantido da versão anterior)
function initColabGB() {
    const searchBtn = document.getElementById('search-braid-btn');
    const codeInput = document.getElementById('braid-code-input');
    
    // Carregar lista de códigos
    loadCodesList();
    
    // Carregar catálogo completo
    loadColabBraidsCatalog();
    
    if (searchBtn && codeInput) {
        searchBtn.addEventListener('click', searchBraidByCode);
        
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBraidByCode();
            }
        });
    }
    
    // Compartilhar trança
    const shareBtn = document.getElementById('share-braid-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareBraidDetails);
    }
    
    // WhatsApp da trança
    const whatsappBtn = document.getElementById('whatsapp-braid-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendBraidViaWhatsApp);
    }
}

function loadCodesList() {
    const codesList = document.getElementById('codes-list');
    if (!codesList) return;
    
    codesList.innerHTML = '';
    
    braidsData.forEach(braid => {
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

function searchBraidByCode() {
    const codeInput = document.getElementById('braid-code-input');
    const resultsDiv = document.getElementById('search-results');
    const errorDiv = document.getElementById('error-message');
    
    if (!codeInput || !resultsDiv || !errorDiv) return;
    
    const searchCode = codeInput.value.trim().toUpperCase();
    
    if (!searchCode) {
        showSearchError('Digite um código para buscar');
        return;
    }
    
    // Buscar trança pelo código
    const foundBraid = braidsData.find(braid => braid.code === searchCode);
    
    if (foundBraid) {
        displayBraidResult(foundBraid);
        resultsDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        
        // Scroll para o resultado
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showSearchError(`Trança com código "${searchCode}" não encontrada`);
        resultsDiv.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}

function displayBraidResult(braid) {
    // Elementos do resultado
    const imgElement = document.getElementById('result-braid-img');
    const titleElement = document.getElementById('result-braid-title');
    const codeElement = document.getElementById('result-braid-code');
    const categoryElement = document.getElementById('result-braid-category');
    const descriptionElement = document.getElementById('result-braid-description');
    const priceElement = document.getElementById('result-braid-price');
    const characteristicsElement = document.getElementById('result-braid-characteristics');
    
    // Calcular preço com desconto (se houver promoção)
    const precoCalculado = calcularPrecoComDesconto(braid.price, braid.category);
    
    // Preencher informações
    if (imgElement) imgElement.src = braid.image;
    if (imgElement) imgElement.alt = braid.title;
    if (titleElement) titleElement.textContent = braid.title;
    if (codeElement) codeElement.textContent = braid.code;
    
    // Categoria formatada
    if (categoryElement) {
        categoryElement.textContent = braid.category === 'feminino' ? 'Feminino' : 'Masculino';
    }
    
    if (descriptionElement) descriptionElement.textContent = braid.description;
    
    // Preço
    if (priceElement) {
        if (precoCalculado.temDesconto) {
            priceElement.innerHTML = `
                <span style="text-decoration: line-through; color: #999; margin-right: 10px;">${braid.price}</span>
                <span>${precoCalculado.comDesconto}</span>
                <div style="color: #22c55e; font-size: 1rem; margin-top: 5px;">${(precoCalculado.desconto * 100)}% DE DESCONTO</div>
            `;
        } else {
            priceElement.textContent = braid.price;
        }
    }
    
    // Características
    if (characteristicsElement && braid.characteristics) {
        characteristicsElement.innerHTML = '';
        braid.characteristics.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char;
            characteristicsElement.appendChild(li);
        });
    }
    
    // Calcular comissões
    calculateComissions(braid.price, precoCalculado);
    
    // Armazenar trança atual para compartilhamento
    window.currentBraidResult = braid;
    window.currentBraidPrice = precoCalculado.comDesconto;
}

function calculateComissions(originalPrice, precoCalculado) {
    // Extrair valor numérico do preço
    const priceValue = parseFloat(precoCalculado.comDesconto.replace('R$ ', '').replace(',', '.'));
    
    // Calcular comissões
    const comissionBAS = (priceValue * 0.10).toFixed(2);
    const comissionINT = (priceValue * 0.13).toFixed(2);
    const comissionTOP = (priceValue * 0.15).toFixed(2);
    
    // Atualizar elementos
    const basElement = document.getElementById('comission-bas');
    const intElement = document.getElementById('comission-int');
    const topElement = document.getElementById('comission-top');
    
    if (basElement) basElement.textContent = comissionBAS.replace('.', ',');
    if (intElement) intElement.textContent = comissionINT.replace('.', ',');
    if (topElement) topElement.textContent = comissionTOP.replace('.', ',');
}

function loadColabBraidsCatalog() {
    const gridElement = document.getElementById('braids-grid-colab');
    if (!gridElement) return;
    
    gridElement.innerHTML = '';
    
    braidsData.forEach(braid => {
        const card = document.createElement('div');
        card.className = 'braid-card-colab';
        
        // Calcular preço com desconto
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
        
        // Ao clicar no card, buscar essa trança
        card.addEventListener('click', () => {
            document.getElementById('braid-code-input').value = braid.code;
            searchBraidByCode();
        });
        
        gridElement.appendChild(card);
    });
}

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

function showSearchError(message) {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) return;
    
    const errorContent = errorDiv.querySelector('.error-content');
    if (errorContent) {
        const h3 = errorContent.querySelector('h3');
        if (h3) h3.textContent = message;
    }
    
    errorDiv.style.display = 'block';
    
    // Scroll para o erro
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

