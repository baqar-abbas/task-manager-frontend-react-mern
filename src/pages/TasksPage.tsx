import React, { useState, useEffect } from "react";
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
import SocketService from "../services/socket";
import {
  FaPlus,
  FaFilter,
  FaSort,
  FaSync,
  FaChartBar,
  FaDownload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.tasks);
  const { socketConnected } = useAppSelector((state) => state.auth);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showArchived, setShowArchived] = useState(false);

  // Fetch tasks with current filters
  const {
    data: tasksData,
    isLoading,
    refetch,
    isFetching,
  } = useGetTasksQuery(filters);

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const tasks = tasksData?.data?.tasks || [];
  const pagination = tasksData?.data?.pagination;

  // Join socket rooms for current tasks
  useEffect(() => {
    tasks.forEach((task) => {
      SocketService.joinTaskRoom(task._id);
    });

    return () => {
      tasks.forEach((task) => {
        SocketService.leaveTaskRoom(task._id);
      });
    };
  }, [tasks]);

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value);
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
        // Leave the task room when deleted
        SocketService.leaveTaskRoom(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleStatusChange = async (
    taskId: string,
    status: "pending" | "in-progress" | "completed" | "archived"
  ) => {
    try {
      await updateTaskStatus({ id: taskId, data: { status } }).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleExportTasks = () => {
    const tasksJson = JSON.stringify(tasks, null, 2);
    const blob = new Blob([tasksJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        status: undefined,
        priority: undefined,
        search: "",
        page: 1,
      })
    );
  };

  const toggleArchived = () => {
    if (showArchived) {
      handleFilterChange("status", undefined);
    } else {
      handleFilterChange("status", "archived");
    }
    setShowArchived(!showArchived);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600">
              {pagination?.total || 0} tasks total
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  socketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-500">
                {socketConnected ? "Live updates enabled" : "Reconnecting..."}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={toggleArchived}
            variant={showArchived ? "primary" : "outline"}
            size="sm"
          >
            {showArchived ? (
              <FaEyeSlash className="mr-2" />
            ) : (
              <FaEye className="mr-2" />
            )}
            {showArchived ? "Hide Archived" : "Show Archived"}
          </Button>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <FaFilter className="mr-2" />
            Filters
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isFetching}
          >
            <FaSync className={`mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button onClick={handleExportTasks} variant="outline" size="sm">
            <FaDownload className="mr-2" />
            Export
          </Button>

          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <FaPlus className="mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <Card
        className={`transition-all duration-300 ${
          showFilters ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks by title, description, or tags..."
                value={filters.search || ""}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value || undefined)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={showArchived}
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
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => handleSort(filters.sortBy)}
              className="flex items-center"
            >
              <FaSort className="mr-2" />
              {filters.sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
            </Button>

            {/* Clear Filters */}
            {(filters.status || filters.priority || filters.search) && (
              <Button
                variant="secondary"
                onClick={handleClearFilters}
                size="sm"
              >
                Clear Filters
              </Button>
            )}
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

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-sm ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-sm ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        {isFetching && (
          <div className="flex items-center text-sm text-gray-500">
            <FaSync className="animate-spin mr-2" />
            Updating...
          </div>
        )}
      </div>

      {/* Tasks List */}
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Empty State */}
      {tasks.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <FaChartBar className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters to see more tasks."
              : "Create your first task to get started!"}
          </p>
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <FaPlus className="mr-2" />
            Create Your First Task
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <div className="flex items-center">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 mx-1 rounded ${
                          pagination.currentPage === pageNum
                            ? "bg-primary-600 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
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
