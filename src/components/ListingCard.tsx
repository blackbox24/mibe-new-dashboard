import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface ListingCardProps {
  id: number;
  title: string;
  image?: string;
  description?: string;
  price: number | null | string;
  priceLabel?: string;
  badges?: string[];
  published?: string;
  details?: Record<string, string | number>;
  onPublish?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ListingCard = ({
  id,
  title,
  image,
  description,
  price = null,
  priceLabel = 'Price',
  badges = [],
  details = {},
  published,
  onEdit,
  onPublish,
  onDelete
}: ListingCardProps) => {
  if(price !== null && typeof price === 'number'){
    price = `$${price.toString()}`;
  }else if(price === undefined || price === null){
    price = '';
  }
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      {image && (
        <div 
          className="aspect-video w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <div className="flex-shrink-0">
            <span className="font-bold text-travel-700">
              {price}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              { price !== "" ? `${priceLabel}` : '' }
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              
            </span>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {badges.filter(Boolean).map((badge, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-travel-100 text-travel-800 text-xs rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        {/* Toggle published */}
              <div className="flex justify-end">
                  <button
                    onClick={onPublish?.bind(null,id)}
                    className={`w-14 h-1 flex items-center rounded-full p-1 transition duration-300 focus:outline-none ${
                      published === "1" ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                        published === "1" ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </button>
              </div>
              {/* end toggle */}
      </CardHeader>
      <CardContent className="text-sm pb-4 flex-grow">
        {description && (
          <p className="mb-3 text-muted-foreground line-clamp-3">{description}</p>
        )}
        {Object.entries(details).length > 0 && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-muted-foreground">{key}:</dt>
                <dd className="text-right font-medium truncate">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        
      </CardContent>
      <CardFooter className="border-t pt-4 pb-4 flex justify-between gap-2 flex-wrap sm:flex-nowrap">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit?.(id)}
          className="flex-1"
        >
          <Pencil className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive border-destructive hover:bg-destructive/10 flex-1"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
