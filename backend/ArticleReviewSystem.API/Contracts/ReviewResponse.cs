using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Contracts
{
    public record ReviewResponse(
        Guid reviewId,
        Guid articleId,
        string titleArticle,
        List<string> fullName,
        int rating,
        string comment,
        string recomendation);
}
