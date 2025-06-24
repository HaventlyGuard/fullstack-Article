namespace ArticleReviewSystem.API.Utilities
{
    public static class MimeTypeMap
    {
        private static readonly Dictionary<string, string> MimeTypeToExtension = new(StringComparer.OrdinalIgnoreCase)
        {
            ["txt"] = "text/plain",
            ["pdf"] = "application/pdf",
            ["jpg"] = "image/jpeg",
            ["png"] = "image/png",
            ["doc"] = "application/msword",
            ["docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };

        public static string GetExtension(string type)
        {
            return MimeTypeToExtension.TryGetValue(type, out var extension)
                ? extension
                : null;
        }
    }
}
