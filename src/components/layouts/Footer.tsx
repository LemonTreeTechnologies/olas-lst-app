const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center font-tertiary">
      {`© stOLAS ${CURRENT_YEAR}`}
    </footer>
  );
};
