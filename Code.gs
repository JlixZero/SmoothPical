/**
 * Smooth Pical - Recibe pedidos desde la pagina web y los guarda en esta
 * hoja de Google Sheets, ademas de reenviarlos a un chat de Telegram.
 *
 * INSTALACION (ver README-PEDIDOS.txt para el paso a paso con imagenes):
 * 1. Crea una Google Sheet nueva (o usa una existente).
 * 2. Extensiones > Apps Script. Borra el contenido de Code.gs y pega este archivo.
 * 3. Ve a "Configuracion del proyecto" (icono de engranaje) > "Propiedades
 *    del script" y crea dos propiedades:
 *      TELEGRAM_TOKEN   -> el token que te da @BotFather
 *      TELEGRAM_CHAT_ID -> el id numerico del chat/grupo que debe recibir los pedidos
 * 4. Guarda, luego "Implementar" > "Nueva implementacion" > tipo "Aplicacion web".
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quien tiene acceso: Cualquier usuario
 * 5. Copia la URL que te entrega ("Web app URL") y pegala en app.js en la
 *    constante ORDER_WEBHOOK_URL.
 */

const SHEET_NAME = "Pedidos";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendToSheet(data);
    notifyTelegram(data);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Fecha",
      "Nombre",
      "Sabor",
      "Base",
      "Extras",
      "Cantidad",
      "Total",
      "Notas",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendToSheet(data) {
  const sheet = getSheet();
  sheet.appendRow([
    data.fecha || new Date().toLocaleString("es-CO"),
    data.nombre || "",
    data.sabor || "",
    data.base || "",
    data.extras || "",
    data.cantidad || "",
    data.total || "",
    data.notas || "",
  ]);
}

function notifyTelegram(data) {
  const token = PropertiesService.getScriptProperties().getProperty("TELEGRAM_TOKEN");
  const chatId = PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return; // Telegram es opcional: si no esta configurado, se omite.

  const text = [
    "🥤 *Nuevo pedido Smooth Pical*",
    `*Nombre:* ${data.nombre || "-"}`,
    `*Sabor:* ${data.sabor || "-"}`,
    `*Base:* ${data.base || "-"}`,
    `*Extras:* ${data.extras || "-"}`,
    `*Cantidad:* ${data.cantidad || "-"}`,
    `*Total:* ${data.total || "-"}`,
    `*Notas:* ${data.notas || "-"}`,
    `*Fecha:* ${data.fecha || "-"}`,
  ].join("\n");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
    muteHttpExceptions: true,
  });
}

/**
 * Funcion de prueba: ejecutala manualmente desde el editor de Apps Script
 * (boton "Ejecutar") para verificar que la fila y el mensaje de Telegram
 * llegan correctamente antes de conectar la pagina web real.
 */
function pruebaManual() {
  const data = {
    fecha: new Date().toLocaleString("es-CO"),
    nombre: "Prueba",
    sabor: "MangoBoom",
    base: "Leche",
    extras: "Granola",
    cantidad: 1,
    total: "$9.000",
    notas: "Esto es una prueba",
  };
  appendToSheet(data);
  notifyTelegram(data);
}
