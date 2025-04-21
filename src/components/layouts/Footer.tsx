const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="flex items-center justify-center font-secondary">
      {`© stOLAS ${CURRENT_YEAR}`}
    </footer>
  );
};
