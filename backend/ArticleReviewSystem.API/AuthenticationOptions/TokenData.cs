using System.IdentityModel.Tokens.Jwt;

namespace ArticleReviewSystem.API.AuthenticationOptions
{
    public static class TokenData
    {
        public static string? GetUserIdFromCookie(HttpContext httpContext)
        {
            var token = httpContext.Request.Cookies["notJWT"];
            if (string.IsNullOrEmpty(token)) return null;

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "userId");
            return userIdClaim?.Value;
        }
        public static string? GetUserRoleFromCookie(HttpContext httpContext)
        {
            var token = httpContext.Request.Cookies["notJWT"];
            if (string.IsNullOrEmpty(token)) return null;

            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role");
            return userIdClaim?.Value;
        }
    }
}
