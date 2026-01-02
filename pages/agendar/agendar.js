// pages/agendar/agendar.js - VERSÃO SEM ZOOM

// ===== VARIÁVEIS GLOBAIS =====
let selectedService = null;
let selectedJumboOption = 'salon';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando página de agendamento...');
    
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    initBookingPage();
    setupEventListeners();
    restoreFormData();
    addImageModalStyles();
});

// ===== INICIALIZAR PÁGINA =====
function initBookingPage() {
    loadSelectedService();
    
    if (!selectedService) {
        setTimeout(() => {
            window.location.href = '../servicos/index.html';
        }, 1500);
        return;
    }
    
    updateServiceDisplay();
    updatePriceSummary();
    setupForm();
    setupMasks();
}

// ===== CARREGAR SERVIÇO =====
function loadSelectedService() {
    try {
        const savedService = localStorage.getItem('selectedService');
        if (savedService) {
            selectedService = JSON.parse(savedService);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar serviço:', error);
    }
}

// ===== ATUALIZAR EXIBIÇÃO =====
function updateServiceDisplay() {
    if (!selectedService) return;
    
    // Título e descrição
    const titleElement = document.getElementById('booking-service-title');
    const descElement = document.getElementById('booking-service-desc');
    
    if (titleElement) titleElement.textContent = `Agendar: ${selectedService.name}`;
    if (descElement) descElement.textContent = selectedService.description || 'Preencha o formulário para agendar seu horário';
    
    // IMAGEM DO SERVIÇO (SEM ZOOM)
    const imageContainer = document.getElementById('service-image-container');
    if (imageContainer) {
        if (selectedService.image_url) {
            imageContainer.innerHTML = createImageHTML();
        } else {
            imageContainer.innerHTML = `
                <div class="service-image-box">
                    <div class="service-image-placeholder">
                        <i class="fas fa-spa"></i>
                        <p>Imagem do serviço</p>
                    </div>
                </div>
            `;
        }
    }
    
    updateServiceDetails();
    setupJumboOptions();
}

// ===== CRIAR HTML DA IMAGEM (SEM ZOOM) =====
function createImageHTML() {
    const hasPromotion = selectedService.has_promotion;
    
    return `
        <div class="service-image-box">
            ${hasPromotion ? `
                <div class="image-promo-badge">
                    <i class="fas fa-tag"></i>
                    ${selectedService.promotion_name || 'PROMOÇÃO'}
                </div>
            ` : ''}
            
            <div class="service-image-main">
                <img src="${selectedService.image_url}" 
                     alt="${selectedService.name}" 
                     class="service-image-main-img"
                     loading="eager"
                     onerror="this.onerror=null; this.src='../../assets/images/default-service.jpg';">
            </div>
            
            <div class="image-actions">
                <div class="image-action-btn" onclick="openFullscreenImage('${selectedService.image_url}')" 
                     title="Ver em tela cheia">
                    <i class="fas fa-expand"></i>
                </div>
            </div>
        </div>
    `;
}

// ===== DETALHES DO SERVIÇO =====
function updateServiceDetails() {
    const summaryElement = document.getElementById('service-summary');
    if (!summaryElement || !selectedService) return;
    
    const finalPrice = calculateFinalPrice();
    const hasPromotion = selectedService.has_promotion;
    const promotionPercent = hasPromotion ? Math.round(selectedService.promotion_percentage * 100) : 0;
    
    summaryElement.innerHTML = `
        <div class="summary-header">
            <h3>${selectedService.name}</h3>
            <div class="summary-price">
                ${hasPromotion ? `
                    <span class="original-price-summary">
                        De R$ ${parseFloat(selectedService.original_price).toFixed(2)}
                    </span>
                ` : ''}
                <span class="final-price-summary">R$ ${finalPrice.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="summary-details">
            <div class="detail-row">
                <div class="detail-label">Descrição:</div>
                <div class="detail-value">${selectedService.description || 'Serviço profissional'}</div>
            </div>
            
            ${selectedService.duration ? `
                <div class="detail-row">
                    <div class="detail-label">Duração:</div>
                    <div class="detail-value">${selectedService.duration} minutos</div>
                </div>
            ` : ''}
            
            <div class="detail-row">
                <div class="detail-label">Para:</div>
                <div class="detail-value">${getGenderLabel(selectedService.gender)}</div>
            </div>
            
            ${hasPromotion ? `
                <div class="detail-row">
                    <div class="detail-label">Promoção:</div>
                    <div class="detail-value" style="color: var(--success-color);">
                        <i class="fas fa-tag me-1"></i>
                        ${selectedService.promotion_name || 'Promoção'} - ${promotionPercent}% OFF
                    </div>
                </div>
            ` : ''}
            
            ${selectedService.includes_jumbo || selectedService.discount_with_jumbo ? `
                <div class="detail-row">
                    <div class="detail-label">Jumbo:</div>
                    <div class="detail-value">
                        ${selectedService.includes_jumbo ? 
                            '✅ Inclui jumbo do salão' : 
                            `💰 Aceita jumbo próprio com ${Math.round((selectedService.percentage_discount || 0) * 100)}% de desconto`}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function setupJumboOptions() {
    const jumboSection = document.getElementById('jumbo-options-section');
    if (!jumboSection || !selectedService) return;
    
    if (selectedService.includes_jumbo || selectedService.discount_with_jumbo) {
        jumboSection.style.display = 'block';
        
        if (selectedService.includes_jumbo && selectedService.discount_with_jumbo) {
            document.getElementById('jumbo-salon').disabled = false;
            document.getElementById('jumbo-own').disabled = false;
            selectedJumboOption = 'salon';
        } else if (selectedService.includes_jumbo) {
            document.getElementById('jumbo-own').disabled = true;
            selectedJumboOption = 'salon';
        } else if (selectedService.discount_with_jumbo) {
            document.getElementById('jumbo-salon').disabled = true;
            selectedJumboOption = 'own';
        }
    } else {
        jumboSection.style.display = 'none';
    }
}

function calculateFinalPrice() {
    if (!selectedService) return 0;
    
    let price = parseFloat(selectedService.original_price);
    
    if (selectedService.has_promotion && selectedService.promotion_percentage > 0) {
        price -= price * selectedService.promotion_percentage;
    }
    
    if (selectedJumboOption === 'own' && 
        selectedService.discount_with_jumbo && 
        selectedService.percentage_discount > 0) {
        price -= price * selectedService.percentage_discount;
    }
    
    return Math.round(price * 100) / 100;
}

function setupForm() {
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    const timeInput = document.getElementById('preferred-time');
    if (timeInput) {
        timeInput.value = '14:00';
    }
}

function setupMasks() {
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length === 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            } else if (value.length === 10) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    const cpfInput = document.getElementById('client-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
}

function setupEventListeners() {
    const jumboOptions = document.querySelectorAll('input[name="jumbo-option"]');
    jumboOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedJumboOption = this.value;
            updatePriceSummary();
            saveFormData();
        });
    });
    
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBooking();
        });
    }
    
    const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
}

function updatePriceSummary() {
    const summaryElement = document.getElementById('price-summary');
    if (!summaryElement || !selectedService) return;
    
    const finalPrice = calculateFinalPrice();
    const hasPromotion = selectedService.has_promotion;
    const hasJumboDiscount = selectedJumboOption === 'own' && selectedService.discount_with_jumbo;
    
    let promotionDiscount = 0;
    let jumboDiscount = 0;
    
    if (hasPromotion) {
        promotionDiscount = parseFloat(selectedService.original_price) * selectedService.promotion_percentage;
    }
    
    if (hasJumboDiscount) {
        const priceAfterPromotion = hasPromotion ? 
            parseFloat(selectedService.original_price) - promotionDiscount :
            parseFloat(selectedService.original_price);
        jumboDiscount = priceAfterPromotion * selectedService.percentage_discount;
    }
    
    const totalDiscount = promotionDiscount + jumboDiscount;
    
    summaryElement.innerHTML = `
        <div class="price-breakdown">
            <div class="price-row">
                <span class="price-label">Valor original:</span>
                <span class="price-value">R$ ${parseFloat(selectedService.original_price).toFixed(2)}</span>
            </div>
            
            ${hasPromotion ? `
                <div class="price-row">
                    <span class="price-label">
                        <i class="fas fa-tag me-1"></i>
                        ${selectedService.promotion_name || 'Promoção'}:
                    </span>
                    <span class="price-value" style="color: var(--success-color);">
                        - R$ ${promotionDiscount.toFixed(2)}
                    </span>
                </div>
            ` : ''}
            
            ${hasJumboDiscount ? `
                <div class="price-row">
                    <span class="price-label">
                        <i class="fas fa-gift me-1"></i>
                        Desconto jumbo:
                    </span>
                    <span class="price-value" style="color: var(--warning-color);">
                        - R$ ${jumboDiscount.toFixed(2)}
                    </span>
                </div>
            ` : ''}
        </div>
        
        <div class="price-total">
            <span class="total-label">Total a pagar:</span>
            <span class="total-value">R$ ${finalPrice.toFixed(2)}</span>
        </div>
        
        ${totalDiscount > 0 ? `
            <div class="alert alert-success mt-3 mb-0">
                <i class="fas fa-piggy-bank me-2"></i>
                Você economizou R$ ${totalDiscount.toFixed(2)}!
            </div>
        ` : ''}
    `;
}

function getGenderLabel(gender) {
    const labels = {
        'feminino': 'Feminino',
        'masculino': 'Masculino',
        'unissex': 'Unissex'
    };
    return labels[gender] || 'Unissex';
}

function saveFormData() {
    const formData = {
        name: document.getElementById('client-name').value,
        phone: document.getElementById('client-phone').value,
        cpf: document.getElementById('client-cpf').value,
        date: document.getElementById('preferred-date').value,
        time: document.getElementById('preferred-time').value,
        observations: document.getElementById('observations').value,
        jumboOption: selectedJumboOption
    };
    
    try {
        localStorage.setItem('bookingFormData', JSON.stringify(formData));
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
    }
}

function restoreFormData() {
    try {
        const savedData = localStorage.getItem('bookingFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            document.getElementById('client-name').value = data.name || '';
            document.getElementById('client-phone').value = data.phone || '';
            document.getElementById('client-cpf').value = data.cpf || '';
            document.getElementById('preferred-date').value = data.date || '';
            document.getElementById('preferred-time').value = data.time || '';
            document.getElementById('observations').value = data.observations || '';
            
            if (data.jumboOption) {
                selectedJumboOption = data.jumboOption;
                const jumboOption = document.querySelector(`input[name="jumbo-option"][value="${data.jumboOption}"]`);
                if (jumboOption) jumboOption.checked = true;
            }
        }
    } catch (error) {
        console.error('❌ Erro ao restaurar dados:', error);
    }
}

// ===== FUNÇÕES DA IMAGEM =====
function openFullscreenImage(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'image-modal active';
    modal.innerHTML = `
        <div class="close-modal" onclick="closeImageModal()">
            <i class="fas fa-times"></i>
        </div>
        <img src="${imageUrl}" class="modal-image" alt="Imagem em tamanho real">
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeImageModal();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeImageModal();
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// ===== ENVIAR AGENDAMENTO =====
function submitBooking() {
    if (!selectedService) {
        alert('Serviço não encontrado!');
        return;
    }
    
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const date = document.getElementById('preferred-date').value;
    const time = document.getElementById('preferred-time').value;
    
    if (!name || !phone || !date || !time) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    const finalPrice = calculateFinalPrice();
    const formattedDate = new Date(date).toLocaleDateString('pt-BR');
    
    let message = `*NOVO AGENDAMENTO - GIROSA BEAUTY*%0A%0A`;
    message += `*📋 SERVIÇO:*%0A`;
    message += `• ${selectedService.name}%0A`;
    message += `• Valor: R$ ${finalPrice.toFixed(2)}%0A%0A`;
    
    message += `*👤 CLIENTE:*%0A`;
    message += `• Nome: ${name}%0A`;
    message += `• Telefone: ${phone}%0A%0A`;
    
    message += `*📅 AGENDAMENTO:*%0A`;
    message += `• Data: ${formattedDate}%0A`;
    message += `• Horário: ${time}%0A%0A`;
    
    message += `*🧴 JUMBO:*%0A`;
    message += `• ${selectedJumboOption === 'salon' ? 'Usará jumbo do salão' : 'Tragou jumbo próprio'}%0A%0A`;
    
    message += `_📞 Agendamento feito pelo site. Confirme a disponibilidade._`;
    
    const whatsappNumber = '554499180116';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
        localStorage.removeItem('selectedService');
        localStorage.removeItem('bookingFormData');
    }, 1000);
}

// ===== CSS PARA MODAL =====
function addImageModalStyles() {
    if (document.getElementById('image-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'image-modal-styles';
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .image-modal.active {
            display: flex;
        }
        
        .modal-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: modalFadeIn 0.3s ease;
        }
        
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            background: rgba(255,255,255,0.25);
            transform: rotate(90deg);
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ agendar.js SEM ZOOM carregado');