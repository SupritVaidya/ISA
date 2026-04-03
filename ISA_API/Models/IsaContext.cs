using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ISA_API.Models;

public partial class IsaContext : DbContext
{
    public IsaContext()
    {
    }

    public IsaContext(DbContextOptions<IsaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventRegistration> EventRegistrations { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=ISA;Trusted_Connection=True;MultipleActiveResultSets=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Events__3214EC0789780F10");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.Location).HasMaxLength(300);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__EventReg__3214EC07B9A247BD");

            entity.HasIndex(e => e.EventId, "IX_Registrations_EventId");

            entity.HasIndex(e => e.UserId, "IX_Registrations_UserId");

            entity.HasIndex(e => new { e.UserId, e.EventId }, "UQ_User_Event").IsUnique();

            entity.Property(e => e.RegisteredAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK_Reg_Event");

            entity.HasOne(d => d.User).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Reg_User");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07F840623A");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053457A92E59").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.StudentId).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
