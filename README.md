# EventManager

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-green?logo=django&logoColor=white)

EventManager es una aplicación web desarrollada con Django para gestionar eventos y personas de forma organizada. El proyecto está pensado como una solución modular y clara, donde el dominio del negocio está al frente del código, en lugar de esconderlo detrás de capas técnicas innecesarias.

## ✨ Qué hace el proyecto

La plataforma permite:

- Crear y administrar eventos.
- Gestionar personas asociadas a los eventos.
- Consultar información relevante de cada entidad.
- Mantener una estructura modular para crecer sin perder claridad.

## 🧠 Enfoque arquitectónico: Screaming Architecture

Este proyecto sigue el enfoque de Screaming Architecture.

Eso significa que, al abrir la estructura del proyecto, el negocio se entiende de inmediato:

- los módulos están orientados a conceptos del dominio como eventos y personas;
- la organización del código refleja la intención del sistema;
- la arquitectura no se centra en frameworks o detalles técnicos, sino en lo que realmente hace la aplicación.

En otras palabras, el sistema “grita” su propósito desde la primera mirada.

## 🛠️ Tecnologías empleadas

- Python
- Django 5.2
- SQLite
- HTML, CSS y JavaScript
- Django Templates
- Django Admin

## � Capturas

A continuación se dejan enlaces predeterminados para las capturas del proyecto. Puedes reemplazarlos luego por imágenes reales.

- [Captura 1](https://via.placeholder.com/800x450?text=Captura+1)
- [Captura 2](https://via.placeholder.com/800x450?text=Captura+2)
- [Captura 3](https://via.placeholder.com/800x450?text=Captura+3)

## �📁 Estructura del proyecto

```text
EventManager/
├── EventManager/          # Configuración principal del proyecto Django
├── event_module/          # Lógica y vistas para la gestión de eventos
├── people_module/         # Lógica y vistas para la gestión de personas
├── myapp/                 # Vistas auxiliares del proyecto
├── Diagramas/             # Diagramas de arquitectura y flujo
├── manage.py              # Punto de entrada de Django
├── requirements.txt       # Dependencias del proyecto
└── db.sqlite3             # Base de datos local SQLite
```

## 🚀 Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Python 3.10 o superior
- pip
- virtualenv o venv

## ▶️ Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd EventManager/initial_final_project
```

### 2. Crear un entorno virtual

En Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Aplicar migraciones

```bash
python manage.py migrate
```

### 5. Ejecutar el servidor

```bash
python manage.py runserver
```

Luego abre en tu navegador:

```text
http://127.0.0.1:8000/
```

## 🗄️ Base de datos

El proyecto usa SQLite por defecto, lo cual facilita el desarrollo local y las pruebas sin necesidad de configurar un servidor externo.

## 🧪 Desarrollo y pruebas

Para trabajar sobre el proyecto, puedes usar:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

## 📌 Notas importantes

- El proyecto está pensado para desarrollo local y aprendizaje.
- La configuración actual está orientada a entorno de desarrollo, no a producción.
- La estructura modular permite escalar el sistema con más módulos y reglas de negocio sin perder organización.

## 👤 Autor

Proyecto desarrollado como parte de un trabajo académico de ingeniería de software.
