namespace PlacementPortalAPI.Models;

public class StudentTable
{
    public int StudentID { get; set; }

    public int UserID { get; set; }

    public int FacultyID { get; set; }

    public string Department { get; set; } = "";

    public decimal CGPA { get; set; }

    public int GraduationYear { get; set; }
}