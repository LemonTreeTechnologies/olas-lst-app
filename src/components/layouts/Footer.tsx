import { FaGithub, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="flex gap-2 items-center justify-center font-tertiary">
      <span>{`© stOLAS ${CURRENT_YEAR} `}</span>
      <span>•</span>
      <a
        href="https://x.com/lst_olas"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaXTwitter />
      </a>
      <a
        href="https://t.me/+2f8-MR06jHllYjVk"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegramPlane />
      </a>
      <a
        href="https://github.com/LemonTreeTechnologies/olas-lst"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <span>•</span>
      <a
        href="https://github.com/CODESPECT-security/audit-reports/blob/main/034_CODESPECT_LSTOLAS.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Audit link
      </a>
    </footer>
  );
};
