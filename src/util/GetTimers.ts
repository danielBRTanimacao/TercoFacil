export function getActualTime() {
    const today = new Date();
    const monthIndex = today.getMonth();
    const dayIndex = today.getDay();

    return { monthIndex, dayIndex };
}
