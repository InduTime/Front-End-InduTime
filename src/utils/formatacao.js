export function formatarDuracaoSegundos(valor) {
  const segundos = Number(valor);
  if (!Number.isFinite(segundos) || segundos < 0) return "—";

  const total = Math.floor(segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const resto = total % 60;

  if (horas > 0) {
    return `${String(horas).padStart(2, "0")}h ${String(minutos).padStart(2, "0")}min ${String(resto).padStart(2, "0")}s`;
  }
  return `${String(minutos).padStart(2, "0")}min ${String(resto).padStart(2, "0")}s`;
}

export function formatarDataHora(valor) {
  if (!valor) return "Não informado";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(data);
}

export function valorNumericoValido(valor) {
  return typeof valor === "number" && Number.isFinite(valor) && valor >= 0;
}
