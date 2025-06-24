using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Query;

namespace ArticleReviewSystem.API.Repositories.Interfaces;

public interface IArticleRepository
{
    Task<Guid> CreateArticle(Article article);
    Task<IEnumerable<Article>> GetAll();
    Task<Article> GetById(Guid id);
    Task<Article> Update(Article article);
    Task<Article> UpdateById(Guid id,Article article);
    Task<Article> UpdateStatusById(Guid id,StatusArticle status);
    Task DeleteById(Guid id);
    Task<IEnumerable<User>> GetUsersById(IEnumerable<Guid> userIds);
    Task<IEnumerable<Tag>> GetTagsByNames(IEnumerable<string> tagsName);
    Task<IEnumerable<Article>> GetAllByAuthorId(Guid authorId);
}