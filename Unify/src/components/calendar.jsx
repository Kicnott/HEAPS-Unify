import { DateTime, Info, Interval } from "luxon"
import { useState } from 'react'
import classnames from 'classnames'



const Calendar = ({meetings}) => {
    // reference to today from start of the Year, how many months days minutes into the year
    const today = DateTime.local();

    // state variable starts as null
    const [activeDay, setActiveDay] = useState(null);

    // gets first day of current month stored in state
    const [firstDayOfActiveMonth, setFirstDayOfActiveMonth] = useState(today.startOf("month"));

    // if activeday is not null/undefined, calls isodate function to get date String, else undefined
    // optional chaining
    const activeDayMeetings = meetings[activeDay?.toISODate()] ?? [];

    // get an array of days in short form
    const weekDays = Info.weekdays("short");

    // get a time period interval between 2 dates
    const daysOfMonth = Interval.fromDateTimes(
        // get first day of month regardless of day .e.g Mon or Sun
        firstDayOfActiveMonth.startOf("week"),

        // get last day of Month, shift to end of week to include next months enveloping days for timetable format
        firstDayOfActiveMonth.endOf("month").endOf("week")

        // split interval to days
        // transform day intervals to DateTime start of day
    ).splitBy({ day: 1 }).map((day) => day.start);


    const goToPreviousMonth = () => {
        setFirstDayOfActiveMonth(firstDayOfActiveMonth.minus({ month : 1 }));
    }

    const goToNextMonth = () => {
        setFirstDayOfActiveMonth(firstDayOfActiveMonth.plus({ month : 1 }));
    }

    const goToToday = () => {
        setFirstDayOfActiveMonth(today.startOf("month"));
    }




    return (
        <div className="calendar-container">
            <div className="calendar">

                <div className="calendar-headline">
                    <div className="calendar-headline-month">
                        {firstDayOfActiveMonth.monthShort}, {firstDayOfActiveMonth.year}
                    </div>
                    <div className="calendar-headline-controls">
                        <div className="calendar-headline-control" onClick={() => goToPreviousMonth()}>{"<<"}</div>
                        <div className="calendar-headline-control calendar-headline-controls-today" onClick={() => goToToday()}>Today</div>
                        <div className="calendar-headline-control" onClick={() => goToNextMonth()}>{">>"}</div>
                    </div>
                </div>

                {/* for each day in weekDays create a div with the day as the value */}
                <div className="calendar-weeks-grid">
                    {weekDays.map((weekDay, weekDayIndex) => (
                        <div key={weekDayIndex} className="calendar-weeks-grid-cell">
                            {weekDay}
                        </div>
                    ))}
                </div>
                {/* for every day of current month make a cell div */}
                <div className="calendar-grid">
                    {daysOfMonth.map((dayOfMonth, dayOfMonthIndex) => (
                        <div key={dayOfMonthIndex}  
                        className={classnames({
                            "calendar-grid-cell": true,
                            "calendar-grid-cell-inactive": 
                            dayOfMonth.month !== firstDayOfActiveMonth.month,
                            "calendar-grid-cell-active":
                             activeDay?.toISODate() === dayOfMonth.toISODate(),
                        })}
                        onClick={()=> setActiveDay(dayOfMonth)}>
                            {dayOfMonth.day}
                        </div>
                    ))}
                </div>
            </div>
            <div className="schedule">
                <div className="schedule-headline">
                    {activeDay === null && <div>Please select a day</div>}
                    {activeDay && <div>{activeDay.toLocaleString(DateTime.DATE_MED)}</div>}
                </div>
                <div>
                    {activeDay && activeDayMeetings.length === 0 && (
                        <div>No Planned Meetings Today</div>
                    )}

                    {activeDay && activeDayMeetings.length > 0 && (
                        <>
                        {activeDayMeetings.map((meeting, meetingIndex) => (
                            <div key={meetingIndex}>{meeting}</div>
                        ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Calendar