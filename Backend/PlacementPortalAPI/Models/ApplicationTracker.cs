namespace PlacementPortalAPI.Models;

public class ApplicationTracker
{
    public int StudentID { get; set; }

    public string FullName { get; set; } = "";

    public string CompanyName { get; set; } = "";

    public string JobTitle { get; set; } = "";

    public string Status { get; set; } = "";

    public DateTime AppliedDate { get; set; }
}