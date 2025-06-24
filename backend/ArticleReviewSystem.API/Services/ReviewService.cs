using ArticleReviewSystem.API.Exceptions;
using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.API.Services.Helpers;
using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Services
{
    public class ReviewService(IReviewRepository _repository)
    {
        public async Task<IEnumerable<Review>> GetFilteredReviewsByUserId(Guid userId, ReviewQueryFilter filter)
        {
            var reviewer = await _repository.GetUserById(userId);
            if (reviewer == null)
            {
                throw new InvalidArgumentException($"User whith id: {userId} is not found");
            }
            var reviewList = await _repository.GetAllByUserId(userId);
            switch (filter)
            {
                case ReviewQueryFilter.all:
                    return reviewList;
                case ReviewQueryFilter.inProgress:
                    return reviewList.Where(r => r.Recommendation == Recommendation.Processing).ToList();
                case ReviewQueryFilter.completed:
                    return reviewList.Where(r => r.Recommendation == Recommendation.Accept).ToList();
                default:
                    throw new InvalidArgumentException($"Unknown filter");
            }
        }

        public async Task<IEnumerable<Review>> GetReviewList() => await _repository.GetAllReviews();

        public async Task<Review> GetReview(Guid id)
        {
            bool isExist = await _repository.IsReviewExistById(id);
            if (!isExist)
                throw new InvalidArgumentException($"Review with id: {id} is not found");
            return await _repository.GetReviewById(id);
        }

        public async Task<bool> IsReviewNotExist(Guid id)
        {
            var exist = await _repository.IsReviewExistById(id);
            return !exist;
        }

        public async Task<Guid> CreateReview(Review newReview)
        {
            var reviewer = await _repository.GetUserById(newReview.UserId);
            if (reviewer == null)
            {
                throw new InvalidArgumentException($"User whith id: {newReview.UserId} is not found");
            }
            if (reviewer.Role.Name != "Reviewer")
            {
                throw new InvalidArgumentException($"User must have Review role");
            }
            try
            {
                Guid reviewGuid = await _repository.AddReview(newReview);
                bool isExist = await _repository.IsReviewExistById(reviewGuid);
                if (!isExist)
                    throw new InvalidArgumentException($"Review whith id: {reviewGuid} is not found");

                return reviewGuid;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public async Task<Review> UpdateReview(Review review) => await _repository.UpdateReview(review);
    }
}
