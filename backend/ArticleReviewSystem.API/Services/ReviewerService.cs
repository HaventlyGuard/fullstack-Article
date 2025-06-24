using ArticleReviewSystem.API.Exceptions;
using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.API.Services.Helpers;
using ArticleReviewSystem.DataAccess.Entities;
using System.Linq;

namespace ArticleReviewSystem.API.Services
{
    public class ReviewerService(IReviewerRepository _repository)
    {
        public async Task<User> GetReviewer(Guid id)
        {
            var user = await _repository.GetReviewerById(id);
            if (user == null)
            {
                throw new InvalidArgumentException("Id user is not exist");
            }
            return user;
        }

        public async Task<ReviewStat> GetUserReviewStat(Guid id)
        {
            var isUserExist = await _repository.IsUserExist(id);
            if (!isUserExist)
            {
                throw new InvalidArgumentException("Id user is not exist");
            }


            var reviewList = await _repository.GetUserReviewsByIdUser(id);
            if (reviewList == null)
            {
                return null;
            }
            var stat = new ReviewStat();

            stat.Total = reviewList.Count();
            stat.Completed = reviewList.Where(r => 
                r.Article.Status == StatusArticle.Accepted || 
                r.Article.Status == StatusArticle.Rejected).Count();
            stat.InProgres = reviewList.Where(r => r.Article.Status == StatusArticle.Revisions).Count();

            return stat;
        }
    }
}
