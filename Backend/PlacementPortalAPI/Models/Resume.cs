namespace PlacementPortalAPI.Models;

public class Resume
{
    public int ResumeID { get; set; }

    public int StudentID { get; set; }

    public string FilePath { get; set; }

    public DateTime UploadDate { get; set; }

    public string FileName { get; set; }

    public int FileSizeKB { get; set; }
}