namespace ArticleReviewSystem.API.Contracts
{
    public record ReviewerResponse(
        Guid id,
        string fullName,
        string email,
        string institution,
        string fieldOfExpertise
        )
    {
        public int totalReviews {get;set;}
        public int inProgress { get;set;}
        public int completed { get;set; }
    }
}
