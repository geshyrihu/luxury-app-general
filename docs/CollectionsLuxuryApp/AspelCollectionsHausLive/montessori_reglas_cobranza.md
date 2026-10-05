# Reglas de Cobranza Explicadas (Método Montessori)

Imagina que la cuenta del residente es una gran estantería y las deudas son pequeñas cubetas que necesitan ser llenadas con agua (dinero). 
Aquí te explicamos de forma súper sencilla cómo el sistema automático de cobranza decide a qué cubeta echarle el agua.

---

## 1. El Arrastre (Saldo Inicial)
Antes de empezar a contar los gastos del año actual, el sistema mira si el residente dejó deudas sin pagar el año pasado. 
- **Si debe dinero:** Creamos una primera etiqueta de deuda invisible llamada "Arrastre Anterior". Es lo primero que hay que pagar.
- **Si dejó saldo a favor:** Esa agua extra se guarda en una "Bolsa de Adelantos" (AdvanceBalance) lista para usarse en el futuro.

## 2. El Filtro Mágico (Normalización de Pólizas)
En el sistema de contabilidad (Aspel), a veces los contadores escriben los abonos en color rojo (cantidades negativas) para corregir errores o reclasificar pólizas. 
- **Nuestra regla:** La máquina tiene un filtro mágico. Todo número negativo que llega se vuelve positivo, pero la máquina invierte su significado: si era un "Abono negativo", la máquina lo transforma en un "Cargo normal", y si era un "Cargo negativo", lo transforma en un "Abono normal". Así, las cuentas siempre suman perfectamente.

## 3. Cuando llega un Cargo (El Residente Debe Dinero)
Cada vez que llega un recibo de cobro (por ejemplo, el mantenimiento de enero):
1. La máquina primero revisa si el residente tiene agua guardada en su **Bolsa de Adelantos**.
2. Si tiene agua, la saca y paga ese recibo inmediatamente.
3. Si no tiene agua (o no le alcanza), ese recibo se queda en la lista de "Recibos Pendientes" esperando a ser pagado.

## 4. Cuando llega un Pago General (Abono Global)
A veces el residente manda dinero pero no dice para qué es (por ejemplo, deposita $50,000). 
La máquina usa el **Sistema de Cascada (Por Prioridades)**. Las cubetas están acomodadas de arriba hacia abajo así:
1. Mantenimiento (La más importante)
2. Multas
3. Intereses
4. Extraordinarios
5. Otros

La máquina agarra el agua y empieza a llenar la cubeta 1. Si se llena y sobra agua, pasa a la cubeta 2, y así sucesivamente. Si después de llenar todas las cubetas sigue sobrando agua, ese sobrante se guarda en la **Bolsa de Adelantos** del Mantenimiento.

## 5. Cuando llega un Pago Directo (Abono Específico)
Si el residente depositó y el contador etiquetó que ese dinero es exactamente para "Multas", la máquina no usa la cascada. Va directo a la cubeta de "Multas" y le echa el agua ahí. Si sobra, se guarda como "Adelanto" exclusivo para futuras multas.

## 6. La Regla de los Descuentos (El LIFO)
A veces se le regala dinero al residente por pagar temprano (Descuento por Pronto Pago). 
Como el descuento es un premio para el mes que se está pagando (el más reciente), la máquina usa la regla **LIFO (Last In, First Out = El último en llegar, primero en pagarse)**.
- **Ejemplo:** Si debe Junio y debe Julio, y el sistema detecta un "Descuento", el sistema usa ese dinero mágico del descuento para rellenar la deuda de **Julio** (la última deuda), y deja intacta la deuda vieja de Junio.

## 7. La Regla de Pagos con Saldo a Favor (El FIFO)
Si el residente tenía agua guardada en la Bolsa de Adelantos (porque pagó de más el mes pasado), la máquina usa la regla **FIFO (First In, First Out = El primero en llegar, primero en pagarse)**.
- **Ejemplo:** Si debe Junio y debe Julio, la máquina saca el agua de su bolsa de ahorros y paga primero **Junio** (la deuda más antigua), y si sobra, paga Julio. 

## 8. La Limpieza Visual (Reconciliación de Descuentos)
Al final, para que el estado de cuenta del residente no se vea confuso (con una línea que diga "Descuentos a favor: $2,500" y otra que diga "Mantenimiento pendiente: $40,000"), la máquina hace un último truco:
Toma visualmente el dinero del descuento y se lo inyecta a la línea del Mantenimiento. Así, en el estado de cuenta final, el residente solo verá: "Mantenimiento pendiente: $37,500". ¡Mucho más limpio y claro!
