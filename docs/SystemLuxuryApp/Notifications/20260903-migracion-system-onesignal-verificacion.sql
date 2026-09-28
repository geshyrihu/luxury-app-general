-- ============================================================================
-- Verificación Post-Migración: OneSignal Web + Android
-- Fecha: 2026-09-03
-- Usar en: LuxuryAppVault (DB de secretos)
-- ============================================================================

-- 1. Contar secretos OneSignal sembrados
SELECT
    'TOTAL ONESIGNAL SECRETS' as [Check],
    COUNT(*) as [Count],
    CASE
        WHEN COUNT(*) >= 6 THEN '✅ PASS (3 Web + 4 Android - 1 duplicado)'
        WHEN COUNT(*) >= 4 THEN '⚠️ WARNING (Faltan secretos)'
        ELSE '❌ FAIL'
    END as [Status]
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL;

-- 2. Listar secretos OneSignal con timestamps
SELECT
    SecretName,
    SecretType,
    KeyVersion,
    IsRevoked,
    CreatedAt,
    LastAccessedAt,
    AccessCount,
    CASE
        WHEN IsRevoked = 1 THEN '🚫 REVOKED'
        WHEN ExpiresAt IS NOT NULL AND ExpiresAt < GETUTCDATE() THEN '⏰ EXPIRED'
        ELSE '✅ ACTIVE'
    END as [Status]
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL
ORDER BY CreatedAt DESC;

-- 3. Verificar que NO hay duplicados
SELECT
    SecretName,
    COUNT(*) as [Duplicates]
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL
GROUP BY SecretName
HAVING COUNT(*) > 1;
-- Esperado: Sin resultados

-- 4. Audit log de acceso a secretos OneSignal (últimas 24h)
SELECT
    TOP 50
    al.Id,
    vs.SecretName,
    al.Operation,
    CASE WHEN al.Success = 1 THEN '✅ SUCCESS' ELSE '❌ FAILED' END as [Status],
    al.AccessedBy,
    al.ClientIP,
    al.AccessedAt
FROM VaultAccessLogs al
JOIN VaultSecrets vs ON al.SecretId = vs.Id
WHERE vs.SecretName LIKE 'onesignal.%'
  AND al.AccessedAt >= DATEADD(DAY, -1, GETUTCDATE())
ORDER BY al.AccessedAt DESC;

-- 5. Resumen de claves por versión
SELECT
    SecretName,
    KeyVersion,
    COUNT(*) as [Count]
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL
GROUP BY SecretName, KeyVersion
ORDER BY SecretName, KeyVersion DESC;

-- 6. Verificar valor de claves NO-SENSIBLES (App IDs públicos solamente)
-- ⚠️ ADVERTENCIA: Solo verificar App IDs, NUNCA mostrar REST API Keys en producción
SELECT
    SecretName,
    CASE
        WHEN SecretName = 'onesignal.android.app.id'
          THEN 'Debe ser: a4cdd6bf-373a-4dc6-b4d6-d34bf971c622'
        WHEN SecretName = 'onesignal.android.dev.app.id'
          THEN 'Debe ser: a4cdd6bf-373a-4dc6-b4d6-d34bf971c622'
        WHEN SecretName LIKE '%app.id' OR SecretName LIKE '%AppId'
          THEN 'Verificar en appsettings.json'
        ELSE '✅ REST API Key (cifrado, no verificable aquí)'
    END as [VerificationNote],
    CreatedAt,
    CreatedBy
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL
ORDER BY SecretName;

-- 7. Health Check completo
PRINT '=== ONESIGNAL MIGRATION HEALTH CHECK ===';
PRINT '';
PRINT 'Esperado:';
PRINT '  - 3 secretos Web (Email + Web + WebDev)';
PRINT '  - 4 secretos Android (AppId + RestApiKey para Prod + Dev)';
PRINT '  - Total: 7 secretos';
PRINT '';
PRINT 'Estado Actual:';
SELECT COUNT(*) as [Total Secrets],
       SUM(CASE WHEN IsRevoked = 1 THEN 1 ELSE 0 END) as [Revoked],
       SUM(CASE WHEN IsRevoked = 0 AND (ExpiresAt IS NULL OR ExpiresAt > GETUTCDATE()) THEN 1 ELSE 0 END) as [Active]
FROM VaultSecrets
WHERE SecretName LIKE 'onesignal.%' AND TenantId IS NULL;

-- ============================================================================
-- NOTAS DE EJECUCIÓN
-- ============================================================================
-- 1. Ejecutar este script en LuxuryAppVault después del deployment
-- 2. Verificar que no hay ningún "❌ FAIL" ni "⚠️ WARNING"
-- 3. Si falta algún secreto, ejecutar programa nuevamente para re-seed
-- 4. Los REST API Keys están cifrados (AES-256-GCM), no se pueden leer aquí
-- 5. Para auditoría completa: revisar table VaultAccessLogs
