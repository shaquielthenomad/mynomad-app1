import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  { id: 1, title: "Book flight to Paris", priority: "high", completed: false },
  { id: 2, title: "Pack travel essentials", priority: "medium", completed: true },
  { id: 3, title: "Renew passport", priority: "high", completed: false },
  { id: 4, title: "Research local attractions", priority: "low", completed: false },
];

export function TaskList() {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg border",
            task.completed && "opacity-60"
          )}
        >
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                task.priority === "high" && "bg-red-500",
                task.priority === "medium" && "bg-yellow-500",
                task.priority === "low" && "bg-green-500"
              )}
            />
            <span className={cn(task.completed && "line-through")}>
              {task.title}
            </span>
          </div>
          {task.completed ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
