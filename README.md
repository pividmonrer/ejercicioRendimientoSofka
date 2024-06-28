# PRUEBA DE CARGA

Este EJERCICIO realiza una prueba de carga en la página de Petstore utilizando K6, con resultados visualizados en Grafana y almacenados en InfluxDB.

## Requisitos

- Windows 11 (Testeado en Windows 11)
- Chocolatey
- Docker Desktop

## Instalación

### Paso 1: Instalar Chocolatey y K6

1. **Instalar Chocolatey**:
   - Abrir PowerShell como administrador y ejecutar:
     ```powershell
     Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
     ```

2. **Instalar K6**:
   - Ejecutar en PowerShell:
     ```powershell
     choco install k6
     ```

### Paso 2: Instalar Docker Desktop

- Descarga e instala Docker Desktop desde [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).

## Configuración del Proyecto

1. **Crear la Estructura de Directorios**:
   - Abrir PowerShell y ejecuta:
     ```powershell
     mkdir k6-grafana
     cd k6-grafana
     mkdir scripts grafana/provisioning
     ```

2. **Desarrollo del Script de K6**:

ADJUNTO EN LOS ARCHIVOS

3. **Crear el Archivo `docker-compose.yml`**:
   - Crear `docker-compose.yml` con el siguiente contenido:
     ```yaml
     version: '3'

     services:
       influxdb:
         image: influxdb:1.8
         ports:
           - "8086:8086"
         environment:
           INFLUXDB_DB: k6
           INFLUXDB_ADMIN_USER: admin
           INFLUXDB_ADMIN_PASSWORD: admin
           INFLUXDB_USER: k6
           INFLUXDB_USER_PASSWORD: k6

       grafana:
         image: grafana/grafana:latest
         ports:
           - "3000:3000"
         environment:
           GF_SECURITY_ADMIN_USER: admin
           GF_SECURITY_ADMIN_PASSWORD: admin
         volumes:
           - ./grafana/provisioning:/etc/grafana/provisioning

       k6:
         image: loadimpact/k6:latest
         volumes:
           - ./scripts:/scripts
         entrypoint: [ "sh", "-c", "while true; do sleep 30; done;" ]

       k6_runner:
         image: loadimpact/k6:latest
         volumes:
           - ./scripts:/scripts
         entrypoint: [ "k6", "run", "--out", "influxdb=http://influxdb:8086/k6", "/scripts/script.js" ]
         depends_on:
           - influxdb
     ```

## Ejecución del Proyecto

1. **Iniciar los Servicios**:
   - Desde el directorio `k6-grafana`, ejecutar:
     ```powershell
     docker-compose up -d
     ```

2. **Ejecutar la Prueba de Carga**:
   - Ejecutar:
     ```powershell
     docker-compose run k6_runner
     ```

3. **Acceder a Grafana**:
   - Abrir `http://localhost:3000` en el navegador.
   - Usuario: `admin`
   - Contraseña: `admin`
Luego del ingreso por primera vez, Grafana forzará al usuario a cambiar la contraseña. Se puede poner algo como "admin2"

4. **Configurar la Fuente de Datos en Grafana**:
   - Ir a "Connections" > "Data Sources" y buscar la fuente deseada.
   - Seleccionar "InfluxDB".
   - Configurar lo siguiente:
     - **URL**: `http://influxdb:8086`
     - **Database**: `k6`
     - **User**: `k6`
     - **Password**: `k6`
   - Haz clic en "Save & Test".

5. **Crear Dashboards y Paneles**:
   - Crear un nuevo dashboard.
   - Añadir paneles con consultas para las métricas deseadas, por ejemplo:
     ```sql
     SELECT mean("value") FROM "http_req_duration" WHERE $timeFilter GROUP BY time($__interval) fill(null)
     ```
   - Repitir para otras métricas como `http_req_failed`, `http_reqs`, etc.

## Exportar Gráficos desde Grafana

1. **Crear un Snapshot Público**:
   - Icono de compartir > "Snapshot" > "Create Snapshot" > Compartir el enlace generado.


***DESARROLLADO PARA SOKFA***
