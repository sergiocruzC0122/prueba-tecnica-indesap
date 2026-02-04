# Sistema de Control de Jornada Laboral (Backend API)

Este proyecto es una API Backend realizada en Laravel para gestionar el registro de entrada y salida de empleados en su jornada laboral mediante un código único.

## Requisitos

- PHP 8.2+
- Composer
- MySQL

## Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd control-jornada
    ```

2.  **Instalar dependencias**
    ```bash
    composer install
    ```

3.  **Configurar entorno**
    Copiar el archivo de ejemplo y configurar la base de datos en `.env`:
    ```bash
    cp .env.example .env
    ```
    Asegúrate de configurar las credenciales de base de datos:
    ```ini
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=control_jornada
    DB_USERNAME=root
    DB_PASSWORD=
    ```

4.  **Generar clave de aplicación**
    ```bash
    php artisan key:generate
    ```

5.  **Ejecutar migraciones y seeders**
    Esto creará las tablas y 10 empleados de prueba (Códigos `EMP001` a `EMP010`).
    ```bash
    php artisan migrate --seed
    ```

6.  **Iniciar servidor local**
    ```bash
    php artisan serve
    ```

## Documentación de la API

Todas las respuestas de la API siguen un formato estandarizado:

```json
{
    "status": "success|error",
    "message": "Descripción del resultado",
    "data": { ... }
}
```

### 1. Iniciar Jornada

*   **URL:** `/api/work-shifts/start`
*   **Método:** `POST`
*   **Body:**
    ```json
    {
        "code": "EMP001"
    }
    ```
*   **Respuesta Exitosa (200):**
    ```json
    {
        "status": "success",
        "message": "Work shift started successfully.",
        "data": {
            "id": 1,
            "employee_id": 1,
            "start_time": "2026-02-04T22:00:00.000000Z",
            ...
        }
    }
    ```

### 2. Terminar Jornada

Calcula automáticamente el tiempo total laborado desde el inicio de la jornada activa.

*   **URL:** `/api/work-shifts/end`
*   **Método:** `POST`
*   **Body:**
    ```json
    {
        "code": "EMP001"
    }
    ```
*   **Respuesta Exitosa (200):**
    ```json
    {
        "status": "success",
        "message": "Work shift ended successfully.",
        "data": {
            "end_time": "2026-02-04T18:00:00.000000Z",
            "total_time": "08:00:00",
            ...
        }
    }
    ```

### 3. Ver Historial

Obtiene el historial de jornadas.

*   **URL:** `/api/work-shifts`
*   **Método:** `GET`
*   **Parámetros (Opcional):** `?code=EMP001` (Filtrar por empleado)

## Tests

El proyecto incluye tests automatizados para asegurar el funcionamiento de los endpoints y validaciones.

```bash
php artisan test
```
