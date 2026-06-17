namespace PlacementPortalAPI.Models;

public class RegisterRequest
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Department { get; set; }
    public decimal CGPA { get; set; }
    public int GraduationYear { get; set; }
}