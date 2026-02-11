"use client";

import React from 'react'; 
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default  function Sidebar() {
  const router = useRouter();


const handleLogout = async()=>{
  const res = await axios.post('/api/admin/auth/logout');
  // console.log(res.data);
  if(res.data.success){
    router.replace('/main/auth/login');
  }
  else{
    alert('Some error happen try Again!');
    console.log(res.error);
  }
}

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          Admin
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <a href="/main/admin" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
          <LayoutDashboard size={18} /> Dashboard
        </a>
        <a href="/main/admin/blogs" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <FileText size={18} /> Manage Blogs
        </a>
        {/* <a href="/admin/settings" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings size={18} /> Settings
        </a> */}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 p-3 w-full text-gray-600 hover:text-red-600 transition-colors"
        onClick={handleLogout}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
