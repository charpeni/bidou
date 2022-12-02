import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { TypeOf, z } from "zod";
import notification from "../lib/notification";
import { ApiGetCategories } from "../server/categories";
import { ApiUpdateExpense } from "../server/expenses";
import { ApiUpdateIncome } from "../server/incomes";
import { formatTransactionToSave } from "../utils/formatTransactionToSave";

const schema = z.object({
  amount: z.number(),
  categoryId: z.string().min(1, "Required"),
  date: z.date({ required_error: "Required" }),
  note: z.string().nullable(),
});

interface Props {
  categories: ApiGetCategories;
  fetchSaveUrl: string;
  onCancel: () => void;
  onSuccess: (data: Transaction) => void;
  transaction?: Transaction;
}

export default function TransactionForm({
  categories,
  fetchSaveUrl,
  onCancel,
  onSuccess,
  transaction,
}: Props) {
  const [saving, setSaving] = useState(false);

  const initialValues = useMemo(() => {
    if (transaction) {
      return {
        amount: transaction.amount / 100,
        categoryId: transaction.categoryId,
        date: dayjs(transaction.date).toDate(),
        note: transaction.note || "",
      };
    }

    return {
      amount: undefined as unknown as number,
      categoryId: "",
      date: new Date(),
      note: "",
    };
  }, [transaction]);

  const form = useForm({
    initialValues,
    validate: zodResolver(schema),
  });

  const handleSubmit = async (data: TypeOf<typeof schema>) => {
    setSaving(true);

    const url = (() => {
      if (transaction) return `${fetchSaveUrl}/${transaction.id}`;
      return fetchSaveUrl;
    })();

    const response = await fetch(url, {
      body: JSON.stringify(formatTransactionToSave(data)),
      headers: { "Content-Type": "application/json" },
      method: transaction ? "PUT" : "POST",
    });

    notification(response.ok ? "success" : "error");
    setSaving(false);

    if (response.ok) {
      if (transaction) {
        const { categoryId, ...newData } = (await response.json()) as
          | ApiUpdateExpense
          | ApiUpdateIncome;
        onSuccess({ ...newData, Category: { id: categoryId } });
      }
    }

    if (response.ok)
      onSuccess({
        ...data,
        id: transaction?.id,
        Category: {
          id: data.categoryId,
        },
      });
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack spacing="xl">
        <Group grow>
          <NumberInput
            formatter={(value) => value?.replace(",", ".")}
            hideControls
            label="Amount"
            precision={2}
            step="0.01"
            {...form.getInputProps("amount")}
          />

          <DatePicker
            clearable={false}
            firstDayOfWeek="sunday"
            label="Date"
            {...form.getInputProps("date")}
          />

          <Select
            data={categories
              .filter((category) => category.Children.length === 0)
              .map((category) => ({
                group: category.Parent?.name,
                label: category.name,
                value: category.id,
              }))}
            label="Category"
            {...form.getInputProps("categoryId")}
          />
        </Group>

        <Textarea label="Note" {...form.getInputProps("note")} />

        <Group>
          <Button loading={saving} type="submit">
            Save
          </Button>
          <Button disabled={saving} onClick={onCancel} variant="subtle">
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
