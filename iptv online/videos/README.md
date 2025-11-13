# Pasta de Vídeos Locais

Esta pasta pode conter vídeos locais para teste. Para adicionar vídeos locais:

1. Coloque arquivos de vídeo (.mp4, .mkv, .avi, etc.) nesta pasta
2. No arquivo M3U, use URLs locais como:
   - http://localhost:8000/videos/meu_filme.mp4
   - http://localhost:8000/videos/serie_s01e01.mp4

## Exemplo de M3U com vídeos locais:

```m3u
#EXTM3U

#EXTINF:-1 tvg-name="Filme Local" group-title="Filmes",Meu Filme Local
http://localhost:8000/videos/filme.mp4

#EXTINF:-1 tvg-name="Série Local S01E01" group-title="Séries",Minha Série - S01E01
http://localhost:8000/videos/serie_s01e01.mp4
```

## Formatos Suportados:
- MP4 (recomendado)
- WebM
- OGV
- M4V
- AVI (dependendo do codec)
- MKV (dependendo do codec)

## Dicas:
- Use formatos web-friendly como MP4 H.264
- Mantenha arquivos com tamanhos razoáveis
- Organize em subpastas se necessário
