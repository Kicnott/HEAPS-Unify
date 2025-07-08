
import calendarService from "../../services/calendarService.jsx";

export default async function getMyCalendars(accountid) {
    const res = await calendarService.getMyCalendars(
            accountid
    )
    return res.data.rows
}