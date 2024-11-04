# Instrucciones para correr la aplicación

### 1. Iniciar el Backend
Primero, ejecuta el backend utilizando el siguiente comando:
```bash
rails s
```
El backend debería correr en el puerto `3001` por defecto.

### 2. Configurar Ngrok
Para exponer el backend públicamente, utiliza `ngrok` ejecutando el siguiente comando:
```bash
ngrok http 3001
```
Este comando generará un enlace similar a este:
```
https://b51f-152-230-18-212.ngrok-free.app
```
Este URL será necesario para configurar el frontend.

### 3. Configurar el Frontend
En el directorio `hybrid-frontend`, crea un archivo `.env` y añade la siguiente línea:
```
EXPO_PUBLIC_API_BASE_URL={URL}
```
Reemplaza `{URL}` por el enlace generado por `ngrok` en el paso anterior. El archivo `.env` debe verse así:
```
EXPO_PUBLIC_API_BASE_URL=https://b51f-152-230-18-212.ngrok-free.app
```

### 4. Iniciar el Frontend
Finalmente, para iniciar el frontend, ejecuta el siguiente comando desde el directorio del proyecto:
```bash
npx expo start --tunnel
```
Este comando iniciará el servidor de Expo. Luego, abre la aplicación **Expo Go** (disponible en la Play Store) y escanea el código QR que aparece en la terminal para ejecutar la aplicación en tu dispositivo móvil.

Si error de sidekiq al seedear la applicación utilizar comando redis-server en terminal y seedear, despues de seedear se puede matar el terminal.
### Generación de Videos para Eventos

Logramos que se generara el video pero no automaticamente ya que aparentement se tiene que utilizar un servidor sideqik que monitorea y si se cumplen los requisitos para la generacion de un video lo genera automaticamente. Nosotros llamamos manualmente al job para esta entrega con las siguiente instrucciones.

#### Pasos para Generar el Video Manualmente:

1. **Subir Imágenes**:
   - Sube imágenes al evento deseado a través de la interfaz de la aplicación.

2. **Abrir la Consola de Rails**:
   - Ingresa a la consola de Rails ejecutando:
     ```bash
     rails c
     ```

3. **Ejecutar el Job de Generación de Video**:
   - Ejecuta el siguiente comando en la consola, reemplazando `EVENT_ID` con el ID del evento al cual subiste las imágenes:
     ```ruby
     GenerateEventVideoJob.perform_now(EVENT_ID)
     ```
   - Este comando generará un video a partir de las imágenes subidas para el evento especificado. El evento de id 1 ya paso su end_date asi que puedes subir fotos a ese evento

Lo que hace nuestro job es que descarga las imagenes del servidor remoto donde se almacenan en public/event_images/EVENT_ID, luego se genera el video en  public/event_videos/ y finalmente se borran las imagenes descargadas para que no se quede basura en el directorio