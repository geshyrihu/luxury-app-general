# 📦 Inventario: LuxuryApp.Application/Shared

**Fecha:** 2026-09-11  
**Total:** 368 archivos .cs  
**Carpetas:** 11  
**Propósito:** Catálogo centralizado de servicios, DTOs, enums y utilidades compartidas

---

## 📊 Resumen por Categoría

| Carpeta | Archivos | Descripción |
|---------|----------|-------------|
| **Enums/** | 152 | Enumeraciones globales (SelectItems, tipos, estados) |
| **DTOs/** | 98 | Data Transfer Objects compartidos |
| **SendEmailGlobal/** | 58 | Servicios y configuración de email |
| **Services/** | 37 | Interfaces y clases de servicios compartidos |
| **Settings/** | 7 | Configuraciones y settings globales |
| **Constants/** | 4 | Constantes de aplicación |
| **Extensions/** | 5 | Métodos de extensión |
| **Utils/** | 3 | Utilidades y helpers |
| **Events/** | 2 | Domain events globales |
| **Design/** | 1 | Patrones de diseño |
| **Time/** | 1 | Servicios de fecha y hora |
| **TOTAL** | **368** | |

---

## 🔹 1️⃣ Enums/ (152 archivos)

**Propósito:** Enumeraciones globales, SelectItems, tipos de datos compartidos

### Estructura
```
Enums/
├── SelectItem*Enum*.cs         (SelectItems para listas desplegables)
├── *Status*.cs                 (Estados: Active, Inactive, Pending)
├── *Type*.cs                   (Tipos: PaymentType, DocumentType)
├── *Category*.cs               (Categorías)
└── ... (152 total)
```

### Uso Principal
- Listas desplegables en formularios (SelectItems)
- Estados de recursos (Active/Inactive)
- Tipos de transacciones
- Categorización de datos

**Restricción:** NO modificar SelectItems existentes (rompe consumidores). CREAR NUEVO si necesitas distinto.

---

## 🔹 2️⃣ DTOs/ (98 archivos)

**Propósito:** Contratos de datos compartidos entre módulos

### Estructura
```
DTOs/
├── *DTO.cs                     (Response/lectura)
├── Create*DTO.cs               (Entrada para altas)
├── Update*DTO.cs               (Entrada para cambios)
├── *SummaryDTO.cs              (Versión ligera para listas)
├── *FilterDTO.cs               (Criterios de búsqueda)
└── ... (98 total)
```

### Ejemplos
- `BankDTO`, `CreateBankDTO`, `UpdateBankDTO`
- `CandidateDTO`, `CandidateSummaryDTO`
- `PaymentDTO`, `PaymentFilterDTO`

**Regla:** 1 DTO por archivo (ver `conventions/backend/dto-file-organization-rule.md`)

---

## 🔹 3️⃣ SendEmailGlobal/ (58 archivos)

**Propósito:** Servicios y templates para envío de emails

### Estructura
```
SendEmailGlobal/
├── EmailTemplate*Enum.cs       (Tipos de templates)
├── *EmailService*.cs           (Lógica de envío)
├── Templates/                  (Plantillas HTML/texto)
│   ├── *Template.cs            (Email templates)
│   └── ... (múltiples)
└── Configuration/              (Configuración SMTP, etc.)
```

### Servicios Principales
- `ISendEmailService` — Interfaz de envío
- Email templates por tipo (confirmación, notificación, reporte)

---

## 🔹 4️⃣ Services/ (37 archivos)

**Propósito:** Interfaces y clases de servicios compartidos

### Servicios Principales

#### 📧 Email & Notificaciones
```
ISendEmailService               → Envío de emails
ISendOneSignalService           → Push notifications
ISendOneSignalWebService        → OneSignal web
IWhatsAppService                → Mensajes WhatsApp
ISmsService (Notifications/)    → SMS
```

#### 📁 File & Storage
```
IFileStorageService             → Almacenamiento de archivos general
ISecureFileStorageService       → Almacenamiento seguro
IFileReadPathService            → Lectura segura de rutas
IFileWritePathService           → Escritura segura de rutas
IAttachmentsFileService         → Gestión de adjuntos
IImageStorageService            → Almacenamiento de imágenes
IFileValidatorService           → Validación de archivos
```

#### 🗺️ Location & Geo
```
IGeolocationService             → Geolocalización (lat/long)
IHolidayService                 → Cálculo de días feriados
```

#### 💳 Integración Externa
```
ICobranzaOnlineService          → Servicio cobranza online
  ├── ICobranzaOnlineAccountAppService
  ├── ICobranzaOnlineBalanceAppService
  ├── ICobranzaOnlineDashboardAppService
  ├── ICobranzaOnlineMovementAppService
  ├── ICobranzaOnlinePolicyAppService
  ├── ICobranzaOnlinePortfolioAppService
  ├── ICobranzaOnlineReporteFinancieroAppService
  └── ICobranzaOnlineStatementAppService
```

#### 🔍 Análisis & Utilidades
```
IDocumentAnalysisService        → Análisis de documentos
ITextIntelligenceService        → Análisis de texto (IA)
IGeneratePasswordService        → Generación de contraseñas
IMergePdfService                → Fusión de PDFs
IExportToExcelService           → Exportación a Excel
ICurrentUserService             → Usuario actual logueado
IBaseUrlService                 → URL base de la aplicación
```

---

## 🔹 5️⃣ Settings/ (7 archivos)

**Propósito:** Configuraciones y settings globales

### Contenido
```
Settings/
├── JwtSettings.cs              → Configuración JWT
├── EmailSettings.cs            → SMTP, credenciales
├── FileStorageSettings.cs      → Rutas, límites de archivo
├── AppSettings.cs              → Settings generales
└── ... (7 total)
```

**Lectura:** Inyectados via `IConfiguration` o `IOptionsMonitor<T>`

---

## 🔹 6️⃣ Constants/ (4 archivos)

**Propósito:** Constantes globales

### Ejemplos
```
Constants/
├── ApiConstants.cs             → Constantes API (status codes, mensajes)
├── FileConstants.cs            → Límites de archivo, extensiones permitidas
├── EmailConstants.cs           → Asuntos, remitentes
└── AppConstants.cs             → Miscelánea
```

---

## 🔹 7️⃣ Extensions/ (5 archivos)

**Propósito:** Métodos de extensión

### Ejemplos
```
Extensions/
├── StringExtensions.cs         → string.IsNullOrEmpty(), etc.
├── DateTimeExtensions.cs       → datetime.ToMexicoTime(), etc.
├── EnumExtensions.cs           → enum.GetDisplayName(), etc.
├── CollectionExtensions.cs     → IEnumerable helpers
└── ...
```

**Regla:** Centralizar lógica de extensión aquí (no duplicar en módulos).

---

## 🔹 8️⃣ Utils/ (3 archivos)

**Propósito:** Utilidades y helpers

### Contenido
```
Utils/
├── ValidationUtils.cs          → Validaciones comunes
├── FormattingUtils.cs          → Formateo de datos
└── CacheKeyUtils.cs            → Generación de cache keys
```

---

## 🔹 9️⃣ Events/ (2 archivos)

**Propósito:** Domain events globales

### Contenido
```
Events/
├── IDomainEvent.cs             → Interfaz base
├── DomainEventNotification.cs   → Notificación de eventos
└── ... (2 total)
```

**Uso:** Publicar eventos de negocio (Crear, Actualizar, Eliminar)

---

## 🔹 🔟 Time/ (1 archivo)

**Propósito:** Servicios de fecha y hora

### Contenido
```
Time/
└── IBusinessTimeService.cs     → Horas de negocio, zonas horarias
```

**Regla:** NO hardcodear zonas horarias. Usar `IBusinessTimeService` con IANA timezone.

---

## 🔹 1️⃣1️⃣ Design/ (1 archivo)

**Propósito:** Patrones de diseño

### Contenido
```
Design/
└── * (1 archivo, específico a patrón)
```

---

## 🎯 Reglas de Uso — Shared/

### ✅ USAR Shared/ si:
- 2+ módulos lo consumen
- Es una utilidad transversal (email, almacenamiento, geolocalización)
- Es un enum o DTO usado por múltiples módulos
- Es una configuración global

### ❌ NO usar Shared/ si:
- Solo 1 módulo lo consume → Va dentro del módulo (ej. `Candidates/Services/`)
- Es específico de un dominio → Va en su módulo
- Es temporal o experimental → Proponer antes

---

## 📋 Checklist: Auditoría de Shared/

| Ítem | Verificación |
|------|-------------|
| 1. Cada servicio es una interfaz pública | `I*Service` |
| 2. Cada DTO es reutilizable (2+ consumidores) | Verificar imports |
| 3. Cada enum es SelectItem o tipo compartido | Verificar uso |
| 4. Nombres en inglés, sin prefijo module | `BankDTO`, no `AdminBankDTO` |
| 5. DTOs terminan en DTO (mayúsculas) | Verificar sufijo |
| 6. 1 archivo = 1 DTO/Servicio/Enum | Verificar archivos |
| 7. Sin código duplicado en módulos | Verificar imports |

---

## 📌 Referencias

- **DTOs:** `conventions/backend/dto-naming-conventions.md` + `conventions/backend/dto-file-organization-rule.md`
- **Servicios:** `CONVENTIONS_FOLDER_API.MD` §12 (Catálogo de Servicios)
- **Métodos:** `conventions/backend/api-method-naming-conventions.md`
- **Restricciones SelectItem:** `conventions/CONVENTIONS.md` (Rule: NUNCA modificar SelectItem existente)

---

**Última actualización:** 2026-09-11  
**Responsable:** Tech Lead (validar coherencia)  
**Verificación:** Semestral o por cambio en Shared/
