﻿namespace ArticleReviewSystem.API.Exceptions
{
    public class InvalidArgumentException : Exception
    {
        public InvalidArgumentException(string message) : base(message) {}
    }
}
