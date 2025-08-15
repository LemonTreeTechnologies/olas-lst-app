type TagProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const Tag = ({ icon, children, className = "" }: TagProps) => (
  <div
    className={`flex items-center gap-2 rounded-xl bg-[#FFFFFF0D] px-4 py-2 ${className}`}
  >
    {icon}
    <span className="text-base font-semibold">{children}</span>
  </div>
);
