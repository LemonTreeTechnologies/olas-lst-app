type Item = {
  label: string;
  value: string;
};

type KeyValueListProps = {
  items: Item[];
};

export const KeyValueList = ({ items }: KeyValueListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border-b border-[#FFFFFF0D] pb-1"
        >
          <span className="font-secondary">{item.label}</span>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
