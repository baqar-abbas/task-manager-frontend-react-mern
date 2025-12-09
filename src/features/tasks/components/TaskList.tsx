import React from "react";
import type { Task } from "../../../utils/types/api.types";
import TaskItem from "./TaskItem";
import Card from "../../../components/common/Card";
import { FaClipboardList } from "react-icons/fa";

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  // onStatusChange: (taskId: string, status: string) => void;
  onStatusChange: (
    taskId: string,
    status: "pending" | "in-progress" | "completed" | "archived"
  ) => void | Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onStatusChange,
}) => {
  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FaClipboardList className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          {tasks.length === 0
            ? "Create your first task to get started!"
            : "Try adjusting your filters to see more tasks."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
