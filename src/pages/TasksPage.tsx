import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} from "../features/tasks/tasksApi";
import { setFilters } from "../features/tasks/tasksSlice";
import TaskList from "../features/tasks/components/TaskList";
import TaskForm from "../features/tasks/components/TaskForm";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { FaPlus, FaFilter, FaSort } from "react-icons/fa";

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.tasks);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tasks with current filters
  const { data: tasksData, isLoading, refetch } = useGetTasksQuery(filters);
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const tasks = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination;

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    handleFilterChange(
      "status",
      status === filters.status ? undefined : status
    );
  };

  const handlePriorityFilter = (priority: string) => {
    handleFilterChange(
      "priority",
      priority === filters.priority ? undefined : priority
    );
  };

  const handleSort = (sortBy: string) => {
    const sortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "desc"
        ? "asc"
        : "desc";
    dispatch(setFilters({ sortBy, sortOrder }));
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleStatusChange = async (
    taskId: string,
    // status: string - Replace with correct type
    status: "pending" | "in-progress" | "completed" | "archived"
  ) => {
    try {
      await updateTaskStatus({ id: taskId, data: { status } }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <p className="text-gray-600 mt-2">
            {pagination?.total || 0} tasks total
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">
          <FaPlus className="mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search || ""}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value || undefined)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={filters.priority || ""}
                onChange={(e) =>
                  handleFilterChange("priority", e.target.value || undefined)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Sort */}
            <Button
              variant="outline"
              onClick={() => handleSort("createdAt")}
              className="flex items-center"
            >
              <FaSort className="mr-2" />
              {filters.sortBy === "createdAt"
                ? filters.sortOrder === "desc"
                  ? "Newest"
                  : "Oldest"
                : "Sort"}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.status || filters.priority || filters.search) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange("status", undefined)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priority && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Priority: {filters.priority}
                <button
                  onClick={() => handleFilterChange("priority", undefined)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                Search: {filters.search}
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Tasks List */}
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.total
              )}{" "}
              of {pagination.total} tasks
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;
