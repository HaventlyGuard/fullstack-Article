using ArticleReviewSystem.API.Response;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;

namespace ArticleReviewSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController(FileService _service, ILogger<FileController> _log) : Controller
    {
        /// <summary>
        /// Отправка файла по Id
        /// </summary>
        /// <param name="id">Id файла</param>
        /// <returns></returns>
        
        [HttpGet("{id}" ,Name = "GetFileById")]
        public async Task<ActionResult> GetFileById(Guid id)
        {
            try
            {
                _log.LogInformation("Request GetFileById with id: " + id);
                if (id == Guid.Empty || id == null)
                {
                    _log.LogInformation("GetFileById request whith null id");
                    return BadRequest();
                }
                var guidExist = await _service.IsNotFileExist(id);
                if (guidExist)
                {
                    _log.LogInformation("GetFileById request not fount File by id");
                    return NotFound();
                }

                var file = await _service.GetFile(id);

                var memoryStream = new MemoryStream(file.Content);
                //var mimeType = MimeTypeMap.GetExtension(file.Type);
                return File(memoryStream, file.Type, file.Name);
            }
            catch (Exception ex)
            {
                _log.LogError("GetFileById error: " + ex.Message);
                return Problem(
                    title: "An error occurred",
                    detail: ex.Message,
                    statusCode: 500);
            }
        }
    }
}
