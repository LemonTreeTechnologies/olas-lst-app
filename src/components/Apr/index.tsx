import { Tooltip } from "../Tooltip";

type AprProps = {
  value: string | undefined;
  className?: string;
};

export const Apr = ({ value, className }: AprProps) => {
  if (!value || Number(value) === 0) {
    return "N/A";
  }

  return (
    <Tooltip content="This percentage represents the APR calculated based on the change in price per staked token (PPS) over the past 7 days. Past performance is not indicative of future results.">
      <div className={className}>
        {`${(Number(value) * 100).toFixed(2) + "%"}`}
        {" * "}
      </div>
    </Tooltip>
  );
};
