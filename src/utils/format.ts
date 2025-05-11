export const formatNumber = (
  value: number,
  options: {
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    notation?: "standard" | "compact";
  } = {},
) => {
  const {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    notation = "standard",
  } = options;

  return Intl.NumberFormat("en-US", {
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
};
