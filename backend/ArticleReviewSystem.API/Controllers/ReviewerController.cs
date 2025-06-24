using ArticleReviewSystem.API.Contracts;
using ArticleReviewSystem.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArticleReviewSystem.API.Controllers
{
    /// <summary>
    /// Endpoint рецензента
    /// </summary>
    /// <param name="_service"></param>
    /// <param name="_log"></param>
    [Authorize(Roles = "Admin, Reviewer")]
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewerController(ReviewerService _service, ILogger<ReviewerController> _log) : Controller
    {
        /// <summary>
        /// Информация о рецензенте
        /// </summary>
        /// <param name="id">Id рецензента(пользователя с ролью Review)</param>
        /// <returns>ReviewerResponse</returns>
        [HttpGet("{id}", Name = "GetReviewerById")]
        public async Task<ActionResult<ReviewerResponse>> GetReviewer(Guid id)
        {
            _log.LogInformation("Request GetReviewer endpoint");

            try
            {
                var user = await _service.GetReviewer(id);
                ReviewerResponse reviewer = new ReviewerResponse(
                    id: user.Id,
                    fullName: user.FullName,
                    email: user.Email,
                    institution: string.Empty,
                    fieldOfExpertise: string.Empty
                );
                var reviewerStat = await _service.GetUserReviewStat(id);
                if (reviewerStat != null)
                {
                    reviewer.completed = reviewerStat.Completed;
                    reviewer.inProgress = reviewerStat.InProgres;
                    reviewer.totalReviews = reviewerStat.Total;
                }
                return Ok(reviewer);
            }
            catch (Exception ex)
            {
                _log.LogError("GetReviewer endpoint error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }

    }
}
