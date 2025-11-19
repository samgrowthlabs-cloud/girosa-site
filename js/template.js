// Sistema de Template para Girosa Beauty
// Este arquivo gerencia a herança de componentes (header e footer)

class TemplateManager {
    constructor() {
        this.components = {};
        this.currentPath = window.location.pathname;
        this.init();
    }

    async init() {
        // Determinar o caminho base
        this.basePath = this.determineBasePath();
        
        // Carregar componentes
        await this.loadComponent('header', `${this.basePath}components/header.html`);
        await this.loadComponent('footer', `${this.basePath}components/footer.html`);
        
        // Inserir componentes nas páginas
        this.insertComponents();
        
        // Corrigir caminhos dos links
        this.fixNavigationLinks();
        
        // Inicializar funcionalidades comuns
        this.initCommonFeatures();
    }

    determineBasePath() {
        const path = window.location.pathname;
        
        // Se estiver na raiz
        if (path.endsWith('index.html') || path.endsWith('/') || path.includes('/home.html')) {
            return './';
        }
        
        // Se estiver na pasta pages
        if (path.includes('/pages/')) {
            return '../';
        }
        
        return './';
    }

    async loadComponent(name, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao carregar ${name}`);
            this.components[name] = await response.text();
        } catch (error) {
            console.error(`Erro ao carregar componente ${name}:`, error);
            this.components[name] = `<div>Erro ao carregar ${name}</div>`;
        }
    }

    insertComponents() {
        // Inserir header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder && this.components.header) {
            headerPlaceholder.outerHTML = this.components.header;
        }

        // Inserir footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder && this.components.footer) {
            footerPlaceholder.outerHTML = this.components.footer;
        }
    }

    fixNavigationLinks() {
        // Corrigir todos os links de navegação
        const navLinks = document.querySelectorAll('nav a, .logo a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                // Se estivermos na raiz, manter os links como estão
                if (this.basePath === './') {
                    // Links já estão corretos para a raiz
                } 
                // Se estivermos na pasta pages, ajustar os links
                else if (this.basePath === '../') {
                    // Para links que apontam para a raiz (index.html)
                    if (href === '../index.html') {
                        link.setAttribute('href', '../index.html');
                    }
                    // Para links dentro da pasta pages
                    else if (!href.includes('../')) {
                        link.setAttribute('href', href);
                    }
                }
            }
        });
    }

    initCommonFeatures() {
        // Menu mobile
        this.initMobileMenu();
        
        // Marcar link ativo no menu
        this.markActiveMenu();
        
        // Smooth scroll para links internos
        this.initSmoothScroll();
    }

    initMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navMenu = document.querySelector('nav ul');
        
        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
            });
        });
    }

    markActiveMenu() {
        // Marcar o link ativo no menu baseado na URL atual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('nav ul li a');
        
        menuLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            let linkPage = linkHref.split('/').pop();
            
            // Casos especiais
            if (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '../index.html')) {
                link.classList.add('active');
            } else if (currentPage === linkPage) {
                link.classList.add('active');
            } else if (currentPage === '' && linkPage === 'index.html') {
                link.classList.add('active');
            }
        });
    }

    initSmoothScroll() {
        // Smooth scroll para links âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// No template.js, adicione esta verificação
function checkPageAccess() {
    if (window.location.pathname.includes('colab-gb')) {
        // Verificar se veio de uma página autorizada
        const referrer = document.referrer;
        const allowedReferrers = [
            window.location.origin + '/index.html',
            window.location.origin + '/pages/afiliate.html',
            window.location.origin + '/'
        ];
        
        if (!allowedReferrers.includes(referrer) && referrer !== '') {
            // Redirecionar se não veio de página autorizada
            window.location.href = '../index.html';
        }
    }
}

// Inicializar o gerenciador de templates quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    checkPageAccess();
    new TemplateManager();
});