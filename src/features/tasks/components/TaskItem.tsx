import React, { useState } from "react";
import type { Task } from "../../../utils/types/api.types";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import TaskForm from "./TaskForm";
import {
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaFlag,
  FaCalendarAlt,
  FaTags,
} from "react-icons/fa";

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  // onStatusChange: (taskId: string, status: string) => void;
  onStatusChange: (
    taskId: string,
    status: "pending" | "in-progress" | "completed" | "archived"
  ) => void | Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onStatusChange,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
    urgent: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const statusIcons = {
    pending: <FaClock className="text-yellow-500" />,
    "in-progress": <FaClock className="text-blue-500" />,
    completed: <FaCheckCircle className="text-green-500" />,
    archived: <FaCheckCircle className="text-gray-500" />,
  };

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
    archived: "Archived",
  };

  const handleStatusClick = () => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    onStatusChange(task._id, nextStatus);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Section - Task Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <button
                onClick={handleStatusClick}
                className="mt-1 flex-shrink-0"
              >
                {statusIcons[task.status]}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className={`font-semibold ${
                      task.status === "completed"
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      priorityColors[task.priority]
                    }`}
                  >
                    <FaFlag className="inline mr-1" />
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                )}

                {/* Tags and Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    {statusIcons[task.status]}
                    {statusLabels[task.status]}
                  </span>

                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FaTags />
                      {task.tags.slice(0, 3).join(", ")}
                      {task.tags.length > 3 && ` +${task.tags.length - 3}`}
                    </span>
                  )}

                  {/* {task.estimatedTime > 0 && (
                    <span>Est: {task.estimatedTime}m</span>
                  )} */}

                  {task.estimatedTime && task.estimatedTime > 0 && (
                    <span>Est: {task.estimatedTime}m</span>
                  )}

                  {task.actualTimeSpent > 0 && (
                    <span>Spent: {task.actualTimeSpent}m</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <FaEdit />
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(task._id)}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        size="lg"
      >
        <TaskForm
          task={task}
          onSuccess={() => {
            setShowEditModal(false);
            window.location.reload(); // Simple refresh to update list
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

export default TaskItem;
