// Configurações globais
const ADMIN_PASSWORD = 'admin123'; // Altere esta senha
let isAdminLoggedIn = false;
let currentPlaylist = [];
let currentChannel = null;
let hlsPlayer = null;
let videoElement = null;

// Elementos DOM
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const logoutBtn = document.getElementById('logoutBtn');
const closeModal = document.querySelector('.close');
const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const m3uFileInput = document.getElementById('m3uFileInput');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const searchInput = document.getElementById('searchInput');
const categoryList = document.getElementById('categoryList');
const channelList = document.getElementById('channelList');
const videoPlayer = document.getElementById('videoPlayer');
const currentChannelName = document.getElementById('currentChannelName');
const currentChannelGroup = document.getElementById('currentChannelGroup');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const playlistInfo = document.getElementById('playlistInfo');
const m3uUrlInput = document.getElementById('m3uUrlInput');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const clearStorageBtn = document.getElementById('clearStorageBtn');
const contentListTitle = document.getElementById('contentListTitle');
const loadingIndicator = document.getElementById('loadingIndicator');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadStoredPlaylist();
    setupContentTypeFilters();
});

adminBtn.addEventListener('click', () => {
    if (isAdminLoggedIn) {
        showAdminPanel();
    } else {
        showLoginModal();
    }
});

closeModal.addEventListener('click', hideLoginModal);
adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) hideLoginModal();
});

adminLoginForm.addEventListener('submit', handleAdminLogin);
logoutBtn.addEventListener('click', handleLogout);

uploadArea.addEventListener('click', () => m3uFileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleFileDrop);
uploadBtn.addEventListener('click', () => m3uFileInput.click());
m3uFileInput.addEventListener('change', handleFileSelect);
loadUrlBtn.addEventListener('click', handleUrlLoad);
m3uUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUrlLoad();
    }
});
clearPlaylistBtn.addEventListener('click', clearPlaylist);
clearStorageBtn.addEventListener('click', clearBrowserStorage);

searchInput.addEventListener('input', handleSearch);
playPauseBtn.addEventListener('click', togglePlayPause);
muteBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Funções principais
function initializeApp() {
    console.log('Streamora inicializado');
    updateAdminButtonText();
}

function setupContentTypeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const contentType = btn.dataset.type;
            filterContentByType(contentType);
        });
    });
}

function filterContentByType(type) {
    let filteredChannels = currentPlaylist;
    
    if (type !== 'all') {
        filteredChannels = currentPlaylist.filter(channel => {
            const channelType = detectContentType(channel);
            return channelType === type;
        });
    }
    
    updateChannelList(filteredChannels);
    updateContentListTitle(type);
}

function detectContentType(channel) {
    const name = channel.name.toLowerCase();
    const group = channel.group.toLowerCase();
    
    // Detectar filmes
    if (group.includes('movie') || group.includes('filme') || group.includes('cinema') ||
        name.includes('movie') || name.includes('filme') || 
        group.includes('film') || name.includes('film')) {
        return 'movies';
    }
    
    // Detectar séries
    if (group.includes('series') || group.includes('série') || group.includes('tv show') ||
        group.includes('serie') || name.includes('season') || name.includes('temporada') ||
        group.includes('drama') || group.includes('sitcom')) {
        return 'series';
    }
    
    // Detectar TV (padrão para canais de TV tradicionais)
    if (group.includes('tv') || group.includes('canal') || group.includes('channel') ||
        group.includes('news') || group.includes('sport') || group.includes('music') ||
        group.includes('kids') || group.includes('infantil')) {
        return 'tv';
    }
    
    // Padrão é TV se não conseguir detectar
    return 'tv';
}

function getContentTypeIcon(type) {
    switch (type) {
        case 'movies':
            return '<i class="fas fa-film channel-type-icon"></i>';
        case 'series':
            return '<i class="fas fa-video channel-type-icon"></i>';
        case 'tv':
            return '<i class="fas fa-tv channel-type-icon"></i>';
        default:
            return '<i class="fas fa-play channel-type-icon"></i>';
    }
}

function updateContentListTitle(type) {
    switch (type) {
        case 'movies':
            contentListTitle.textContent = 'Filmes';
            break;
        case 'series':
            contentListTitle.textContent = 'Séries';
            break;
        case 'tv':
            contentListTitle.textContent = 'Canais de TV';
            break;
        default:
            contentListTitle.textContent = 'Conteúdo';
    }
}

function showLoginModal() {
    adminModal.style.display = 'block';
    document.getElementById('adminPassword').focus();
}

function hideLoginModal() {
    adminModal.style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

function handleAdminLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        hideLoginModal();
        showAdminPanel();
        updateAdminButtonText();
        showNotification('Login realizado com sucesso!', 'success');
    } else {
        showNotification('Senha incorreta!', 'error');
        document.getElementById('adminPassword').value = '';
    }
}

function handleLogout() {
    isAdminLoggedIn = false;
    hideAdminPanel();
    updateAdminButtonText();
    showNotification('Logout realizado com sucesso!', 'success');
}

function showAdminPanel() {
    adminPanel.classList.remove('hidden');
    updatePlaylistInfo();
    addDebugButton(); // Adiciona botão de debug para testar proxies
}

function hideAdminPanel() {
    adminPanel.classList.add('hidden');
}

function updateAdminButtonText() {
    if (isAdminLoggedIn) {
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Painel Admin';
    } else {
        adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
    }
}

// Manipulação de arquivos
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.style.background = 'rgba(79, 172, 254, 0.2)';
}

function handleFileDrop(e) {
    e.preventDefault();
    uploadArea.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processM3UFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processM3UFile(file);
    }
}

function handleUrlLoad() {
    const url = m3uUrlInput.value.trim();
    
    if (!url) {
        showNotification('Por favor, insira uma URL válida.', 'error');
        m3uUrlInput.focus();
        return;
    }

    if (!isValidUrl(url)) {
        showNotification('Por favor, insira uma URL válida (deve começar com http:// ou https://).', 'error');
        m3uUrlInput.focus();
        return;
    }

    loadUrlBtn.disabled = true;
    loadUrlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    m3uUrlInput.disabled = true;

    console.log('=== INICIANDO CARREGAMENTO ===');
    console.log('URL:', url);
    console.log('Timestamp:', new Date().toISOString());
    
    showNotification('Carregando lista M3U... Isso pode demorar alguns segundos.', 'info');

    fetchM3UFromUrl(url)
        .then(content => {
            console.log('=== SUCESSO NO CARREGAMENTO ===');
            console.log('Conteúdo recebido, tamanho:', content ? content.length : 0);
            console.log('Primeiras 200 caracteres:', content ? content.substring(0, 200) : 'VAZIO');
            
            if (!content || content.trim().length === 0) {
                throw new Error('A URL retornou conteúdo vazio');
            }
            
            // Verificar se parece ser um arquivo M3U
            if (!content.includes('#EXTINF') && !content.includes('#EXTM3U')) {
                console.warn('Conteúdo não parece ser M3U válido');
                showNotification('Aviso: O conteúdo não parece ser um arquivo M3U válido, mas tentando processar...', 'warning');
            }
            
            parseM3UContent(content, url);
            m3uUrlInput.value = '';
        })
        .catch(error => {
            console.error('=== ERRO NO CARREGAMENTO ===');
            console.error('Erro:', error);
            console.error('Stack:', error.stack);
            
            let errorMessage = error.message;
            if (errorMessage.includes('Failed to fetch')) {
                errorMessage = 'Erro de rede. Verifique se a URL está correta e acessível.';
            } else if (errorMessage.includes('CORS')) {
                errorMessage = 'Erro de CORS. Tentando com proxies...';
            }
            
            showNotification(`Erro: ${errorMessage}`, 'error');
        })
        .finally(() => {
            console.log('=== FINALIZANDO CARREGAMENTO ===');
            loadUrlBtn.disabled = false;
            loadUrlBtn.innerHTML = 'Carregar URL';
            m3uUrlInput.disabled = false;
        });
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        const validProtocols = ['http:', 'https:'];
        const isValidProtocol = validProtocols.includes(url.protocol);
        const hasHost = url.hostname && url.hostname.length > 0;
        return isValidProtocol && hasHost;
    } catch (_) {
        // Fallback para URLs que podem não ser parseadas corretamente
        const urlPattern = /^https?:\/\/.+/i;
        return urlPattern.test(string);
    }
}

// Versão melhorada para Netlify
async function fetchM3UFromUrl(url) {
    console.log('Iniciando fetch da URL:', url);
    
    try {
        // Primeiro, tentamos buscar diretamente
        console.log('Tentativa 1: Fetch direto');
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/vnd.apple.mpegurl, text/plain, */*'
            }
        });
        
        if (response.ok) {
            const content = await response.text();
            console.log('Fetch direto bem-sucedido, tamanho:', content.length);
            return content;
        }
        throw new Error(`Direct fetch failed: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.log('Fetch direto falhou:', error.message);
        
        // Tentar com diferentes proxies públicos
        const proxies = [
            {
                name: 'AllOrigins',
                url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                parser: (data) => data.contents
            },
            {
                name: 'CorsProxy.io',
                url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
                parser: (data) => data
            },
            {
                name: 'ThingProxy',
                url: `https://thingproxy.freeboard.io/fetch/${url}`,
                parser: (data) => data
            }
        ];
        
        for (let i = 0; i < proxies.length; i++) {
            const proxy = proxies[i];
            try {
                console.log(`Tentativa ${i + 2}: Proxy ${proxy.name}`);
                showNotification(`Tentando carregar via ${proxy.name}...`, 'info');
                
                const proxyResponse = await fetch(proxy.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*'
                    }
                });
                
                if (proxyResponse.ok) {
                    let content;
                    const contentType = proxyResponse.headers.get('content-type');
                    
                    if (contentType && contentType.includes('application/json')) {
                        const data = await proxyResponse.json();
                        content = proxy.parser(data);
                    } else {
                        content = await proxyResponse.text();
                    }
                    
                    if (content && content.length > 0) {
                        console.log(`Proxy ${proxy.name} bem-sucedido, tamanho:`, content.length);
                        return content;
                    }
                }
                
                console.log(`Proxy ${proxy.name} retornou resposta vazia ou inválida`);
            } catch (proxyError) {
                console.log(`Proxy ${proxy.name} falhou:`, proxyError.message);
                continue;
            }
        }
        
        // Se todos os proxies falharam, tentar uma última vez com fetch simples
        try {
            console.log('Última tentativa: Fetch simples sem headers');
            const lastResponse = await fetch(url);
            if (lastResponse.ok) {
                const lastContent = await lastResponse.text();
                console.log('Fetch simples funcionou, tamanho:', lastContent.length);
                return lastContent;
            }
        } catch (lastError) {
            console.log('Fetch simples também falhou:', lastError.message);
        }
        
        throw new Error('Não foi possível carregar a URL. Todos os métodos falharam. Verifique se a URL está correta.');
    }
}

function processM3UFile(file) {
    if (!file.name.toLowerCase().endsWith('.m3u') && !file.name.toLowerCase().endsWith('.m3u8')) {
        showNotification('Por favor, selecione um arquivo M3U válido.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseM3UContent(content);
    };
    reader.readAsText(file);
}

function parseM3UContent(content, sourceUrl = null) {
    const lines = content.split('\n').map(line => line.trim());
    const channels = [];
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('#EXTINF:')) {
            // Parse channel info
            const info = line.substring(8); // Remove #EXTINF:
            const commaIndex = info.indexOf(',');
            
            if (commaIndex > -1) {
                const attributes = info.substring(0, commaIndex);
                const name = info.substring(commaIndex + 1).trim();
                
                currentChannel = {
                    name: name,
                    group: extractAttribute(attributes, 'group-title') || 'Sem Categoria',
                    logo: extractAttribute(attributes, 'tvg-logo') || '',
                    id: extractAttribute(attributes, 'tvg-id') || '',
                };
            }
        } else if (line && !line.startsWith('#') && currentChannel.name) {
            // This is the stream URL
            currentChannel.url = line;
            channels.push({...currentChannel});
            currentChannel = {};
        }
    }

    if (channels.length > 0) {
        currentPlaylist = channels;
        
        // Salvar informações sobre a fonte (compactas)
        try {
            const playlistSource = {
                type: sourceUrl ? 'url' : 'file',
                source: sourceUrl ? 'URL remota' : 'arquivo local',
                loadedAt: new Date().toISOString(),
                channelCount: channels.length
            };
            localStorage.setItem('iptvPlaylistSource', JSON.stringify(playlistSource));
        } catch (e) {
            console.warn('Não foi possível salvar informações da fonte:', e);
        }
        
        savePlaylistToStorage();
        updateChannelList();
        updateCategoryList();
        updatePlaylistInfo();
        showNotification(`${channels.length} canais carregados com sucesso!`, 'success');
    } else {
        showNotification('Nenhum canal encontrado no arquivo M3U.', 'error');
    }
}

function extractAttribute(text, attribute) {
    const regex = new RegExp(`${attribute}="([^"]*)"`, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
}

function savePlaylistToStorage() {
    try {
        // Limpar dados antigos primeiro
        clearOldStorageData();
        
        // Tentar salvar a playlist
        localStorage.setItem('iptvPlaylist', JSON.stringify(currentPlaylist));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('Quota do localStorage excedida, tentando compactar dados...');
            
            // Tentar compactar removendo dados desnecessários
            const compactPlaylist = currentPlaylist.map(channel => ({
                name: channel.name,
                url: channel.url,
                group: channel.group,
                logo: channel.logo || ''
            }));
            
            try {
                localStorage.setItem('iptvPlaylist', JSON.stringify(compactPlaylist));
                currentPlaylist = compactPlaylist;
                showNotification('Playlist salva com compactação para economizar espaço', 'info');
            } catch (compactError) {
                console.error('Falha ao salvar mesmo com compactação:', compactError);
                showNotification('Aviso: Não foi possível salvar a playlist no navegador. Os canais funcionarão normalmente, mas serão perdidos ao recarregar a página.', 'warning');
                
                // Se ainda falhar, usar apenas memória
                localStorage.removeItem('iptvPlaylist');
            }
        } else {
            console.error('Erro ao salvar playlist:', error);
            showNotification('Erro ao salvar playlist no navegador', 'warning');
        }
    }
}

function clearOldStorageData() {
    // Remove dados desnecessários que podem estar ocupando espaço
    const keysToCheck = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('old_') || key.includes('temp_') || key.includes('cache_'))) {
            keysToCheck.push(key);
        }
    }
    
    keysToCheck.forEach(key => {
        localStorage.removeItem(key);
    });
}

function loadStoredPlaylist() {
    const stored = localStorage.getItem('iptvPlaylist');
    if (stored) {
        try {
            currentPlaylist = JSON.parse(stored);
            updateChannelList();
            updateCategoryList();
            updatePlaylistInfo();
        } catch (e) {
            console.error('Erro ao carregar playlist armazenada:', e);
        }
    }
}

function clearPlaylist() {
    if (confirm('Tem certeza que deseja limpar a playlist atual?')) {
        currentPlaylist = [];
        localStorage.removeItem('iptvPlaylist');
        localStorage.removeItem('iptvPlaylistSource');
        updateChannelList();
        updateCategoryList();
        updatePlaylistInfo();
        stopCurrentStream();
        showNotification('Playlist limpa com sucesso!', 'success');
    }
}

function clearBrowserStorage() {
    if (confirm('Tem certeza que deseja limpar todo o cache do navegador? Isso pode resolver problemas de armazenamento.')) {
        try {
            // Limpar todo o localStorage relacionado ao IPTV
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Limpar playlist atual
            currentPlaylist = [];
            updateChannelList();
            updateCategoryList();
            updatePlaylistInfo();
            stopCurrentStream();
            
            showNotification('Cache limpo com sucesso! Recarregue a página se necessário.', 'success');
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
            showNotification('Erro ao limpar cache', 'error');
        }
    }
}

// Interface de usuário
function updateChannelList(filteredChannels = null) {
    const channels = filteredChannels || currentPlaylist;
    
    if (channels.length === 0) {
        channelList.innerHTML = `
            <div class="no-channels">
                <i class="fas fa-info-circle"></i>
                <p>Nenhuma lista M3U carregada.</p>
                <p>Entre como admin para fazer upload.</p>
            </div>
        `;
        return;
    }

    channelList.innerHTML = channels.map((channel, index) => {
        const contentType = detectContentType(channel);
        const typeIcon = getContentTypeIcon(contentType);
        
        return `
            <div class="channel-item ${contentType}" data-index="${index}" data-url="${channel.url}" data-type="${contentType}">
                <div class="channel-name">${typeIcon}${channel.name}</div>
                <div class="channel-group">${channel.group}</div>
            </div>
        `;
    }).join('');

    // Add click listeners to channels
    document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', () => {
            selectChannel(item);
        });
    });
}

function updateCategoryList() {
    const categories = [...new Set(currentPlaylist.map(channel => channel.group))];
    
    let categoryHTML = `
        <div class="category-item active" data-category="all">
            <i class="fas fa-th-large"></i> Todos os Conteúdos (${currentPlaylist.length})
        </div>
    `;

    categories.forEach(category => {
        const count = currentPlaylist.filter(channel => channel.group === category).length;
        categoryHTML += `
            <div class="category-item" data-category="${category}">
                <i class="fas fa-folder"></i> ${category} (${count})
            </div>
        `;
    });

    categoryList.innerHTML = categoryHTML;

    // Add click listeners to categories
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            selectCategory(item);
        });
    });
}

function selectCategory(categoryElement) {
    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    categoryElement.classList.add('active');

    const category = categoryElement.dataset.category;
    
    if (category === 'all') {
        updateChannelList();
    } else {
        const filteredChannels = currentPlaylist.filter(channel => channel.group === category);
        updateChannelList(filteredChannels);
    }
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        updateChannelList();
        return;
    }

    const filteredChannels = currentPlaylist.filter(channel => 
        channel.name.toLowerCase().includes(searchTerm) ||
        channel.group.toLowerCase().includes(searchTerm)
    );

    updateChannelList(filteredChannels);
}

// Player de vídeo - Versão para Netlify
function selectChannel(channelElement) {
    // Update active channel
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
    });
    channelElement.classList.add('active');

    const channelIndex = parseInt(channelElement.dataset.index);
    const channelUrl = channelElement.dataset.url;
    
    // Find channel in current playlist
    currentChannel = currentPlaylist.find(channel => channel.url === channelUrl);
    
    if (currentChannel) {
        loadChannel(currentChannel);
    }
}

function loadChannel(channel) {
    stopCurrentStream();
    showLoadingIndicator(true);

    currentChannelName.textContent = channel.name;
    currentChannelGroup.textContent = channel.group;

    console.log('Carregando conteúdo:', channel.name, 'URL:', channel.url);

    // Create video element
    videoElement = document.createElement('video');
    videoElement.controls = false;
    videoElement.autoplay = true;
    videoElement.muted = false;
    videoElement.preload = 'auto';
    videoElement.crossOrigin = 'anonymous'; // Para Netlify
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.objectFit = 'contain';

    // Clear player container and add video
    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(videoElement);

    // Detectar tipo de conteúdo para otimizações
    const contentType = detectContentType(channel);
    const isLiveStream = contentType === 'tv';

    // Load stream com configurações otimizadas para Netlify
    if (Hls.isSupported() && (channel.url.includes('.m3u8') || channel.url.includes('m3u'))) {
        hlsPlayer = new Hls({
            enableWorker: true,
            lowLatencyMode: isLiveStream,
            backBufferLength: isLiveStream ? 30 : 90,
            maxBufferLength: isLiveStream ? 60 : 120,
            maxMaxBufferLength: 300,
            fragLoadingTimeOut: 20000,
            manifestLoadingTimeOut: 10000,
            fragLoadingMaxRetry: 3,
            manifestLoadingMaxRetry: 3,
            debug: false
        });

        hlsPlayer.loadSource(channel.url);
        hlsPlayer.attachMedia(videoElement);

        let hasStartedPlaying = false;

        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('Manifest carregado, iniciando reprodução...');
            videoElement.play().then(() => {
                showLoadingIndicator(false);
                hasStartedPlaying = true;
                showNotification('Reproduzindo: ' + channel.name, 'success');
            }).catch(e => {
                console.error('Erro ao reproduzir:', e);
                showLoadingIndicator(false);
                showNotification('Erro ao iniciar reprodução. Tente novamente.', 'error');
            });
        });

        hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            showLoadingIndicator(false);
            
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        showNotification('Erro de rede. Verifique sua conexão.', 'error');
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        showNotification('Erro de mídia. Tentando recuperar...', 'warning');
                        hlsPlayer.recoverMediaError();
                        break;
                    default:
                        showNotification('Erro fatal no stream.', 'error');
                        break;
                }
            }
        });

        hlsPlayer.on(Hls.Events.FRAG_LOADED, () => {
            if (!hasStartedPlaying) {
                showLoadingIndicator(false);
                hasStartedPlaying = true;
            }
        });

    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        console.log('Usando suporte nativo HLS do Safari');
        videoElement.src = channel.url;
        videoElement.addEventListener('loadstart', () => showLoadingIndicator(false));
        videoElement.play().catch(e => {
            console.error('Erro ao reproduzir:', e);
            showLoadingIndicator(false);
            showNotification('Erro ao carregar o conteúdo.', 'error');
        });
    } else {
        // Try direct playback for other formats (MP4, etc.)
        console.log('Tentando reprodução direta');
        videoElement.src = channel.url;
        videoElement.addEventListener('loadstart', () => showLoadingIndicator(false));
        videoElement.addEventListener('canplay', () => {
            showLoadingIndicator(false);
            showNotification('Reproduzindo: ' + channel.name, 'success');
        });
        videoElement.addEventListener('error', (e) => {
            console.error('Erro no vídeo:', e);
            showLoadingIndicator(false);
            showNotification('Não foi possível reproduzir este conteúdo. Pode ser um problema de CORS ou formato não suportado.', 'error');
        });
        
        videoElement.play().catch(e => {
            console.error('Erro ao reproduzir:', e);
            showLoadingIndicator(false);
            showNotification('Erro de reprodução. Alguns streams podem não funcionar devido a restrições de CORS.', 'error');
        });
    }

    // Timeout para streams muito lentos
    setTimeout(() => {
        if (loadingIndicator && !loadingIndicator.classList.contains('hidden')) {
            showLoadingIndicator(false);
            showNotification('Stream demorou muito para carregar. Pode haver problemas de conexão.', 'warning');
        }
    }, 15000);

    // Enable controls
    enablePlayerControls();
}

function showLoadingIndicator(show) {
    if (loadingIndicator) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }
}

function stopCurrentStream() {
    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    
    if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
        videoElement = null;
    }

    disablePlayerControls();
    showPlayerPlaceholder();
}

function showPlayerPlaceholder() {
    videoPlayer.innerHTML = `
        <div class="player-placeholder">
            <i class="fas fa-play-circle"></i>
            <h3>Selecione um conteúdo para assistir</h3>
            <p>Escolha um canal, filme ou série da lista ao lado</p>
        </div>
    `;
    showLoadingIndicator(false);
}

function enablePlayerControls() {
    playPauseBtn.disabled = false;
    muteBtn.disabled = false;
    volumeSlider.disabled = false;
    fullscreenBtn.disabled = false;
}

function disablePlayerControls() {
    playPauseBtn.disabled = true;
    muteBtn.disabled = true;
    volumeSlider.disabled = true;
    fullscreenBtn.disabled = true;
}

// Controles do player
function togglePlayPause() {
    if (!videoElement) return;

    if (videoElement.paused) {
        videoElement.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoElement.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function toggleMute() {
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    muteBtn.innerHTML = videoElement.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

function handleVolumeChange() {
    if (!videoElement) return;
    
    videoElement.volume = volumeSlider.value / 100;
    
    if (videoElement.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        videoElement.muted = false;
    }
}

function toggleFullscreen() {
    if (!videoElement) return;

    if (document.fullscreenElement) {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
        videoPlayer.requestFullscreen().then(() => {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        }).catch(e => {
            console.error('Erro ao entrar em fullscreen:', e);
        });
    }
}

// Notificações
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: 10px; opacity: 0.7; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;" title="Fechar">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;

    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Admin panel functions
function updatePlaylistInfo() {
    if (currentPlaylist.length === 0) {
        playlistInfo.innerHTML = '<p>Nenhuma lista carregada</p>';
        return;
    }

    const categories = [...new Set(currentPlaylist.map(channel => channel.group))];
    
    // Recuperar informações da fonte
    const sourceInfo = JSON.parse(localStorage.getItem('iptvPlaylistSource') || '{}');
    
    let sourceDisplay = 'Desconhecida';
    if (sourceInfo.type === 'url') {
        sourceDisplay = `URL: ${sourceInfo.source}`;
    } else if (sourceInfo.type === 'file') {
        sourceDisplay = 'Arquivo local';
    }
    
    playlistInfo.innerHTML = `
        <p><strong>Total de canais:</strong> ${currentPlaylist.length}</p>
        <p><strong>Categorias:</strong> ${categories.length}</p>
        <p><strong>Fonte:</strong> ${sourceDisplay}</p>
        <p><strong>Última atualização:</strong> ${sourceInfo.loadedAt ? new Date(sourceInfo.loadedAt).toLocaleString('pt-BR') : 'Desconhecida'}</p>
        <p><strong>Categorias disponíveis:</strong></p>
        <ul style="margin-top: 0.5rem; padding-left: 1rem;">
            ${categories.map(cat => `<li>${cat}</li>`).join('')}
        </ul>
    `;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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
document.head.appendChild(style);

// Função para testar proxies (apenas para debug)
async function testProxies() {
    const testUrl = 'https://httpbin.org/get';
    console.log('=== TESTANDO PROXIES ===');
    
    const proxies = [
        { name: 'AllOrigins', url: `https://api.allorigins.win/get?url=${encodeURIComponent(testUrl)}` },
        { name: 'CorsProxy.io', url: `https://corsproxy.io/?${encodeURIComponent(testUrl)}` },
        { name: 'ThingProxy', url: `https://thingproxy.freeboard.io/fetch/${testUrl}` }
    ];
    
    for (const proxy of proxies) {
        try {
            console.log(`Testando ${proxy.name}...`);
            const response = await fetch(proxy.url, { 
                method: 'GET',
                headers: { 'Accept': 'application/json, text/plain, */*' }
            });
            console.log(`${proxy.name}: Status ${response.status}, OK: ${response.ok}`);
            
            if (response.ok) {
                const text = await response.text();
                console.log(`${proxy.name}: Resposta recebida (${text.length} chars)`);
            }
        } catch (error) {
            console.error(`${proxy.name}: Erro -`, error.message);
        }
    }
    console.log('=== FIM DO TESTE DE PROXIES ===');
}

// Função para debug - adiciona botão de teste (apenas para desenvolvimento)
function addDebugButton() {
    if (isAdminLoggedIn) {
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = '<i class="fas fa-bug"></i> Testar Proxies';
        debugBtn.style.cssText = `
            margin-top: 10px;
            padding: 10px 15px;
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        debugBtn.onclick = testProxies;
        
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && !document.getElementById('debugBtn')) {
            debugBtn.id = 'debugBtn';
            adminPanel.appendChild(debugBtn);
        }
    }
}
