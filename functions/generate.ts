import {generateCalendar} from '../lib/calendar';
import {parseTxt} from '../lib/txt';
import {parseHtml} from '../lib/html';
import {Schedule} from '../lib/type';
import v4 from '../node_modules/uuid/dist/cjs/v4';

interface Env {
   DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
   const body = await context.request.text();

   await context.env.DB.prepare(
      'INSERT INTO records (uuid, continent, country, region, regionCode, city, postalCode, asn, asOrganization, timezone, longitude, latitude, colo, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
   )
      .bind(
         v4(),
         context.request.cf.continent,
         context.request.cf.country,
         context.request.cf.region,
         context.request.cf.regionCode,
         context.request.cf.city,
         context.request.cf.postalCode,
         context.request.cf.asn,
         context.request.cf.asOrganization,
         context.request.cf.timezone,
         context.request.cf.longitude,
         context.request.cf.latitude,
         context.request.cf.colo,
         body,
      )
      .run();

   let schedule: null | Schedule = null;
   try {
      schedule = parseHtml(body);
   } catch (err) {
      console.error(err);
      schedule = parseTxt(body);
   }

   if (schedule.courses.length) {
      return new Response(generateCalendar(schedule).toString(), {
         headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(`${schedule.aNumber}-${schedule.term}-${schedule.createdTime}.ics`)}`,
         },
      });
   } else {
      return new Response('Cannot parse the given data', {
         status: 400,
         statusText: 'Bad Request',
      });
   }
};
