
        // Real vehicle Database (15 popular Brazilian cars with real Mercado Livre cellphone photos)
        const vehicles = [
    { id: 1, brand: 'Apartamento', model: 'Apto Padrão Moema', year: 2, km: 1, price: 850000, fipe: 860000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina'] },
    { id: 2, brand: 'Casa', model: 'Casa Condomínio Fechado', year: 4, km: 3, price: 1550000, fipe: 1600000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Varanda Gourmet'] },
    { id: 3, brand: 'Casa', model: 'Sobrado Rua Tranquila', year: 3, km: 2, price: 620000, fipe: 635000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Churrasqueira'] },
    { id: 4, brand: 'Apartamento', model: 'Apto Studio Moderno', year: 1, km: 1, price: 420000, fipe: 430000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Academia'] },
    { id: 5, brand: 'Apartamento', model: 'Apto Reformado Pinheiros', year: 2, km: 1, price: 920000, fipe: 940000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Varanda Gourmet', 'Academia'] },
    { id: 6, brand: 'Casa', model: 'Mansão Alphaville', year: 5, km: 4, price: 3200000, fipe: 3350000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Piscina', 'Churrasqueira', 'Academia'] },
    { id: 7, brand: 'Terreno', model: 'Loteamento Litoral', year: 0, km: 0, price: 180000, fipe: 185000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 8, brand: 'Comercial', model: 'Sala Comercial Centro', year: 0, km: 1, price: 350000, fipe: 360000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 9, brand: 'Apartamento', model: 'Cobertura Duplex', year: 4, km: 3, price: 2100000, fipe: 2150000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Varanda Gourmet', 'Churrasqueira'] },
    { id: 10, brand: 'Casa', model: 'Casa Geminada', year: 2, km: 1, price: 450000, fipe: 465000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: [] },
    { id: 11, brand: 'Apartamento', model: 'Apto 3 Suites Vila Nova', year: 3, km: 2, price: 1800000, fipe: 1850000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Academia', 'Varanda Gourmet'] },
    { id: 12, brand: 'Casa', model: 'Casa de Campo Interior', year: 4, km: 4, price: 950000, fipe: 980000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Piscina', 'Churrasqueira'] },
    { id: 13, brand: 'Apartamento', model: 'Apto 1 Quarto Centro', year: 1, km: 0, price: 280000, fipe: 290000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 14, brand: 'Apartamento', model: 'Apto Vista Mar', year: 2, km: 1, price: 750000, fipe: 780000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Varanda Gourmet'] },
    { id: 15, brand: 'Casa', model: 'Sobrado Novo Alto Padrão', year: 3, km: 2, price: 1250000, fipe: 1300000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Churrasqueira'] },
    { id: 16, brand: 'Terreno', model: 'Lote Comercial', year: 0, km: 0, price: 550000, fipe: 560000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] },
    { id: 17, brand: 'Apartamento', model: 'Loft Alto Padrão', year: 1, km: 2, price: 680000, fipe: 690000, img: 'assets/imoveis/real_apartment_sp_1779906813709.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Academia', 'Piscina'] },
    { id: 18, brand: 'Casa', model: 'Casa Térrea Bairro Planejado', year: 3, km: 2, price: 780000, fipe: 800000, img: 'assets/imoveis/real_house_street_1779906828695.png', fipe_code: '0', isAI: false, status: 'Na Planta', features: ['Churrasqueira'] },
    { id: 19, brand: 'Apartamento', model: 'Apto Garden', year: 2, km: 2, price: 890000, fipe: 920000, img: 'assets/imoveis/real_kitchen_tile_1779906841637.png', fipe_code: '0', isAI: false, status: 'Pronto', features: ['Churrasqueira', 'Piscina'] },
    { id: 20, brand: 'Comercial', model: 'Andar Corporativo', year: 0, km: 5, price: 1500000, fipe: 1550000, img: 'assets/imoveis/real_condo_house_1779906858070.png', fipe_code: '0', isAI: false, status: 'Pronto', features: [] }
];

        // FIPE API Integration Configuration
        const fipeToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjYTdkMzk1ZS1jODYzLTQzNmMtYmNmYi1iZmExM2FiYTJlYWIiLCJlbWFpbCI6ImltcHVsc2lvbi5haW9maWNpYWxAZ21haWwuY29tIiwiaWF0IjoxNzc5ODkyNzMwfQ.YCIjsw4p5ALdVCMY9yl3FopntC7zrqF1lepXiO6Yd5c";
        
        // Dynamic FIPE client-side fetch helper with Bearer Authorization and public fallback
        async function fetchFipe(endpoint) {
            if (endpoint.startsWith("/")) endpoint = endpoint.substring(1);
            try {
                const res = await fetch(`https://api.apifipe.com.br/${endpoint}`, {
                    headers: {
                        "Authorization": `Bearer ${fipeToken}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && !data.mensagem) {
                        document.getElementById("hero-fipe-status").innerHTML = '<i class="ph ph-check-circle"></i> Live API';
                        return data;
                    }
                }
            } catch (e) {
                console.warn("apifipe.com.br failed, trying fallback...", e);
            }
            
            try {
                const res = await fetch(`https://parallelum.com.br/fipe/api/v1/${endpoint}`);
                if (res.ok) {
                    const data = await res.json();
                    document.getElementById("hero-fipe-status").innerHTML = '<i class="ph ph-check-circle"></i> Public Fallback';
                    return data;
                }
            } catch (e) {
                console.error("FIPE API fallback failed:", e);
            }
            return null;
        }

        // Fetch FIPE price by FIPE Code and Year
        async function fetchFipePriceByCode(code, year) {
            try {
                const yearsRes = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/codigoFipe/${code}/anos`);
                if (yearsRes.ok) {
                    const years = await yearsRes.json();
                    const matchedYear = years.find(y => y.codigo.startsWith(year.toString()));
                    if (matchedYear) {
                        const priceRes = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/codigoFipe/${code}/anos/${matchedYear.codigo}`);
                        if (priceRes.ok) {
                            const data = await priceRes.json();
                            if (data && data.Valor) {
                                document.getElementById("hero-fipe-status").innerHTML = '<i class="ph ph-check-circle"></i> FIPE Live';
                                const numericVal = parseInt(data.Valor.replace(/\D/g, '')) / 100;
                                return {
                                    value: numericVal,
                                    formatted: data.Valor
                                };
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching FIPE by code:", e);
            }
            return null;
        }

        // Pagination and filtering config
        const PAGE_SIZE = 6;
        let currentPage = 1;
        let activeTransmission = "";
        let activeCategory = "";
        let activeSubtype = ""; // filter for Utilitários (Caminhão / Caminhonete)
        let selectedCompareList = [];
        let currentSelectedCarForFinance = null;
        let activeHeroSimStep = 1;
        let currentFilteredItems = [];
        let currentFipePrice = 0;

        // Custom FIPE API lookup state
        let fipeBrands = [];
        let fipeModels = [];
        let fipeYears = [];

        // Initialization
        window.addEventListener("DOMContentLoaded", () => {
            // Shuffle the vehicles array so AI generated images are mixed in naturally
            for (let i = vehicles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [vehicles[i], vehicles[j]] = [vehicles[j], vehicles[i]];
            }
            
            applyFilters(true);
            setupInputMasks();
            checkCookieConsent();
            populateHeroCarSelect();
            populateFipeBrands();
        });

        // Populate Car selection dropdown in Hero form
        function populateHeroCarSelect() {
            const select = document.getElementById("hero-car-select");
            let options = '<option value="">Selecione o veículo...</option>';
            vehicles.forEach(car => {
                options += `<option value="${car.id}">${car.model} (${car.year} Quartos)</option>`;
            });
            options += '<option value="custom">-- Outro Veículo (Consultar FIPE) --</option>';
            select.innerHTML = options;
        }

        // Handle car select change
        async function onHeroCarChange() {
            const val = document.getElementById("hero-car-select").value;
            const customSelectors = document.getElementById("custom-fipe-selectors");
            const priceLabel = document.getElementById("hero-fipe-price-label");
            
            if (val === "custom") {
                customSelectors.classList.remove("hidden");
                currentSelectedCarForFinance = { brand: "Outro", model: "Veículo Customizado", year: 2023, price: 0 };
                currentFipePrice = 0;
                priceLabel.textContent = "Selecione Marca e Modelo";
            } else if (val) {
                customSelectors.classList.add("hidden");
                const car = vehicles.find(c => c.id === parseInt(val));
                currentSelectedCarForFinance = car;
                priceLabel.textContent = "Carregando FIPE...";
                
                const fipeData = await fetchFipePriceByCode(car.fipe_code, car.year);
                if (fipeData) {
                    currentFipePrice = fipeData.value;
                    priceLabel.textContent = fipeData.formatted;
                } else {
                    currentFipePrice = car.fipe;
                    priceLabel.textContent = "R$ " + car.fipe.toLocaleString('pt-BR') + ",00";
                    document.getElementById("hero-fipe-status").innerHTML = '<i class="ph ph-check-circle"></i> Local Cache';
                }
                
                configureHeroEntradaSlider(currentFipePrice);
            } else {
                customSelectors.classList.add("hidden");
                currentSelectedCarForFinance = null;
                currentFipePrice = 0;
                priceLabel.textContent = "R$ 0,00";
            }
        }

        function configureHeroEntradaSlider(fipePrice) {
            const slider = document.getElementById("hero-entrada");
            const minEntrada = Math.round(fipePrice * 0.20);
            const maxEntrada = Math.round(fipePrice * 0.80);
            slider.min = minEntrada;
            slider.max = maxEntrada;
            slider.value = minEntrada;
            updateHeroEntradaLabel(minEntrada);
        }

        // Custom FIPE dropdown populators
        async function populateFipeBrands() {
            const select = document.getElementById("hero-fipe-marca");
            select.innerHTML = '<option value="">Carregando marcas...</option>';
            const brands = await fetchFipe("carros/marcas");
            if (brands && brands.length > 0) {
                fipeBrands = brands;
                let options = '<option value="">Selecione a Marca...</option>';
                brands.forEach(b => {
                    options += `<option value="${b.codigo}">${b.nome}</option>`;
                });
                select.innerHTML = options;
            } else {
                select.innerHTML = '<option value="">Erro ao carregar</option>';
            }
        }

        async function onFipeMarcaChange() {
            const marcaId = document.getElementById("hero-fipe-marca").value;
            const selectModelo = document.getElementById("hero-fipe-modelo");
            const selectAno = document.getElementById("hero-fipe-ano");
            
            selectModelo.innerHTML = '<option value="">Carregando modelos...</option>';
            selectModelo.disabled = true;
            selectAno.innerHTML = '<option value="">Selecione...</option>';
            selectAno.disabled = true;
            
            if (!marcaId) return;
            
            const data = await fetchFipe(`carros/marcas/${marcaId}/modelos`);
            if (data && data.modelos) {
                let options = '<option value="">Selecione o Modelo...</option>';
                data.modelos.forEach(m => {
                    options += `<option value="${m.codigo}">${m.nome}</option>`;
                });
                selectModelo.innerHTML = options;
                selectModelo.disabled = false;
            } else {
                selectModelo.innerHTML = '<option value="">Erro ao carregar</option>';
            }
        }

        async function onFipeModeloChange() {
            const marcaId = document.getElementById("hero-fipe-marca").value;
            const modeloId = document.getElementById("hero-fipe-modelo").value;
            const selectAno = document.getElementById("hero-fipe-ano");
            
            selectAno.innerHTML = '<option value="">Carregando anos...</option>';
            selectAno.disabled = true;
            
            if (!marcaId || !modeloId) return;
            
            const anos = await fetchFipe(`carros/marcas/${marcaId}/modelos/${modeloId}/anos`);
            if (anos && anos.length > 0) {
                let options = '<option value="">Selecione o Ano...</option>';
                anos.forEach(a => {
                    options += `<option value="${a.codigo}">${a.nome}</option>`;
                });
                selectAno.innerHTML = options;
                selectAno.disabled = false;
            } else {
                selectAno.innerHTML = '<option value="">Erro ao carregar</option>';
            }
        }

        async function onFipeAnoChange() {
            const marcaId = document.getElementById("hero-fipe-marca").value;
            const modeloId = document.getElementById("hero-fipe-modelo").value;
            const anoId = document.getElementById("hero-fipe-ano").value;
            const priceLabel = document.getElementById("hero-fipe-price-label");
            
            if (!marcaId || !modeloId || !anoId) return;
            priceLabel.textContent = "Carregando Preço FIPE...";
            
            const details = await fetchFipe(`carros/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`);
            if (details && details.Valor) {
                const numericVal = parseInt(details.Valor.replace(/\D/g, '')) / 100;
                currentFipePrice = numericVal;
                priceLabel.textContent = details.Valor;
                
                const marcaText = document.getElementById("hero-fipe-marca").options[document.getElementById("hero-fipe-marca").selectedIndex].text;
                const modeloText = document.getElementById("hero-fipe-modelo").options[document.getElementById("hero-fipe-modelo").selectedIndex].text;
                const anoText = document.getElementById("hero-fipe-ano").options[document.getElementById("hero-fipe-ano").selectedIndex].text;
                
                currentSelectedCarForFinance = {
                    brand: marcaText,
                    model: modeloText,
                    year: parseInt(anoText.split(" ")[0]),
                    price: currentFipePrice
                };
                
                configureHeroEntradaSlider(currentFipePrice);
            } else {
                priceLabel.textContent = "Erro ao buscar preço";
            }
        }

        // Render catalog items
        function renderCatalog(items, resetPagination = false) {
            const grid = document.getElementById("vehicles-grid");
            const emptyState = document.getElementById("empty-state");
            const resultsCount = document.getElementById("results-count");
            const totalCount = document.getElementById("total-count");
            const loadMoreSection = document.getElementById("load-more-section");

            resultsCount.textContent = items.length;
            totalCount.textContent = vehicles.length;

            if (resetPagination) {
                currentPage = 1;
                grid.innerHTML = "";
            }

            if (items.length === 0) {
                grid.classList.add("hidden");
                loadMoreSection.classList.add("hidden");
                emptyState.classList.remove("hidden");
                emptyState.classList.add("flex");
                return;
            }

            grid.classList.remove("hidden");
            emptyState.classList.add("hidden");
            emptyState.classList.remove("flex");

            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = Math.min(currentPage * PAGE_SIZE, items.length);
            const pageItems = items.slice(startIndex, endIndex);

            const cardsHtml = pageItems.map((car, index) => {
                const rate = 0.0139;
                const periods = 48;
                const compound = Math.pow(1 + rate, periods);
                const estInstallment = Math.round((car.price * 0.8) * (rate * compound) / (compound - 1));
                const isCompared = selectedCompareList.some(c => c.id === car.id);
                
                return `
                    <div class="double-bezel fade-in-card cursor-pointer" data-id="${car.id}" style="animation-delay: ${index * 80}ms" onclick="onCardClick(event, ${car.id})">
                        <div class="double-bezel-inner flex flex-col h-full bg-white">
                            <div class="relative overflow-hidden aspect-[3/2]">
                                <img src="${car.image}" alt="${car.model}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110 bg-gray-100">
                                
                                <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                                    <span class="bg-emerald-600/90 backdrop-blur-sm text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <i class="ph ph-shield-check"></i> Laudo ${car.cautelar}
                                    </span>
                                    <span class="bg-gray-900/90 backdrop-blur-sm text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <i class="ph ph-seal-check"></i> Garantia 90d
                                    </span>
                                    <span class="bg-brand-600/90 backdrop-blur-sm text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                        <i class="ph ph-tag"></i> ${car.brand}
                                    </span>
                                </div>

                                <label class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-full cursor-pointer shadow-md hover:bg-white transition-colors flex items-center justify-center z-10" onclick="event.stopPropagation()">
                                    <input type="checkbox" onchange="toggleCompare(${car.id}, this)" ${isCompared ? 'checked' : ''} class="text-brand-500 focus:ring-brand-500 rounded border-gray-300 w-4 h-4 cursor-pointer">
                                    <span class="text-[10px] font-bold text-gray-700 px-1">Comparar</span>
                                </label>

                                <div class="absolute bottom-3 right-3 bg-gray-950/70 backdrop-blur-sm text-white text-[10px] font-semibold py-1 px-2.5 rounded-full flex items-center gap-1">
                                    <i class="ph ph-map-pin"></i> ${car.location}
                                </div>
                            </div>

                            <div class="p-5 flex-grow flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">${car.brand}</p>
                                    </div>
                                    <h4 class="font-bold text-gray-900 text-lg mt-0.5 line-clamp-1">${car.model}</h4>
                                    
                                    <div class="flex flex-wrap gap-1.5 mt-3">
                                        <span class="bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-1 rounded">${car.year} Quartos</span>
                                        <span class="bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-1 rounded font-mono">${car.km.toLocaleString()} VAGAS</span>
                                        <span class="bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-1 rounded">${car.transmission === 'Automatic' ? 'Na Planta' : 'Pronto'}</span>
                                        <span class="bg-gray-100 text-gray-500 font-bold text-[10px] px-2 py-1 rounded">${car.features.length > 0 ? car.features[0] : "Padrão"}</span>
                                    </div>

                                    <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-baseline">
                                        <div>
                                            <span class="text-[10px] text-gray-400 font-semibold block uppercase">Preço à Vista</span>
                                            <span class="font-black text-gray-950 text-xl font-mono">R$ ${car.price.toLocaleString('pt-BR')}</span>
                                        </div>
                                        <div class="text-right">
                                            <span class="text-[9px] text-gray-400 font-semibold block uppercase">Avaliação FIPE</span>
                                            <span class="text-xs text-gray-400 line-through font-mono">R$ ${car.fipe.toLocaleString('pt-BR')}</span>
                                        </div>
                                    </div>
                                    <div class="mt-3 bg-brand-50/50 rounded-xl p-3 border border-brand-100 flex items-center">
                                        <div>
                                            <span class="text-[9px] text-brand-600 font-bold uppercase tracking-wider block">Financiamento sugerido</span>
                                            <span class="text-xs sm:text-sm font-bold text-brand-700">Entrada + <span class="font-mono text-sm sm:text-base font-black">48x R$ ${estInstallment.toLocaleString('pt-BR')}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-5 flex gap-2" onclick="event.stopPropagation()">
                                    <button onclick="openHeroFinanceForCar(${car.id})" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-glow transition-all flex items-center justify-center gap-1 active:scale-95 duration-200">
                                        <i class="ph-bold ph-whatsapp text-base"></i> Simular Parcelas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            if (resetPagination) {
                grid.innerHTML = cardsHtml;
            } else {
                grid.insertAdjacentHTML('beforeend', cardsHtml);
            }

            if (endIndex < items.length) {
                loadMoreSection.classList.remove("hidden");
            } else {
                loadMoreSection.classList.add("hidden");
            }
        }

        // Handle card click (open side drawer)
        function onCardClick(e, id) {
            openDetailsDrawer(id);
        }

        // Load next page
        function loadMoreVehicles() {
            const btn = document.getElementById("load-more-btn");
            const btnText = document.getElementById("load-more-text");
            const btnIcon = document.getElementById("load-more-icon");
            const btnSpinner = document.getElementById("load-more-spinner");

            btn.disabled = true;
            btnText.textContent = "Carregando...";
            btnIcon.classList.add("hidden");
            btnSpinner.classList.remove("hidden");

            setTimeout(() => {
                currentPage++;
                renderCatalog(currentFilteredItems, false);
                btn.disabled = false;
                btnText.textContent = "Carregando Mais Carros";
                btnIcon.classList.remove("hidden");
                btnSpinner.classList.add("hidden");
            }, 400); 
        }

        // Sync Search
        function syncSearchAndScroll(input) {
            const val = input.value;
            document.getElementById("filter-search").value = val;
            applyFilters(true);
        }

        // Toggle mobile filters sidebar
        function toggleMobileFilters() {
            if (window.innerWidth >= 1024) return; // only on mobile/tablet
            const content = document.getElementById('filter-sidebar-content');
            const icon = document.getElementById('filter-toggle-icon');
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('expanded');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        }

        // Toggle mobile hamburger menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Toggle transmission
        function toggleTransmissionFilter(btn, value) {
            const btnAuto = document.getElementById("btn-cambio-auto");
            const btnNa Planta = document.getElementById("btn-cambio-manual");

            if (activeTransmission === value) {
                activeTransmission = "";
                btn.classList.remove("border-brand-500", "text-brand-500", "bg-brand-50/20");
                btn.classList.add("border-gray-200", "text-gray-700", "bg-gray-50");
            } else {
                activeTransmission = value;
                btnAuto.classList.remove("border-brand-500", "text-brand-500", "bg-brand-50/20");
                btnAuto.classList.add("border-gray-200", "text-gray-700", "bg-gray-50");
                btnNa Planta.classList.remove("border-brand-500", "text-brand-500", "bg-brand-50/20");
                btnNa Planta.classList.add("border-gray-200", "text-gray-700", "bg-gray-50");

                btn.classList.add("border-brand-500", "text-brand-500", "bg-brand-50/20");
                btn.classList.remove("border-gray-200", "text-gray-700", "bg-gray-50");
            }
            applyFilters(true);
        }

        // Toggle category
        function toggleCategoryFilter(btn, category) {
            document.querySelectorAll(".category-tab").forEach(tab => {
                tab.classList.remove("bg-brand-500", "text-white", "shadow-glow");
                tab.classList.add("bg-gray-50", "text-gray-600", "hover:bg-gray-100");
            });

            btn.classList.remove("bg-gray-50", "text-gray-600", "hover:bg-gray-100");
            btn.classList.add("bg-brand-500", "text-white", "shadow-glow");

            activeCategory = category;
            activeSubtype = ""; // Reset subtype when tab changes

            // Show submenu if "Utilitário/SUV" is selected
            const submenu = document.getElementById("utilitarios-submenu");
            if (category === "Utilitário/SUV") {
                submenu.classList.remove("hidden");
                // Reset active subtype tabs
                document.querySelectorAll(".submenu-tab").forEach(tab => tab.classList.remove("active"));
                document.querySelector(".submenu-tab:nth-child(2)").classList.add("active");
            } else {
                submenu.classList.add("hidden");
            }

            applyFilters(true);
        }

        // Filter Utilitário Subtype
        function filterUtilitarioSubtype(btn, subtype) {
            document.querySelectorAll(".submenu-tab").forEach(tab => tab.classList.remove("active"));
            btn.classList.add("active");
            activeSubtype = subtype;
            applyFilters(true);
        }

        // Apply filters
        function applyFilters(resetPage = false) {
            const query = document.getElementById("filter-search").value.toLowerCase().trim();
            const brand = document.getElementById("filter-type").value;
            const maxPriceVal = document.getElementById("filter-price-dropdown").value;
            const maxPrice = maxPriceVal ? parseFloat(maxPriceVal) : Infinity;
            const minYear = document.getElementById("filter-bedrooms").value ? parseInt(document.getElementById("filter-bedrooms").value) : 0;
            const minParking = document.getElementById("filter-parking").value ? parseInt(document.getElementById("filter-parking").value) : Infinity;
            
            const fuelCheckboxes = document.querySelectorAll('input[name="fuel"]:checked');
            const fuels = Array.from(fuelCheckboxes).map(cb => cb.value);

            currentFilteredItems = vehicles.filter(car => {
                if (query && !car.model.toLowerCase().includes(query) && !car.brand.toLowerCase().includes(query) && !car.brand.toLowerCase().includes(query)) return false;
                if (brand && car.brand !== brand) return false;
                if (activeCategory && car.brand !== activeCategory) {
                    // Electrics check: BYD Dolphin, BYD Song, Haval, Kwid E-Tech, Tesla can show in other tabs too
                    if (activeCategory === "Convencional" && car.brand === "Elétrico" && car.price < 150000) {
                        // let it pass
                    } else if (activeCategory === "Superesportivo" && car.brand === "Elétrico" && car.price >= 150000) {
                        // let it pass
                    } else {
                        return false;
                    }
                }
                if (activeCategory === "Utilitário/SUV" && activeSubtype && car.subtype !== activeSubtype) return false;
                if (car.price > maxPrice) return false;
                if (car.year < minYear) return false;
                if (car.km < maxKm) return false;
                if (activeTransmission && car.transmission !== activeTransmission) return false;
                if (fuels.length > 0 && !fuels.includes(car.fuel)) return false;
                return true;
            });

            renderCatalog(currentFilteredItems, resetPage);
            renderFilterTags();
        }

        // Tags
        function renderFilterTags() {
            const container = document.getElementById("filter-tags");
            let tagsHtml = "";

            const brand = document.getElementById("filter-type").value;
            if (brand) tagsHtml += createTag(`Marca: ${brand}`, () => { document.getElementById("filter-type").value = ""; applyFilters(true); });

            const maxPriceVal = document.getElementById("filter-price-dropdown").value;
            if (maxPriceVal) tagsHtml += createTag(`Preço até: R$ ${parseFloat(maxPriceVal).toLocaleString('pt-BR')}`, () => { document.getElementById("filter-price-dropdown").value = ""; applyFilters(true); });

            const minYear = document.getElementById("filter-bedrooms").value;
            if (minYear) tagsHtml += createTag(`Ano de: ${minYear}`, () => { document.getElementById("filter-bedrooms").value = ""; applyFilters(true); });

            const minParking = document.getElementById("filter-parking").value;
            if (maxKm) tagsHtml += createTag(`VAGAS até: ${parseInt(maxKm).toLocaleString('pt-BR')} VAGAS`, () => { document.getElementById("filter-parking").value = ""; applyFilters(true); });

            if (activeTransmission) tagsHtml += createTag(`Câmbio: ${activeTransmission === 'Automatic' ? 'Pronto' : 'Na Planta'}`, () => {
                const btn = activeTransmission === 'Automatic' ? document.getElementById("btn-cambio-auto") : document.getElementById("btn-cambio-manual");
                toggleTransmissionFilter(btn, activeTransmission);
            });

            if (activeCategory) tagsHtml += createTag(`Categoria: ${activeCategory}`, () => {
                const allTab = document.getElementById("tab-cat-all");
                toggleCategoryFilter(allTab, "");
            });

            container.innerHTML = tagsHtml;
        }

        function createTag(text, removeFnName) {
            const randomId = "tag_" + Math.random().toString(36).substr(2, 9);
            window[randomId] = removeFnName;
            return `
                <span class="inline-flex items-center gap-1 bg-brand-50 border border-brand-100 text-brand-700 font-semibold text-xs py-1 px-3 rounded-full">
                    ${text}
                    <button onclick="window['${randomId}'](); delete window['${randomId}'];" class="hover:text-brand-900 transition-colors text-sm font-bold flex items-center justify-center outline-none">&times;</button>
                </span>
            `;
        }

        function resetFilters() {
            document.getElementById("filter-search").value = "";
            document.getElementById("hero-search-input").value = "";
            document.getElementById("filter-type").value = "";
            document.getElementById("filter-price-dropdown").value = "";
            document.getElementById("filter-bedrooms").value = "";
            document.getElementById("filter-parking").value = "";
            
            const btnAuto = document.getElementById("btn-cambio-auto");
            const btnNa Planta = document.getElementById("btn-cambio-manual");
            btnAuto.classList.remove("border-brand-500", "text-brand-500", "bg-brand-50/20");
            btnAuto.classList.add("border-gray-200", "text-gray-700", "bg-gray-50");
            btnNa Planta.classList.remove("border-brand-500", "text-brand-500", "bg-brand-50/20");
            btnNa Planta.classList.add("border-gray-200", "text-gray-700", "bg-gray-50");
            activeTransmission = "";

            const allTab = document.getElementById("tab-cat-all");
            document.querySelectorAll(".category-tab").forEach(tab => {
                tab.classList.remove("bg-brand-500", "text-white", "shadow-glow");
                tab.classList.add("bg-gray-50", "text-gray-600", "hover:bg-gray-100");
            });
            allTab.classList.remove("bg-gray-50", "text-gray-600", "hover:bg-gray-100");
            allTab.classList.add("bg-brand-500", "text-white", "shadow-glow");
            activeCategory = "";

            const fuelCheckboxes = document.querySelectorAll('input[name="fuel"]:checked');
            fuelCheckboxes.forEach(cb => cb.checked = false);

            applyFilters(true);
        }

        // Compare
        function toggleCompare(id, checkbox) {
            const car = vehicles.find(c => c.id === id);
            if (checkbox.checked) {
                if (selectedCompareList.length >= 3) {
                    alert("Você pode comparar até 3 veículos de cada vez.");
                    checkbox.checked = false;
                    return;
                }
                selectedCompareList.push(car);
            } else {
                selectedCompareList = selectedCompareList.filter(c => c.id !== id);
            }
            renderCompareBar();
        }

        function renderCompareBar() {
            const bar = document.getElementById("compare-bar");
            const thumbs = document.getElementById("compare-thumbnails");

            if (selectedCompareList.length === 0) {
                bar.classList.add("translate-y-full");
                return;
            }

            bar.classList.remove("translate-y-full");
            thumbs.innerHTML = selectedCompareList.map(car => `
                <div class="relative h-12 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group flex-shrink-0">
                    <img src="${car.image}" alt="" class="w-full h-full object-cover">
                    <button onclick="removeFromCompare(${car.id})" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 text-[10px] flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
            `).join("");
        }

        function removeFromCompare(id) {
            selectedCompareList = selectedCompareList.filter(c => c.id !== id);
            renderCompareBar();
            
            const card = document.querySelector(`.double-bezel[data-id="${id}"]`);
            if (card) {
                const chk = card.querySelector('input[type="checkbox"]');
                if (chk) chk.checked = false;
            }
        }

        function openCompareModal() {
            const modal = document.getElementById("compare-modal");
            for (let i = 0; i < 3; i++) {
                document.getElementById(`comp-col-${i}`).innerHTML = "";
                document.getElementById(`comp-price-${i}`).textContent = "-";
                document.getElementById(`comp-fin-${i}`).textContent = "-";
                document.getElementById(`comp-year-${i}`).textContent = "-";
                document.getElementById(`comp-km-${i}`).textContent = "-";
                document.getElementById(`comp-trans-${i}`).textContent = "-";
                document.getElementById(`comp-fuel-${i}`).textContent = "-";
                document.getElementById(`comp-laudo-${i}`).innerHTML = "";
                document.getElementById(`comp-btn-${i}`).innerHTML = "";
            }

            selectedCompareList.forEach((car, index) => {
                const rate = 0.0139;
                const periods = 48;
                const compound = Math.pow(1 + rate, periods);
                const estInst = Math.round((car.price * 0.8) * (rate * compound) / (compound - 1));
                
                document.getElementById(`comp-col-${index}`).innerHTML = `
                    <div class="flex flex-col items-center text-center p-2">
                        <img src="${car.image}" class="h-16 w-24 object-cover rounded-xl border border-gray-200 mb-2">
                        <h5 class="font-bold text-gray-900 text-xs line-clamp-1">${car.model}</h5>
                    </div>
                `;
                document.getElementById(`comp-price-${index}`).textContent = `R$ ${car.price.toLocaleString('pt-BR')}`;
                document.getElementById(`comp-fin-${index}`).textContent = `48x de R$ ${estInst.toLocaleString('pt-BR')}`;
                document.getElementById(`comp-year-${index}`).textContent = car.year;
                document.getElementById(`comp-km-${index}`).textContent = `${car.km} Vagas`;
                document.getElementById(`comp-trans-${index}`).textContent = car.transmission === 'Automatic' ? 'Pronto' : 'Na Planta';
                document.getElementById(`comp-fuel-${index}`).textContent = car.fuel;
                document.getElementById(`comp-laudo-${index}`).innerHTML = `<span class="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs"><i class="ph ph-shield-check"></i> ${car.cautelar}</span>`;
                document.getElementById(`comp-btn-${index}`).innerHTML = `<button onclick="closeCompareModal(); openHeroFinanceForCar(${car.id})" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-glow transition-all w-full flex items-center justify-center gap-1"><i class="ph ph-whatsapp"></i> Simular</button>`;
            });

            modal.classList.remove("opacity-0", "pointer-events-none");
            modal.querySelector(".bg-white").classList.remove("scale-95");
        }

        function closeCompareModal() {
            const modal = document.getElementById("compare-modal");
            modal.classList.add("opacity-0", "pointer-events-none");
            modal.querySelector(".bg-white").classList.add("scale-95");
        }

        // Open finance simulation on the Hero form and auto-populate
        async function openHeroFinanceForCar(id) {
            scrollToHeroForm();
            const car = vehicles.find(c => c.id === id);
            currentSelectedCarForFinance = car;

            const select = document.getElementById("hero-car-select");
            select.value = id;
            document.getElementById("custom-fipe-selectors").classList.add("hidden");
            
            const priceLabel = document.getElementById("hero-fipe-price-label");
            priceLabel.textContent = "Carregando FIPE...";
            
            const fipeData = await fetchFipePriceByCode(car.fipe_code, car.year);
            if (fipeData) {
                currentFipePrice = fipeData.value;
                priceLabel.textContent = fipeData.formatted;
            } else {
                currentFipePrice = car.fipe;
                priceLabel.textContent = "R$ " + car.fipe.toLocaleString('pt-BR') + ",00";
                document.getElementById("hero-fipe-status").innerHTML = '<i class="ph ph-check-circle"></i> Local Cache';
            }

            configureHeroEntradaSlider(currentFipePrice);
            advanceHeroStep(1); // Go to step 1 (Seus Dados) after car is pre-selected
        }

        function scrollToHeroForm() {
            const formContainer = document.getElementById("hero-sim-form");
            if (formContainer) {
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function updateHeroEntradaLabel(val) {
            document.getElementById("hero-entrada-label").textContent = "R$ " + parseInt(val).toLocaleString('pt-BR');
        }

        // Wizard steps management
        function advanceHeroStep(step) {
            document.getElementById("hero-step-1").classList.add("hidden");
            document.getElementById("hero-step-2").classList.add("hidden");
            document.getElementById("hero-step-3").classList.add("hidden");

            if (step === 2 && activeHeroSimStep === 1) {
                if (!validateHeroStep1()) {
                    document.getElementById("hero-step-1").classList.remove("hidden");
                    return;
                }
            }

            if (step === 3 && activeHeroSimStep === 2) {
                if (!validateHeroStep2()) {
                    document.getElementById("hero-step-2").classList.remove("hidden");
                    return;
                }
                calculateHeroFinancing();
            }

            activeHeroSimStep = step;
            document.getElementById(`hero-step-${step}`).classList.remove("hidden");
        }

        // Form Validation formulas
        function validateHeroStep1() {
            let valid = true;
            const name = document.getElementById("hero-nome");
            const whatsapp = document.getElementById("hero-whatsapp");
            const cpf = document.getElementById("hero-cpf");
            const email = document.getElementById("hero-email");
            const nascimento = document.getElementById("hero-nascimento");
            const placa = document.getElementById("hero-placa");

            document.querySelectorAll("[id^='err-hero-']").forEach(p => p.classList.add("hidden"));

            if (name.value.trim().length < 4) {
                showHeroError("err-hero-nome", "Por favor, digite seu nome completo.");
                valid = false;
            }
            if (whatsapp.value.replace(/\D/g, "").length < 11) {
                showHeroError("err-hero-whatsapp", "Digite um celular válido com DDD.");
                valid = false;
            }
            if (!validaCPF(cpf.value)) {
                showHeroError("err-hero-cpf", "CPF inválido.");
                valid = false;
            }
            if (nascimento.value.replace(/\D/g, "").length < 8) {
                showHeroError("err-hero-nascimento", "Data de nascimento inválida.");
                valid = false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showHeroError("err-hero-email", "E-mail inválido.");
                valid = false;
            }
            if (placa.value.trim().length < 4) {
                showHeroError("err-hero-placa", "Digite os 4 últimos dígitos.");
                valid = false;
            }
            return valid;
        }

        function validateHeroStep2() {
            const selectVal = document.getElementById("hero-car-select").value;
            if (!selectVal) {
                alert("Por favor, selecione um veículo.");
                return false;
            }
            if (selectVal === "custom" && currentFipePrice === 0) {
                alert("Por favor, realize a busca da Tabela FIPE para continuar.");
                return false;
            }
            return true;
        }

        function showHeroError(elementId, msg) {
            const p = document.getElementById(elementId);
            p.textContent = msg;
            p.classList.remove("hidden");
        }

        // Hashing CPF to get a simulated credit score
        function calculateCpfScore(cpfVal) {
            const cleanCpf = cpfVal.replace(/\D/g, '');
            let hash = 0;
            for (let i = 0; i < cleanCpf.length; i++) {
                hash = cleanCpf.charCodeAt(i) + ((hash << 5) - hash);
            }
            // Generate deterministic score between 420 and 960
            const score = Math.abs(hash % 540) + 420;
            return score;
        }

        // Calculate Simulation results
        function calculateHeroFinancing() {
            const carVal = currentSelectedCarForFinance.price || currentFipePrice;
            const entrada = parseInt(document.getElementById("hero-entrada").value);
            const prazo = parseInt(document.getElementById("hero-parcelas").value);
            
            let taxa = 0.0139;
            if (prazo === 24) taxa = 0.0129;
            if (prazo === 36) taxa = 0.0135;
            if (prazo === 60) taxa = 0.0145;

            const financiado = carVal - entrada;
            const compoundInterest = Math.pow(1 + taxa, prazo);
            const prestacao = Math.round(financiado * (taxa * compoundInterest) / (compoundInterest - 1));

            // Set values on results tab
            document.getElementById("hero-res-fipe").textContent = `R$ ${carVal.toLocaleString('pt-BR')},00`;
            document.getElementById("hero-res-entrada").textContent = `R$ ${entrada.toLocaleString('pt-BR')},00`;
            document.getElementById("hero-res-financiado").textContent = `R$ ${financiado.toLocaleString('pt-BR')},00`;
            document.getElementById("hero-res-meses").textContent = prazo;
            document.getElementById("hero-res-prestacao").textContent = `R$ ${prestacao.toLocaleString('pt-BR')},00`;

            const name = document.getElementById("hero-nome").value;
            const phone = document.getElementById("hero-whatsapp").value;
            const cpf = document.getElementById("hero-cpf").value;
            const email = document.getElementById("hero-email").value;
            const nascimento = document.getElementById("hero-nascimento").value;
            const placa = document.getElementById("hero-placa").value;
            const uf = document.getElementById("hero-uf").value;

            // CPF Score assessment
            const score = calculateCpfScore(cpf);
            const scoreBadge = document.getElementById("cpf-score-badge");
            const statusTitle = document.getElementById("cpf-status-title");
            const limitDesc = document.getElementById("cpf-limit-desc");

            scoreBadge.textContent = `${score} (` + (score >= 800 ? "Excelente" : score >= 600 ? "Bom" : score >= 450 ? "Regular" : "Baixo") + ")";
            
            let limitApproved = 150000;
            if (score >= 800) {
                limitApproved = 900000;
                statusTitle.textContent = "✔ CRÉDITO PRÉ-APROVADO!";
                statusTitle.className = "font-black text-emerald-400 text-sm tracking-wide";
                limitDesc.textContent = "Excelente histórico de crédito. Taxa especial de 1.29% a.m. liberada.";
            } else if (score >= 600) {
                limitApproved = 160000;
                statusTitle.textContent = "✔ CRÉDITO PRÉ-APROVADO!";
                statusTitle.className = "font-black text-emerald-400 text-sm tracking-wide";
                limitDesc.textContent = "Bom perfil de crédito. Taxas especiais de parcelamento liberadas.";
            } else if (score >= 450) {
                limitApproved = 80000;
                statusTitle.textContent = "⚠ APROVAÇÃO COM CO-GARANTIDOR";
                statusTitle.className = "font-black text-amber-400 text-sm tracking-wide";
                limitDesc.textContent = "Crédito aprovado até R$ 80.000. Entrada mínima de 40% necessária.";
            } else {
                limitApproved = 50000;
                statusTitle.textContent = "❌ REQUER ENTRADA DE 50%";
                statusTitle.className = "font-black text-red-400 text-sm tracking-wide";
                limitDesc.textContent = "Perfil com restrição temporária. Aprovado até R$ 50.000 com 50% de entrada.";
            }

            // If selected vehicle is more expensive than limit, suggest alternative vehicles
            const alternatesContainer = document.getElementById("alternative-vehicles-container");
            if (carVal > limitApproved) {
                alternatesContainer.classList.remove("hidden");
                const eligibleAlternates = vehicles.filter(v => v.price <= limitApproved && v.id !== currentSelectedCarForFinance.id).slice(0, 2);
                const list = document.getElementById("alternative-vehicles-list");
                if (eligibleAlternates.length > 0) {
                    list.innerHTML = eligibleAlternates.map(alt => `
                        <div class="bg-white/10 hover:bg-white/20 p-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all" onclick="selectAlternateCar(${alt.id})">
                            <img src="${alt.image}" class="h-8 w-12 object-cover rounded-lg border border-white/15">
                            <div>
                                <p class="text-[9px] font-bold truncate text-white">${alt.model}</p>
                                <p class="text-[8px] font-mono text-brand-300">R$ ${alt.price.toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                    `).join("");
                } else {
                    list.innerHTML = `<p class="text-[8px] text-gray-400">Nenhum veículo disponível nesta faixa</p>`;
                }
            } else {
                alternatesContainer.classList.add("hidden");
            }

            // Save Lead to DB (SMS campaign capture webhook simulation)
            saveLeadData({
                name,
                phone,
                cpf,
                email,
                birthdate: nascimento,
                plate: placa,
                state: uf,
                vehicle: `${currentSelectedCarForFinance.brand} ${currentSelectedCarForFinance.model}`,
                price: carVal,
                entrada,
                prazo,
                prestacao
            });

            // Prefilled message text
            const textMsg = `Olá! Realizei uma simulação de financiamento no Marketplace FiveCred:\\n\\n` + 
                            `🚗 *Veículo:* ${currentSelectedCarForFinance.brand} ${currentSelectedCarForFinance.model} (${currentSelectedCarForFinance.year})\\n` +
                            `💰 *Valor FIPE:* R$ ${carVal.toLocaleString('pt-BR')},00\\n` +
                            `💳 *Financiamento:* Entrada de R$ ${entrada.toLocaleString('pt-BR')},00 + ${prazo}x de R$ ${prestacao.toLocaleString('pt-BR')},00\\n\\n` +
                            `*Dados do Lead:*\\n` +
                            `- Nome: ${name}\\n` +
                            `- WhatsApp: ${phone}\\n` +
                            `- CPF: ${cpf}\\n` +
                            `- Nascimento: ${nascimento}\\n` +
                            `- E-mail: ${email}\\n` +
                            `- Placa (final): ${placa}\\n` +
                            `- Estado: ${uf}\\n\\n` +
                            `Por favor, dê andamento na aprovação rápida no banco parceiro!`;

            const whatsappBtn = document.getElementById("hero-whatsapp-sim-btn");
            whatsappBtn.href = `https://wa.me/5511981655768?text=${encodeURIComponent(textMsg)}`;
        }

        // Select alternate vehicle suggested in Step 3
        function selectAlternateCar(id) {
            const select = document.getElementById("hero-car-select");
            select.value = id;
            onHeroCarChange();
            advanceHeroStep(1); // Return to Step 1 showing alternative vehicle!
        }

        // SMS Nurturing and lead collector logic (agentphone & backend-architect spec)
        function saveLeadData(lead) {
            // Save lead details locally
            let leads = JSON.parse(localStorage.getItem("fivecred_leads") || "[]");
            leads.push({ ...lead, timestamp: new Date().toISOString() });
            localStorage.setItem("fivecred_leads", JSON.stringify(leads));

            // Log SMS Queue schedule to show lead is captured and SMS is active
            console.log(`[Backend Architect] Lead captured for ${lead.phone}. Scheduling weekly nurturing campaign:`);
            console.log(`- SMS 1 (Week 1): Olá ${lead.name}, a FiveCred aprovou sua ficha para o ${lead.vehicle}! Responda para liberar o Pix.`);
            console.log(`- SMS 2 (Week 2): Oi ${lead.name}, ainda pensando no ${lead.vehicle}? Nossas taxas reduzidas de ${lead.prazo}x R$ ${lead.prestacao.toLocaleString('pt-BR')} expiram hoje!`);
            
            // Send request to mock API endpoint
            fetch("https://api.fivecred.online/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lead)
            }).catch(e => {
                // Fails silently, standard client fallback
                console.log("[Backend Architect] Webhook offline, cached lead locally.");
            });
        }

        function recalculateHeroInstallments() {
            if (activeHeroSimStep === 3) {
                calculateHeroFinancing();
            }
        }

        // Lateral drawer functions
        let currentDrawerActiveImageIndex = 0;
        let currentDrawerCar = null;

        function openDetailsDrawer(id) {
            const car = vehicles.find(c => c.id === id);
            currentDrawerCar = car;
            currentDrawerActiveImageIndex = 0;

            const drawer = document.getElementById("vehicle-details-drawer");
            const panel = document.getElementById("details-drawer-panel");
            const backdrop = document.getElementById("details-drawer-backdrop");

            // Build specifications table and features list
            const features = [
                "Ar Condicionado", "Direção Hidráulica", "Vidros Lançamentos", 
                "Central Multimídia", "Freios ABS", "Airbag Duplo", 
                "Alarme Antifurto", "Travas Elétricas"
            ];
            
            // Porsche and luxury supercar specialties
            if (car.brand === "Superesportivo") {
                features.push("Bancos em Couro", "Controle de Tração", "Piloto Pronto");
            }

            const galleryHtml = car.gallery.map((img, index) => `
                <div class="carousel-slide flex-shrink-0 w-full h-full relative ${index === 0 ? '' : 'hidden'}" data-index="${index}">
                    <img src="${img}" class="w-full h-full object-cover bg-gray-100">
                </div>
            `).join("");

            const dotsHtml = car.gallery.map((_, index) => `
                <button onclick="setDrawerImage(${index})" class="h-2 w-2 rounded-full ${index === 0 ? 'bg-brand-500' : 'bg-gray-300'} transition-all" id="drawer-dot-${index}"></button>
            `).join("");

            panel.innerHTML = `
                <!-- Close Button -->
                <button onclick="closeDetailsDrawer()" class="absolute top-4 right-4 bg-gray-900/60 backdrop-blur-sm text-white rounded-full p-2 hover:bg-gray-950 transition-colors z-20">
                    <i class="ph ph-x text-xl"></i>
                </button>

                <!-- Photo Carousel -->
                <div class="relative w-full aspect-[3/2] overflow-hidden bg-gray-100">
                    <div id="drawer-carousel" class="w-full h-full flex transition-transform duration-300">
                        ${galleryHtml}
                    </div>
                    
                    <!-- Carousel Controls (if multiple images) -->
                    ${car.gallery.length > 1 ? `
                        <button onclick="prevDrawerImage()" class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-all">
                            <i class="ph ph-caret-left-bold text-sm"></i>
                        </button>
                        <button onclick="nextDrawerImage()" class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-all">
                            <i class="ph ph-caret-right-bold text-sm"></i>
                        </button>
                        <div class="absolute bottom-3 left-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-1.5">
                            ${dotsHtml}
                        </div>
                    ` : ''}
                </div>

                <!-- Drawer Content scroll area -->
                <div class="p-6 overflow-y-auto flex-grow space-y-6">
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">${car.brand}</span>
                            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-0.5"><i class="ph ph-shield-check"></i> Laudo ${car.cautelar}</span>
                        </div>
                        <h3 class="font-extrabold text-gray-900 text-2xl mt-2">${car.model}</h3>
                        <p class="text-xs text-gray-400 font-medium">Localização: ${car.location}</p>
                    </div>

                    <!-- FIPE & Pricing Box -->
                    <div class="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex justify-between items-center">
                        <div>
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Preço à Vista</span>
                            <span class="text-2xl font-black text-gray-900 font-mono">R$ ${car.price.toLocaleString('pt-BR')}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Avaliação FIPE</span>
                            <span class="text-sm text-gray-500 font-bold line-through font-mono">R$ ${car.fipe.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>

                    <!-- Tech Specifications -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Especificações</h4>
                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div class="flex justify-between py-1 border-b border-gray-50">
                                <span class="text-gray-400">Ano:</span>
                                <span class="font-bold text-gray-800">${car.year} Quartos</span>
                            </div>
                            <div class="flex justify-between py-1 border-b border-gray-50">
                                <span class="text-gray-400">VAGAS:</span>
                                <span class="font-bold text-gray-800 font-mono">${car.km.toLocaleString()} VAGAS</span>
                            </div>
                            <div class="flex justify-between py-1 border-b border-gray-50">
                                <span class="text-gray-400">Câmbio:</span>
                                <span class="font-bold text-gray-800">${car.transmission === 'Automatic' ? 'Pronto' : 'Na Planta'}</span>
                            </div>
                            <div class="flex justify-between py-1 border-b border-gray-50">
                                <span class="text-gray-400">Combustível:</span>
                                <span class="font-bold text-gray-800">${car.features.length > 0 ? car.features[0] : "Padrão"}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Features optional checklist -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Opcionais do Veículo</h4>
                        <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            ${features.map(f => `
                                <div class="flex items-center gap-1.5">
                                    <i class="ph ph-check text-emerald-600 font-bold"></i>
                                    <span>${f}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <!-- Footer simulation trigger -->
                <div class="p-6 border-t border-gray-100 bg-gray-50">
                    <button onclick="closeDetailsDrawer(); openHeroFinanceForCar(${car.id})" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95 duration-200">
                        <i class="ph ph-whatsapp text-lg"></i> Simular Agora
                    </button>
                </div>
            `;

            drawer.classList.remove("hidden");
            setTimeout(() => {
                backdrop.classList.remove("opacity-0");
                panel.classList.remove("translate-x-full");
            }, 50);
        }

        function closeDetailsDrawer() {
            const drawer = document.getElementById("vehicle-details-drawer");
            const panel = document.getElementById("details-drawer-panel");
            const backdrop = document.getElementById("details-drawer-backdrop");

            backdrop.classList.add("opacity-0");
            panel.classList.add("translate-x-full");

            setTimeout(() => {
                drawer.classList.add("hidden");
            }, 300);
        }

        function setDrawerImage(index) {
            currentDrawerActiveImageIndex = index;
            const slides = document.querySelectorAll(".carousel-slide");
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.remove("hidden");
                } else {
                    slide.classList.add("hidden");
                }
            });

            // Update dots
            currentDrawerCar.gallery.forEach((_, i) => {
                const dot = document.getElementById(`drawer-dot-${i}`);
                if (dot) {
                    if (i === index) {
                        dot.classList.add("bg-brand-500");
                        dot.classList.remove("bg-gray-300");
                    } else {
                        dot.classList.remove("bg-brand-500");
                        dot.classList.add("bg-gray-300");
                    }
                }
            });
        }

        function prevDrawerImage() {
            let nextIndex = currentDrawerActiveImageIndex - 1;
            if (nextIndex < 0) nextIndex = currentDrawerCar.gallery.length - 1;
            setDrawerImage(nextIndex);
        }

        function nextDrawerImage() {
            let nextIndex = currentDrawerActiveImageIndex + 1;
            if (nextIndex >= currentDrawerCar.gallery.length) nextIndex = 0;
            setDrawerImage(nextIndex);
        }

        // input masks
        function setupInputMasks() {
            document.getElementById("hero-whatsapp").addEventListener("input", function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });

            document.getElementById("hero-cpf").addEventListener("input", function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
                e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + (x[3] ? '.' + x[3] : '') + (x[4] ? '-' + x[4] : '');
            });

            document.getElementById("hero-nascimento").addEventListener("input", function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : x[1] + '/' + x[2] + (x[3] ? '/' + x[3] : '');
            });

            document.getElementById("hero-placa").addEventListener("input", function(e) {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            });
        }

        // Validate CPF
        function validaCPF(cpfVal) {
            cpfVal = cpfVal.replace(/\D/g, '');
            if (cpfVal.length !== 11 || /^(\d)\1{10}$/.test(cpfVal)) return false;
            let soma = 0, resto;
            for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpfVal.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            if (resto !== parseInt(cpfVal.substring(9, 10))) return false;
            soma = 0;
            for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpfVal.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            if (resto !== parseInt(cpfVal.substring(10, 11))) return false;
            return true;
        }

        // FAQ Toggle
        function toggleFaq(card) {
            const p = card.querySelector("p");
            const icon = card.querySelector("i");
            p.classList.toggle("hidden");
            icon.classList.toggle("rotate-180");
        }

        // Cookie Consent Logic
        function checkCookieConsent() {
            if (!localStorage.getItem("cookie_consent")) {
                document.getElementById("cookie-banner").classList.remove("hidden");
                document.getElementById("cookie-banner").classList.add("flex");
            }
        }
        function acceptCookies() {
            localStorage.setItem("cookie_consent", "accepted");
            document.getElementById("cookie-banner").classList.add("hidden");
            document.getElementById("cookie-banner").classList.remove("flex");
        }
        function rejectCookies() {
            localStorage.setItem("cookie_consent", "rejected");
            document.getElementById("cookie-banner").classList.add("hidden");
            document.getElementById("cookie-banner").classList.remove("flex");
        }
    