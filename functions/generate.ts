import {generateCalendar} from '../src/calendar';
import {parseTxt} from '../src/txt';

export const onRequestPost: PagesFunction = async (context) => {
   return new Response(
      generateCalendar(parseTxt(await context.request.text())).toString(),
   );
};
