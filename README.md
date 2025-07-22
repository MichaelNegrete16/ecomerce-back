# 🛒 Ecommerce Backend API

## 📋 Descripción

API backend para un sistema de ecommerce desarrollada con NestJS que permite la gestión de productos y procesamiento de pagos seguros. El sistema integra pasarelas de pago para transacciones con tarjetas de crédito y débito, además de un catálogo completo de productos.

## ✨ Características

- 🔐 **Procesamiento seguro de pagos** con integración a pasarelas de pago
- 📦 **Gestión completa de productos** (CRUD de artículos)
- 💳 **Soporte para tarjetas** de crédito y débito
- 🔍 **Consulta de estado de transacciones** en tiempo real
- 📊 **Documentación automática** con Swagger/OpenAPI
- ✅ **Validación robusta** de datos de entrada
- 🏗️ **Arquitectura hexagonal** (Clean Architecture)
- 📝 **Logs detallados** para auditoría y debugging

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de datos**: TypeORM (PostgreSQL recomendado)
- **Documentación**: Swagger/OpenAPI
- **Validación**: class-validator
- **Testing**: Jest
- **Gestión de paquetes**: pnpm

## 🚀 Instalación y configuración

### Prerrequisitos

- Node.js (v18 o superior)
- pnpm (recomendado) o npm
- PostgreSQL (u otra BD compatible con TypeORM)
- Cuenta en proveedor de pagos

### 1. Clonar el repositorio

```bash
git clone https://github.com/MichaelNegrete16/ecomerce-back.git
cd ecomerce-back
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de puerto del proyecto
ECOMER_PORT=4000

# Configuración de Base de Datos
ECOMER_DB_TYPE=postgres
ECOMER_DB_HOST=localhost
ECOMER_DB_PORT=5432
ECOMER_DB_USERNAME=postgres
ECOMER_DB_PASSWORD=tu_password
ECOMER_DB_DATABASE=ecommerce_db

# Configuración de Pagos
ECOMER_API_SAMBOX=url_api_key
ECOMER_PUBLI=pub_test_tu_clave_publica_aqui
ECOMER_PRIVATE=prv_test_tu_clave_privada_aqui
ECOMER_INTEGRIDAD=test_integrity_key_aqui
```

### 4. Configurar base de datos

```bash
# Asegúrate de que PostgreSQL esté ejecutándose
# Crea la base de datos
createdb ecommerce_db
```

### 5. Ejecutar la aplicación

```bash
# Modo desarrollo
pnpm run start:local

# Modo producción
pnpm run start:prod
```

La API estará disponible en el puerto configurado en el .env.local o en su defecto en: `http://localhost:3000`

## 📚 Documentación de la API

### Swagger UI

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva en:

**🌐 http://localhost:3000/docs**

## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e

# Cobertura de tests
pnpm run test:cov
```

## 🗃️ Estructura del proyecto

```
src/
├── app.module.ts              # Módulo principal
├── config.ts                  # Configuración de la app
├── main.ts                    # Punto de entrada
└── checkout/                  # Módulo de checkout
    ├── checkout.module.ts
    ├── article/               # Módulo de artículos
    │   ├── aplication/        # Casos de uso
    │   ├── dominio/          # Entidades y puertos
    │   └── infraestructure/   # Controllers, repos, DTOs
    └── merchants/             # Módulo de pagos
        ├── aplication/        # Casos de uso
        ├── dominio/          # Entidades y puertos
        └── infraestructure/   # Controllers, repos, DTOs
```

## 🔒 Seguridad

- ✅ Validación exhaustiva de datos de entrada
- ✅ Sanitización de información sensible en logs
- ✅ Manejo seguro de tokens de autenticación
- ✅ Encriptación de datos sensibles
- ⚠️ **IMPORTANTE**: Nunca exponer claves privadas en el frontend

## 🚦 Estados de transacciones

- Transacción creada, esperando confirmación
- Transacción aprobada exitosamente
- Transacción rechazada
- Transacción anulada

## 🔄 Monitoreo de transacciones

La aplicación incluye un sistema de polling para verificar cambios de estado:

## 🐛 Solución de problemas

### Error de conexión a base de datos

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Verificar configuración en .env.local
```

### Error en tokens de pago

```bash
# Verificar que las credenciales del proveedor sean correctas
# Confirmar que uses el ambiente correcto (sandbox/production)
```

### Error en validaciones

```bash
# Revisar la documentación Swagger para formatos correctos
# Verificar que todos los campos requeridos estén presentes
```

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 **Email**: michael.negrete16@gmail.com
- 💬 **Issues**: [GitHub Issues](https://github.com/MichaelNegrete16/ecomerce-back/issues)
- 📖 **Documentación**: http://localhost:3000/docs


---

**⚡ ¡Desarrollado con ❤️ por Michael Negrete!**
