namespace SalesManagement.Application.Common.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string firstName, string lastName, string email, string password);
    Task<AuthResult> LoginAsync(string email, string password);
}

public class AuthResult
{
    public bool Success { get; set; }
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();
}
