
import calendarService from "../../services/calendarService.jsx";

export default async function getMyCalendars(accountid) {
    const res = await calendarService.showAllCalendars(
        {
            accountID: accountid,
        }
    )
    return res.data.rows
}