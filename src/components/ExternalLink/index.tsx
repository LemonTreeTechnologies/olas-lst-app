import { LuExternalLink } from "react-icons/lu";

type ExternalLinkShortProps = {
  text?: undefined;
  short: boolean;
};

type ExternalLinkLongProps = {
  text: string;
  short?: undefined;
};

type ExternalLinkProps = {
  href: string;
  className?: string;
} & (ExternalLinkShortProps | ExternalLinkLongProps);

export const ExternalLink = ({
  href,
  text,
  short,
  className,
}: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    className={`inline-flex items-center gap-2 ${className}`}
  >
    {text} <LuExternalLink className={short ? "text-xl" : undefined} />
  </a>
);
