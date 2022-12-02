import { Accordion, Badge, Group, Loader, Stack, Title } from "@mantine/core";
import { CategoryType } from "@prisma/client";
import { useCallback, useState } from "react";
import useCategories from "../hooks/useCategories";
import { ApiGetExpenses } from "../server/expenses";
import { ApiGetIncomes } from "../server/incomes";
import displayAmount from "../utils/displayAmount";
import AlertFetchError from "./AlertFetchError";
import TransactionItem from "./TransactionItem";

export default function TransactionsList<
  T extends ApiGetExpenses[number] | ApiGetIncomes[number]
>({
  data,
  fetchSaveUrl,
  onSaveSuccess,
  type,
}: {
  data: T;
  fetchSaveUrl: string;
  onSaveSuccess: (data: unknown) => void;
  type: CategoryType;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [categories, loading, error] = useCategories(type);

  const handleCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  if (error) return <AlertFetchError />;
  if (loading) return <Loader />;

  return (
    <Stack key={data.title} spacing={0} mt="xl">
      <Group align="center" position="apart" mb="md" mx="md">
        <Title order={3}>{data.title}</Title>
        <Badge color="red" size="xl">
          {displayAmount(data.total)}
        </Badge>
      </Group>

      <Accordion onChange={setActiveId} value={activeId} variant="contained">
        {data.transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            categories={categories}
            fetchSaveUrl={fetchSaveUrl}
            onCancel={handleCancel}
            onSaveSuccess={onSaveSuccess}
            transaction={transaction}
          />
        ))}
      </Accordion>
    </Stack>
  );
}
