import { useState } from "react";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import TaskFilter from "@/components/task-filter";
import type { Task } from "@/redux/tasksSlice";
import TaskStats from "@/components/TaskStats";

export default function Home() {
	const [filterPriority, setFilterPriority] = useState<
		"All" | Task["priority"]
	>("All");

	return (
		<div className="flex flex-col items-center min-h-screen bg-background p-4 md:p-6 w-full">
			<main className="w-full max-w-2xl space-y-6">
				<h1 className="text-3xl font-bold text-center">Task Manager</h1>
				<TaskForm />
				<TaskFilter
					filterPriority={filterPriority}
					onFilterChange={setFilterPriority}
				/>
				<TaskList filterPriority={filterPriority} />
				<TaskStats />
			</main>
		</div>
	);
}
