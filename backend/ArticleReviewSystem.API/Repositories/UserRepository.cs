using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.DataAccess;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.API.Repositories
{
    public class UserRepository(ArticleReviewSystemDbContext _dbContext) : IUserRepository
    {
        public async Task<User> UpdateUser(Guid guid, User updatedUser)
        {
            var u = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == guid);
            u.FullName = updatedUser.FullName;
            u.Email = updatedUser.Email;
            u.Specillization = updatedUser.Specillization;
            u.Location = updatedUser.Location;
            u.Bio = updatedUser.Bio;
            u.RoleId = updatedUser.RoleId;
            await _dbContext.SaveChangesAsync();
            return u;
        }

        public async Task<Guid> CreateUser(User user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user.Id;
        }

        public async Task<IEnumerable<User>> GetAll() => await _dbContext.Users
            .Include(u => u.Role)
            .AsNoTracking()
            .ToListAsync();

        public async Task<User> GetById(Guid id) => await _dbContext.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        public async Task<User> GetByEmail(string email)
        {
           var user = await _dbContext.Users.Include(u => u.Role)
               .FirstOrDefaultAsync(u => u.Email == email);;
           return user ?? null;
        }

        public async Task<Role> GetRoleByName(string name)
        {
            return await _dbContext.Roles.FirstOrDefaultAsync(r => r.Name.Equals(name));
        }

        public async Task<User> UpdateRoleByUserId(Guid id, Role role)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }
            user.Role = role;
            await _dbContext.SaveChangesAsync();
            return user;
        }

        public async Task DeleteUserById(Guid id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if(user != null)
            {
                _dbContext.Remove(user);
                _dbContext.SaveChanges();
            }
        }
    }
}
