namespace ArticleReviewSystem.DataAccess.Entities
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public IEnumerable<User> Users { get; set; }
    }
}
