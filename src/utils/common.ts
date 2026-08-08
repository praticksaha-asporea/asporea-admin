export const CamelCase = (str: string = ""): string => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const isWithinSchedule = (assignment: any): boolean => {
  if (!assignment?.schedule?.date) return true;
  return true; 
};