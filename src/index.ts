import { setUpAJAXCal } from './libs/calendar';
import { swapCourseListPos } from './libs/course';
import { fetchEventStatus } from './libs/event';
import { fetchNews } from './libs/news';

swapCourseListPos();
fetchNews();
fetchEventStatus();
setUpAJAXCal();
