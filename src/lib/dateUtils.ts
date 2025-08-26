export const formatDateYMD = (d: Date) => d.toISOString().split("T")[0];

export const getWeekOfMonth = (date: Date) => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = ((first.getDay() || 7) - 1);
    return Math.ceil((date.getDate() + offset) / 7);
}

export const generateCandidateDates = (year: number, holidays?: Set<string> | null, rangeFrom?: Date | null, rangeTo?: Date | null) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const s = rangeFrom && rangeFrom > start ? rangeFrom : start;
    const e = rangeTo && rangeTo < end ? rangeTo : end;
    const out: string[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const dow = d.getDay();
        const iso = formatDateYMD(d);
        if ((dow === 5 || dow === 6) && (!holidays || !holidays.has(iso))) out.push(iso);
    }
    return out;
}
