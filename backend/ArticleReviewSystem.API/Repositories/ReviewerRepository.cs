using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.API.Repositories
{
    public class ReviewerRepository(ArticleReviewSystemDbContext _dbContext) : IReviewerRepository
    {
        public async Task<bool> IsUserExist(Guid id)
        {
            return await _dbContext.Users.AnyAsync(u => u.Id == id);
        }

        public async Task<User> GetReviewerById(Guid id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<IEnumerable<Review>> GetUserReviewsByIdUser(Guid id)
        {
            var user = await _dbContext.Users
                .Include(u => u.Reviews)
                .ThenInclude(r => r.Article)
                .FirstOrDefaultAsync(u => u.Id == id);

            var reviewList = user.Reviews.ToList();
            if (reviewList == null || reviewList.Count == 0)
            {
                return null;
            }
            return reviewList;
        }
    }
}
