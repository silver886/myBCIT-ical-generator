import ical, {
   ICalCalendar,
   ICalCalendarMethod,
   ICalEventRepeatingFreq,
   ICalWeekday,
} from 'ical-generator';
import {CAMPUS, DAYS, Schedule} from './type';
import {ID} from './const';

const TIMEZONE = 'America/Vancouver';

export function generateCalendar({
   aNumber,
   name,
   term,
   createdTime,
   courses,
}: Schedule): ICalCalendar {
   const calendar = ical({name: `${aNumber}(${name})/${term}`});
   calendar.method(ICalCalendarMethod.PUBLISH);
   calendar.scale('gregorian');
   calendar.timezone({
      name: TIMEZONE,
      generator: () => `
BEGIN:VTIMEZONE
TZID:America/Vancouver
TZURL:https://www.tzurl.org/zoneinfo-outlook/America/Vancouver
X-LIC-LOCATION:America/Vancouver
BEGIN:DAYLIGHT
TZNAME:PDT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:PST
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
`,
   });

   courses.forEach(
      ({
         id,
         name,
         term,
         crn,
         status,
         assignedInstructor,
         gradeMode,
         credits,
         level,
         campus,
         meetings,
      }) => {
         meetings.forEach(
            ({type, time, days, where, date, scheduleType, instructors}, i) => {
               const title = `${id} - ${name}`;

               const firstDate = new Date(date.start);
               while (true) {
                  let fin = false;
                  switch (days) {
                     case DAYS.Monday:
                        if (firstDate.getDay() === 1) fin = true;
                        break;
                     case DAYS.Tuesday:
                        if (firstDate.getDay() === 2) fin = true;
                        break;
                     case DAYS.Wednesday:
                        if (firstDate.getDay() === 3) fin = true;
                        break;
                     case DAYS.Thursday:
                        if (firstDate.getDay() === 4) fin = true;
                        break;
                     case DAYS.Friday:
                        if (firstDate.getDay() === 5) fin = true;
                        break;
                  }
                  if (fin) break;
                  firstDate.setTime(firstDate.getTime() + 24 * 60 * 60 * 1000);
               }

               calendar
                  .createEvent({
                     id: `${ID}-${crn}-${type}-${scheduleType}-${i}`,
                     stamp: new Date(createdTime),
                     start: new Date(
                        `${firstDate.toISOString().replace(/T.*/gu, '')}, ${time.start}`,
                     ),
                     end: new Date(
                        `${firstDate.toISOString().replace(/T.*/gu, '')}, ${time.end}`,
                     ),
                     timezone: TIMEZONE,
                     summary: title,
                     description: [
                        `CRN: ${crn}`,
                        `Type: ${scheduleType}`,
                        `Instructor: ${instructors}`,
                     ].join('\n'),
                     location:
                        campus === CAMPUS.Burnaby
                           ? `${where} | 3700 Willingdon Ave, Burnaby, BC V5G 3H2 | https://maps.app.goo.gl/emGDND1UKsj5cRrV6`
                           : campus === CAMPUS.Downtown
                              ? `${where} | 555 Seymour St, Vancouver, BC V6B 3H6 | https://maps.app.goo.gl/TcQJFmjKywY5gY368`
                              : undefined,
                     repeating: {
                        freq: ICalEventRepeatingFreq.WEEKLY,
                        byDay:
                           days === DAYS.Monday
                              ? ICalWeekday.MO
                              : days === DAYS.Tuesday
                                ? ICalWeekday.TU
                                : days === DAYS.Wednesday
                                  ? ICalWeekday.WE
                                  : days === DAYS.Thursday
                                    ? ICalWeekday.TH
                                    : days === DAYS.Friday
                                      ? ICalWeekday.FR
                                      : undefined,
                        until: new Date(`${date.end}, 23:59`),
                     },
                  })
                  .createAlarm({
                     description: title,
                     triggerBefore: 900,
                  });
            },
         );
      },
   );

   return calendar;
}
