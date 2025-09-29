import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
};

export const Accordion = ({ items }: AccordionProps) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div id="accordion" className="divide-y divide-[#FFFFFF0D]">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id}>
            <h2 id={`accordion-heading-${item.id}`}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`accordion-body-${item.id}`}
                className="flex justify-between w-full py-5 gap-3 cursor-pointer"
              >
                <span className="text-base font-bold text-white">
                  {item.title}
                </span>
                {isOpen ? <FiX size={20} /> : <FiPlus size={20} />}
              </button>
            </h2>
            <div
              id={`accordion-body-${item.id}`}
              role="region"
              aria-labelledby={`accordion-heading-${item.id}`}
              className={`grid font-secondary overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-5">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
