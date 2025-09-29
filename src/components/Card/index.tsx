import React from "react";

type CardProps = {
  title: string;
  hint?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
};

export const Card = ({ title, hint, description, children }: CardProps) => (
  <div className="flex flex-col gap-6 p-8 rounded-lg border border-solid border-[#FFFFFF0D] bg-[#FFFFFF0D]">
    <div className="flex justify-between items-baseline">
      <h2 className="text-2xl font-bold">{title}</h2>
      {hint && <span className="font-tertiary">{hint}</span>}
    </div>

    {description && <p className="font-tertiary">{description}</p>}

    {children}
  </div>
);
