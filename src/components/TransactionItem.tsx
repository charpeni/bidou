import { Accordion, SimpleGrid, Text } from "@mantine/core";
import { memo } from "react";
import { ApiGetCategories } from "../server/categories";
import displayAmount from "../utils/displayAmount";
import { displayDate } from "../utils/displayDate";
import BadgeCategory from "./BadgeCategory";
import TransactionForm from "./TransactionForm";

interface Props {
  categories: ApiGetCategories;
  fetchSaveUrl: string;
  onCancel: () => void;
  onSaveSuccess: (data: unknown) => void;
  transaction: Transaction;
}

export default memo(function TransactionItem({
  categories,
  fetchSaveUrl,
  onCancel,
  onSaveSuccess,
  transaction,
}: Props) {
  return (
    <Accordion.Item value={transaction.id}>
      <Accordion.Control>
        <SimpleGrid cols={3}>
          <Text>{displayDate(transaction.date)}</Text>
          <BadgeCategory category={transaction.Category} />
          <Text align="right">{displayAmount(transaction.amount)}</Text>
        </SimpleGrid>
      </Accordion.Control>

      <Accordion.Panel>
        <TransactionForm
          categories={categories}
          fetchSaveUrl={fetchSaveUrl}
          onCancel={onCancel}
          onSuccess={onSaveSuccess}
          transaction={transaction}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
});
