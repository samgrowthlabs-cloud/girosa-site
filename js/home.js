// =============================================
// JAVASCRIPT ESPECÍFICO DA PÁGINA HOME
// =============================================

/**
 * Carrega notícias em destaque na página inicial
 */
async function loadFeaturedNews() {
    try {
        const container = document.getElementById('featured-news-container');
        if (!container) return;

        // Mostrar loading
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Carregando notícias em destaque...</p>
            </div>
        `;

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
        const newsList = data.news || [];

        // Filtrar notícias com prioridade alta (4 ou 5) e limitar a 3
        const featuredNews = newsList
            .filter(news => news.priority >= 4)
            .slice(0, 3);

        renderFeaturedNews(featuredNews);

    } catch (err) {
        console.error("Erro ao carregar notícias em destaque:", err);
        showErrorFeaturedNews();
    }
}

/**
 * Renderiza as notícias em destaque na home
 */
function renderFeaturedNews(newsList) {
    const container = document.getElementById('featured-news-container');
    if (!container) return;

    if (!newsList || newsList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>Nenhuma notícia em destaque</h3>
                <p>Volte em breve para novas atualizações.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    newsList.forEach(news => {
        const newsCard = createFeaturedNewsCard(news);
        container.appendChild(newsCard);
    });
}

/**
 * Cria um card de notícia em destaque para a home
 */
function createFeaturedNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'featured-news-card';
    card.setAttribute('data-news-id', news.id);

    const hasVideo = news.video && isValidUrl(news.video);
    const hasImage = news.image && isValidUrl(news.image);

    card.innerHTML = `
        ${hasVideo ? `
            <div class="featured-news-video">
                <video muted loop playsinline>
                    <source src="${news.video}" type="video/mp4">
                </video>
            </div>
        ` : hasImage ? `
            <div class="featured-news-image">
                <img src="${news.image}" alt="${escapeHtml(news.title)}" loading="lazy">
            </div>
        ` : `
            <div class="featured-news-image" style="background: linear-gradient(45deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white;">
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📰</div>
                    <h3 style="margin: 0;">${escapeHtml(news.title)}</h3>
                </div>
            </div>
        `}
        
        <div class="featured-news-content">
            <div class="featured-news-date">
                ${formatNewsDate(news.created_at)}
            </div>
            <h3>${escapeHtml(news.title)}</h3>
            <p>${escapeHtml(truncateText(news.description || '', 150))}</p>
            <button class="btn btn-outline" onclick="openNewsModalFromHome(${news.id})">
                Ler Mais
            </button>
        </div>
    `;

    return card;
}

/**
 * Abre o modal de notícia a partir da home
 */
function openNewsModalFromHome(newsId) {
    const news = currentNewsList.find(n => n.id == newsId);
    if (news) {
        openNewsModal(news);
    }
}

/**
 * Carrega vídeos em destaque na página inicial
 */
function loadFeaturedVideos() {
    const container = document.getElementById('featured-videos-container');
    if (!container) return;

    // Filtrar vídeos marcados como featured ou com alta prioridade
    const featuredVideos = videosData
        .filter(video => video.featured || video.priority >= 4)
        .slice(0, 4); // Limitar a 4 vídeos

    renderFeaturedVideos(featuredVideos);
}

/**
 * Renderiza os vídeos em destaque
 */
function renderFeaturedVideos(videos) {
    const container = document.getElementById('featured-videos-container');
    if (!container) return;

    if (!videos || videos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎥</div>
                <h3>Nenhum vídeo em destaque</h3>
                <p>Volte em breve para novos vídeos.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    videos.forEach(video => {
        const videoCard = createFeaturedVideoCard(video);
        container.appendChild(videoCard);
    });
}

/**
 * Cria um card de vídeo em destaque
 */
function createFeaturedVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'featured-video-card';
    
    card.innerHTML = `
        <div class="featured-video-wrapper">
            <video muted loop playsinline>
                <source src="${video.url}" type="video/mp4">
            </video>
            <div class="video-badge">Destaque</div>
            <div class="video-duration">${formatVideoDuration(video.duration)}</div>
        </div>
        <div class="featured-video-content">
            <h3>${escapeHtml(video.title)}</h3>
            <p>${escapeHtml(truncateText(video.description || '', 100))}</p>
            <div class="video-stats">
                <span>👁️ ${formatNumber(video.views || 0)} visualizações</span>
                <span>📅 ${formatNewsDate(video.created_at)}</span>
            </div>
        </div>
    `;

    // Adicionar evento de clique para reproduzir vídeo
    card.addEventListener('click', function() {
        const videoElement = this.querySelector('video');
        if (videoElement.paused) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    });

    return card;
}

/**
 * Mostra erro ao carregar notícias em destaque
 */
function showErrorFeaturedNews() {
    const container = document.getElementById('featured-news-container');
    if (!container) return;

    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">📰</div>
            <h3>Erro ao carregar notícias em destaque</h3>
            <p>Não foi possível carregar as notícias no momento.</p>
            <button onclick="loadFeaturedNews()" class="retry-btn">
                🔄 Tentar Novamente
            </button>
        </div>
    `;
}

/**
 * Carrega estatísticas da empresa
 */
function loadCompanyStats() {
    // Estatísticas fictícias - pode ser substituído por dados reais da API
    const stats = [
        { value: '500+', label: 'Clientes Satisfeitos' },
        { value: '3+', label: 'Anos de Experiência' },
        { value: '50+', label: 'Tipos de Tranças' },
        { value: '100%', label: 'Qualidade Garantida' }
    ];

    const container = document.getElementById('company-stats');
    if (!container) return;

    container.innerHTML = stats.map(stat => `
        <div class="stat-item">
            <span class="stat-number">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');
}

/**
 * Inicializa o carousel de depoimentos
 */
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    if (!carousel) return;

    const testimonials = [
        {
            name: "Maria Silva",
            text: "Excelente trabalho! As tranças ficaram perfeitas e duraram semanas. Super recomendo!",
            rating: 5
        },
        {
            name: "Joana Santos",
            text: "Profissionais muito qualificados e atenciosos. Ambiente limpo e organizado.",
            rating: 5
        },
        {
            name: "Ana Costa",
            text: "Melhor lugar para fazer tranças na cidade. Preços justos e qualidade excelente!",
            rating: 5
        }
    ];

    carousel.innerHTML = testimonials.map((testimonial, index) => `
        <div class="testimonial-item ${index === 0 ? 'active' : ''}">
            <div class="testimonial-text">
                <p>"${testimonial.text}"</p>
            </div>
            <div class="testimonial-author">
                <div class="stars">
                    ${'⭐'.repeat(testimonial.rating)}
                </div>
                <span class="author-name">- ${testimonial.name}</span>
            </div>
        </div>
    `).join('');

    // Auto-rotate carousel
    let currentTestimonial = 0;
    setInterval(() => {
        const items = carousel.querySelectorAll('.testimonial-item');
        items[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % items.length;
        items[currentTestimonial].classList.add('active');
    }, 5000);
}

/**
 * Configura os eventos de hover nos serviços
 */
function setupServicesHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Inicializa a animação de contagem dos números
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 100;
        const duration = 2000; // 2 segundos
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, duration / 100);
    });
}

/**
 * Configura o botão de call-to-action principal
 */
function setupCTAActions() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'agendar':
                    window.location.href = 'agendar.html';
                    break;
                case 'whatsapp':
                    window.open('https://wa.me/5544999180116', '_blank');
                    break;
                case 'servicos':
                    // Scroll para seção de serviços
                    document.getElementById('services').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                    break;
            }
        });
    });
}

/**
 * Inicializa o sistema de newsletter
 */
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value.trim();
        const submitButton = this.querySelector('button[type="submit"]');
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }

        setButtonLoading(submitButton, true, 'Inscrevendo...');
        
        // Simular envio para API
        setTimeout(() => {
            showNotification('Inscrição realizada com sucesso! Obrigado.', 'success');
            newsletterForm.reset();
            setButtonLoading(submitButton, false, 'Inscrever');
        }, 1500);
    });
}

// =============================================
// FUNÇÕES AUXILIARES - HOME
// =============================================

/**
 * Trunca texto para um determinado comprimento
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Formata número com separadores de milhar
 */
function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Formata duração do vídeo (segundos para MM:SS)
 */
function formatVideoDuration(seconds) {
    if (!seconds) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Valida se uma string é uma URL válida
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Formata data das notícias
 */
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

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =============================================
// INICIALIZAÇÃO DA PÁGINA HOME
// =============================================

/**
 * Inicializa a página home
 */
function initHomePage() {
    console.log('Inicializando página home...');
    
    // Carregar dados iniciais
    loadPromotionFromDB().then(() => {
        console.log('Promoção carregada para home');
    });
    
    // Carregar notícias em destaque
    loadNewsFromDB().then(() => {
        loadFeaturedNews();
    });
    
    // Carregar vídeos em destaque
    loadVideosFromDB().then(() => {
        loadFeaturedVideos();
    });
    
    // Configurar componentes da home
    loadCompanyStats();
    initTestimonialsCarousel();
    setupServicesHover();
    setupCTAActions();
    initNewsletter();
    
    // Iniciar animações após um delay
    setTimeout(() => {
        initCounterAnimation();
    }, 1000);
    
    // Configurar modal de notícias
    setupNewsModal();
    
    console.log('Página home inicializada com sucesso');
}

// Inicializar quando o DOM estiver carregado
if (document.getElementById('featured-news-container') || 
    document.getElementById('featured-videos-container') ||
    document.querySelector('.hero')) {
    document.addEventListener('DOMContentLoaded', initHomePage);
}

// =============================================
// FUNÇÕES GLOBAIS PARA A HOME
// =============================================

/**
 * Função global para abrir modal de notícia
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

    // Configurar mídia
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
 * Fecha o modal de notícias
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
 * Configura os eventos do modal de notícias
 */
function setupNewsModal() {
    const modal = document.getElementById('news-modal');
    const closeBtn = modal?.querySelector('.close-modal');
    
    console.log('Configurando modal de notícias...');
    
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

    } catch (err) {
        console.error("Erro ao carregar notícias:", err);
    }
}