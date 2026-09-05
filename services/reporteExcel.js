const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ExcelJS = require('exceljs');

async function generarReporteVentas(res) {
    const filePath = path.join(__dirname, '..', 'datos.txt');

    const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
        { header: 'Producto', key: 'producto', width: 25 },
        { header: 'Cantidad', key: 'cantidad', width: 12 },
        { header: 'Precio', key: 'precio', width: 12 }
    ];

    for await (const line of rl) {
        const lineaLimpia = line.trim();
        
        if (!lineaLimpia || lineaLimpia === '[' || lineaLimpia === ']') continue;

        const jsonString = lineaLimpia.endsWith(',') ? lineaLimpia.slice(0, -1) : lineaLimpia;

        try {
            const item = JSON.parse(jsonString);
            worksheet.addRow(item);
        } catch (err) {
            console.error('Error al parsear la línea:', jsonString, err);}
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_ventas.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
}

module.exports = { generarReporteVentas };
