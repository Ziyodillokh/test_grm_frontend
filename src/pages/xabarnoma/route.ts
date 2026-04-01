import NotificationsPage from "./page";
import VideoMessagesPage from "./video-messages/page";

const Route = [
  {
    url: "/xabarnoma",
    Element: NotificationsPage,
    meta: { isAuth: true, role: new Set(["admin", "4", "9", "10", "12"]) },
  },
  {
    url: "/xabarnoma/video-murojaatlar",
    Element: VideoMessagesPage,
    meta: { isAuth: true, role: new Set(["admin", "4", "9", "10", "12"]) },
  },
];

export default Route;
