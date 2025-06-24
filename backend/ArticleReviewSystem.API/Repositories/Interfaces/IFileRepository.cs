namespace ArticleReviewSystem.API.Repositories.Interfaces
{
    public interface IFileRepository
    {
        Task<DataAccess.Entities.File> GetFileById(Guid id);
        Task<bool> IsFileExist(Guid id);
    }
}
