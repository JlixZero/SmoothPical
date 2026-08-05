SMOOTH PICAL - Como conectar el boton "Enviar pedido"
======================================================

Este boton manda cada pedido a dos lugares de forma automatica:
  1. Una hoja de Google Sheets (tu "Excel" en la nube).
  2. Un chat de Telegram (para que el equipo lo vea al instante).

Todo esto se hace GRATIS con Google Apps Script, sin necesidad de
contratar un servidor. Sigue estos pasos una sola vez:


PASO 1 - Crear la hoja de Google Sheets
----------------------------------------
1. Entra a sheets.google.com y crea una hoja nueva. Llamala, por ejemplo,
   "Pedidos Smooth Pical".
2. Arriba, ve a Extensiones > Apps Script.
3. Se abrira un editor de codigo con un archivo "Code.gs" vacio (o con
   una funcion myFunction). Borra todo su contenido.
4. Abre el archivo Code.gs que viene junto a esta pagina web y copia TODO
   su contenido dentro del editor de Apps Script. Guarda (icono de disquete
   o Ctrl+S).


PASO 2 (opcional pero recomendado) - Crear el bot de Telegram
----------------------------------------------------------------
1. En Telegram, busca al usuario "@BotFather" y envia el comando /newbot.
2. Sigue las instrucciones (te pedira un nombre y un usuario terminado en
   "bot"). Al final te va a dar un TOKEN, algo como:
   123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Guardalo, lo necesitas en el Paso 3.
3. Agrega ese bot al grupo o canal de Telegram donde quieres recibir los
   pedidos (o simplemente escribele un mensaje directo al bot).
4. Para saber el "chat_id" (el numero del chat/grupo), abre en el navegador:
   https://api.telegram.org/bot<TU_TOKEN>/getUpdates
   (reemplaza <TU_TOKEN> por el token real) despues de haberle escrito un
   mensaje al bot. Ahi vas a ver un numero en "chat":{"id": ...} - ese es
   tu TELEGRAM_CHAT_ID.

Si no quieres usar Telegram por ahora, puedes omitir este paso: los
pedidos se seguiran guardando en la hoja de Google Sheets igual.


PASO 3 - Configurar las claves en Apps Script
------------------------------------------------
1. En el editor de Apps Script, click en el icono de engranaje
   ("Configuracion del proyecto") en el menu de la izquierda.
2. Baja hasta "Propiedades del script" > "Añadir propiedad del script".
3. Agrega estas dos propiedades (si no vas a usar Telegram, puedes omitirlas):
     TELEGRAM_TOKEN   =  el token que te dio @BotFather
     TELEGRAM_CHAT_ID =  el numero de chat que obtuviste


PASO 4 - Publicar como aplicacion web
-----------------------------------------
1. En el editor de Apps Script, arriba a la derecha, click en "Implementar"
   > "Nueva implementacion".
2. Click en el icono de engranaje junto a "Seleccionar tipo" y elige
   "Aplicacion web".
3. Configura:
     Ejecutar como:            Yo (tu cuenta de Google)
     Quien tiene acceso:       Cualquier usuario
4. Click en "Implementar". Google te va a pedir autorizar permisos la
   primera vez (es tu propio script, es seguro aceptar).
5. Copia la "URL de la aplicacion web" que aparece. Se ve asi:
     https://script.google.com/macros/s/AKfycb..../exec


PASO 5 - Conectar la pagina web
-----------------------------------
1. Abre el archivo app.js de la pagina.
2. Busca esta linea casi al principio del archivo:
     const ORDER_WEBHOOK_URL = "";
3. Pega tu URL entre las comillas:
     const ORDER_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycb..../exec";
4. Guarda y vuelve a subir el archivo a donde tengas alojada la pagina.


PROBAR QUE FUNCIONA
-----------------------
- En el editor de Apps Script puedes ejecutar la funcion "pruebaManual"
  (selecciona la funcion en el menu desplegable de arriba y click en
  "Ejecutar") para verificar que se agregue una fila a la hoja y llegue
  un mensaje a Telegram, ANTES de probar desde la pagina web.
- Ya conectada la pagina, arma un pedido de prueba y presiona
  "Enviar pedido". Debe aparecer "Pedido enviado..." y, segundos despues,
  una fila nueva en tu Google Sheet (y un mensaje en Telegram si lo
  configuraste).

NOTA TECNICA: el navegador no puede leer la respuesta que da Apps Script
(por restricciones de seguridad de Google, no de esta pagina), asi que el
boton siempre mostrara "Pedido enviado" si la peticion salio sin errores
de red. Por eso es importante revisar la hoja/Telegram al menos una vez
para confirmar que todo esta bien conectado.
