namespace ArticleReviewSystem.DataAccess.Entities
{
    public class Tag
    {
        public Guid Id { get; set; }     
        public string Name { get; set; } = null!;
        public IEnumerable<Article> Articles { get; set; }
    }
}
