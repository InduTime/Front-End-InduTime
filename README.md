# InduTime — Frontend

## Iniciar o projeto

1. Instale o Node.js e o npm.
2. Na pasta do projeto, instale as dependências:

   ```bash
   npm ci
   ```

3. Copie o arquivo de configuração da API:

   ```bash
   cp .env.example .env
   ```

4. Ajuste `REACT_APP_API_URL` no `.env`:
   - `http://localhost:8080` se o backend estiver no mesmo computador;
   - `http://10.110.12.51:8080` se o backend estiver disponível nesse endereço da rede, conforme o Swagger informado.
5. Inicie o frontend:

   ```bash
   npm start
   ```

A aplicação ficará disponível em `http://localhost:3000`.

## Dados de operação

- `running` determina se existe uma operação em andamento.
- `operatingTimeSeconds` é usado como duração da operação atual.
- O contador visual avança localmente a cada segundo enquanto `running` for `true` e é sincronizado com a API a cada 30 segundos.
- `operationStartedAt` mostra o início da operação atual.
- `lastTelemetryAt` mostra a data/hora da última telemetria recebida.
- `temperature` mostra a temperatura atual quando fornecida.
- `totalOperatingSeconds` não é usado nesta versão, pois não é necessário para exibir a operação atual.

**Limite do histórico:** `GET /v1/cncmachine/{id}` retorna dados da máquina e da operação atual, mas não uma coleção de eventos anteriores de ligar/desligar. A página Histórico não inventa sessões passadas; ela mostra a sessão atual. Para uma lista cronológica completa, o backend precisa fornecer uma rota de eventos/histórico.

## Estrutura principal de pastas

```text
src/
├── component/   # Componentes compartilhados, sidebar, login e cadastro
├── css/         # Estilos das telas
├── data/        # Dados auxiliares existentes
├── services/    # Comunicação com a API
├── tela/        # Dashboard, Histórico, Máquinas e Configurações
├── utils/       # Formatação de duração e datas
├── App.js       # Rotas da aplicação
└── index.js     # Inicialização do React
```

## Rotas principais

- `/` — login
- `/ListaMaquinas` — lista de máquinas
- `/maquinas/:id/DashBoard` — dashboard da máquina
- `/Historico/:id` — histórico/sessão atual da máquina
- `/Configuracao` e `/Configuracao/:id` — configurações
