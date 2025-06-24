namespace ArticleReviewSystem.DataAccess.Entities
{
    public class Review
    {
        public Guid Id { get; set; }
        public Rating? Rating { get; set; }
        public string? Comment { get; set; }
        public int Progress { get; set; }
        public Recommendation Recommendation { get; set; }
        public DateTime CreatedAt { get; set;}
        public DateTime? UpdatedAt { get; set;}
        public Guid UserId { get; set; }
        public User Reviewer { get; set; }
        public Guid ArticleId { get; set; }
        public Article Article { get; set; }
    }
}
