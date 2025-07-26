import type React from "react";
import { useState, useEffect } from "react";
import { TaskService, type Task } from "@/services/TaskService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskFormProps {
	initialTask?: Task;
	onClose?: () => void;
}

export default function TaskForm({ initialTask, onClose }: TaskFormProps) {
	const [title, setTitle] = useState(initialTask?.title || "");
	const [priority, setPriority] = useState<Task["priority"]>(
		initialTask?.priority || "Medium"
	);
	const [errors, setErrors] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const taskService = TaskService.getInstance();

	useEffect(() => {
		if (initialTask) {
			setTitle(initialTask.title);
			setPriority(initialTask.priority);
		} else {
			setTitle("");
			setPriority("Medium");
		}
		setErrors([]);
	}, [initialTask]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors([]);

		try {
			// Validate the task data
			const validation = taskService.validateTask({
				title,
				priority,
				completed: false,
			});

			if (!validation.isValid) {
				setErrors(validation.errors);
				setIsSubmitting(false);
				return;
			}

			if (initialTask) {
				taskService.editTask({ ...initialTask, title, priority });
			} else {
				taskService.addTask({ title, priority, completed: false });
			}

			// Reset form
			setTitle("");
			setPriority("Medium");
			onClose?.();
		} catch (error) {
			console.error("Error saving task:", error);
			setErrors([error instanceof Error ? error.message : "An error occurred"]);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-card"
		>
			<h2 className="text-lg font-semibold">
				{initialTask ? "Edit Task" : "Add New Task"}
			</h2>

			{errors.length > 0 && (
				<Alert variant="destructive">
					<AlertDescription>
						<ul className="list-disc list-inside">
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-2">
				<Label htmlFor="task-title">Task Title</Label>
				<Input
					id="task-title"
					type="text"
					placeholder="Enter task title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="task-priority">Priority</Label>
				<Select
					value={priority}
					onValueChange={(value: Task["priority"]) => setPriority(value)}
					disabled={isSubmitting}
				>
					<SelectTrigger id="task-priority">
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="High">High</SelectItem>
						<SelectItem value="Medium">Medium</SelectItem>
						<SelectItem value="Low">Low</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex gap-2">
				<Button type="submit" className="flex-1" disabled={isSubmitting}>
					{isSubmitting
						? "Saving..."
						: initialTask
						? "Save Changes"
						: "Add Task"}
				</Button>
				{onClose && (
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="flex-1 bg-transparent"
						disabled={isSubmitting}
					>
						Cancel
					</Button>
				)}
			</div>
		</form>
	);
}
