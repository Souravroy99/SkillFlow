import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block w-[220px] sm:w-[250px] bg-gray-100 border-r border-gray-300 p-5 fixed top-0 left-0 h-screen">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">Menu</h2>

          <div className="space-y-4">
            <Link
              to="dashboard"
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                location.pathname.includes("dashboard")
                  ? "bg-blue-500 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              <ChartNoAxesColumn size={22} />
              <h1>Dashboard</h1>
            </Link>

            <Link
              to="course"
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                location.pathname.includes("course")
                  ? "bg-blue-500 text-white"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
            >
              <SquareLibrary size={22} />
              <h1>Courses</h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Prevent Overlap */}
      <div className="flex-1 p-10 lg:ml-[220px] sm:ml-[250px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
