Claro, aquí tienes el archivo en código Markdown:

```markdown
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
API_BASE_URL={URL}
```
Reemplaza `{URL}` por el enlace generado por `ngrok` en el paso anterior. El archivo `.env` debe verse así:
```
API_BASE_URL=https://b51f-152-230-18-212.ngrok-free.app
```

### 4. Iniciar el Frontend
Finalmente, para iniciar el frontend, ejecuta el siguiente comando desde el directorio del proyecto:
```bash
npx expo start --tunnel
```
Este comando iniciará el servidor de Expo. Luego, abre la aplicación **Expo Go** (disponible en la Play Store) y escanea el código QR que aparece en la terminal para ejecutar la aplicación en tu dispositivo móvil.

Acá dejamos un video de como funciona la aplicación usando Expo Go ya que tuvimos problemas al intentar utilizar la aplicación con iOS y desde la web.
https://youtu.be/BJNZqZUnB9A