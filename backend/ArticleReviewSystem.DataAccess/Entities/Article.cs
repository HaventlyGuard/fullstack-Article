namespace ArticleReviewSystem.DataAccess.Entities
{
    public class Article
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? TextContent { get; set; }
        public StatusArticle Status { get; set; }
        public DateTime CreatedAt{ get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Category { get; set; }
        public Guid? FileId { get; set; }
        public File? FileContent { get; set; }
        public IEnumerable<User> Authors { get; set; }
        public IEnumerable<Tag> Tags { get; set; }
        public IEnumerable<Review> Reviews { get; set; }
    }
}
