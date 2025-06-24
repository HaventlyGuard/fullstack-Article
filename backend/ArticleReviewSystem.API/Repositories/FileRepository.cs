using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.API.Repositories
{
    public class FileRepository(ArticleReviewSystemDbContext _context) : IFileRepository
    {
        public async Task<DataAccess.Entities.File> GetFileById(Guid id) => await _context.Files.FirstOrDefaultAsync(f => f.Id == id);

        public async Task<bool> IsFileExist(Guid id) => await _context.Files.AnyAsync(f => f.Id == id);
    }
}
