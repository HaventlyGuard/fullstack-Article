namespace ArticleReviewSystem.API.Response
{
    public record UserRequest(
        string FullName,
        string Email,
        string Specillization,
        string Role,
        string? Bio,
        string? Location
        );
}
