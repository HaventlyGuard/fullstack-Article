namespace ArticleReviewSystem.DataAccess.Entities
{
    public class File
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public byte[] Content { get; set; }

        public IEnumerable<Article> Articles { get; set;}
    }
}
