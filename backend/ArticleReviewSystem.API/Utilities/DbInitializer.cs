using ArticleReviewSystem.DataAccess;
using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Utilities
{
    public static class DbInitializer
    {
        public static void Initialize(ArticleReviewSystemDbContext context)
        {
            //context.Database.EnsureCreated();

            SeedRoles(context);
            SeedTags(context);
            SeedUsers(context);
            SeedFiles(context);
            SeedArticles(context);
            SeedReviews(context);
        }

        private static void SeedRoles(ArticleReviewSystemDbContext context)
        {
            if (context.Roles.Any()) return;

            var roles = new[]
            {
            new Role { Id = Guid.NewGuid(), Name = "Admin" },
            new Role { Id = Guid.NewGuid(), Name = "Author" },
            new Role { Id = Guid.NewGuid(), Name = "Reviewer" }
        };

            context.Roles.AddRange(roles);
            context.SaveChanges();
        }


        private static void SeedTags(ArticleReviewSystemDbContext context)
        {
            if (context.Tags.Any()) return;

            var tags = new[]
            {
            new Tag { Id = Guid.NewGuid(), Name = "Programming" },
            new Tag { Id = Guid.NewGuid(), Name = "AI" },
            new Tag { Id = Guid.NewGuid(), Name = "Medicine" },
            new Tag { Id = Guid.NewGuid(), Name = "Space" }
        };

            context.Tags.AddRange(tags);
            context.SaveChanges();
        }

        private static void SeedUsers(ArticleReviewSystemDbContext context)
        {
            if (context.Users.Any()) return;

            var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");
            if (adminRole == null) return;

            var users = new[]
            {
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Admin User",
                Email = "admin@example.com",
                Specillization = "System Administrator",
                Password = "hashed_password_here", // В реальном приложении используйте хеширование
                Role = adminRole
                //RoleId = adminRole.Id
            }
        };

            context.Users.AddRange(users);
            context.SaveChanges();
        }

        private static void SeedFiles(ArticleReviewSystemDbContext context)
        {
            if (context.Files.Any()) return;

            // Пример файла-заглушки
            var files = new[]
            {
            new ArticleReviewSystem.DataAccess.Entities.File
            {
                Id = Guid.NewGuid(),
                Name = "placeholder.png",
                Type = "image/png",
                Content = new byte[0] // В реальном приложении загрузите реальный файл
            }
        };

            context.Files.AddRange(files);
            context.SaveChanges();
        }

        private static void SeedArticles(ArticleReviewSystemDbContext context)
        {
            if (context.Articles.Any()) return;

            var placeholderFile = context.Files.FirstOrDefault();
            var adminUser = context.Users.FirstOrDefault();
            var tags = context.Tags.Take(2).ToList();

            var articles = new[]
            {
            new Article
            {
                Id = Guid.NewGuid(),
                Title = "Getting Started with Entity Framework Core",
                TextContent = "This is a sample article content...",
                Status = StatusArticle.Not_reviewed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Category = "Technology",
                FileId = placeholderFile.Id,
                Tags = tags
            }
        };

            context.Articles.AddRange(articles);
            context.SaveChanges();
        }

        private static void SeedReviews(ArticleReviewSystemDbContext context)
        {
            if (context.Reviews.Any()) return;

            var article = context.Articles.FirstOrDefault();
            var user = context.Users.FirstOrDefault();

            if (article == null || user == null) return;

            var reviews = new[]
            {
            new Review
            {
                Id = Guid.NewGuid(),
                Rating = Rating.Four,
                Comment = "Great article!",
                Recommendation = Recommendation.Processing,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = user.Id,
                ArticleId = article.Id, 
                Progress = 100
            }
        };

            context.Reviews.AddRange(reviews);
            context.SaveChanges();
        }
    }
}
