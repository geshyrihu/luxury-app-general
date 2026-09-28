-- Baseline del KPI K6
SELECT COUNT(*) AS VencidasSinCerrar FROM TaskInstances
WHERE DueDate < GETDATE() AND CompletedAt IS NULL;

-- ¿El motor legado tiene algo vivo?
SELECT Status, COUNT(*) AS Total FROM TaskRecurringTemplates GROUP BY Status;
SELECT COUNT(*) AS TareasDeMotorLegado FROM Tasks WHERE RecurringTemplateId IS NOT NULL;

-- ¿Qué se pierde al retirar el motor viejo?
SELECT COUNT(*) FROM TaskInstances;
SELECT COUNT(*) FROM TaskTemplates WHERE IsActive = 1;
SELECT COUNT(*) FROM TaskAttachments;
SELECT COUNT(*) FROM TaskComments;
