using ArticleReviewSystem.API.Exceptions;
using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess.Entities;

namespace ArticleReviewSystem.API.Services
{
    public class UserService(IUserRepository userRepository)
    {
        public async Task<User> UpdateUserById(Guid id, User updatedUser) => await userRepository.UpdateUser(id, updatedUser);
        public async Task<Role> GetRoleByName(string roleName)
        {
            var role = await userRepository.GetRoleByName(roleName);
            if (role == null)
            {
                throw new InvalidArgumentException("Unknown role name");
            }
            return role;
        }
        public async Task<IEnumerable<User>> GetUsers() => await userRepository.GetAll();
        public async Task<User> GetUserbyId(Guid id) => await userRepository.GetById(id);
        public async Task<User> GetUserByEmail(string email) => await userRepository.GetByEmail(email);
        public async Task<Guid> CreateUser(User user, string roleName)
        {
            var role = await userRepository.GetRoleByName(roleName);
            if (role == null)
            {
                throw new InvalidArgumentException("Unknown role name");
            }
            user.Role = role;
            return await userRepository.CreateUser(user);
        }
        public async Task<User> UpdateRole(Guid id, string roleName)
        {
            var role = await userRepository.GetRoleByName(roleName);
            if (role == null)
            {
                throw new InvalidArgumentException("Unknown role name");
            }
            return await userRepository.UpdateRoleByUserId(id, role);
        }
        public async Task DeleteUser(Guid id)
        {
            var user = await userRepository.GetById(id);
            if (user == null)
            {
                throw new InvalidArgumentException("Id user is not exist");
            }
            await userRepository.DeleteUserById(id);
        }
    }
}
