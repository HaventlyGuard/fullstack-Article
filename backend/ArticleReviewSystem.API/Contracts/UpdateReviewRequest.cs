namespace ArticleReviewSystem.API.Contracts
{
    public record UpdateReviewRequest(
        string recomendation,
        int rating,
        string comment,
        int completePercent);
}
