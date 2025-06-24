using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ArticleReviewSystem.API.AuthenticationOptions;

public class AuthOptions
{
    public const string ISSUER = "https://localhost:5190";
    public const string AUDIENCE = "AUDIENCE";
    const string KEY = "SUPERSECRETKEYYOUWONTEVENGUESSIT";
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}