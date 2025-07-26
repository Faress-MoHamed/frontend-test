import { useState, useEffect } from "react";
import { TaskService } from "@/services/TaskService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function TaskStats() {
	const [stats, setStats] = useState({
		totalTasks: 0,
		completedTasks: 0,
		pendingTasks: 0,
		completionRate: 0,
		priorityBreakdown: { High: 0, Medium: 0, Low: 0 } as Record<
			"High" | "Medium" | "Low",
			number
		>,
	});

	const taskService = TaskService.getInstance();

	useEffect(() => {
		const updateStats = () => {
			setStats(taskService.getStatistics());
		};

		// Subscribe to task updates
		const unsubscribe = taskService.subscribe(updateStats);

		// Initialize with current stats
		updateStats();

		return unsubscribe;
	}, [taskService]);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalTasks}</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Completed</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">
						{stats.completedTasks}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Pending</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-orange-600">
						{stats.pendingTasks}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.completionRate}%</div>
					<Progress value={stats.completionRate} className="mt-2" />
				</CardContent>
			</Card>

			<Card className="md:col-span-2 lg:col-span-4">
				<CardHeader>
					<CardTitle className="text-sm font-medium">
						Priority Breakdown
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<div className="flex items-center gap-2">
							<Badge className="bg-red-500 text-white">High</Badge>
							<span>{stats.priorityBreakdown.High}</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge className="bg-yellow-500 text-white">Medium</Badge>
							<span>{stats.priorityBreakdown.Medium}</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge className="bg-green-500 text-white">Low</Badge>
							<span>{stats.priorityBreakdown.Low}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
