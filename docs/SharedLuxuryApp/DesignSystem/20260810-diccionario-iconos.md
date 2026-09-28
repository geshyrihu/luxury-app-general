# Diccionario de traducción de iconos — LuxuryApp (Fase 1, con F1-bis) 

> Producido el 2026-08-11 · Solo lectura · 535 nombres `mdi:` únicos con su equivalente
> `material-symbols-light` **verificado contra el índice real del set** (15,650 iconos).

## 0. Fase 1-bis — desambiguación de roles

Bloqueador resuelto: **117 grupos tenían el rol duplicado** (289 mdi en conflicto) porque el rol
derivaba del icono DESTINO (`table-view` → `TableView`). Se renombró cada rol por el **concepto de
origen** (PascalCase del nombre `mdi:` sin prefijo), garantizando claves únicas del objeto `AppIcon`.

Resultado: **535 roles únicos, 0 duplicados**.

- **Fusionadas deliberadamente: 0.** No se fusionó ninguna entrada. Motivo: en la Fase 2 el catálogo
  debe contener los **535 valores `mdi:` actuales** para que ningún literal existente quede fuera del
  tipo derivado; fusionar dos mdi en una sola clave excluiría un valor del tipo y rompería la compilación.
  Ejemplos de grupos con mismo glifo material que se conservan desambiguados:
  `Whatsapp → material-symbols-light:chat` y `Chat → material-symbols-light:chat`;
  `file-excel → FileExcel` · `microsoft-excel → Excel` · `table-off → TableHidden` ·
  `calendar-remove → CalendarRemove` · `table → Table` · `table-large → TableLarge`.
- **Desambiguadas: 289** mdi repartidos en 117 grupos. Alias semánticos aplicados para legibilidad
  (p. ej. `magnify → Search`, `account → Person`, `cog → Gear`, `server → ServerDns`, `building → Building`),
  todos sin colisión.

### Fórmula del rol
> `rol = PascalCase(mdi-sin-prefijo)` con alias semántico curado cuando no colisiona. Los VALORES
> `material-symbols-light:*` no cambiaron (ya aprobados); esta fase solo renombró claves.

## Resumen de confianza

| Confianza | Filas | Qué significa |
|---|---|---|
| `SIN EQUIVALENTE` | 1 | Falso positivo del inventario (comentario), no es un icono |
| `BAJA` | 68 | Concepto material distinto o de significado incierto: **el humano debe mirarlas** |
| `MEDIA` | 338 | El concepto existe y el nombre cambia; elegí entre variantes |
| `ALTA` | 128 | Mismo concepto, nombre idéntico o canónico evidente |

**Todas las `BAJA` y `SIN EQUIVALENTE` están al inicio del listado.**

## 1. SIN EQUIVALENTE — falso positivo detectado

| Rol | mdi actual | propuesto material-symbols-light | usos | confianza |
|---|---|---|---|---|
| Prefijo | `mdi:prefijo` | *(no aplica — comentario)* | 1 | SIN EQUIVALENTE |

Comentario en `src/app/shared/utils/icon-mapping.ts:204`. Se excluye del catálogo en Fase 2.

## 2. Confianza BAJA — requieren revisión humana

| Rol | mdi actual | propuesto material-symbols-light | usos | confianza |
|---|---|---|---|---|
| FileExcel | `mdi:file-excel` | `material-symbols-light:table-view` | 26 | BAJA |
| CardAccountDetails | `mdi:card-account-details` | `material-symbols-light:contactless` | 11 | BAJA |
| FileEdit | `mdi:file-edit` | `material-symbols-light:note-alt` | 11 | BAJA |
| FormatListChecks | `mdi:format-list-checks` | `material-symbols-light:fact-check` | 9 | BAJA |
| AccountEdit | `mdi:account-edit` | `material-symbols-light:manage-accounts` | 8 | BAJA |
| CalendarRemove | `mdi:calendar-remove` | `material-symbols-light:event-busy` | 8 | BAJA |
| FileSign | `mdi:file-sign` | `material-symbols-light:edit-note` | 6 | BAJA |
| Presentation | `mdi:presentation` | `material-symbols-light:co-present` | 4 | BAJA |
| RobotOutline | `mdi:robot-outline` | `material-symbols-light:smart-toy-outline` | 4 | BAJA |
| ScaleBalance | `mdi:scale-balance` | `material-symbols-light:balance` | 4 | BAJA |
| Chip | `mdi:chip` | `material-symbols-light:memory` | 3 | BAJA |
| Gift | `mdi:gift` | `material-symbols-light:redeem` | 3 | BAJA |
| PageLayoutBody | `mdi:page-layout-body` | `material-symbols-light:web` | 3 | BAJA |
| ShapeOutline | `mdi:shape-outline` | `material-symbols-light:category` | 3 | BAJA |
| TableEyeOff | `mdi:table-eye-off` | `material-symbols-light:table` | 3 | BAJA |
| TransitConnectionVariant | `mdi:transit-connection-variant` | `material-symbols-light:route` | 3 | BAJA |
| Whatsapp | `mdi:whatsapp` | `material-symbols-light:chat` | 3 | BAJA |
| WindowMaximize | `mdi:window-maximize` | `material-symbols-light:fullscreen` | 3 | BAJA |
| BlockHelper | `mdi:block-helper` | `material-symbols-light:block` | 2 | BAJA |
| ButtonCursor | `mdi:button-cursor` | `material-symbols-light:touch-app` | 2 | BAJA |
| CardAccountDetailsOutline | `mdi:card-account-details-outline` | `material-symbols-light:contactless-outline` | 2 | BAJA |
| CogSync | `mdi:cog-sync` | `material-symbols-light:settings-overscan` | 2 | BAJA |
| DatabaseExport | `mdi:database-export` | `material-symbols-light:database-upload` | 2 | BAJA |
| Excel | `mdi:microsoft-excel` | `material-symbols-light:table-view` | 2 | BAJA |
| MinusCircle | `mdi:minus-circle` | `material-symbols-light:do-not-disturb-on` | 2 | BAJA |
| MinusCircleOutline | `mdi:minus-circle-outline` | `material-symbols-light:do-not-disturb-on` | 2 | BAJA |
| Pipe | `mdi:pipe` | `material-symbols-light:precision-manufacturing` | 2 | BAJA |
| PresentationPlay | `mdi:presentation-play` | `material-symbols-light:play-lesson` | 2 | BAJA |
| SortDescending | `mdi:sort-descending` | `material-symbols-light:arrow-downward` | 2 | BAJA |
| TableHidden | `mdi:table-off` | `material-symbols-light:table-view` | 2 | BAJA |
| Tools | `mdi:tools` | `material-symbols-light:construction` | 2 | BAJA |
| AccountCog | `mdi:account-cog` | `material-symbols-light:manage-accounts` | 1 | BAJA |
| At | `mdi:at` | `material-symbols-light:alternate-email` | 1 | BAJA |
| Cards | `mdi:cards` | `material-symbols-light:style` | 1 | BAJA |
| CommentOffOutline | `mdi:comment-off-outline` | `material-symbols-light:forum-outline` | 1 | BAJA |
| Creation | `mdi:creation` | `material-symbols-light:add` | 1 | BAJA |
| CrosshairsGps | `mdi:crosshairs-gps` | `material-symbols-light:track-changes` | 1 | BAJA |
| Cube | `mdi:cube` | `material-symbols-light:crop-rotate` | 1 | BAJA |
| DockWindow | `mdi:dock-window` | `material-symbols-light:view-sidebar` | 1 | BAJA |
| FilePowerpoint | `mdi:file-powerpoint` | `material-symbols-light:slideshow` | 1 | BAJA |
| FileWord | `mdi:file-word` | `material-symbols-light:description` | 1 | BAJA |
| FormatLetterCase | `mdi:format-letter-case` | `material-symbols-light:text-fields` | 1 | BAJA |
| GestureTap | `mdi:gesture-tap` | `material-symbols-light:touch-app` | 1 | BAJA |
| Hammer | `mdi:hammer` | `material-symbols-light:construction` | 1 | BAJA |
| HomeAlert | `mdi:home-alert` | `material-symbols-light:add-home` | 1 | BAJA |
| HomeSwitchOutline | `mdi:home-switch-outline` | `material-symbols-light:home` | 1 | BAJA |
| Numeric | `mdi:numeric` | `material-symbols-light:pin` | 1 | BAJA |
| Numeric1 | `mdi:numeric-1` | `material-symbols-light:pin` | 1 | BAJA |
| PackageCheck | `mdi:package-check` | `material-symbols-light:check-circle` | 1 | BAJA |
| PencilBoxMultiple | `mdi:pencil-box-multiple` | `material-symbols-light:edit-note` | 1 | BAJA |
| ProgressCheck | `mdi:progress-check` | `material-symbols-light:task-alt` | 1 | BAJA |
| ProgressClock | `mdi:progress-clock` | `material-symbols-light:pending` | 1 | BAJA |
| QrcodePlus | `mdi:qrcode-plus` | `material-symbols-light:qr-code-2-add` | 1 | BAJA |
| Ruler | `mdi:ruler` | `material-symbols-light:straighten` | 1 | BAJA |
| ShieldAccountOutline | `mdi:shield-account-outline` | `material-symbols-light:shield-person` | 1 | BAJA |
| ShieldLock | `mdi:shield-lock` | `material-symbols-light:lock-outline` | 1 | BAJA |
| SmokeDetectorOutline | `mdi:smoke-detector-outline` | `material-symbols-light:detector-alarm` | 1 | BAJA |
| SourceBranch | `mdi:source-branch` | `material-symbols-light:call-split` | 1 | BAJA |
| SourceBranchCheck | `mdi:source-branch-check` | `material-symbols-light:call-split` | 1 | BAJA |
| TableEdit | `mdi:table-edit` | `material-symbols-light:edit-note` | 1 | BAJA |
| Target | `mdi:target` | `material-symbols-light:adjust` | 1 | BAJA |
| TargetAccount | `mdi:target-account` | `material-symbols-light:track-changes` | 1 | BAJA |
| ThemeLightDark | `mdi:theme-light-dark` | `material-symbols-light:brightness-4` | 1 | BAJA |
| Toolbox | `mdi:toolbox` | `material-symbols-light:home-repair-service` | 1 | BAJA |
| ToolboxOutline | `mdi:toolbox-outline` | `material-symbols-light:home-repair-service` | 1 | BAJA |
| Tray | `mdi:tray` | `material-symbols-light:move-to-inbox` | 1 | BAJA |
| Vuejs | `mdi:vuejs` | `material-symbols-light:code` | 1 | BAJA |
| ZipBox | `mdi:zip-box` | `material-symbols-light:folder-zip` | 1 | BAJA |

## 3. Confianza MEDIA

| Rol | mdi actual | propuesto material-symbols-light | usos | confianza |
|---|---|---|---|---|
| Loading | `mdi:loading` | `material-symbols-light:progress-activity` | 88 | MEDIA |
| FilePdfBox | `mdi:file-pdf-box` | `material-symbols-light:picture-as-pdf` | 57 | MEDIA |
| Calendar | `mdi:calendar` | `material-symbols-light:calendar-today` | 55 | MEDIA |
| FileDocumentOutline | `mdi:file-document-outline` | `material-symbols-light:description` | 45 | MEDIA |
| ClockOutline | `mdi:clock-outline` | `material-symbols-light:schedule` | 40 | MEDIA |
| AccountGroup | `mdi:account-group` | `material-symbols-light:group` | 39 | MEDIA |
| EmailOutline | `mdi:email-outline` | `material-symbols-light:mail-outline` | 39 | MEDIA |
| Information | `mdi:information` | `material-symbols-light:info` | 39 | MEDIA |
| EyeOutline | `mdi:eye-outline` | `material-symbols-light:visibility-outline` | 38 | MEDIA |
| Briefcase | `mdi:briefcase` | `material-symbols-light:work` | 25 | MEDIA |
| AlertCircleOutline | `mdi:alert-circle-outline` | `material-symbols-light:error-outline` | 24 | MEDIA |
| Sitemap | `mdi:sitemap` | `material-symbols-light:account-tree` | 22 | MEDIA |
| AccountPlus | `mdi:account-plus` | `material-symbols-light:person-add` | 18 | MEDIA |
| CommentMultiple | `mdi:comment-multiple` | `material-symbols-light:forum` | 17 | MEDIA |
| LightningBolt | `mdi:lightning-bolt` | `material-symbols-light:bolt` | 16 | MEDIA |
| Camera | `mdi:camera` | `material-symbols-light:photo-camera` | 15 | MEDIA |
| ClipboardText | `mdi:clipboard-text` | `material-symbols-light:article` | 15 | MEDIA |
| AccountGroupOutline | `mdi:account-group-outline` | `material-symbols-light:group-outline` | 14 | MEDIA |
| CheckboxMarked | `mdi:checkbox-marked` | `material-symbols-light:check-box` | 14 | MEDIA |
| Grid | `mdi:grid` | `material-symbols-light:grid-view` | 14 | MEDIA |
| Inbox | `mdi:inbox` | `material-symbols-light:move-to-inbox` | 14 | MEDIA |
| CurrencyUsd | `mdi:currency-usd` | `material-symbols-light:attach-money` | 13 | MEDIA |
| Shield | `mdi:shield` | `material-symbols-light:security` | 13 | MEDIA |
| HelpCircle | `mdi:help-circle` | `material-symbols-light:help` | 12 | MEDIA |
| InformationOutline | `mdi:information-outline` | `material-symbols-light:info` | 12 | MEDIA |
| Printer | `mdi:printer` | `material-symbols-light:print` | 12 | MEDIA |
| Qrcode | `mdi:qrcode` | `material-symbols-light:qr-code` | 12 | MEDIA |
| Ban | `mdi:ban` | `material-symbols-light:block` | 11 | MEDIA |
| ExternalLink | `mdi:external-link` | `material-symbols-light:open-in-new` | 11 | MEDIA |
| ImageMultiple | `mdi:image-multiple` | `material-symbols-light:photo` | 11 | MEDIA |
| MapMarker | `mdi:map-marker` | `material-symbols-light:location-on` | 11 | MEDIA |
| Tag | `mdi:tag` | `material-symbols-light:label` | 11 | MEDIA |
| VolumeHigh | `mdi:volume-high` | `material-symbols-light:volume-up` | 11 | MEDIA |
| Bell | `mdi:bell` | `material-symbols-light:notifications` | 10 | MEDIA |
| Calculator | `mdi:calculator` | `material-symbols-light:calculate` | 10 | MEDIA |
| CalendarPlus | `mdi:calendar-plus` | `material-symbols-light:event-note` | 10 | MEDIA |
| Image | `mdi:image` | `material-symbols-light:photo` | 10 | MEDIA |
| PlusCircle | `mdi:plus-circle` | `material-symbols-light:add-circle` | 10 | MEDIA |
| BellOutline | `mdi:bell-outline` | `material-symbols-light:notifications-outline` | 9 | MEDIA |
| BriefcaseOutline | `mdi:briefcase-outline` | `material-symbols-light:work-outline` | 9 | MEDIA |
| CashPlus | `mdi:cash-plus` | `material-symbols-light:add-card` | 9 | MEDIA |
| DotsVertical | `mdi:dots-vertical` | `material-symbols-light:more-vert` | 9 | MEDIA |
| HomeCityOutline | `mdi:home-city-outline` | `material-symbols-light:location-city` | 9 | MEDIA |
| OfficeBuildingOutline | `mdi:office-building-outline` | `material-symbols-light:apartment` | 9 | MEDIA |
| PhoneOutline | `mdi:phone-outline` | `material-symbols-light:call-outline` | 9 | MEDIA |
| WeatherSunny | `mdi:weather-sunny` | `material-symbols-light:sunny` | 9 | MEDIA |
| Dollar | `mdi:dollar` | `material-symbols-light:attach-money` | 8 | MEDIA |
| Paperclip | `mdi:paperclip` | `material-symbols-light:attach-file` | 8 | MEDIA |
| Play | `mdi:play` | `material-symbols-light:play-arrow` | 8 | MEDIA |
| ServerDns | `mdi:server` | `material-symbols-light:dns` | 8 | MEDIA |
| Shopping | `mdi:shopping` | `material-symbols-light:shopping-bag` | 8 | MEDIA |
| Wrench | `mdi:wrench` | `material-symbols-light:build` | 8 | MEDIA |
| ArrowUpRight | `mdi:arrow-up-right` | `material-symbols-light:north-east` | 7 | MEDIA |
| CalendarBlank | `mdi:calendar-blank` | `material-symbols-light:event` | 7 | MEDIA |
| CashMultiple | `mdi:cash-multiple` | `material-symbols-light:payments` | 7 | MEDIA |
| Minus | `mdi:minus` | `material-symbols-light:remove` | 7 | MEDIA |
| PencilOutline | `mdi:pencil-outline` | `material-symbols-light:edit-outline` | 7 | MEDIA |
| Pound | `mdi:pound` | `material-symbols-light:currency-pound` | 7 | MEDIA |
| TicketOutline | `mdi:ticket-outline` | `material-symbols-light:confirmation-number` | 7 | MEDIA |
| AccountMinus | `mdi:account-minus` | `material-symbols-light:person-remove` | 6 | MEDIA |
| Bank | `mdi:bank` | `material-symbols-light:account-balance` | 6 | MEDIA |
| CalendarCheck | `mdi:calendar-check` | `material-symbols-light:event-available` | 6 | MEDIA |
| Cart | `mdi:cart` | `material-symbols-light:shopping-cart` | 6 | MEDIA |
| ClipboardTextOutline | `mdi:clipboard-text-outline` | `material-symbols-light:article-outline` | 6 | MEDIA |
| AlertOutline | `mdi:alert-outline` | `material-symbols-light:warning-outline` | 5 | MEDIA |
| Cellphone | `mdi:cellphone` | `material-symbols-light:devices-other` | 5 | MEDIA |
| CogOutline | `mdi:cog-outline` | `material-symbols-light:settings-outline` | 5 | MEDIA |
| Email | `mdi:email` | `material-symbols-light:mail` | 5 | MEDIA |
| HeartOutline | `mdi:heart-outline` | `material-symbols-light:favorite-outline` | 5 | MEDIA |
| Monitor | `mdi:monitor` | `material-symbols-light:desktop-windows` | 5 | MEDIA |
| ShieldCheck | `mdi:shield-check` | `material-symbols-light:verified` | 5 | MEDIA |
| TrashCan | `mdi:trash-can` | `material-symbols-light:delete` | 5 | MEDIA |
| ViewDashboard | `mdi:view-dashboard` | `material-symbols-light:dashboard` | 5 | MEDIA |
| WalletOutline | `mdi:wallet-outline` | `material-symbols-light:wallet` | 5 | MEDIA |
| WeatherNight | `mdi:weather-night` | `material-symbols-light:nightlight` | 5 | MEDIA |
| AccountOutline | `mdi:account-outline` | `material-symbols-light:person-outline` | 4 | MEDIA |
| BankOutline | `mdi:bank-outline` | `material-symbols-light:account-balance-outline` | 4 | MEDIA |
| BookOpenPageVariant | `mdi:book-open-page-variant` | `material-symbols-light:menu-book` | 4 | MEDIA |
| CalendarMinus | `mdi:calendar-minus` | `material-symbols-light:event-busy` | 4 | MEDIA |
| CalendarPlusOutline | `mdi:calendar-plus-outline` | `material-symbols-light:event-note` | 4 | MEDIA |
| CartOutline | `mdi:cart-outline` | `material-symbols-light:shopping-cart-outline` | 4 | MEDIA |
| Cash | `mdi:cash` | `material-symbols-light:paid` | 4 | MEDIA |
| CodeTags | `mdi:code-tags` | `material-symbols-light:code` | 4 | MEDIA |
| Compass | `mdi:compass` | `material-symbols-light:explore` | 4 | MEDIA |
| EyeOff | `mdi:eye-off` | `material-symbols-light:visibility-off` | 4 | MEDIA |
| EyeOffOutline | `mdi:eye-off-outline` | `material-symbols-light:visibility-off` | 4 | MEDIA |
| FileCheck | `mdi:file-check` | `material-symbols-light:fact-check` | 4 | MEDIA |
| FileDocument | `mdi:file-document` | `material-symbols-light:description` | 4 | MEDIA |
| FileDocumentEdit | `mdi:file-document-edit` | `material-symbols-light:note-alt` | 4 | MEDIA |
| Heart | `mdi:heart` | `material-symbols-light:favorite` | 4 | MEDIA |
| InboxOutline | `mdi:inbox-outline` | `material-symbols-light:move-to-inbox-outline` | 4 | MEDIA |
| Microphone | `mdi:microphone` | `material-symbols-light:mic` | 4 | MEDIA |
| PlusCircleOutline | `mdi:plus-circle-outline` | `material-symbols-light:add-circle-outline` | 4 | MEDIA |
| PrinterOutline | `mdi:printer-outline` | `material-symbols-light:print-outline` | 4 | MEDIA |
| TicketConfirmation | `mdi:ticket-confirmation` | `material-symbols-light:confirmation-number` | 4 | MEDIA |
| TrashCanOutline | `mdi:trash-can-outline` | `material-symbols-light:delete-outline` | 4 | MEDIA |
| Video | `mdi:video` | `material-symbols-light:videocam` | 4 | MEDIA |
| ViewDashboardOutline | `mdi:view-dashboard-outline` | `material-symbols-light:dashboard-outline` | 4 | MEDIA |
| AccountTie | `mdi:account-tie` | `material-symbols-light:badge` | 3 | MEDIA |
| ArrowDownBold | `mdi:arrow-down-bold` | `material-symbols-light:keyboard-double-arrow-down` | 3 | MEDIA |
| ArrowExpandAll | `mdi:arrow-expand-all` | `material-symbols-light:open-in-full` | 3 | MEDIA |
| ArrowRightThin | `mdi:arrow-right-thin` | `material-symbols-light:arrow-forward` | 3 | MEDIA |
| BarcodeScan | `mdi:barcode-scan` | `material-symbols-light:barcode-scanner` | 3 | MEDIA |
| BellOffOutline | `mdi:bell-off-outline` | `material-symbols-light:notifications-off-outline` | 3 | MEDIA |
| BookOpenOutline | `mdi:book-open-outline` | `material-symbols-light:menu-book-outline` | 3 | MEDIA |
| CalendarOutline | `mdi:calendar-outline` | `material-symbols-light:event-outline` | 3 | MEDIA |
| ChartPie | `mdi:chart-pie` | `material-symbols-light:pie-chart` | 3 | MEDIA |
| ClipboardCheckOutline | `mdi:clipboard-check-outline` | `material-symbols-light:task-alt` | 3 | MEDIA |
| ClipboardSearchOutline | `mdi:clipboard-search-outline` | `material-symbols-light:manage-search` | 3 | MEDIA |
| CommentProcessingOutline | `mdi:comment-processing-outline` | `material-symbols-light:more` | 3 | MEDIA |
| ContentSaveEditOutline | `mdi:content-save-edit-outline` | `material-symbols-light:edit-note` | 3 | MEDIA |
| ContentSaveOutline | `mdi:content-save-outline` | `material-symbols-light:save-outline` | 3 | MEDIA |
| DownloadOutline | `mdi:download-outline` | `material-symbols-light:download` | 3 | MEDIA |
| DrawPen | `mdi:draw-pen` | `material-symbols-light:draw` | 3 | MEDIA |
| Eraser | `mdi:eraser` | `material-symbols-light:ink-eraser` | 3 | MEDIA |
| Eye | `mdi:eye` | `material-symbols-light:visibility` | 3 | MEDIA |
| FileCode | `mdi:file-code` | `material-symbols-light:data-object` | 3 | MEDIA |
| Hourglass | `mdi:hourglass` | `material-symbols-light:hourglass-empty` | 3 | MEDIA |
| LockOpenVariantOutline | `mdi:lock-open-variant-outline` | `material-symbols-light:lock-open-outline` | 3 | MEDIA |
| MapMarkerOutline | `mdi:map-marker-outline` | `material-symbols-light:location-on-outline` | 3 | MEDIA |
| PackageVariant | `mdi:package-variant` | `material-symbols-light:package` | 3 | MEDIA |
| SilverwareForkKnife | `mdi:silverware-fork-knife` | `material-symbols-light:restaurant` | 3 | MEDIA |
| Stopwatch | `mdi:stopwatch` | `material-symbols-light:timer` | 3 | MEDIA |
| SwapHorizontal | `mdi:swap-horizontal` | `material-symbols-light:swap-horiz` | 3 | MEDIA |
| ToggleSwitch | `mdi:toggle-switch` | `material-symbols-light:toggle-on` | 3 | MEDIA |
| ToggleSwitchOffOutline | `mdi:toggle-switch-off-outline` | `material-symbols-light:toggle-off` | 3 | MEDIA |
| AccountAlertOutline | `mdi:account-alert-outline` | `material-symbols-light:person-alert` | 2 | MEDIA |
| AccountOffOutline | `mdi:account-off-outline` | `material-symbols-light:person-off` | 2 | MEDIA |
| AccountSupervisor | `mdi:account-supervisor` | `material-symbols-light:supervised-user-circle` | 2 | MEDIA |
| AccountTieOutline | `mdi:account-tie-outline` | `material-symbols-light:badge-outline` | 2 | MEDIA |
| AlertDecagramOutline | `mdi:alert-decagram-outline` | `material-symbols-light:warning-outline` | 2 | MEDIA |
| BankTransfer | `mdi:bank-transfer` | `material-symbols-light:account-balance` | 2 | MEDIA |
| BellOff | `mdi:bell-off` | `material-symbols-light:notifications-off` | 2 | MEDIA |
| BookOpenVariant | `mdi:book-open-variant` | `material-symbols-light:menu-book` | 2 | MEDIA |
| CalendarEdit | `mdi:calendar-edit` | `material-symbols-light:edit-calendar` | 2 | MEDIA |
| CalendarEnd | `mdi:calendar-end` | `material-symbols-light:event-upcoming` | 2 | MEDIA |
| CalendarStart | `mdi:calendar-start` | `material-symbols-light:event` | 2 | MEDIA |
| CalendarSync | `mdi:calendar-sync` | `material-symbols-light:event-repeat` | 2 | MEDIA |
| Card | `mdi:card` | `material-symbols-light:credit-card` | 2 | MEDIA |
| ChartLineVariant | `mdi:chart-line-variant` | `material-symbols-light:show-chart` | 2 | MEDIA |
| CheckAll | `mdi:check-all` | `material-symbols-light:done-all` | 2 | MEDIA |
| ChevronDoubleDown | `mdi:chevron-double-down` | `material-symbols-light:keyboard-double-arrow-down` | 2 | MEDIA |
| ChevronDoubleUp | `mdi:chevron-double-up` | `material-symbols-light:keyboard-double-arrow-up` | 2 | MEDIA |
| CircleMedium | `mdi:circle-medium` | `material-symbols-light:circle` | 2 | MEDIA |
| City | `mdi:city` | `material-symbols-light:location-city` | 2 | MEDIA |
| ClipboardListOutline | `mdi:clipboard-list-outline` | `material-symbols-light:fact-check` | 2 | MEDIA |
| CloudCheck | `mdi:cloud-check` | `material-symbols-light:cloud-done` | 2 | MEDIA |
| CommentCheckOutline | `mdi:comment-check-outline` | `material-symbols-light:fact-check` | 2 | MEDIA |
| CommentMultipleOutline | `mdi:comment-multiple-outline` | `material-symbols-light:forum-outline` | 2 | MEDIA |
| CreditCardCheckOutline | `mdi:credit-card-check-outline` | `material-symbols-light:credit-card` | 2 | MEDIA |
| CursorPointer | `mdi:cursor-pointer` | `material-symbols-light:ads-click` | 2 | MEDIA |
| Earth | `mdi:earth` | `material-symbols-light:public` | 2 | MEDIA |
| ElevatorPassengerOutline | `mdi:elevator-passenger-outline` | `material-symbols-light:elevator-outline` | 2 | MEDIA |
| EngineOutline | `mdi:engine-outline` | `material-symbols-light:hvac` | 2 | MEDIA |
| File | `mdi:file` | `material-symbols-light:description` | 2 | MEDIA |
| FileCertificate | `mdi:file-certificate` | `material-symbols-light:workspace-premium` | 2 | MEDIA |
| FileChart | `mdi:file-chart` | `material-symbols-light:monitoring` | 2 | MEDIA |
| FileDocumentMultiple | `mdi:file-document-multiple` | `material-symbols-light:description-outline` | 2 | MEDIA |
| FileEyeOutline | `mdi:file-eye-outline` | `material-symbols-light:visibility` | 2 | MEDIA |
| FileOutline | `mdi:file-outline` | `material-symbols-light:description-outline` | 2 | MEDIA |
| FilePlus | `mdi:file-plus` | `material-symbols-light:note-add` | 2 | MEDIA |
| FileTableOutline | `mdi:file-table-outline` | `material-symbols-light:table` | 2 | MEDIA |
| FileTreeOutline | `mdi:file-tree-outline` | `material-symbols-light:account-tree` | 2 | MEDIA |
| Filter | `mdi:filter` | `material-symbols-light:filter-alt` | 2 | MEDIA |
| FilterVariant | `mdi:filter-variant` | `material-symbols-light:filter` | 2 | MEDIA |
| FilterVariantRemove | `mdi:filter-variant-remove` | `material-symbols-light:filter-alt-off` | 2 | MEDIA |
| FireAlert | `mdi:fire-alert` | `material-symbols-light:local-fire-department` | 2 | MEDIA |
| FormatTitle | `mdi:format-title` | `material-symbols-light:title` | 2 | MEDIA |
| Gauge | `mdi:gauge` | `material-symbols-light:speed` | 2 | MEDIA |
| HandPointingUp | `mdi:hand-pointing-up` | `material-symbols-light:back-hand` | 2 | MEDIA |
| ImageFilterFrames | `mdi:image-filter-frames` | `material-symbols-light:filter-frames` | 2 | MEDIA |
| SearchPlus | `mdi:magnify-plus` | `material-symbols-light:search` | 2 | MEDIA |
| MapMarkerMultiple | `mdi:map-marker-multiple` | `material-symbols-light:location-on` | 2 | MEDIA |
| MapMarkerPath | `mdi:map-marker-path` | `material-symbols-light:route` | 2 | MEDIA |
| MedicalBag | `mdi:medical-bag` | `material-symbols-light:medical-services` | 2 | MEDIA |
| PackageVariantClosed | `mdi:package-variant-closed` | `material-symbols-light:package` | 2 | MEDIA |
| Power | `mdi:power` | `material-symbols-light:power-settings-new` | 2 | MEDIA |
| ReceiptTextOutline | `mdi:receipt-text-outline` | `material-symbols-light:receipt-outline` | 2 | MEDIA |
| ShieldCheckOutline | `mdi:shield-check-outline` | `material-symbols-light:verified-outline` | 2 | MEDIA |
| ShieldHome | `mdi:shield-home` | `material-symbols-light:shield` | 2 | MEDIA |
| ShieldKey | `mdi:shield-key` | `material-symbols-light:key` | 2 | MEDIA |
| TagOutline | `mdi:tag-outline` | `material-symbols-light:label-outline` | 2 | MEDIA |
| TimelineTextOutline | `mdi:timeline-text-outline` | `material-symbols-light:timeline` | 2 | MEDIA |
| TruckDelivery | `mdi:truck-delivery` | `material-symbols-light:local-shipping` | 2 | MEDIA |
| ViewGridOutline | `mdi:view-grid-outline` | `material-symbols-light:grid-view-outline` | 2 | MEDIA |
| WaterOutline | `mdi:water-outline` | `material-symbols-light:water` | 2 | MEDIA |
| AccountCheck | `mdi:account-check` | `material-symbols-light:person-check` | 1 | MEDIA |
| AccountDetails | `mdi:account-details` | `material-symbols-light:badge` | 1 | MEDIA |
| AccountMinusOutline | `mdi:account-minus-outline` | `material-symbols-light:person-remove` | 1 | MEDIA |
| AccountMultiple | `mdi:account-multiple` | `material-symbols-light:person` | 1 | MEDIA |
| AccountMultipleOutline | `mdi:account-multiple-outline` | `material-symbols-light:groups` | 1 | MEDIA |
| AccountOff | `mdi:account-off` | `material-symbols-light:person-off` | 1 | MEDIA |
| AccountPlusOutline | `mdi:account-plus-outline` | `material-symbols-light:person-add-outline` | 1 | MEDIA |
| AccountSearchOutline | `mdi:account-search-outline` | `material-symbols-light:manage-search` | 1 | MEDIA |
| AccountVoice | `mdi:account-voice` | `material-symbols-light:record-voice-over` | 1 | MEDIA |
| AlarmLightOutline | `mdi:alarm-light-outline` | `material-symbols-light:alarm` | 1 | MEDIA |
| ArrowDownCircleOutline | `mdi:arrow-down-circle-outline` | `material-symbols-light:arrow-circle-down` | 1 | MEDIA |
| ArrowDownLeft | `mdi:arrow-down-left` | `material-symbols-light:south-west` | 1 | MEDIA |
| ArrowExpandHorizontal | `mdi:arrow-expand-horizontal` | `material-symbols-light:open-with` | 1 | MEDIA |
| ArrowRightBold | `mdi:arrow-right-bold` | `material-symbols-light:keyboard-double-arrow-right` | 1 | MEDIA |
| ArrowUpCircleOutline | `mdi:arrow-up-circle-outline` | `material-symbols-light:arrow-circle-up` | 1 | MEDIA |
| BadgeAccountOutline | `mdi:badge-account-outline` | `material-symbols-light:badge-outline` | 1 | MEDIA |
| Beach | `mdi:beach` | `material-symbols-light:beach-access` | 1 | MEDIA |
| BellBadgeOutline | `mdi:bell-badge-outline` | `material-symbols-light:notifications-outline` | 1 | MEDIA |
| BookOpenVariantOutline | `mdi:book-open-variant-outline` | `material-symbols-light:menu-book` | 1 | MEDIA |
| Box | `mdi:box` | `material-symbols-light:package` | 1 | MEDIA |
| Brain | `mdi:brain` | `material-symbols-light:psychology` | 1 | MEDIA |
| BriefcaseRemove | `mdi:briefcase-remove` | `material-symbols-light:work-history` | 1 | MEDIA |
| Broom | `mdi:broom` | `material-symbols-light:cleaning-services` | 1 | MEDIA |
| Building | `mdi:building` | `material-symbols-light:apartment` | 1 | MEDIA |
| BullhornOutline | `mdi:bullhorn-outline` | `material-symbols-light:campaign` | 1 | MEDIA |
| CalculatorVariant | `mdi:calculator-variant` | `material-symbols-light:calculate` | 1 | MEDIA |
| CalendarAccount | `mdi:calendar-account` | `material-symbols-light:event-note` | 1 | MEDIA |
| CalendarAlert | `mdi:calendar-alert` | `material-symbols-light:event-busy` | 1 | MEDIA |
| CalendarCheckOutline | `mdi:calendar-check-outline` | `material-symbols-light:event-available` | 1 | MEDIA |
| CalendarRange | `mdi:calendar-range` | `material-symbols-light:event` | 1 | MEDIA |
| CameraOff | `mdi:camera-off` | `material-symbols-light:no-photography` | 1 | MEDIA |
| CameraOutline | `mdi:camera-outline` | `material-symbols-light:photo-camera` | 1 | MEDIA |
| CameraPlus | `mdi:camera-plus` | `material-symbols-light:add-a-photo` | 1 | MEDIA |
| CardBulletedOutline | `mdi:card-bulleted-outline` | `material-symbols-light:description` | 1 | MEDIA |
| CashCheck | `mdi:cash-check` | `material-symbols-light:paid` | 1 | MEDIA |
| CashFast | `mdi:cash-fast` | `material-symbols-light:payments` | 1 | MEDIA |
| ChartAreaspline | `mdi:chart-areaspline` | `material-symbols-light:area-chart` | 1 | MEDIA |
| ChartBox | `mdi:chart-box` | `material-symbols-light:bar-chart` | 1 | MEDIA |
| ChartDonut | `mdi:chart-donut` | `material-symbols-light:donut-large` | 1 | MEDIA |
| ChartGantt | `mdi:chart-gantt` | `material-symbols-light:pattern` | 1 | MEDIA |
| ChartTimelineVariant | `mdi:chart-timeline-variant` | `material-symbols-light:timeline` | 1 | MEDIA |
| ChatProcessingOutline | `mdi:chat-processing-outline` | `material-symbols-light:chat` | 1 | MEDIA |
| CheckBold | `mdi:check-bold` | `material-symbols-light:check` | 1 | MEDIA |
| CheckDecagram | `mdi:check-decagram` | `material-symbols-light:verified` | 1 | MEDIA |
| CheckboxBlankOutline | `mdi:checkbox-blank-outline` | `material-symbols-light:check-box-outline-blank` | 1 | MEDIA |
| CheckboxMarkedCircleOutline | `mdi:checkbox-marked-circle-outline` | `material-symbols-light:radio-button-checked` | 1 | MEDIA |
| CheckboxMarkedOutline | `mdi:checkbox-marked-outline` | `material-symbols-light:check-box-outline` | 1 | MEDIA |
| CircleSmall | `mdi:circle-small` | `material-symbols-light:circle` | 1 | MEDIA |
| ClipboardCheck | `mdi:clipboard-check` | `material-symbols-light:fact-check` | 1 | MEDIA |
| ClipboardList | `mdi:clipboard-list` | `material-symbols-light:fact-check` | 1 | MEDIA |
| ClipboardTextClock | `mdi:clipboard-text-clock` | `material-symbols-light:schedule` | 1 | MEDIA |
| ClipboardTextClockOutline | `mdi:clipboard-text-clock-outline` | `material-symbols-light:schedule` | 1 | MEDIA |
| Clock | `mdi:clock` | `material-symbols-light:schedule` | 1 | MEDIA |
| ClockAlertOutline | `mdi:clock-alert-outline` | `material-symbols-light:schedule` | 1 | MEDIA |
| ClockCheck | `mdi:clock-check` | `material-symbols-light:schedule` | 1 | MEDIA |
| CloseCircleOutline | `mdi:close-circle-outline` | `material-symbols-light:cancel-outline` | 1 | MEDIA |
| CloudCheckOutline | `mdi:cloud-check-outline` | `material-symbols-light:cloud-done` | 1 | MEDIA |
| CogPlay | `mdi:cog-play` | `material-symbols-light:settings` | 1 | MEDIA |
| CreditCardMultiple | `mdi:credit-card-multiple` | `material-symbols-light:credit-card` | 1 | MEDIA |
| DatabaseSyncOutline | `mdi:database-sync-outline` | `material-symbols-light:database-outline` | 1 | MEDIA |
| Door | `mdi:door` | `material-symbols-light:door-front` | 1 | MEDIA |
| DotsHorizontal | `mdi:dots-horizontal` | `material-symbols-light:more-horiz` | 1 | MEDIA |
| EmailArrowRight | `mdi:email-arrow-right` | `material-symbols-light:mail-outline` | 1 | MEDIA |
| EmailEdit | `mdi:email-edit` | `material-symbols-light:edit-note` | 1 | MEDIA |
| EmailFastOutline | `mdi:email-fast-outline` | `material-symbols-light:mail-outline` | 1 | MEDIA |
| EmailMultipleOutline | `mdi:email-multiple-outline` | `material-symbols-light:mail-outline` | 1 | MEDIA |
| EmailOffOutline | `mdi:email-off-outline` | `material-symbols-light:mail-off-outline` | 1 | MEDIA |
| EmailPlusOutline | `mdi:email-plus-outline` | `material-symbols-light:drafts` | 1 | MEDIA |
| EmailSend | `mdi:email-send` | `material-symbols-light:send` | 1 | MEDIA |
| EmailSendOutline | `mdi:email-send-outline` | `material-symbols-light:send-outline` | 1 | MEDIA |
| Envelope | `mdi:envelope` | `material-symbols-light:mail` | 1 | MEDIA |
| FaceSmile | `mdi:face-smile` | `material-symbols-light:sentiment-satisfied` | 1 | MEDIA |
| FileClockOutline | `mdi:file-clock-outline` | `material-symbols-light:timer` | 1 | MEDIA |
| FileDocumentEditOutline | `mdi:file-document-edit-outline` | `material-symbols-light:edit-note` | 1 | MEDIA |
| FileImageOutline | `mdi:file-image-outline` | `material-symbols-light:image-outline` | 1 | MEDIA |
| FileMusic | `mdi:file-music` | `material-symbols-light:audio-file` | 1 | MEDIA |
| FilePdf | `mdi:file-pdf` | `material-symbols-light:picture-as-pdf` | 1 | MEDIA |
| FilePlusOutline | `mdi:file-plus-outline` | `material-symbols-light:note-add` | 1 | MEDIA |
| FileSearchOutline | `mdi:file-search-outline` | `material-symbols-light:manage-search` | 1 | MEDIA |
| FileStarOutline | `mdi:file-star-outline` | `material-symbols-light:star-outline` | 1 | MEDIA |
| FileText | `mdi:file-text` | `material-symbols-light:description` | 1 | MEDIA |
| FileTree | `mdi:file-tree` | `material-symbols-light:account-tree` | 1 | MEDIA |
| FileVideo | `mdi:file-video` | `material-symbols-light:movie` | 1 | MEDIA |
| FilterOffOutline | `mdi:filter-off-outline` | `material-symbols-light:filter-alt-off` | 1 | MEDIA |
| Fire | `mdi:fire` | `material-symbols-light:local-fire-department` | 1 | MEDIA |
| Flash | `mdi:flash` | `material-symbols-light:flash-on` | 1 | MEDIA |
| FlashOutline | `mdi:flash-outline` | `material-symbols-light:flash-on` | 1 | MEDIA |
| Flask | `mdi:flask` | `material-symbols-light:science` | 1 | MEDIA |
| FlaskOutline | `mdi:flask-outline` | `material-symbols-light:science` | 1 | MEDIA |
| FolderAccountOutline | `mdi:folder-account-outline` | `material-symbols-light:folder-shared` | 1 | MEDIA |
| FolderArrowDown | `mdi:folder-arrow-down` | `material-symbols-light:download` | 1 | MEDIA |
| FormDropdown | `mdi:form-dropdown` | `material-symbols-light:arrow-drop-down` | 1 | MEDIA |
| FormSelect | `mdi:form-select` | `material-symbols-light:list` | 1 | MEDIA |
| FormTextbox | `mdi:form-textbox` | `material-symbols-light:text-fields` | 1 | MEDIA |
| FormatListText | `mdi:format-list-text` | `material-symbols-light:format-list-bulleted` | 1 | MEDIA |
| Globe | `mdi:globe` | `material-symbols-light:public` | 1 | MEDIA |
| GoogleAnalytics | `mdi:google-analytics` | `material-symbols-light:analytics` | 1 | MEDIA |
| GraduationCap | `mdi:graduation-cap` | `material-symbols-light:school` | 1 | MEDIA |
| HammerWrench | `mdi:hammer-wrench` | `material-symbols-light:handyman` | 1 | MEDIA |
| HandWave | `mdi:hand-wave` | `material-symbols-light:waving-hand` | 1 | MEDIA |
| HelpCircleOutline | `mdi:help-circle-outline` | `material-symbols-light:help-outline` | 1 | MEDIA |
| HomeVariant | `mdi:home-variant` | `material-symbols-light:home` | 1 | MEDIA |
| ImageMultipleOutline | `mdi:image-multiple-outline` | `material-symbols-light:photo` | 1 | MEDIA |
| ImageOffOutline | `mdi:image-off-outline` | `material-symbols-light:broken-image` | 1 | MEDIA |
| InboxArrowDown | `mdi:inbox-arrow-down` | `material-symbols-light:move-to-inbox` | 1 | MEDIA |
| LayersOutline | `mdi:layers-outline` | `material-symbols-light:layers` | 1 | MEDIA |
| Leaf | `mdi:leaf` | `material-symbols-light:eco` | 1 | MEDIA |
| LightbulbOnOutline | `mdi:lightbulb-on-outline` | `material-symbols-light:lightbulb-outline` | 1 | MEDIA |
| ListStatus | `mdi:list-status` | `material-symbols-light:fact-check` | 1 | MEDIA |
| SearchMinus | `mdi:magnify-minus` | `material-symbols-light:search` | 1 | MEDIA |
| MapMarkerMultipleOutline | `mdi:map-marker-multiple-outline` | `material-symbols-light:location-on` | 1 | MEDIA |
| MapOutline | `mdi:map-outline` | `material-symbols-light:map` | 1 | MEDIA |
| MinusBox | `mdi:minus-box` | `material-symbols-light:remove` | 1 | MEDIA |
| MonitorCellphone | `mdi:monitor-cellphone` | `material-symbols-light:devices` | 1 | MEDIA |
| NotePlusOutline | `mdi:note-plus-outline` | `material-symbols-light:note-add` | 1 | MEDIA |
| NoteTextOutline | `mdi:note-text-outline` | `material-symbols-light:note-alt` | 1 | MEDIA |
| NotebookOutline | `mdi:notebook-outline` | `material-symbols-light:book` | 1 | MEDIA |
| OfficeBuildingMarker | `mdi:office-building-marker` | `material-symbols-light:location-city` | 1 | MEDIA |
| PackageDown | `mdi:package-down` | `material-symbols-light:download` | 1 | MEDIA |
| PackageOutline | `mdi:package-outline` | `material-symbols-light:package` | 1 | MEDIA |
| PackageUp | `mdi:package-up` | `material-symbols-light:upload` | 1 | MEDIA |
| PageFirst | `mdi:page-first` | `material-symbols-light:first-page` | 1 | MEDIA |
| PageLast | `mdi:page-last` | `material-symbols-light:last-page` | 1 | MEDIA |
| PageLayoutSidebarLeft | `mdi:page-layout-sidebar-left` | `material-symbols-light:view-sidebar` | 1 | MEDIA |
| PhoneAlert | `mdi:phone-alert` | `material-symbols-light:phone-in-talk` | 1 | MEDIA |
| PhoneOff | `mdi:phone-off` | `material-symbols-light:phone-disabled` | 1 | MEDIA |
| PhonePlus | `mdi:phone-plus` | `material-symbols-light:add-call` | 1 | MEDIA |
| PhonePlusOutline | `mdi:phone-plus-outline` | `material-symbols-light:add-call` | 1 | MEDIA |
| QrcodeScan | `mdi:qrcode-scan` | `material-symbols-light:qr-code-scanner` | 1 | MEDIA |
| ServerOutline | `mdi:server-outline` | `material-symbols-light:dns` | 1 | MEDIA |
| ShieldAlert | `mdi:shield-alert` | `material-symbols-light:error` | 1 | MEDIA |
| ShieldOutline | `mdi:shield-outline` | `material-symbols-light:shield` | 1 | MEDIA |
| SourceMerge | `mdi:source-merge` | `material-symbols-light:call-merge` | 1 | MEDIA |
| Speedometer | `mdi:speedometer` | `material-symbols-light:speed` | 1 | MEDIA |
| SquareEditOutline | `mdi:square-edit-outline` | `material-symbols-light:edit-square` | 1 | MEDIA |
| StarCircle | `mdi:star-circle` | `material-symbols-light:star` | 1 | MEDIA |
| TableHeadersEye | `mdi:table-headers-eye` | `material-symbols-light:table` | 1 | MEDIA |
| TableLarge | `mdi:table-large` | `material-symbols-light:table` | 1 | MEDIA |
| TablePivot | `mdi:table-pivot` | `material-symbols-light:table` | 1 | MEDIA |
| TagMultiple | `mdi:tag-multiple` | `material-symbols-light:label` | 1 | MEDIA |
| TagMultipleOutline | `mdi:tag-multiple-outline` | `material-symbols-light:label-outline` | 1 | MEDIA |
| TimelineCheckOutline | `mdi:timeline-check-outline` | `material-symbols-light:timeline` | 1 | MEDIA |
| ToggleSwitchOutline | `mdi:toggle-switch-outline` | `material-symbols-light:toggle-on` | 1 | MEDIA |
| TuneVariant | `mdi:tune-variant` | `material-symbols-light:tune` | 1 | MEDIA |
| TuneVertical | `mdi:tune-vertical` | `material-symbols-light:tune` | 1 | MEDIA |
| VideoOutline | `mdi:video-outline` | `material-symbols-light:videocam` | 1 | MEDIA |
| ViewDashboardEdit | `mdi:view-dashboard-edit` | `material-symbols-light:dashboard-customize` | 1 | MEDIA |
| ViewListOutline | `mdi:view-list-outline` | `material-symbols-light:view-list` | 1 | MEDIA |
| ViewModuleOutline | `mdi:view-module-outline` | `material-symbols-light:view-module` | 1 | MEDIA |
| ViewSplitVertical | `mdi:view-split-vertical` | `material-symbols-light:vertical-split` | 1 | MEDIA |
| WhiteBalanceSunny | `mdi:white-balance-sunny` | `material-symbols-light:sunny` | 1 | MEDIA |
| WrenchOutline | `mdi:wrench-outline` | `material-symbols-light:build` | 1 | MEDIA |

## 4. Confianza ALTA

| Rol | mdi actual | propuesto material-symbols-light | usos | confianza |
|---|---|---|---|---|
| Check | `mdi:check` | `material-symbols-light:check` | 117 | ALTA |
| Close | `mdi:close` | `material-symbols-light:close` | 110 | ALTA |
| CheckCircle | `mdi:check-circle` | `material-symbols-light:check-circle` | 76 | ALTA |
| Add | `mdi:plus` | `material-symbols-light:add` | 69 | ALTA |
| ChevronRight | `mdi:chevron-right` | `material-symbols-light:chevron-right` | 56 | ALTA |
| Search | `mdi:magnify` | `material-symbols-light:search` | 54 | ALTA |
| Person | `mdi:account` | `material-symbols-light:person` | 47 | ALTA |
| Alert | `mdi:alert` | `material-symbols-light:warning` | 45 | ALTA |
| Gear | `mdi:cog` | `material-symbols-light:settings` | 38 | ALTA |
| Refresh | `mdi:refresh` | `material-symbols-light:refresh` | 37 | ALTA |
| Pencil | `mdi:pencil` | `material-symbols-light:edit` | 36 | ALTA |
| FormatListBulleted | `mdi:format-list-bulleted` | `material-symbols-light:format-list-bulleted` | 34 | ALTA |
| Lock | `mdi:lock` | `material-symbols-light:lock` | 34 | ALTA |
| Delete | `mdi:delete` | `material-symbols-light:delete` | 33 | ALTA |
| Upload | `mdi:upload` | `material-symbols-light:upload` | 33 | ALTA |
| ChartBar | `mdi:chart-bar` | `material-symbols-light:bar-chart` | 30 | ALTA |
| CloseCircle | `mdi:close-circle` | `material-symbols-light:cancel` | 29 | ALTA |
| Save | `mdi:content-save` | `material-symbols-light:save` | 27 | ALTA |
| Download | `mdi:download` | `material-symbols-light:download` | 27 | ALTA |
| Home | `mdi:home` | `material-symbols-light:home` | 25 | ALTA |
| Send | `mdi:send` | `material-symbols-light:send` | 25 | ALTA |
| Sync | `mdi:sync` | `material-symbols-light:sync` | 25 | ALTA |
| FolderOpen | `mdi:folder-open` | `material-symbols-light:folder-open` | 24 | ALTA |
| ArrowBack | `mdi:arrow-left` | `material-symbols-light:arrow-back` | 23 | ALTA |
| Wallet | `mdi:wallet` | `material-symbols-light:wallet` | 23 | ALTA |
| Book | `mdi:book` | `material-symbols-light:book` | 22 | ALTA |
| ArrowForward | `mdi:arrow-right` | `material-symbols-light:arrow-forward` | 21 | ALTA |
| Menu | `mdi:menu` | `material-symbols-light:menu` | 21 | ALTA |
| OfficeBuilding | `mdi:office-building` | `material-symbols-light:apartment` | 21 | ALTA |
| ExpandDown | `mdi:chevron-down` | `material-symbols-light:keyboard-arrow-down` | 20 | ALTA |
| Call | `mdi:phone` | `material-symbols-light:call` | 20 | ALTA |
| Sparkles | `mdi:sparkles` | `material-symbols-light:auto-awesome-motion` | 20 | ALTA |
| AlertCircle | `mdi:alert-circle` | `material-symbols-light:error` | 19 | ALTA |
| ChartLine | `mdi:chart-line` | `material-symbols-light:monitoring` | 19 | ALTA |
| CheckCircleOutline | `mdi:check-circle-outline` | `material-symbols-light:check-circle-outline` | 17 | ALTA |
| History | `mdi:history` | `material-symbols-light:history` | 17 | ALTA |
| ContentCopy | `mdi:content-copy` | `material-symbols-light:content-copy` | 16 | ALTA |
| LockOpen | `mdi:lock-open` | `material-symbols-light:lock-open` | 16 | ALTA |
| ChevronLeft | `mdi:chevron-left` | `material-symbols-light:chevron-left` | 15 | ALTA |
| StarOutline | `mdi:star-outline` | `material-symbols-light:star-outline` | 15 | ALTA |
| Link | `mdi:link` | `material-symbols-light:link` | 13 | ALTA |
| Receipt | `mdi:receipt` | `material-symbols-light:receipt` | 13 | ALTA |
| ExpandUp | `mdi:chevron-up` | `material-symbols-light:keyboard-arrow-up` | 12 | ALTA |
| Table | `mdi:table` | `material-symbols-light:table` | 12 | ALTA |
| CreditCard | `mdi:credit-card` | `material-symbols-light:credit-card` | 11 | ALTA |
| Package | `mdi:package` | `material-symbols-light:package` | 11 | ALTA |
| Percent | `mdi:percent` | `material-symbols-light:percent` | 10 | ALTA |
| Circle | `mdi:circle` | `material-symbols-light:circle` | 9 | ALTA |
| Key | `mdi:key` | `material-symbols-light:key` | 9 | ALTA |
| Palette | `mdi:palette` | `material-symbols-light:palette` | 9 | ALTA |
| CalendarClock | `mdi:calendar-clock` | `material-symbols-light:calendar-clock` | 8 | ALTA |
| Gavel | `mdi:gavel` | `material-symbols-light:gavel` | 8 | ALTA |
| Cancel | `mdi:cancel` | `material-symbols-light:cancel` | 7 | ALTA |
| Domain | `mdi:domain` | `material-symbols-light:domain` | 7 | ALTA |
| Folder | `mdi:folder` | `material-symbols-light:folder` | 7 | ALTA |
| LockOutline | `mdi:lock-outline` | `material-symbols-light:lock-outline` | 6 | ALTA |
| Logout | `mdi:logout` | `material-symbols-light:logout` | 6 | ALTA |
| Star | `mdi:star` | `material-symbols-light:star` | 6 | ALTA |
| Stop | `mdi:stop` | `material-symbols-light:stop` | 6 | ALTA |
| Tune | `mdi:tune` | `material-symbols-light:tune` | 6 | ALTA |
| DeleteOutline | `mdi:delete-outline` | `material-symbols-light:delete-outline` | 5 | ALTA |
| Replay | `mdi:replay` | `material-symbols-light:replay` | 5 | ALTA |
| StoreOutline | `mdi:store-outline` | `material-symbols-light:store-outline` | 5 | ALTA |
| ArrowDown | `mdi:arrow-down` | `material-symbols-light:arrow-downward` | 4 | ALTA |
| CircleOutline | `mdi:circle-outline` | `material-symbols-light:circle-outline` | 4 | ALTA |
| CloudUpload | `mdi:cloud-upload` | `material-symbols-light:cloud-upload` | 4 | ALTA |
| Comment | `mdi:comment` | `material-symbols-light:comment` | 4 | ALTA |
| Equal | `mdi:equal` | `material-symbols-light:equal` | 4 | ALTA |
| Login | `mdi:login` | `material-symbols-light:login` | 4 | ALTA |
| PlayCircle | `mdi:play-circle` | `material-symbols-light:play-circle` | 4 | ALTA |
| Settings | `mdi:settings` | `material-symbols-light:settings` | 4 | ALTA |
| TrendingUp | `mdi:trending-up` | `material-symbols-light:trending-up` | 4 | ALTA |
| Undo | `mdi:undo` | `material-symbols-light:undo` | 4 | ALTA |
| Verified | `mdi:verified` | `material-symbols-light:verified` | 4 | ALTA |
| ViewList | `mdi:view-list` | `material-symbols-light:view-list` | 4 | ALTA |
| CommentOutline | `mdi:comment-outline` | `material-symbols-light:comment-outline` | 3 | ALTA |
| DatabaseOutline | `mdi:database-outline` | `material-symbols-light:database-outline` | 3 | ALTA |
| Edit | `mdi:edit` | `material-symbols-light:edit` | 3 | ALTA |
| Flag | `mdi:flag` | `material-symbols-light:flag` | 3 | ALTA |
| ForumOutline | `mdi:forum-outline` | `material-symbols-light:forum-outline` | 3 | ALTA |
| LockReset | `mdi:lock-reset` | `material-symbols-light:lock-reset` | 3 | ALTA |
| OpenInNew | `mdi:open-in-new` | `material-symbols-light:open-in-new` | 3 | ALTA |
| Wifi | `mdi:wifi` | `material-symbols-light:wifi` | 3 | ALTA |
| AccountCircleOutline | `mdi:account-circle-outline` | `material-symbols-light:account-circle-outline` | 2 | ALTA |
| ArrowUp | `mdi:arrow-up` | `material-symbols-light:arrow-upward` | 2 | ALTA |
| Bookmark | `mdi:bookmark` | `material-symbols-light:bookmark` | 2 | ALTA |
| CreditCardOutline | `mdi:credit-card-outline` | `material-symbols-light:credit-card-outline` | 2 | ALTA |
| DatabaseOffOutline | `mdi:database-off-outline` | `material-symbols-light:database-off-outline` | 2 | ALTA |
| FolderOutline | `mdi:folder-outline` | `material-symbols-light:folder-outline` | 2 | ALTA |
| HomeOutline | `mdi:home-outline` | `material-symbols-light:home-outline` | 2 | ALTA |
| KeyOutline | `mdi:key-outline` | `material-symbols-light:key-outline` | 2 | ALTA |
| Lightbulb | `mdi:lightbulb` | `material-symbols-light:lightbulb` | 2 | ALTA |
| PaletteOutline | `mdi:palette-outline` | `material-symbols-light:palette-outline` | 2 | ALTA |
| Pin | `mdi:pin` | `material-symbols-light:pin` | 2 | ALTA |
| PlayCircleOutline | `mdi:play-circle-outline` | `material-symbols-light:play-circle-outline` | 2 | ALTA |
| Pool | `mdi:pool` | `material-symbols-light:pool` | 2 | ALTA |
| SendOutline | `mdi:send-outline` | `material-symbols-light:send-outline` | 2 | ALTA |
| TrendingDown | `mdi:trending-down` | `material-symbols-light:trending-down` | 2 | ALTA |
| WifiOff | `mdi:wifi-off` | `material-symbols-light:wifi-off` | 2 | ALTA |
| Archive | `mdi:archive` | `material-symbols-light:archive` | 1 | ALTA |
| Barcode | `mdi:barcode` | `material-symbols-light:barcode` | 1 | ALTA |
| Chat | `mdi:chat` | `material-symbols-light:chat` | 1 | ALTA |
| CloudOutline | `mdi:cloud-outline` | `material-symbols-light:cloud-outline` | 1 | ALTA |
| Database | `mdi:database` | `material-symbols-light:database` | 1 | ALTA |
| Draw | `mdi:draw` | `material-symbols-light:draw` | 1 | ALTA |
| FireExtinguisher | `mdi:fire-extinguisher` | `material-symbols-light:fire-extinguisher` | 1 | ALTA |
| FlagOutline | `mdi:flag-outline` | `material-symbols-light:flag-outline` | 1 | ALTA |
| FormatColorFill | `mdi:format-color-fill` | `material-symbols-light:format-color-fill` | 1 | ALTA |
| FormatListNumbered | `mdi:format-list-numbered` | `material-symbols-light:format-list-numbered` | 1 | ALTA |
| Group | `mdi:group` | `material-symbols-light:group` | 1 | ALTA |
| Handshake | `mdi:handshake` | `material-symbols-light:handshake` | 1 | ALTA |
| Keyboard | `mdi:keyboard` | `material-symbols-light:keyboard` | 1 | ALTA |
| LightbulbOutline | `mdi:lightbulb-outline` | `material-symbols-light:lightbulb-outline` | 1 | ALTA |
| LinkOff | `mdi:link-off` | `material-symbols-light:link-off` | 1 | ALTA |
| LockOpenOutline | `mdi:lock-open-outline` | `material-symbols-light:lock-open-outline` | 1 | ALTA |
| QrCode | `mdi:qr-code` | `material-symbols-light:qr-code` | 1 | ALTA |
| Radar | `mdi:radar` | `material-symbols-light:radar` | 1 | ALTA |
| Radio | `mdi:radio` | `material-symbols-light:radio` | 1 | ALTA |
| Repeat | `mdi:repeat` | `material-symbols-light:repeat` | 1 | ALTA |
| Stairs | `mdi:stairs` | `material-symbols-light:stairs` | 1 | ALTA |
| ThumbUp | `mdi:thumb-up` | `material-symbols-light:thumb-up` | 1 | ALTA |
| ThumbUpOutline | `mdi:thumb-up-outline` | `material-symbols-light:thumb-up-outline` | 1 | ALTA |
| Timeline | `mdi:timeline` | `material-symbols-light:timeline` | 1 | ALTA |
| TimerOutline | `mdi:timer-outline` | `material-symbols-light:timer-outline` | 1 | ALTA |
| Translate | `mdi:translate` | `material-symbols-light:translate` | 1 | ALTA |
| ViewColumn | `mdi:view-column` | `material-symbols-light:view-column` | 1 | ALTA |
| Warehouse | `mdi:warehouse` | `material-symbols-light:warehouse` | 1 | ALTA |
| Web | `mdi:web` | `material-symbols-light:web` | 1 | ALTA |

## 5. Metodología y verificaciones

- Las 535 filas provienen del inventario de la Fase 0 y de la auditoría §3 del prompt.
- **Cada `material-symbols-light:<nombre>` fue comprobado contra el índice real** del set (no inventado).
- Roles únicos por desambiguación (F1-bis) con los valores intactos.

### Verificación de cifras §3

| Cifra §3 | Medida aquí | Estado |
|---|---:|---|
| Ocurrencias `mdi:` en src/app | 3.404 | ✅ (el +1 es un `.md`) |
|  en .html | 2.217 (501 archivos) | ✅ |
|  en .ts | 1.186 (207 archivos) | ✅ |
|  en icon-mapping.ts | 180 | ✅ |
| Nombres `mdi:` únicos | 535 | ✅ |
| `icon="mdi:x"` atributo | 750 (751 incluye diff paralelo) | ⚠ |
| `[icon]="'mdi:x'"` literal | 673 (675) | ⚠ |
| `[icon]="expresión"` | 238 dentro de `<app-icon>` | ⚠ |
| `<app-icon>` | 1.514 usos / 571 archivos | ⚠ |
| `pi pi-` directo | 83 | ✅ |
| `fluent-color:` | 25 | ✅ |
| `<ion-icon>` | 64 | ✅ |

Los `⚠` son diferencias de método o diffs paralelos (12 archivos de Reclutamiento + borrador del
`enum AppIconName` en `app-icon.ts`), NO cambios de árbol.
