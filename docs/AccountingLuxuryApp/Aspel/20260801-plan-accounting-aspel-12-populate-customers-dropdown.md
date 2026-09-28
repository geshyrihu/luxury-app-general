# 🧠 Plan Rápido: Llenar Selector de Clientes con Endpoint Real

> **Instrucciones para el Agente CLI:**
> El modal de sincronización necesita usar el catálogo real de clientes de la aplicación para el dropdown, apuntando al endpoint de SelectItems existente.

### Prompt de Ejecución (Copiar y pegar al Agente CLI)
```text
Actualiza el origen de datos del selector de clientes en el Modal de Sincronización:
1. En `mock-aspel.service.ts` (o donde manejes el Modal de Sincronización), cambia la llamada que obtiene los clientes.
2. En lugar de llamar a un endpoint del Mock, inyecta el servicio HTTP correspondiente (o usa el que ya tengas) para llamar al endpoint real de la aplicación:
   `GET /api/SelectItems/aspel-customer-empresa` (Ajusta la ruta base según esté configurado en `SelectItemEndPoints.cs`).
3. Mapea la respuesta de ese endpoint para llenar el arreglo `syncCustomers` (o la señal que uses para iterar en el `<select>` del HTML).
4. Verifica que el modal ahora sí despliegue la lista real de clientes con empresa configurada en Aspel.
```
