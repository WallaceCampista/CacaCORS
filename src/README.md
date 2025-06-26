# Caça CORS

## Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
  - [Múltiplos Métodos HTTP](#multiplos-metodos-http)
    - [Editor de Headers](#editor-de-headers)
    - [Editor de Body JSON](#editor-de-body-json)
    - [Histórico de URLs](#historico-de-urls)
  - [Detalhamento da Resposta](#detalhamento-da-resposta)
    - [Status Code](#status-code)
    - [Tempo de Resposta](#tempo-de-resposta)
    - [Tamanho da Resposta](#tamanho-da-resposta)
    - [Visualização de Body e Headers](#visualizacao-de-body-e-headers)
  - [Simulação de Carga (Load Test)](#simulacao-de-carga-load-test)
    - [AVISO](#aviso)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Configurar e Executar](#como-configurar-e-executar)
- [Uso Configurações Globais](#uso-configurações-globais)
- [Realizando Requisições HTTP](#realizando-requisicoes-http)
- [Analisando a Resposta](#analisando-a-resposta)
- [Teste de Carga](#teste-de-carga)
- [Contribuição](#contribuicao)
- [Licença](#licenca)

<br>

## Sobre o Projeto
Caça CORS é uma ferramenta interativa baseada em navegador, projetada para auxiliar desenvolvedores e testadores na realização de requisições HTTP e na simulação de carga simples. Ela oferece uma interface intuitiva para testar diferentes métodos HTTP (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), inspecionar respostas detalhadas, gerenciar cabeçalhos e tokens de autenticação, além de incluir uma funcionalidade de teste de carga para simular múltiplos pedidos a um endpoint.

O principal objetivo desta ferramenta é simplificar o processo de depuração de APIs, especialmente em cenários envolvendo problemas de CORS (Cross-Origin Resource Sharing), e fornecer um meio rápido de verificar o comportamento de endpoints sob diferentes condições.

<br>

## Funcionalidades
### Múltiplos Métodos HTTP: 
Suporte para GET, POST, PUT, PATCH, DELETE, HEAD e OPTIONS.

### Editor de Headers: 
Adicione e remova cabeçalhos de requisição de forma dinâmica, com um campo dedicado para Authorization (Bearer Token).

### Editor de Body JSON: 
Área de texto dedicada para enviar corpos de requisição formatados em JSON para métodos aplicáveis.

### Histórico de URLs: 
Armazena e sugere URLs usadas anteriormente para cada método, agilizando testes repetitivos.

### Detalhamento da Resposta:

- #### Status Code: 
Exibe o código de status HTTP com uma descrição amigável e cores indicativas (sucesso, redirecionamento, erro de cliente, erro de servidor).

- #### Tempo de Resposta: 
Mostra o tempo total da requisição em milissegundos, com um tooltip detalhado (DNS Lookup, TCP Handshake, SSL Handshake, TTFB, Download, Process).

- #### Tamanho da Resposta: 
Apresenta o tamanho total (headers + body) em KB, com um tooltip detalhado (tamanho dos headers da requisição, body da requisição, headers da resposta, body da resposta).

- #### Visualização de Body e Headers: 
Abas dedicadas para alternar entre a visualização formatada do corpo da resposta (JSON) e os cabeçalhos.

### Simulação de Carga (Load Test):

- Dispare requisições repetitivas a um endpoint específico com um intervalo configurável.
Monitore o total de requisições enviadas, o número de sucessos e o número de falhas.

#### AVISO: Esta funcionalidade é apenas para testes de carga em servidores sob seu controle e com permissão explícita. O uso indevido para ataques DDoS é ilegal e antiético.

### Configurações Globais:
- Defina uma Base URL padrão e um Token de Autorização que serão usados automaticamente nas requisições.

- Limpeza de Histórico: Opção para limpar todo o histórico de URLs salvas.

- Alternância de Tema: Suporte a tema claro e escuro, persistido no localStorage.

<br>

## Tecnologias Utilizadas
- HTML5: Estrutura da página.
- CSS3: Estilização personalizada.
- Tailwind CSS: Framework CSS para utilitários de estilização rápida e responsiva.
- JavaScript (ES6+): Lógica da aplicação, manipulação do DOM, requisições HTTP (Fetch API), e armazenamento local (localStorage).

## Como Configurar e Executar
Este projeto é uma aplicação web de front-end puro, o que significa que você pode executá-lo diretamente no seu navegador.

### Clone o repositório (ou salve os arquivos):
```bash
git clone https://github.com/seu-usuario/caca-cors.git
```
```bash
cd caca-cors
```

(Se você baixou os arquivos diretamente, certifique-se de que index.html, style.css e script.js estão na mesma pasta.)

1. Abra o index.html:
Simplesmente clique duas vezes no arquivo index.html no seu explorador de arquivos, ou arraste-o para o seu navegador web.

Alternativamente, usando um servidor local (recomendado para desenvolvimento):
Para evitar possíveis problemas de CORS (ironicamente!) ao testar a própria ferramenta ou para ter uma experiência de desenvolvimento mais robusta, você pode usar um servidor web local simples:

#### Com Python:

```bash
python -m http.server 8000
```

Então, abra seu navegador e vá para http://localhost:8000.

#### Com Node.js (se tiver http-server instalado):

```bash
npx http-server . -p 8000
```

Então, abra seu navegador e vá para http://localhost:8000.

<br>

## Arquitetura do Projeto
A estrutura do projeto é simples e organizada da seguinte forma:

```
src 
├── assets 
│   └── logo.png 
│   └── favicon.ico 
├── css 
│   └── style.css 
├── html 
│   └── index.html 
├── js 
│   └── script.js 
└── README.md
└── LICENSE.md
```

## Uso Configurações Globais:

1. Clique no botão "UrlsBase & Token".

2. Insira a Base URL para suas requisições (ex: http://localhost:8080 ou https://api.example.com). Este será o prefixo para todos os seus endpoints.

3. Opcionalmente, insira um Token de autenticação (JWT) para ser enviado automaticamente no cabeçalho Authorization: Bearer <seu-token>.

4. Clique em "Salvar".

<br>

## Realizando Requisições HTTP:

Selecione o método HTTP desejado (POST, GET, PUT, etc.) nas abas superiores.

No campo "Endpoint URL", insira o caminho relativo ao seu endpoint (ex: /users, /products/123).

Para métodos com corpo (POST, PUT, PATCH), adicione seu JSON no campo "Body (JSON)".

Marque "Adicionar Headers" para incluir cabeçalhos personalizados. Um cabeçalho Authorization será adicionado por padrão se um token global for configurado.

Clique em "Enviar".

<br> 

## Analisando a Resposta:

A seção "Resposta" mostrará o Status da requisição, o Tempo e o Tamanho da resposta.

Use as abas "Body" e "Headers" para inspecionar o conteúdo completo da resposta.

Passe o mouse sobre "Tempo" e "Tamanho" para ver detalhes adicionais.

<br>

## Teste de Carga:

Clique no botão "Carga" para alternar para a interface de simulação de carga.

1. Defina o Intervalo (ms) entre as requisições.

2. Insira o Endpoint de Carga (Obrigatório).

3. Selecione o Método de Carga (Por padrão vem GET).

4. Se necessário, insira um Body (JSON) para métodos que o exigem.

#### Clique em "Iniciar Simulação" para começar.

#### Clique em "Parar Simulação" para pausar.

#### Clique em "Resetar" para zerar as contagens.

<br>

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues para bugs ou sugestões de funcionalidades, ou enviar pull requests.

<br>

## Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

Desenvolvido com 💖