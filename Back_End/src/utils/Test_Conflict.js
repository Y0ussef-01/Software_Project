const timeToMinutes = (timeString) => {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
};
const isTimeConflict = (app1, app2) => {
    if (app1.day !== app2.day) return false;

    const start1 = timeToMinutes(app1.startTime);
    const end1 = timeToMinutes(app1.endTime);
    const start2 = timeToMinutes(app2.startTime);
    const end2 = timeToMinutes(app2.endTime);

    return start1 < end2 && end1 > start2;
};
module.exports = {isTimeConflict};