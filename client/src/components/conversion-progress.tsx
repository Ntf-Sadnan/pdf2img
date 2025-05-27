import { Progress } from "@/components/ui/progress";

interface ConversionProgressProps {
  current: number;
  total: number;
}

export default function ConversionProgress({ current, total }: ConversionProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Converting pages...</span>
        <span>{current} of {total}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
