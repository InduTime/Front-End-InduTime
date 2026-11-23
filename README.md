# InduTime — Frontend React

Frontend do sistema de monitoramento de máquinas CNC.

## Requisitos

- Node.js e npm
- Backend InduTime disponível na rede

## Configurar a API

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite `REACT_APP_API_URL` no `.env`:

```env
REACT_APP_API_URL=http://localhost:8083
```

Use `localhost` quando o backend estiver no mesmo computador do navegador. Se o backend estiver em outro computador, substitua `localhost` pelo IP desse servidor, mantendo a porta `8083`.

A mesma variável é utilizada pelas chamadas de máquinas, operações e usuários (login, cadastro e recuperação de senha). Reinicie o servidor React após alterar o `.env`.

## Instalar e executar

```bash
npm ci
npm start
```

A aplicação ficará disponível em `http://localhost:3000`.

## Rotas principais

- `/` — login, cadastro e recuperação de senha
- `/ListaMaquinas` — lista de máquinas
- `/DashBoard/:id` — dashboard da máquina
- `/Historico/:id` — histórico de operações e leituras de temperatura
- `/Configuracao` — cadastro e gerenciamento de máquinas
- `/Configuracao/:id` — configuração da máquina selecionada

## Integração do histórico

- `GET /v1/operations` — lista operações; usa `raspberryMachineId` para filtrar a máquina, além de filtros de data e status.
- `GET /v1/operations/{operationId}` — detalhe da operação; usa o `id` interno da operação e retorna `temperatureReadings`.

A listagem não possui paginação no backend. As leituras são exibidas na ordem cronológica fornecida pela API.

## Dashboard e dados de operação

- `running` informa se existe uma operação em andamento.
- `totalOperatingSeconds` representa a duração da sessão de operação atual.
- `operatingTimeSeconds` representa o tempo acumulado de operação da máquina desde sua criação.
- `operationStartedAt` informa o início da operação atual.
- `temperature` informa a última temperatura disponibilizada pela API.
- `status` (`ONLINE`, `OFFLINE`, `MANUTENCAO`) representa o estado cadastral/conectividade da máquina e não substitui `running`.

## Observações

- Login, cadastro e recuperação de senha usam a mesma base `REACT_APP_API_URL`.
- A tela Configurações mantém o gerenciamento cadastral das máquinas; a opção de importar telemetria CSV foi removida da interface.
- O frontend não deve inventar leituras, operações ou estados que não tenham sido retornados pelo backend.
