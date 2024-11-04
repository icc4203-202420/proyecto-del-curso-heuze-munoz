### Generación de Videos para Eventos

Si error de sidekiq al seedear la applicación utilizar comando redis-server en terminal y seedear, despues de seedear se puede matar el terminal.
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
   - Este comando generará un video a partir de las imágenes subidas para el evento especificado.

Lo que hace nuestro job es que descarga las imagenes del servidor remoto donde se almacenan en public/event_images/EVENT_ID, luego se genera el video en  public/event_videos/ y finalmente se borran las imagenes descargadas para que no se quede basura en el directorio