using ArticleReviewSystem.DataAccess.Entities;
using File = ArticleReviewSystem.DataAccess.Entities.File;

namespace ArticleReviewSystem.API.Contracts;

public record ArticleRequestToUpdateStatus(
    StatusArticle status
    );