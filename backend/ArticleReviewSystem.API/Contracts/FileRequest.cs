namespace ArticleReviewSystem.API.Contracts
{
    public record FileRequest(
        string name,
        string type,
        string content);
}
