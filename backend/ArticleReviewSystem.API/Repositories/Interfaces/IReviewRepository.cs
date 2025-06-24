
using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<Review> UpdateReview(Review review);
        Task<Guid> AddReview(Review review);
        Task<IEnumerable<Review>> GetAllByUserId(Guid userId);
        Task<IEnumerable<Review>> GetAllReviews();
        Task<Review> GetReviewById(Guid id);
        Task<User> GetUserById(Guid id);
        Task<bool> IsReviewExistById(Guid id);
    }
}
