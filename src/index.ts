import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {generateCalendar} from './calendar';
import {parseHtml} from './html';
import {parseTxt} from './txt';

writeFileSync(
   join(__dirname, '..', 'dist', `calendar-htm.ics`),
   generateCalendar(
      parseHtml(
         readFileSync(
            join(__dirname, '..', 'View Course Schedule.htm'),
         ).toString(),
      ),
   ).toString(),
);

writeFileSync(
   join(__dirname, '..', 'dist', `calendar-html.ics`),
   generateCalendar(
      parseHtml(
         readFileSync(
            join(__dirname, '..', 'View Course Schedule.html'),
         ).toString(),
      ),
   ).toString(),
);

writeFileSync(
   join(__dirname, '..', 'dist', `calendar-txt.ics`),
   generateCalendar(
      parseTxt(
         readFileSync(
            join(__dirname, '..', 'View Course Schedule.txt'),
         ).toString(),
      ),
   ).toString(),
);

writeFileSync(
   join(__dirname, '..', 'dist', `calendar-copy.ics`),
   generateCalendar(
      parseTxt(readFileSync(join(__dirname, '..', 'bcit.txt')).toString()),
   ).toString(),
);
