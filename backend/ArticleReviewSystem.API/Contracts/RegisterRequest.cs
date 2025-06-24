namespace ArticleReviewSystem.API.Contracts
{
    public record RegisterRequest(
        string FullName,
        string Email,
        string Specillization,
        string Role,
        string Password
        );
}
