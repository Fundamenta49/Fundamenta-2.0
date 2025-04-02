import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface SimpleResource {
  title: string;
  url: string;
  description: string;
}

interface SimpleResourceLinksProps {
  resources: SimpleResource[];
  className?: string;
}

export default function SimpleResourceLinks({ resources, className = "" }: SimpleResourceLinksProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {resources.map((resource, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-1">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => window.open(resource.url, "_blank")}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Resource
            </Button>
          </CardContent>
        </Card>
      ))}
      {resources.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>No resources available yet.</p>
        </div>
      )}
    </div>
  );
}