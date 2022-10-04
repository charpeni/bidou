import { Stack, Text } from "@mantine/core";
import { IconHomeDollar } from "@tabler/icons";
import { useSession } from "next-auth/react";
import Head from "next/head";
import MainLayout from "../components/MainLayout";
import PageHeader from "../components/PageHeader";
import { getTitle } from "../utils/getTitle";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{getTitle("Dashboard")}</title>
      </Head>

      <MainLayout>
        <PageHeader icon={IconHomeDollar} title="Dashboard" />

        <Stack spacing="xl">
          <Text>Dashboard</Text>
        </Stack>
      </MainLayout>
    </>
  );
}
