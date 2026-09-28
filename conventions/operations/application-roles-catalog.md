# Catálogo de Roles de Aplicación

**Versión:** 1.0  
**Fecha:** 2026-07-30  
**Fuente oficial:** `api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs`  
**Service:** `api/LuxuryApp.Application/AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Service/ApplicationRoleAppService.cs`

---

## Propósito

Este documento cataloga **todos los roles existentes en LuxuryApp** para que:

- ✅ Cuando se analiza un módulo (FASE 0), el Nivel 3 (Seguridad/RBAC) siempre referencia roles reales
- ✅ No se inventen permisos para roles que no existen
- ✅ La implementación sepa exactamente qué roles usar
- ✅ Auditoría verifique que los roles usados están en este catálogo

---

## Estructura de Roles por Tipo

### 🌟 Roles de Sistema (2)

| Código Enum | Display Name | Descripción | RoleType | Uso |
|:---|:---|:---|:---|:---|
| `SuperUsuario` | SuperUsuario | Acceso total al sistema | System | Admin de infraestructura |
| `Direccion` | Dirección | Dirección general de la empresa | Executive | Ejecutivos corporativos |

**Permisos típicos:**
- Acceso a todos los módulos
- Ver todos los reportes
- Administrar usuarios y roles
- Configurar sistema

---

### 🏢 Roles Corporativos (8)

| Código Enum | Display Name | Descripción | Departamento | RoleType |
|:---|:---|:---|:---|:---|
| `Legal` | Legal | Departamento legal | Legal | Corporate |
| `CoordinacionLegal` | Coordinación Legal | Coordinación del área legal | Legal | Corporate |
| `RecursosHumanos` | Recursos Humanos | RRHH | Reclutamiento | Corporate |
| `Reclutamiento` | Reclutamiento | Procesos de reclutamiento | Reclutamiento | Corporate |
| `GerenteMantenimiento` | Gerente de Mantenimiento | Gerencia de mantenimiento | Mantenimiento | Corporate |
| `SistemasGeneral` | Sistemas General | Administración de sistemas | Sistemas | Corporate |
| `Mensajeria` | Mensajería | Servicios de mensajería | Mensajería | Corporate |
| `SupervisionOperativa` | Supervisión Operativa | Supervisión de operaciones | Supervisión | Corporate |

**Uso en módulos:**
- Recursos Humanos: `RecursosHumanos` (ver nómina, solicitudes)
- Legal: `Legal` (revisar documentos, contratos)
- Sistemas: `SistemasGeneral` (ver logs, configuración)

---

### 👷 Roles Operativos (25+)

#### Administración & Operaciones

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `Administrador` | Administrador | Admin de condominio | Administración |
| `GerenteOperaciones` | Gerente de Operaciones | Gerencia de operaciones | Administración |
| `GerenteAtencion` | Gerente de Atención | Gerencia de atención al cliente | Administración |
| `Asistente` | Asistente | Asistente administrativo u operativo | Administración |
| `Almacenista` | Almacenista | Gestión de almacén | Administración |
| `Paqueteria` | Paquetería | Gestión de paquetería | Administración |

#### Contabilidad & Cobranza

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `Contador` | Contador | Área contable | Contabilidad |
| `Cobranza` | Cobranza | Procesos de cobranza | Contabilidad |

#### Mantenimiento

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `JefeMantenimiento` | Jefe de Mantenimiento | Jefe del equipo de mantenimiento | Mantenimiento |
| `TecnicoMantenimiento` | Técnico de Mantenimiento | Técnico especializado | Mantenimiento |

#### Operaciones & Concierge

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `Recepcionista` | Recepcionista | Recepción o conserjería | Operaciones |
| `MasterConcierge` | Master Concierge | Master Concierge | Operaciones |
| `Concierge` | Concierge | Concierge | Operaciones |
| `EntrenadorGimnasio` | Entrenador de Gimnasio | Entrenador de gimnasio | Operaciones |
| `SnackBar` | Snack Bar | Personal de Snack Bar | Operaciones |
| `Salvavidas` | Salvavidas | Personal de salvavidas | Operaciones |

#### Jardinería

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `JardineriaInterna` | Jardinería Interna | Personal de jardinería interno | Jardinería |

#### Seguridad

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `JefeSeguridadInterna` | Jefe de Seguridad Interna | Jefe de seguridad interno | Seguridad |
| `SeguridadInterna` | Seguridad Interna | Personal de seguridad interno | Seguridad |
| `Monitorista` | Monitorista | Monitorista | Seguridad |

#### Supervisión & Sistemas

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `SupervisorObra` | Supervisor de Obra | Supervisión de obras/proyectos | Supervisión |
| `Sistemas` | Sistemas | Técnico de sistemas | Sistemas |

#### Mensajería & Transporte

| Código Enum | Display Name | Descripción | Departamento |
|:---|:---|:---|:---|
| `Ludotecaria` | Ludotecaria | Encargado de ludoteca | Mensajería |
| `Chofer` | Chofer | Chofer | Mensajería |
| `BellBoy` | BellBoy | BellBoy | Mensajería |

---

### 🏘️ Roles de Clientes (2)

| Código Enum | Display Name | Descripción | RoleType |
|:---|:---|:---|:---|
| `Comite` | Comité | Comité de vigilancia/administración | Client |
| `Condomino` | Condómino | Condómino o residente | Client |

**Uso en módulos:**
- Reserva Amenidades: `Condomino` (crear reservas)
- Portal Cliente: `Condomino` (ver balance, solicitar servicios)
- Cobranza: `Condomino` (ver estado de cuenta)

---

### 🛠️ Roles de Proveedores (4)

| Código Enum | Display Name | Descripción | RoleType |
|:---|:---|:---|:---|
| `Jardineria` | Jardinería | Proveedor de jardinería | Contractor |
| `Limpieza` | Limpieza | Proveedor de limpieza | Contractor |
| `Seguridad` | Seguridad | Proveedor de seguridad | Contractor |
| `Proveedor` | Proveedor | Proveedor general | Contractor |

**Uso en módulos:**
- Órdenes de Compra: `Proveedor` (ver ordenes, entregar)
- Facturas: `Proveedor` (emitir facturas)

---

## Cómo Usar Este Catálogo en FASE 0

### Nivel 3: Seguridad/Autorización (Template)

Cuando definas reglas de seguridad en FASE 0, **siempre usa roles de este catálogo**:

**MAL:**
```
RN-MOD-020: "Solo el Gerente puede ver reportes"
  ↑ ¿Cuál "Gerente"? ¿Existe?
```

**BIEN:**
```
RN-MOD-020: "Solo los siguientes roles pueden VER reportes"
  Roles: GerenteOperaciones, GerenteAtencion, GerenteMantenimiento
  (Verificar en: ApplicationRoleEnum)

RN-MOD-021: "Solo los siguientes roles pueden CREAR reportes"
  Roles: SuperUsuario, Direccion, Contador
  (Verificar en: ApplicationRoleEnum)

RN-MOD-022: "Solo Condomino puede acceder al portal de pagos"
  Roles: Condomino
  (Verificar en: ApplicationRoleEnum)
```

### Ejemplo Completo (Módulo Cobranza)

**FASE 0 - Nivel 3: Seguridad/Autorización**

```
RN-COB-020: "Ver saldos pendientes"
  Roles autorizados: SuperUsuario, Direccion, Contador, Cobranza, Condomino
  Restricción: Condomino solo ve su propio saldo
  
RN-COB-021: "Crear pago"
  Roles autorizados: SuperUsuario, Contador, Cobranza
  Restricción: No se puede crear pago > 10 años atrás
  
RN-COB-022: "Anular pago"
  Roles autorizados: SuperUsuario, Contador (máximo 5 anuaciones/mes)
  Auditoría: Registrar quién anuló, por qué, cuándo
  
RN-COB-023: "Generar reportes"
  Roles autorizados: SuperUsuario, Direccion, Contador, GerenteOperaciones
  Restricción: Datos sensibles (tarjetas) no se exportan a Excel
```

---

## Matriz de Consulta Rápida

### ¿Quién puede VER datos?

```
SuperUsuario   → Todo
Direccion      → Todo
Contador       → Contabilidad, Administración
Cobranza       → Cobranza, Contabilidad
Condomino      → Solo datos propios
Proveedor      → Solo órdenes/facturas propias
```

### ¿Quién puede CREAR registros?

```
SuperUsuario              → Todo
Direccion                 → Configuración crítica
Administrador             → Registros operativos
Contador                  → Pólizas, asientos
Cobranza                  → Pagos, ajustes
RecursosHumanos          → Empleados, nómina
Proveedor                 → Facturas (propias)
Condomino                 → Solicitudes, reservas (propias)
```

### ¿Quién puede ELIMINAR registros?

```
SuperUsuario    → Todo (con confirmación)
Contador        → Pólizas no procesadas (últimas 24h)
Administrador   → Registros de movimientos pequeños (<$100)
Otros roles     → No (implementar "anular" en lugar de eliminar)
```

### ¿Quién puede AUDITAR?

```
SuperUsuario              → Todos los registros
Direccion                 → Configuración + Reportes
GerenteOperaciones        → Operaciones de su zona
Contador                  → Transacciones contables
RecursosHumanos          → Nómina + Asistencias
```

---

## Validación en Implementación

### Checklist para Código

Cuando implementes un módulo que usa roles:

- [ ] Importa `ApplicationRoleEnum` desde `Shared.Enums`
- [ ] No uses strings para roles ("Admin", "User") — siempre `ApplicationRoleEnum.NombreRol`
- [ ] Cada regla de seguridad (RN-MOD-NNN Nivel 3) está verificada en código
- [ ] Logs de auditoría incluyen el rol que hizo la acción
- [ ] Tests incluyen casos para cada rol que accede al módulo

### Checklist para Auditoría

Cuando audites un módulo:

- [ ] Cada rol usado en código existe en `ApplicationRoleEnum`
- [ ] No hay roles "inventados" o strings mágicos
- [ ] La lógica de autorización coincide con las RN de FASE 0
- [ ] Roles de Sistema/Ejecutivo tienen override de auditoría registrado
- [ ] Roles de Clientes/Proveedores tienen restricción "solo datos propios"

---

## Cómo Agregar un Nuevo Rol

Si necesitas un rol que no existe:

1. **NO lo inventes en FASE 0** — propón el rol nuevo
2. **Propuesta:** Describe qué hace, qué departamento, qué permisos base
3. **Aprobación:** Tech Lead valida (¿es necesario o puede usarse rol existente?)
4. **Implementación:** Agregar a `ApplicationRoleEnum.cs`
5. **Sincronización:** Actualizar este catálogo + CONVENTIONS.md
6. **Comunicación:** Informar a todos los agentes del nuevo rol

**Ejemplo de propuesta:**
```
Nuevo Rol: "JefeRecepcion"
Descripción: Jefe de recepcionistas y portería
Departamento: Operaciones
Permisos base: Ver asistencias, autorizar ausencias, crear reportes de ocupación
```

---

## Referencias Técnicas

### En Backend (.NET):

```csharp
// Verificar si usuario tiene rol
if (user.Roles.Contains(ApplicationRoleEnum.Contador.ToString()))
{
    // Mostrar reportes contables
}

// Obtener lista de roles
var allRoles = Enum.GetValues(typeof(ApplicationRoleEnum));

// Usar en atributos
[Authorize(Roles = "SuperUsuario,Direccion")]
public IActionResult AdminPanel() { }
```

### En Frontend (Angular):

```typescript
// Verificar si usuario tiene rol
if (this.currentUser.roles.includes('Contador')) {
    // Mostrar menú de contabilidad
}

// Usar en plantillas
@if (hasRole('Administrador')) {
  <app-admin-panel />
}
```

---

## Control de Cambios

| Versión | Fecha | Cambio | Aprobado |
|:---|:---|:---|:---|
| 1.0 | 2026-07-30 | Creación inicial, catálogo de 43 roles | Tech Lead |

---

## Referencias Documentales

- [ApplicationRoleEnum.cs](../../api/LuxuryApp.Application/Shared/Enums/ApplicationRoleEnum.cs)
- [ApplicationRoleAppService.cs](../../api/LuxuryApp.Application/AdminLuxuryApp/SeguridadPermisos/Access/ApplicationRole/Service/ApplicationRoleAppService.cs)
- [FASE 0: Business Rules Discovery - Nivel 3](./business-rules-discovery-phase-0.md#nivel-3-seguridadautorizaci%C3%B3n)
- [CONVENTIONS.md](../CONVENTIONS.md)

---

*Catálogo: APPLICATION_ROLES_CATALOG.md*  
*Versión: 1.0*  
*Próxima revisión: Cuando se agregue un nuevo rol al sistema*


