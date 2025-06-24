namespace ArticleReviewSystem.API.Response
{
    public record UserResponse(
        Guid Id,
        string FullName,
        string Email,
        string Specillization,
        string Role,
        string? location,
        string? bio
        );
}
