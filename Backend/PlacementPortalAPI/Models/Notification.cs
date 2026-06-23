namespace PlacementPortalAPI.Models;

public class Notification
{
    public int NotificationID { get; set; }
    public int UserID { get; set; }
    public string Message { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsRead { get; set; }
}