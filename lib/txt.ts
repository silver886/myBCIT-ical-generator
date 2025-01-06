import {CAMPUS, Course, DAYS, Meeting, Schedule} from './type';

export function parseTxt(rawTxt: string): Schedule {
   const rawTxtUnix = rawTxt.replace(/\r\n/gu, '\n').replace(/\r/gu, '\n');

   const {aNumber, name, term, createdTime} =
      rawTxtUnix.match(
         /(?<aNumber>A0\d{7}) (?<name>.*?)\n(?<term>.*?)\n(?<createdTime>.*?)\n/u,
      )?.groups ?? {};

   const courses = (
      [
         ...rawTxtUnix.matchAll(
            /(?<name>.*?) - (?<id>[A-Z]{4} \d{4}) - .*?\s+Associated Term:\s+(?<term>[\s\S]*?)\s+CRN:\s+(?<crn>.*?)\s+Status:\s+(?<status>.*?)\s+Assigned Instructor:\s+(?<assignedInstructor>.*?)\s+Grade Mode:\s+(?<gradeMode>.*?)\s+Credits:\s+(?<credits>.*?)\s+Level:\s+(?<level>.*?)\s+Campus:\s+(?<campus>.*?)\s+Scheduled Meeting Times[\s\S]*?Instructors\n(?<rawMeetings>[\s\S]*?)\n{2}/gu,
         ),
      ]
         .map((v) => v.groups)
         .filter((v) => v) as {[key: string]: string}[]
   ).map((v) => {
      return {
         id: v.id,
         name: v.name,
         term: v.term,
         crn: v.crn,
         status: v.status,
         assignedInstructor: v.assignedInstructor,
         gradeMode: v.gradeMode,
         credits: v.credits,
         level: v.level,
         campus: v.campus as CAMPUS,
         meetings: v.rawMeetings
            .replace(/[ \n]*\t[ \n]*/gu, '\t')
            .replace(/,\n/gu, ',')
            .split(/\n/gu)
            .map((w) => {
               const [
                  type,
                  timePeriod,
                  days,
                  where,
                  datePeriod,
                  scheduleType,
                  instructors,
               ] = w.split(/\t/gu);

               if (!timePeriod.includes(' - ') || !datePeriod.includes(' - ')) {
                  return;
               }

               const [
                  timeStart,
                  timeEnd,
               ] = timePeriod.split(/ - /gu);
               const [
                  dateStart,
                  dateEnd,
               ] = datePeriod.split(/ - /gu);

               return {
                  type,
                  time: {
                     start: timeStart,
                     end: timeEnd,
                  },
                  days: days as DAYS,
                  where,
                  date: {
                     start: dateStart,
                     end: dateEnd,
                  },
                  scheduleType,
                  instructors,
               };
            })
            .filter((w) => w) as Meeting[],
      };
   });

   return {
      aNumber,
      name,
      term,
      createdTime,
      courses,
   };
}
