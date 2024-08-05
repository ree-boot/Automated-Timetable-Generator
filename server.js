import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate_timetable', (req, res) => {
  const { subjects, start_time, total_classes } = req.body;
  const timetable = createTimetable(subjects, start_time, total_classes);
  res.json(timetable);
});

function createTimetable(subjects, startTime, totalClasses) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetable = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
  const classDuration = 1; // 1 hour
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = 16; // End of school day at 4 PM

  // Calculate the total number of class slots per day
  const totalSlotsPerDay = endHour - startHour;

  // Distribute classes evenly throughout the week
  subjects.forEach((subject, index) => {
      const subjectClasses = totalClasses[index];
      let classesScheduled = 0;

      while (classesScheduled < subjectClasses) {
          days.forEach((day) => {
              if (classesScheduled < subjectClasses) {
                  // Find a free period slot
                  let hourSlot = timetable[day].length + startHour;

                  if (hourSlot < endHour) {
                      timetable[day].push(`${subject} at ${hourSlot}:00`);
                      classesScheduled++;
                  }
              }
          });
      }
  });

  // Fill the remaining slots with Free Periods
  // for (const day in timetable) {
  //     while (timetable[day].length < totalSlotsPerDay) {
  //         timetable[day].push('Free Period');
  //     }
  // }

  return timetable;
}


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
