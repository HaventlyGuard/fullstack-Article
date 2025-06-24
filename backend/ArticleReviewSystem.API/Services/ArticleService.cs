using ArticleReviewSystem.API.Exceptions;
using ArticleReviewSystem.API.Repositories;
using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.API.Services.Helpers;
using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Services;

public class ArticleService(IArticleRepository articleRepository)
{
    public async Task<IEnumerable<Article>> GetFilteredArticleByAuthorId(Guid authorId, ArticleQueryFilter filter)
    {
        var articleList =  await GetAllArticlesByAuthorId(authorId);
        switch (filter)
        {
            case ArticleQueryFilter.all:
                return articleList;
            case ArticleQueryFilter.review:
                return articleList.Where(a => a.Status == StatusArticle.Revisions).ToList();
            case ArticleQueryFilter.submit:
                return articleList.Where(a => a.Status == StatusArticle.Accepted || a.Status == StatusArticle.Rejected).ToList();
            default:
                throw new InvalidArgumentException("Invalid filter");
        }
    }

    public async Task<IEnumerable<Article>> GetAllArticles() => await articleRepository.GetAll();
    public async Task<Article> GetById(Guid id) => await articleRepository.GetById(id);
    public async Task<Guid> CreateArticle(Article article) => await articleRepository.CreateArticle(article);
    public async Task DeleteArticle(Guid id)
    {
        if (await GetById(id) is null)
            throw new InvalidArgumentException("Article not found");
        await articleRepository.DeleteById(id);
    }
    public async Task<Article> UpdateArticle(Article article) => await articleRepository.Update(article);
    public async Task<Article> UpdateArticleById(Guid id, Article article) => await articleRepository.UpdateById(id, article);
    public async Task<Article> UpdateArticleStatusById(Guid id, StatusArticle status) => await articleRepository.UpdateStatusById(id, status);
    public async Task<IEnumerable<User>> GetUsersById(IEnumerable<Guid> userIds) => await articleRepository.GetUsersById(userIds);
    public async Task<IEnumerable<Tag>> GetTagsByNames(IEnumerable<string> tagsName) => await articleRepository.GetTagsByNames(tagsName);

    private async Task<IEnumerable<Article>> GetAllArticlesByAuthorId(Guid authorId) => await articleRepository.GetAllByAuthorId(authorId);
}