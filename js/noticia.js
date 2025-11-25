// =============================================
// VARIÁVEIS GLOBAIS - NOTICIA
// =============================================

/**
 * Dados das notícias carregadas do banco de dados
 * @type {Array}
 */
let currentNewsList = [];

/**
 * Notícia atualmente aberta no modal
 * @type {Object|null}
 */
let currentModalNews = null;

// =============================================
// FUNÇÕES PRINCIPAIS - NOTICIA
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
        
        // VERIFICAR PARÂMETROS DA URL APÓS CARREGAR NOTÍCIAS
        checkUrlParams();

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
    if (!container) {
        console.error('Container de notícias não encontrado!');
        return;
    }

    console.log('Renderizando notícias:', newsList);

    // Mostrar loading
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Carregando notícias...</p>
        </div>
    `;

    setTimeout(() => {
        if (!newsList || newsList.length === 0) {
            console.log('Nenhuma notícia para renderizar');
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

        console.log('Notícias ordenadas:', sortedNews);

        sortedNews.forEach(news => {
            const card = createNewsCard(news);
            container.appendChild(card);
        });

        // Configurar eventos de vídeo após renderizar
        setupVideoEvents();

    }, 500);
}

/**
 * Cria um card de notícia
 */
function createNewsCard(news) {
    const card = document.createElement("div");
    card.className = "news-card";
    card.setAttribute('data-news-id', news.id);
    card.id = `news-card-${news.id}`;

    // Determinar tipo de mídia
    const hasVideo = news.video && isValidUrl(news.video);
    const hasImage = news.image && isValidUrl(news.image);
    const mediaType = hasVideo ? 'video' : hasImage ? 'image' : 'none';

    console.log('Criando card para:', news.title, 'Tipo mídia:', mediaType);

    card.innerHTML = `
        <div class="news-media" data-news-id="${news.id}">
            <!-- Badges no canto superior direito -->
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
                <video muted loop playsinline controls controlsList="nodownload" oncontextmenu="return false;">
                    <source src="${news.video}" type="video/mp4">
                </video>
                <div class="video-overlay">
                    <div class="play-icon">▶</div>
                </div>
            ` : hasImage ? `
                <img src="${news.image}" alt="${escapeHtml(news.title)}" loading="lazy">
            ` : `
                <div class="no-media-placeholder">
                    <div class="placeholder-content">
                        <div class="placeholder-icon">📰</div>
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

            <!-- RODAPÉ SEM BOTÕES DE REAÇÃO -->
            <div class="news-footer">
                <!-- Espaço vazio ou pode adicionar outras informações se necessário -->
            </div>
        </div>
    `;

    // Tornar card clicável
    card.addEventListener('click', (e) => {
        // Não abrir modal se clicar nos badges
        if (!e.target.closest('.news-badges')) {
            console.log('Abrindo modal para:', news.title);
            openNewsModal(news);
        }
    });

    return card;
}

/**
 * Configura eventos para vídeos
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
                console.log('Abrindo modal via clique na mídia:', news.title);
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
                console.log('Abrindo modal via overlay de vídeo:', news.title);
                openNewsModal(news);
            }
        });
    });
}

// =============================================
// MODAL DE NOTÍCIAS - CORRIGIDO
// =============================================

/**
 * Abre o modal da notícia
 */
function openNewsModal(news) {
    const modal = document.getElementById('news-modal');
    if (!modal) {
        console.error('Modal não encontrado!');
        return;
    }

    currentModalNews = news;
    console.log('Abrindo modal para:', news.title);

    // Preencher dados do modal
    const modalTitle = document.getElementById('modal-news-title');
    const modalDate = document.getElementById('modal-news-date');
    const modalMedia = document.getElementById('modal-news-media');
    const modalDescription = document.getElementById('modal-news-description');

    if (modalTitle) modalTitle.textContent = news.title;
    if (modalDate) modalDate.textContent = formatNewsDate(news.created_at);
    if (modalDescription) modalDescription.textContent = news.description || '';

    // Configurar mídia
    const hasVideo = news.video && isValidUrl(news.video);
    const hasImage = news.image && isValidUrl(news.image);

    let mediaHTML = '';
    if (hasVideo) {
        mediaHTML = `
            <video controls autoplay playsinline style="width: 100%; max-height: 50vh; object-fit: contain;">
                <source src="${news.video}" type="video/mp4">
                Seu navegador não suporta o vídeo.
            </video>
        `;
    } else if (hasImage) {
        mediaHTML = `
            <img src="${news.image}" alt="${news.title}" style="max-width: 100%; max-height: 50vh; object-fit: contain;">
        `;
    } else {
        mediaHTML = `
            <div style="background: #f8f9fa; height: 200px; display: flex; align-items: center; justify-content: center; color: #666;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📰</div>
                    <div>Sem mídia para exibir</div>
                </div>
            </div>
        `;
    }

    if (modalMedia) {
        modalMedia.innerHTML = mediaHTML;
    }

    // Mostrar modal
    modal.classList.add('open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    console.log('Modal aberto com sucesso');
}

/**
 * Fecha o modal
 */
function closeNewsModal() {
    const modal = document.getElementById('news-modal');
    if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Parar vídeos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        currentModalNews = null;
        
        console.log('Modal fechado');
    }
}

/**
 * Configura os eventos do modal
 */
function setupNewsModal() {
    const modal = document.getElementById('news-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    console.log('Configurando modal...');
    
    // Evento do botão fechar
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fechando modal via botão X');
            closeNewsModal();
        });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Fechando modal via clique fora');
                closeNewsModal();
            }
        });
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('news-modal');
            if (modal && modal.classList.contains('open')) {
                console.log('Fechando modal via ESC');
                closeNewsModal();
            }
        }
    });

    // Prevenir que eventos se propaguem para o conteúdo do modal
    const modalContent = document.querySelector('.news-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// =============================================
// SISTEMA DE COMPARTILHAMENTO COM URL DIRETA
// =============================================

/**
 * Gera URL única para a notícia que abre direto no modal
 */
function generateNewsUrl(newsId) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?news=${newsId}&modal=true`;
}

/**
 * Compartilha notícia no WhatsApp
 */
function shareOnWhatsApp() {
    if (!currentModalNews) {
        console.error('Nenhuma notícia selecionada para compartilhar');
        return;
    }
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    const shareText = `📰 *${news.title}*

${news.description || 'Confira esta notícia incrível!'}

💇 *Girosa Beauty*
_Transformando sua beleza com excelência_

🔗 ${newsUrl}`;

    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    trackShare('whatsapp', news.id);
    showNotification('Compartilhando no WhatsApp...', 'success');
}

/**
 * Compartilha notícia no Facebook
 */
function shareOnFacebook() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsUrl)}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    
    trackShare('facebook', news.id);
    showNotification('Compartilhando no Facebook...', 'success');
}

/**
 * Compartilha notícia no Twitter
 */
function shareOnTwitter() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    const shareText = `${news.title} - Girosa Beauty`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(newsUrl)}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    
    trackShare('twitter', news.id);
    showNotification('Compartilhando no Twitter...', 'success');
}

/**
 * Compartilha notícia no LinkedIn
 */
function shareOnLinkedIn() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(newsUrl)}`;
    
    window.open(linkedinUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    
    trackShare('linkedin', news.id);
    showNotification('Compartilhando no LinkedIn...', 'success');
}

/**
 * Compartilha notícia via Email
 */
function shareOnEmail() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    const subject = `Notícia: ${news.title} - Girosa Beauty`;
    const body = `Olá!

Confira esta notícia do Girosa Beauty:

${news.title}

${news.description || 'Uma notícia incrível sobre beleza e cuidados capilares.'}

Acesse: ${newsUrl}

Atenciosamente,
Girosa Beauty`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    trackShare('email', news.id);
}

/**
 * Copia link da notícia para área de transferência
 */
async function copyNewsLink() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    
    try {
        await navigator.clipboard.writeText(newsUrl);
        showCopyFeedback();
        trackShare('copy_link', news.id);
    } catch (err) {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = newsUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback();
        trackShare('copy_link', news.id);
    }
}

/**
 * Compartilhamento nativo (Web Share API)
 */
function shareNative() {
    if (!currentModalNews) return;
    
    const news = currentModalNews;
    const newsUrl = generateNewsUrl(news.id);
    
    if (navigator.share) {
        navigator.share({
            title: news.title,
            text: news.description || 'Confira esta notícia da Girosa Beauty',
            url: newsUrl,
        })
        .then(() => {
            trackShare('native', news.id);
            showNotification('Notícia compartilhada com sucesso!', 'success');
        })
        .catch((error) => {
            console.log('Erro ao compartilhar:', error);
            showNotification('Compartilhamento cancelado', 'info');
        });
    } else {
        showNotification('Compartilhamento nativo não suportado', 'info');
    }
}

// =============================================
// FUNÇÕES PARA O POPUP DE COMPARTILHAMENTO
// =============================================

/**
 * Abre o popup de compartilhamento
 */
function openSharePopup() {
    const popup = document.getElementById('share-popup');
    if (popup) {
        popup.classList.add('active');
    }
}

/**
 * Fecha o popup de compartilhamento
 */
function closeSharePopup() {
    const popup = document.getElementById('share-popup');
    if (popup) {
        popup.classList.remove('active');
    }
}

// =============================================
// SISTEMA DE URL PARA ABRIR NOTÍCIA DIRETAMENTE
// =============================================

/**
 * Verifica se há parâmetros na URL para abrir notícia diretamente
 */
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('news');
    const shouldOpenModal = urlParams.get('modal') === 'true';
    
    if (newsId && shouldOpenModal) {
        console.log('Abrindo notícia diretamente da URL:', newsId);
        
        // Buscar a notícia pelo ID
        const news = currentNewsList.find(n => n.id == newsId);
        if (news) {
            // Pequeno delay para garantir que tudo está carregado
            setTimeout(() => {
                openNewsModal(news);
                // Limpar a URL para não abrir novamente ao recarregar
                cleanUrl();
            }, 500);
        } else {
            console.log('Notícia não encontrada, aguardando carregamento...');
            // Se as notícias ainda não carregaram, tenta novamente em 2 segundos
            setTimeout(() => {
                const news = currentNewsList.find(n => n.id == newsId);
                if (news) {
                    openNewsModal(news);
                    cleanUrl();
                } else {
                    console.error('Notícia não encontrada após tentativas');
                    showNotification('Notícia não encontrada', 'error');
                }
            }, 2000);
        }
    }
}

/**
 * Limpa os parâmetros da URL sem recarregar a página
 */
function cleanUrl() {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

/**
 * Track compartilhamentos
 */
function trackShare(platform, newsId) {
    console.log(`Notícia ${newsId} compartilhada via ${platform}`);
    
    // Salvar no localStorage para estatísticas
    const shares = JSON.parse(localStorage.getItem('news-shares') || '{}');
    if (!shares[newsId]) {
        shares[newsId] = {};
    }
    shares[newsId][platform] = (shares[newsId][platform] || 0) + 1;
    shares[newsId].last_shared = new Date().toISOString();
    localStorage.setItem('news-shares', JSON.stringify(shares));
}

/**
 * Mostra feedback quando link é copiado
 */
function showCopyFeedback() {
    // Remove feedback anterior se existir
    const existingFeedback = document.querySelector('.copy-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback active';
    feedback.innerHTML = `
        <i class="fas fa-check-circle" style="color: #22c55e;"></i>
        Link copiado para a área de transferência!
    `;
    
    document.body.appendChild(feedback);
    
    // Remove após 2 segundos
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 2000);
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

// =============================================
// FUNÇÕES UTILITÁRIAS
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

// =============================================
// INICIALIZAÇÃO DA PÁGINA
// =============================================

/**
 * Inicializa a página de notícias
 */
function initNoticiaPage() {
    console.log('Inicializando página de notícias...');
    
    // Configurar modal primeiro
    setupNewsModal();
    
    // Carregar notícias
    loadNewsFromDB();
    
    console.log('Página de notícias inicializada com sucesso');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando página de notícias...');
    initNoticiaPage();
});

// Configurar eventos do popup de compartilhamento
document.addEventListener('click', function(e) {
    const popup = document.getElementById('share-popup');
    if (popup && popup.classList.contains('active') && e.target === popup) {
        closeSharePopup();
    }
});

// Fechar popup com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSharePopup();
    }
});

// Adicionar animação de fadeOut
const shareStyle = document.createElement('style');
shareStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
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
    
    .no-media-placeholder {
        background: #f8f9fa;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
    }
    
    .placeholder-content {
        text-align: center;
    }
    
    .placeholder-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
`;
document.head.appendChild(shareStyle);