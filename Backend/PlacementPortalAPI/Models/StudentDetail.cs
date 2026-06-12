namespace PlacementPortalAPI.Models;

public class StudentDetail
{
    public int StudentID { get; set; }

    public string FullName { get; set; } = "";

    public string Department { get; set; } = "";

    public decimal CGPA { get; set; }

    public int GraduationYear { get; set; }
}