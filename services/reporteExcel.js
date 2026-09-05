const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function generarReporteVentas(res) {
    const filePath = path.join(__dirname, '..', 'datos.txt');

    // 1. Leer el archivo datos.txt
    const contenido = await fs.promises.readFile(filePath, 'utf8');
    const ventas = JSON.parse(contenido);

    // 2. Crear Excel y la hoja "Ventas"
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    // 3. Configurar cabeceras de columnas
    worksheet.columns = [
        { header: 'Producto', key: 'producto', width: 25 },
        { header: 'Cantidad', key: 'cantidad', width: 12 },
        { header: 'Precio', key: 'precio', width: 12 }
    ];

    // 4. Agregar cada objeto traído desde datos.txt
    ventas.forEach(item => {
        worksheet.addRow(item);
    });

    // 5. Configurar respuesta HTTP y transmitir
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_ventas.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
}

module.exports = { generarReporteVentas };
