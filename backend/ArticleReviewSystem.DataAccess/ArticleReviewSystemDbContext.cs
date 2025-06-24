using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.DataAccess
{
    public class ArticleReviewSystemDbContext : DbContext
    {
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Entities.File> Files { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public ArticleReviewSystemDbContext(DbContextOptions<ArticleReviewSystemDbContext> options)
            :base(options)
        {
            //Database.EnsureCreated();
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .HasPrincipalKey(r => r.Id);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();


            modelBuilder.Entity<Article>()
                .Property(a => a.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Article>()
                .HasOne(a => a.FileContent)
                .WithMany(f => f.Articles)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Article>()
                .HasMany(a => a.Reviews)
                .WithOne(r => r.Article)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .Property(a => a.Rating)
                .HasConversion<string>();

            modelBuilder.Entity<Review>()
                .Property(a => a.Recommendation)
                .HasConversion<string>();
        }
    }
}
