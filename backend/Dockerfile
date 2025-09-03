FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build-env
WORKDIR /app

# Copy solution and preserve folder structure for projects
COPY *.sln ./
COPY ./ArticleReviewSystem.API/*.csproj ./ArticleReviewSystem.API/
COPY ./ArticleReviewSystem.DataAccess/*.csproj ./ArticleReviewSystem.DataAccess/

RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 5190
ENTRYPOINT ["dotnet", "YourBackendApp.dll"]
