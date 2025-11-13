# Streamora - Plataforma de Streaming

Uma plataforma de streaming moderna e responsiva que permite fazer upload de listas M3U e assistir canais de TV, filmes e séries online. Desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## 🚀 Características

- **Sistema de Administração**: Login exclusivo para admin fazer upload de listas M3U
- **Acesso Convidado**: Usuários podem assistir aos canais sem necessidade de login
- **Player Otimizado**: Suporte completo para streams HLS/M3U8, MP4 e outros formatos
- **Detecção Automática**: Identifica automaticamente TV, Filmes e Séries
- **Interface Moderna**: Design responsivo com efeitos glassmorphism
- **Filtros de Conteúdo**: Separação por tipo (TV, Filmes, Séries)
- **Busca Avançada**: Busca por nome do conteúdo ou categoria
- **Categorização**: Organização automática por categorias
- **Controles de Player**: Play/pause, volume, mute, fullscreen
- **Carregamento Rápido**: Otimizações para melhor performance
- **Armazenamento Inteligente**: Sistema eficiente de cache

## 📋 Funcionalidades

### Para Administradores:
- Login com senha personalizada
- Upload de arquivos M3U via drag & drop ou seleção
- Visualização de estatísticas da playlist
- Limpeza da playlist atual
- Gerenciamento completo do conteúdo

### Para Usuários Convidados:
- Visualização de todos os canais disponíveis
- Reprodução de streams em alta qualidade
- Busca por canais
- Navegação por categorias
- Controles completos do player

## 🛠️ Instalação

1. Clone ou baixe os arquivos do projeto
2. Abra o arquivo `script.js` e altere a senha do administrador na linha:
   ```javascript
   const ADMIN_PASSWORD = 'admin123'; // Altere esta senha
   ```
3. Coloque os arquivos em um servidor web (Apache, Nginx, ou use um servidor local)
4. Acesse o `index.html` pelo navegador

## 📱 Como Usar

### Acesso como Administrador:
1. Clique no botão "Admin" no canto superior direito
2. Digite a senha configurada
3. No painel administrativo, faça upload do arquivo M3U
4. A lista será processada e os canais estarão disponíveis

### Acesso como Convidado:
1. Acesse o site normalmente
2. Use a barra de busca para encontrar canais
3. Navegue pelas categorias na barra lateral
4. Clique em um canal para começar a assistir

## 🎯 Formato M3U Suportado

O player suporta arquivos M3U/M3U8 padrão com as seguintes tags:
- `#EXTINF`: Informações do canal (nome, logo, grupo)
- `group-title`: Categoria do canal
- `tvg-logo`: URL do logo do canal
- `tvg-id`: ID único do canal

Exemplo:
```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="logo.png" group-title="Esportes",Canal Esportivo
http://exemplo.com/stream.m3u8
```

## 🔧 Configurações

### Alterando a Senha do Admin:
Edite a linha no arquivo `script.js`:
```javascript
const ADMIN_PASSWORD = 'SuaNovaSenha';
```

### Personalizando Cores:
Edite o arquivo `styles.css` para alterar o esquema de cores do tema.

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, Tablet, Mobile
- **Formatos**: HLS (m3u8), MP4, WebM, outros formatos suportados pelo navegador
- **Protocolos**: HTTP, HTTPS

## 🛡️ Segurança

- Senha de administrador configurável
- Validação de arquivos M3U
- Sanitização de URLs
- Controle de acesso por função

## 📈 Funcionalidades Futuras

- [ ] Sistema de usuários com diferentes níveis
- [ ] Favorites/Lista de desejos
- [ ] Histórico de visualização
- [ ] Guia de programação (EPG)
- [ ] Múltiplas listas M3U
- [ ] Backup automático das configurações

## 🐛 Solução de Problemas

### Canal não carrega:
- Verifique se a URL do stream está funcionando
- Teste o stream em outro player
- Verifique a conexão de internet

### Upload de M3U falha:
- Verifique se o arquivo tem extensão .m3u ou .m3u8
- Confirme que o arquivo não está corrompido
- Teste com um arquivo M3U menor

### Player não funciona:
- Verifique se o navegador suporta HLS
- Atualize o navegador para a versão mais recente
- Desative bloqueadores de anúncio se necessário

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma issue no repositório
- Consulte a documentação
- Verifique os logs do console do navegador

---

**IPTV Online Player** - Uma solução completa para streaming IPTV na web! 📺✨
