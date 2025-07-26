import { useState, useEffect } from "react";
import { TaskService, type Task } from "@/services/TaskService";

export function useTaskService() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const taskService = TaskService.getInstance();

	useEffect(() => {
		const unsubscribe = taskService.subscribe((updatedTasks) => {
			setTasks(updatedTasks);
			setIsLoading(false);
		});

		// Initialize with current tasks
		setTasks(taskService.getAllTasks());
		setIsLoading(false);

		return unsubscribe;
	}, [taskService]);

	return {
		tasks,
		isLoading,
		taskService,
		// Convenience methods
		addTask: (taskData: Omit<Task, "id">) => taskService.addTask(taskData),
		editTask: (task: Task) => taskService.editTask(task),
		deleteTask: (taskId: string) => taskService.deleteTask(taskId),
		toggleCompletion: (taskId: string) =>
			taskService.toggleTaskCompletion(taskId),
		getFilteredTasks: (filters: { priority: "All" | Task["priority"] }) =>
			taskService.getFilteredTasks(filters),
		getStats: () => taskService.getStatistics(),
	};
}
