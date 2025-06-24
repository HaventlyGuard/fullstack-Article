namespace ArticleReviewSystem.API.Response;

public record ArticleResponse(
    Guid id,
    string title,
    string Textcontent,
    string status,
    List<Guid> authors,
    List<string> tags,
    string category,
    DateTime CreatedAt,
    DateTime UpdatedAt
    )
{
    public Guid? FileId { get; set; } = null;
    public string? FileName { get; set; } = null;
}