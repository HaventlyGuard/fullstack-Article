using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<Guid> CreateUser(User user);
        Task DeleteUserById(Guid id);
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(Guid id);
        Task<User> GetByEmail(string email);
        Task<Role> GetRoleByName(string name);
        Task<User> UpdateRoleByUserId(Guid id, Role role);
        Task<User> UpdateUser(Guid guid, User updatedUser);
    }
}
