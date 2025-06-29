
import calendarService from "../services/calendarService";

export default async function getMyCalendars(accountid) {
    const res = await calendarService.showAllCalendars(
        {
            accountID: accountid,
        }
    )
    return res.data.rows
}