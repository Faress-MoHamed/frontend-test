import { Button } from "@/components/ui/button";
import type { Task } from "@/services/TaskService";

interface TaskFilterProps {
	filterPriority: "All" | Task["priority"];
	onFilterChange: (priority: "All" | Task["priority"]) => void;
}

export default function TaskFilter({
	filterPriority,
	onFilterChange,
}: TaskFilterProps) {
	return (
		<div className="flex gap-2 p-4 border rounded-lg shadow-sm bg-card">
			<Button
				variant={filterPriority === "All" ? "default" : "outline"}
				onClick={() => onFilterChange("All")}
			>
				All
			</Button>
			<Button
				variant={filterPriority === "High" ? "default" : "outline"}
				onClick={() => onFilterChange("High")}
			>
				High
			</Button>
			<Button
				variant={filterPriority === "Medium" ? "default" : "outline"}
				onClick={() => onFilterChange("Medium")}
			>
				Medium
			</Button>
			<Button
				variant={filterPriority === "Low" ? "default" : "outline"}
				onClick={() => onFilterChange("Low")}
			>
				Low
			</Button>
		</div>
	);
}
