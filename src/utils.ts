export function formatDateToYYYYMMDD(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateToMonthDayYear(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${new Date(`${year}-${month}-${day}`).toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" })}`;
}
