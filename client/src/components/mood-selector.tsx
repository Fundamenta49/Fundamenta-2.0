import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Smile, 
  Meh, 
  Frown,
  XCircle,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

const moods = [
  { 
    value: "great", 
    label: "Great", 
    icon: Trophy, 
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  { 
    value: "good", 
    label: "Good", 
    icon: Smile, 
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  { 
    value: "okay", 
    label: "Okay", 
    icon: Meh, 
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  { 
    value: "bad", 
    label: "Bad", 
    icon: Frown, 
    color: "text-red-500",
    bgColor: "bg-red-50"
  },
  { 
    value: "not-now", 
    label: "Not now", 
    icon: XCircle, 
    color: "text-slate-500",
    bgColor: "bg-slate-50"
  },
];

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<(typeof moods)[0] | null>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-2 rounded-full hover:bg-muted text-sm px-3",
            selectedMood?.bgColor
          )}
        >
          {selectedMood ? (
            <>
              <selectedMood.icon className={cn("h-4 w-4", selectedMood.color)} />
              <span>{selectedMood.label}</span>
            </>
          ) : (
            <>
              <Meh className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Mood</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <div className="text-xs font-medium text-muted-foreground py-1 px-2">
          How are you feeling?
        </div>
        {moods.map((mood) => (
          <DropdownMenuItem
            key={mood.value}
            onClick={() => setSelectedMood(mood)}
            className="gap-2 cursor-pointer"
          >
            <mood.icon className={cn("h-4 w-4", mood.color)} />
            <span>{mood.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}