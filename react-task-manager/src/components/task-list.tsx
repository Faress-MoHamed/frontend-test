import { useState, useEffect } from "react";
import { TaskService, type Task } from "@/services/TaskService";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import TaskForm from "./task-form";
import toast from "react-hot-toast";

interface TaskListProps {
	filterPriority: "All" | Task["priority"];
}

export default function TaskList({ filterPriority }: TaskListProps) {
	const [, setTasks] = useState<Task[]>([]);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const taskService = TaskService.getInstance();

	useEffect(() => {
		// Subscribe to task updates
		const unsubscribe = taskService.subscribe(setTasks);

		// Initialize with current tasks
		setTasks(taskService.getAllTasks());

		return unsubscribe;
	}, [taskService]);

	const filteredTasks = taskService.getFilteredTasks({
		priority: filterPriority,
	});

	const handleToggleCompletion = async (taskId: string) => {
		try {
			taskService.toggleTaskCompletion(taskId);
			toast.success("Task updated successfully") // Optional
		} catch (error) {
			console.error("Error toggling task completion:", error);
			toast.error("Failed to update task") // Optional
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		try {
			taskService.deleteTask(taskId);
			toast.success("Task deleted successfully") // Optional
		} catch (error) {
			console.error("Error deleting task:", error);
			toast.error("Failed to delete task") // Optional
		}
	};

	return (
		<div className="space-y-4 w-full">
			{editingTask && (
				<TaskForm
					initialTask={editingTask}
					onClose={() => setEditingTask(null)}
				/>
			)}

			{filteredTasks.length === 0 ? (
				<p className="text-center text-muted-foreground">
					No tasks found for the selected filter.
				</p>
			) : (
				<div className="grid gap-3">
					{filteredTasks.map((task) => (
						<Card
							key={task.id}
							className="flex md:flex-row flex-col items-center justify-between p-4"
						>
							<CardContent className="flex items-center gap-3 p-0">
								<Checkbox
									id={`task-${task.id}`}
									checked={task.completed}
									onCheckedChange={() => handleToggleCompletion(task.id)}
								/>
								<div className="grid gap-1">
									<label
										htmlFor={`task-${task.id}`}
										className={`font-medium ${
											task.completed ? "line-through text-muted-foreground" : ""
										}`}
									>
										{task.title}
									</label>
									<Badge
										className={`${taskService.getPriorityColor(
											task.priority
										)} w-fit`}
									>
										{task.priority} Priority
									</Badge>
								</div>
							</CardContent>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setEditingTask(task)}
									aria-label="Edit task"
								>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									variant="destructive"
									size="icon"
									onClick={() => handleDeleteTask(task.id)}
									aria-label="Delete task"
								>
									<Trash className="w-4 h-4" />
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
