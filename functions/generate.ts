import {generateCalendar} from '../lib/calendar';
import {parseTxt} from '../lib/txt';

export const onRequestPost: PagesFunction = async (context) => {
   const schedule = parseTxt(await context.request.text());

   return new Response(generateCalendar(schedule).toString(), {
      headers: {
         'Content-Type': 'text/calendar; charset=utf-8',
         'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(`${schedule.aNumber}-${schedule.term}-${schedule.createdTime}.ics`)}`,
      },
   });
};
