using ArticleReviewSystem.API.AuthenticationOptions;
using ArticleReviewSystem.API.Contracts;
using ArticleReviewSystem.API.Repositories;
using ArticleReviewSystem.API.Response;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.API.Services.Helpers;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace ArticleReviewSystem.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ArticleController(ArticleService articleService, ILogger<ArticleController> log) : Controller
{
    /// <summary>
    /// Получение короткого списка статей для автора(по id из токена) и их фильтрация(через запрос по ссылке)
    /// </summary>
    /// <param name="filter"></param>
    /// <returns></returns>
    [HttpGet("ByAuthor", Name = "GetArticleByAuthorId")]
    [Authorize(Roles = "Author")]
    public async Task<ActionResult<IEnumerable<Article>>> GetArticleByAuthorId([FromQuery] ArticleQueryFilter filter = ArticleQueryFilter.all)
    {
        log.LogInformation($"Request GetArticleByAuthorId whith filter - {filter}");
        try
        {
            var authorId = TokenData.GetUserIdFromCookie(HttpContext);
            if (authorId == null )
            {
                log.LogWarning("GetArticleByAuthorId. Null userId from token");
                return BadRequest("Invalid information from token");
            }

            var articles = await articleService.GetFilteredArticleByAuthorId(Guid.Parse(authorId), filter);
            if (articles == null)
            {
                log.LogWarning($"GetArticleByAuthorId. Not found article by authorId - {authorId}");
                return Ok(Enumerable.Empty<Article>());
            }

            var response = articles.Select(a => new ArticleShortResponse
            (
                a.Id,
                a.Authors.Select(author => author.FullName).ToList(),
                a.Title,
                a.Status.ToString(),
                a.Tags?.Select(t => t.Name).ToList(),
                a.Category,
                a.CreatedAt.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture)
            ));
            return Ok(response);

        }
        catch (Exception ex)
        {
            log.LogError("GetArticleByAuthorId error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    [HttpGet(Name = "GetArticles")]
    public async Task<ActionResult<IEnumerable<ArticleShortResponse>>> GetArticles()
    {
        log.LogInformation("Request GetArticles");
        try
        {
            var articles = await articleService.GetAllArticles();
            if (articles == null)
            {
                log.LogInformation("GetArticles response - null objects");
                return StatusCode(500);
            }

            var response = articles.Select(a => new ArticleShortResponse
            (
                a.Id,
                a.Authors.Select(author => author.FullName).ToList(),
                a.Title,
                a.Status.ToString(),
                a.Tags.Select(t => t.Name).ToList(),
                a.Category,
                a.CreatedAt.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture)
            ));
            return Ok(response);

        }
        catch (Exception ex)
        {
            log.LogError("GetAllArticles error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    [HttpGet("{id}", Name = "GetArticleById")]
    public async Task<ActionResult<ArticleResponse>> GetArticleById(Guid id)
    {
        log.LogInformation("Request GetArticleById with id: " + id);
        try
        {
            var a = await articleService.GetById(id);
            if (a == null)
            {
                log.LogInformation("GetArticleById response - null object");
                return NotFound();
            }

            var response = new ArticleResponse(
                    a.Id,
                    a.Title,
                    a.TextContent,
                    a.Status.ToString(),
                    a.Authors.Select(a => a.Id).ToList(),
                    a.Tags.Select(t => t.Name).ToList(),
                    a.Category,
                    a.CreatedAt,
                    a.UpdatedAt
                );

            if (a.FileId != null)
            {
                response.FileId = a.FileId;
                response.FileName = $"{a.FileContent.Name}.{a.FileContent.Type}";
            }
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            log.LogError("GetArticleById error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }
    [Authorize(Roles = "Author")]
    [HttpPost(Name = "PostArticle")]
    public async Task<ActionResult<Guid>> CreateArticle([FromBody] ArticleRequest articleRequest)
    {
        log.LogInformation("Request PostArticle");
        try
        {
            Article article;
            var authors = await articleService.GetUsersById(articleRequest.authors);
            if (authors == null)
                return NotFound("One of the authors is not a user");
            var tags = await articleService.GetTagsByNames(articleRequest.tags);

            article = new Article()
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.Now.ToUniversalTime(),
                Title = articleRequest.title,
                TextContent = articleRequest.TextContent,
                Authors = authors,
                Tags = tags,
                Category = articleRequest.category,
                UpdatedAt = DateTime.Now.ToUniversalTime(),
                Status = StatusArticle.Not_reviewed
            };


            if (articleRequest.file != null)
            {
                article.FileContent = new DataAccess.Entities.File()
                {
                    Id = Guid.NewGuid(),
                    Name = articleRequest.file.name,
                    Type = articleRequest.file.type,
                    Content = Convert.FromBase64String(articleRequest.file.content)
                };
            }

            var articleId = await articleService.CreateArticle(article);
            var fileId = article.FileId;
            return Ok(articleId);
        }
        catch (Exception ex)
        {
            log.LogError("PostArticle error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }
    [Authorize(Roles = "Reviewer, Admin")]
    [HttpPatch ("{id}", Name = "PatchArticle")]
    public async Task<ActionResult<Article>> UpdateArticleStatus(Guid id,[FromBody] ArticleRequestToUpdateStatus articleRequestToUpdateStatus)
    {
        try
        {
            var article = await articleService.UpdateArticleStatusById(id, articleRequestToUpdateStatus.status);
            return Ok(article);
        }
        catch (Exception ex)
        {
            log.LogError("PatchArticle error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }
    [Authorize(Roles = "Admin, Author")]
    [HttpDelete("{id}", Name = "DeleteArticle")]
    public async Task<ActionResult<Guid>> DeleteArticle(Guid id)
    {
        try
        {
            await articleService.DeleteArticle(id);
            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError("DeleteArticle error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }
}