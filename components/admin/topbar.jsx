import React from 'react';
import { Bell } from 'lucide-react';

export default function Navbar({ email }) {
  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center px-8 sticky top-0 z-10">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {email}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell size={20} />
          </button>
          
          {/* <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          <a 
            href="admin/blogs/new" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <PlusCircle size={18} />
            New Post
          </a> */}
        </div>
      </div>
    </header>
  );
}
