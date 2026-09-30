# ?? Plan de Estandarización de Idioma (Spanglish ? English)

**Fecha:** 10 de septiembre de 2026
**Estado:** ? Pendiente de Ejecución
**Contexto:** El código base actual sufre de deuda técnica por mezcla de idiomas (Spanglish) en sus entidades (ej. Medidor conviviendo con Provider). Dado que la API tiene exclusividad absoluta sobre la base de datos (no hay reportes externos ni otros sistemas acoplados a nivel SQL), el riesgo de renombrar tablas es mínimo.

## ?? Objetivo Arquitectónico
1. **Código y Base de Datos:** 100% Inglés (Entidades, DbSets, Tablas, Columnas, Rutas de API, DTOs).
2. **Interfaz de Usuario (Angular):** 100% Español (Labels, Botones, Textos visibles al usuario final).

---

## ??? Fases de Ejecución

### ?? FASE 1: Descubrimiento y Diccionario (Ubiquitous Language)
Antes de tocar una sola línea de código, necesitamos un mapa exacto para evitar inconsistencias.
- [ ] 1.1 Listar todas las entidades, carpetas de dominio y tablas actuales que estén en español.
- [ ] 1.2 Crear un glosario oficial de traducción validado por negocio (Ej. Piscina ? Pool, Medidor ? Meter, JuntaMensual ? MonthlyMeeting, ComiteVigilancia ? VigilanceCommittee).
- [ ] 1.3 Almacenar este diccionario en conventions/UBIQUITOUS_LANGUAGE.md para que sirva como fuente de verdad en el futuro.

### ??? FASE 2: Refactorización Estructural (Backend C#)
Utilizando herramientas de refactorización simbólica (IDE Rename) para que las referencias se actualicen solas.
- [ ] 2.1 Renombrar las clases de Entidad (Ej. Piscina ? Pool).
- [ ] 2.2 Renombrar los archivos físicos para que coincidan con la clase (Regla R2).
- [ ] 2.3 Actualizar los atributos [Table] a su versión plural en inglés (Ej. [Table("Pools")]).
- [ ] 2.4 Renombrar las propiedades DbSet en ApplicationDbContext.cs.
- [ ] 2.5 Traducir DTOs, Servicios (PiscinaAppService ? PoolAppService) y Endpoints (/api/piscinas ? /api/pools).

### ??? FASE 3: Migración de Base de Datos (EF Core)
Dado que el dominio está limpio, le pasamos la estafeta al ORM.
- [ ] 3.1 Compilar la solución (0 errores).
- [ ] 3.2 Ejecutar dotnet ef migrations add TranslateDatabaseToEnglish.
- [ ] 3.3 Revisar el archivo de migración generado para asegurar que EF Core detectó los cambios como RenameTable y RenameColumn (y no como un destructivo DropTable + CreateTable).
- [ ] 3.4 Aplicar la migración a la base de datos local y de desarrollo (dotnet ef database update).

### ?? FASE 4: Alineación del Cliente (Frontend Angular)
Adaptar el cliente al nuevo idioma del servidor sin cambiar la experiencia del usuario.
- [ ] 4.1 Actualizar las rutas HTTP en los *service.ts de Angular para apuntar a los nuevos endpoints en inglés.
- [ ] 4.2 Traducir las interfaces/modelos de TypeScript (piscina.model.ts ? pool.model.ts).
- [ ] 4.3 Asegurarse de que las etiquetas HTML visuales (<label>, <h1>) se mantengan en español para el usuario final.

---

## ??? Reglas de Seguridad durante el proceso
* **Aislamiento:** Esta refactorización se hará en una rama exclusiva (
efactor/english-standardization).
* **Pruebas:** Tras la Fase 3, se deben correr todos los unit tests (que también deberán ser traducidos en su nomenclatura).
* **QA:** Invocaremos el protocolo qa-punta-a-punta antes de hacer el merge a la rama principal.
