using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Repositories.Interfaces
{
    public interface IReviewerRepository
    {
        Task<User> GetReviewerById(Guid id);
        Task<IEnumerable<Review>> GetUserReviewsByIdUser(Guid id);
        Task<bool> IsUserExist(Guid id);
    }
}
