import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# --- PART 1: Redesign Hero and Simulator ---

new_hero = """    <!-- Hero Section -->
    <section class="relative pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-dark text-white">
        <div class="absolute inset-0 bg-mesh-dark opacity-80"></div>
        <div class="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        <div class="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-brand-500/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6">
                <i class="ph ph-sparkle text-base"></i>
                O Maior Feirão Digital do Brasil
            </div>
            
            <h1 class="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Seu próximo carro com <br class="hidden sm:block"/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">financiamento aprovado</span>
            </h1>
            
            <p class="text-base sm:text-lg lg:text-xl text-gray-300 mb-10 font-light max-w-2xl mx-auto">
                Veja fotos reais de anúncios reais, consulte a tabela FIPE oficial e simule seu financiamento com taxas a partir de 1,29% a.m.
            </p>

            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto bg-white rounded-2xl p-1.5 sm:p-2 shadow-glow-lg flex items-center gap-2 text-gray-800 border border-gray-100 mb-12">
                <div class="flex-grow flex items-center gap-2 pl-3">
                    <i class="ph ph-magnifying-glass text-xl text-gray-400"></i>
                    <input type="text" id="hero-search-input" onkeyup="syncSearchAndScroll(this)" placeholder="Buscar marca, modelo (ex: Onix, BYD, Corolla)..." class="w-full bg-transparent outline-none py-2 sm:py-3 text-base sm:text-lg">
                </div>
                <a href="#marketplace-section" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 text-sm sm:text-base">
                    <span>Buscar</span>
                    <i class="ph ph-arrow-right"></i>
                </a>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400 font-medium">
                <div class="flex items-center gap-1.5">
                    <i class="ph-fill ph-check-circle text-brand-500 text-xl"></i> Laudo Cautelar
                </div>
                <div class="flex items-center gap-1.5">
                    <i class="ph-fill ph-check-circle text-brand-500 text-xl"></i> Sem Taxas Ocultas
                </div>
                <div class="flex items-center gap-1.5">
                    <i class="ph-fill ph-check-circle text-brand-500 text-xl"></i> Aprovação Rápida
                </div>
            </div>
        </div>
    </section>

    <!-- Trust indicators -->
    <section class="py-8 bg-white border-b border-gray-100 relative z-20 shadow-sm">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-150 text-center md:text-left">
                <div class="flex flex-col items-center md:flex-row gap-4 pt-4 md:pt-0">
                    <div class="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                        <i class="ph-bold ph-shield-check text-3xl"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-900 text-base uppercase tracking-wider mb-1">Laudo Cautelar Aprovado</h4>
                        <p class="text-sm text-gray-500">Todos os carros com vistoria completa aprovada. Sem surpresas.</p>
                    </div>
                </div>
                
                <div class="flex flex-col items-center md:flex-row gap-4 pt-6 md:pt-0 md:pl-8">
                    <div class="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                        <i class="ph-bold ph-currency-circle-dollar text-3xl"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-900 text-base uppercase tracking-wider mb-1">Consulta FIPE Real</h4>
                        <p class="text-sm text-gray-500">Compare os preços diretamente com a tabela FIPE de referência.</p>
                    </div>
                </div>
                
                <div class="flex flex-col items-center md:flex-row gap-4 pt-6 md:pt-0 md:pl-8">
                    <div class="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                        <i class="ph-bold ph-users text-3xl"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-900 text-base uppercase tracking-wider mb-1">Atendimento Rápido</h4>
                        <p class="text-sm text-gray-500">Faça sua simulação e fale com nossos consultores no WhatsApp.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Simulador de Financiamento Dedicado -->
    <section id="simulador-section" class="py-16 bg-gray-50 border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-10">
                <h2 class="text-3xl font-bold text-gray-900 tracking-tight mb-3">Simulador de Financiamento</h2>
                <p class="text-gray-500 max-w-2xl mx-auto">Simulação rápida e consulta live da tabela FIPE para você descobrir o crédito ideal para o seu perfil, sem burocracia.</p>
            </div>
            
            <div class="double-bezel max-w-3xl mx-auto">
                <div class="double-bezel-inner p-6 sm:p-8 lg:p-10 bg-white text-gray-800 shadow-xl">
                    <form id="hero-sim-form" class="space-y-6" onsubmit="event.preventDefault();">
                        <!-- Step 1: Seus Dados (Personal Info) -->
                        <div id="hero-step-1" class="space-y-5 animate-fade-in">
                            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h4 class="font-bold text-gray-800 text-base uppercase tracking-wider">Etapa 1: Seus Dados</h4>
                                <span class="text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full">Passo 1 de 3</span>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div class="space-y-1 md:col-span-2">
                                    <label for="hero-nome" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Nome Completo</label>
                                    <input type="text" id="hero-nome" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors text-gray-900" placeholder="Seu nome completo">
                                    <p id="err-hero-nome" class="text-red-500 text-[11px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-whatsapp" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">WhatsApp</label>
                                    <input type="tel" id="hero-whatsapp" required maxlength="15" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors text-gray-900" placeholder="(00) 00000-0000">
                                    <p id="err-hero-whatsapp" class="text-red-500 text-[11px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-email" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">E-mail</label>
                                    <input type="email" id="hero-email" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors text-gray-900" placeholder="seu@email.com">
                                    <p id="err-hero-email" class="text-red-500 text-[11px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-cpf" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">CPF</label>
                                    <input type="text" id="hero-cpf" required maxlength="14" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors text-gray-900" placeholder="000.000.000-00">
                                    <p id="err-hero-cpf" class="text-red-500 text-[11px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-nascimento" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Data de Nascimento</label>
                                    <input type="text" id="hero-nascimento" required maxlength="10" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors text-gray-900" placeholder="DD/MM/AAAA">
                                    <p id="err-hero-nascimento" class="text-red-500 text-[11px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-placa" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Final Placa</label>
                                    <input type="text" id="hero-placa" required maxlength="4" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 outline-none text-sm transition-colors uppercase text-gray-900" placeholder="Ex: 8A43">
                                    <p id="err-hero-placa" class="text-red-500 text-[10px] hidden"></p>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-uf" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Estado (UF)</label>
                                    <select id="hero-uf" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-brand-500 text-sm text-gray-900">
                                        <option value="SP">São Paulo (SP)</option>
                                        <option value="RJ">Rio de Janeiro (RJ)</option>
                                        <option value="MG">Minas Gerais (MG)</option>
                                        <option value="PR">Paraná (PR)</option>
                                        <option value="SC">Santa Catarina (SC)</option>
                                        <option value="RS">Rio Grande do Sul (RS)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="button" onclick="advanceHeroStep(2)" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 mt-4 text-base relative z-30">
                                <span>Continuar Simulação</span>
                                <i class="ph ph-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Step 2: Veículo & Entrada -->
                        <div id="hero-step-2" class="space-y-5 hidden animate-fade-in">
                            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h4 class="font-bold text-gray-800 text-base uppercase tracking-wider">Etapa 2: Veículo & Entrada</h4>
                                <span class="text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full">Passo 2 de 3</span>
                            </div>
                            
                            <div class="space-y-2">
                                <label for="hero-car-select" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Selecione o Veículo Desejado</label>
                                <select id="hero-car-select" onchange="onHeroCarChange()" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-brand-500 text-base text-gray-900 font-medium">
                                    <!-- Dynamically populated -->
                                </select>
                            </div>

                            <!-- FIPE Dynamic Selectors -->
                            <div id="custom-fipe-selectors" class="space-y-4 hidden bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label for="hero-fipe-marca" class="text-xs font-bold text-gray-400 uppercase block">Marca FIPE</label>
                                        <select id="hero-fipe-marca" onchange="onFipeMarcaChange()" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900"></select>
                                    </div>
                                    <div class="space-y-1">
                                        <label for="hero-fipe-modelo" class="text-xs font-bold text-gray-400 uppercase block">Modelo FIPE</label>
                                        <select id="hero-fipe-modelo" onchange="onFipeModeloChange()" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" disabled><option value="">Selecione a marca...</option></select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label for="hero-fipe-ano" class="text-xs font-bold text-gray-400 uppercase block">Ano Modelo</label>
                                    <select id="hero-fipe-ano" onchange="onFipeAnoChange()" class="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" disabled><option value="">Selecione o modelo...</option></select>
                                </div>
                            </div>

                            <!-- Live FIPE Price Display -->
                            <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                <div>
                                    <span class="text-[11px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Valor FIPE Oficial</span>
                                    <span id="hero-fipe-price-label" class="text-lg font-bold text-gray-900 font-mono">R$ 0,00</span>
                                </div>
                                <span id="hero-fipe-status" class="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100"><i class="ph ph-check-circle text-sm"></i> Live API</span>
                            </div>

                            <div class="space-y-4 pt-2">
                                <div class="flex justify-between items-end">
                                    <label class="font-bold text-gray-500 uppercase tracking-wide text-xs">Valor de Entrada</label>
                                    <span id="hero-entrada-label" class="text-xl font-bold text-brand-500 font-mono">R$ 0,00</span>
                                </div>
                                <input type="range" id="hero-entrada" min="0" max="100000" step="1000" oninput="updateHeroEntradaLabel(this.value)" class="w-full accent-brand-500 custom-range h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            </div>

                            <div class="space-y-2 pt-2">
                                <label for="hero-parcelas" class="text-xs font-bold text-gray-500 uppercase tracking-wide block">Prazo de Pagamento</label>
                                <select id="hero-parcelas" onchange="recalculateHeroInstallments()" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-1 focus:ring-brand-500 text-base text-gray-900 font-medium">
                                    <option value="24">24 meses (Taxa ref: 1,29%)</option>
                                    <option value="36">36 meses (Taxa ref: 1,35%)</option>
                                    <option value="48" selected>48 meses (Taxa ref: 1,39%)</option>
                                    <option value="60">60 meses (Taxa ref: 1,45%)</option>
                                </select>
                            </div>

                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="advanceHeroStep(1)" class="w-1/3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl transition-all text-sm relative z-30">Voltar</button>
                                <button type="button" onclick="advanceHeroStep(3)" class="w-2/3 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-glow transition-all text-sm sm:text-base flex justify-center items-center gap-2 relative z-30">
                                    <i class="ph ph-magnifying-glass-plus"></i> Analisar Crédito
                                </button>
                            </div>
                        </div>

                        <!-- Step 3: CPF Eligibility Analysis & Results -->
                        <div id="hero-step-3" class="space-y-6 hidden animate-fade-in">
                            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                                <h4 class="font-bold text-gray-800 text-base uppercase tracking-wider">Etapa 3: Resultado</h4>
                                <span class="text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1 rounded-full">Finalizado</span>
                            </div>

                            <!-- CPF Score Review Panel -->
                            <div class="bg-gray-950 text-white rounded-2xl p-5 space-y-3 border border-brand-500/30 shadow-lg relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl"></div>
                                <div class="flex justify-between items-center relative z-10">
                                    <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">Score para o CPF</span>
                                    <span id="cpf-score-badge" class="bg-brand-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">840 (Excelente)</span>
                                </div>
                                <h5 id="cpf-status-title" class="font-black text-emerald-400 text-lg tracking-wide relative z-10 flex items-center gap-2">
                                    <i class="ph-fill ph-check-circle"></i> CRÉDITO PRÉ-APROVADO!
                                </h5>
                                <p id="cpf-limit-desc" class="text-xs text-gray-300 relative z-10 leading-relaxed">Seu perfil atingiu a faixa de elegibilidade. Taxa reduzida de 1.29% a.m. pré-liberada.</p>
                            </div>

                            <!-- Loan terms -->
                            <div class="bg-brand-50 border border-brand-100 rounded-2xl p-5 space-y-4 text-gray-800">
                                <div class="flex justify-between border-b border-brand-100/50 pb-3 text-sm">
                                    <span class="text-gray-600 font-medium">Valor FIPE do Veículo:</span>
                                    <span id="hero-res-fipe" class="font-bold text-gray-900 font-mono">R$ 0,00</span>
                                </div>
                                <div class="flex justify-between border-b border-brand-100/50 pb-3 text-sm">
                                    <span class="text-gray-600 font-medium">Sua Entrada:</span>
                                    <span id="hero-res-entrada" class="font-bold text-gray-900 font-mono">R$ 0,00</span>
                                </div>
                                <div class="flex justify-between border-b border-brand-100/50 pb-3 text-sm">
                                    <span class="text-gray-600 font-medium">Valor Financiado:</span>
                                    <span id="hero-res-financiado" class="font-bold text-gray-900 font-mono">R$ 0,00</span>
                                </div>
                                <div class="text-center pt-3 bg-white rounded-xl p-4 shadow-sm border border-brand-100">
                                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Prestação Mensal Estimada</p>
                                    <h3 class="text-3xl font-black text-brand-600 font-mono flex items-baseline justify-center gap-1">
                                        <span id="hero-res-meses" class="text-xl">48</span>
                                        <span class="text-xl text-brand-400 font-sans">x</span> 
                                        <span id="hero-res-prestacao">R$ 0,00</span>
                                    </h3>
                                </div>
                            </div>

                            <!-- Recommended Alternates (Smart suggestion) -->
                            <div id="alternative-vehicles-container" class="space-y-3 hidden">
                                <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Opções dentro do seu limite aprovado:</p>
                                <div id="alternative-vehicles-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <!-- Dynamically loaded alternates -->
                                </div>
                            </div>

                            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800 items-start">
                                <i class="ph-fill ph-info text-blue-500 text-xl flex-shrink-0 mt-0.5"></i>
                                <p class="leading-snug">Envie sua simulação agora para a mesa de crédito FiveCred no WhatsApp e garanta estas condições.</p>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="button" onclick="advanceHeroStep(2)" class="w-full sm:w-1/3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl transition-all text-sm relative z-30">Refazer Simulação</button>
                                <a id="hero-whatsapp-sim-btn" href="#" target="_blank" class="w-full sm:w-2/3 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 text-sm sm:text-base relative z-30">
                                    <i class="ph-bold ph-whatsapp text-xl"></i>
                                    <span>Liberar Crédito no WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>"""

# Using regex to replace the hero section
pattern = r'<!-- Hero Section -->.*?<!-- Main Marketplace Section -->'
new_content = re.sub(pattern, new_hero + '\n\n    <!-- Main Marketplace Section -->', content, flags=re.DOTALL)

# --- PART 2: Shuffle array ---
shuffle_logic = """
        // Shuffle the vehicles array so AI generated images are mixed in naturally
        for (let i = vehicles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [vehicles[i], vehicles[j]] = [vehicles[j], vehicles[i]];
        }
        
        populateHeroCars();
"""

new_content = new_content.replace('populateHeroCars();', shuffle_logic, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
