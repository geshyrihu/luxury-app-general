# Radiografía de Endpoints (Punta a Punta)
<style>
table.radiography-table { width: 100%; table-layout: fixed; border-collapse: collapse; }
table.radiography-table th, table.radiography-table td { border: 1px solid #d0d7de; padding: 6px 8px; vertical-align: top; word-wrap: break-word; overflow-wrap: anywhere; }
table.radiography-table th { background: #f6f8fa; text-align: left; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 600; line-height: 1.4; }
.status-dot { width: 8px; height: 8px; border-radius: 999px; display: inline-block; flex: 0 0 auto; }
.status-ok { background: #ecfdf3; color: #027a48; border: 1px solid #abefc6; }
.status-ok .status-dot { background: #12b76a; }
.status-warn { background: #fffaeb; color: #b54708; border: 1px solid #fedf89; }
.status-warn .status-dot { background: #f79009; }
.status-error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; }
.status-error .status-dot { background: #f04438; }
</style>

## Admin Realtime diagnostics (/admin/realtime-diagnostics)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.testConnection</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/realtime-diagnostics/test-connection</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.sendTestMessage</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/sendtestmessage</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.sendToGroup</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/send-to-group/{groupName}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.broadcast</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/broadcast</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.sendMessage</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/sendmessage</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.sendMessageToUser</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/sendmessagetouser</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; RealtimeDiagnostics.sendAnnouncement</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/realtime-diagnostics/sendannouncement</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Admin System maintenance (/admin/system-maintenance)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.capitalizeUserNames</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/capitalize-user-names</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.importAsambleaChecklist</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/import-asamblea-checklist-catalog</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.backfillAgendaEvents</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/backfill-agenda-events-from-meetings</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.backfillHistoricalMeetings</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/backfill-historical-meeting-times</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.resyncGoogleCalendar</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/resync-google-calendar-event-times</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UpdateDataBase.seedNativeCollectionTestData</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/system-maintenance/seed-native-collection-test-data</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Auth Account recovery (/auth/account-recovery)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>auth.endpoints.ts &gt; Auth.recoverAccount.sendMailRecoverPassword</td><td>Ninguno</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/account-recovery/send-mail-recover-password</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.sendNewUserNameForEmail</td><td>shared/user-account-access</td><td>AuthLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/auth/account-recovery/send-new-user-name-for-email/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Auth.recoverAccount.sendNewPasswordForEmail</td><td>shared/user-account-access</td><td>AuthLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/auth/account-recovery/send-new-password-for-email/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Chekador empleados (/chekador-empleados)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.registrar</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/chekador-empleados/registrar</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.misRegistros</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/chekador-empleados/mis-registros</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.resumenHoy</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/chekador-empleados/resumen-hoy</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.porTenantBase</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/chekador-empleados/por-tenant</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.aprobarAnomalia</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/chekador-empleados/{id:guid}/aprobar-anomalia</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.rechazarAnomalia</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/chekador-empleados/{id:guid}/rechazar-anomalia</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.sedes</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/chekador-empleados/sedes</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; ChekadorEmpleados.sedes</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/chekador-empleados/sedes</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Cobranza Collection cases (/cobranza/collection-cases)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.byCustomer</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/collection-cases/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.getById</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/collection-cases/{id:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.create</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/collection-cases</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.update</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/cobranza/collection-cases/{id:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.logActivity</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/collection-cases/{id:guid}/activity</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; CollectionCases.evaluateAndEscalate</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/collection-cases/evaluate-and-escalate/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Cobranza Invoices (/cobranza/invoices)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; Invoices.byCharge</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/invoices/charge/{chargeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Invoices.getById</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/invoices/{id:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Invoices.generate</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/invoices</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Invoices.cancel</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/invoices/{id:guid}/cancel</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Cobranza Notifications (/cobranza/notifications)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; Notifications.process</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/notifications/process</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Notifications.sendStatement</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/notifications/statements/send</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Notifications.sendStatementBatch</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/notifications/statements/send-batch</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Notifications.sendPaymentReceipt</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/notifications/receipts/{paymentId:guid}/send</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Cobranza Property fines (/cobranza/property-fines)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.byCustomer</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/property-fines/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.byProperty</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/property-fines/property/{propertyId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.getById</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/property-fines/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.create</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/property-fines</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.update</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/cobranza/property-fines/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.issueCharge</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/property-fines/issue-charge</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.void</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/property-fines/{id:guid}/void</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.addEvidence</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/property-fines/{fineId:guid}/evidences</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; PropertyFines.removeEvidence</td><td>Ninguno</td><td>CobranzaLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/cobranza/property-fines/evidences/{evidenceId:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Customer images (/customer-images)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; CustomerImages.getByCustomerId</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/customer-images/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; CustomerImages.create</td><td>Ninguno</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/customer-images</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; CustomerImages.createBulk</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/customer-images/bulk</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; CustomerImages.delete</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/customer-images/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Employees (/employees)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.createEmployeeExternal</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employees/{employeeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.createEmployee</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/employees/create-employee</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.createEmployeeExternal</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/employees/create-employee-external</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.birthday</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employees/birthday/{customerId:guid}/{month:int}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.validateOpenRequests</td><td>reclutamiento.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employees/validar-solicitudes-abiertas/{employeeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.employeeTemp</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employees/employee-temp</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; Employees.validateAdminAsis</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employees/validar-admin-asis/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Entrega recepcion descripcion (/entrega-recepcion-descripcion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionDescripcion.getById</td><td>Ninguno</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion-descripcion/{id:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Files (/files)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; File.download</td><td>Ninguno</td><td>SharedLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/files/download</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>shared.endpoints.ts &gt; File.sidebarImages</td><td>Ninguno</td><td>SharedLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/files/sidebar-images</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>shared.endpoints.ts &gt; File.comiteHomeImages</td><td>legal.luxuryapp, operations.luxuryapp</td><td>SharedLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/files/comite-home-images</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Financial report (/financial-report)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.annualShippingReport</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.toCustomer</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/to-customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.uploadFile</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/financial-report/upload-file/{id:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.createPeriod</td><td>Ninguno</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/financial-report/create-period</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.authorize</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/authorize/{id:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.deauthorize</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/desauthorize/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.send</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/financial-report/send/{id:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.monthlyShippingReport</td><td>Ninguno</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/reporteenviomensual/{periodo:datetime}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.annualShippingReport</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/reporte-envio-anual/{year:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; FinancialReports.owners</td><td>Ninguno</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/propietarios/{customerId:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; FinancialReport.listByCustomer</td><td>operations.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/financial-report/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Cross-portal legitimo</span></td></tr>
</tbody></table>

## Funding file (/funding-file)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>contabilidad.endpoints.ts &gt; FundingFiles.downloadZip</td><td>Ninguno</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding-file/download-zip</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Gantt (/gantt)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Gantt.byCustomer</td><td>Ninguno</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/gantt/{customerId:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Hr Incidents (/hr/incidents)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.getAll</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.byEmployee</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/by-employee/{employeeId:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.getAll</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/incidents</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/hr/incidents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.resolve</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/hr/incidents/{id:guid}/resolve</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.cancel</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/hr/incidents/{id:guid}/cancel</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/hr/incidents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.exportPdf</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{id:guid}/export-pdf</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.generateAct</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{id:guid}/generate-act</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.uploadSignedAct</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/incidents/{id:guid}/upload-signed-act</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.signedAct</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{id:guid}/signed-act</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.attachments.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{incidentId:guid}/attachments</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.attachments.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/incidents/{incidentId:guid}/attachments</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.attachments.delete</td><td>Ninguno</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/hr/incidents/attachments/{attachmentId:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.witnesses.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{incidentId:guid}/witnesses</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.witnesses.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/witnesses/{witnessId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.witnesses.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/incidents/{incidentId:guid}/witnesses</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.witnesses.update</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/hr/incidents/witnesses/{witnessId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.witnesses.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/hr/incidents/witnesses/{witnessId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.suspensionDays.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/{incidentId:guid}/suspension-days</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.suspensionDays.getByIncident</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/incidents/{incidentId:guid}/suspension-days</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.suspensionDays.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/hr/incidents/suspension-days/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Incident.getAll</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/incidents/dashboard</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Medidorlectura (/medidorlectura)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.getById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.lastReading</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/ultima-lectura/{medidorId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.listByMeter</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/list/{medidorId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.exportExcel</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/export-excel/{medidorId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.dailyChart</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/data-grafico-diaria/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.monthlyChart</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/data-grafico-mensual/{medidorId:guid}/{fechaInical:datetime}/{fechaFinal:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.create</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/medidorlectura</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.adminCreate</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/medidorlectura/admin-create-lectura</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.verifyDailyRecord</td><td>Ninguno</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidorlectura/verificar-registro-del-dia/{medidorId:guid}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.update</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/medidorlectura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; MeterReadings.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/medidorlectura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Password manager (/password-manager)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>auth.endpoints.ts &gt; PasswordManager.Credentials.getPaged</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/password-manager/credentials/filter</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; PasswordManager.Credentials.getById</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/password-manager/credentials/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; PasswordManager.Credentials.create</td><td>Ninguno</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/password-manager/credentials</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; PasswordManager.Credentials.getById</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/password-manager/credentials/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; PasswordManager.Credentials.delete</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/password-manager/credentials/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Resumen general (/resumen-general)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.evaluationAreas</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/evaluacion-areas/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.resultGeneral</td><td>Ninguno</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/resultado-general/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.minutasGeneralGroup</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/resumen-minutas-general-grupo/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.minutasGeneralList</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/resumen-minutas-general-lista/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.evaluationAreasDetail</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/evaluacion-areas-detalle/{fecha}/{area}/{status?}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.position</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/posicion/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.reporteResumenMinutas</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/reporte-resumen-minutas/{fechaInicial}/{fechaFinal}/{nivelReporte:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.reporteResumenMinutasFiltro</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/reporte-resumen-minutas-filtro/{fechaInicial}/{fechaFinal}/{filtro}/{nivelReporte:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.reporteResumenPreventivos</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/reporte-resumen-preventivos/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.reporteResumenTicket</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/reporte-resumen-ticket/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.reporteResumenTicketByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/reporte-resumen-ticket/{customerId:guid}/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ResumenGeneral.filtroDto</td><td>Ninguno</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/resumen-general/filtro-dto</td><td><span class="status-badge status-warn"><span class="status-dot"></span>Declarada en constantes, sin consumidor detectado</span></td><td><span class="status-badge status-warn"><span class="status-dot"></span>Sin consumidor detectado</span></td></tr>
</tbody></table>

## Access controls (/access-controls)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlOperations.events</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/events</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlOperations.eventsExport</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/events/export</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlOperations.occupancy</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/dashboard/occupancy</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlOperations.stats</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/dashboard/stats</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Access controls Access points (/access-controls/access-points)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlAccessPoints.getAll</td><td>admin.luxuryapp, core/constants, security.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/access-points</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlAccessPoints.getAll</td><td>admin.luxuryapp, core/constants, security.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/access-points</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlAccessPoints.update</td><td>admin.luxuryapp, core/constants</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/access-controls/access-points/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Access controls Credentials (/access-controls/credentials)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlCredentials.generateQr</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/credentials/qr</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>security.endpoints.ts &gt; AccessControlScan.scan</td><td>security.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/credentials/scan</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlCredentials.getById</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/credentials/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlCredentials.revoke</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/access-controls/credentials/{id:guid}/revoke</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Access controls Invitations (/access-controls/invitations)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlInvitations.send</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/invitations</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlInvitations.resend</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/invitations/{id:guid}/resend</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlInvitations.byVisit</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/invitations/by-visit/{visitId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Access controls Visitors (/access-controls/visitors)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlVisitors.getAll</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/visitors</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisitors.getById</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/visitors/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisitors.create</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/visitors</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisitors.update</td><td>admin.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/access-controls/visitors/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Access controls Visits (/access-controls/visits)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AccessControlVisits.create</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/access-controls/visits</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>security.endpoints.ts &gt; AccessControlScan.activeVisits</td><td>security.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/visits/active</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisits.getPaged</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/visits</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisits.getById</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/access-controls/visits/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AccessControlVisits.cancel</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/access-controls/visits/{id:guid}/cancel</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Admin User accounts (/admin/user-accounts)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; UserAccounts.createAccount</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/user-accounts/create-account</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.getById</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.updateAccount</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/admin/user-accounts/update-account/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.deleteAccountAndRelations</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/admin/user-accounts/delete/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.addRoleToUser</td><td>shared/user-account-access</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/admin/user-accounts/add-role-to-user/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.toBlockAccount</td><td>admin.luxuryapp, shared/user-account-access</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/to-block-account/{id}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.toUnlockAccount</td><td>admin.luxuryapp, shared/user-account-access</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/to-unlock-account/{id}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.getRoleUrl</td><td>shared/user-account-access</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/get-role/{applicationUserId}/{roleType?}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.getAll</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/list/{customerId:guid}/{state:bool}/{typePerson?}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; UserAccounts.getAll</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/admin/user-accounts/list/{state:bool}/{typePerson?}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Agenda supervision (/agenda-supervision)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; AgendaSupervision.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/agenda-supervision/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AgendaSupervision.listByDateRange</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/agenda-supervision/list/{start}/{end}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AgendaSupervision.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/agenda-supervision</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AgendaSupervision.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/agenda-supervision/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; AgendaSupervision.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/agenda-supervision/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Ai assistant (/ai-assistant)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; AiAssistant.generateImage</td><td>core/constants, core/services</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/ai-assistant/generate-image</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; AiAssistant.testProfile</td><td>admin.luxuryapp, core/constants</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/ai-assistant/test-profile</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Almacen (/almacen)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Almacen.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/almacen/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.myWarehousesByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/almacen/my-warehouses/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/almacen/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/almacen</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/almacen/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/almacen/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Almacen.assignResponsibles</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/almacen/assign-responsibles</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Announcements (/announcements)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Announcements.generateDraft</td><td>core/services</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/announcements/generate-draft</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.generateOfficialDraft</td><td>core/services</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/announcements/generate-official-draft</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/announcements</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.adminList</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/announcements/admin-list</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/announcements/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.analytics</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/announcements/{id:guid}/analytics</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.downloadPdf</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/announcements/{id:guid}/pdf</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/announcements</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/announcements/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Announcements.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/announcements/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## App implementation tracking (/app-implementation-tracking)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; AppImplementationTracking.triggerEmployeeValidation</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/app-implementation-tracking/trigger-employee-validation</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Asamblea checklist (/asamblea-checklist)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; AsambleaChecklist.bySession</td><td>direccion.luxuryapp</td><td>DireccionLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/asamblea-checklist/session/{sessionId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; AsambleaChecklist.updateStatus</td><td>direccion.luxuryapp</td><td>DireccionLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/asamblea-checklist/{executionId:guid}/status</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Asamblea checklist template (/asamblea-checklist-template)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; AsambleaChecklistTemplate.getAll</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/asamblea-checklist-template</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; AsambleaChecklistTemplate.getById</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/asamblea-checklist-template/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; AsambleaChecklistTemplate.create</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/asamblea-checklist-template</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; AsambleaChecklistTemplate.update</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/asamblea-checklist-template/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; AsambleaChecklistTemplate.delete</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/asamblea-checklist-template/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Auth (/auth)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>auth.endpoints.ts &gt; Auth.login</td><td>core/auth</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/login</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Auth.refresh</td><td>core/auth</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/refresh</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Auth.logout</td><td>core/auth</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/logout</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Auth.recoverPassword</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/recover-password</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Auth.confirmRecoverPassword</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/auth/confirm-recover-password</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Banks (/banks)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; Catalogs.Banks.getById</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/banks/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.Banks.getAll</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/banks</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.Banks.create</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/banks</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.Banks.update</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/banks/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.Banks.delete</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/banks/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Bitacora mantenimiento (/bitacora-mantenimiento)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; BitacoraMantenimiento.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/bitacora-mantenimiento/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.bitacoraMantenimiento</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/bitacora-mantenimiento</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; BitacoraMantenimiento.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/bitacora-mantenimiento/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Budget proposal item support (/budget-proposal-item-support)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>contabilidad.endpoints.ts &gt; byItem</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/budget-proposal-item-support/{itemId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; updateSupportInfo</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/budget-proposal-item-support/{itemId:guid}/support-info</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; uploadFiles</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/budget-proposal-item-support/support-files</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; deleteSupportFile</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/budget-proposal-item-support/support-file/{fileId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Calendario maestro (/calendario-maestro)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.calendarioMaestroById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/calendario-maestro/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.calendariomaestroList</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/calendario-maestro/list</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.calendarioMaestroById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/calendario-maestro</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.calendarioMaestroById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/calendario-maestro/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.calendarioMaestroById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/calendario-maestro/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Calendario maestro equipo (/calendario-maestro-equipo)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; CalendarioMaestroEquipo.getById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/calendario-maestro-equipo/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; CalendarioMaestroEquipo.base</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/calendario-maestro-equipo</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; CalendarioMaestroEquipo.base</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/calendario-maestro-equipo</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; CalendarioMaestroEquipo.getById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/calendario-maestro-equipo/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; CalendarioMaestroEquipo.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/calendario-maestro-equipo/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Catalogo entrega recepcion descripcion (/catalogo-entrega-recepcion-descripcion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/catalogo-entrega-recepcion-descripcion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.base</td><td>mantenimiento.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/catalogo-entrega-recepcion-descripcion</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.grupos</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/catalogo-entrega-recepcion-descripcion/grupos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.base</td><td>mantenimiento.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/catalogo-entrega-recepcion-descripcion</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/catalogo-entrega-recepcion-descripcion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/catalogo-entrega-recepcion-descripcion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Cobranza Reconciliations (/cobranza/reconciliations)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; Reconciliation.unallocated</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/reconciliations/unallocated</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Reconciliation.autoApplyAll</td><td>cobranza.luxuryapp</td><td>CobranzaLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/cobranza/reconciliations/auto-apply-all</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Cobranza Statements (/cobranza/statements)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>cobranza.endpoints.ts &gt; Statements.get</td><td>cobranza.luxuryapp, core/constants</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/statements/{propertyId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>cobranza.endpoints.ts &gt; Statements.pdf</td><td>cobranza.luxuryapp, core/constants</td><td>CobranzaLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/cobranza/statements/{propertyId:guid}/pdf</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Comites vigilancia (/comites-vigilancia)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.getById</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/comites-vigilancia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.list</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/comites-vigilancia/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.create</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/comites-vigilancia</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.update</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/comites-vigilancia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.delete</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/comites-vigilancia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CommitteeVigilance.sendCredentials</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/comites-vigilancia/{id:guid}/send-credentials</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Custom documents (/custom-documents)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; CustomDocuments.getById</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/custom-documents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CustomDocuments.list</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/custom-documents/list/{customerId:guid}/{documentType}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>operations.endpoints.ts &gt; CustomDocuments.create</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/custom-documents</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; CustomDocuments.update</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/custom-documents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; CustomDocuments.delete</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/custom-documents/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CustomDocuments.updateOrder</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/custom-documents/update-order</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; CustomDocuments.consultWithAi</td><td>core/services</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/custom-documents/consult-with-ai</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Customers (/customers)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; Customers.getByIdLegacy</td><td>operations.luxuryapp, shared/ui, supplier.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/customers/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Customers.getAll</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/customers/list/{stateId:bool}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Customers.create</td><td>admin.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/customers</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Customers.getByIdLegacy</td><td>operations.luxuryapp, shared/ui, supplier.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/customers/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Customers.getByIdLegacy</td><td>operations.luxuryapp, shared/ui, supplier.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/customers/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Customers.getByIdLegacy</td><td>operations.luxuryapp, shared/ui, supplier.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/customers/point-maps</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Dashboard (/dashboard)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Dashboard.sendExecutiveReport</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dashboard/send-executive-report/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Dashboard.filtroMinutasArea</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dashboard/filtro-minutas-area/{meetingId:guid}/{areaMinutasDetalles}/{estatus?}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Dashboard.globalPendingItems</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dashboard/global-pending-items/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Dashboard.analyze</td><td>core/services</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dashboard/analyze</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Diagram draw (/diagram-draw)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; DiagramDraw.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/diagram-draw</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; DiagramDraw.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/diagram-draw/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; DiagramDraw.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/diagram-draw</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; DiagramDraw.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/diagram-draw/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; DiagramDraw.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/diagram-draw/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Direccion dashboard (/direccion-dashboard)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.agendaSemanal</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/agenda-semanal</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.agendaMeses</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/agenda-meses</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.contratosPorVencer</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/contratos-por-vencer</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.contratosVigentes</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/contratos-vigentes</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.personalAusente</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/personal-ausente</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.reclutamientoResumen</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/reclutamiento-resumen</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; DireccionDashboard.tareasLegal</td><td>core/layout</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/direccion-dashboard/tareas-legal</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Dynamic reports (/dynamic-reports)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.getByCustomer</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dynamic-reports/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.getTemplates</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dynamic-reports/templates</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.getById</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dynamic-reports/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.create</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dynamic-reports</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.update</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/dynamic-reports/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.delete</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/dynamic-reports/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.execute</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dynamic-reports/execute</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.livePreview</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dynamic-reports/live-preview</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.Accounts.flat</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dynamic-reports/accounts/{customerId:guid}/{year:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.Accounts.tree</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/dynamic-reports/accounts/{customerId:guid}/{year:int}/tree</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.executePdf</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dynamic-reports/execute/pdf</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; DynamicReports.executeExcel</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/dynamic-reports/execute/excel</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Email data (/email-data)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; Catalogs.EmailData.getById</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/email-data/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.EmailData.getAll</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/email-data/list</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>admin.endpoints.ts &gt; Catalogs.EmailData.update</td><td>admin.luxuryapp, core/constants</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/email-data/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Employee external (/employee-external)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-external/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.list</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-external/list/{customerId:guid}/{active:bool}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.searchByEmail</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-external/search-by-email/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.searchByPhone</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-external/search-by-phone/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.create</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/employee-external</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.update</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-external/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/employee-external/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.addAccessCustomer</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/employee-external/add-access-cutomer/{applicationUserId}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeExternal.deleteAccessCustomer</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/employee-external/delete-access-cutomer/{applicationUserId}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Employee internal (/employee-internal)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.list</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/list/{customerId:guid}/{active:bool}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.principalData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/principal-data/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.updatePrincipalData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-internal/update-principal-data/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.photoPath</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/photo-path/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.updateImage</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-internal/update-image/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.personalData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/personal-data/{employeeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.updatePersonalData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-internal/update-personal-data/{employeeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.laboralData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/laboral-data/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.updateLaboralData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-internal/update-laboral-data/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.addressData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/address-data/{employeeId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.updateAddressData</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/employee-internal/update-address-data/{addressId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.dataForRecoveryPassword</td><td>recursos-humanos.luxuryapp, shared/user-account-access</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/data-for-recovery-password/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.cardUser</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/card-user/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.onValidateState</td><td>recursos-humanos.luxuryapp, shared/user-account-access</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/employee-internal/on-validate-state/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; EmployeeInternal.activate</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/employee-internal/{applicationUserId}/activate</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Entrada producto (/entrada-producto)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; ProductEntries.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrada-producto/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductEntries.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrada-producto/get-entrada-productos/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductEntries.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/entrada-producto</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductEntries.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/entrada-producto/{id:guid}/{cantidadActual:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductEntries.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/entrada-producto/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Entrega recepcion (/entrega-recepcion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.equipmentInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-equipos/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.facilitiesInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-instalaciones/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.suppliesInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-insumos/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.toolsInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-herramientas/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.keysInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-llaves/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.maintenanceInventoryByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/inventario-mantenimientos/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.organizationChartByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/organigrama/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.fireExtinguishersByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/extintores/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionReports.pendingMaintenanceByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion/pendientes/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Entrega recepcion cliente (/entrega-recepcion-cliente)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcion.updateClient</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/entrega-recepcion-cliente/{id:guid}/{userId}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionCliente.validateFile</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/entrega-recepcion-cliente/validar-archivo/{userId}/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionCliente.invalidateFile</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/entrega-recepcion-cliente/invalidar-archivo/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionCliente.deleteFile</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/entrega-recepcion-cliente/delete-file/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; EntregaRecepcionCliente.getByCustomerAndDepartment</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/entrega-recepcion-cliente/{customerId:guid}/{departamento}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Funding (/funding)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>contabilidad.endpoints.ts &gt; Funding.getById</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.list</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.details</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/details/{id:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.create</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.getById</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/funding/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.updateOrder</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/funding/update-order</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.delete</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/funding/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.deleteDetail</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/funding/detail/{ordenCompraId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.validate</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/validate/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.authorize</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/authorize/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.confirm</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/confirm/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.unvalidate</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/unvalidate/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.unauthorize</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/unauthorize/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.revokeConfirmation</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/revoke-confirmation/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.revokeComplete</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/revert-complete/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.complete</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/completed/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.purchaseDetails</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/purchase-details/{ordenCompraId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.purchaseHistory</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/funding/purchase-history/{customerId:guid}/{fiscalYear}/{accountNumber}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.updatePurchasePaidStatus</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/funding/update-purchase-paid-status/{ordenCompraId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; PurchaseOrders.validateInvoice</td><td>supplier.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding/validate-invoice/{ordenCompraId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Cross-portal legitimo</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.downloadBulkInvoicesZip</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding/download-bulk-invoices-zip</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.analyzeInvoices</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding/analyze-invoices/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>contabilidad.endpoints.ts &gt; Funding.createOrdersFromInvoices</td><td>contabilidad.luxuryapp</td><td>ContabilidadLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/funding/create-orders-from-invoices</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Google calendar events (/google-calendar-events)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/google-calendar-events/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/google-calendar-events/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/google-calendar-events</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/google-calendar-events/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.updateSeries</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/google-calendar-events/{id:guid}/series</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/google-calendar-events/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; GoogleCalendarEvents.updateSeries</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/google-calendar-events/{id:guid}/series</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Hr Nomina Tiempo extra (/hr/nomina/tiempo-extra)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.create</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/nomina/tiempo-extra</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/hr/nomina/tiempo-extra/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.create</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/nomina/tiempo-extra</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.update</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/hr/nomina/tiempo-extra/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.approve</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/hr/nomina/tiempo-extra/{id:guid}/aprobar</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.update</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/hr/nomina/tiempo-extra/{id:guid}/rechazar</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/hr/nomina/tiempo-extra/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.Nomina.TiempoExtra.create</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/hr/nomina/tiempo-extra/{id:guid}/evidencias</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inspection (/inspection)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; Inspections.listByCustomer</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Inspections.getById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Inspections.create</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inspection</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Inspections.update</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inspection/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Inspections.create</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inspection/add-or-update-condominium-asset</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inspection condominium asset (/inspection-condominium-asset)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.listByInspection</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-condominium-asset/list/{inspectionId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.create</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-condominium-asset/condominium-asset/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.getById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-condominium-asset/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.update</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inspection-condominium-asset/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.deleteReview</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inspection-condominium-asset/delete-review/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionCondominiumAssets.deleteArea</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inspection-condominium-asset/delete-area/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inspection result (/inspection-result)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResults.byUserCustomerAndDate</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-result/get-inspections-by-customer/{applicationUserId}/{customerId:guid}/{date}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResults.getByIdForExecution</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-result/inspection-result-get-by-id/{customerInspectionId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResults.updateInspectionData</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inspection-result/update-inspection-data/{customerInspectionId:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResults.report</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-result/report/{inspectionId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResults.report</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-result/report/{inspectionId:guid}/{date}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inspection result images (/inspection-result-images)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResultImages.byInspectionResultAndCustomer</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResultImages.byInspectionResultAndCustomer</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inspection-result-images/{inspectionResultId:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionResultImages.byInspectionResultAndCustomer</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inspection-result-images/{inspectionImageId:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inspection reviews catalog (/inspection-reviews-catalog)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionReviewCatalog.getAll</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-reviews-catalog</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionReviewCatalog.getById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inspection-reviews-catalog/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionReviewCatalog.create</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inspection-reviews-catalog</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionReviewCatalog.update</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inspection-reviews-catalog/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; InspectionReviewCatalog.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inspection-reviews-catalog/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inventario iluminacion (/inventario-iluminacion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>supplier.endpoints.ts &gt; InventarioIluminacion.getById</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-iluminacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioIluminacion.listByCustomer</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-iluminacion/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioIluminacion.create</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inventario-iluminacion</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioIluminacion.update</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inventario-iluminacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioIluminacion.delete</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inventario-iluminacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inventario llave (/inventario-llave)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; KeyInventory.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-llave/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; KeyInventory.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-llave/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; KeyInventory.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inventario-llave</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; KeyInventory.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inventario-llave/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; KeyInventory.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inventario-llave/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inventario pintura (/inventario-pintura)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>supplier.endpoints.ts &gt; InventarioPintura.getById</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-pintura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioPintura.listByCustomer</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-pintura/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioPintura.create</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inventario-pintura</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioPintura.update</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inventario-pintura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; InventarioPintura.delete</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inventario-pintura/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inventario producto (/inventario-producto)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-producto/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.stockByProductAndWarehouse</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-producto/get-existencia-producto/{customerId:guid}/{productoId:guid}/{almacenId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-producto/get-producto-dropdown-dto/{customerId:guid}/{almacenId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-producto/get-producto-dropdown-paged</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.listByWarehouse</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventario-producto/get-async-all/{customerId:guid}/{almacenId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/inventario-producto</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/inventario-producto/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; InventarioProducto.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/inventario-producto/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Inventory engine system (/inventory-engine-system)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; InventoryEngineSystems.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/inventory-engine-system/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Junta mensual session backfill (/junta-mensual-session-backfill)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>admin.endpoints.ts &gt; JuntaMensualSessionBackfill.preview</td><td>system.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/junta-mensual-session-backfill/preview</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>admin.endpoints.ts &gt; JuntaMensualSessionBackfill.apply</td><td>system.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-session-backfill/apply</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Junta mensual sessions (/junta-mensual-sessions)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/junta-mensual-sessions/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.detail</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/junta-mensual-sessions/{id:guid}/detail</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/junta-mensual-sessions</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.byCustomer</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/junta-mensual-sessions/customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-sessions/from-agenda</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-sessions/{id:guid}/presentation</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.createMeeting</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-sessions/{id:guid}/meeting</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.createMeeting</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-sessions/{id:guid}/meeting/create</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.cancel</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/junta-mensual-sessions/{id:guid}/cancel</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; JuntaMensualSession.reschedule</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/junta-mensual-sessions/{id:guid}/reschedule</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Medidor (/medidor)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.getById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidor/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.listByCustomer</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidor/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.create</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/medidor/get-all-inactive/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.create</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/medidor</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.update</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/medidor/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Meters.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/medidor/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meeting administracion (/meeting-administracion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; MeetingAdministracion.participants</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-administracion/participantes-administracion/{meetingId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingAdministracion.addParticipant</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meeting-administracion/agregar-participantes-administracion/{meetingId:guid}/{applicationUserId}/{personId:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingAdministracion.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meeting-administracion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meeting comite (/meeting-comite)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; MeetingComite.participants</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-comite/participantes-comite/{meetingId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingComite.addParticipant</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meeting-comite/agregar-participantes-comite/{meetingId:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingComite.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meeting-comite/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meeting details seguimientos (/meeting-details-seguimientos)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.delete</td><td>direccion.luxuryapp, legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meeting-details-seguimientos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.delete</td><td>direccion.luxuryapp, legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/meeting-details-seguimientos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.delete</td><td>direccion.luxuryapp, legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meeting-details-seguimientos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.delete</td><td>direccion.luxuryapp, legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/resumen-minuta-presentacion/{customerId:guid}/{minutaId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.resumenPreventivos</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/resumen-preventivos-presentacion/{customerId:guid}/{fecha}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.resumenGrafico</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/resumen-preventivos-grafico-presentacion/{customerId:guid}/{fecha}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.resumenPresentacion</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/resumen-minutas-presentacion/{minutaId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.resumenGraficoPresentacion</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/resumen-minutas-grafico-presentacion/{minutaId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingDetailsTracking.exportSummaryToExcel</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-details-seguimientos/export-summary-to-excel/{minutaId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meeting invitado (/meeting-invitado)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; MeetingInvitado.participants</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meeting-invitado/participantes-invitado/{meetingId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingInvitado.addParticipant</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meeting-invitado/agregar-participantes-invitado/{meetingId:guid}/{invitado}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; MeetingInvitado.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meeting-invitado/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meetings (/meetings)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Meetings.getById</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.reportPdf</td><td>direccion.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/meeting-report-pdf/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.list</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/list/{customerId:guid}/{tipoJunta}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.getDetails</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/get-details/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meetings</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.sendEmailResponsible</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meetings/send-email-responsible/{id:guid}/{customerId:guid}/{eAreaMinutasDetalles}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meetings/enviar-email-pendientes-responsable/{customerId:guid}/{eAreaMinutasDetalles}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meetings/send-email-all-pending-meeting</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/minuta-pendientes/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.allPendingMinutas</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/minuta-all-pendientes/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.seguimientoMinutas</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings/seguimiento-minutas/{customerId:guid}/{status:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.getById</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/meetings/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Meetings.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meetings/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Meetings details (/meetings-details)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.getById</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings-details/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.detailFilter</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings-details/detalles-filtro/{meetingId:guid}/{estatus:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/meetings-details/get-all/{meetingId:guid}/{status:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.base</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/meetings-details</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.getById</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/meetings-details/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; MeetingsDetails.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/meetings-details/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Mi edificio (/mi-edificio)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; MiEdificio.caratulaByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/mi-edificio/caratula/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## My leave requests (/my-leave-requests)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.getAll</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/my-leave-requests</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.create</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/my-leave-requests</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.getDetail</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/my-leave-requests/{id:guid}/detail</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.getById</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/my-leave-requests/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.update</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/my-leave-requests/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>recursos-humanos.endpoints.ts &gt; HR.LeaveRequest.delete</td><td>recursos-humanos.luxuryapp</td><td>RecursosHumanosLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/my-leave-requests/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Notifications (/notifications)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.unreadCount</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications/unread-count</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.markAsRead</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications/mark-as-read/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/notifications/test-one-signal</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/notifications/test-one-signal-web</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/notifications/test-signal-r/{userId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/notifications/test-signal-users</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications/connected-users</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications/connected-users-web</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Notifications.getAll</td><td>core/layout</td><td>SystemLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/notifications/users</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Owners (/owners)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>resident.endpoints.ts &gt; Owner.getById</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/owners/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Owner.listByCustomer</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/owners/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Owner.base</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/owners</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Owner.getById</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/owners/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Owner.delete</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/owners/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Panic alerts (/panic-alerts)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/panic-alerts</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.active</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/panic-alerts/active</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.history</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/panic-alerts/history</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/panic-alerts/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.attend</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/panic-alerts/{id:guid}/attend</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; PanicAlerts.resolve</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/panic-alerts/{id:guid}/resolve</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Piscina (/piscina)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinaListById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/piscina/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinaById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/piscina/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscina</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/piscina</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinaById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/piscina/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; Piscina.delete</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/piscina/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Piscina bitacora (/piscina-bitacora)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinabitacoraListById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/piscina-bitacora/list/{piscinaId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinabitacoraById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/piscina-bitacora/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinabitacoraById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/piscina-bitacora</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinabitacoraById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/piscina-bitacora/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.piscinabitacoraById</td><td>mantenimiento.luxuryapp</td><td>MantenimientoLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/piscina-bitacora/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Presentaciones junta comite (/presentaciones-junta-comite)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.getById</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/presentaciones-junta-comite/get/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.list</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/presentaciones-junta-comite/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.authorize</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/presentaciones-junta-comite/autorizar-presentacion/{id:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.addFile</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/presentaciones-junta-comite/add-file</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.addFecha</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/presentaciones-junta-comite/add-fecha</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.updateFecha</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/presentaciones-junta-comite/add-fecha/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.delete</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/presentaciones-junta-comite/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>direccion.endpoints.ts &gt; PresentacionJuntaComite.deleteFile</td><td>direccion.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/presentaciones-junta-comite/{id:guid}/{area}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; CommitteePresentations.generalByDate</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/presentaciones-junta-comite/generales/{periodo:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Productos (/productos)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; Products.getAll</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/productos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getAllPaged</td><td>operations.luxuryapp, supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/productos/paged</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getById</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/productos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getAll</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/productos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getById</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/productos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.delete</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/productos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getAll</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/productos/get-select-item/{id:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; Products.getAll</td><td>supplier.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/productos/get-auto-complete-select-item</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Properties (/properties)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>resident.endpoints.ts &gt; Properties.delete</td><td>cobranza.luxuryapp, resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/properties/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.listByCustomer</td><td>cobranza.luxuryapp, resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/properties/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.create</td><td>cobranza.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/properties</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.delete</td><td>cobranza.luxuryapp, resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/properties/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.delete</td><td>cobranza.luxuryapp, resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/properties/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.importByCustomer</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/properties/import/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.delete</td><td>cobranza.luxuryapp, resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/properties/{id:guid}/account-number</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; Properties.downloadTemplate</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/properties/download-template/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Property occupant (/property-occupant)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>resident.endpoints.ts &gt; PropertyOccupants.delete</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/property-occupant/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; PropertyOccupants.listByProperty</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/property-occupant/list/{propertyId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; PropertyOccupants.create</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/property-occupant</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; PropertyOccupants.update</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/property-occupant/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>resident.endpoints.ts &gt; PropertyOccupants.delete</td><td>resident.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/property-occupant/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Qualification provider (/qualification-provider)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>supplier.endpoints.ts &gt; QualificationProvider.getByApplicationUserAndProvider</td><td>supplier.luxuryapp</td><td>SupplierLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/qualification-provider/{applicationUserId}/{providerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; QualificationProvider.create</td><td>supplier.luxuryapp</td><td>SupplierLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/qualification-provider</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; QualificationProvider.create</td><td>supplier.luxuryapp</td><td>SupplierLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/qualification-provider</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; QualificationProvider.update</td><td>supplier.luxuryapp</td><td>SupplierLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/qualification-provider/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>supplier.endpoints.ts &gt; QualificationProvider.update</td><td>supplier.luxuryapp</td><td>SupplierLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/qualification-provider/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Radios comunicacion (/radios-comunicacion)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; RadioCommunication.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/radios-comunicacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; RadioCommunication.listByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/radios-comunicacion/list/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; RadioCommunication.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/radios-comunicacion</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; RadioCommunication.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/radios-comunicacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; RadioCommunication.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/radios-comunicacion/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Responsables cliente (/responsables-cliente)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; ResponsablesCliente.jefeMantenimiento</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/responsables-cliente/por-rol</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>mantenimiento.endpoints.ts &gt; ResponsablesCliente.sugeridosAgenda</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/responsables-cliente/sugeridos-agenda</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Salidas productos (/salidas-productos)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/salidas-productos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/salidas-productos/get-paged-list</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/salidas-productos</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.update</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/salidas-productos/{id:guid}/{cantidadActual:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/salidas-productos/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/salidas-productos/devolver</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ProductOutputs.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/salidas-productos/reporte</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Service orders (/service-orders)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.soporte</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/soporte-orden-servicio/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/informe/{customerId:guid}/{idMonth:int}/{idYear:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/on-get-user-select-item/{id}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.listByCustomerAndDate</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/list/{customerId:guid}/{fecha:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.listPintura</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/list-pintura/{customerId:guid}/{fecha:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/pending-preventive/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/service-orders</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.reporte</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/service-orders/reporte-ordenes-servicio/{customerId:guid}/{fecha:datetime}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/service-orders/update-calendar-id</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.photos</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/ordenes-servicio-fotos/{id:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.reporteProveedor</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/service-orders/ordenes-servicio-reporte-proveedor/{id:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/service-orders/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.uploadImg</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/service-orders/subir-img/{serviceOrderId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/service-orders/subir-documento/{serviceOrderId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.deleteDocument</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/service-orders/delete-document/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.deleteImg</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/service-orders/delete-img/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; ServiceOrders.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/service-orders/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Supervision reports (/supervision-reports)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; SupervisionReports.pendingMinutesByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/supervision-reports/pending-minutes/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; SupervisionReports.pendingTicketsByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/supervision-reports/pending-tickets/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; SupervisionReports.pendingLegalByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/supervision-reports/pending-legal/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; SupervisionReports.financialStatementsByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/supervision-reports/estados-financieros/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task follow up (/task-follow-up)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskFollowUps.listByTicketMessage</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-follow-up/list/{TaskGroupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskFollowUps.create</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/task-follow-up</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskFollowUps.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/task-follow-up/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task group categories (/task-group-categories)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskGroupCategories.getById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-group-categories/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupCategories.getAll</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-group-categories</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupCategories.base</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/task-group-categories</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupCategories.getById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/task-group-categories/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupCategories.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/task-group-categories/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task group participant (/task-group-participant)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskGroupParticipants.listByGroup</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-group-participant/{TaskGroupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupParticipants.availableByCustomerAndGroup</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-group-participant/participants/{customerId:guid}/{TaskGroupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupParticipants.base</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/task-group-participant</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupParticipants.listByGroup</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/task-group-participant/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroupParticipants.listByGroup</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/task-group-participant/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task groups (/task-groups)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskGroups.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-groups/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.list</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-groups/list/{customerId:guid}/{state:bool}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.base</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/task-groups</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.getById</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/task-groups/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.toggleStatus</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/task-groups/toggle-status/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.delete</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/task-groups/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task message read (/task-message-read)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskReads.listByTicketMessage</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-message-read/list/{TaskId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task report (/task-report)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskReports.ticketReport</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-report/get-task-report/{customerId:guid}/{startDate}/{endDate}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskReports.weeklyReport</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-report/weekly-report/{customerId:guid}/{startDate}/{endDate}/{status}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskReports.weeklyPreview</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-report/weekly-report-preview/{customerId:guid}/{year:int}/{weekNumber:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskReports.reportClient</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-report/get-report-client/{customerId:guid}/{fechaInicial}/{fechaFinal}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Task work plan (/task-work-plan)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; TaskWorkPlans.pending</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-work-plan/pending/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskWorkPlans.preview</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-work-plan/preview/{customerId:guid}/{year:int}/{weekNumber:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskWorkPlans.create</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/task-work-plan/create/{applicationUserId}/{customerId:guid}/{year:int}/{weekNumber:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Tasks (/tasks)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>operations.endpoints.ts &gt; Tasks.getById</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; TaskGroups.sendReportPendingByGroup</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tasks/send-report-pending/{taskGroupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.view</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/view/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.list</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/list/{taskGroupId:guid}/{status}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.create</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tasks/create</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.update</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/tasks/update/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.updateRelevanceLegacy</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/update-relevance/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.programation</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/programation/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.programation</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tasks/programation/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.getById</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tasks/my-task/programation/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.getByClosed</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/get-by-closed/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.close</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/tasks/closed/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.inProgressLower</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/in-progress/{taskId:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.reopen</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tasks/reopen</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.participants</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/participant/{taskGroupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.updatePriorityLower</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/update-priority/{taskId:guid}/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.myAssignedTickets</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/my-assigned-tasks/{applicationUserId}/{status}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.myRequests</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/my-request/{applicationUserId}/{status}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.legalAll</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/legal/all</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.legalPending</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/legal/pending</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.legalByCustomer</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/legal/customer</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.getStatus</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/{id:guid}/status</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.updateStatus</td><td>legal.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #50e3c2">PATCH</strong> /api/tasks/{id:guid}/status</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.setDependency</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/set-predecessor/{taskId:guid}/{predecessorId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.clearDependency</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/clear-predecessor/{taskId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.availablePredecessors</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/available-predecessors/{groupId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.deleteByCustomer</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/tasks/{id:guid}/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.getById</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/path-report/{customerId:guid}/{year:int}/{numeroSemana:int}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.updateOrder</td><td>operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/tasks/update-order</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tasks.getById</td><td>legal.luxuryapp, operations.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tasks/all-by-customer/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## Telefonosemergencia (/telefonosemergencia)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; EmergencyPhones.getById</td><td>public.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/telefonosemergencia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; EmergencyPhones.getAll</td><td>public.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/telefonosemergencia</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; EmergencyPhones.create</td><td>public.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/telefonosemergencia</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; EmergencyPhones.update</td><td>public.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/telefonosemergencia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; EmergencyPhones.delete</td><td>public.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/telefonosemergencia/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Ticket analysis (/ticket-analysis)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>system.endpoints.ts &gt; TicketAnalysis.analyzeImage</td><td>core/services</td><td>SystemLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/ticket-analysis/analyze-image</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Tools (/tools)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>mantenimiento.endpoints.ts &gt; RefactorMantenimiento.toolsGetById</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tools/get/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tools.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/tools/{customerId:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tools.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #49cc90">POST</strong> /api/tools</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tools.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/tools/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>operations.endpoints.ts &gt; Tools.delete</td><td>mantenimiento.luxuryapp</td><td>OperationsLuxuryApp</td><td><strong style="color: #f93e3e">DELETE</strong> /api/tools/{id:guid}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>

## User validation (/user-validation)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>shared.endpoints.ts &gt; UserValidation.searchExistingPerson</td><td>recursos-humanos.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/user-validation/search-existing-person/{namePerson}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
<tr><td>shared.endpoints.ts &gt; UserValidation.searchExistingPhone</td><td>recursos-humanos.luxuryapp</td><td>AdminLuxuryApp</td><td><strong style="color: #61affe">GET</strong> /api/user-validation/search-existing-phone/{phoneNumber}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida (shared)</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Compartido/transversal</span></td></tr>
</tbody></table>

## Users (/users)
<table class="radiography-table">
<colgroup>
  <col style="width: 22%">
  <col style="width: 18%">
  <col style="width: 14%">
  <col style="width: 28%">
  <col style="width: 9%">
  <col style="width: 9%">
</colgroup>
<thead><tr><th>Front Constant &gt; KeyPath</th><th>Front Consumer(s)</th><th>Api Module (Backend)</th><th>EndPoint</th><th>Match de Ruta</th><th>Match de Dominio</th></tr></thead>
<tbody>
<tr><td>auth.endpoints.ts &gt; Users.changePassword</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/users/change-password/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
<tr><td>auth.endpoints.ts &gt; Users.updateImage</td><td>auth.luxuryapp</td><td>AuthLuxuryApp</td><td><strong style="color: #fca130">PUT</strong> /api/users/update-image/{applicationUserId}</td><td><span class="status-badge status-ok"><span class="status-dot"></span>Ruta consumida</span></td><td><span class="status-badge status-ok"><span class="status-dot"></span>Alineado</span></td></tr>
</tbody></table>
