📍 **Ruta:** 📂 Documentación > 📱 Componentes Móviles > Data View Mobile
📅 **Última Revisión:** 10-jul-26
🛡️ **Estado:** Vigente
👤 **Responsable:** Equipo de Diseño y Arquitectura Frontend

---

# 📱 Estándar de Uso: `app-data-view-mobile`

Este documento establece las reglas de diseño y maquetación para la correcta implementación de listas móviles utilizando `<app-data-view-mobile>` e `<ili-list-item>`.

## 1. Resumen Ejecutivo 🚀

El componente `app-data-view-mobile` es el contenedor principal para mostrar listados de datos en la versión móvil (Ionic). Trabaja en conjunto con `<ili-list-item>` para renderizar cada fila. El objetivo de este estándar es **garantizar una visualización consistente, alineada y espaciada correctamente**, evitando desbordamientos o menús desalineados.

✅ **Criterios de Éxito al leer esta guía:**

- [x] Conocer cómo estructurar el template de una fila (`listItemTemplate`).
- [x] Saber cómo evitar problemas de márgenes y padding en los listados.
- [x] Entender la alineación correcta del menú de acciones a la derecha.

---

## 2. Reglas de Maquetación y Espaciado 📏

> [!WARNING]
> **Prohibido usar `[noPadding]="true"` por defecto.**

Al usar `<ili-list-item>` dentro de `<app-data-view-mobile>`, el listado ya cuenta con márgenes de seguridad para que el contenido no quede pegado a los bordes de la pantalla.

- **INCORRECTO:** `<ili-list-item [noPadding]="true">` ❌ (Pega los textos y los botones al borde del contenedor blanco).
- **CORRECTO:** `<ili-list-item>` ✅ (Aplica el padding nativo del Design System de `0.75rem 1rem`).

**Solo debes usar `[noPadding]="true"`** si vas a colocar una imagen, tarjeta o elemento visual de borde a borde dentro de esa fila específica.

---

## 3. Alineación del Menú de Acciones (`ili-action-menu`) ⚙️

Para mantener una alineación perfecta del ícono de tres puntos (opciones de fila) a la derecha, el menú debe enviarse **siempre** al slot `end` del componente `<ili-list-item>`.

> [!NOTE]
> El componente `<ili-list-item>` está basado en CSS Grid de 3 columnas (Start, Content, End). Si omites la columna Start, las columnas Content y End respetan su posición y aseguran que los botones queden a la extrema derecha sin importar la longitud del texto principal.

### ✅ Estructura Correcta

```html
<app-data-view-mobile
  [data]="dataSignal()"
  (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
>
  <ng-template #listItemTemplate let-item>
    <!-- 1. Fila estándar sin anular el padding -->
    <ili-list-item>
      <!-- 2. Contenido Principal (slot central automático) -->
      <p class="font-semibold m-0 text-color">{{ item.shortName }}</p>
      <p class="text-xs m-0 text-color-secondary">
        {{ item.code }} - {{ item.largeName }}
      </p>

      <!-- 3. Menú de Acciones (slot 'end' estricto) -->
      <ili-action-menu end>
        <ng-container actions>
          <ili-button-edit (clicked)="editar(item.id)" label="Editar" />
          <ili-button-delete (confirmed)="eliminar(item.id)" label="Eliminar" />
        </ng-container>
      </ili-action-menu>
    </ili-list-item>
  </ng-template>
</app-data-view-mobile>
```

---

## 4. Gestión de Formularios (Crear y Editar con Modales) 📝

Para mantener la consistencia en la experiencia móvil, los formularios de alta y edición se manejan mediante modales a pantalla completa o bottom-sheets, usando el servicio `DialogHandlerService`.

> [!TIP]
> El componente `<app-data-view-mobile>` emite el evento `(add)` de forma nativa desde su barra de herramientas. Los botones dentro de `<ili-action-menu>` emiten sus propios eventos.

### Flujo Recomendado:

1. Crear un método unificado `onModalForm(data: any)` en el controlador del listado.
2. Vincular el evento `(add)` del contenedor principal para "Nuevos registros".
3. Vincular el evento `(clicked)` del botón Editar para registros existentes.
4. Recargar los datos de la lista si el modal retorna un resultado exitoso (`true`).

### ✅ Ejemplo de Implementación (TypeScript)

```typescript
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

export class BankList {
  // 1. Inyectar el servicio de diálogos
  dialogHandlerS = inject(DialogHandlerService);

  // 2. Método centralizado para abrir el modal
  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(BankForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        // 3. Recargar si se guardó correctamente
        if (result) {
          this.onLoadData();
        }
      });
  }
}
```

### ✅ Ejemplo de Implementación (HTML)

```html
<app-data-view-mobile
  [data]="dataSignal()"
  (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
>
  <ng-template #listItemTemplate let-item>
    <ili-list-item>
      <!-- ... contenido ... -->
      <ili-action-menu end>
        <ng-container actions>
          <!-- Llamada al mismo método pasando el ID del item -->
          <ili-button-edit
            (clicked)="onModalForm({ id: item.id, title: 'Editar' })"
            label="Editar"
          />
        </ng-container>
      </ili-action-menu>
    </ili-list-item>
  </ng-template>
</app-data-view-mobile>
```

---

## 5. Matriz de Errores Comunes 🐞

| ¿Qué salió mal? (Síntoma)                                                                                                  | Causa Principal                                                         | ¿Cómo solucionarlo? (Regla)                                                       |
| :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **El texto está totalmente pegado a la orilla izquierda de la tarjeta blanca.**                                            | Se utilizó `[noPadding]="true"` en el `<ili-list-item>`.                | Remover la propiedad `[noPadding]` para restaurar el margen interno.              |
| **El menú de 3 puntos no llega hasta el lado derecho, se queda a la mitad (alineado a la izquierda de la zona sobrante).** | Se colocó fuera del slot `end` o se alteró la estructura del list item. | Asegurarse de utilizar `<ili-action-menu end>` para inyectarlo en la 3ra columna. |

---

_Fin de la guía._ 💎
