type Item = {
  label: string;
  value: string | React.ReactElement;
};

type KeyValueListProps = {
  items: Item[];
};

export const KeyValueList = ({ items }: KeyValueListProps) => {
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between [&:not(:last-child)]:border-b border-white/10 pt-[10px] pb-[10px]"
        >
          <span className="font-tertiary">{item.label}</span>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
