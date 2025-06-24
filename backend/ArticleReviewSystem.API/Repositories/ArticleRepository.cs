using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using File = ArticleReviewSystem.DataAccess.Entities.File;

namespace ArticleReviewSystem.API.Repositories;

public class ArticleRepository(ArticleReviewSystemDbContext dbContext) : IArticleRepository
{
    public async Task<IEnumerable<Article>> GetAllByAuthorId(Guid authorId)
    {
        return await dbContext.Articles
            .Include(a => a.Authors)
            .Include(a => a.Tags)
            .Where(article => article.Authors.Any(author => author.Id == authorId))
            .ToListAsync();
    }

    public async Task<Guid> CreateArticle(Article article)
    {
        if(article.FileId == null)
        {
            dbContext.Articles.AddAsync(article);
        }
        else
        {
            var file = new File
            {
                Id = (Guid)article.FileId,
                Name = article.FileContent.Name,
                Content = article.FileContent.Content,
                Type = article.FileContent.Type,
            };
            dbContext.Files.AddAsync(file);
            dbContext.Articles.AddAsync(article);
        }
        await dbContext.SaveChangesAsync();
        return article.Id;
    }

    

    public Task<IEnumerable<Article>> GetAll()
    {
        return Task.FromResult<IEnumerable<Article>>(dbContext.Articles
            .Include(a => a.Authors)
            .Include(a => a.Tags));
    }

    public async Task<Article> GetById(Guid id)
    {
        return await dbContext.Articles.Include(a => a.Tags)
            .Include(a=> a.Authors)
            .Include(a => a.FileContent)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Article> UpdateById(Guid id, Article article)
    {
        var updatedArticle = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (updatedArticle != null)
            updatedArticle = article;                
        await dbContext.SaveChangesAsync();
        return article;
    }

    public async Task<Article> UpdateStatusById(Guid id, StatusArticle status)
    {
        var updatedArticle = await dbContext.Articles.FirstOrDefaultAsync(a => a.Id == id);
        if (updatedArticle == null)
            return null;
        updatedArticle.Status = status;
        await dbContext.SaveChangesAsync();
        return updatedArticle;
    }

    public async Task<Article> Update(Article article)
    {
        dbContext.Articles.Update(article);
        await dbContext.SaveChangesAsync();
        return article;
    }
    
    public async Task DeleteById(Guid id)
    {
        var deletedItem = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id);
        dbContext.Articles.Remove(deletedItem);
        await dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetUsersById(IEnumerable<Guid> userIds)
    {
        var users = new List<User>();
        foreach (var userId in userIds)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.Equals(userId));
            if (user != null)
                users.Add(user);
            else
            {
                return null;
            }
        }
        return users;
    }

    public async Task<IEnumerable<Tag>> GetTagsByNames(IEnumerable<string> tagsName)
    {
        var tags = new List<Tag>();
        foreach (var tagName in tagsName)
        {
            var tag = await dbContext.Tags.FirstOrDefaultAsync(t => t.Name.Equals(tagName));
            if (tag == null)
            {
                tag = new Tag() { Id = new Guid(), Name = tagName };
                await dbContext.Tags.AddAsync(tag);
            }
            tags.Add(tag);
        }
        return tags;
    }
}