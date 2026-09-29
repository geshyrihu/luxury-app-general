BEGIN TRANSACTION;
ALTER TABLE [FireCycleInspectionDetectors] DROP CONSTRAINT [FK_FireCycleInspectionDetectores_SmokeDetectors_DetectorId];

ALTER TABLE [FireCycleInspectionExtinguishers] DROP CONSTRAINT [FK_FireCycleInspectionExtintores_FireExtinguishers_ExtinguisherId];

ALTER TABLE [FireCycleInspectionHydrants] DROP CONSTRAINT [FK_FireCycleInspectionHidrantes_Hydrants_HydrantId];

ALTER TABLE [FireCycleInspectionStations] DROP CONSTRAINT [FK_FireCycleInspectionEstaciones_ManualCallPoints_StationId];

ALTER TABLE [FireExtinguisherLogs] DROP CONSTRAINT [FK_FireExtinguisherLogs_FireExtinguishers_ExtinguisherId];

ALTER TABLE [FireInspectionPeriodDetectors] DROP CONSTRAINT [FK_FireInspectionPeriodDetectores_SmokeDetectors_DetectorId];

ALTER TABLE [FireInspectionPeriodExtinguishers] DROP CONSTRAINT [FK_FireInspectionPeriodExtintores_FireExtinguishers_ExtinguisherId];

ALTER TABLE [FireInspectionPeriodHydrants] DROP CONSTRAINT [FK_FireInspectionPeriodHidrantes_Hydrants_HydrantId];

ALTER TABLE [FireInspectionPeriodStations] DROP CONSTRAINT [FK_FireInspectionPeriodEstaciones_ManualCallPoints_StationId];

ALTER TABLE [HydrantLogs] DROP CONSTRAINT [FK_HydrantLogs_Hydrants_HydrantId];

ALTER TABLE [ManualCallPointLogs] DROP CONSTRAINT [FK_ManualCallPointLogs_ManualCallPoints_StationId];

ALTER TABLE [SmokeDetectorLogs] DROP CONSTRAINT [FK_SmokeDetectorLogs_SmokeDetectors_DetectorId];

ALTER TABLE [FireCycleInspectionDetectors] ADD CONSTRAINT [FK_FireCycleInspectionDetectors_Equipment_DetectorId] FOREIGN KEY ([DetectorId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireCycleInspectionExtinguishers] ADD CONSTRAINT [FK_FireCycleInspectionExtinguishers_Equipment_ExtinguisherId] FOREIGN KEY ([ExtinguisherId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireCycleInspectionHydrants] ADD CONSTRAINT [FK_FireCycleInspectionHydrants_Equipment_HydrantId] FOREIGN KEY ([HydrantId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireCycleInspectionStations] ADD CONSTRAINT [FK_FireCycleInspectionStations_Equipment_StationId] FOREIGN KEY ([StationId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireExtinguisherLogs] ADD CONSTRAINT [FK_FireExtinguisherLogs_Equipment_ExtinguisherId] FOREIGN KEY ([ExtinguisherId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireInspectionPeriodDetectors] ADD CONSTRAINT [FK_FireInspectionPeriodDetectors_Equipment_DetectorId] FOREIGN KEY ([DetectorId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireInspectionPeriodExtinguishers] ADD CONSTRAINT [FK_FireInspectionPeriodExtinguishers_Equipment_ExtinguisherId] FOREIGN KEY ([ExtinguisherId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireInspectionPeriodHydrants] ADD CONSTRAINT [FK_FireInspectionPeriodHydrants_Equipment_HydrantId] FOREIGN KEY ([HydrantId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [FireInspectionPeriodStations] ADD CONSTRAINT [FK_FireInspectionPeriodStations_Equipment_StationId] FOREIGN KEY ([StationId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [HydrantLogs] ADD CONSTRAINT [FK_HydrantLogs_Equipment_HydrantId] FOREIGN KEY ([HydrantId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [ManualCallPointLogs] ADD CONSTRAINT [FK_ManualCallPointLogs_Equipment_StationId] FOREIGN KEY ([StationId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [SmokeDetectorLogs] ADD CONSTRAINT [FK_SmokeDetectorLogs_Equipment_DetectorId] FOREIGN KEY ([DetectorId]) REFERENCES [Equipment] ([Id]) ON DELETE NO ACTION;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260928162110_SwitchFireForeignKeysToEquipment', N'10.0.10');

COMMIT;
GO

