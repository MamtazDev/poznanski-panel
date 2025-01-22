function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export const compare = (a: number, b: number) => {
  return a >= b ? a : b;
};

export const changeData1 = (date: string) => {
  if (date) {
    const inputDate: Date = new Date(date);
    const options: object = {
      year: "numeric",
      day: "numeric",
      month: "long",
    };
    const formattedDate: string = inputDate.toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  } else {
    return "";
  }
};

export const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
