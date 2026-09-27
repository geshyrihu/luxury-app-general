BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipment]') AND [c].[name] = N'InstallationDate');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Equipment] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [Equipment] ALTER COLUMN [InstallationDate] date NULL;

ALTER TABLE [Equipment] ADD [LocalCode] nvarchar(max) NULL;

CREATE TABLE [AssetMigrationLog] (
    [Id] uniqueidentifier NOT NULL,
    [SourceTable] nvarchar(450) NULL,
    [SourceId] uniqueidentifier NOT NULL,
    [TargetId] uniqueidentifier NOT NULL,
    [MigratedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_AssetMigrationLog] PRIMARY KEY ([Id])
);

CREATE TABLE [EquipmentFireDetails] (
    [EquipmentId] uniqueidentifier NOT NULL,
    [FireAssetKind] int NOT NULL,
    [ExtinguisherType] int NULL,
    [ExpirationDate] date NULL,
    [HydrantType] int NULL,
    [CabinetNumber] nvarchar(max) NULL,
    [DetectorType] int NULL,
    [StationType] int NULL,
    CONSTRAINT [PK_EquipmentFireDetails] PRIMARY KEY ([EquipmentId]),
    CONSTRAINT [CK_EquipmentFireDetails_Extinguisher] CHECK ([FireAssetKind] <> 1 OR ([ExtinguisherType] IS NOT NULL AND [ExpirationDate] IS NOT NULL)),
    CONSTRAINT [CK_EquipmentFireDetails_Hydrant] CHECK ([FireAssetKind] <> 2 OR [HydrantType] IS NOT NULL),
    CONSTRAINT [CK_EquipmentFireDetails_ManualCallPoint] CHECK ([FireAssetKind] <> 4 OR [StationType] IS NOT NULL),
    CONSTRAINT [CK_EquipmentFireDetails_SmokeDetector] CHECK ([FireAssetKind] <> 3 OR [DetectorType] IS NOT NULL),
    CONSTRAINT [FK_EquipmentFireDetails_Equipment_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipment] ([Id]) ON DELETE CASCADE
);

ALTER TABLE [Equipment] ADD CONSTRAINT [CK_Equipment_InstallationDateOrFire] CHECK ([InstallationDate] IS NOT NULL OR [InventoryCategory] = 10);

CREATE UNIQUE INDEX [UX_AssetMigrationLog_SourceTable_SourceId] ON [AssetMigrationLog] ([SourceTable], [SourceId]) WHERE [SourceTable] IS NOT NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260927145019_AddFireDetailsToEquipment', N'10.0.10');

COMMIT;
GO

