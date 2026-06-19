namespace PlacementPortalAPI.Models;

public class ApplicationTable
{
    public int ApplicationID { get; set; }
    public int StudentID { get; set; }
    public int JobID { get; set; }
    public DateTime AppliedDate { get; set; }
    public string Status { get; set; }
}