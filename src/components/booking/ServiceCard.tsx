"use client";

import Image from "next/image";
import { Service } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import { BookingWizard } from "./BookingWizard";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [showWizard, setShowWizard] = useState(false);
  
  // Find the requested image or default to the first one. 
  // Added extra safety check to prevent "undefined" access.
  const image = PlaceHolderImages.find(img => img.id === service.imageKey) || PlaceHolderImages[0] || {
    imageUrl: "https://picsum.photos/seed/placeholder/600/400",
    imageHint: "placeholder image"
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm">
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={image.imageUrl} 
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={image.imageHint}
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-primary hover:bg-white font-semibold">
              ${service.price}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {service.type}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{service.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {service.description}
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              {service.durationMinutes} mins
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-accent" />
              Up to {service.maxCapacity}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full rounded-xl gap-2 font-semibold shadow-md"
            onClick={() => setShowWizard(true)}
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Button>
        </CardFooter>
      </Card>

      <BookingWizard 
        open={showWizard} 
        onOpenChange={setShowWizard} 
        service={service} 
      />
    </>
  );
}
