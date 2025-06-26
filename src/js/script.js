document.addEventListener('DOMContentLoaded', () => {
    // Elementos Globais
    const mainTitle = document.getElementById('mainTitle');
    const baseUrlInput = document.getElementById('modalBaseUrl');
    const authTokenInput = document.getElementById('modalAuthToken');

    // Elementos do Modal
    const settingsGear = document.getElementById('settingsGear');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = document.getElementById('saveSettings');
    const clearUrlHistoryButton = document.getElementById('clearUrlHistoryButton');

    // Elementos do Tema
    const themeToggle = document.getElementById('themeToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const lightThemeButton = document.getElementById('lightThemeButton');
    const darkThemeButton = document.getElementById('darkThemeButton');
    const bodyElement = document.body;
    const mainContainer = document.getElementById('mainContainer');

    // Abas e Seções de Função HTTP
    const httpRequestSimulatorContent = document.getElementById('httpRequestSimulatorContent');
    const tabButtons = document.querySelectorAll('.tab-button');
    const methodSections = document.querySelectorAll('.method-section');
    const statusCodeDisplay = document.getElementById('statusCodeDisplay');
    const responseTimeDisplay = document.getElementById('responseTimeDisplay');
    const responseSizeDisplay = document.getElementById('responseSizeDisplay');

    // Elementos de Resposta
    const bodyTabButton = document.getElementById('bodyTabButton');
    const headersTabButton = document.getElementById('headersTabButton');
    const responseBodyContainer = document.getElementById('responseBodyContainer');
    const responseHeadersContainer = document.getElementById('responseHeadersContainer');
    const responseBodyDisplay = document.getElementById('responseBodyDisplay');
    const responseHeadersDisplay = document.getElementById('responseHeadersDisplay');

    // Elementos do Tooltip de Tempo
    const responseTimeTooltip = document.getElementById('responseTimeTooltip');
    const tooltipDnsLookup = document.getElementById('tooltipDnsLookup');
    const tooltipTcpHandshake = document.getElementById('tooltipTcpHandshake');
    const tooltipSslHandshake = document.getElementById('tooltipSslHandshake');
    const tooltipTtfb = document.getElementById('tooltipTtfb');
    const tooltipDownload = document.getElementById('tooltipDownload');
    const tooltipProcess = document.getElementById('tooltipProcess');

    // Elementos do Tooltip de Tamanho
    const responseSizeTooltip = document.getElementById('responseSizeTooltip');
    const tooltipResponseHeadersSize = document.getElementById('tooltipResponseHeadersSize');
    const tooltipResponseBodySize = document.getElementById('tooltipResponseBodySize');
    const tooltipRequestHeadersSize = document.getElementById('tooltipRequestHeadersSize');
    const tooltipRequestBodySize = document.getElementById('tooltipRequestBodySize');

    // Mapeamento de Tooltips para Botões
    const methodTooltips = {
        postTab: {
            element: document.getElementById('postTooltip'),
            content: "Método para enviar dados a um recurso específico, geralmente resultando em uma mudança de estado ou a criação de um novo recurso."
        },
        getTab: {
            element: document.getElementById('getTooltip'),
            content: "Método para solicitar dados de um recurso especificado. Requisições GET devem apenas receber dados."
        },
        putTab: {
            element: document.getElementById('putTooltip'),
            content: "Método para substituir todas as representações atuais do recurso de destino pelos dados da requisição."
        },
        patchTab: {
            element: document.getElementById('patchTooltip'),
            content: "Método para aplicar modificações parciais a um recurso."
        },
        deleteTab: {
            element: document.getElementById('deleteTooltip'),
            content: "Método para deletar o recurso especificado."
        },
        headTab: {
            element: document.getElementById('headTooltip'),
            content: "Método idêntico ao GET, mas sem o corpo da resposta. Útil para obter metadados."
        },
        optionsTab: {
            element: document.getElementById('optionsTooltip'),
            content: "Método para descrever as opções de comunicação para o recurso de destino."
        }
    };
    let tooltipTimeout; // Variável para armazenar o ID do timeout do tooltip

    // Objeto para armazenar as respostas por função.
    const methodResponses = {
        POST: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        GET: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        PUT: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        PATCH: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        DELETE: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        HEAD: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        },
        OPTIONS: {
            statusCode: null,
            body: null,
            time: null,
            size: null,
            headers: null,
            detailedTiming: null,
            detailedSize: null
        }
    };

    // Variável para rastrear a função ativa.
    let activeMethod = 'POST'; // Inicia com POST como ativo.

    // Objeto para armazenar o histórico de URLs por função.
    let urlHistories = JSON.parse(localStorage.getItem('urlHistories')) || {
        POST: [],
        GET: [],
        PUT: [],
        PATCH: [],
        DELETE: [],
        HEAD: [],
        OPTIONS: []
    };

    // Mapeamento para obter os IDs de input com base no função ativo.
    const methodInputMap = {
        POST: {
            url: 'postUrl',
            headersCheckbox: 'postHeadersCheckbox',
            headersContainer: 'postHeadersContainer',
            body: 'postBody'
        },
        GET: {
            url: 'getUrl',
            headersCheckbox: 'getHeadersCheckbox',
            headersContainer: 'getHeadersContainer',
            body: null
        },
        PUT: {
            url: 'putUrl',
            headersCheckbox: 'putHeadersCheckbox',
            headersContainer: 'putHeadersContainer',
            body: 'putBody'
        },
        PATCH: {
            url: 'patchUrl',
            headersCheckbox: 'patchHeadersCheckbox',
            headersContainer: 'patchHeadersContainer',
            body: 'patchBody'
        },
        DELETE: {
            url: 'deleteUrl',
            headersCheckbox: 'deleteHeadersCheckbox',
            headersContainer: 'deleteHeadersContainer',
            body: null
        },
        HEAD: {
            url: 'headUrl',
            headersCheckbox: 'headHeadersCheckbox',
            headersContainer: 'headHeadersContainer',
            body: null
        },
        OPTIONS: {
            url: 'optionsUrl',
            headersCheckbox: 'optionsHeadersCheckbox',
            headersContainer: 'optionsHeadersContainer',
            body: null
        }
    };

    // Mapeamento de códigos de status HTTP para mensagens
    const statusCodeMessages = {
        100: 'Continue',
        101: 'Switching Protocols',
        102: 'Processing',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        207: 'Multi-Status',
        208: 'Already Reported',
        226: 'IM Used',
        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        305: 'Use Proxy',
        307: 'Temporary Redirect',
        308: 'Permanent Redirect',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Payload Too Large',
        414: 'URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable',
        417: 'Expectation Failed',
        418: 'I\'m a teapot',
        421: 'Misdirected Request',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        425: 'Too Early',
        426: 'Upgrade Required',
        428: 'Precondition Required',
        429: 'Too Many Requests',
        431: 'Request Header Fields Too Large',
        451: 'Unavailable For Legal Reasons',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        508: 'Loop Detected',
        510: 'Not Extended',
        511: 'Network Authentication Required'
    };

    // --- Variáveis e elementos da Simulação de Carga (Load Test) ---
    const loadTestToggleBtn = document.getElementById('loadTestToggleBtn');
    const loadTestContainer = document.getElementById('loadTestContainer');
    const intervalInput = document.getElementById('intervalInput');
    const loadTestUrlInput = document.getElementById('loadTestUrlInput');
    const loadTestMethodSelect = document.getElementById('loadTestMethodSelect');
    const loadTestBodyInput = document.getElementById('loadTestBodyInput');
    const loadTestBodyContainer = document.getElementById('loadTestBodyContainer'); // Container for load test body
    const startLoadTestButton = document.getElementById('startLoadTestButton');
    const stopLoadTestButton = document.getElementById('stopLoadTestButton');
    const resetLoadTestButton = document.getElementById('resetLoadTestButton');
    const totalSentDisplay = document.getElementById('totalSentDisplay');
    const successCountDisplay = document.getElementById('successCountDisplay');
    const failureCountDisplay = document.getElementById('failureCountDisplay');

    let loadTestIntervalId = null;
    let totalSent = 0;
    let successCount = 0;
    let failureCount = 0;

    // --- Funções de Simulação de Carga ---

    /**
     * Inicia a simulação de carga.
     */
    async function startLoadTest() {
        const interval = parseInt(intervalInput.value);
        if (isNaN(interval) || interval < 10) {
            //Alerta substituído por um simples log de console para o ambiente de tela
            alert('Por favor, insira um intervalo válido (mínimo 10ms).');
            return;
        }

        const loadTestEndpoint = loadTestUrlInput.value.trim();
        if (!loadTestEndpoint) {
            //Alerta substituído por um simples log de console para o ambiente de tela
            alert('Por favor, insira um Endpoint para o teste de carga.');
            return;
        }

        const loadTestMethod = loadTestMethodSelect.value;
        const fullLoadTestUrl = `${baseUrlInput.value}${loadTestEndpoint}`;

        let loadTestBody = null;
        if (['POST', 'PUT', 'PATCH'].includes(loadTestMethod)) {
            try {
                loadTestBody = loadTestBodyInput.value.trim();
                if (loadTestBody) {
                    JSON.parse(loadTestBody); // Validate JSON
                }
            } catch (e) {
                // Alerta substituído por um simples log de console para o ambiente de tela
                console.error('Erro: JSON do Body de carga inválido!');
                return;
            }
        }

        startLoadTestButton.disabled = true;
        stopLoadTestButton.disabled = false;
        intervalInput.disabled = true;
        loadTestUrlInput.disabled = true;
        loadTestMethodSelect.disabled = true;
        loadTestBodyInput.disabled = true;
        resetLoadTestButton.disabled = true; // Desabilita o reset durante a simulação.

        let successfulInInterval = 0;
        let failedInInterval = 0;

        loadTestIntervalId = setInterval(async () => {
            totalSent++;
            totalSentDisplay.textContent = totalSent;

            const requestOptions = {method: loadTestMethod, headers: {}};

            // Adiciona Authorization header se existir na configuração global
            const globalAuthToken = authTokenInput.value;
            if (globalAuthToken) {
                requestOptions.headers['Authorization'] = `Bearer ${globalAuthToken}`;
            }

            // Adiciona Content-Type para métodos com body
            if (loadTestBody && ['POST', 'PUT', 'PATCH'].includes(loadTestMethod)) {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = loadTestBody;
            }

            try {
                const response = await fetch(fullLoadTestUrl, requestOptions);
                if (response.ok) {
                    successCount++;
                    successfulInInterval++;
                } else {
                    failureCount++;
                    failedInInterval++;
                }
            } catch (error) {
                failureCount++;
                failedInInterval++;
                console.error('Erro na requisição de carga:', error);
            } finally {
                successCountDisplay.textContent = successCount;
                failureCountDisplay.textContent = failureCount;
            }
        }, interval);
    }

    /**
     * Para a simulação de carga.
     */
    function stopLoadTest() {
        clearInterval(loadTestIntervalId);
        loadTestIntervalId = null;
        startLoadTestButton.disabled = false;
        stopLoadTestButton.disabled = true;
        intervalInput.disabled = false;
        loadTestUrlInput.disabled = false;
        loadTestMethodSelect.disabled = false;
        loadTestBodyInput.disabled = false;
        resetLoadTestButton.disabled = false; // Habilita o reset após parar a simulação.
    }

    /**
     * Reseta todas as estatísticas e o gráfico da simulação de carga.
     */
    function resetLoadTest() {
        stopLoadTest(); // Garante que a simulação esteja parada
        totalSent = 0;
        successCount = 0;
        failureCount = 0;
        totalSentDisplay.textContent = '0';
        successCountDisplay.textContent = '0';
        failureCountDisplay.textContent = '0';
    }


    /**
     * Alterna a exibição entre a interface de requisição/resposta e a interface de teste de carga.
     */
    function toggleLoadTestView() {
        const isLoadTestActive = httpRequestSimulatorContent.classList.contains('hidden');

        if (isLoadTestActive) { // Mudar para tela de requisição
            mainTitle.textContent = 'Caça CORS - Requisições HTTP';
            loadTestToggleBtn.textContent = 'Carga';
            httpRequestSimulatorContent.classList.remove('hidden');
            loadTestContainer.classList.add('hidden');
            stopLoadTest(); // Garante que a simulação pare ao voltar para a tela de requisição.
        } else { // Mudar para tela de carga
            mainTitle.textContent = 'Teste de Carga';
            loadTestToggleBtn.textContent = 'Requisição';
            httpRequestSimulatorContent.classList.add('hidden');
            loadTestContainer.classList.remove('hidden');
            resetLoadTest(); // Reseta os dados do teste de carga
        }
    }

    // Event listener para exibir/ocultar o campo de Body para o teste de carga
    loadTestMethodSelect.addEventListener('change', () => {
        const selectedMethod = loadTestMethodSelect.value;
        if (['POST', 'PUT', 'PATCH'].includes(selectedMethod)) {
            loadTestBodyContainer.classList.remove('hidden');
        } else {
            loadTestBodyContainer.classList.add('hidden');
        }
    });


    // --- Fim das Funções de Simulação de Carga ---


    // Carrega as configurações salvas (se existirem)
    function loadSettings() {
        const savedBaseUrl = localStorage.getItem('baseUrl');
        const savedAuthToken = localStorage.getItem('authToken');
        if (savedBaseUrl) {
            baseUrlInput.value = savedBaseUrl;
        }
        if (savedAuthToken) {
            authTokenInput.value = savedAuthToken;
        }
    }

    // Salva as configurações
    function saveSettings() {
        localStorage.setItem('baseUrl', baseUrlInput.value);
        localStorage.setItem('authToken', authTokenInput.value);
        settingsModal.classList.add('hidden');
    }

    /**
     * Limpa os campos de status, body e headers da resposta para o estado inicial.
     */
    function resetResponseDisplay() {
        statusCodeDisplay.className = 'p-3 text-lg font-bold rounded-md bg-gray-100 text-gray-800 text-center w-full';
        statusCodeDisplay.textContent = 'Aguardando...';
        responseBodyDisplay.textContent = 'Aguardando resposta...';
        responseHeadersDisplay.textContent = 'Aguardando cabeçalhos...';
        responseTimeDisplay.textContent = '-- ms';
        responseSizeDisplay.textContent = '-- KB';

        // Garante que o body esteja visível e headers escondidos por padrão
        bodyTabButton.classList.add('active-response-tab');
        headersTabButton.classList.remove('active-response-tab');
        responseBodyContainer.classList.remove('hidden');
        responseHeadersContainer.classList.add('hidden');
    }

    /**
     * Atualiza a exibição da resposta com os dados fornecidos.
     * @param {number|null|string} statusCode - O código de status da resposta ou uma mensagem de erro.
     * @param {string|null} responseBody - O corpo da resposta.
     * @param {string} method - A função HTTP ao qual a resposta pertence.
     * @param {number|null} responseTime - O tempo de resposta em milissegundos.
     * @param {number|null} responseSize - O tamanho da resposta em bytes.
     * @param {string|null} responseHeaders - Os cabeçalhos da resposta formatados como string.
     * @param {object|null} detailedTiming - Objeto com detalhes de tempo da requisição.
     * @param {object|null} detailedSize - Objeto com detalhes de tamanho da requisição.
     */
    function updateResponseDisplay(statusCode, responseBody, method, responseTime, responseSize, responseHeaders, detailedTiming, detailedSize) {
        // Salva a resposta no armazenamento específico da função.
        methodResponses[method].statusCode = statusCode;
        methodResponses[method].body = responseBody;
        methodResponses[method].time = responseTime;
        methodResponses[method].size = responseSize;
        methodResponses[method].headers = responseHeaders;
        methodResponses[method].detailedTiming = detailedTiming;
        methodResponses[method].detailedSize = detailedSize;

        // Limpa as classes de estilo antigas antes de aplicar as novas
        statusCodeDisplay.className = 'p-3 text-lg font-bold rounded-md text-center w-full';
        responseTimeDisplay.className = 'p-3 text-lg font-bold rounded-md bg-gray-100 text-gray-800 text-center w-full cursor-help';
        responseSizeDisplay.className = 'p-3 text-lg font-bold rounded-md bg-gray-100 text-gray-800 text-center w-full cursor-help';

        // Atualiza Status Code
        if (typeof statusCode === 'string' && (statusCode.includes('Erro') || statusCode.includes('inválido'))) {
            statusCodeDisplay.textContent = statusCode;
            statusCodeDisplay.classList.add('bg-red-100', 'text-red-700');
        } else if (statusCode !== null) {
            const statusText = statusCodeMessages[statusCode] || 'Unknown';
            statusCodeDisplay.textContent = `${statusCode} ${statusText}`;
            if (statusCode >= 200 && statusCode < 300) {
                statusCodeDisplay.classList.add('bg-status-success', 'text-status-success');
            } else if (statusCode >= 300 && statusCode < 400) {
                statusCodeDisplay.classList.add('bg-status-redirect', 'text-status-redirect');
            } else if (statusCode >= 400 && statusCode < 500) {
                statusCodeDisplay.classList.add('bg-status-client-error', 'text-status-client-error');
            } else if (statusCode >= 500) {
                statusCodeDisplay.classList.add('bg-status-server-error', 'text-status-server-error');
            } else {
                statusCodeDisplay.classList.add('bg-status-default', 'text-status-default');
            }
        } else {
            statusCodeDisplay.textContent = 'Aguardando...';
            statusCodeDisplay.classList.add('bg-gray-100', 'text-gray-800');
        }

        // Atualiza Tempo de Resposta
        if (responseTime !== null) {
            responseTimeDisplay.textContent = `${responseTime.toFixed(2)} ms`;
        } else {
            responseTimeDisplay.textContent = '-- ms';
        }

        // Atualiza Tamanho da Resposta
        if (responseSize !== null) {
            const sizeInKB = (responseSize / 1024).toFixed(2);
            responseSizeDisplay.textContent = `${sizeInKB} KB`;
        } else {
            responseSizeDisplay.textContent = '-- KB';
        }

        // Atualiza Body da Resposta
        responseBodyDisplay.textContent = responseBody !== null ? responseBody : 'Aguardando resposta...';

        // Atualiza Headers da Resposta
        responseHeadersDisplay.textContent = responseHeaders !== null ? responseHeaders : 'Aguardando cabeçalhos...';
    }

    /**
     * Adiciona um URL ao histórico de uma função específica.
     * @param {string} method - O função HTTP (POST, GET, PUT, DELETE).
     * @param {string} url - O URL a ser adicionado ao histórico.
     */
    function addUrlToHistory(method, url) {
        if (!url || url.trim() === '') return;
        let history = urlHistories[method];
        // Remove se já existir para movê-lo para o topo
        history = history.filter(item => item !== url);
        history.unshift(url); // Adiciona ao início
        // Limita o tamanho do histórico
        if (history.length > 10) {
            history.pop();
        }
        urlHistories[method] = history;
        localStorage.setItem('urlHistories', JSON.stringify(urlHistories));
    }

    /**
     * Popula o elemento datalist com o histórico de URLs para uma função específico.
     * @param {string} method - O função HTTP.
     */
    function populateDatalist(method) {
        const datalistId = `${method.toLowerCase()}UrlHistory`;
        const datalist = document.getElementById(datalistId);
        // Verifica se urlHistories[method] é um array antes de chamar forEach
        if (datalist && Array.isArray(urlHistories[method])) {
            datalist.innerHTML = '';
            urlHistories[method].forEach(url => {
                const option = document.createElement('option');
                option.value = url;
                datalist.appendChild(option);
            });
        } else if (datalist) {
            // Se não for um array, limpa o datalist para evitar comportamento inesperado.
            datalist.innerHTML = '';
        }
    }

    /**
     * Limpa toda a histórica de URLs armazenado no localStorage.
     */
    function clearAllUrlHistory() {
        localStorage.removeItem('urlHistories');
        urlHistories = {POST: [], GET: [], PUT: [], PATCH: [], DELETE: [], HEAD: [], OPTIONS: []};
        ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].forEach(method => populateDatalist(method));
        settingsModal.classList.add('hidden');
    }

    /**
     * Alterna a visibilidade das seções de função HTTP e ativa o botão da aba correspondente.
     * @param {string} activeSectionId - O ID da seção a ser ativada (ex: 'postSection').
     * @param {string} clickedTabButtonId - O ID do botão da aba clicado (ex: 'postTab').
     */
    function switchTab(activeSectionId, clickedTabButtonId) {
        // Esconde todas as seções de função
        methodSections.forEach(section => {
            section.classList.add('hidden');
        });
        // Mostra a seção de função ativa
        document.getElementById(activeSectionId).classList.remove('hidden');

        // Remove todas as classes de 'active' dos botões de aba
        tabButtons.forEach(button => {
            button.classList.remove('active-post', 'active-get', 'active-put', 'active-patch', 'active-delete', 'active-head', 'active-options');
        });
        // Adiciona a classe 'active' correta ao botão de aba clicado
        const clickedButton = document.getElementById(clickedTabButtonId);
        const method = clickedTabButtonId.replace('Tab', '').toLowerCase();
        clickedButton.classList.add(`active-${method}`);

        // Atualiza a variável activeMethod
        activeMethod = activeSectionId.replace('Section', '').toUpperCase();

        // Restaura a resposta para a aba recém-selecionada
        const storedResponse = methodResponses[activeMethod];
        updateResponseDisplay(storedResponse.statusCode, storedResponse.body, activeMethod, storedResponse.time, storedResponse.size, storedResponse.headers, storedResponse.detailedTiming, storedResponse.detailedSize);
        populateDatalist(activeMethod);

        // Garante que o body seja exibido por padrão ao mudar de aba
        switchResponseTab('body');
    }

    /**
     * Alterna a exibição entre o Body e os Headers da resposta.
     * @param {string} tabToShow - 'body' ou 'headers'.
     */
    function switchResponseTab(tabToShow) {
        // Remove 'active-response-tab' de ambos os botões
        bodyTabButton.classList.remove('active-response-tab');
        headersTabButton.classList.remove('active-response-tab');

        // Esconde ambos os containers
        responseBodyContainer.classList.add('hidden');
        responseHeadersContainer.classList.add('hidden');

        if (tabToShow === 'body') {
            bodyTabButton.classList.add('active-response-tab');
            responseBodyContainer.classList.remove('hidden');
        } else if (tabToShow === 'headers') {
            headersTabButton.classList.add('active-response-tab');
            responseHeadersContainer.classList.remove('hidden');
        }
    }

    /**
     * Gera e adiciona um input de header editável (chave e valor) com um botão de exclusão.
     * @param {HTMLElement} container - O elemento pai onde o input será adicionado.
     * @param {string} initialKey - A chave inicial para o input (opcional).
     * @param {string} initialValue - O valor inicial para o input (opcional).
     * @param {boolean} isAuthorization - True se for o header de Authorization fixo.
     */
    function addHeaderRow(container, initialKey = '', initialValue = '', isAuthorization = false) {
        const headerGroup = document.createElement('div');
        headerGroup.className = 'flex gap-2 mb-2 header-input-group';

        if (isAuthorization) {
            headerGroup.innerHTML = `
                <select class="flex-1 p-2 border border-gray-300 rounded-md text-sm header-key-select">
                    <option value="Authorization" selected>Authorization</option>
                </select>
                <input type="text" placeholder="Bearer {{token}}" value="${initialValue}" class="flex-[2] p-2 border border-gray-300 rounded-md header-value-input">
                <button type="button" class="delete-header-btn p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
        } else {
            headerGroup.innerHTML = `
                <input type="text" placeholder="Chave" value="${initialKey}" class="flex-1 p-2 border border-gray-300 rounded-md text-sm header-key-input">
                <input type="text" placeholder="Valor" value="${initialValue}" class="flex-[2] p-2 border border-gray-300 rounded-md header-value-input">
                <button type="button" class="delete-header-btn p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            `;
        }

        // Inserir antes do botão "Adicionar Header" se ele existir, caso contrário, anexar ao final
        const addHeaderButton = container.querySelector('.add-header-btn');
        if (addHeaderButton) {
            container.insertBefore(headerGroup, addHeaderButton);
        } else {
            container.appendChild(headerGroup);
        }

        // Adicionar listener para o botão de deletar
        headerGroup.querySelector('.delete-header-btn').addEventListener('click', (event) => {
            event.target.closest('.header-input-group').remove();
            // Se nenhum header restar, desmarcar a checkbox e esconder o container
            const currentHeadersCheckbox = document.getElementById(container.id.replace('Container', 'Checkbox'));
            if (container.querySelectorAll('.header-input-group').length === 0) {
                currentHeadersCheckbox.checked = false;
                container.classList.add('hidden');
            }
        });
    }

    /**
     * Inicializa os headers quando a checkbox é marcada.
     * Adiciona o header de Authorization e o botão para adicionar novos headers.
     * @param {HTMLElement} container - O elemento pai onde os inputs serão adicionado
     * @param {string} globalAuthTokenValue - O valor do token de autenticação global.
     */
    function initializeHeadersContainer(container, globalAuthTokenValue) {
        container.innerHTML = ''; // Limpa qualquer conteúdo anterior

        // Adiciona o header de Authorization
        addHeaderRow(container, 'Authorization', `Bearer ${globalAuthTokenValue}`, true);

        // Adiciona o botão para adicionar mais headers
        const addHeaderButton = document.createElement('button');
        addHeaderButton.type = 'button';
        addHeaderButton.className = 'add-header-btn p-2 mt-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors shadow-sm w-full flex items-center justify-center';
        addHeaderButton.innerHTML = `<svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Adicionar Header`;
        addHeaderButton.addEventListener('click', () => addHeaderRow(container)); // Chama addHeaderRow sem valores iniciais para um novo header
        container.appendChild(addHeaderButton);
    }

    /**
     * Exibe um erro no painel de resposta.
     * @param {string} method - O método HTTP.
     * @param {string} statusText - O texto a ser exibido no status (ex: 'Erro de CORS').
     * @param {string} bodyText - O texto a ser exibido no body (mensagem detalhada).
     * @param {string} bgColorClass - Classe CSS para a cor de fundo do status.
     * @param {number|null} responseTime - O tempo de resposta em milissegundos.
     */
    function displayError(method, statusText, bodyText, bgColorClass, responseTime) {
        // Limpa classes de cor antigas
        statusCodeDisplay.className = 'p-3 text-lg font-bold rounded-md text-center w-full';
        // Adiciona as novas classes
        statusCodeDisplay.classList.add(...bgColorClass.split(' '));
        statusCodeDisplay.textContent = statusText;
        responseBodyDisplay.textContent = bodyText;
        responseHeadersDisplay.textContent = 'N/A';
        responseTimeDisplay.textContent = responseTime !== null ? `${responseTime.toFixed(2)} ms` : '-- ms';
        responseSizeDisplay.textContent = '-- KB';

        // Salva o erro na resposta para o método atual
        methodResponses[method].statusCode = statusText;
        methodResponses[method].body = bodyText;
        methodResponses[method].time = responseTime;
        methodResponses[method].size = null;
        methodResponses[method].headers = null;
        methodResponses[method].detailedTiming = null;
        methodResponses[method].detailedSize = null;
    }

    /**
     * Prepara e envia a requisição HTTP.
     * @param {string} method - método HTTP (GET, POST, PUT, DELETE).
     * @param {string} urlInputId - ID do input da URL.
     * @param {string} headersCheckboxId - ID do checkbox de headers.
     * @param {string} headersContainerId - ID do contêiner de headers.
     * @param {string} bodyInputId - ID do textarea do body (opcional).
     */
    async function sendRequest(method, urlInputId, headersCheckboxId, headersContainerId, bodyInputId) {
        const urlInput = document.getElementById(urlInputId);
        const endpoint = urlInput.value.trim();
        const fullUrl = `${baseUrlInput.value}${endpoint}`;

        if (!endpoint) {
            displayError(method, 'Erro: Endpoint Obrigatório!', 'Por favor, preencha o endpoint antes de enviar a requisição.', 'bg-red-100 text-red-700', null);
            return;
        }

        addUrlToHistory(method, endpoint);
        populateDatalist(method);

        // Reset response display before sending request
        statusCodeDisplay.className = 'p-3 text-lg font-bold rounded-md bg-gray-100 text-gray-800 text-center w-full';
        statusCodeDisplay.textContent = 'Enviando...';
        responseBodyDisplay.textContent = 'Enviando requisição...';
        responseHeadersDisplay.textContent = 'Enviando cabeçalhos...';
        responseTimeDisplay.textContent = '-- ms';
        responseSizeDisplay.textContent = '-- KB';
        switchResponseTab('body');

        const requestOptions = { method: method, headers: {} };
        const headersCheckbox = document.getElementById(headersCheckboxId);
        const headersContainer = document.getElementById(headersContainerId);
        const bodyInput = bodyInputId ? document.getElementById(bodyInputId) : null;

        if (headersCheckbox.checked) {
            const headerGroups = headersContainer.querySelectorAll('.header-input-group');
            headerGroups.forEach(group => {
                let key, value;
                const keySelect = group.querySelector('.header-key-select');
                const keyInput = group.querySelector('.header-key-input');
                const valueInput = group.querySelector('.header-value-input');
                if (keySelect && keySelect.value) { key = keySelect.value.trim(); }
                else if (keyInput && keyInput.value) { key = keyInput.value.trim(); }
                if (valueInput && valueInput.value) { value = valueInput.value.trim(); }
                if (key && value) { requestOptions.headers[key] = value; }
            });
        }

        let requestBodySize = 0;
        if (bodyInput && bodyInput.value) {
            try {
                const parsedBody = JSON.parse(bodyInput.value);
                const stringifiedBody = JSON.stringify(parsedBody);
                requestOptions.body = stringifiedBody;
                requestBodySize = new TextEncoder().encode(stringifiedBody).length;
                if (!requestOptions.headers['Content-Type']) { requestOptions.headers['Content-Type'] = 'application/json'; }
            } catch (e) {
                displayError(method, 'Erro: JSON Inválido!', `Erro de parse do JSON: ${e.message}`, 'bg-red-100 text-red-700', null);
                return;
            }
        }

        const startTime = performance.now();

        try {
            const response = await fetch(fullUrl, requestOptions);
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            // ***** LÓGICA DE TRATAMENTO DE STATUS HTTP (4xx, 5xx) *****
            // Se a requisição foi bem-sucedida em termos de rede, mas o servidor retornou um erro HTTP,
            // essa condição será verdadeira. A promessa 'fetch' não é rejeitada.
            if (!response.ok) {
                let errorBody = 'N/A'; // Default to N/A
                try {
                    errorBody = await response.text();
                    // Try to parse as JSON for pretty printing
                    try {
                        errorBody = JSON.stringify(JSON.parse(errorBody), null, 2);
                    } catch (e) {
                        // If parsing fails, use the raw text
                    }
                } catch (e) {
                    // This catch block handles errors reading the response body (e.g., if it's empty)
                    console.warn("Failed to read response body:", e);
                }

                // Diferenciação clara para o status 403 e outros erros HTTP
                if (response.status === 403) {
                    const forbiddenBody = errorBody && errorBody !== 'N/A' ? errorBody : 'O servidor recusou a requisição. Verifique se a autenticação está sendo enviada no header.';
                    displayError(method, `403 Forbidden`, forbiddenBody, 'bg-red-100 text-red-700', responseTime);
                } else {
                    // Para outros erros HTTP (400, 404, 500, etc.)
                    displayError(method, `${response.status} ${statusCodeMessages[response.status] || 'Erro HTTP'}`, `O servidor retornou um erro. Detalhes: ${errorBody}`, 'bg-red-100 text-red-700', responseTime);
                }
                return; // Importante: sai da função após exibir o erro
            }

            // Se chegamos aqui, a resposta é 'ok' (status 2xx)
            const statusCode = response.status;
            const rawResponseText = await response.text();
            let responseBody;
            try {
                responseBody = JSON.stringify(JSON.parse(rawResponseText), null, 2);
            } catch (e) {
                responseBody = rawResponseText;
            }

            // You can keep your detailed timing and size logic here
            // ...

            updateResponseDisplay(statusCode, responseBody, method, responseTime, 0, '', null, null); // Simplified call for this example

        } catch (error) {
                const endTime = performance.now();
                const responseTime = endTime - startTime;

                const perfEntries = performance.getEntriesByName(fullUrl);
                const hasPerfEntry = perfEntries.length > 0;
                const transferSize = hasPerfEntry ? perfEntries[0].transferSize : 0;

                let statusText;
                let bodyText;

                if (!hasPerfEntry) {
                    // Nenhuma entrada de performance
                    statusText = '500';
                    bodyText = 'O servidor está offline ou recusou a conexão (Connection Refused).';
                } else if (transferSize === 0 && responseTime < 50) {
                    // Entrada criada mas sem tráfego
                    statusText = '500';
                    bodyText = 'O servidor está offline ou recusou a conexão (Connection Refused).';
                } else {
                    // Houve tráfego: provavelmente CORS
                    statusText = 'CORS';
                    bodyText = 'Bingo!!! nosso caçador funcionou. A requisição foi bloqueada pela política de CORS. O servidor respondeu, com a política de CORS bloqueando a requisição.';
                }

                const bgColorClass = 'bg-red-100 text-red-700';
                displayError(method, statusText, bodyText, bgColorClass, responseTime);
            }


        }

    /**
     * Aplica o tema (claro/escuro) à página, alterando classes CSS.
     * @param {string} theme - 'light' ou 'dark'.
     */
    function applyTheme(theme) {
        const isDark = theme === 'dark';

        // Set body and main container backgrounds using style property for highest specificity
        bodyElement.style.backgroundColor = isDark ? '#1a202c' : '#f0f2f5';
        mainContainer.style.backgroundColor = isDark ? 'rgb(24 24 57)' : '#ffffff';

        // Toggle dark-mode class on body. All other elements rely on CSS rules prefixed with .dark-mode
        bodyElement.classList.toggle('dark-mode', isDark);

        localStorage.setItem('theme', theme);
    }

    /**
     * Carrega o tema salvo do localStorage e o aplica.
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light'; // Padrão 'light'
        applyTheme(savedTheme);
    }


    // Inicialização: Carrega configurações e ativa a aba POST por padrão
    loadSettings();
    loadTheme(); // Carrega o tema salvo
    // Dispara o switchTab para o POST para garantir que os valores iniciais da resposta sejam carregados e o datalist seja populado.
    switchTab('postSection', 'postTab');
    switchResponseTab('body'); // Garante que o body esteja ativo ao carregar a página


    // Event Listeners para o Modal de Configurações
    settingsGear.addEventListener('click', () => {
        document.getElementById('modalBaseUrl').value = localStorage.getItem('baseUrl') || '';
        document.getElementById('modalAuthToken').value = localStorage.getItem('authToken') || '';
        settingsModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    saveSettingsButton.addEventListener('click', saveSettings);
    clearUrlHistoryButton.addEventListener('click', clearAllUrlHistory);

    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
        // Esconder o dropdown de tema se clicar fora
        if (!themeToggle.contains(event.target) && !themeDropdown.contains(event.target)) {
            themeDropdown.classList.add('hidden');
        }
    });

    // Event Listeners para o Toggle de Tema
    themeToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão feche imediatamente o dropdown
        themeDropdown.classList.toggle('hidden');
    });

    lightThemeButton.addEventListener('click', () => {
        applyTheme('light');
        themeDropdown.classList.add('hidden');
    });

    darkThemeButton.addEventListener('click', () => {
        applyTheme('dark');
        themeDropdown.classList.add('hidden');
    });


    // Event Listeners para as Abas de função HTTP
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.target.id.replace('Tab', 'Section');
            const clickedTabButtonId = event.target.id;
            switchTab(targetId, clickedTabButtonId);
        });
    });

    // Event listeners para tooltips dos métodos
    Object.keys(methodTooltips).forEach(tabId => {
        const button = document.getElementById(tabId);
        const tooltip = methodTooltips[tabId].element;
        const content = methodTooltips[tabId].content;

        if (button && tooltip) {
            // Preenche o conteúdo do tooltip
            tooltip.textContent = content;

            button.addEventListener('mouseover', () => {
                // Limpa qualquer timeout anterior para evitar múltiplos tooltips ou atrasos incorretos
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(() => {
                    tooltip.classList.add('visible');
                    tooltip.classList.remove('hidden');
                }, 2000); // 2 segundos de atraso
            });

            button.addEventListener('mouseout', () => {
                clearTimeout(tooltipTimeout); // Limpa o timeout ao sair
                tooltip.classList.remove('visible');
                tooltip.classList.add('hidden');
            });
        }
    });

    // Event Listeners para as Tabs de Resposta (Body/Headers)
    bodyTabButton.addEventListener('click', () => switchResponseTab('body'));
    headersTabButton.addEventListener('click', () => switchResponseTab('headers'));

    // Gerenciamento de Headers
    document.querySelectorAll('[id$="HeadersCheckbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const containerId = event.target.id.replace('Checkbox', 'Container');
            const container = document.getElementById(containerId);
            if (event.target.checked) {
                container.classList.remove('hidden');
                // Chama a nova função para inicializar o container de headers
                initializeHeadersContainer(container, authTokenInput.value);
            } else {
                container.classList.add('hidden');
                container.innerHTML = '';
            }
        });
    });

    // Event Listeners para os botões de Envio
    document.getElementById('sendPost').addEventListener('click', () => sendRequest('POST', 'postUrl', 'postHeadersCheckbox', 'postHeadersContainer', 'postBody'));
    document.getElementById('sendGet').addEventListener('click', () => sendRequest('GET', 'getUrl', 'getHeadersCheckbox', 'getHeadersContainer', null));
    document.getElementById('sendPut').addEventListener('click', () => sendRequest('PUT', 'putUrl', 'putHeadersCheckbox', 'putHeadersContainer', 'putBody'));
    document.getElementById('sendPatch').addEventListener('click', () => sendRequest('PATCH', 'patchUrl', 'patchHeadersCheckbox', 'patchHeadersContainer', 'patchBody'));
    document.getElementById('sendDelete').addEventListener('click', () => sendRequest('DELETE', 'deleteUrl', 'deleteHeadersCheckbox', 'deleteHeadersContainer', null));
    document.getElementById('sendHead').addEventListener('click', () => sendRequest('HEAD', 'headUrl', 'headHeadersCheckbox', 'headHeadersContainer', null));
    document.getElementById('sendOptions').addEventListener('click', () => sendRequest('OPTIONS', 'optionsUrl', 'optionsHeadersCheckbox', 'optionsHeadersContainer', null));

    // Event Listener para a tecla Enter
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const activeElement = document.activeElement;
            const bodyTextareaIds = ['postBody', 'putBody', 'patchBody']; // Adicionado patchBody

            if (bodyTextareaIds.includes(activeElement.id)) {
                return;
            }

            if (!settingsModal.classList.contains('hidden')) {
                saveSettings();
            } else if (!httpRequestSimulatorContent.classList.contains('hidden')) { // Apenas se estiver na tela de simulação de HTTP
                const currentMethodInputs = methodInputMap[activeMethod];
                if (currentMethodInputs) {
                    sendRequest(activeMethod, currentMethodInputs.url, currentMethodInputs.headersCheckbox, currentMethodInputs.headersContainer, currentMethodInputs.body);
                }
            }
        }
        // Event listener para fechar o modal com a tecla 'Esc'
        if (event.key === 'Escape') {
            if (!settingsModal.classList.contains('hidden')) {
                settingsModal.classList.add('hidden');
            }
        }
    });

    // --- Event Listeners para o Tooltip de Tempo ---
    responseTimeDisplay.addEventListener('mouseover', () => {
        const currentTiming = methodResponses[activeMethod].detailedTiming;
        if (currentTiming) {
            tooltipDnsLookup.textContent = `${currentTiming.dnsLookup} ms`;
            tooltipTcpHandshake.textContent = `${currentTiming.tcpHandshake} ms`;
            tooltipSslHandshake.textContent = `${currentTiming.sslHandshake} ms`;
            tooltipTtfb.textContent = `${currentTiming.ttfb} ms`;
            tooltipDownload.textContent = `${currentTiming.download} ms`;
            tooltipProcess.textContent = `${currentTiming.process} ms`;

            responseTimeTooltip.classList.add('visible'); // Adicionado
            responseTimeTooltip.classList.remove('hidden');
        }
    });

    responseTimeDisplay.addEventListener('mouseout', () => {
        responseTimeTooltip.classList.remove('visible'); // Adicionado
        responseTimeTooltip.classList.add('hidden');
    });
    // --- Fim dos Event Listeners para o Tooltip de Tempo ---

    // --- Event Listeners para o Tooltip de Tamanho ---
    responseSizeDisplay.addEventListener('mouseover', () => {
        const currentSizeDetails = methodResponses[activeMethod].detailedSize;
        if (currentSizeDetails) {
            tooltipResponseHeadersSize.textContent = `${currentSizeDetails.responseHeaders} B`;
            tooltipResponseBodySize.textContent = `${currentSizeDetails.responseBody} B`;
            tooltipRequestHeadersSize.textContent = `${currentSizeDetails.requestHeaders} B`;
            tooltipRequestBodySize.textContent = `${currentSizeDetails.requestBody} B`;

            responseSizeTooltip.classList.add('visible'); // Adicionado
            responseSizeTooltip.classList.remove('hidden');
        }
    });

    responseSizeDisplay.addEventListener('mouseout', () => {
        responseSizeTooltip.classList.remove('visible'); // Adicionado
        responseSizeTooltip.classList.add('hidden');
    });
    // --- Fim dos Event Listeners para o Tooltip de Tamanho ---

    // --- Event Listeners da Simulação de Carga ---
    loadTestToggleBtn.addEventListener('click', toggleLoadTestView);
    startLoadTestButton.addEventListener('click', startLoadTest);
    stopLoadTestButton.addEventListener('click', stopLoadTest);
    resetLoadTestButton.addEventListener('click', resetLoadTest);
    // --- Fim dos Event Listeners da Simulação de Carga ---
});