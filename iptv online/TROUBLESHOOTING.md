# Streamora - Guia de Solução de Problemas

## 🔧 Problema: Lista M3U não está carregando no Netlify

### Sintomas:
- A URL da lista M3U é inserida mas não carrega nenhum conteúdo
- A mensagem "Lista carregada com sucesso!" não aparece
- Nenhum canal aparece no painel lateral

### Soluções para Testar:

#### 1. **Verificar Console do Navegador** 🖥️
1. Abra o site no navegador
2. Pressione **F12** para abrir as Ferramentas do Desenvolvedor
3. Vá na aba **Console**
4. Tente carregar a lista M3U
5. Observe as mensagens que aparecem (copie e cole qualquer erro)

#### 2. **Usar Botão de Debug** 🐛
1. Faça login como Admin (senha: `admin123`)
2. No painel admin, procure o botão laranja **"🐛 Testar Proxies"**
3. Clique no botão
4. Verifique no Console quais proxies estão funcionando

#### 3. **Testar URLs Diferentes** 🌐
Teste com estas URLs de exemplo:
```
https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8
https://iptv-org.github.io/iptv/index.m3u
```

#### 4. **Verificar Formato da URL** ✅
- A URL deve começar com `http://` ou `https://`
- A URL deve ser acessível publicamente (não pode estar em rede local)
- Teste se a URL abre diretamente no navegador

### Como Reportar Problemas:

Quando reportar um problema, inclua:

1. **URL que está tentando carregar**
2. **Mensagens do Console** (F12 → Console)
3. **Resultado do teste de proxies** (botão debug)
4. **Navegador usado** (Chrome, Firefox, etc.)

### Proxies Utilizados:

O sistema tenta 3 proxies diferentes automaticamente:
1. AllOrigins (api.allorigins.win)
2. CorsProxy.io (corsproxy.io)
3. ThingProxy (thingproxy.freeboard.io)

### URLs de Teste Recomendadas:

#### ✅ URLs que geralmente funcionam:
- `https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8`
- `https://iptv-org.github.io/iptv/index.m3u`

#### ❌ URLs que podem não funcionar:
- URLs de redes locais (192.168.x.x, 10.x.x.x)
- URLs que requerem autenticação
- URLs com CORS muito restritivos

---

## 📱 Como Usar o Streamora

### Para Administradores:
1. Clique em **"Admin"** no canto superior direito
2. Digite a senha: `admin123`
3. No painel admin, você pode:
   - **Carregar arquivo M3U** (upload direto)
   - **Carregar URL M3U** (de um link)
   - **Limpar playlist** (remover todos os canais)
   - **Testar proxies** (botão debug)

### Para Visitantes:
1. Simplesmente abra o site
2. Use os filtros no lado esquerdo:
   - **📺 TV** - Canais de televisão
   - **🎬 Filmes** - Conteúdo de filmes
   - **📺 Séries** - Séries de TV
3. Clique em qualquer canal para assistir

---

## 🚀 Deployment no Netlify

### Arquivos Necessários:
- `index-netlify.html` (renomear para `index.html`)
- `script-netlify.js` (renomear para `script.js`)
- `styles.css`
- `netlify.toml`
- `_redirects`

### Passos:
1. Renomeie os arquivos conforme indicado acima
2. Faça upload da pasta para o Netlify
3. O site estará disponível na URL fornecida pelo Netlify

---

## 📞 Suporte

Se os problemas persistirem após seguir este guia, forneça:

1. **Console logs** (mensagens de erro completas)
2. **URL da lista M3U** que está tentando usar
3. **Navegador e versão**
4. **Resultado dos testes de proxy**

**Logs importantes para compartilhar:**
- Mensagens que começam com `=== INICIANDO CARREGAMENTO ===`
- Mensagens que começam com `=== ERRO NO CARREGAMENTO ===`
- Resultados do `=== TESTANDO PROXIES ===`
