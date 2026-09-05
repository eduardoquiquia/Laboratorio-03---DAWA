const http = require('http');
const { generarReporteVentas } = require('./services/reporteExcel');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    if (req.url === '/reporte') {
        try {
            await generarReporteVentas(res);
        } catch (error) {
            console.error('Error al generar el reporte Excel:', error);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end('Error interno al generar el reporte.');
            }
        }
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Visita /reporte para descargar el Excel');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});