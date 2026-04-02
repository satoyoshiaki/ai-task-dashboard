import { statusTone } from "@/lib/utils/formatters";

export const StatusBadge = ({ label }: { label: string }) => (
  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusTone(label as never)}`}>{label.replace("-", " ")}</span>
);
