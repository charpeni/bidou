declare global {
  type Override<T, U> = Omit<T, keyof U> & U;

  type Transaction = {
    id: string;
    amount: number;
    date: string;
    note: string | null;
    Category: Category;
  };
}

export {};
