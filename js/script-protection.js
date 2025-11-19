// Proteções avançadas contra inspeção
class CodeProtection {
    constructor() {
        this.obfuscated = true;
        this.initProtection();
    }
    
    initProtection() {
        this.preventDevTools();
        this.monitorInspector();
        this.obfuscateStrings();
    }
    
    preventDevTools() {
        // Detectar abertura do DevTools
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                // Isso será chamado quando alguém tentar inspecionar
                console.warn('Acesso não autorizado detectado');
                document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Acesso Restrito</h1><p>Área exclusiva para colaboradores autorizados.</p></div>';
                throw new Error('Acesso não autorizado');
            }
        });
        
        console.log('%c🔒 Área Protegida', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%cAcesso restrito a colaboradores autorizados.', 'color: gray;');
    }
    
    monitorInspector() {
        // Verificar se o DevTools está aberto
        setInterval(() => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                document.body.style.display = 'none';
                setTimeout(() => {
                    document.body.style.display = 'block';
                    window.location.reload();
                }, 1000);
            }
        }, 1000);
    }
    
    obfuscateStrings() {
        // Ofuscar strings em tempo de execução
        String.prototype.obfuscate = function() {
            return this.split('').map(char => 
                String.fromCharCode(char.charCodeAt(0) ^ 0x42)
            ).join('');
        };
        
        String.prototype.deobfuscate = function() {
            return this.split('').map(char => 
                String.fromCharCode(char.charCodeAt(0) ^ 0x42)
            ).join('');
        };
    }
}

// Inicializar proteção
if (window.location.pathname.includes('colab-gb')) {
    new CodeProtection();
}