# 🛡️ Protocolo de Seguridad y Reglas de Negocio
## 📂 Gestión de Presentaciones de Junta de Comité

Este documento define el flujo lógico, los bloqueos automáticos y la matriz de responsabilidades del módulo. Diseñado bajo una filosofía de **integridad de datos**, donde cada estado condiciona las acciones permitidas.

---

### 🧱 1. El Concepto del "Candado Maestro" (Archivo Final)
La regla de oro del sistema es la existencia de la **VERSIÓN FINAL** (`archivoFinal`):

*   **SIN Versión Final:** El documento está en construcción. Los responsables pueden subir, bajar y editar sus secciones.
*   **CON Versión Final:** El proceso se considera **SELLADO**. Se bloquean todas las ediciones y cargas individuales para garantizar que lo que ve el Comité sea idéntico a lo que se validó.

---

### 📑 2. Matriz de Dependencias (¿Cuándo puedo Validar?)
Para que los botones de **AUTORIZACIÓN** (`ENVIAR COMITÉ` o `VALIDAR`) aparezcan, se debe cumplir la regla **3 de 3**:

| ¿Portada Cargada? | ¿Contabilidad Cargada? | ¿Operaciones Cargado? | ➡️ | ¿PUEDO AUTORIZAR? |
| :---: | :---: | :---: | :---: | :--- |
| ❌ | ✅ | ✅ | | **NO** (Falta Portada) |
| ✅ | ❌ | ✅ | | **NO** (Falta Contabilidad) |
| ✅ | ✅ | ❌ | | **NO** (Falta Operaciones) |
| ✅ | ✅ | ✅ | | **SÍ** (Habilitado para Supervisión) |

> **Nota:** La validación final es potestad exclusiva de los roles **Supervisión Operativa** y **SuperUsuario**.

---

### 🔐 3. Matriz de Estados vs. Acciones
¿Qué sucede con mis archivos si el estado cambia?

| Estado del Registro | ¿Puede Cargar/Editar Secciones? | ¿Puede Eliminar Secciones? | ¿Puede Borrar Registro? |
| :--- | :---: | :---: | :---: |
| **Borrador** (Sin archivos) | ✅ SÍ | ❌ N/A | ✅ SÍ |
| **En Proceso** (Faltan piezas) | ✅ SÍ | ✅ SÍ | ✅ SÍ |
| **Completo** (Listo p/validar) | ✅ SÍ | ✅ SÍ | ✅ SÍ |
| **AUTORIZADO** (Archivo Final ✅) | ⛔ **BLOQUEADO** | ⛔ **BLOQUEADO** | ⛔ **BLOQUEADO*** |

*   *\*Excepción: Solo el SuperUsuario puede eliminar un Archivo Final para reabrir la edición.*

---

### 👤 4. ¿Quién hace qué? (Responsabilidades por Rol)

#### 👔 Administrador / SuperUsuario
*   **Gestión de Portada:** Carga y eliminación del diseño inicial.
*   **Gestión de Operaciones:** Carga y eliminación del reporte operativo.
*   **Metadatos:** Editar fecha y hora de la junta.

#### 🧮 Contador / SuperUsuario
*   **Gestión Contable:** Único responsable de subir y bajar el reporte financiero.

#### 👁️ Supervisión Operativa / SuperUsuario
*   **El Juez:** Revisa las 3 piezas anteriores y genera el documento certificado final.
*   **El Notificador:** Dispara el envío masivo de correos a los miembros del comité.

---

### 💡 Ejemplo Montessori (Lógica de Pasos)

1.  **PASO 1:** El **Admin** crea el registro (pone fecha).
2.  **PASO 2:** El **Contador** sube su PDF. *¿Puede el Admin borrar el PDF del Contador?* **NO**, no es su rol.
3.  **PASO 3:** Se suben Portada y Operaciones. Aparece el botón de "Validar".
4.  **PASO 4:** **Supervisión** da clic en "Validar".
5.  **RESULTADO:** Se crea el sello verde **VERSION FINAL**. A partir de este momento, si el Contador intenta cambiar su archivo, el sistema ya no le muestra el botón de "Cargar" ni el de "Eliminar". **Todo está protegido.**
