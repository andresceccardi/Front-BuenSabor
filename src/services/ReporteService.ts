import axios from "axios";

const urlReportes = 'http://localhost:8080/reportes';

interface RankingComida {
  nombre: string;
  pedidos: number;
}

interface Ingreso {
  fecha: string;
  total: number;
}

interface PedidoCliente {
  nombre: string;
  pedidos: number;
}

interface Ganancia {
  fecha: string;
  total: number;
}

export async function getRankingComidas(fechaInicio: string, fechaFin: string): Promise<RankingComida[]> {
  try {
    const response = await axios.get(`${urlReportes}/ranking-comidas`, { params: { fechaInicio, fechaFin } });
    console.log("getRankingComidas response data:", response.data);
    // Transformar los datos recibidos en el formato adecuado
    const rankingComidas = response.data.map((item: any) => ({
      nombre: item[0],
      pedidos: item[1]
    }));
    return rankingComidas;
  } catch (error) {
    console.error("Error al obtener el ranking de comidas:", error);
    throw error;
  }
}

export async function getIngresos(fechaInicio: string, fechaFin: string, periodo: string): Promise<Ingreso[]> {
  try {
    const response = await axios.get(`${urlReportes}/ingresos`, { params: { fechaInicio, fechaFin, periodo } });
    console.log("getIngresos response data:", response.data);
    const ingresos = response.data.map((item: any) => ({
      fecha: item[0],
      total: item[1]
    }));
    return ingresos;
  } catch (error) {
    console.error("Error al obtener los ingresos:", error);
    throw error;
  }
}

export async function getPedidosPorCliente(fechaInicio: string, fechaFin: string): Promise<PedidoCliente[]> {
  try {
    const response = await axios.get(`${urlReportes}/pedidos-por-cliente`, { params: { fechaInicio, fechaFin } });
    console.log("getPedidosPorCliente response data:", response.data);
    const pedidosPorCliente = response.data.map((item: any) => ({
      nombre: item[0],
      pedidos: item[1]
    }));
    return pedidosPorCliente;
  } catch (error) {
    console.error("Error al obtener los pedidos por cliente:", error);
    throw error;
  }
}

export async function getGanancia(fechaInicio: string, fechaFin: string): Promise<Ganancia[]> {
  try {
    const response = await axios.get(`${urlReportes}/ganancia`, { params: { fechaInicio, fechaFin } });
    console.log("getGanancia response data:", response.data);
    const ganancia = response.data.map((item: any) => ({
      fecha: item[0],
      total: item[1]
    }));
    return ganancia;
  } catch (error) {
    console.error("Error al obtener la ganancia:", error);
    throw error;
  }
}

export default {
  getRankingComidas,
  getIngresos,
  getPedidosPorCliente,
  getGanancia,
};
