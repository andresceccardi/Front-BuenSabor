//Una funcion para encontrar un numero par en un array
export function findEvenNumber(arr: number[]): number {
  return arr.find((num) => num % 2 === 0) || 0;
}