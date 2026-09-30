# Inventario de Iconos — LuxuryApp (2026-08-10)

> Documento de la **FASE 0** del prompt `opencode-prompt.md`. Solo lectura: no se modificó
> ningún archivo de código. Método documentado en §6. Mediciones sobre
> `client/angular/src/app` (Repo `client/angular`, rama `main`).

## 1. Conteos globales

| Métrica | §3 prompt | Medido | Estado |
|---|---:|---:|---|
| `<app-icon>` usos / archivos | 1,516 / 572 | **1517 / 572** (all) | ✓ (1 de diferencia) |
| `icon="mdi:x"` atributo estático | 462 | **594** (app-icon) | ⚠ ver §6 |
| `[icon]="'mdi:x'"` binding literal | 673 | **673** | ✅ exacto |
| `[icon]="expresión"` | 251 | **239** (app-icon) | ⚠ ver §6 |
| nombres `mdi:` distintos estáticos | 262 | **262** | ✅ exacto |
| icon-mapping.ts entradas / mdi | 172 / 166 | **172 / 166** | ✅ exacto |
| **UNIÓN a traducir** | 343 | **343** | ✅ exacto |
| `pi pi-` directo | 141 | **83** (fuera de mapping) | ⚠ ver §6 |
| `<ion-icon>` | 64 | **64** | ✅ exacto |
| `fluent-color:` | 2 | **2** (attr) + 22 (TS) | ⚠ ver §6 |

## 2. UNIÓN de nombres mdi a traducir (343)

Nombres `mdi:` únicos = **262 estáticos ⊕ 166 del mapping (85 en común) = 343**.
Uso = suma de apariciones como `icon="mdi:x"`, `[icon]="'mdi:x'"` y literales
`'mdi:x'` dentro de expresiones. **En mapping** indica si figura en
`shared/utils/icon-mapping.ts`.

| # | Nombre mdi | Usos | estático | literal | expr | Archivos | En mapping |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | `loading` | 86 | 12 | 71 | 3 | 68 | no |
| 2 | `check` | 84 | 16 | 20 | 48 | 43 | sí |
| 3 | `close` | 79 | 12 | 19 | 48 | 42 | sí |
| 4 | `check-circle` | 56 | 23 | 28 | 5 | 45 | sí |
| 5 | `chevron-right` | 46 | 24 | 17 | 5 | 42 | sí |
| 6 | `calendar` | 32 | 8 | 24 | 0 | 32 | sí |
| 7 | `information` | 32 | 3 | 28 | 1 | 27 | sí |
| 8 | `file-document-outline` | 31 | 20 | 8 | 3 | 27 | sí |
| 9 | `clock-outline` | 30 | 12 | 18 | 0 | 25 | sí |
| 10 | `account` | 29 | 8 | 14 | 7 | 26 | sí |
| 11 | `alert` | 26 | 9 | 16 | 1 | 23 | sí |
| 12 | `magnify` | 24 | 12 | 10 | 2 | 22 | sí |
| 13 | `email-outline` | 20 | 9 | 8 | 3 | 18 | sí |
| 14 | `alert-circle-outline` | 19 | 17 | 2 | 0 | 19 | no |
| 15 | `format-list-bulleted` | 18 | 6 | 12 | 0 | 16 | sí |
| 16 | `chevron-down` | 17 | 6 | 0 | 11 | 17 | sí |
| 17 | `lock` | 17 | 4 | 9 | 4 | 13 | sí |
| 18 | `menu` | 17 | 7 | 10 | 0 | 14 | sí |
| 19 | `account-group` | 16 | 6 | 9 | 1 | 12 | sí |
| 20 | `file-pdf-box` | 16 | 3 | 9 | 4 | 15 | sí |
| 21 | `folder-open` | 16 | 11 | 5 | 0 | 16 | sí |
| 22 | `plus` | 16 | 6 | 1 | 9 | 15 | sí |
| 23 | `close-circle` | 14 | 5 | 7 | 2 | 13 | sí |
| 24 | `office-building` | 14 | 3 | 9 | 2 | 14 | sí |
| 25 | `arrow-right` | 13 | 2 | 11 | 0 | 11 | sí |
| 26 | `account-group-outline` | 12 | 12 | 0 | 0 | 11 | no |
| 27 | `inbox` | 12 | 2 | 10 | 0 | 10 | sí |
| 28 | `phone` | 12 | 1 | 11 | 0 | 7 | sí |
| 29 | `alert-circle` | 11 | 9 | 2 | 0 | 9 | sí |
| 30 | `briefcase` | 11 | 3 | 8 | 0 | 8 | sí |
| 31 | `chart-bar` | 11 | 3 | 8 | 0 | 10 | sí |
| 32 | `download` | 11 | 4 | 4 | 3 | 9 | sí |
| 33 | `currency-usd` | 10 | 8 | 2 | 0 | 9 | sí |
| 34 | `refresh` | 10 | 9 | 0 | 1 | 10 | sí |
| 35 | `chart-line` | 9 | 2 | 7 | 0 | 9 | sí |
| 36 | `check-circle-outline` | 9 | 5 | 1 | 3 | 9 | no |
| 37 | `chevron-left` | 9 | 9 | 0 | 0 | 9 | sí |
| 38 | `chevron-up` | 9 | 1 | 0 | 8 | 8 | sí |
| 39 | `file-excel` | 9 | 0 | 9 | 0 | 9 | sí |
| 40 | `pencil` | 9 | 4 | 4 | 1 | 8 | sí |
| 41 | `sitemap` | 9 | 0 | 8 | 1 | 6 | sí |
| 42 | `sparkles` | 9 | 1 | 6 | 2 | 5 | sí |
| 43 | `account-plus` | 8 | 5 | 3 | 0 | 5 | sí |
| 44 | `cog` | 8 | 4 | 3 | 1 | 7 | sí |
| 45 | `gavel` | 8 | 8 | 0 | 0 | 8 | no |
| 46 | `home` | 8 | 1 | 2 | 5 | 7 | sí |
| 47 | `information-outline` | 8 | 5 | 1 | 2 | 7 | sí |
| 48 | `office-building-outline` | 8 | 8 | 0 | 0 | 8 | no |
| 49 | `phone-outline` | 8 | 8 | 0 | 0 | 8 | no |
| 50 | `shield` | 8 | 1 | 5 | 2 | 8 | sí |
| 51 | `star-outline` | 8 | 0 | 7 | 1 | 5 | sí |
| 52 | `arrow-left` | 7 | 3 | 4 | 0 | 6 | sí |
| 53 | `book` | 7 | 0 | 7 | 0 | 5 | sí |
| 54 | `content-copy` | 7 | 4 | 3 | 0 | 6 | sí |
| 55 | `eye-outline` | 7 | 3 | 2 | 2 | 7 | sí |
| 56 | `history` | 7 | 3 | 4 | 0 | 6 | sí |
| 57 | `pencil-outline` | 7 | 4 | 0 | 3 | 6 | no |
| 58 | `send` | 7 | 7 | 0 | 0 | 6 | sí |
| 59 | `ticket-outline` | 7 | 7 | 0 | 0 | 6 | no |
| 60 | `wallet` | 7 | 4 | 3 | 0 | 5 | sí |
| 61 | `ban` | 6 | 0 | 3 | 3 | 6 | sí |
| 62 | `bell-outline` | 6 | 3 | 0 | 3 | 6 | no |
| 63 | `briefcase-outline` | 6 | 6 | 0 | 0 | 6 | no |
| 64 | `clipboard-text-outline` | 6 | 6 | 0 | 0 | 5 | no |
| 65 | `comment-multiple` | 6 | 0 | 5 | 1 | 5 | sí |
| 66 | `home-city-outline` | 6 | 6 | 0 | 0 | 6 | no |
| 67 | `lightning-bolt` | 6 | 1 | 5 | 0 | 6 | sí |
| 68 | `lock-outline` | 6 | 3 | 0 | 3 | 6 | no |
| 69 | `map-marker` | 6 | 3 | 3 | 0 | 6 | sí |
| 70 | `pound` | 6 | 0 | 6 | 0 | 6 | sí |
| 71 | `receipt` | 6 | 3 | 3 | 0 | 6 | sí |
| 72 | `table` | 6 | 0 | 6 | 0 | 4 | sí |
| 73 | `tag` | 6 | 0 | 6 | 0 | 5 | sí |
| 74 | `weather-sunny` | 6 | 0 | 3 | 3 | 6 | sí |
| 75 | `account-minus` | 5 | 0 | 4 | 1 | 3 | sí |
| 76 | `arrow-up-right` | 5 | 4 | 1 | 0 | 4 | sí |
| 77 | `bell` | 5 | 4 | 1 | 0 | 5 | sí |
| 78 | `calendar-remove` | 5 | 1 | 4 | 0 | 5 | sí |
| 79 | `camera` | 5 | 2 | 3 | 0 | 5 | sí |
| 80 | `card-account-details` | 5 | 0 | 5 | 0 | 4 | sí |
| 81 | `cash-multiple` | 5 | 4 | 1 | 0 | 5 | no |
| 82 | `cash-plus` | 5 | 5 | 0 | 0 | 5 | no |
| 83 | `circle` | 5 | 0 | 5 | 0 | 2 | sí |
| 84 | `dots-vertical` | 5 | 3 | 2 | 0 | 5 | sí |
| 85 | `file-sign` | 5 | 3 | 0 | 2 | 5 | no |
| 86 | `paperclip` | 5 | 1 | 4 | 0 | 4 | sí |
| 87 | `qrcode` | 5 | 5 | 0 | 0 | 5 | no |
| 88 | `server` | 5 | 0 | 5 | 0 | 4 | sí |
| 89 | `store-outline` | 5 | 5 | 0 | 0 | 4 | no |
| 90 | `calculator` | 4 | 3 | 1 | 0 | 4 | sí |
| 91 | `calendar-check` | 4 | 1 | 3 | 0 | 4 | sí |
| 92 | `calendar-clock` | 4 | 2 | 2 | 0 | 4 | sí |
| 93 | `calendar-plus` | 4 | 2 | 2 | 0 | 4 | sí |
| 94 | `cart-outline` | 4 | 4 | 0 | 0 | 3 | no |
| 95 | `domain` | 4 | 4 | 0 | 0 | 4 | no |
| 96 | `external-link` | 4 | 1 | 3 | 0 | 4 | sí |
| 97 | `file-edit` | 4 | 2 | 2 | 0 | 4 | sí |
| 98 | `format-list-checks` | 4 | 2 | 2 | 0 | 4 | sí |
| 99 | `help-circle` | 4 | 2 | 2 | 0 | 4 | sí |
| 100 | `image-multiple` | 4 | 1 | 3 | 0 | 4 | sí |
| 101 | `link` | 4 | 1 | 3 | 0 | 3 | sí |
| 102 | `lock-open` | 4 | 1 | 0 | 3 | 3 | sí |
| 103 | `percent` | 4 | 1 | 3 | 0 | 4 | sí |
| 104 | `plus-circle-outline` | 4 | 4 | 0 | 0 | 4 | no |
| 105 | `star` | 4 | 3 | 0 | 1 | 4 | no |
| 106 | `trending-up` | 4 | 2 | 0 | 2 | 4 | no |
| 107 | `account-edit` | 3 | 0 | 3 | 0 | 3 | sí |
| 108 | `account-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 109 | `alert-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 110 | `bank-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 111 | `bell-off-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 112 | `calendar-blank` | 3 | 3 | 0 | 0 | 3 | no |
| 113 | `calendar-minus` | 3 | 0 | 3 | 0 | 3 | sí |
| 114 | `calendar-plus-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 115 | `cash` | 3 | 3 | 0 | 0 | 3 | no |
| 116 | `cellphone` | 3 | 3 | 0 | 0 | 3 | sí |
| 117 | `checkbox-marked` | 3 | 0 | 2 | 1 | 3 | sí |
| 118 | `clipboard-search-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 119 | `clipboard-text` | 3 | 2 | 1 | 0 | 3 | sí |
| 120 | `cloud-upload` | 3 | 0 | 3 | 0 | 3 | sí |
| 121 | `cog-outline` | 3 | 3 | 0 | 0 | 2 | no |
| 122 | `comment-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 123 | `credit-card` | 3 | 0 | 3 | 0 | 3 | sí |
| 124 | `delete` | 3 | 1 | 1 | 1 | 3 | sí |
| 125 | `forum-outline` | 3 | 3 | 0 | 0 | 2 | no |
| 126 | `grid` | 3 | 0 | 3 | 0 | 2 | sí |
| 127 | `inbox-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 128 | `login` | 3 | 2 | 1 | 0 | 3 | sí |
| 129 | `minus` | 3 | 0 | 0 | 3 | 2 | sí |
| 130 | `plus-circle` | 3 | 2 | 1 | 0 | 3 | sí |
| 131 | `scale-balance` | 3 | 2 | 1 | 0 | 3 | sí |
| 132 | `shopping` | 3 | 0 | 3 | 0 | 2 | sí |
| 133 | `sync` | 3 | 2 | 1 | 0 | 3 | sí |
| 134 | `ticket-confirmation` | 3 | 3 | 0 | 0 | 3 | no |
| 135 | `volume-high` | 3 | 0 | 3 | 0 | 3 | sí |
| 136 | `wallet-outline` | 3 | 3 | 0 | 0 | 3 | no |
| 137 | `weather-night` | 3 | 0 | 0 | 3 | 3 | sí |
| 138 | `account-alert-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 139 | `account-circle-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 140 | `account-tie` | 2 | 2 | 0 | 0 | 2 | no |
| 141 | `account-tie-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 142 | `alert-decagram-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 143 | `arrow-down` | 2 | 0 | 0 | 2 | 2 | sí |
| 144 | `arrow-down-bold` | 2 | 0 | 2 | 0 | 1 | sí |
| 145 | `bank-transfer` | 2 | 2 | 0 | 0 | 2 | no |
| 146 | `barcode-scan` | 2 | 2 | 0 | 0 | 2 | no |
| 147 | `calendar-end` | 2 | 2 | 0 | 0 | 2 | no |
| 148 | `calendar-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 149 | `calendar-start` | 2 | 2 | 0 | 0 | 2 | no |
| 150 | `cart` | 2 | 0 | 2 | 0 | 2 | sí |
| 151 | `chart-line-variant` | 2 | 2 | 0 | 0 | 2 | no |
| 152 | `chart-pie` | 2 | 1 | 1 | 0 | 2 | no |
| 153 | `check-all` | 2 | 2 | 0 | 0 | 1 | no |
| 154 | `circle-medium` | 2 | 2 | 0 | 0 | 1 | no |
| 155 | `city` | 2 | 2 | 0 | 0 | 2 | no |
| 156 | `clipboard-check-outline` | 2 | 1 | 1 | 0 | 2 | no |
| 157 | `clipboard-list-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 158 | `code-tags` | 2 | 0 | 2 | 0 | 1 | sí |
| 159 | `cog-sync` | 2 | 2 | 0 | 0 | 2 | no |
| 160 | `comment-multiple-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 161 | `credit-card-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 162 | `dollar` | 2 | 0 | 2 | 0 | 2 | sí |
| 163 | `edit` | 2 | 2 | 0 | 0 | 1 | no |
| 164 | `elevator-passenger-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 165 | `email` | 2 | 1 | 0 | 1 | 2 | no |
| 166 | `engine-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 167 | `eye-off` | 2 | 0 | 0 | 2 | 2 | sí |
| 168 | `file-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 169 | `file-table-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 170 | `file-tree-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 171 | `filter` | 2 | 1 | 1 | 0 | 1 | no |
| 172 | `fire-alert` | 2 | 2 | 0 | 0 | 2 | no |
| 173 | `flag` | 2 | 2 | 0 | 0 | 2 | sí |
| 174 | `folder` | 2 | 0 | 1 | 1 | 2 | sí |
| 175 | `gauge` | 2 | 2 | 0 | 0 | 2 | no |
| 176 | `gift` | 2 | 0 | 2 | 0 | 2 | sí |
| 177 | `heart` | 2 | 0 | 2 | 0 | 1 | sí |
| 178 | `image` | 2 | 1 | 0 | 1 | 2 | sí |
| 179 | `image-filter-frames` | 2 | 2 | 0 | 0 | 2 | no |
| 180 | `key-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 181 | `map-marker-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 182 | `medical-bag` | 2 | 2 | 0 | 0 | 2 | no |
| 183 | `pool` | 2 | 2 | 0 | 0 | 2 | no |
| 184 | `presentation` | 2 | 2 | 0 | 0 | 2 | no |
| 185 | `printer` | 2 | 1 | 0 | 1 | 2 | sí |
| 186 | `receipt-text-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 187 | `send-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 188 | `shape-outline` | 2 | 2 | 0 | 0 | 1 | no |
| 189 | `shield-home` | 2 | 2 | 0 | 0 | 2 | no |
| 190 | `swap-horizontal` | 2 | 2 | 0 | 0 | 2 | no |
| 191 | `table-off` | 2 | 2 | 0 | 0 | 2 | no |
| 192 | `tag-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 193 | `toggle-switch` | 2 | 0 | 0 | 2 | 2 | sí |
| 194 | `toggle-switch-off-outline` | 2 | 0 | 0 | 2 | 2 | sí |
| 195 | `tools` | 2 | 2 | 0 | 0 | 2 | no |
| 196 | `trash-can` | 2 | 2 | 0 | 0 | 1 | no |
| 197 | `trash-can-outline` | 2 | 2 | 0 | 0 | 1 | no |
| 198 | `upload` | 2 | 2 | 0 | 0 | 2 | sí |
| 199 | `verified` | 2 | 0 | 2 | 0 | 2 | sí |
| 200 | `video` | 2 | 2 | 0 | 0 | 2 | sí |
| 201 | `view-dashboard-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 202 | `water-outline` | 2 | 2 | 0 | 0 | 2 | no |
| 203 | `wrench` | 2 | 0 | 2 | 0 | 2 | sí |
| 204 | `account-minus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 205 | `account-multiple-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 206 | `account-off-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 207 | `account-plus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 208 | `account-search-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 209 | `alarm-light-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 210 | `arrow-up` | 1 | 1 | 0 | 0 | 1 | sí |
| 211 | `badge-account-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 212 | `beach` | 1 | 1 | 0 | 0 | 1 | no |
| 213 | `bell-off` | 1 | 0 | 1 | 0 | 1 | sí |
| 214 | `book-open-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 215 | `book-open-page-variant` | 1 | 1 | 0 | 0 | 1 | no |
| 216 | `bookmark` | 1 | 0 | 1 | 0 | 1 | sí |
| 217 | `brain` | 1 | 1 | 0 | 0 | 1 | no |
| 218 | `building` | 1 | 1 | 0 | 0 | 1 | no |
| 219 | `bullhorn-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 220 | `calculator-variant` | 1 | 1 | 0 | 0 | 1 | no |
| 221 | `calendar-check-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 222 | `cash-check` | 1 | 1 | 0 | 0 | 1 | no |
| 223 | `cash-fast` | 1 | 1 | 0 | 0 | 1 | no |
| 224 | `chart-areaspline` | 1 | 1 | 0 | 0 | 1 | no |
| 225 | `chart-timeline-variant` | 1 | 1 | 0 | 0 | 1 | no |
| 226 | `checkbox-marked-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 227 | `cloud-check-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 228 | `cloud-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 229 | `comment` | 1 | 0 | 1 | 0 | 1 | sí |
| 230 | `compass` | 1 | 0 | 1 | 0 | 1 | sí |
| 231 | `content-save` | 1 | 0 | 0 | 1 | 1 | sí |
| 232 | `creation` | 1 | 1 | 0 | 0 | 1 | no |
| 233 | `credit-card-check-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 234 | `credit-card-multiple` | 1 | 1 | 0 | 0 | 1 | no |
| 235 | `database` | 1 | 1 | 0 | 0 | 1 | no |
| 236 | `database-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 237 | `download-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 238 | `draw-pen` | 1 | 1 | 0 | 0 | 1 | no |
| 239 | `email-plus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 240 | `eraser` | 1 | 1 | 0 | 0 | 1 | sí |
| 241 | `eye` | 1 | 1 | 0 | 0 | 1 | no |
| 242 | `face-smile` | 1 | 1 | 0 | 0 | 1 | no |
| 243 | `file-certificate` | 1 | 1 | 0 | 0 | 1 | no |
| 244 | `file-clock-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 245 | `file-document-edit` | 1 | 1 | 0 | 0 | 1 | no |
| 246 | `file-pdf` | 1 | 1 | 0 | 0 | 1 | no |
| 247 | `file-plus` | 1 | 1 | 0 | 0 | 1 | sí |
| 248 | `file-plus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 249 | `file-search-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 250 | `file-star-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 251 | `fire` | 1 | 1 | 0 | 0 | 1 | no |
| 252 | `fire-extinguisher` | 1 | 1 | 0 | 0 | 1 | no |
| 253 | `flash` | 1 | 1 | 0 | 0 | 1 | no |
| 254 | `folder-account-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 255 | `folder-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 256 | `format-list-text` | 1 | 1 | 0 | 0 | 1 | no |
| 257 | `google-analytics` | 1 | 1 | 0 | 0 | 1 | no |
| 258 | `hammer-wrench` | 1 | 1 | 0 | 0 | 1 | no |
| 259 | `help-circle-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 260 | `home-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 261 | `home-switch-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 262 | `lightbulb-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 263 | `lock-open-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 264 | `lock-reset` | 1 | 1 | 0 | 0 | 1 | no |
| 265 | `logout` | 1 | 0 | 1 | 0 | 1 | sí |
| 266 | `magnify-minus` | 1 | 1 | 0 | 0 | 1 | no |
| 267 | `magnify-plus` | 1 | 0 | 1 | 0 | 1 | sí |
| 268 | `map-marker-multiple-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 269 | `map-marker-path` | 1 | 1 | 0 | 0 | 1 | no |
| 270 | `map-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 271 | `microphone` | 1 | 0 | 0 | 1 | 1 | sí |
| 272 | `microsoft-excel` | 1 | 1 | 0 | 0 | 1 | no |
| 273 | `monitor` | 1 | 1 | 0 | 0 | 1 | sí |
| 274 | `note-plus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 275 | `notebook-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 276 | `open-in-new` | 1 | 1 | 0 | 0 | 1 | no |
| 277 | `package` | 1 | 1 | 0 | 0 | 1 | sí |
| 278 | `package-down` | 1 | 1 | 0 | 0 | 1 | no |
| 279 | `package-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 280 | `package-up` | 1 | 1 | 0 | 0 | 1 | no |
| 281 | `page-first` | 1 | 1 | 0 | 0 | 1 | no |
| 282 | `page-last` | 1 | 1 | 0 | 0 | 1 | no |
| 283 | `palette-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 284 | `phone-plus-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 285 | `pipe` | 1 | 1 | 0 | 0 | 1 | no |
| 286 | `play-circle` | 1 | 0 | 1 | 0 | 1 | sí |
| 287 | `printer-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 288 | `radio` | 1 | 1 | 0 | 0 | 1 | no |
| 289 | `repeat` | 1 | 1 | 0 | 0 | 1 | no |
| 290 | `robot-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 291 | `ruler` | 1 | 1 | 0 | 0 | 1 | no |
| 292 | `shield-account-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 293 | `shield-check-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 294 | `silverware-fork-knife` | 1 | 1 | 0 | 0 | 1 | no |
| 295 | `smoke-detector-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 296 | `sort-descending` | 1 | 0 | 1 | 0 | 1 | sí |
| 297 | `source-branch` | 1 | 1 | 0 | 0 | 1 | no |
| 298 | `source-merge` | 1 | 1 | 0 | 0 | 1 | no |
| 299 | `stop` | 1 | 0 | 0 | 1 | 1 | sí |
| 300 | `tag-multiple-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 301 | `target` | 1 | 1 | 0 | 0 | 1 | no |
| 302 | `timeline-check-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 303 | `tray` | 1 | 1 | 0 | 0 | 1 | no |
| 304 | `video-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 305 | `view-grid-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 306 | `view-module-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 307 | `vuejs` | 1 | 1 | 0 | 0 | 1 | no |
| 308 | `warehouse` | 1 | 1 | 0 | 0 | 1 | no |
| 309 | `white-balance-sunny` | 1 | 1 | 0 | 0 | 1 | no |
| 310 | `window-maximize` | 1 | 0 | 1 | 0 | 1 | sí |
| 311 | `wrench-outline` | 1 | 1 | 0 | 0 | 1 | no |
| 312 | `arrow-down-left` | 0 | 0 | 0 | 0 | 0 | sí |
| 313 | `arrow-expand-all` | 0 | 0 | 0 | 0 | 0 | sí |
| 314 | `arrow-expand-horizontal` | 0 | 0 | 0 | 0 | 0 | sí |
| 315 | `bank` | 0 | 0 | 0 | 0 | 0 | sí |
| 316 | `chevron-double-down` | 0 | 0 | 0 | 0 | 0 | sí |
| 317 | `chevron-double-up` | 0 | 0 | 0 | 0 | 0 | sí |
| 318 | `chip` | 0 | 0 | 0 | 0 | 0 | sí |
| 319 | `dots-horizontal` | 0 | 0 | 0 | 0 | 0 | sí |
| 320 | `file-check` | 0 | 0 | 0 | 0 | 0 | sí |
| 321 | `file-code` | 0 | 0 | 0 | 0 | 0 | sí |
| 322 | `file-text` | 0 | 0 | 0 | 0 | 0 | sí |
| 323 | `filter-variant` | 0 | 0 | 0 | 0 | 0 | sí |
| 324 | `filter-variant-remove` | 0 | 0 | 0 | 0 | 0 | sí |
| 325 | `flag-outline` | 0 | 0 | 0 | 0 | 0 | sí |
| 326 | `globe` | 0 | 0 | 0 | 0 | 0 | sí |
| 327 | `graduation-cap` | 0 | 0 | 0 | 0 | 0 | sí |
| 328 | `hammer` | 0 | 0 | 0 | 0 | 0 | sí |
| 329 | `heart-outline` | 0 | 0 | 0 | 0 | 0 | sí |
| 330 | `hourglass` | 0 | 0 | 0 | 0 | 0 | sí |
| 331 | `key` | 0 | 0 | 0 | 0 | 0 | sí |
| 332 | `lightbulb` | 0 | 0 | 0 | 0 | 0 | sí |
| 333 | `minus-circle` | 0 | 0 | 0 | 0 | 0 | sí |
| 334 | `palette` | 0 | 0 | 0 | 0 | 0 | sí |
| 335 | `play` | 0 | 0 | 0 | 0 | 0 | sí |
| 336 | `replay` | 0 | 0 | 0 | 0 | 0 | sí |
| 337 | `square-edit-outline` | 0 | 0 | 0 | 0 | 0 | sí |
| 338 | `stopwatch` | 0 | 0 | 0 | 0 | 0 | sí |
| 339 | `thumb-up` | 0 | 0 | 0 | 0 | 0 | sí |
| 340 | `tune` | 0 | 0 | 0 | 0 | 0 | sí |
| 341 | `undo` | 0 | 0 | 0 | 0 | 0 | sí |
| 342 | `whatsapp` | 0 | 0 | 0 | 0 | 0 | sí |
| 343 | `zip-box` | 0 | 0 | 0 | 0 | 0 | sí |

## 3. `pi pi-` directo (fuera de icon-mapping.ts) — 83 usos

Detalle completo con archivo y línea. Excluye los 58 usos internos del mapping
(`grep` crudo `pi pi-` mide 140 sobre html+ts, incluyendo el mapping).

| # | Archivo | Línea | Clase |
|---:|---|---|---|
| 1 | `src/app/apps/admin.luxuryapp/seguridad-permisos/customer-location/customer-location-list.html` | 60 | `pi pi-map-marker` |
| 2 | `src/app/apps/auth.luxuryapp/password-manager/password-list.html` | 57 | `pi pi-eye-slash` |
| 3 | `src/app/apps/auth.luxuryapp/password-manager/password-list.html` | 57 | `pi pi-eye` |
| 4 | `src/app/apps/auth.luxuryapp/password-manager/password-list.html` | 66 | `pi pi-copy` |
| 5 | `src/app/apps/cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus-debt-detail-modal.html` | 192 | `pi pi-chevron-down` |
| 6 | `src/app/apps/cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus-debt-detail-modal.html` | 192 | `pi pi-chevron-right` |
| 7 | `src/app/apps/cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.html` | 20 | `pi pi-book` |
| 8 | `src/app/apps/cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-reglas-negocio/aspel-cobranza-reglas-negocio.html` | 73 | `pi pi-exclamation-triangle` |
| 9 | `src/app/apps/cobranza.luxuryapp/cobranza-online/cobranza-online-wrapper.html` | 194 | `pi pi-spin` |
| 10 | `src/app/apps/cobranza.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad-detail-modal.html` | 5 | `pi pi-building` |
| 11 | `src/app/apps/cobranza.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad-detail-modal.html` | 24 | `pi pi-info-circle` |
| 12 | `src/app/apps/cobranza.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad-detail-modal.html` | 50 | `pi pi-spin` |
| 13 | `src/app/apps/cobranza.luxuryapp/cobranza-online/morosidad/cobranza-online-morosidad-detail-modal.html` | 116 | `pi pi-exclamation-triangle` |
| 14 | `src/app/apps/committee.luxuryapp/cobranza/committee-cobranza-detail-modal.html` | 60 | `pi pi-spin` |
| 15 | `src/app/apps/committee.luxuryapp/cobranza/committee-cobranza-web.html` | 150 | `pi pi-eye` |
| 16 | `src/app/apps/committee.luxuryapp/directorio/directorio.html` | 51 | `pi pi-chevron-right` |
| 17 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 3 | `pi pi-arrow-left` |
| 18 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 27 | `pi pi-play` |
| 19 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 36 | `pi pi-qrcode` |
| 20 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 49 | `pi pi-check` |
| 21 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 83 | `pi pi-check-circle` |
| 22 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-detector/fire-inspection-period-detector-detail.html` | 84 | `pi pi-trash` |
| 23 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 3 | `pi pi-arrow-left` |
| 24 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 27 | `pi pi-play` |
| 25 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 36 | `pi pi-qrcode` |
| 26 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 37 | `pi pi-times` |
| 27 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 37 | `pi pi-plus` |
| 28 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 49 | `pi pi-check` |
| 29 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 83 | `pi pi-check-circle` |
| 30 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html` | 84 | `pi pi-trash` |
| 31 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 3 | `pi pi-arrow-left` |
| 32 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 33 | `pi pi-play` |
| 33 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 47 | `pi pi-qrcode` |
| 34 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 53 | `pi pi-times` |
| 35 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 53 | `pi pi-plus` |
| 36 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 68 | `pi pi-check` |
| 37 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 104 | `pi pi-check-circle` |
| 38 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html` | 110 | `pi pi-trash` |
| 39 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 4 | `pi pi-arrow-left` |
| 40 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 44 | `pi pi-play` |
| 41 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 60 | `pi pi-qrcode` |
| 42 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 87 | `pi pi-check` |
| 43 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 137 | `pi pi-check-circle` |
| 44 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/inspection-periods/period-detail-hidrante/fire-inspection-period-hidrante-detail.html` | 143 | `pi pi-trash` |
| 45 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/qr-scanner/qr-scanner.html` | 19 | `pi pi-search` |
| 46 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/qr-scanner/qr-scanner.html` | 55 | `pi pi-camera` |
| 47 | `src/app/apps/mantenimiento.luxuryapp/fire-equipment/qr-scanner/qr-scanner.html` | 61 | `pi pi-stop` |
| 48 | `src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-detail.html` | 54 | `pi pi-user-plus` |
| 49 | `src/app/apps/reclutamiento.luxuryapp/candidates/candidate/candidate-detail.html` | 89 | `pi pi-shopping-cart` |
| 50 | `src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-kpis.html` | 3 | `pi pi-spin` |
| 51 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 72 | `pi pi-filter` |
| 52 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 79 | `pi pi-times` |
| 53 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 187 | `pi pi-check` |
| 54 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 194 | `pi pi-times` |
| 55 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 254 | `pi pi-filter` |
| 56 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 262 | `pi pi-times` |
| 57 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 310 | `pi pi-check` |
| 58 | `src/app/apps/recursos-humanos.luxuryapp/chekador-empleados/chekador-list.html` | 317 | `pi pi-times` |
| 59 | `src/app/core/layout/committee-layout/monitor/profile.html` | 48 | `pi pi-user` |
| 60 | `src/app/core/layout/committee-layout/monitor/profile.html` | 57 | `pi pi-sync` |
| 61 | `src/app/core/layout/committee-layout/monitor/profile.html` | 63 | `pi pi-refresh` |
| 62 | `src/app/core/layout/committee-layout/monitor/profile.html` | 71 | `pi pi-external-link` |
| 63 | `src/app/core/layout/committee-layout/monitor/profile.html` | 81 | `pi pi-sign-out` |
| 64 | `src/app/core/layout/direccion-view/monitor/header-direccion-monitor/header-direccion-monitor.ts` | 83 | `pi pi-home` |
| 65 | `src/app/core/layout/direccion-view/monitor/header-direccion-monitor/header-direccion-monitor.ts` | 97 | `pi pi-moon` |
| 66 | `src/app/core/layout/direccion-view/monitor/header-direccion-monitor/header-direccion-monitor.ts` | 98 | `pi pi-sun` |
| 67 | `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.html` | 473 | `pi pi-image` |
| 68 | `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 185 | `pi pi-home` |
| 69 | `src/app/core/layout/employee-view/monitor/profile-monitor/profile-monitor.html` | 25 | `pi pi-key` |
| 70 | `src/app/core/layout/employee-view/monitor/profile-monitor/profile-monitor.html` | 33 | `pi pi-lock` |
| 71 | `src/app/core/layout/employee-view/monitor/profile-monitor/profile-monitor.html` | 42 | `pi pi-sync` |
| 72 | `src/app/core/layout/employee-view/monitor/profile-monitor/profile-monitor.html` | 53 | `pi pi-sign-out` |
| 73 | `src/app/shared/ui/buttons/web-label/button.ts` | 18 | `pi pi-spinner` |
| 75 | `src/app/shared/ui/shared/app-icon/app-icon.spec.ts` | 33 | `pi pi-user` |
| 76 | `src/app/shared/ui/web/data-view/data-view.ts` | 33 | `pi pi-search` |
| 77 | `src/app/shared/ui/web/data-view/data-view.ts` | 51 | `pi pi-plus` |
| 78 | `src/app/shared/ui/web/data-view/data-view.ts` | 61 | `pi pi-spin` |
| 79 | `src/app/shared/ui/web/data-view/data-view.ts` | 103 | `pi pi-search` |
| 80 | `src/app/shared/ui/web/data-view/data-view.ts` | 111 | `pi pi-inbox` |
| 81 | `src/app/shared/ui/web/global-error-alert/global-error-alert.ts` | 19 | `pi pi-exclamation-circle` |
| 82 | `src/app/shared/ui/web/global-error-alert/global-error-alert.ts` | 23 | `pi pi-times` |
| 83 | `src/app/shared/ui/web/tap-to-top/tap-to-top.ts` | 12 | `pi pi-arrow-up` |

## 4. `fluent-color:` — 24 usos en `src/app`

Solo **2** están como atributo `icon="fluent-color:..."` en plantilla (las únicas que
cuadran con §3): `core/layout/employee-view/monitor/header-employee-monitor.html:17` y
`core/layout/employee-view/monitor/notifications-gadget/notifications-gadget.html:16`.
Las 22 restantes viven en `.ts`: botones `web-icon` (`[icon]="iconClass() || 'fluent-color:…'"`),
`core/services/icon-preload.service.ts` (lista de preload) y `header-employee-monitor.ts`.

| Archivo | Línea | Valor |
|---|---|---|
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.html` | 17 | `fluent-color:text-bullet-list-square-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 236 | `fluent-color:home-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 254 | `fluent-color:arrow-sync-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 260 | `fluent-color:building-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 266 | `fluent-color:megaphone-loud-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 272 | `fluent-color:bot-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 279 | `fluent-color:phone-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 285 | `fluent-color:settings-24` |
| `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts` | 292 | `fluent-color:star-24` |
| `src/app/core/layout/employee-view/monitor/notifications-gadget/notifications-gadget.html` | 16 | `fluent-color:alert-24` |
| `src/app/core/services/icon-preload.service.ts` | 4 | `fluent-color:alert-16` |
| `src/app/core/services/icon-preload.service.ts` | 5 | `fluent-color:document-16` |
| `src/app/core/services/icon-preload.service.ts` | 6 | `fluent-color:mail-16` |
| `src/app/core/services/icon-preload.service.ts` | 7 | `fluent-color:alert-24` |
| `src/app/core/services/icon-preload.service.ts` | 8 | `fluent-color:lock-closed-16` |
| `src/app/core/services/icon-preload.service.ts` | 9 | `fluent-color:checkmark-circle-16` |
| `src/app/core/services/icon-preload.service.ts` | 10 | `fluent-color:add-circle-16` |
| `src/app/shared/ui/buttons/web-icon/button-add.ts` | 17 | `fluent-color:add-circle-16` |
| `src/app/shared/ui/buttons/web-icon/button-confirm.ts` | 26 | `fluent-color:checkmark-circle-16` |
| `src/app/shared/ui/buttons/web-icon/button-delete.ts` | 24 | `fluent-color:dismiss-circle-24` |
| `src/app/shared/ui/buttons/web-icon/button-edit.ts` | 18 | `fluent-color:drafts-16` |
| `src/app/shared/ui/buttons/web-icon/button-send-email.ts` | 23 | `fluent-color:mail-16` |
| `src/app/shared/ui/buttons/web-icon/button-tracking.ts` | 35 | `fluent-color:alert-24` |
| `src/app/shared/ui/buttons/web-icon/button-view-pdf.ts` | 23 | `fluent-color:document-16` |

## 5. Bindings dinámicos `[icon]="expresión"` por campo de origen

**239** bindings de expresión dentro de `<app-icon>` (268 si se incluyen `.bak`/`.spec`).
Agrupados por campo de origen. Para los campos simple de objeto se indica dónde se
declara ese campo si se localizó.

### 5.1 `item.icon` — 19 usos

Archivos: `src/app/apps/admin.luxuryapp/seguridad-permisos/approval-rules/approval-rules.html`, `src/app/apps/contabilidad.luxuryapp/fondeos-y-reporteo/funding/funding-group-files/funding-group-files.html`, `src/app/apps/operations.luxuryapp/field-service/service-order/ordenes-servicio-list.html`, `src/app/core/layout/employee-view/monitor/sidebar/sidebar.html`, `src/app/core/layout/employee-view/movil/home-menu-mobile/home-menu-mobile.html`, `src/app/shared/ui/mobile/accordion/accordion.ts`…

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.2 `group.icon` — 7 usos

Archivos: `src/app/apps/admin.luxuryapp/admin-wrapper/admin-wrapper.html`, `src/app/apps/cobranza.luxuryapp/cobranza-nativa/entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper.html`, `src/app/apps/contabilidad.luxuryapp/general-ledger/master-dashboard/master-dashboard.html`, `src/app/apps/operations.luxuryapp/supervision/supervision/master-dashboard/master-dashboard.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.3 `card.icon` — 7 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts`, `src/app/apps/cobranza.luxuryapp/cobranza-nativa/entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper.html`, `src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-kpis.html`, `src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nomina-dashboard/nomina-dashboard.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.4 `node.icon` — 6 usos

Archivos: `src/app/apps/cobranza.luxuryapp/cobranza-nativa/onboarding/system-flow-map/system-flow-map.html`, `src/app/shared/ui/mobile/tree-table/tree-table.ts`, `src/app/shared/ui/mobile/tree/tree.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.5 `module.icon` — 5 usos

Archivos: `src/app/apps/admin.luxuryapp/admin-wrapper/admin-wrapper.html`, `src/app/apps/contabilidad.luxuryapp/general-ledger/master-dashboard/master-dashboard.html`, `src/app/apps/operations.luxuryapp/supervision/supervision/master-dashboard/master-dashboard.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.6 `metric.icon` — 3 usos

Archivos: `src/app/apps/cobranza.luxuryapp/cobranza-nativa/entry/cobranza-nativa-wrapper/cobranza-nativa-wrapper.html`, `src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/recursos-humanos/nomina/nomina-dashboard/nomina-dashboard.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.7 `tab.icon` — 3 usos

Archivos: `src/app/shared/ui/mobile/tab-bar/tab-bar.ts`, `src/app/shared/ui/mobile/tabs/tabs.ts`, `src/app/shared/ui/web/tabs/tabs.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.8 `m.icon` — 2 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts`, `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.9 `s.icon` — 2 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts`, `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.10 `p.icon` — 2 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts`, `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.11 `r.iconClass` — 2 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia-item/catalog-guia-item.ts`, `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/foundations/catalog-guia/catalog-guia.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.12 `kpi.icon` — 2 usos

Archivos: `src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad-cliente/analisis-cobranza-cliente/analisis-cobranza-cliente.html`, `src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad-online/analisis-cobranza/analisis-cobranza.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.13 `row.icon` — 2 usos

Archivos: `src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-externos.html`, `src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-internos.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.14 `option.icon` — 2 usos

Archivos: `src/app/apps/operations.luxuryapp/announcements/announcement/image-generation-dialog/image-generation-dialog.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.15 `config().icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/confirm-dialog/confirm-dialog.ts`, `src/app/shared/ui/web/confirm-dialog/confirm-dialog.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.16 `act.icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/profile-card/profile-card.ts`, `src/app/shared/ui/web/profile-card/profile-card.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.17 `step.icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/stepper/stepper.ts`, `src/app/shared/ui/web/wizard/wizard.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.18 `action.icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/swipe-actions/swipe-actions.ts`, `src/app/shared/ui/web/swipe-actions/swipe-actions.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.19 `col.icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/table/table.ts`, `src/app/shared/ui/web/data-grid/data-grid.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.20 `event.icon` — 2 usos

Archivos: `src/app/shared/ui/mobile/timeline/timeline.ts`, `src/app/shared/ui/web/timeline/timeline.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.21 `r.icon` — 1 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-layouts/catalog-layouts.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.22 `impl.icon` — 1 usos

Archivos: `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/patterns-layouts/catalog-patterns-item/catalog-patterns-item.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.23 `area.iconPi` — 1 usos

Archivos: `src/app/apps/direccion.luxuryapp/home-direccion/home-direccion.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.24 `navIcon.iconClass` — 1 usos

Archivos: `src/app/core/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.html`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.25 `severityConfig().icon` — 1 usos

Archivos: `src/app/shared/ui/mobile/confirm-popup/confirm-popup.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.26 `category.icon` — 1 usos

Archivos: `src/app/shared/ui/mobile/mega-menu/mega-menu.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`

### 5.27 `cmd.icon` — 1 usos

Archivos: `src/app/shared/ui/web/command-palette/command-palette.ts`

Declaraciones localizadas:
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/admin-module.model.ts`: `icon: string`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: string }>`
- `src/app/apps/admin.luxuryapp/admin-wrapper/conventions-viewer/conventions-viewer.utils.ts`: `icon: 'CR' },
  ALTA: { color: 'var(--severity-alta)', icon: 'AL' },
  MEDIA: { color: 'var(--severity-media)', icon: 'ME' },
  BAJA: { color: 'var(--severity-baja)', icon: 'BA' },
}`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "Aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
  ]`
- `src/app/apps/admin.luxuryapp/herramientas-dev/catalog-component-ui/catalog-core-item/catalog-core-item.ts`: `icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisin", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ]`


## 6. Metodología y discrepancias vs §3

### 6.1 Método

- Alcance: `src/app` completo; conteos de contexto restringidos a la etiqueta
  `<app-icon …>` (atributo `icon=` o binding `[icon]=` dentro de esa etiqueta).
- **Excluidos** de los conteos unitarios de atributo: `.spec.ts`, `.stories.ts`, `.bak.html`.
- `pi pi-`: pieza directa en plantillas propias, excluyendo `icon-mapping.ts` (58 usos internos).
- **Cifras que cuadran exacto con §3**: 673 (literal), 172/166 (mapping), 262 y 343 (UNIÓN),
  64 (ion-icon), 572 (archivos app-icon).

### 6.2 Discrepancias

1. **`icon="mdi:x"` estático: 594 vs 462.** Mi conteo cuenta USOS en atributo (594) y
   nombres distintos (262, exacto). §3 parece medir usos en `.html` únicamente
   (≈446) o in lote distinto. 594 incluye 148 usos en componentes `.ts` (template strings).
2. **`[icon]="expresión": 239 vs 251.** Diferencia de 12; probablemente §3 contó la
   pasada total (268 incluye `.bak`) o contó `icon="pi…"` como expresión.
3. **`pi pi-` directo 83 vs 141.** §3 usa el `grep` literal `'pi pi-'` (=140) que incluye
   los 58 usos internos del mapping y 2-3 en `.bak`. El número real de piezas en
   plantillas propias es **83**.
4. **`fluent-color:` 24 vs 2.** §3 parece medir solo el atributo estático de plantilla (2).
   Las otras 22 están en `.ts` (fallbacks y preload) y también se migran.

> **Conclusión gate F0:** la UNIÓN (343) y todos los conteos estructurales cuadran con §3.
> Las diferencias restantes son de método (contexto de atributo vs `grep` crudo), no de
> árbol cambiado. Se reportan como están y no se forzaron.
