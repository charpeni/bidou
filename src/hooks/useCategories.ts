import { CategoryType } from "@prisma/client";
import { useMemo } from "react";
import useSWR from "swr";
import { ApiGetCategories } from "../server/categories";

type ReturnError = [undefined, false, Error];
type ReturnLoading = [undefined, true, undefined];
type ReturnData = [ApiGetCategories, false, undefined];

export default function useCategories(
  type?: CategoryType
): ReturnError | ReturnLoading | ReturnData {
  const { data, error } = useSWR<ApiGetCategories>(["/api/categories", type]);

  const categories = useMemo(
    () =>
      data?.filter((category) => {
        if (type === CategoryType.Income) {
          return category.type === CategoryType.Income;
        }

        if (type === CategoryType.Expense) {
          return category.type === CategoryType.Expense;
        }

        return true;
      }),
    [data, type]
  );

  if (error) return [undefined, false, error];
  if (!data || !categories) return [undefined, true, undefined];

  return [categories, false, undefined];
}
