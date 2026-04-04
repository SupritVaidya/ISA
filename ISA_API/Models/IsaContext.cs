using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ISA_API.Models;

public partial class IsaContext : DbContext
{
    public IsaContext(DbContextOptions<IsaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventRegistration> EventRegistrations { get; set; }

    public virtual DbSet<GuestOtp> GuestOtps { get; set; }

    public virtual DbSet<GuestRegistration> GuestRegistrations { get; set; }

    public virtual DbSet<User> Users { get; set; }

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

        modelBuilder.Entity<GuestOtp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GuestOtp__3214EC079EFD0BC8");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
            entity.Property(e => e.OtpCode).HasMaxLength(10);
        });

        modelBuilder.Entity<GuestRegistration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__GuestReg__3214EC07F376D492");

            entity.HasIndex(e => new { e.EventId, e.Email }, "UQ_Guest_Event_Email").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.Organization).HasMaxLength(200);
            entity.Property(e => e.RegisteredAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Event).WithMany(p => p.GuestRegistrations)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GuestReg_Event");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07F840623A");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053457A92E59").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.StudentId).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
