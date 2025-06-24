namespace ArticleReviewSystem.DataAccess.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Specillization { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public Role Role { get; set; }
        public Guid RoleId { get; set; }
        public IEnumerable<Article> Articles { get; set; }
        public IEnumerable<Review> Reviews { get; set; }
    }
}
