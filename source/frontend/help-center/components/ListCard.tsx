import Card from './utils/Card';
import { LucideIcon } from 'lucide-react';

interface ListItem {
  icon: LucideIcon;
  text: string;
  href?: string;
}

interface ListCardProps {
  title: string;
  items: ListItem[];
  color?: string;
}

export default function ListCard({ 
  title, 
  items, 
  color = 'bg-white' 
}: ListCardProps) {
  return (
    <Card color={color}>
      {/* Titre */}
      <h2 className="strong-blue text-xl font-semibold mb-3">{title}</h2>
      
      {/* Liste d'éléments */}
      <div className="space-y-1">
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              key={index}
              href={item.href || "#"}
              className="flex items-center gap-3 px-3 py-1 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors no-underline group"
            >
              <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors shrink-0" />
              <span className="text-sm font-medium group-hover:text-gray-900">{item.text}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
}
