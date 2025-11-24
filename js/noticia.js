// =============================================
// JAVASCRIPT ESPECÍFICO DA PÁGINA NOTICIA
// =============================================

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
                    <button class="reaction-btn like" onclick="handleReaction(this, 'like', ${news.id})">
                        👍 Legal
                    </button>
                    <button class="reaction-btn neutral" onclick="handleReaction(this, 'neutral', ${news.id})">
                        😊 Gostei
                    </button>
                    <button class="reaction-btn dislike" onclick="handleReaction(this, 'dislike', ${news.id})">
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

/**
 * Manipula as reações às notícias
 */
function handleReaction(button, type, newsId) {
    // Remover classe active de todos os botões do mesmo grupo
    const reactionButtons = button.parentElement.querySelectorAll('.reaction-btn');
    reactionButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adicionar classe active ao botão clicado
    button.classList.add('active');
    
    // Salvar reação no localStorage
    const reactions = JSON.parse(localStorage.getItem('news-reactions') || '{}');
    reactions[newsId] = type;
    localStorage.setItem('news-reactions', JSON.stringify(reactions));
    
    // Mostrar feedback
    showNotification(`Reação "${getReactionLabel(type)}" registrada!`, 'success');
    
    // Aqui você pode enviar a reação para o backend
    sendReactionToServer(newsId, type);
}

/**
 * Envia reação para o servidor
 */
function sendReactionToServer(newsId, reaction) {
    // Simular envio para API
    console.log(`Enviando reação: Notícia ${newsId} - ${reaction}`);
    
    // Em produção, substituir por:
    // fetch('/api/news/reaction', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ newsId, reaction })
    // });
}

/**
 * Retorna o label da reação
 */
function getReactionLabel(type) {
    const labels = {
        'like': 'Legal',
        'neutral': 'Gostei', 
        'dislike': 'Tanto Faz'
    };
    return labels[type] || type;
}

/**
 * Carrega reações salvas do localStorage
 */
function loadSavedReactions() {
    const reactions = JSON.parse(localStorage.getItem('news-reactions') || '{}');
    
    Object.keys(reactions).forEach(newsId => {
        const button = document.querySelector(`[onclick*="handleReaction(this, '${reactions[newsId]}', ${newsId})"]`);
        if (button) {
            button.classList.add('active');
        }
    });
}

/**
 * Configura o sistema de filtros de notícias
 */
function setupNewsFilters() {
    const filterButtons = document.querySelectorAll('.news-filter-btn');
    const searchInput = document.getElementById('news-search');
    
    if (filterButtons.length === 0 || !searchInput) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyNewsFilters();
        });
    });
    
    searchInput.addEventListener('input', applyNewsFilters);
}

/**
 * Aplica os filtros de notícias
 */
function applyNewsFilters() {
    const activeFilter = document.querySelector('.news-filter-btn.active');
    const searchInput = document.getElementById('news-search');
    
    if (!activeFilter || !searchInput) return;
    
    const filterType = activeFilter.getAttribute('data-filter');
    const searchTerm = searchInput.value.toLowerCase();
    
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        const newsId = card.getAttribute('data-news-id');
        const news = currentNewsList.find(n => n.id == newsId);
        
        if (!news) return;
        
        const titleMatch = news.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = news.description.toLowerCase().includes(searchTerm);
        const searchMatch = titleMatch || descriptionMatch;
        
        let filterMatch = true;
        
        switch(filterType) {
            case 'all':
                filterMatch = true;
                break;
            case 'featured':
                filterMatch = news.priority >= 4;
                break;
            case 'videos':
                filterMatch = news.video && isValidUrl(news.video);
                break;
            case 'images':
                filterMatch = news.image && isValidUrl(news.image);
                break;
        }
        
        if (filterMatch && searchMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Configura o sistema de compartilhamento
 */
function setupSharing() {
    const shareButtons = document.querySelectorAll('.share-news-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newsId = this.getAttribute('data-news-id');
            const news = currentNewsList.find(n => n.id == newsId);
            
            if (news) {
                shareNews(news);
            }
        });
    });
}

/**
 * Compartilha notícia
 */
function shareNews(news) {
    const shareText = `📰 ${news.title}

${news.description}

🔗 Confira esta notícia no site da Girosa Beauty!`;

    if (navigator.share) {
        navigator.share({
            title: news.title,
            text: shareText,
            url: window.location.href
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Notícia copiada para a área de transferência!', 'success');
        });
    } else {
        prompt('Copie o texto para compartilhar:', shareText);
    }
}

// =============================================
// INICIALIZAÇÃO DA PÁGINA NOTICIA
// =============================================

/**
 * Inicializa a página de notícias
 */
function initNoticiaPage() {
    console.log('Inicializando página de notícias...');
    
    // Carregar notícias
    loadNewsFromDB();
    
    // Configurar sistemas
    setupNewsModal();
    setupNewsFilters();
    setupSharing();
    
    // Carregar reações salvas
    setTimeout(() => {
        loadSavedReactions();
    }, 1000);
    
    console.log('Página de notícias inicializada com sucesso');
}

// Inicializar quando o DOM estiver carregado
if (document.getElementById('news-container') || document.querySelector('.news-grid')) {
    document.addEventListener('DOMContentLoaded', initNoticiaPage);
}

// =============================================
// FUNÇÕES AUXILIARES - NOTICIA
// =============================================

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
 * Mostra erro ao carregar notícias
 */
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

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
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
        top: 120px;
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
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Fechar notificação ao clicar no X
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Animação para as notícias
const newsStyle = document.createElement('style');
newsStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
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
`;
document.head.appendChild(newsStyle);