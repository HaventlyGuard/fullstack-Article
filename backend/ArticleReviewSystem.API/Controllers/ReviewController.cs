using ArticleReviewSystem.API.AuthenticationOptions;
using ArticleReviewSystem.API.Contracts;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.API.Services.Helpers;
using ArticleReviewSystem.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace ArticleReviewSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Reviewer")]
    public class ReviewController(ILogger<ReviewController> _log, ReviewService _service) : Controller
    {
        /// <summary>
        /// Получение короткого списка рецензий по авторизованному пользователю с фильтрацией через url
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpGet(Name = "GetShortReviewListWithFiltersByReviewerId")]
        public async Task<ActionResult<IEnumerable<ReviewShortResponse>>> GetShortReviews([FromQuery] ReviewQueryFilter filter = ReviewQueryFilter.all)
        {
            _log.LogInformation("Request GetShortReviews");
            try
            {
                var reviewerId = TokenData.GetUserIdFromCookie(HttpContext);
                if (reviewerId == null)
                {
                    _log.LogWarning("GetShortReviews. Null userId from token");
                    return BadRequest("Invalid information from token");
                }

                var reviews = await _service.GetFilteredReviewsByUserId(Guid.Parse(reviewerId), filter);
                if (reviews == null)
                {
                    _log.LogWarning($"GetShortReviews. Not found article by authorId - {reviewerId}");
                    return Ok(Enumerable.Empty<ReviewShortResponse>());
                }

                var response = reviews.Select(r => new ReviewShortResponse(
                    r.Id,
                    r.Article.Title,
                    r.Article.Authors.Select(a => a.FullName).ToList(),
                    r.CreatedAt.ToString("MMMM d, yyyy", CultureInfo.InvariantCulture),
                    r.Recommendation.ToString(),
                    (int)r.Rating,
                    r.Progress
                    ))
                    .ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("GetShortReviews error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }

        [HttpGet("{id}", Name = "GetReviewById")]
        public async Task<ActionResult<ReviewResponse>> GetReviewById(Guid id)
        {
            _log.LogInformation("Request GetReviewById with id: " + id);
            try
            {
                if (id == Guid.Empty || id == null)
                {
                    _log.LogInformation("GetReviewById request whith null id");
                    return BadRequest();
                }
                var guidExist = await _service.IsReviewNotExist(id);
                if (guidExist)
                {
                    _log.LogInformation($"Review not found by id - {id}");
                    return NotFound();
                }

                var review = await _service.GetReview(id);
                var test = review.Article;

                ReviewResponse response = new ReviewResponse(
                    review.Id,
                    review.ArticleId,
                    review.Article.Title,
                    review.Article.Authors.Select(a => a.FullName).ToList(),
                    (int)review.Rating,
                    review.Comment,
                    review.Recommendation.ToString()
                    );
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("GetReviewById error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }
        [HttpPut("{id}", Name = "PutReview")]
        public async Task<ActionResult<ReviewResponse>> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
        {
            _log.LogInformation("Update review");
            try
            {
                var newReview = await _service.GetReview(id);
                if (newReview == null)
                {
                    _log.LogInformation($"Review not found by id - {id}");
                    return NotFound();
                }

                newReview.Recommendation = (Recommendation)Enum.Parse(typeof(Recommendation), request.recomendation);
                newReview.Rating = (Rating)request.rating;
                newReview.Comment = request.comment;
                newReview.Progress = request.completePercent;

                var review = await _service.UpdateReview(newReview);
                var response = new ReviewResponse(
                    review.Id,
                    review.ArticleId,
                    review.Article.Title,
                    review.Article.Authors.Select(a => a.FullName).ToList(),
                    (int)review.Rating,
                    review.Comment,
                    review.Recommendation.ToString());
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogError("UpdateReview error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }
        [HttpPost(Name = "AddReview")]
        public async Task<ActionResult<Guid>> AddReview([FromBody] ReviewRequest request)
        {
            _log.LogInformation("Request AddReview");
            try
            {
                var userId = TokenData.GetUserIdFromCookie(HttpContext);

                Review newReview = new Review()
                {
                    Id = Guid.NewGuid(),
                    UserId = Guid.Parse(userId),
                    ArticleId = request.articleId,
                    Rating = (Rating)request.rating,
                    Comment = request.comment,
                    Recommendation = (Recommendation)Enum.Parse(typeof(Recommendation), request.recomendation),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Progress = request.completePercent
                };

                await _service.CreateReview(newReview);

                return Ok(newReview.Id);
            }
            catch (Exception ex)
            {
                _log.LogError("AddReview error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
            
        }
    }
}
