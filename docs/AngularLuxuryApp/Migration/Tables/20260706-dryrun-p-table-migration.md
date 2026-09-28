# Dry-run del codemod `<p-table>` estándar

Modo ejecutado: `--dry-run`. El modo predeterminado es `--dry-run`; esta corrida no escribe archivos de `src/app/modules/`.

Archivos transformados: **7**

## src/app/modules/auth.luxuryapp/password-manager/password-list.html

### HTML

```diff
--- a/src/app/modules/auth.luxuryapp/password-manager/password-list.html
+++ b/src/app/modules/auth.luxuryapp/password-manager/password-list.html
@@ -5,87 +5,87 @@
 </div>
 
-<p-table
-  [value]="data()"
-  [lazy]="true"
-  (onLazyLoad)="loadData($event)"
-  [paginator]="true"
-  [rows]="rows"
-  [totalRecords]="totalRecords()"
-  [loading]="loading()"
-  [rowsPerPageOptions]="rowsPerPage"
-  [tableStyle]="{ 'min-width': '50rem' }"
-  #dt
-  [showCurrentPageReport]="true"
-  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
-  [scrollable]="true"
-  [scrollHeight]="scrollHeight()"
-  class="custom-table card d-none d-md-block"
->
-  <ng-template #caption>
-    <primeng-custom-caption (add)="onModalForm()" [dt]="dt" />
-  </ng-template>
-  <ng-template #header>
-    <tr>
-      <th pSortableColumn="Platform.Name">
-        Plataforma
-        <p-sorticon field="Platform.Name" />
-      </th>
-      <th pSortableColumn="Username">
-        Usuario
-        <p-sorticon field="Username" />
-      </th>
-      <th>Contraseña</th>
-      <th pSortableColumn="SubscriptionExpirationDate">
-        Expiración
-        <p-sorticon field="SubscriptionExpirationDate" />
-      </th>
-      <th class="no-print"></th>
-    </tr>
-  </ng-template>
-  <ng-template #body let-item>
-    <tr>
-      <td>{{ item.platformName }}</td>
-      <td>{{ item.username }}</td>
-      <td>
-        <div class="d-flex align-items-center gap-2">
-          <span class="font-family-monospace text-sm">
-            {{ getPasswordDisplay(item.id, item.password) }}
-          </span>
-          <iw-button
-            type="button"
-            [icon]="isPasswordVisible(item.id) ? 'material-symbols-light:visibility-off' : 'material-symbols-light:visibility-outline'"
-            variant="text"
-            [lxTooltip]="isPasswordVisible(item.id) ? 'Ocultar' : 'Mostrar'"
-            tooltipPosition="top"
-            (clicked)="togglePasswordVisibility(item.id)"
-          />
-          <iw-button
-            type="button"
-            icon="material-symbols-light:content-copy"
-            variant="text"
-            lxTooltip="Copiar al portapapeles"
-            tooltipPosition="top"
-            (clicked)="copyPassword(item.password)"
-          />
-        </div>
-      </td>
-      <td>
-        {{ item.subscriptionExpirationDate | apiDate }}
-      </td>
-      <td class="no-print">
-        <div class="d-flex">
-          <iw-button-edit (clicked)="onModalForm(item.id)" />
-          <iw-button-delete (confirmed)="onDelete(item.id)" />
-        </div>
-      </td>
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="5" />
-  </ng-template>
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="data()" />
-  </ng-template>
-</p-table>
+<app-table
+  [value]="data()"
+  [lazy]="true"
+  (onLazyLoad)="loadData($event)"
+  [paginator]="true"
+  [rows]="rows"
+  [totalRecords]="totalRecords()"
+  [loading]="loading()"
+  [rowsPerPageOptions]="rowsPerPage"
+  [tableStyle]="{ 'min-width': '50rem' }"
+  #dt
+  [showCurrentPageReport]="true"
+  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
+  [scrollable]="true"
+  [scrollHeight]="scrollHeight()"
+  class="custom-table card d-none d-md-block"
+>
+  <ng-template #caption>
+    <primeng-custom-caption (add)="onModalForm()" [dt]="dt" />
+  </ng-template>
+  <ng-template #header>
+    <tr>
+      <th appSortableColumn="Platform.Name">
+        Plataforma
+        <app-sorticon field="Platform.Name" />
+      </th>
+      <th appSortableColumn="Username">
+        Usuario
+        <app-sorticon field="Username" />
+      </th>
+      <th>Contraseña</th>
+      <th appSortableColumn="SubscriptionExpirationDate">
+        Expiración
+        <app-sorticon field="SubscriptionExpirationDate" />
+      </th>
+      <th class="no-print"></th>
+    </tr>
+  </ng-template>
+  <ng-template #body let-item>
+    <tr>
+      <td>{{ item.platformName }}</td>
+      <td>{{ item.username }}</td>
+      <td>
+        <div class="d-flex align-items-center gap-2">
+          <span class="font-family-monospace text-sm">
+            {{ getPasswordDisplay(item.id, item.password) }}
+          </span>
+          <iw-button
+            type="button"
+            [icon]="isPasswordVisible(item.id) ? 'material-symbols-light:visibility-off' : 'material-symbols-light:visibility-outline'"
+            variant="text"
+            [lxTooltip]="isPasswordVisible(item.id) ? 'Ocultar' : 'Mostrar'"
+            tooltipPosition="top"
+            (clicked)="togglePasswordVisibility(item.id)"
+          />
+          <iw-button
+            type="button"
+            icon="material-symbols-light:content-copy"
+            variant="text"
+            lxTooltip="Copiar al portapapeles"
+            tooltipPosition="top"
+            (clicked)="copyPassword(item.password)"
+          />
+        </div>
+      </td>
+      <td>
+        {{ item.subscriptionExpirationDate | apiDate }}
+      </td>
+      <td class="no-print">
+        <div class="d-flex">
+          <iw-button-edit (clicked)="onModalForm(item.id)" />
+          <iw-button-delete (confirmed)="onDelete(item.id)" />
+        </div>
+      </td>
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="5" />
+  </ng-template>
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="data()" />
+  </ng-template>
+</app-table>
 
 <app-data-view-mobile [data]="data()" (add)="onModalForm()" [dt]="dt">
```

### TypeScript: src/app/modules/auth.luxuryapp/password-manager/password-list.ts

```diff
--- a/src/app/modules/auth.luxuryapp/password-manager/password-list.ts
+++ b/src/app/modules/auth.luxuryapp/password-manager/password-list.ts
@@ -18,29 +18,29 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import {
-  TableLazyLoadEvent,
-  TableModule,
-} from "@ui/web/primeng-table/primeng-table";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import {
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { PagedResultDto } from "@core/interfaces/paged-result.dto";
-import { DialogHandlerService } from "@core/services/dialog-handler.service";
-import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
-import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-import { CredentialDetailDto } from "./interfaces/credential-detail.dto";
-import { PasswordForm } from "./password-form";
-
-@Component({
-  selector: "app-password-list",
-  templateUrl: "./password-list.html",
-  changeDetection: ChangeDetectionStrategy.OnPush,
-  imports: [
-    PrimeNgCustomTableEmptyMessage,
-    TableModule,
+import { TableLazyLoadEvent } from "@ui/web/primeng-table/primeng-table";
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import {
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { PagedResultDto } from "@core/interfaces/paged-result.dto";
+import { DialogHandlerService } from "@core/services/dialog-handler.service";
+import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
+import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import { CredentialDetailDto } from "./interfaces/credential-detail.dto";
+import { PasswordForm } from "./password-form";
+
+@Component({
+  selector: "app-password-list",
+  templateUrl: "./password-list.html",
+  changeDetection: ChangeDetectionStrategy.OnPush,
+  imports: [
+    PrimeNgCustomTableEmptyMessage,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     PrimeNgCustomCaption,
     PrimeNgCustomTableFooter,
```

## src/app/modules/resident.luxuryapp/owner/owner-list.html

### HTML

```diff
--- a/src/app/modules/resident.luxuryapp/owner/owner-list.html
+++ b/src/app/modules/resident.luxuryapp/owner/owner-list.html
@@ -1,115 +1,115 @@
-<p-table
-  [globalFilterFields]="globalFilterFields()"
-  [showCurrentPageReport]="true"
-  [value]="dataSignal()"
-  #dt
-  class="custom-table card d-none d-md-block"
->
-  <ng-template #caption>
-    <div class="d-flex align-items-center justify-content-between w-full">
-      <primeng-custom-caption
-        (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
-        [dt]="dt"
-        [rolAuth]="
-          aspRoleS.hasAny([
-            AspRole.Asistente,
-            AspRole.Administrador,
-            AspRole.SuperUsuario,
-          ])
-        "
-      />
-      <div class="d-flex">
-        <il-button
-          severity="success"
-          iconClass="material-symbols-light:table-view"
-          (clicked)="onExportExcel()"
-          label="Exportar"
-        />
-      </div>
-    </div>
-    <div class="row g-4">
-      <div class="col-12 col-sm-4"></div>
-    </div>
-  </ng-template>
-  <ng-template #header>
-    <tr>
-      <th class="table-col-10" pSortableColumn="property">
-        Propiedad
-        <p-sorticon field="property" />
-      </th>
-      <th class="table-col-10" pSortableColumn="habitant">
-        Habitante
-        <p-sorticon field="habitant" />
-      </th>
-      <th class="table-col-10" pSortableColumn="fullName">
-        Nombre
-        <p-sorticon field="fullName" />
-      </th>
-
-      <th class="table-col-10" pSortableColumn="fixedPhone">
-        Télefono fijo
-        <p-sorticon field="fixedPhone" />
-      </th>
-      <th class="table-col-10" pSortableColumn="extencion">
-        Extensión
-        <p-sorticon field="extencion" />
-      </th>
-      <th class="table-col-10">Télefono</th>
-      <th class="table-col-10" pSortableColumn="email">
-        Email
-        <p-sorticon field="email" />
-      </th>
-      <th class="table-col-10" pSortableColumn="enviarMails" class="no-print">
-        Enviar Info
-        <p-sorticon field="enviarMails" />
-      </th>
-      @if ( aspRoleS.hasAny([ AspRole.Asistente, AspRole.Administrador,
-      AspRole.SuperUsuario, ]) ) {
-      <th class="no-print"></th>
-      }
-    </tr>
-  </ng-template>
-  <ng-template #body let-item>
-    <tr>
-      <td>{{ item.property }}</td>
-      <td>{{ item.habitant }}</td>
-      <td>{{ item.fullName }}</td>
-      <td>{{ item.fixedPhone }}</td>
-      <td>{{ item.extencion }}</td>
-      <td>{{ item.phoneNumber }}</td>
-      <td>{{ item.email }}</td>
-      <td class="no-print">
-        @if (item.enviarMails) {
-        <app-icon [icon]="'material-symbols-light:check'" class="text-success icon icon-" />
-        } @if (!item.enviarMails) {
-        <app-icon [icon]="'material-symbols-light:close'" class="text-danger icon icon-" />
-        }
-      </td>
-      @if ( aspRoleS.hasAny([ AspRole.Asistente, AspRole.Administrador,
-      AspRole.SuperUsuario, ]) ) {
-      <td class="no-print">
-        <app-action-menu>
-          <ng-container actions>
-            <il-button-edit
-              (clicked)="onModalForm({ id: item.id, title: 'Editar' })"
-              label="Editar"
-            />
-            <il-button-delete
-              (confirmed)="onDelete(item.id)"
-              label="Eliminar"
-            />
-          </ng-container>
-        </app-action-menu>
-      </td>
-      }
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="9" />
-  </ng-template>
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="dataSignal()" />
-  </ng-template>
-</p-table>
+<app-table
+  [globalFilterFields]="globalFilterFields()"
+  [showCurrentPageReport]="true"
+  [value]="dataSignal()"
+  #dt
+  class="custom-table card d-none d-md-block"
+>
+  <ng-template #caption>
+    <div class="d-flex align-items-center justify-content-between w-full">
+      <primeng-custom-caption
+        (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
+        [dt]="dt"
+        [rolAuth]="
+          aspRoleS.hasAny([
+            AspRole.Asistente,
+            AspRole.Administrador,
+            AspRole.SuperUsuario,
+          ])
+        "
+      />
+      <div class="d-flex">
+        <il-button
+          severity="success"
+          iconClass="material-symbols-light:table-view"
+          (clicked)="onExportExcel()"
+          label="Exportar"
+        />
+      </div>
+    </div>
+    <div class="row g-4">
+      <div class="col-12 col-sm-4"></div>
+    </div>
+  </ng-template>
+  <ng-template #header>
+    <tr>
+      <th class="table-col-10" appSortableColumn="property">
+        Propiedad
+        <app-sorticon field="property" />
+      </th>
+      <th class="table-col-10" appSortableColumn="habitant">
+        Habitante
+        <app-sorticon field="habitant" />
+      </th>
+      <th class="table-col-10" appSortableColumn="fullName">
+        Nombre
+        <app-sorticon field="fullName" />
+      </th>
+
+      <th class="table-col-10" appSortableColumn="fixedPhone">
+        Télefono fijo
+        <app-sorticon field="fixedPhone" />
+      </th>
+      <th class="table-col-10" appSortableColumn="extencion">
+        Extensión
+        <app-sorticon field="extencion" />
+      </th>
+      <th class="table-col-10">Télefono</th>
+      <th class="table-col-10" appSortableColumn="email">
+        Email
+        <app-sorticon field="email" />
+      </th>
+      <th class="table-col-10" appSortableColumn="enviarMails" class="no-print">
+        Enviar Info
+        <app-sorticon field="enviarMails" />
+      </th>
+      @if ( aspRoleS.hasAny([ AspRole.Asistente, AspRole.Administrador,
+      AspRole.SuperUsuario, ]) ) {
+      <th class="no-print"></th>
+      }
+    </tr>
+  </ng-template>
+  <ng-template #body let-item>
+    <tr>
+      <td>{{ item.property }}</td>
+      <td>{{ item.habitant }}</td>
+      <td>{{ item.fullName }}</td>
+      <td>{{ item.fixedPhone }}</td>
+      <td>{{ item.extencion }}</td>
+      <td>{{ item.phoneNumber }}</td>
+      <td>{{ item.email }}</td>
+      <td class="no-print">
+        @if (item.enviarMails) {
+        <app-icon [icon]="'material-symbols-light:check'" class="text-success icon icon-" />
+        } @if (!item.enviarMails) {
+        <app-icon [icon]="'material-symbols-light:close'" class="text-danger icon icon-" />
+        }
+      </td>
+      @if ( aspRoleS.hasAny([ AspRole.Asistente, AspRole.Administrador,
+      AspRole.SuperUsuario, ]) ) {
+      <td class="no-print">
+        <app-action-menu>
+          <ng-container actions>
+            <il-button-edit
+              (clicked)="onModalForm({ id: item.id, title: 'Editar' })"
+              label="Editar"
+            />
+            <il-button-delete
+              (confirmed)="onDelete(item.id)"
+              label="Eliminar"
+            />
+          </ng-container>
+        </app-action-menu>
+      </td>
+      }
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="9" />
+  </ng-template>
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="dataSignal()" />
+  </ng-template>
+</app-table>
 <app-data-view-mobile
   [data]="dataSignal()"
```

### TypeScript: src/app/modules/resident.luxuryapp/owner/owner-list.ts

```diff
--- a/src/app/modules/resident.luxuryapp/owner/owner-list.ts
+++ b/src/app/modules/resident.luxuryapp/owner/owner-list.ts
@@ -15,42 +15,46 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { AspRoleService } from "@core/auth/services/asp-role.service";
-import { AuthService } from "@core/auth/services/auth.service";
-import { CustomerIdService } from "@core/auth/services/customer-id.service";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
-import {
-  globalFilterFields,
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { Owner } from "@core/interfaces/list-condomino.interface";
-import {
-  DialogHandlerService,
-  DynamicDialogRef,
-} from "@core/services/dialog-handler.service";
-import { ExcelExportService } from "@accounting.luxuryapp/general-ledger/presupuesto-propuesta/excel-export.service";
-import { OwnerForm } from "./owner-form";
-
-import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
-import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
-import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
-import { MobileListItem } from "@ui/mobile/list-item/list-item";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-
-@Component({
-  selector: "app-owner-list",
-  templateUrl: "./owner-list.html",
-  changeDetection: ChangeDetectionStrategy.Eager,
-  imports: [
-    AppIcon,
-    MobileListItem,
-    MobileActionMenu,
-    MobileButtonLabelEdit,
-    MobileButtonLabelDelete,
-    PrimeNgCustomTableEmptyMessage,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { AspRoleService } from "@core/auth/services/asp-role.service";
+import { AuthService } from "@core/auth/services/auth.service";
+import { CustomerIdService } from "@core/auth/services/customer-id.service";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
+import {
+  globalFilterFields,
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { Owner } from "@core/interfaces/list-condomino.interface";
+import {
+  DialogHandlerService,
+  DynamicDialogRef,
+} from "@core/services/dialog-handler.service";
+import { ExcelExportService } from "@accounting.luxuryapp/general-ledger/presupuesto-propuesta/excel-export.service";
+import { OwnerForm } from "./owner-form";
+
+import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
+import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
+import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
+import { MobileListItem } from "@ui/mobile/list-item/list-item";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+
+@Component({
+  selector: "app-owner-list",
+  templateUrl: "./owner-list.html",
+  changeDetection: ChangeDetectionStrategy.Eager,
+  imports: [
+    AppIcon,
+    MobileListItem,
+    MobileActionMenu,
+    MobileButtonLabelEdit,
+    MobileButtonLabelDelete,
+    PrimeNgCustomTableEmptyMessage,
+    AppTable,
+
+    AppSortableColumn,
+
+    AppSorticon,
     WebButtonLabel,
     PrimeNgCustomCaption,
```

## src/app/modules/resident.luxuryapp/property/property-occupant-manager.html

### HTML

```diff
--- a/src/app/modules/resident.luxuryapp/property/property-occupant-manager.html
+++ b/src/app/modules/resident.luxuryapp/property/property-occupant-manager.html
@@ -74,48 +74,48 @@
     <h5 class="mb-2">Ocupantes registrados</h5>
 
-    <p-table [value]="occupants()" class="custom-table card d-none d-md-block">
-      <ng-template #header>
-        <tr>
-          <th>Nombre</th>
-          <th>Email</th>
-          <th>Teléfono</th>
-          <th>Tipo</th>
-          <th>Activo</th>
-          <th>Acciones</th>
-        </tr>
-      </ng-template>
-
-      <ng-template #body let-occupant>
-        <tr>
-          <td>{{ occupant.fullName }}</td>
-          <td>{{ occupant.email }}</td>
-          <td>{{ occupant.phoneNumber }}</td>
-          <td>
-            @if (occupant.isOwner) {
-              <lx-tag value="Propietario" severity="success" class="me-1" />
-            }
-            @if (occupant.isResident) {
-              <lx-tag value="Residente" severity="info" />
-            }
-            @if (!occupant.isOwner && !occupant.isResident) {
-              <lx-tag value="Otro" severity="secondary" />
-            }
-          </td>
-          <td>
-            @if (occupant.isActive) {
-              <lx-tag value="Sí" severity="success" />
-            } @else {
-              <lx-tag value="No" severity="danger" />
-            }
-          </td>
-          <td>
-            <div class="d-flex gap-1">
-              <iw-button-edit (clicked)="onEditOccupant(occupant)" />
-              <iw-button-delete (confirmed)="onDeleteOccupant(occupant.id)" />
-            </div>
-          </td>
-        </tr>
-      </ng-template>
-    </p-table>
+    <app-table [value]="occupants()" class="custom-table card d-none d-md-block">
+      <ng-template #header>
+        <tr>
+          <th>Nombre</th>
+          <th>Email</th>
+          <th>Teléfono</th>
+          <th>Tipo</th>
+          <th>Activo</th>
+          <th>Acciones</th>
+        </tr>
+      </ng-template>
+
+      <ng-template #body let-occupant>
+        <tr>
+          <td>{{ occupant.fullName }}</td>
+          <td>{{ occupant.email }}</td>
+          <td>{{ occupant.phoneNumber }}</td>
+          <td>
+            @if (occupant.isOwner) {
+              <lx-tag value="Propietario" severity="success" class="me-1" />
+            }
+            @if (occupant.isResident) {
+              <lx-tag value="Residente" severity="info" />
+            }
+            @if (!occupant.isOwner && !occupant.isResident) {
+              <lx-tag value="Otro" severity="secondary" />
+            }
+          </td>
+          <td>
+            @if (occupant.isActive) {
+              <lx-tag value="Sí" severity="success" />
+            } @else {
+              <lx-tag value="No" severity="danger" />
+            }
+          </td>
+          <td>
+            <div class="d-flex gap-1">
+              <iw-button-edit (clicked)="onEditOccupant(occupant)" />
+              <iw-button-delete (confirmed)="onDeleteOccupant(occupant.id)" />
+            </div>
+          </td>
+        </tr>
+      </ng-template>
+    </app-table>
   } @else {
     <lx-message
```

### TypeScript: src/app/modules/resident.luxuryapp/property/property-occupant-manager.ts

```diff
--- a/src/app/modules/resident.luxuryapp/property/property-occupant-manager.ts
+++ b/src/app/modules/resident.luxuryapp/property/property-occupant-manager.ts
@@ -19,18 +19,20 @@
 import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
 import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { PropertyOccupant } from "@core/interfaces/property-occupant.interface";
-import {
-  DynamicDialogConfig,
-  DynamicDialogRef,
-} from "@core/services/dialog-handler.service";
-
-@Component({
-  selector: "app-property-occupant-manager",
-  imports: [
-    ReactiveFormsModule,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { PropertyOccupant } from "@core/interfaces/property-occupant.interface";
+import {
+  DynamicDialogConfig,
+  DynamicDialogRef,
+} from "@core/services/dialog-handler.service";
+
+@Component({
+  selector: "app-property-occupant-manager",
+  imports: [
+    ReactiveFormsModule,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     WebButtonLabel,
     WebButtonIconEdit,
```

## src/app/modules/resident.luxuryapp/property/propiedades-list.html

### HTML

```diff
--- a/src/app/modules/resident.luxuryapp/property/propiedades-list.html
+++ b/src/app/modules/resident.luxuryapp/property/propiedades-list.html
@@ -1,145 +1,145 @@
-<p-table
-  [globalFilterFields]="globalFilterFields()"
-  [paginator]="true"
-  [rows]="tablePrimeNgRows"
-  [rowsPerPageOptions]="rowsPerPageOptions"
-  [showCurrentPageReport]="true"
-  [value]="dataSignal()"
-  #dt
-  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
-  class="custom-table card d-none d-md-block"
->
-  <ng-template #caption>
-    <div class="d-flex justify-content-between align-items-center">
-      <primeng-custom-caption
-        [title]="'Propiedades'"
-        (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
-        [dt]="dt"
-        [rolAuth]="
-          aspRoleS.hasAny([
-            AspRole.Asistente,
-            AspRole.Administrador,
-            AspRole.SuperUsuario,
-          ])
-        "
-      />
-      @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
-      AspRole.SuperUsuario])) {
-      <div>
-        <input
-          type="file"
-          #fileInput
-          class="d-none"
-          (change)="onFileSelected($event)"
-          accept=".xlsx, .xls"
-        />
-        <il-button
-          label="Importar desde Excel"
-          iconClass="material-symbols-light:upload"
-          severity="success"
-          (clicked)="fileInput.click()"
-        />
-        <il-button
-          label="Descargar Plantilla"
-          iconClass="material-symbols-light:download"
-          severity="secondary"
-          (clicked)="downloadTemplate()"
-        />
-      </div>
-      }
-    </div>
-  </ng-template>
-  <ng-template #header>
-    <tr>
-      <th class="w-5rem" pSortableColumn="accountNumber">
-        Cta.
-        <p-sorticon field="accountNumber" />
-      </th>
-      <th class="w-6rem" pSortableColumn="tower">
-        Torre
-        <p-sorticon field="tower" />
-      </th>
-      <th class="w-9rem" pSortableColumn="department">
-        Departamento
-        <p-sorticon field="department" />
-      </th>
-      <th class="w-6rem" pSortableColumn="floor">
-        Piso
-        <p-sorticon field="floor" />
-      </th>
-      <th class="w-7rem" pSortableColumn="unitNumber">
-        No. Int.
-        <p-sorticon field="unitNumber" />
-      </th>
-      <th class="w-7rem" pSortableColumn="areaM2">
-        área m2
-        <p-sorticon field="areaM2" />
-      </th>
-      <th class="w-8rem" pSortableColumn="indivisoPercentage">
-        Indiviso
-        <p-sorticon field="indivisoPercentage" />
-      </th>
-      <th class="w-7rem" pSortableColumn="parkingSlots">
-        Cajones
-        <p-sorticon field="parkingSlots" />
-      </th>
-      <th class="w-7rem" pSortableColumn="storageUnit">
-        Bodega
-        <p-sorticon field="storageUnit" />
-      </th>
-      <th class="w-6rem text-center" pSortableColumn="isDelinquent">
-        Moroso
-        <p-sorticon field="isDelinquent" />
-      </th>
-      @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
-      AspRole.SuperUsuario])) {
-      <th class="w-8rem"></th>
-      }
-    </tr>
-  </ng-template>
-  <ng-template #body let-item>
-    <tr [class.bg-body-tertiary]="item.isDelinquent">
-      <td>{{ formatAccountNumber(item.accountNumber) }}</td>
-      <td>{{ item.tower }}</td>
-      <td>{{ item.department }}</td>
-      <td>{{ item.floor }}</td>
-      <td>{{ item.unitNumber }}</td>
-      <td>{{ item.areaM2 | number:'1.2-2' }}</td>
-      <td>{{ item.indivisoPercentage | percent:'1.2-5' }}</td>
-      <td>{{ item.parkingSlots | number }}</td>
-      <td>{{ item.storageUnit }}</td>
-      <td class="text-center">
-        @if (item.isDelinquent) {
-        <span class="badge bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
-          >Moroso</span
-        >
-        }
-      </td>
-      <td class="no-print">
-        <div class="d-flex gap-1">
-          <iw-button-item
-            iconClass="material-symbols-light:group"
-            lxTooltip="Ocupantes"
-            tooltipPosition="top"
-            (clicked)="showOccupantsDialog(item)"
-          />
-          @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
-          AspRole.SuperUsuario])) {
-          <iw-button-edit
-            (clicked)="onModalForm({ id: item.id, title: 'Editar' })"
-          />
-          <iw-button-delete (confirmed)="onDelete(item.id)" />
-          }
-        </div>
-      </td>
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="11" />
-  </ng-template>
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="dataSignal()" />
-  </ng-template>
-</p-table>
+<app-table
+  [globalFilterFields]="globalFilterFields()"
+  [paginator]="true"
+  [rows]="tablePrimeNgRows"
+  [rowsPerPageOptions]="rowsPerPageOptions"
+  [showCurrentPageReport]="true"
+  [value]="dataSignal()"
+  #dt
+  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
+  class="custom-table card d-none d-md-block"
+>
+  <ng-template #caption>
+    <div class="d-flex justify-content-between align-items-center">
+      <primeng-custom-caption
+        [title]="'Propiedades'"
+        (add)="onModalForm({ id: '', title: 'Nuevo Registro' })"
+        [dt]="dt"
+        [rolAuth]="
+          aspRoleS.hasAny([
+            AspRole.Asistente,
+            AspRole.Administrador,
+            AspRole.SuperUsuario,
+          ])
+        "
+      />
+      @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
+      AspRole.SuperUsuario])) {
+      <div>
+        <input
+          type="file"
+          #fileInput
+          class="d-none"
+          (change)="onFileSelected($event)"
+          accept=".xlsx, .xls"
+        />
+        <il-button
+          label="Importar desde Excel"
+          iconClass="material-symbols-light:upload"
+          severity="success"
+          (clicked)="fileInput.click()"
+        />
+        <il-button
+          label="Descargar Plantilla"
+          iconClass="material-symbols-light:download"
+          severity="secondary"
+          (clicked)="downloadTemplate()"
+        />
+      </div>
+      }
+    </div>
+  </ng-template>
+  <ng-template #header>
+    <tr>
+      <th class="w-5rem" appSortableColumn="accountNumber">
+        Cta.
+        <app-sorticon field="accountNumber" />
+      </th>
+      <th class="w-6rem" appSortableColumn="tower">
+        Torre
+        <app-sorticon field="tower" />
+      </th>
+      <th class="w-9rem" appSortableColumn="department">
+        Departamento
+        <app-sorticon field="department" />
+      </th>
+      <th class="w-6rem" appSortableColumn="floor">
+        Piso
+        <app-sorticon field="floor" />
+      </th>
+      <th class="w-7rem" appSortableColumn="unitNumber">
+        No. Int.
+        <app-sorticon field="unitNumber" />
+      </th>
+      <th class="w-7rem" appSortableColumn="areaM2">
+        área m2
+        <app-sorticon field="areaM2" />
+      </th>
+      <th class="w-8rem" appSortableColumn="indivisoPercentage">
+        Indiviso
+        <app-sorticon field="indivisoPercentage" />
+      </th>
+      <th class="w-7rem" appSortableColumn="parkingSlots">
+        Cajones
+        <app-sorticon field="parkingSlots" />
+      </th>
+      <th class="w-7rem" appSortableColumn="storageUnit">
+        Bodega
+        <app-sorticon field="storageUnit" />
+      </th>
+      <th class="w-6rem text-center" appSortableColumn="isDelinquent">
+        Moroso
+        <app-sorticon field="isDelinquent" />
+      </th>
+      @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
+      AspRole.SuperUsuario])) {
+      <th class="w-8rem"></th>
+      }
+    </tr>
+  </ng-template>
+  <ng-template #body let-item>
+    <tr [class.bg-body-tertiary]="item.isDelinquent">
+      <td>{{ formatAccountNumber(item.accountNumber) }}</td>
+      <td>{{ item.tower }}</td>
+      <td>{{ item.department }}</td>
+      <td>{{ item.floor }}</td>
+      <td>{{ item.unitNumber }}</td>
+      <td>{{ item.areaM2 | number:'1.2-2' }}</td>
+      <td>{{ item.indivisoPercentage | percent:'1.2-5' }}</td>
+      <td>{{ item.parkingSlots | number }}</td>
+      <td>{{ item.storageUnit }}</td>
+      <td class="text-center">
+        @if (item.isDelinquent) {
+        <span class="badge bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
+          >Moroso</span
+        >
+        }
+      </td>
+      <td class="no-print">
+        <div class="d-flex gap-1">
+          <iw-button-item
+            iconClass="material-symbols-light:group"
+            lxTooltip="Ocupantes"
+            tooltipPosition="top"
+            (clicked)="showOccupantsDialog(item)"
+          />
+          @if (aspRoleS.hasAny([AspRole.Asistente, AspRole.Administrador,
+          AspRole.SuperUsuario])) {
+          <iw-button-edit
+            (clicked)="onModalForm({ id: item.id, title: 'Editar' })"
+          />
+          <iw-button-delete (confirmed)="onDelete(item.id)" />
+          }
+        </div>
+      </td>
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="11" />
+  </ng-template>
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="dataSignal()" />
+  </ng-template>
+</app-table>
 
 <!-- Vista movil -->
```

### TypeScript: src/app/modules/resident.luxuryapp/property/propiedades-list.ts

```diff
--- a/src/app/modules/resident.luxuryapp/property/propiedades-list.ts
+++ b/src/app/modules/resident.luxuryapp/property/propiedades-list.ts
@@ -21,33 +21,35 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { AspRoleService } from "@core/auth/services/asp-role.service";
-import { AuthService } from "@core/auth/services/auth.service";
-import { CustomerIdService } from "@core/auth/services/customer-id.service";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
-import {
-  globalFilterFields,
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { Property } from "@core/interfaces/property.interface";
-import {
-  DialogHandlerService,
-  DynamicDialogRef,
-} from "@core/services/dialog-handler.service";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-import Swal from "sweetalert2";
-import { OwnerForm } from "../owner/owner-form";
-import { PropiedadesForm } from "./propiedades-form";
-
-@Component({
-  selector: "app-propiedades-list",
-  templateUrl: "./propiedades-list.html",
-  changeDetection: ChangeDetectionStrategy.Eager,
-  imports: [
-    CommonModule,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { AspRoleService } from "@core/auth/services/asp-role.service";
+import { AuthService } from "@core/auth/services/auth.service";
+import { CustomerIdService } from "@core/auth/services/customer-id.service";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
+import {
+  globalFilterFields,
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { Property } from "@core/interfaces/property.interface";
+import {
+  DialogHandlerService,
+  DynamicDialogRef,
+} from "@core/services/dialog-handler.service";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import Swal from "sweetalert2";
+import { OwnerForm } from "../owner/owner-form";
+import { PropiedadesForm } from "./propiedades-form";
+
+@Component({
+  selector: "app-propiedades-list",
+  templateUrl: "./propiedades-list.html",
+  changeDetection: ChangeDetectionStrategy.Eager,
+  imports: [
+    CommonModule,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     LxTooltipDirective,
     DataViewMobile,
```

## src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.html

### HTML

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.html
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.html
@@ -1,118 +1,118 @@
 @if (isSuperUsuario()) {
 
-<p-table
-  #dt
-  [globalFilterFields]="globalFilterFields()"
-  [loading]="loading()"
-  [paginator]="true"
-  [rows]="tablePrimeNgRows"
-  [rowsPerPageOptions]="rowsPerPageOptions"
-  [scrollable]="true"
-  [scrollHeight]="scrollHeight()"
-  [showCurrentPageReport]="true"
-  [value]="dataSignal()"
-  class="custom-table card d-none d-md-block"
->
-  <ng-template #caption>
-    <primeng-custom-caption
-      [showAdd]="true"
-      [dt]="dt"
-      label="Nueva configuracion"
-      (add)="onModalAddForm()"
-    />
-  </ng-template>
-
-  <ng-template #header>
-    <tr>
-      <th pSortableColumn="name">
-        Nombre
-        <p-sorticon field="name" />
-      </th>
-      <th pSortableColumn="destinationType">
-        Destino
-        <p-sorticon field="destinationType" />
-      </th>
-      <th pSortableColumn="cronExpression">
-        Programacion
-        <p-sorticon field="cronExpression" />
-      </th>
-      <th pSortableColumn="retentionDays">
-        Retencion
-        <p-sorticon field="retentionDays" />
-      </th>
-      <th pSortableColumn="lastRunAt">
-        Ultimo respaldo
-        <p-sorticon field="lastRunAt" />
-      </th>
-      <th pSortableColumn="lastRunStatus">
-        Estado
-        <p-sorticon field="lastRunStatus" />
-      </th>
-      <th pSortableColumn="isActive">
-        Activo
-        <p-sorticon field="isActive" />
-      </th>
-      <th class="table-col-5"></th>
-    </tr>
-  </ng-template>
-
-  <ng-template #body let-item>
-    <tr>
-      <td>{{ item.name }}</td>
-      <td>
-        @if (item.destinationType === 'GraphApi') {
-        <span class="badge bg-info">OneDrive</span>
-        } @else {
-        <span class="badge bg-secondary">Local</span>
-        }
-      </td>
-      <td><code>{{ item.cronExpression }}</code></td>
-      <td>{{ item.retentionDays }} dias</td>
-      <td>{{ item.lastRunAt | apiDate: "dd-MMM-yy HH:mm" }}</td>
-      <td>
-        @if (item.lastRunStatus) {
-        <span class="badge {{ statusBadge(item.lastRunStatus) }}"
-          >{{ item.lastRunStatus }}</span
-        >
-        } @else {
-        <span class="text-body-secondary">Nunca</span>
-        }
-      </td>
-      <td>
-        @if (item.isActive) {
-        <span class="badge bg-success">Si</span>
-        } @else {
-        <span class="badge bg-danger">No</span>
-        }
-      </td>
-      <td class="no-print">
-        <div class="d-flex gap-1">
-          <iw-button-edit (clicked)="onModalEditForm(item)" />
-          @if (item.destinationType === 'GraphApi') {
-          <iw-button
-            iconClass="material-symbols-light:cloud-done"
-            severity="info"
-            (clicked)="onTestConnection(item.id)"
-          />
-          }
-          <il-button
-            label="Ejecutar"
-            iconClass="material-symbols-light:play-arrow"
-            severity="success"
-            (clicked)="onExecuteBackup(item.id)"
-          />
-          <iw-button-delete (confirmed)="onDeleteConfig(item.id)" />
-        </div>
-      </td>
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="8" />
-  </ng-template>
-
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="dataSignal()" />
-  </ng-template>
-</p-table>
+<app-table
+  #dt
+  [globalFilterFields]="globalFilterFields()"
+  [loading]="loading()"
+  [paginator]="true"
+  [rows]="tablePrimeNgRows"
+  [rowsPerPageOptions]="rowsPerPageOptions"
+  [scrollable]="true"
+  [scrollHeight]="scrollHeight()"
+  [showCurrentPageReport]="true"
+  [value]="dataSignal()"
+  class="custom-table card d-none d-md-block"
+>
+  <ng-template #caption>
+    <primeng-custom-caption
+      [showAdd]="true"
+      [dt]="dt"
+      label="Nueva configuracion"
+      (add)="onModalAddForm()"
+    />
+  </ng-template>
+
+  <ng-template #header>
+    <tr>
+      <th appSortableColumn="name">
+        Nombre
+        <app-sorticon field="name" />
+      </th>
+      <th appSortableColumn="destinationType">
+        Destino
+        <app-sorticon field="destinationType" />
+      </th>
+      <th appSortableColumn="cronExpression">
+        Programacion
+        <app-sorticon field="cronExpression" />
+      </th>
+      <th appSortableColumn="retentionDays">
+        Retencion
+        <app-sorticon field="retentionDays" />
+      </th>
+      <th appSortableColumn="lastRunAt">
+        Ultimo respaldo
+        <app-sorticon field="lastRunAt" />
+      </th>
+      <th appSortableColumn="lastRunStatus">
+        Estado
+        <app-sorticon field="lastRunStatus" />
+      </th>
+      <th appSortableColumn="isActive">
+        Activo
+        <app-sorticon field="isActive" />
+      </th>
+      <th class="table-col-5"></th>
+    </tr>
+  </ng-template>
+
+  <ng-template #body let-item>
+    <tr>
+      <td>{{ item.name }}</td>
+      <td>
+        @if (item.destinationType === 'GraphApi') {
+        <span class="badge bg-info">OneDrive</span>
+        } @else {
+        <span class="badge bg-secondary">Local</span>
+        }
+      </td>
+      <td><code>{{ item.cronExpression }}</code></td>
+      <td>{{ item.retentionDays }} dias</td>
+      <td>{{ item.lastRunAt | apiDate: "dd-MMM-yy HH:mm" }}</td>
+      <td>
+        @if (item.lastRunStatus) {
+        <span class="badge {{ statusBadge(item.lastRunStatus) }}"
+          >{{ item.lastRunStatus }}</span
+        >
+        } @else {
+        <span class="text-body-secondary">Nunca</span>
+        }
+      </td>
+      <td>
+        @if (item.isActive) {
+        <span class="badge bg-success">Si</span>
+        } @else {
+        <span class="badge bg-danger">No</span>
+        }
+      </td>
+      <td class="no-print">
+        <div class="d-flex gap-1">
+          <iw-button-edit (clicked)="onModalEditForm(item)" />
+          @if (item.destinationType === 'GraphApi') {
+          <iw-button
+            iconClass="material-symbols-light:cloud-done"
+            severity="info"
+            (clicked)="onTestConnection(item.id)"
+          />
+          }
+          <il-button
+            label="Ejecutar"
+            iconClass="material-symbols-light:play-arrow"
+            severity="success"
+            (clicked)="onExecuteBackup(item.id)"
+          />
+          <iw-button-delete (confirmed)="onDeleteConfig(item.id)" />
+        </div>
+      </td>
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="8" />
+  </ng-template>
+
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="dataSignal()" />
+  </ng-template>
+</app-table>
 
 <app-data-view-mobile
```

### TypeScript: src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.ts

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.ts
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/database-backup/database-backup-list.ts
@@ -18,33 +18,35 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { AspRoleService } from "@core/auth/services/asp-role.service";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
-import {
-  globalFilterFields,
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { DialogHandlerService } from "@core/services/dialog-handler.service";
-import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
-import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-import { DatabaseBackupForm } from "./database-backup-form";
-import { DatabaseBackupConfig } from "./interfaces/database-backup.interface";
-
-@Component({
-  selector: "app-database-backup-list",
-  templateUrl: "./database-backup-list.html",
-  changeDetection: ChangeDetectionStrategy.OnPush,
-  imports: [
-    WebButtonLabel,
-    WebButtonIcon,
-    AppIcon,
-    MobileListItem,
-    PrimeNgCustomTableEmptyMessage,
-    ApiDatePipe,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { AspRoleService } from "@core/auth/services/asp-role.service";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
+import {
+  globalFilterFields,
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { DialogHandlerService } from "@core/services/dialog-handler.service";
+import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
+import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import { DatabaseBackupForm } from "./database-backup-form";
+import { DatabaseBackupConfig } from "./interfaces/database-backup.interface";
+
+@Component({
+  selector: "app-database-backup-list",
+  templateUrl: "./database-backup-list.html",
+  changeDetection: ChangeDetectionStrategy.OnPush,
+  imports: [
+    WebButtonLabel,
+    WebButtonIcon,
+    AppIcon,
+    MobileListItem,
+    PrimeNgCustomTableEmptyMessage,
+    ApiDatePipe,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     WebButtonIconEdit,
     WebButtonIconDelete,
```

## src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html

### HTML

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.html
@@ -1,79 +1,79 @@
 <!-- 💻 INICIO: Contenido visible solo en pantallas medianas y grandes (md en adelante) -->
 
-<p-table
-  [globalFilterFields]="globalFilterFields()"
-  [paginator]="true"
-  [rows]="tablePrimeNgRows"
-  [rowsPerPageOptions]="rowsPerPageOptions"
-  [showCurrentPageReport]="true"
-  [value]="dataSignal()"
-  #dt
-  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
-  class="card d-none d-md-block custom-table"
-  size="small"
-  [scrollable]="true"
-  scrollHeight="750px"
-  [virtualScrollItemSize]="tablePrimeNgRows"
-  [loading]="loading()"
->
-  <ng-template #caption>
-    <primeng-custom-caption
-      (add)="onModalForm({ id: 0, title: 'Nuevo Conocimiento' })"
-      [dt]="dt"
-    />
-  </ng-template>
-  <ng-template #header>
-    <tr>
-      <th pSortableColumn="topic">Tema <p-sorticon field="topic" /></th>
-      <th pSortableColumn="moduleAppName">
-        Acceso <p-sorticon field="moduleAppName" />
-      </th>
-      <th pSortableColumn="keywords">
-        Palabras Clave <p-sorticon field="keywords" />
-      </th>
-      <th pSortableColumn="route">Ruta <p-sorticon field="route" /></th>
-      <th pSortableColumn="isActive">Activo <p-sorticon field="isActive" /></th>
-      <th class="no-print"></th>
-    </tr>
-  </ng-template>
-  <ng-template #body let-item>
-    <tr>
-      <td>{{ item.topic }}</td>
-      <td>
-        <span
-          class="p-tag"
-          [ngClass]="{'green-100 text-green-700': !item.moduleAppId, 'orange-100 text-orange-700': item.moduleAppId}"
-        >
-          {{ item.moduleAppName || 'General' }}
-        </span>
-      </td>
-      <td><span class="p-tag p-tag-info">{{ item.keywords }}</span></td>
-      <td><code>{{ item.route }}</code></td>
-      <td>
-        <app-icon
-          [icon]="item.isActive ? 'material-symbols-light:cancel' : 'material-symbols-light:cancel'"
-          [class]="item.isActive ? 'text-green-500' : 'text-red-500'"
-        />
-      </td>
-
-      <!-- Opciones -->
-      <td class="no-print">
-        <div class="d-flex">
-          <iw-button-edit
-            (clicked)="onModalForm({ id: item.id, title: 'Editar Conocimiento' })"
-          />
-          <iw-button-delete (confirmed)="onDelete(item.id!)" />
-        </div>
-      </td>
-      <!-- Opciones -->
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="6" />
-  </ng-template>
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="dataSignal()" />
-  </ng-template>
-</p-table>
+<app-table
+  [globalFilterFields]="globalFilterFields()"
+  [paginator]="true"
+  [rows]="tablePrimeNgRows"
+  [rowsPerPageOptions]="rowsPerPageOptions"
+  [showCurrentPageReport]="true"
+  [value]="dataSignal()"
+  #dt
+  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
+  class="card d-none d-md-block custom-table"
+  size="small"
+  [scrollable]="true"
+  scrollHeight="750px"
+  [virtualScrollItemSize]="tablePrimeNgRows"
+  [loading]="loading()"
+>
+  <ng-template #caption>
+    <primeng-custom-caption
+      (add)="onModalForm({ id: 0, title: 'Nuevo Conocimiento' })"
+      [dt]="dt"
+    />
+  </ng-template>
+  <ng-template #header>
+    <tr>
+      <th appSortableColumn="topic">Tema <app-sorticon field="topic" /></th>
+      <th appSortableColumn="moduleAppName">
+        Acceso <app-sorticon field="moduleAppName" />
+      </th>
+      <th appSortableColumn="keywords">
+        Palabras Clave <app-sorticon field="keywords" />
+      </th>
+      <th appSortableColumn="route">Ruta <app-sorticon field="route" /></th>
+      <th appSortableColumn="isActive">Activo <app-sorticon field="isActive" /></th>
+      <th class="no-print"></th>
+    </tr>
+  </ng-template>
+  <ng-template #body let-item>
+    <tr>
+      <td>{{ item.topic }}</td>
+      <td>
+        <span
+          class="p-tag"
+          [ngClass]="{'green-100 text-green-700': !item.moduleAppId, 'orange-100 text-orange-700': item.moduleAppId}"
+        >
+          {{ item.moduleAppName || 'General' }}
+        </span>
+      </td>
+      <td><span class="p-tag p-tag-info">{{ item.keywords }}</span></td>
+      <td><code>{{ item.route }}</code></td>
+      <td>
+        <app-icon
+          [icon]="item.isActive ? 'material-symbols-light:cancel' : 'material-symbols-light:cancel'"
+          [class]="item.isActive ? 'text-green-500' : 'text-red-500'"
+        />
+      </td>
+
+      <!-- Opciones -->
+      <td class="no-print">
+        <div class="d-flex">
+          <iw-button-edit
+            (clicked)="onModalForm({ id: item.id, title: 'Editar Conocimiento' })"
+          />
+          <iw-button-delete (confirmed)="onDelete(item.id!)" />
+        </div>
+      </td>
+      <!-- Opciones -->
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="6" />
+  </ng-template>
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="dataSignal()" />
+  </ng-template>
+</app-table>
 
 <!--📲INICIO: Componente adaptado para versión mívil -->
```

### TypeScript: src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.ts

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.ts
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/knowledge-base/ai-knowledge-base-list.ts
@@ -19,27 +19,29 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import {
-  globalFilterFields,
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";
-import {
-  DialogHandlerService,
-  DialogService,
-} from "@core/services/dialog-handler.service";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-import { AiKnowledgeBaseForm } from "./ai-knowledge-base-form";
-
-@Component({
-  selector: "app-ai-knowledge-base-list",
-  templateUrl: "./ai-knowledge-base-list.html",
-  imports: [
-    PrimeNgCustomTableEmptyMessage,
-    CommonModule,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import {
+  globalFilterFields,
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { AiKnowledgeBaseDto } from "@core/interfaces/ai-knowledge-base.dto";
+import {
+  DialogHandlerService,
+  DialogService,
+} from "@core/services/dialog-handler.service";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import { AiKnowledgeBaseForm } from "./ai-knowledge-base-form";
+
+@Component({
+  selector: "app-ai-knowledge-base-list",
+  templateUrl: "./ai-knowledge-base-list.html",
+  imports: [
+    PrimeNgCustomTableEmptyMessage,
+    CommonModule,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     PrimeNgCustomCaption,
     PrimeNgCustomTableFooter,
```

## src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.html

### HTML

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.html
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.html
@@ -1,94 +1,94 @@
 @if (isSuperUsuario()) {
 
-<p-table
-  #dt
-  [globalFilterFields]="globalFilterFields()"
-  [loading]="loading()"
-  [paginator]="true"
-  [rows]="tablePrimeNgRows"
-  [rowsPerPageOptions]="rowsPerPageOptions"
-  [scrollable]="true"
-  [scrollHeight]="scrollHeight()"
-  [showCurrentPageReport]="true"
-  [value]="dataSignal()"
-  class="custom-table card d-none d-md-block"
->
-  <ng-template #caption>
-    <primeng-custom-caption
-      [showAdd]="true"
-      [dt]="dt"
-      label="Nuevo secreto"
-      (add)="onModalAddForm()"
-    />
-  </ng-template>
-
-  <ng-template #header>
-    <tr>
-      <th pSortableColumn="secretName">
-        Nombre
-        <p-sorticon field="secretName" />
-      </th>
-      <th pSortableColumn="secretType">
-        Tipo
-        <p-sorticon field="secretType" />
-      </th>
-      <th pSortableColumn="keyVersion">
-        Version
-        <p-sorticon field="keyVersion" />
-      </th>
-      <th pSortableColumn="accessCount">
-        Accesos
-        <p-sorticon field="accessCount" />
-      </th>
-      <th pSortableColumn="lastAccessedAt">
-        Ultimo acceso
-        <p-sorticon field="lastAccessedAt" />
-      </th>
-      <th pSortableColumn="isRevoked">
-        Estado
-        <p-sorticon field="isRevoked" />
-      </th>
-      <th class="table-col-5"></th>
-    </tr>
-  </ng-template>
-
-  <ng-template #body let-item>
-    <tr>
-      <td>{{ item.secretName }}</td>
-      <td>{{ item.secretType }}</td>
-      <td>{{ item.keyVersion }}</td>
-      <td>{{ item.accessCount }}</td>
-      <td>{{ item.lastAccessedAt | apiDate: "short" }}</td>
-      <td>
-        @if (item.isRevoked) {
-        <span class="badge bg-danger">Revocado</span>
-        } @else {
-        <span class="badge bg-success">Activo</span>
-        }
-      </td>
-      <td class="no-print">
-        <div class="d-flex gap-1">
-          @if (!item.isRevoked) {
-          <iw-button-edit (clicked)="onModalEditForm(item)" />
-          <iw-button
-            label="Rotar"
-            iconClass="material-symbols-light:lock-reset"
-            severity="warning"
-            (clicked)="onRotate(item.secretName)"
-          />
-          <iw-button-delete (confirmed)="onRevoke(item.secretName)" />
-          }
-        </div>
-      </td>
-    </tr>
-  </ng-template>
-  <ng-template #emptymessage>
-    <primeng-custom-table-emptymessage [colspan]="7" />
-  </ng-template>
-
-  <ng-template #paginatorleft>
-    <primeng-custom-table-footer [data]="dataSignal()" />
-  </ng-template>
-</p-table>
+<app-table
+  #dt
+  [globalFilterFields]="globalFilterFields()"
+  [loading]="loading()"
+  [paginator]="true"
+  [rows]="tablePrimeNgRows"
+  [rowsPerPageOptions]="rowsPerPageOptions"
+  [scrollable]="true"
+  [scrollHeight]="scrollHeight()"
+  [showCurrentPageReport]="true"
+  [value]="dataSignal()"
+  class="custom-table card d-none d-md-block"
+>
+  <ng-template #caption>
+    <primeng-custom-caption
+      [showAdd]="true"
+      [dt]="dt"
+      label="Nuevo secreto"
+      (add)="onModalAddForm()"
+    />
+  </ng-template>
+
+  <ng-template #header>
+    <tr>
+      <th appSortableColumn="secretName">
+        Nombre
+        <app-sorticon field="secretName" />
+      </th>
+      <th appSortableColumn="secretType">
+        Tipo
+        <app-sorticon field="secretType" />
+      </th>
+      <th appSortableColumn="keyVersion">
+        Version
+        <app-sorticon field="keyVersion" />
+      </th>
+      <th appSortableColumn="accessCount">
+        Accesos
+        <app-sorticon field="accessCount" />
+      </th>
+      <th appSortableColumn="lastAccessedAt">
+        Ultimo acceso
+        <app-sorticon field="lastAccessedAt" />
+      </th>
+      <th appSortableColumn="isRevoked">
+        Estado
+        <app-sorticon field="isRevoked" />
+      </th>
+      <th class="table-col-5"></th>
+    </tr>
+  </ng-template>
+
+  <ng-template #body let-item>
+    <tr>
+      <td>{{ item.secretName }}</td>
+      <td>{{ item.secretType }}</td>
+      <td>{{ item.keyVersion }}</td>
+      <td>{{ item.accessCount }}</td>
+      <td>{{ item.lastAccessedAt | apiDate: "short" }}</td>
+      <td>
+        @if (item.isRevoked) {
+        <span class="badge bg-danger">Revocado</span>
+        } @else {
+        <span class="badge bg-success">Activo</span>
+        }
+      </td>
+      <td class="no-print">
+        <div class="d-flex gap-1">
+          @if (!item.isRevoked) {
+          <iw-button-edit (clicked)="onModalEditForm(item)" />
+          <iw-button
+            label="Rotar"
+            iconClass="material-symbols-light:lock-reset"
+            severity="warning"
+            (clicked)="onRotate(item.secretName)"
+          />
+          <iw-button-delete (confirmed)="onRevoke(item.secretName)" />
+          }
+        </div>
+      </td>
+    </tr>
+  </ng-template>
+  <ng-template #emptymessage>
+    <primeng-custom-table-emptymessage [colspan]="7" />
+  </ng-template>
+
+  <ng-template #paginatorleft>
+    <primeng-custom-table-footer [data]="dataSignal()" />
+  </ng-template>
+</app-table>
 
 <app-data-view-mobile
```

### TypeScript: src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.ts

```diff
--- a/src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.ts
+++ b/src/app/modules/system.luxuryapp/configuracion-sistema/vault-secrets/vault-secrets-list.ts
@@ -18,32 +18,34 @@
 import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
 import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
-import { TableModule } from "@ui/web/primeng-table/primeng-table";
-import { AspRoleService } from "@core/auth/services/asp-role.service";
-import { Endpoints } from "@core/constants/endpoints/endpoints";
-import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
-import {
-  globalFilterFields,
-  rowsPerPageOptions,
-  tablePrimeNgRows,
-} from "@core/helpers/table-primeng-option";
-import { ApiResponseService } from "@core/http/services/api-response.service";
-import { DialogHandlerService } from "@core/services/dialog-handler.service";
-import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
-import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
-import { AppIcon } from "@ui/shared/app-icon/app-icon";
-import { VaultSecretSummary } from "./interfaces/vault-secret.model";
-import { VaultSecretForm } from "./vault-secret-form";
-
-@Component({
-  selector: "app-vault-secrets-list",
-  templateUrl: "./vault-secrets-list.html",
-  changeDetection: ChangeDetectionStrategy.OnPush,
-  imports: [
-    WebButtonLabel,
-    AppIcon,
-    MobileListItem,
-    PrimeNgCustomTableEmptyMessage,
-    ApiDatePipe,
-    TableModule,
+import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
+import { AspRoleService } from "@core/auth/services/asp-role.service";
+import { Endpoints } from "@core/constants/endpoints/endpoints";
+import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
+import {
+  globalFilterFields,
+  rowsPerPageOptions,
+  tablePrimeNgRows,
+} from "@core/helpers/table-primeng-option";
+import { ApiResponseService } from "@core/http/services/api-response.service";
+import { DialogHandlerService } from "@core/services/dialog-handler.service";
+import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
+import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
+import { AppIcon } from "@ui/shared/app-icon/app-icon";
+import { VaultSecretSummary } from "./interfaces/vault-secret.model";
+import { VaultSecretForm } from "./vault-secret-form";
+
+@Component({
+  selector: "app-vault-secrets-list",
+  templateUrl: "./vault-secrets-list.html",
+  changeDetection: ChangeDetectionStrategy.OnPush,
+  imports: [
+    WebButtonLabel,
+    AppIcon,
+    MobileListItem,
+    PrimeNgCustomTableEmptyMessage,
+    ApiDatePipe,
+    AppTable,
+    AppSortableColumn,
+    AppSorticon,
     WebButtonIcon,
     WebButtonIconEdit,
```

## Excluidos (2)

- `src/app/modules/committee.luxuryapp/cobranza/committee-cobranza-web.html`: usa p-sorticon con cierre separado; patrón no soportado.
- `src/app/modules/system.luxuryapp/configuracion-sistema/juntas-mensuales-backfill/juntas-mensuales-backfill.html`: usa pTemplate.

## Patrones no calzados / advertencias (0)

- Ninguno.

## Seguridad

- No se procesan archivos fuera de la lista recibida.
- Los archivos con `pTemplate=` se excluyen antes de cualquier reemplazo.
- Los `p-sorticon` sin `field` y los cierres separados no se adivinan: se reportan y se omite el archivo completo.
