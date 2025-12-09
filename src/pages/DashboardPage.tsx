import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useGetTasksQuery,
  useGetTaskStatsQuery,
} from "../features/tasks/tasksApi";
import { setFilters } from "../features/tasks/tasksSlice";
import { useGetProfileQuery } from "../features/auth/authApi";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import { FaTasks, FaCheckCircle, FaClock, FaChartLine } from "react-icons/fa";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { filters } = useAppSelector((state) => state.tasks);

  // Fetch user profile
  const { data: profileData } = useGetProfileQuery();

  // Fetch tasks with current filters
  const { data: tasksData, isLoading: tasksLoading } =
    useGetTasksQuery(filters);

  // Fetch task statistics
  const { data: statsData, isLoading: statsLoading } = useGetTaskStatsQuery();

  // Update filters to get recent tasks
  useEffect(() => {
    dispatch(
      setFilters({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: 5,
      })
    );
  }, [dispatch]);

  const stats = statsData?.data?.stats || {
    totalTasks: 0,
    totalTimeSpent: 0,
    byStatus: [],
  };

  const recentTasks = tasksData?.data?.tasks || [];

  const statusCounts = {
    pending:
      stats.byStatus.find((s: any) => s.status === "pending")?.count || 0,
    completed:
      stats.byStatus.find((s: any) => s.status === "completed")?.count || 0,
    inProgress:
      stats.byStatus.find((s: any) => s.status === "in-progress")?.count || 0,
  };

  if (tasksLoading || statsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.username || "User"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalTasks}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaTasks className="text-white text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {statusCounts.completed}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {stats.totalTasks > 0
                  ? `${Math.round(
                      (statusCounts.completed / stats.totalTasks) * 100
                    )}% done`
                  : "0% done"}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {statusCounts.inProgress}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <FaClock className="text-white text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Time Spent</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {Math.round(stats.totalTimeSpent / 60)}h
              </p>
              <p className="text-sm text-purple-600 mt-1">
                {stats.totalTimeSpent % 60}m
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <FaChartLine className="text-white text-2xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Tasks
            </h2>
            <a
              href="/tasks"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View all →
            </a>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No tasks yet. Create your first task!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Task Distribution
          </h2>

          <div className="space-y-6">
            {/* Status Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                By Status
              </h3>
              <div className="space-y-2">
                {[
                  {
                    status: "Pending",
                    count: statusCounts.pending,
                    color: "bg-yellow-500",
                  },
                  {
                    status: "In Progress",
                    count: statusCounts.inProgress,
                    color: "bg-blue-500",
                  },
                  {
                    status: "Completed",
                    count: statusCounts.completed,
                    color: "bg-green-500",
                  },
                ].map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {item.status}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                By Priority
              </h3>
              <div className="space-y-2">
                {[
                  { priority: "High", color: "bg-red-500" },
                  { priority: "Medium", color: "bg-yellow-500" },
                  { priority: "Low", color: "bg-green-500" },
                ].map((item) => (
                  <div
                    key={item.priority}
                    className="flex items-center space-x-2"
                  >
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600">
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
                  + Create New Task
                </button>
                <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  View Completed Tasks
                </button>
                <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  Export Tasks
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* User Info */}
      {profileData?.data?.user && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Account Information
              </h3>
              <p className="text-gray-600 mt-1">
                Member since{" "}
                {new Date(profileData.data.user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="font-medium text-gray-800">
                {profileData.data.user.lastLogin
                  ? new Date(
                      profileData.data.user.lastLogin
                    ).toLocaleDateString()
                  : "Today"}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
