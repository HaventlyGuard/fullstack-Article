namespace ArticleReviewSystem.API.Contracts
{
    public record ReviewShortResponse(
        Guid Id,
        string titleArticle,
        List<string> authors,
        string createdAt,
        string? recomendation,
        int? rating,
        int? completePercent);
}
