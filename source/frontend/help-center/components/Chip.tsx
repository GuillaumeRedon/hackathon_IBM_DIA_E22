interface ChipProps {
  title: string;
}

export default function Chip({ 
  title,
}: ChipProps) {
  return (
    <div className="inline-block px-3 py-3 bg-strong-blue text-white text-sm font-medium rounded-md">
        <p>{title}</p>
    </div>
  );
}
