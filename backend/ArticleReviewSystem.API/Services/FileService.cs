using ArticleReviewSystem.API.Exceptions;
using ArticleReviewSystem.API.Repositories;
using ArticleReviewSystem.API.Repositories.Interfaces;

namespace ArticleReviewSystem.API.Services
{
    public class FileService(IFileRepository _repository)
    {
        public async Task<DataAccess.Entities.File> GetFile(Guid id)
        {
            if (await IsNotFileExist(id))
                throw new InvalidArgumentException($"File whith id: {id}, is not found");
            return await _repository.GetFileById(id);
        }

        public async Task<bool> IsNotFileExist(Guid id)
        {
            var exist = await _repository.IsFileExist(id);
            return !exist;
        }
    }
}
