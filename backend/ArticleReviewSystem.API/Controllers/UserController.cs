using ArticleReviewSystem.API.Contracts;
using ArticleReviewSystem.API.Response;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArticleReviewSystem.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(UserService _service, ILogger<UserController> _log) : Controller
    {
        [HttpGet("/api/userInfo/{id}", Name = "GetUserRoleById")]
        public async Task<ActionResult<string>> GetUserRoleById(Guid id)
        {
            _log.LogInformation("Request GetUserRoleById");
            try
            {
                var u = await _service.GetUserbyId(id);
                if (u == null)
                {
                    _log.LogInformation($"GetUserRoleById. Get null user object whith id - {id}");
                    return NotFound();
                }

                return Ok(u.Role.Name);
            }
            catch (Exception ex)
            {
                _log.LogError("GetUserRoleById error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
                throw;
            }
        }

        /// <summary>
        /// Возвращение списка всех пользователей
        /// </summary>
        /// <returns></returns>
        [HttpGet(Name = "GetUsers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            _log.LogInformation("Request GetUsers");
            try
            {
                var users = await _service.GetUsers();
                if (users == null)
                {
                    _log.LogInformation("GetUsers response - null objects");
                    return NotFound();
                }
                var response = users.Select(u => new UserResponse(
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Specillization,
                    u.Role.Name,
                    u.Location,
                    u.Bio));

                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("GetUsers error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }

        // /// <summary>
        // /// Возвращение одного пользователя по Id
        // /// </summary>
        // /// <param name="id">Id пользователя</param>
        // /// <returns></returns>
        // [Authorize]
        // [HttpGet("{id}", Name = "GetUserById")]
        // public async Task<ActionResult<UserResponse>> GetUserById(Guid id)
        // {
        //     _log.LogInformation("Request GetUserById with id: " + id);
        //     try
        //     {
        //         var u = await _service.GetUserbyId(id);
        //         if (u == null)
        //         {
        //             _log.LogInformation("GetUserById response - null object");
        //             return NotFound();
        //         }
        //         var response = new UserResponse(
        //             u.Id,
        //             u.FullName,
        //             u.Email,
        //             u.Specillization,
        //             u.Role.Name,
        //             u.Location,
        //             u.Bio);
        //
        //         return Ok(response);
        //     }
        //     catch (Exception ex)
        //     {
        //         _log.LogError("GetUserById error: " + ex.Message);
        //         return Problem(
        //             title: "An error occurred",
        //             detail: ex.Message,
        //             statusCode: 500);
        //     }
        // }

        /// <summary>
        /// Создание нового пользователя
        /// </summary>
        /// <param name="userRequest"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost(Name = "PostUser")]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] RegisterRequest userRequest)
        {
            _log.LogInformation("Request PostUser");
            try
            {
                var user = new User()
                {
                    Id = Guid.NewGuid(),
                    FullName = userRequest.FullName,
                    Email = userRequest.Email,
                    Specillization = userRequest.Specillization,
                    Password = userRequest.Password
                };

                var userId = await _service.CreateUser(user, userRequest.Role);

                return Ok(userId);
            }
            catch (Exception ex)
            {
                _log.LogError("PostUser error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }

        /// <summary>
        /// Обновление роли пользователя с Id 
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles =  "Admin")]
        [HttpPut("changeRole/{id}", Name = "UpdateRoleByUserId")]
        public async Task<ActionResult<UserResponse>> UpdateRole([FromBody] string roleName, Guid id)
        {
            _log.LogInformation("Request UpdateRoleByUserId");
            try
            {
                User u = await _service.UpdateRole(id, roleName);

                var response = new UserResponse(
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Specillization,
                    u.Role.Name,
                    u.Location,
                    u.Bio);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("UpdateRoleByUserId error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }
        /// <summary>
        /// Обновление пользователя
        /// </summary>
        /// <param name="request"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin, Author")]
        [HttpPut("{id}", Name = "UpdateUser")]
        public async Task<ActionResult<UserResponse>> UpdateUser([FromBody] UserRequest request, Guid id)
        {
            _log.LogInformation("Request UpdateUser");
            try
            {
                User user = await _service.GetUserbyId(id);
                if (user == null)
                {
                    _log.LogInformation("UpdateUser response - null object");
                    return NotFound($"User whith id - {id} not found");
                }
                var editedUser = new User()
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    Specillization = request.Specillization,
                    RoleId = (await _service.GetRoleByName(request.Role)).Id,
                    Bio = request.Bio,
                    Location = request.Location
                };
                var u = await _service.UpdateUserById(id, editedUser);

                var response = new UserResponse(
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Specillization,
                    u.Role.Name,
                    u.Location,
                    u.Bio);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("UpdateUser error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }

        /// <summary>
        /// Удаление пользователя по Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}", Name = "DeleteUserById")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            _log.LogInformation("Request DeleteUserById");
            try
            {
                await _service.DeleteUser(id);

                return Ok();
            }
            catch (Exception ex)
            {
                _log.LogError("DeleteUserById error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }
    }
}
