import "./TopBar.css";
import {
    FaBell,
    FaCalendarDays,
    FaUserShield,
    FaUserTie,
    FaUserGraduate
} from "react-icons/fa6";

function TopBar({
    user,
    notificationCount = 0,
    onNotificationsClick
}) {
    console.log(notificationCount);
    return (
        <div className="topbar">
            
            <div className="topbar-right">

                <div
                    className="topbar-item notification-link"
                    onClick={onNotificationsClick}
                >
                    <FaBell />
                    <span>Notifications</span>

                    {notificationCount > 0 && (
                        <span className="notification-badge">
                            {notificationCount}
                        </span>
                    )}
                </div>

                <div className="topbar-item">
                    <FaCalendarDays />
                    <span>
                        {new Date().toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })}
                    </span>
                </div>

                <div className="topbar-item">

                    {user.role === "Admin" ? (
                        <FaUserShield />
                    ) : user.role === "Faculty" ? (
                        <FaUserTie />
                    ) : (
                        <FaUserGraduate />
                    )}

                    <span>{user.role}</span>

                </div>

            </div>
        </div>
    );
}

export default TopBar;