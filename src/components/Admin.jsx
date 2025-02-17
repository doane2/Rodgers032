import React, { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa'; // Import FaUserAlt for user icon
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase auth functions

function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null); // Manage user state
  const navigate = useNavigate();
  const auth = getAuth(); // Get Firebase auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state when authentication state changes
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      setShowDropdown(false); // Close the dropdown after signing out
      setUser(null); // Reset the user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-30 w-64 h-screen bg-white shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Close Icon for small screens */}
        <div className="lg:hidden flex justify-end p-4">
          <MdClose className="text-3xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        {/* Sidebar Content */}
        <div className="p-4 font-bold text-xl border-b">Admin Panel</div>
        <nav className="mt-4">
          <ul className="space-y-4 px-4">
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/orders">Orders</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/manageproducts">Manage Products</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/addproducts">Add Products</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/users">Users</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/sales">Sales</Link>
            </li>
            <li className="text-gray-700 hover:text-blue-500 transition-colors">
              <Link to="/admin/enquiries">Enquiries</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 bg-gray-100 overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-20 bg-white shadow-md p-4 flex justify-between items-center lg:ml-64">
          {/* Toggle Button for Small Screens */}
          <div className="lg:hidden">
            {!isSidebarOpen && (
              <IoMdMenu
                className="text-3xl cursor-pointer"
                onClick={toggleSidebar}
              />
            )}
          </div>

          {/* User Icon and Dropdown Menu */}
          <div className="relative ml-auto"> {/* Add ml-auto to push the user icon to the right */}
            {user ? (
              <div
                onClick={toggleDropdown}
                className="cursor-pointer text-xl bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600"
              >
                {user.displayName.charAt(0)} {/* Display first letter of displayName */}
              </div>
            ) : (
              <FaUserAlt 
                onClick={toggleDropdown} 
                className="cursor-pointer text-xl hover:text-gray-500" 
              />
            )}
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute z-50 right-0 mt-2 bg-white border rounded shadow-lg p-4 w-32">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="block text-center bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                  >
                    Log Out
                  </button>
                ) : (
                  <>
                    <Link to="/signup" className="block mb-2 text-center bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                      Sign Up
                    </Link>
                    <Link to="/login" className="block text-center bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main content scrollable section */}
        <div className="h-full p-4 pt-20 overflow-y-auto">
          <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
