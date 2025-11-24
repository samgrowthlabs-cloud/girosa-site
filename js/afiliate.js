// =============================================
// JAVASCRIPT ESPECÍFICO DA PÁGINA AFILIATE
// =============================================

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
            <td>
                <span class="affiliate-type-badge ${getAffiliateTypeClass(affiliate.type)}">
                    ${getAffiliateTypeLabel(affiliate.type)}
                </span>
            </td>
            <td>
                <span class="status-badge ${getStatusClass(affiliate.status)}">
                    ${getStatusLabel(affiliate.status)}
                </span>
            </td>
        `;
        container.appendChild(row);
    });
}

/**
 * Retorna a classe CSS para o tipo de afiliado
 */
function getAffiliateTypeClass(type) {
    const typeMap = {
        'bas': 'type-bas',
        'int': 'type-int', 
        'top': 'type-top'
    };
    return typeMap[type] || 'type-bas';
}

/**
 * Retorna o label para o tipo de afiliado
 */
function getAffiliateTypeLabel(type) {
    const labelMap = {
        'bas': 'Básico',
        'int': 'Intermediário',
        'top': 'Top'
    };
    return labelMap[type] || 'Básico';
}

/**
 * Retorna a classe CSS para o status
 */
function getStatusClass(status) {
    const statusMap = {
        'active': 'status-active',
        'pending': 'status-pending',
        'inactive': 'status-inactive'
    };
    return statusMap[status] || 'status-pending';
}

/**
 * Retorna o label para o status
 */
function getStatusLabel(status) {
    const labelMap = {
        'active': 'Ativo',
        'pending': 'Pendente',
        'inactive': 'Inativo'
    };
    return labelMap[status] || 'Pendente';
}

/**
 * Calcula e exibe as comissões estimadas
 */
function calculateEstimatedCommissions() {
    const salesInput = document.getElementById('estimated-sales');
    const basCommission = document.getElementById('bas-commission');
    const intCommission = document.getElementById('int-commission');
    const topCommission = document.getElementById('top-commission');
    
    if (!salesInput || !basCommission || !intCommission || !topCommission) return;

    salesInput.addEventListener('input', function() {
        const salesValue = parseFloat(this.value) || 0;
        
        const basValue = (salesValue * 0.10).toFixed(2);
        const intValue = (salesValue * 0.13).toFixed(2);
        const topValue = (salesValue * 0.15).toFixed(2);
        
        basCommission.textContent = `R$ ${basValue}`;
        intCommission.textContent = `R$ ${intValue}`;
        topCommission.textContent = `R$ ${topValue}`;
    });
}

/**
 * Inicializa o sistema de FAQ
 */
function initFAQSystem() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fecha todas as outras FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-question').classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Alterna a FAQ atual
            this.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            answer.classList.toggle('active');
            
            // Animação de altura
            if (answer.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}

/**
 * Configura os botões de call-to-action
 */
function setupCTAActions() {
    const joinButtons = document.querySelectorAll('.join-affiliate-btn');
    const contactButtons = document.querySelectorAll('.contact-affiliate-btn');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll para o formulário de afiliação
            document.getElementById('affiliate-form').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Abrir WhatsApp para contato
            const message = encodeURIComponent(
                "Olá! Gostaria de mais informações sobre o programa de afiliados da Girosa Beauty."
            );
            window.open(`https://wa.me/5544999180116?text=${message}`, '_blank');
        });
    });
}

/**
 * Inicializa o sistema de métricas
 */
function initMetricsSystem() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach(metric => {
        const target = parseInt(metric.textContent);
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                metric.textContent = target + '+';
                clearInterval(timer);
            } else {
                metric.textContent = Math.floor(current) + '+';
            }
        }, duration / 100);
    });
}

/**
 * Configura o formulário de solicitação de afiliação
 */
function setupAffiliateForm() {
    const form = document.getElementById('affiliate-request-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Validar campos
        if (!validateAffiliateForm()) {
            return;
        }

        // Ativar estado de loading
        setButtonLoading(submitButton, true, 'Enviando...');
        
        // Simular envio (substituir por API real)
        setTimeout(() => {
            showNotification('Solicitação de afiliação enviada com sucesso! Entraremos em contato em breve.', 'success');
            form.reset();
            setButtonLoading(submitButton, false, originalButtonText);
            
            // Scroll para confirmação
            document.getElementById('affiliate-success').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 2000);
    });
}

/**
 * Valida o formulário de afiliação
 */
function validateAffiliateForm() {
    const name = document.getElementById('affiliate-name').value.trim();
    const email = document.getElementById('affiliate-email').value.trim();
    const phone = document.getElementById('affiliate-phone').value.trim();
    const experience = document.getElementById('affiliate-experience').value.trim();
    
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
    
    // Validar email
    if (!email) {
        showFieldError('affiliate-email', 'Por favor, insira seu email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('affiliate-email', 'Por favor, insira um email válido');
        isValid = false;
    } else {
        clearFieldError('affiliate-email');
    }
    
    // Validar telefone
    if (!phone) {
        showFieldError('affiliate-phone', 'Por favor, insira seu telefone');
        isValid = false;
    } else if (phone.replace(/\D/g, '').length < 10) {
        showFieldError('affiliate-phone', 'Telefone inválido');
        isValid = false;
    } else {
        clearFieldError('affiliate-phone');
    }
    
    return isValid;
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Configura os tooltips de informações
 */
function setupInfoTooltips() {
    const infoIcons = document.querySelectorAll('.info-icon');
    
    infoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('info-tooltip')) {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            }
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('info-tooltip')) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
    });
}

/**
 * Inicializa o sistema de progresso
 */
function initProgressSystem() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress') || '0';
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 500);
    });
}

/**
 * Configura os filtros da tabela de afiliados
 */
function setupAffiliateFilters() {
    const typeFilter = document.getElementById('affiliate-type-filter');
    const statusFilter = document.getElementById('affiliate-status-filter');
    const searchInput = document.getElementById('affiliate-search');
    
    if (!typeFilter || !statusFilter || !searchInput) return;
    
    const filterTable = function() {
        const typeValue = typeFilter.value;
        const statusValue = statusFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        
        const rows = document.querySelectorAll('#affiliates-list tr');
        
        rows.forEach(row => {
            const typeCell = row.querySelector('.affiliate-type-badge');
            const statusCell = row.querySelector('.status-badge');
            const nameCell = row.cells[0];
            
            const typeMatch = typeValue === 'all' || (typeCell && typeCell.textContent.toLowerCase().includes(typeValue));
            const statusMatch = statusValue === 'all' || (statusCell && statusCell.textContent.toLowerCase().includes(statusValue));
            const searchMatch = nameCell.textContent.toLowerCase().includes(searchValue);
            
            if (typeMatch && statusMatch && searchMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };
    
    typeFilter.addEventListener('change', filterTable);
    statusFilter.addEventListener('change', filterTable);
    searchInput.addEventListener('input', filterTable);
}

/**
 * Gera relatório de comissões
 */
function generateCommissionReport() {
    const reportBtn = document.getElementById('generate-report');
    if (!reportBtn) return;
    
    reportBtn.addEventListener('click', function() {
        // Simular geração de relatório
        setButtonLoading(this, true, 'Gerando...');
        
        setTimeout(() => {
            showNotification('Relatório gerado com sucesso! Verifique seu email.', 'success');
            setButtonLoading(this, false, 'Gerar Relatório');
            
            // Aqui você pode implementar o download real do relatório
            // ou envio por email através de uma API
        }, 2000);
    });
}

/**
 * Configura o sistema de notificações para afiliados
 */
function setupAffiliateNotifications() {
    const notificationToggle = document.getElementById('notification-toggle');
    if (!notificationToggle) return;
    
    notificationToggle.addEventListener('change', function() {
        if (this.checked) {
            showNotification('Notificações ativadas com sucesso!', 'success');
            // Aqui você pode salvar a preferência no localStorage ou via API
            localStorage.setItem('affiliate-notifications', 'enabled');
        } else {
            showNotification('Notificações desativadas.', 'info');
            localStorage.setItem('affiliate-notifications', 'disabled');
        }
    });
    
    // Carregar preferência salva
    const savedPreference = localStorage.getItem('affiliate-notifications');
    if (savedPreference === 'enabled') {
        notificationToggle.checked = true;
    }
}

// =============================================
// INICIALIZAÇÃO DA PÁGINA AFILIATE
// =============================================

/**
 * Inicializa a página de afiliados
 */
function initAfiliatePage() {
    console.log('Inicializando página de afiliados...');
    
    // Carregar dados
    loadAfiliatesFromDB().then(() => {
        loadAffiliates();
    }).catch(error => {
        console.error('Erro ao carregar afiliados:', error);
    });
    
    // Inicializar sistemas
    calculateEstimatedCommissions();
    initFAQSystem();
    setupCTAActions();
    initMetricsSystem();
    setupAffiliateForm();
    setupInfoTooltips();
    initProgressSystem();
    setupAffiliateFilters();
    generateCommissionReport();
    setupAffiliateNotifications();
    
    console.log('Página de afiliados inicializada com sucesso');
}

// Inicializar quando o DOM estiver carregado
if (document.getElementById('affiliates-list') || document.querySelector('.affiliate-types')) {
    document.addEventListener('DOMContentLoaded', initAfiliatePage);
}

// =============================================
// FUNÇÕES AUXILIARES - AFILIATE
// =============================================

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

/**
 * Formata telefone ((00) 00000-0000)
 */
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    return telefone.substring(0, 15);
}

// Configurar máscara de telefone no formulário
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('affiliate-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = formatarTelefone(this.value);
        });
    }
});