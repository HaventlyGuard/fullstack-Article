using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ArticleReviewSystem.API.AuthenticationOptions;
using ArticleReviewSystem.API.Contracts;
using ArticleReviewSystem.API.Response;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ArticleReviewSystem.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class LoginController(UserService service, ILogger<LoginController> log) : Controller
{
    /// <summary>
    /// Регистрация нового пользователя
    /// </summary>
    /// <param name="userRequest"></param>
    /// <returns></returns>
    [HttpPost("/api/register",Name = "RegisterUser")]
    public async Task<ActionResult<UserResponse>> CreateUser([FromBody] RegisterRequest userRequest)
    {
        log.LogInformation("Request RegisterUser");
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

            var userId = await service.CreateUser(user, userRequest.Role);
            var registredUser = await service.GetUserbyId(userId);
            var response = new UserResponse(
                registredUser.Id,
                registredUser.FullName,
                registredUser.Email,
                registredUser.Specillization,
                registredUser.Role.Name,
                null,
                null
                );

            return Ok(response);
        }
        catch (Exception ex)
        {
            log.LogError("RegisterUser error: " + ex.Message);
            return Problem(
                title: "An error occurred",
                detail: ex.Message,
                statusCode: 500);
        }
    }
    /// <summary>
    /// Вход пользователя
    /// </summary>
    /// <param name="userLogin"></param>
    /// <returns></returns>
    [HttpPost(Name = "LoginUser")]
    public async Task<ActionResult<UserResponse>> LoginUser([FromBody] UserLogin userLogin)
    {
        log.LogInformation("Request LoginUser");
        var user = await service.GetUserByEmail(userLogin.email);
        if (user == null)
            return NotFound($"Not found user whith email - {userLogin.email}");
        var role = user.Role.Name;
        if (role == null)
            return NotFound();
        if (user.Password != userLogin.Password)
            return Unauthorized("Wrong password or email");
        var claims = new List<Claim>{new("userId",  user.Id.ToString()), new( "role", user.Role.Name )};
        var signingCredentials = new SigningCredentials(
            AuthOptions.GetSymmetricSecurityKey(),
            SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            signingCredentials: signingCredentials,
            claims: claims,
            expires: DateTime.Now.AddHours(1));
        var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
        Response.Cookies.Append("notJWT", tokenValue);

        var response = new UserResponse(
            user.Id,
            user.FullName,
            user.Email,
            user.Specillization,
            user.Role.Name,
            user.Location,
            user.Bio);

        return Ok(response);
    }
}