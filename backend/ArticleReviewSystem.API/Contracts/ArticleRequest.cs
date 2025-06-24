using ArticleReviewSystem.DataAccess.Entities;
using File = ArticleReviewSystem.DataAccess.Entities.File;

namespace ArticleReviewSystem.API.Contracts;

public record ArticleRequest(
    string title,
    string TextContent,
    List<Guid> authors,
    List<string> tags,
    string category,
    FileRequest? file
    );