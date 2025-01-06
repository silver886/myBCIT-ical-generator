import {HTMLElement, parse, TextNode} from 'node-html-parser';
import {CAMPUS, Course, DAYS, Meeting, Schedule} from './type';

export function parseHtml(rawHtml: string): Schedule {
   const html = parse(rawHtml);

   const [
      aNumberAndName,
      term,
      createdTime,
   ] =
      html
         .querySelector('div.staticheaders')
         ?.childNodes.filter((v) => v instanceof TextNode)
         .map((v) => v.trimmedText) ?? [];

   const [
      aNumber,
      name,
   ] = aNumberAndName.split(/ (.*)/gu);

   const courses = html
      .querySelectorAll('table.datadisplaytable')
      .reduce<[HTMLElement, HTMLElement][]>((p, v, i) => {
         if (i % 2 === 0) {
            p.push([
               v,
               v,
            ]);
         } else {
            p[p.length - 1][1] = v;
         }
         return p;
      }, [])
      .map<Course>(
         ([
            detail,
            meeting,
         ]) => {
            const [
               nameAndId,
            ] =
               detail
                  .querySelector('caption')
                  ?.childNodes.filter((v) => v instanceof TextNode)
                  .map((v) => v.trimmedText) ?? [];

            const [
               name,
               id,
            ] = nameAndId.split(/ - /gu);

            const [
               term,
               crn,
               status,
               assignedInstructor,
               gradeMode,
               credits,
               level,
               campus,
            ] = detail
               .querySelectorAll('tr>td')
               .map((v) =>
                  v.childNodes
                     .filter((v) => v instanceof TextNode)
                     .map((v) => v.trimmedText.replace(/\s+/gu, ' ')),
               )
               .flat();

            const meetings = meeting
               .querySelectorAll('tr:has(td)')
               .map<Meeting | undefined>((v) => {
                  const [
                     type,
                     timePeriod,
                     days,
                     where,
                     datePeriod,
                     scheduleType,
                     instructors,
                  ] = v
                     .querySelectorAll('td')
                     .map((v) => v.structuredText.replace(/\s+/gu, ' '));

                  if (
                     !timePeriod.includes(' - ') ||
                     !datePeriod.includes(' - ')
                  ) {
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
               .filter((v) => v) as Meeting[];

            return {
               id,
               name,
               term,
               crn,
               status,
               assignedInstructor,
               gradeMode,
               credits,
               level,
               campus: campus as CAMPUS,
               meetings,
            };
         },
      );

   return {
      aNumber,
      name,
      term,
      createdTime,
      courses,
   };
}
