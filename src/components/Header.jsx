import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { useSelector } from 'react-redux';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; // Firebase authentication functions

const Header = () => {
  const [user, setUser] = useState(null); // Manage user state
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false); // For large screens
  const [showMobileAboutDropdown, setShowMobileAboutDropdown] = useState(false); // For small screens
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth(); // Get Firebase auth instance

  // useEffect to handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state when authentication state changes
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // About Us hover functionality (large screens)
  const handleAboutMouseEnter = () => {
    setShowAboutDropdown(true);
  };

  const handleAboutMouseLeave = () => {
    setShowAboutDropdown(false);
  };

  // Toggle "About Us" dropdown for mobile view
  const toggleMobileAboutDropdown = () => {
    setShowMobileAboutDropdown(!showMobileAboutDropdown);
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      setShowDropdown(false); // Close the dropdown after signing out
      setUser(null); // Reset the user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Sign-out error:", error);
    }
     setShowMobileMenu(false)
  };

  const items = useSelector((state) => state.cart.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    
    <header className="bg-white text-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold mb-1">Welcome to Alfamaba Services</h1>
          <Link to="/products" className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
            Shop Now
          </Link>
        </div>

        {/* Navigation Menu (visible on large screens) */}
        <nav className="hidden lg:flex space-x-6">
          <ul className="flex space-x-6">
            {/* About Link with Dropdown (large screens) */}

            <li>
              <Link to="/" className="hover:text-gray-500">
                Home
              </Link>
            </li>
            <li
              className="relative group"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <span className="hover:text-gray-500 cursor-pointer">
                About Us
              </span>

              {/* Dropdown content */}
              {showAboutDropdown && (
                <ul className="absolute left-0 mt bg-white border w-48 rounded shadow-lg py-2 z-50">
                  <li>
                    <Link to="/vision" className="block px-4 py-2 hover:bg-gray-100">
                      Vision, Mission and Core Values
                    </Link>
                  </li>
                  <li>
                    <Link to="/approach" className="block px-4 py-2 hover:bg-gray-100">
                      Our Approach
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">
                      Our Products
                    </Link>
                  </li>
                </ul>
              )}
            </li>

          
            <li>
              <Link to="/contact-us" className="hover:text-gray-500">
                Contact us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Shopping Cart Icon */}
        <div>
          <Link to="/carts" className="relative">
            <PiShoppingCartSimpleLight className="text-3xl text-yellow-800/100" />
            <span className="absolute top-[-10px] right-[-12px] bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          </Link>
        </div>

        {/* User Icon with Dropdown (visible on all screens) */}
        <div className="relative hidden lg:block">
          {/* If the user is logged in, show the first letter of the displayName */}
          {user ? (
            <div
              onClick={toggleDropdown}
              className="cursor-pointer text-xl bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600"
            >
              {/* Check if displayName exists before calling charAt */}
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
          ) : (
            <FaUserAlt onClick={toggleDropdown} className="cursor-pointer text-xl hover:text-gray-500" />
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

        {/* Hamburger Menu (Mobile View) */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            {showMobileMenu ? (
              <IoMdClose className="text-4xl font-bold"/>
            ) : (
              <IoMenu className="text-4xl font-bold" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown for menu items */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          {/* About Us section for mobile */}
          <div className="border-b">
          <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100"  onClick={() => setShowMobileMenu(false)}>Home</Link>

            <button
              onClick={toggleMobileAboutDropdown}
              className="w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              About Us
            </button>
            {showMobileAboutDropdown && (
              <ul className="pl-4 w-44 border border-gray-300">
                <li onClick={() => setShowMobileMenu(false)}>
                  <Link to="/vision" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">
                    Vision, Mission and Core Values
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu(false)}>
                  <Link to="/approach" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">
                    Our Approach
                  </Link>
                </li>
                <li onClick={() => setShowMobileMenu(false)}>
                  <Link to="/products" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">
                    Our Products
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <Link to="/contact-us" className="block py-2 px-4 text-gray-700 hover:bg-gray-100" onClick={() => setShowMobileMenu(false)}>Contact us</Link>

          <div className="relative">
            {/* If the user is logged in, show the first letter of the displayName */}
            {user ? (
              <div
                onClick={toggleDropdown}
                className="cursor-pointer text-xl bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600"
              >
                {user.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
            ) : (
              <FaUserAlt onClick={toggleDropdown} className="cursor-pointer text-xl hover:text-gray-500" />
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
                    <Link to="/signup" className="block mb-2 text-center bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600" onClick={() => setShowMobileMenu(false)}>
                      Sign Up
                    </Link>
                    <Link to="/login" className="block text-center bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600" onClick={() => setShowMobileMenu(false)}>
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;