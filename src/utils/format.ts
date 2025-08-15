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

export const truncateAddress = (address: `0x${string}` | undefined) =>
  address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "--";

export const formatTimeDifference = (
  differenceInS: number,
  postfix?: string,
) => {
  const differenceInMinutes = Math.floor(differenceInS / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  const postfixWithSpace = postfix ? ` ${postfix}` : "";

  if (differenceInDays > 0) {
    return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""}${postfixWithSpace}`;
  } else if (differenceInHours > 0) {
    return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""}${postfixWithSpace}`;
  } else {
    return `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""}${postfixWithSpace}`;
  }
};
