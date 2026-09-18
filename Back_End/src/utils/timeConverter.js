const TIME_AMPM_REGEX = /^(\d{1,2}):([0-5]\d)\s*([APap])\.?\s*[Mm]\.?$/;

const pad = (n) => String(n).padStart(2, '0');

const normalizeTime = (value) => {
    if (value === undefined || value === null) {
        return { ok: false, reason: 'Time is missing' };
    }

    const raw = String(value).trim().replace(/\s+/g, ' ');
    if (raw === '') {
        return { ok: false, reason: 'Time is empty' };
    }

    const match = raw.match(TIME_AMPM_REGEX);
    if (!match) {
        return {
            ok: false,
            reason: `Invalid time format "${raw}" (expected 12-hour "hh:mm AM/PM")`
        };
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (hour < 1 || hour > 12) {
        return { ok: false, reason: `Invalid hour "${raw}" (must be 1-12 for AM/PM time)` };
    }

    const hour24 = meridiem === 'A' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    const minutes = hour24 * 60 + minute;

    return { ok: true, value: `${pad(hour)}:${pad(minute)} ${meridiem}M`, minutes };
};

module.exports = { normalizeTime };