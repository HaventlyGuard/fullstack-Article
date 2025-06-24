namespace ArticleReviewSystem.API.Contracts
{
    public record ReviewRequest(
        string recomendation,
        int rating,
        string comment,
        Guid articleId,
        int completePercent);
}
