import {generateCalendar} from '../lib/calendar';
import {parseTxt} from '../lib/txt';

export const onRequestPost: PagesFunction = async (context) => {
   return new Response(
      generateCalendar(parseTxt(await context.request.text())).toString(),
   );
};
