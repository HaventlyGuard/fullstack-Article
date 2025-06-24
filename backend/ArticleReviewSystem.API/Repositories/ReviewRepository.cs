using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.API.Repositories
{
    public class ReviewRepository(ArticleReviewSystemDbContext _context) : IReviewRepository
    {
        public async Task<IEnumerable<Review>> GetAllByUserId(Guid userId) => await _context.Reviews
            .Where(r => r.UserId == userId)
            .Include(r => r.Article)
            .ThenInclude(a => a.Authors)
            .ToListAsync();

        public async Task<IEnumerable<Review>> GetAllReviews() => await _context.Reviews.ToListAsync();

        public async Task<bool> IsReviewExistById(Guid id) => await _context.Reviews.AnyAsync(r => r.Id == id);

        public async Task<Review> GetReviewById(Guid id) => await _context.Reviews
            .Include(r => r.Article)
            .ThenInclude(a => a.Authors)
            .FirstOrDefaultAsync(r => r.Id == id);

        public async Task<Guid> AddReview(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            var exist = await IsReviewExistById(review.Id);
            if (exist)
            {
                var article = await _context.Articles.FirstOrDefaultAsync(a => a.Id == review.ArticleId);
                article.Status = StatusArticle.Accepted;
                await _context.SaveChangesAsync();
            }
            return review.Id;
        }

        public async Task<Review> UpdateReview(Review review)
        {
            _context.Update(review);
            await _context.SaveChangesAsync();
            return review;
        }
        public async Task<User> GetUserById(Guid id) => await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
    }
}
