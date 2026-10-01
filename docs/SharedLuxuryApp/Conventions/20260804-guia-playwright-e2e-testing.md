# Guía Completa de Playwright E2E Testing - LuxuryApp

## Índice
1. [Instalación y Configuración](#instalación-y-configuración)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Comandos Disponibles](#comandos-disponibles)
4. [Ejecutando Tests](#ejecutando-tests)
5. [Patrón Page Object](#patrón-page-object)
6. [Fixtures y Test Data](#fixtures-y-test-data)
7. [Selectores Recomendados](#selectores-recomendados)
8. [Debugging y Troubleshooting](#debugging-y-troubleshooting)
9. [CI/CD](#cicd)
10. [Mejores Prácticas](#mejores-prácticas)

---

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Angular CLI 22+
- Proyecto Angular en `client/angular/`

### Instalación inicial (solo primera vez)
```bash
cd client/angular

# Instalar dependencias de testing
npm install -D @playwright/test

# Instalar navegadores
npm run test:e2e:install
# o manualmente:
npx playwright install
npx playwright install-deps  # Solo Linux
```

### Verificar instalación
```bash
npx playwright --version
# Debe mostrar: Version 1.62.0 (o superior)
```

---

## Estructura del Proyecto

```
client/angular/
├── playwright.config.ts          # Configuración principal
├── package.json                  # Scripts de test
├── e2e/
│   ├── README.md                 # Documentación rápida
│   ├── fixtures/
│   │   ├── test-fixtures.ts      # Fixtures globales extendidas
│   │   └── pages/
│   │       ├── LoginPage.ts      # Page Object: Login
│   │       ├── DashboardPage.ts  # Page Object: Dashboard
│   │       └── index.ts          # Exportaciones
│   └── specs/
│       ├── auth.spec.ts          # Tests de autenticación
│       └── dashboard.spec.ts     # Tests de dashboard
```

### Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `playwright.config.ts` | Configuración global (navegadores, timeouts, webServer) |
| `test-fixtures.ts` | Extiende `test` con page objects y estado autenticado |
| `LoginPage.ts` | Encapsula lógica de página de login |
| `DashboardPage.ts` | Encapsula lógica de dashboard |
| `auth.spec.ts` | Tests de login, validaciones, recuperación contraseña |
| `dashboard.spec.ts` | Tests de dashboard autenticado |

---

## Comandos Disponibles

### Definidos en `package.json`
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:ci": "playwright test --reporter=github",
  "test:e2e:install": "playwright install",
  "test:e2e:report": "playwright show-report"
}
```

### Descripción de cada comando

| Comando | Uso | Descripción |
|---------|-----|-------------|
| `npm run test:e2e` | CI / Local | Ejecución headless completa |
| `npm run test:e2e:ui` | Desarrollo | **Recomendado**: UI visual interactiva |
| `npm run test:e2e:headed` | Debug visual | Navegador visible, headless=false |
| `npm run test:e2e:debug` | Debug paso a paso | Inspector de Playwright + breakpoints |
| `npm run test:e2e:ci` | Pipeline CI | Reporter optimizado para GitHub Actions |
| `npm run test:e2e:install` | Setup | Instala navegadores |
| `npm run test:e2e:report` | Post-ejecución | Abre reporte HTML |

### Comandos directos útiles
```bash
# Solo un archivo
npx playwright test e2e/specs/auth.spec.ts

# Solo tests que coincidan con patrón
npx playwright test -g "login"

# Solo un navegador
npx playwright test --project=chromium

# Con reporte HTML al final
npx playwright test --reporter=html

# Generar código grabando acciones (codegen)
npx playwright codegen http://localhost:4200

# Ver reporte de última ejecución
npx playwright show-report

# Actualizar snapshots visuales
npx playwright test --update-snapshots
```

---

## Ejecutando Tests

### Modo desarrollo (RECOMENDADO)

**Terminal 1** - Levantar servidor de desarrollo:
```bash
cd client/angular
npm run start
# Esperar: "Compiled successfully" en http://localhost:4200
```

**Terminal 2** - Ejecutar tests:
```bash
cd client/angular
npm run test:e2e:ui
# Se abre interfaz visual en http://localhost:9323
```

### Modo CI / Headless (una sola terminal)
```bash
cd client/angular
npm run test:e2e
# El config levanta webServer automáticamente (timeout 2min)
```

### Primer ejecución - Consideraciones
- **Build inicial Angular**: Tarda 60-180s la primera vez
- **Timeout webServer**: Configurado a 120s en `playwright.config.ts`
- **Si falla por timeout**: Aumentar a 300s o usar dos terminales

```typescript
// playwright.config.ts - ajuste para builds lentos
webServer: {
  timeout: 300000,  // 5 minutos
}
```

---

## Patrón Page Object

### Por qué usar Page Objects
- **Mantenibilidad**: Cambios en UI → un solo archivo
- **Reutilización**: Métodos compartidos entre tests
- **Legibilidad**: Tests expresan *qué* no *cómo*
- **Abstracción**: Ocultan selectores frágiles

### Estructura base
```typescript
// e2e/fixtures/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  // Selectores como propiedades readonly
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    // Inicializar selectores usando selectores accesibles
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Contraseña');
    this.submitButton = page.getByRole('button', { name: /iniciar sesión/i });
  }

  // Acciones de alto nivel (qué hace el usuario)
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string, rememberMe = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (rememberMe) await this.rememberMeCheckbox.check();
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Assertions específicas de la página
  async expectLoginSuccess(expectedUrl = '/dashboard') {
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  async expectLoginError(message?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (message) await expect(this.errorMessage).toContainText(message);
  }
}
```

### Crear nuevo Page Object
1. Crear archivo en `e2e/fixtures/pages/NuevaPagina.ts`
2. Exportar en `e2e/fixtures/pages/index.ts`
3. Agregar fixture en `test-fixtures.ts`
4. Usar en tests

```typescript
// e2e/fixtures/pages/index.ts
export * from './LoginPage';
export * from './DashboardPage';
export * from './NuevaPagina';  // ← Agregar
```

```typescript
// e2e/fixtures/test-fixtures.ts - agregar fixture
import { NuevaPagina } from './pages';

type Fixtures = {
  // ...
  nuevaPagina: NuevaPagina;
};

export const test = base.extend<Fixtures>({
  // ...
  nuevaPagina: async ({ page }, use) => {
    await use(new NuevaPagina(page));
  },
});
```

---

## Fixtures y Test Data

### Fixtures globales (`test-fixtures.ts`)
Extienden `test` de Playwright con utilidades preconfiguradas:

```typescript
// e2e/fixtures/test-fixtures.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage, DashboardPage } from './pages';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;  // Page ya logueada
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login('test@luxuryapp.com', 'Test123!');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### Uso en tests
```typescript
// e2e/specs/auth.spec.ts
import { test, expect } from '../fixtures/test-fixtures';

test('login exitoso', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@test.com', 'password');
  await loginPage.expectLoginSuccess();
});

test('dashboard con usuario autenticado', async ({ authenticatedPage, dashboardPage }) => {
  // authenticatedPage ya está logueada
  await dashboardPage.expectLoaded();
});
```

### Fixtures con parámetros (avanzado)
```typescript
// Para tests con diferentes usuarios/roles
test.extend<{ user: User }>({
  user: async ({}, use, testInfo) => {
    const role = testInfo.project.name.includes('admin') ? 'admin' : 'user';
    await use(await createTestUser(role));
  },
});
```

### Test Data / Datos de prueba
```typescript
// e2e/fixtures/test-data.ts
export const testUsers = {
  valid: { email: 'test@luxuryapp.com', password: 'Test123!' },
  invalid: { email: 'wrong@test.com', password: 'wrong' },
  admin: { email: 'admin@luxuryapp.com', password: 'Admin123!' },
};

export const testProducts = [
  { name: 'Producto A', price: 100, category: 'Electrónica' },
  { name: 'Producto B', price: 200, category: 'Hogar' },
];
```

---

## Selectores Recomendados

### Jerarquía de prioridad (Playwright Best Practices)

| Prioridad | Selector | Ejemplo | Cuándo usar |
|-----------|----------|---------|-------------|
| **1** | `getByRole` | `page.getByRole('button', { name: 'Enviar' })` | Siempre que sea posible - semántico, accesible |
| **2** | `getByLabel` | `page.getByLabel('Email')` | Inputs con label asociado |
| **3** | `getByPlaceholder` | `page.getByPlaceholder('Buscar...')` | Inputs con placeholder |
| **4** | `getByText` | `page.getByText('Bienvenido')` | Texto visible único |
| **5** | `getByTestId` | `page.getByTestId('submit-btn')` | Cuando no hay alternativa accesible |
| **6** | CSS/XPath | `page.locator('.btn-primary')` | **Evitar** - frágiles |

### Ejemplos prácticos
```typescript
// ✅ BUENO - Accesible, semántico
await page.getByRole('button', { name: /guardar/i }).click();
await page.getByLabel('Correo electrónico').fill('test@test.com');
await page.getByRole('link', { name: 'Ver perfil' }).click();

// ✅ BUENO - Test IDs estables (data-testid)
await page.getByTestId('user-avatar').click();

// ❌ MALO - Frágil, depende de estructura CSS
await page.locator('div.container > form button.btn-primary').click();
await page.locator('#login-form input[name="email"]').fill('test');
await page.locator('//button[contains(text(), "Login")]').click();
```

### Selectores compuestos
```typescript
// Encadenar para precisión
const row = page.getByRole('row', { name: /juan pérez/i });
await row.getByRole('button', { name: 'Editar' }).click();

// Filtrar por estado
const enabledButton = page.getByRole('button', { name: 'Enviar' }).filter({ hasNot: page.locator('[disabled]') });
await enabledButton.click();
```

---

## Debugging y Troubleshooting

### 1. UI Mode (Mejor para desarrollo)
```bash
npm run test:e2e:ui
```
- Interfaz visual en `http://localhost:9323`
- Ver tests, ejecutar individualmente, ver traces
- Timeline de acciones, DOM snapshots, console logs

### 2. Modo Debug (Paso a paso)
```bash
npm run test:e2e:debug
# O en test específico:
npx playwright test e2e/specs/auth.spec.ts --debug
```
- Abre Inspector de Playwright
- Breakpoints en VS Code funcionan
- `page.pause()` en código para parar

### 3. Headed Mode (Ver navegador)
```bash
npm run test:e2e:headed
```

### 4. Traces (Post-mortem)
Configurado en `playwright.config.ts`:
```typescript
use: {
  trace: 'on-first-retry',  // Solo en reintentos
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

**Ver trace:**
```bash
npx playwright show-trace test-results/auth-debería-fallar-con-credenciales-inválidas/trace.zip
```

### 5. Codegen (Grabar tests)
```bash
npx playwright codegen http://localhost:4200
```
- Abre navegador + inspector
- Graba clics, inputs, navegación
- Genera código TypeScript copiable

### 6. Console logs y Network
```typescript
test('debug network', async ({ page }) => {
  // Logs de consola del navegador
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  // Requests fallidos
  page.on('requestfailed', req => console.log('FAILED:', req.url(), req.failure()));
  
  // Responses
  page.on('response', res => {
    if (res.status() >= 400) console.log('ERROR:', res.url(), res.status());
  });
  
  await page.goto('/dashboard');
});
```

### Problemas comunes y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| `TimeoutError: page.goto` | Servidor no levantado | Usar 2 terminales o aumentar `webServer.timeout` |
| `Element not found` | Selector incorrecto | Usar `getByRole`, inspeccionar en UI mode |
| `Flaky tests` | Race conditions | `waitForLoadState('networkidle')`, `expect().toBeVisible()` |
| `Tests lentos` | Muitos workers | Reducir `workers` en config |
| `Auth state lost` | Storage no persistido | Usar `storageState` fixture |

### Storage State (Persistir autenticación)
```typescript
// playwright.config.ts
use: {
  storageState: 'playwright/.auth/user.json',  // Se genera automáticamente
}

// O en test específico
test.use({ storageState: 'playwright/.auth/admin.json' });
```

```bash
# Generar estado inicial
npx playwright test --project=setup  # Ver setup project en config
```

---

## CI/CD

### GitHub Actions (`.github/workflows/e2e.yml`)
```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/angular/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: client/angular
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
        working-directory: client/angular
      
      - name: Build application
        run: npm run build
        working-directory: client/angular
      
      - name: Run E2E tests
        run: npm run test:e2e:ci
        working-directory: client/angular
      
      - name: Upload test artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: client/angular/test-results/
          retention-days: 7
      
      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-html-report
          path: client/angular/playwright-report/
          retention-days: 7
```

### Configuración CI en `playwright.config.ts`
```typescript
// Detecta CI automáticamente via process.env.CI
forbidOnly: !!process.env.CI,      // Falla si hay test.only
retries: process.env.CI ? 2 : 0,   // Reintenta en CI
workers: process.env.CI ? 1 : undefined,  // Serial en CI
reporter: process.env.CI ? 'github' : 'html',  // Reporter CI
```

### Reporter options
```typescript
reporter: [
  ['html', { open: 'never' }],     // Reporte HTML local
  ['list'],                         // Lista en consola
  ['github'],                       // Anotaciones en PR (CI)
  ['junit', { outputFile: 'test-results/junit.xml' }],  // Para Jenkins
],
```

---

## Mejores Prácticas

### 1. Organización de Tests
```typescript
// Agrupar por feature
test.describe('Autenticación', () => {
  test.describe.configure({ retries: 1 });  // Retries por describe
  
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });
  
  test('login válido', async ({ loginPage }) => { ... });
  test('login inválido', async ({ loginPage }) => { ... });
});
```

### 2. Nombrado de Tests
```typescript
// Formato: "debería [comportamiento esperado] cuando [condición]"
test('debería redirigir a dashboard cuando credenciales son válidas', ...);
test('debería mostrar error cuando password es incorrecto', ...);
test('debería bloquear botón cuando formulario inválido', ...);
```

### 3. AAA Pattern (Arrange-Act-Assert)
```typescript
test('debería agregar producto al carrito', async ({ page }) => {
  // Arrange - Preparar
  const productPage = new ProductPage(page);
  await productPage.goto('/products/123');
  
  // Act - Actuar
  await productPage.addToCart(2);
  
  // Assert - Verificar
  await expect(productPage.cartBadge).toHaveText('2');
  await expect(productPage.successToast).toBeVisible();
});
```

### 4. Test Independence
- Cada test debe poder ejecutarse solo
- No depender de estado de tests anteriores
- Usar `beforeEach`/`afterEach` para setup/teardown

### 5. Timeouts Inteligentes
```typescript
// playwright.config.ts - timeouts globales
timeout: 30000,           // Test timeout
expect: { timeout: 5000 }, // Assertion timeout
use: {
  actionTimeout: 10000,   // Click, fill, etc.
  navigationTimeout: 30000,
}
```

### 6. Parallelización
```typescript
// playwright.config.ts
fullyParallel: true,  // Tests en paralelo
workers: 4,           // O undefined para auto
```

### 7. Anotaciones Útiles
```typescript
test.skip('temporalmente deshabilitado', ...);      // Skip
test.fixme('bug conocido #123', ...);               // Expected fail
test.only('solo este test', ...);                   // Solo uno (¡no committear!)
test.slow();                                        // Marca como lento (>30s)
```

### 8. Visual Regression (Opcional)
```typescript
// Requiere @playwright/test + pixelmatch
import { expect } from '@playwright/test';

test('dashboard visual match', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixels: 100,
    threshold: 0.2,
  });
});
```

### 9. Accesibilidad en Tests
```typescript
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('login page accessible', async ({ page }) => {
  await page.goto('/login');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
});
```

---

## Referencias Rápidas

### URLs Importantes
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Selectors Guide**: https://playwright.dev/docs/selectors
- **Test Config**: https://playwright.dev/docs/test-configuration
- **CI/CD**: https://playwright.dev/docs/ci
- **Trace Viewer**: https://playwright.dev/docs/trace-viewer

### Archivos del Proyecto
- Config: `client/angular/playwright.config.ts`
- Tests: `client/angular/e2e/specs/`
- Page Objects: `client/angular/e2e/fixtures/pages/`
- Fixtures: `client/angular/e2e/fixtures/test-fixtures.ts`
- Docs: `client/angular/e2e/README.md`

### Comandos de Emergencia
```bash
# Matar procesos Playwright colgados
npx playwright kill-all-browsers

# Limpiar cache
rm -rf ~/.cache/ms-playwright

# Reinstalar todo
rm -rf node_modules package-lock.json
npm install
npm run test:e2e:install
```

---

## Próximos Pasos Recomendados

1. **Añadir más Page Objects** para cada feature principal
2. **Implementar visual regression** para UI crítica
3. **Añadir accessibility testing** con axe-core
4. **Configurar test setup project** para auth state persistente
5. **Integrar con Allure Report** para reportes ricos
6. **Añadir contract testing** para APIs
7. **Implementar test data factories** para datos dinámicos

---

*Guía generada el 2026-08-04 para LuxuryApp Angular 22+ / Playwright 1.62+*
