import { Loader } from "@mantine/core";
import { CategoryType } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ApiGetExpenses } from "../server/expenses";
import AlertFetchError from "./AlertFetchError";
import TransactionsList from "./TransactionsList";

export default function ExpensesList() {
  const { data, error, mutate } = useSWR<ApiGetExpenses>("/api/expenses");
  const router = useRouter();

  if (error) return <AlertFetchError />;
  if (!data) return <Loader />;

  function handleSaveSuccess(data: unknown) {
    mutate(data, false);
    // router.replace("/expenses");
  }

  return (
    <>
      {data.map((value) => (
        <TransactionsList
          data={value}
          key={value.title}
          fetchSaveUrl="/api/expenses"
          onSaveSuccess={handleSaveSuccess}
          type={CategoryType.Expense}
        />
      ))}
    </>
  );
}
