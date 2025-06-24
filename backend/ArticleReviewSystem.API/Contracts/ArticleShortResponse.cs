using Microsoft.EntityFrameworkCore.Metadata;

namespace ArticleReviewSystem.API.Response;

public record ArticleShortResponse(
    Guid id,
    List<string> fullNames,
    string title,
    string status,
    List<string> tags,
    string category,
    string createdAt
    );