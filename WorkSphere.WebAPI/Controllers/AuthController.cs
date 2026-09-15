using Microsoft.AspNetCore.Mvc;
using WorkSphere.Application.DTOs;
using WorkSphere.Application.Interfaces;

namespace WorkSphere.WebAPI.Controllers;

/*
Pseudocode plan:
- Add an HTTP POST endpoint "create" named CreateUserAsync to this controller.
- Validate the incoming CreateUserRequestDto:
  - Ensure either Email or UserName is provided.
  - Ensure Password is provided.
  - Add model errors to ModelState when validations fail.
- If ModelState is invalid return ValidationProblem(ModelState).
- Call _authService.CreateUserAsync(request) and await the response.
- If the service returns null (or indicates failure) return BadRequest with an error message.
- If creation succeeds return CreatedAtAction pointing to Login (or return the created response).
*/

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) &&
            string.IsNullOrWhiteSpace(request.UserName))
        {
            ModelState.AddModelError(nameof(request.Email), "Email or username is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var response = await _authService.LoginAsync(request);

        if (response is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(response);
    }

    [HttpPost("create")]
    public async Task<ActionResult<UserCreateDto>> CreateUserAsync(UserCreateDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) &&
            string.IsNullOrWhiteSpace(request.UserName))
        {
            ModelState.AddModelError(nameof(request.Email), "Email or username is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            ModelState.AddModelError(nameof(request.Password), "Password is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        await _authService.CreateUserAsync(request);

        // Return 201 Created with the created resource.
        // Using CreatedAtAction to provide a location; referencing Login action as a placeholder.
        return CreatedAtAction(nameof(Login), new { }, null);
    }
}
