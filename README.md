# 🌍 Living Around

**Site estático** desenvolvido em **HTML, CSS e Bootstrap 5**.  
O projeto apresenta quatro páginas principais: **Home**, **Acomodação**, **Locais** e **Contatos**.  
O destaque é a página **Locais**, que integra o **Google Maps** e carrega a API **sob demanda**, apenas quando necessário.

---

## 🔗 Acesse o site

👉 [**https://aricialima.github.io/living-around-site/**](https://aricialima.github.io/living-around-site/)

---
## 📁 Estrutura do Projeto

```
.
├─ index.html          # Página inicial
├─ locals.html         # Página com Google Maps
├─ acomodacao.html     # Página de acomodações
├─ contacts.html       # Página de contato
├─ style.css           # Estilos globais do site
├─ script.js           # Lógica do site + Google Maps
├─ icons/              # Ícones utilizados
└─ img/                # Imagens do projeto
```

---

## 🗺️ Página “Locais” (Google Maps API)

Toda a lógica da página está centralizada em **`script.js`**.

### 🔹 Estrutura dos dados

As cidades e países são definidos no objeto `DATA`.  
Cada cidade contém coordenadas, endereço e e-mail.

Exemplo:
```js
DATA.pt.cities.Coimbra = {
  lat: 40.203314,
  lng: -8.410257,
  addr: 'Largo da Portagem, 1\n3000-337 - Coimbra',
  email: 'livingaround_coimbra@living.com'
}
```

---

### 🔹 Atualização dinâmica dos selects

A função `populateCities(countryCode)` limpa e repovoa o `<select id="city">`  
de acordo com o país selecionado.

---

### 🔹 Carregamento sob demanda do Google Maps

A API do Maps é carregada **somente quando o usuário clica em “Ver”** ou na **pré-seleção inicial**.

- O link de carregamento está em `script.js`.  
  Procure por:
  ```
  maps.googleapis.com/maps/api/js?key=...
  ```
  e substitua o valor após `key=` pela **sua API Key**.

#### 🔸 Restrições recomendadas (Google Cloud → Credentials)
- **HTTP referrers (web sites)**:
  - `http://localhost/*` (para desenvolvimento)
  - `https://seudominio.com/*` (ou `https://usuario.github.io/*` para produção)

---

### 🔹 Inicialização e atualização do mapa

- `initLocalsMap`: callback de inicialização da API.
- `updateMap(countryCode, cityKey)`: centraliza o mapa, cria marcador e atualiza as informações do card.
- O mapa começa **oculto (`d-none`)** e é exibido quando há seleção válida.

#### Pré-seleção padrão
Ao carregar a página, o **país “Portugal”** e a **cidade “Porto”** são pré-selecionados.  
O mapa é carregado e centralizado automaticamente.

---

### 🔹 Fluxo resumido

1. Usuário escolhe o país → `populateCities` atualiza o `<select>` de cidades.  
2. Clica em **“Ver”** → a API é carregada (se ainda não estiver) e `updateMap` é chamado.  
3. O mapa é exibido, centralizado e o card de informações é atualizado.

---

## 🎨 Customizações rápidas

| Elemento | Local | Descrição |
|-----------|--------|-----------|
| **Botão “Ver”** | `style.css` | Cor definida por `--primary-color` (`#686931` por padrão) |
| **Opacidade do fundo (Locais)** | `.locals-bg` | Ajuste em `opacity` |
| **Dimensões do mapa e cartões** | `.locals-card`, `.locals-map`, `.locals-addr-card` | Controle de largura e `max-width: 92vw` |

---

## 💻 Como executar o projeto

### 🔸 Modo simples
Abra `index.html` diretamente no navegador.

### 🔸 Modo recomendado (para testar o Google Maps)
A API exige um *origin* válido.  
Execute o projeto com um **servidor local** (exemplo: *Live Server* no VS Code).

```bash
# Usando Python 3
python -m http.server 5500
# Acesse http://localhost:5500
```

---

## 🧩 Layout e colunas (Bootstrap 5)

A página **Locais** usa o sistema de grid do **Bootstrap 5** para centralizar os elementos.

### Estrutura principal

```html
<div class="container min-vh-100 d-flex align-items-center justify-content-center">
  <div class="row g-4 align-items-start justify-content-center">
    <div class="col-12 col-md-auto align-self-start">...</div>
    <div class="col-12 col-md-auto align-self-start">...</div>
  </div>
</div>
```

### Explicação

- `min-vh-100`: ocupa 100% da altura da janela  
- `align-items-center`: centraliza verticalmente  
- `justify-content-center`: centraliza horizontalmente  
- `g-4`: adiciona espaçamento entre colunas  
- `col-12`: empilha no mobile  
- `col-md-auto`: ajusta conforme o conteúdo no desktop  

---

## 🧰 Problemas comuns

| Erro | Causa provável | Solução |
|------|----------------|----------|
| `RefererNotAllowedMapError` | O domínio não está permitido na API Key | Adicione `localhost` e seu domínio de produção nos referrers |
| Mapa não aparece | API Key incorreta ou billing desativado | Verifique a Key e o projeto no [Google Cloud Console](https://console.cloud.google.com) |
| Mapa sem HTTPS | GitHub Pages sem HTTPS ativado | Vá em *Settings → Pages* e marque **Enforce HTTPS** |

---

## 📝 Observações finais

- O formulário da página **Contatos** não possui backend: apenas exibe um modal de sucesso.
- O projeto é totalmente **estático**, ideal para hospedagem gratuita no **GitHub Pages**.
- Código simples e bem documentado, fácil de adaptar para novos destinos ou idiomas.

---

**💡 Dica:** se quiser tornar o projeto dinâmico futuramente, você pode integrar um backend leve (Node.js, Firebase ou Supabase) apenas para processar formulários ou armazenar destinos.
