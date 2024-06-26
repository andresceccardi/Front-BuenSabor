import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
} from "@mui/material";
import * as XLSX from "xlsx";
import {
  getRankingComidas,
  getIngresos,
  getPedidosPorCliente,
  getGanancia,
} from "../../services/ReporteService";
import { saveAs } from "file-saver";

const ReportePage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [rankingComidas, setRankingComidas] = useState<any[]>([]);
  const [ingresosDiarios, setIngresosDiarios] = useState<any[]>([]);
  const [ingresosMensuales, setIngresosMensuales] = useState<any[]>([]);
  const [pedidosPorCliente, setPedidosPorCliente] = useState<any[]>([]);
  const [ganancia, setGanancia] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const rankingComidasData = await getRankingComidas(fechaInicio, fechaFin);
        console.log('Ranking de Comidas:', rankingComidasData);

        const ingresosDiariosData = await getIngresos(fechaInicio, fechaFin, 'diario');
        console.log('Ingresos Diarios:', ingresosDiariosData);

        const ingresosMensualesData = await getIngresos(fechaInicio, fechaFin, 'mensual');
        console.log('Ingresos Mensuales:', ingresosMensualesData);

        const pedidosPorClienteData = await getPedidosPorCliente(fechaInicio, fechaFin);
        console.log('Pedidos por Cliente:', pedidosPorClienteData);

        const gananciaData = await getGanancia(fechaInicio, fechaFin);
        console.log('Ganancia:', gananciaData);

        // Filtrar datos nulos antes de asignar al estado
        setRankingComidas(rankingComidasData.filter((item: any) => item.nombre !== null));
        setIngresosDiarios(ingresosDiariosData);
        setIngresosMensuales(ingresosMensualesData);
        setPedidosPorCliente(pedidosPorClienteData);
        setGanancia(gananciaData);
        setError(null); // Reiniciar error si la solicitud tiene éxito
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
        setError("Error al obtener los reportes. Por favor, inténtelo más tarde.");
      }
    };

    if (fechaInicio && fechaFin) {
      fetchReportes();
    }
  }, [fechaInicio, fechaFin]);

  const handleExportToExcel = () => {
    const data = [
      { title: 'Ranking de Comidas', data: rankingComidas },
      { title: 'Ingresos Diarios', data: ingresosDiarios },
      { title: 'Ingresos Mensuales', data: ingresosMensuales },
      { title: 'Pedidos por Cliente', data: pedidosPorCliente },
      { title: 'Ganancia', data: ganancia },
    ];

    const wb = XLSX.utils.book_new();
    data.forEach(({ title, data }) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, title);
    });

    const exportFileName = `Reportes_${fechaInicio}_a_${fechaFin}.xlsx`;
    XLSX.writeFile(wb, exportFileName);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>

      <Box mb={4} display="flex" alignItems="center">
        <TextField
          label="Fecha Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 10 }}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 10 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportToExcel}
          disabled={!(rankingComidas.length > 0 && ingresosDiarios.length > 0 && ingresosMensuales.length > 0 && pedidosPorCliente.length > 0 && ganancia.length > 0)}
        >
          Exportar a Excel
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error || ""}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />

      <Typography variant="h6" gutterBottom>
        Ranking de Comidas Más Pedidas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Comida</TableCell>
              <TableCell>Pedidos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rankingComidas.map((comida, index) => (
              <TableRow key={index}>
                <TableCell>{comida.nombre}</TableCell>
                <TableCell>{comida.pedidos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom mt={4}>
        Ingresos Diarios
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Ingresos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingresosDiarios.map((ingreso, index) => (
              <TableRow key={index}>
                <TableCell>{ingreso.fecha}</TableCell>
                <TableCell>${ingreso.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom mt={4}>
        Ingresos Mensuales
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mes</TableCell>
              <TableCell>Ingresos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingresosMensuales.map((ingreso, index) => (
              <TableRow key={index}>
                <TableCell>{ingreso.mes}</TableCell>
                <TableCell>${ingreso.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom mt={4}>
        Pedidos por Cliente
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Pedidos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidosPorCliente.map((cliente, index) => (
              <TableRow key={index}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.pedidos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom mt={4}>
        Ganancia
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Ganancia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ganancia.map((g, index) => (
              <TableRow key={index}>
                <TableCell>{g.fecha}</TableCell>
                <TableCell>${g.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportePage;
