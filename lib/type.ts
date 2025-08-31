export interface Schedule {
   aNumber: string;
   name: string;
   term: string;
   createdTime: string;
   courses: Course[];
}

export interface Course {
   id: string;
   name: string;
   term: string;
   crn: string;
   status: string;
   assignedInstructor: string;
   gradeMode: string;
   credits: string;
   level: string;
   campus: CAMPUS;
   meetings: Meeting[];
}

export interface Meeting {
   type: string;
   time: Range;
   days: DAYS;
   where: string;
   date: Range;
   scheduleType: string;
   instructors: string;
}

export interface Range {
   start: string;
   end: string;
}

export enum DAYS {
   Monday = 'M',
   Tuesday = 'T',
   Wednesday = 'W',
   Thursday = 'R',
   Friday = 'F',
}

export enum CAMPUS {
   Burnaby = 'Burnaby',
   Downtown = 'Downtown',
}
