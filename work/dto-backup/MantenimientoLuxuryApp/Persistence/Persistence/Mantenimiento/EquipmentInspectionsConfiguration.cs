using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace MantenimientoLuxuryApp.Persistence.Persistence.Mantenimiento;

public class EquipmentInspectionDefinitionConfiguration : IEntityTypeConfiguration<EquipmentInspectionDefinition>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionDefinition> builder)
    {
        builder.HasIndex(x => new { x.CustomerId, x.MachineryId, x.IsActive });

        builder.Property(x => x.Name).HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(500);

        builder.HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne(x => x.Machinery)
            .WithMany(x => x.EquipmentInspectionDefinitions)
            .HasForeignKey(x => x.MachineryId);

        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId);
    }
}

public class EquipmentInspectionDefinitionAssigneeConfiguration : IEntityTypeConfiguration<EquipmentInspectionDefinitionAssignee>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionDefinitionAssignee> builder)
    {
        builder.HasIndex(x => new { x.EquipmentInspectionDefinitionId, x.ApplicationUserId }).IsUnique();

        builder.HasOne(x => x.EquipmentInspectionDefinition)
            .WithMany(x => x.Assignees)
            .HasForeignKey(x => x.EquipmentInspectionDefinitionId);

        builder.HasOne(x => x.ApplicationUser)
            .WithMany()
            .HasForeignKey(x => x.ApplicationUserId);
    }
}

public class EquipmentInspectionDefinitionWeekDayConfiguration : IEntityTypeConfiguration<EquipmentInspectionDefinitionWeekDay>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionDefinitionWeekDay> builder)
    {
        builder.HasIndex(x => new { x.EquipmentInspectionDefinitionId, x.WeekDay }).IsUnique();

        builder.HasOne(x => x.EquipmentInspectionDefinition)
            .WithMany(x => x.WeekDays)
            .HasForeignKey(x => x.EquipmentInspectionDefinitionId);
    }
}

public class EquipmentInspectionCriterionConfiguration : IEntityTypeConfiguration<EquipmentInspectionCriterion>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionCriterion> builder)
    {
        builder.HasIndex(x => new { x.EquipmentInspectionDefinitionId, x.Position }).IsUnique();

        builder.Property(x => x.Title).HasMaxLength(150);
        builder.Property(x => x.Description).HasMaxLength(500);

        builder.HasOne(x => x.EquipmentInspectionDefinition)
            .WithMany(x => x.Criteria)
            .HasForeignKey(x => x.EquipmentInspectionDefinitionId);
    }
}

public class EquipmentInspectionExecutionConfiguration : IEntityTypeConfiguration<EquipmentInspectionExecution>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionExecution> builder)
    {
        builder.HasIndex(x => new { x.CustomerId, x.MachineryId, x.ExecutionDate });
        builder.HasIndex(x => new { x.EquipmentInspectionDefinitionId, x.Status });
        builder.HasIndex(x => new { x.AssignedToUserId, x.Status });

        builder.Property(x => x.Observations).HasMaxLength(1000);
        builder.Property(x => x.AdministrativeModificationReason).HasMaxLength(500);

        builder.HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne(x => x.Machinery)
            .WithMany(x => x.EquipmentInspectionExecutions)
            .HasForeignKey(x => x.MachineryId);

        builder.HasOne(x => x.EquipmentInspectionDefinition)
            .WithMany(x => x.Executions)
            .HasForeignKey(x => x.EquipmentInspectionDefinitionId);

        builder.HasOne(x => x.AssignedToUser)
            .WithMany()
            .HasForeignKey(x => x.AssignedToUserId);

        builder.HasOne(x => x.ExecutedByUser)
            .WithMany()
            .HasForeignKey(x => x.ExecutedByUserId);

        builder.HasOne(x => x.LastModifiedByUser)
            .WithMany()
            .HasForeignKey(x => x.LastModifiedByUserId);

        builder.HasOne(x => x.GeneratedFromQrLabel)
            .WithMany(x => x.Executions)
            .HasForeignKey(x => x.GeneratedFromQrLabelId);
    }
}

public class EquipmentInspectionExecutionItemConfiguration : IEntityTypeConfiguration<EquipmentInspectionExecutionItem>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionExecutionItem> builder)
    {
        builder.HasIndex(x => new { x.EquipmentInspectionExecutionId, x.EquipmentInspectionCriterionId }).IsUnique();

        builder.Property(x => x.Observation).HasMaxLength(500);

        builder.HasOne(x => x.EquipmentInspectionExecution)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.EquipmentInspectionExecutionId);

        builder.HasOne(x => x.EquipmentInspectionCriterion)
            .WithMany(x => x.ExecutionItems)
            .HasForeignKey(x => x.EquipmentInspectionCriterionId);
    }
}

public class EquipmentInspectionExecutionImageConfiguration : IEntityTypeConfiguration<EquipmentInspectionExecutionImage>
{
    public void Configure(EntityTypeBuilder<EquipmentInspectionExecutionImage> builder)
    {
        builder.Property(x => x.ImagePath).HasMaxLength(500);
        builder.Property(x => x.Caption).HasMaxLength(250);

        builder.HasOne(x => x.EquipmentInspectionExecution)
            .WithMany(x => x.Images)
            .HasForeignKey(x => x.EquipmentInspectionExecutionId);

        builder.HasOne(x => x.UploadedByUser)
            .WithMany()
            .HasForeignKey(x => x.UploadedByUserId);
    }
}

public class EquipmentQrLabelConfiguration : IEntityTypeConfiguration<EquipmentQrLabel>
{
    public void Configure(EntityTypeBuilder<EquipmentQrLabel> builder)
    {
        builder.HasIndex(x => new { x.CustomerId, x.Code }).IsUnique();
        builder.HasIndex(x => new { x.MachineryId, x.IsActive });

        builder.Property(x => x.Code).HasMaxLength(120);
        builder.Property(x => x.Name).HasMaxLength(120);
        builder.Property(x => x.DeepLink).HasMaxLength(500);
        builder.Property(x => x.Notes).HasMaxLength(500);

        builder.HasOne(x => x.Customer)
            .WithMany()
            .HasForeignKey(x => x.CustomerId);

        builder.HasOne(x => x.Machinery)
            .WithMany(x => x.EquipmentQrLabels)
            .HasForeignKey(x => x.MachineryId);

        builder.HasOne(x => x.PrintedByUser)
            .WithMany()
            .HasForeignKey(x => x.PrintedByUserId);
    }
}
