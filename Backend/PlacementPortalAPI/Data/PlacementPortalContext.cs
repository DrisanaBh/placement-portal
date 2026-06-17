using Microsoft.EntityFrameworkCore;
using PlacementPortalAPI.Models;

namespace PlacementPortalAPI.Data;

public class PlacementPortalContext : DbContext
{
    public PlacementPortalContext(
        DbContextOptions<PlacementPortalContext> options)
        : base(options)
    {
    }

    public DbSet<StudentDetail> StudentDetails { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<ApplicationTracker> ApplicationTrackers { get; set; }
    public DbSet<StudentSkill> StudentSkills { get; set; }
    public DbSet<JobSkill> JobSkills { get; set; }
    public DbSet<Faculty> Faculty { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserTable> UserTables { get; set; }
    public DbSet<StudentTable> StudentTables { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StudentDetail>()
            .HasNoKey()
            .ToView("StudentDetails");
        modelBuilder.Entity<Job>()
        .HasNoKey()
        .ToView("Jobs");
        modelBuilder.Entity<ApplicationTracker>()
    .HasNoKey()
    .ToView("StudentApplicationTracker");
        modelBuilder.Entity<StudentSkill>()
    .HasNoKey()
    .ToView("StudentSkills");

        modelBuilder.Entity<JobSkill>()
            .HasNoKey()
            .ToView("JobSkills");
        modelBuilder.Entity<Faculty>()
    .HasNoKey()
    .ToView("Faculty");

        modelBuilder.Entity<User>()
            .HasNoKey()
            .ToView("Users");
        modelBuilder.Entity<UserTable>()
    .ToTable("Users")
    .HasKey(u => u.UserID);

        modelBuilder.Entity<StudentTable>()
            .ToTable("Students")
            .HasKey(s => s.StudentID);
    }
}