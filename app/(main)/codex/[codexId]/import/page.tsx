import { redirect } from "next/navigation";

export default function CodexImportPage({
  params,
}: {
  params: { codexId: string };
}) {
  redirect(`/import?codexId=${params.codexId}`);
}
