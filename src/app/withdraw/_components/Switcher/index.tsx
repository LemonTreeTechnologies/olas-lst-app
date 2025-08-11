type SwitcherProps = {
  tabs: string[];
  selected: string;
  onChange: (tab: string) => void;
};

export const Switcher = ({ tabs, selected, onChange }: SwitcherProps) => {
  const selectedIndex = tabs.indexOf(selected);

  return (
    <div className="relative flex rounded-lg border border-neutral-700 bg-[#FFFFFF0D] p-1 w-full">
      <div
        className="absolute top-1 bottom-1 left-1 rounded-lg bg-[#FFFFFF1A] transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(${selectedIndex * 97}%)`,
          width: `${100 / tabs.length}%`,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="relative z-10 px-6 py-2 w-full rounded-lg transition-colors duration-200 text-white font-semibold cursor-pointer"
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
