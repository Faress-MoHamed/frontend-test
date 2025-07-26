// services/TaskService.ts
export interface Task {
	id: string;
	title: string;
	priority: "High" | "Medium" | "Low";
	completed: boolean;
}

export interface TaskFilters {
	priority: "All" | Task["priority"];
	completed?: boolean;
}

export class TaskService {
	private static instance: TaskService;
	private tasks: Task[] = [];
	private observers: Array<(tasks: Task[]) => void> = [];

	private constructor() {}

	public static getInstance(): TaskService {
		if (!TaskService.instance) {
			TaskService.instance = new TaskService();
		}
		return TaskService.instance;
	}

	// Observer pattern for state management
	public subscribe(observer: (tasks: Task[]) => void): () => void {
		this.observers.push(observer);
		return () => {
			this.observers = this.observers.filter((obs) => obs !== observer);
		};
	}

	private notifyObservers(): void {
		this.observers.forEach((observer) => observer([...this.tasks]));
	}

	public addTask(taskData: Omit<Task, "id">): Task {
		if (!taskData.title.trim()) {
			throw new Error("Task title cannot be empty");
		}

		const newTask: Task = {
			id: this.generateId(),
			...taskData,
		};

		this.tasks.push(newTask);
		this.notifyObservers();
		return newTask;
	}

	public editTask(updatedTask: Task): Task {
		if (!updatedTask.title.trim()) {
			throw new Error("Task title cannot be empty");
		}

		const index = this.tasks.findIndex((task) => task.id === updatedTask.id);
		if (index === -1) {
			throw new Error("Task not found");
		}

		this.tasks[index] = { ...updatedTask };
		this.notifyObservers();
		return this.tasks[index];
	}

	public deleteTask(taskId: string): boolean {
		const initialLength = this.tasks.length;
		this.tasks = this.tasks.filter((task) => task.id !== taskId);

		if (this.tasks.length === initialLength) {
			throw new Error("Task not found");
		}

		this.notifyObservers();
		return true;
	}

	public toggleTaskCompletion(taskId: string): Task {
		const task = this.tasks.find((task) => task.id === taskId);
		if (!task) {
			throw new Error("Task not found");
		}

		task.completed = !task.completed;
		this.notifyObservers();
		return task;
	}

	// Getter methods
	public getTaskById(taskId: string): Task | undefined {
		return this.tasks.find((task) => task.id === taskId);
	}

	public getAllTasks(): Task[] {
		return [...this.tasks];
	}

	public getFilteredTasks(filters: TaskFilters): Task[] {
		return this.tasks.filter((task) => {
			// Priority filter
			if (filters.priority !== "All" && task.priority !== filters.priority) {
				return false;
			}

			// Completion status filter (optional)
			if (
				filters.completed !== undefined &&
				task.completed !== filters.completed
			) {
				return false;
			}

			return true;
		});
	}

	// Utility methods
	public getTasksByPriority(priority: Task["priority"]): Task[] {
		return this.tasks.filter((task) => task.priority === priority);
	}

	public getCompletedTasks(): Task[] {
		return this.tasks.filter((task) => task.completed);
	}

	public getPendingTasks(): Task[] {
		return this.tasks.filter((task) => !task.completed);
	}

	public getTasksCount(): {
		total: number;
		completed: number;
		pending: number;
	} {
		const total = this.tasks.length;
		const completed = this.tasks.filter((task) => task.completed).length;
		const pending = total - completed;

		return { total, completed, pending };
	}

	// Priority utility methods
	public getPriorityColor(priority: Task["priority"]): string {
		switch (priority) {
			case "High":
				return "bg-red-500 text-white";
			case "Medium":
				return "bg-yellow-500 text-white";
			case "Low":
				return "bg-green-500 text-white";
			default:
				return "";
		}
	}

	public getPriorityWeight(priority: Task["priority"]): number {
		switch (priority) {
			case "High":
				return 3;
			case "Medium":
				return 2;
			case "Low":
				return 1;
			default:
				return 0;
		}
	}

	// Sorting methods
	public sortTasksByPriority(ascending: boolean = false): Task[] {
		return [...this.tasks].sort((a, b) => {
			const weightA = this.getPriorityWeight(a.priority);
			const weightB = this.getPriorityWeight(b.priority);
			return ascending ? weightA - weightB : weightB - weightA;
		});
	}

	public sortTasksByTitle(ascending: boolean = true): Task[] {
		return [...this.tasks].sort((a, b) => {
			const comparison = a.title.localeCompare(b.title);
			return ascending ? comparison : -comparison;
		});
	}

	// Bulk operations
	public setTasks(tasks: Task[]): void {
		this.tasks = [...tasks];
		this.notifyObservers();
	}

	public clearAllTasks(): void {
		this.tasks = [];
		this.notifyObservers();
	}

	public clearCompletedTasks(): Task[] {
		const completedTasks = this.tasks.filter((task) => task.completed);
		this.tasks = this.tasks.filter((task) => !task.completed);
		this.notifyObservers();
		return completedTasks;
	}

	public markAllAsCompleted(): void {
		this.tasks.forEach((task) => {
			task.completed = true;
		});
		this.notifyObservers();
	}

	public markAllAsIncomplete(): void {
		this.tasks.forEach((task) => {
			task.completed = false;
		});
		this.notifyObservers();
	}

	// Search functionality
	public searchTasks(query: string): Task[] {
		if (!query.trim()) {
			return [...this.tasks];
		}

		const lowercaseQuery = query.toLowerCase();
		return this.tasks.filter((task) =>
			task.title.toLowerCase().includes(lowercaseQuery)
		);
	}

	// Data persistence methods (for future use with localStorage, API, etc.)
	public exportTasks(): string {
		return JSON.stringify(this.tasks, null, 2);
	}

	public importTasks(jsonData: string): Task[] {
		try {
			const importedTasks: Task[] = JSON.parse(jsonData);
			const validTasks = importedTasks.filter(
				(task) =>
					task.id &&
					task.title &&
					["High", "Medium", "Low"].includes(task.priority) &&
					typeof task.completed === "boolean"
			);

			this.setTasks(validTasks);
			return validTasks;
		} catch (error) {
			console.log(error);
			throw new Error("Invalid JSON data for tasks import");
		}
	}

	// Statistics methods
	public getStatistics(): {
		totalTasks: number;
		completedTasks: number;
		pendingTasks: number;
		completionRate: number;
		priorityBreakdown: Record<Task["priority"], number>;
	} {
		const total = this.tasks.length;
		const completed = this.tasks.filter((task) => task.completed).length;
		const pending = total - completed;
		const completionRate = total > 0 ? (completed / total) * 100 : 0;

		const priorityBreakdown = this.tasks.reduce((acc, task) => {
			acc[task.priority] = (acc[task.priority] || 0) + 1;
			return acc;
		}, {} as Record<Task["priority"], number>);

		// Ensure all priorities are included
		(["High", "Medium", "Low"] as const).forEach((priority) => {
			if (!priorityBreakdown[priority]) {
				priorityBreakdown[priority] = 0;
			}
		});

		return {
			totalTasks: total,
			completedTasks: completed,
			pendingTasks: pending,
			completionRate: Math.round(completionRate),
			priorityBreakdown,
		};
	}

	// Private utility methods
	private generateId(): string {
		// Using timestamp + random number for better uniqueness
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	// Validation methods
	public validateTask(task: Partial<Task>): {
		isValid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (!task.title || !task.title.trim()) {
			errors.push("Title is required");
		}

		if (task.title && task.title.length > 200) {
			errors.push("Title must be less than 200 characters");
		}

		if (task.priority && !["High", "Medium", "Low"].includes(task.priority)) {
			errors.push("Priority must be High, Medium, or Low");
		}

		if (task.completed !== undefined && typeof task.completed !== "boolean") {
			errors.push("Completed status must be a boolean");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
