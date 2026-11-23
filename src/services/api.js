// URL publicada no Swagger. Pode ser sobrescrita em .env por REACT_APP_API_URL.
export const API_URL = (process.env.REACT_APP_API_URL || "http://10.110.12.07:8083").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    throw new Error(`Não foi possível conectar à API (${API_URL}). Verifique se o backend está ativo e se o CORS permite esta origem.`);
  }

  if (!response.ok) {
    let message = `Erro HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch (_) {
      // Algumas respostas 204/4xx não possuem JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204 || response.status === 201) {
    // O cadastro de máquina documenta 201 sem corpo.
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch (_) { return text; }
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const listarMaquinas = () => request("/v1/cncmachine");
export const buscarMaquina = (id) => request(`/v1/cncmachine/${id}`);
export const pesquisarMaquinas = (filters = {}) => {
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value)
  ).toString();
  return request(`/v1/cncmachine/search${query ? `?${query}` : ""}`);
};
export const criarMaquina = (data) => request("/v1/cncmachine", json("POST", data));
export const atualizarMaquina = (id, data) => request(`/v1/cncmachine/${id}`, json("PUT", data));
export const atualizarStatus = (id, status) =>
  request(`/v1/cncmachine/${id}/status?${new URLSearchParams({ status })}`, { method: "PATCH" });
export const desativarMaquina = (id) => request(`/v1/cncmachine/${id}`, { method: "DELETE" });
export const reativarMaquina = (id) => request(`/v1/cncmachine/${id}/reactivate`, { method: "PATCH" });
export const excluirMaquinaPermanentemente = (id) => request(`/v1/cncmachine/delete/${id}`, { method: "DELETE" });
export const importarTelemetriaCSV = (file) => {
  const form = new FormData();
  form.append("file", file);
  return request("/v1/cncmachine/telemetry/csv", { method: "POST", body: form });
};

export const STATUS = ["ONLINE", "OFFLINE", "MANUTENCAO"];
export const MODELOS = ["HAAS_ST_10", "HAAS_ST_20", "DMG_MORI_CLX_350", "MAZAK_QUICK_TURN_200", "OKUMA_GENOS_L250II", "ROMI_GL_240"];
export const FABRICANTES = ["HAAS", "DMG_MORI", "MAZAK", "OKUMA", "FANUC", "SIEMENS", "ROMI", "TRUMPF"];
export const LOCALIZACOES = ["SETOR_PRODUCAO", "SETOR_USINAGEM", "SETOR_MANUTENCAO", "SETOR_QUALIDADE", "ALMOXARIFADO"];

export const rotuloStatus = (status) => ({ ONLINE: "Online", OFFLINE: "Offline", MANUTENCAO: "Em manutenção" }[status] || status || "Não informado");
export const rotuloEnum = (value) => (value || "—").replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// Compatibilidade com versões anteriores do frontend que utilizavam estes nomes.
export const formatarEnum = rotuloEnum;
export const opcoesMaquina = {
  status: STATUS,
  modelos: MODELOS,
  fabricantes: FABRICANTES,
  localizacoes: LOCALIZACOES,
};

// Fachada de conveniência para componentes que preferem consumir um objeto `api`.
export const api = {
  listarMaquinas,
  buscarMaquina,
  pesquisarMaquinas,
  criarMaquina,
  atualizarMaquina,
  atualizarStatus,
  desativarMaquina,
  reativarMaquina,
  excluirMaquinaPermanentemente,
  importarTelemetriaCSV,
};
