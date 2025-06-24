using ArticleReviewSystem.API.AuthenticationOptions;
using ArticleReviewSystem.API.Repositories;
using ArticleReviewSystem.API.Repositories.Interfaces;
using ArticleReviewSystem.API.Services;
using ArticleReviewSystem.API.Utilities;
using ArticleReviewSystem.DataAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000");
            builder.AllowAnyHeader();
            builder.AllowAnyMethod();
            builder.AllowCredentials();
        });
});

builder.Services.AddDbContext<ArticleReviewSystemDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")), ServiceLifetime.Scoped);

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReviewerRepository, ReviewerRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IFileRepository, FileRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ReviewerService>();
builder.Services.AddScoped<ArticleService>();
builder.Services.AddScoped<FileService>();
builder.Services.AddScoped<ReviewService>();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            ValidateIssuerSigningKey = true,
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["notJWT"];
                
                return Task.CompletedTask;
            }
        };
    })
    .AddCookie();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var basePath = AppContext.BaseDirectory;

    var xmlPath = Path.Combine(basePath, "ArticleReviewSystem.xml");
    options.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

app.UseCors("AllowAllOrigins");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ArticleReviewSystemDbContext>();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
