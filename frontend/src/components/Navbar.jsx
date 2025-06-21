import { React, useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  // State to control the visibility of the sidebar menu
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
    setCartItems({});
  };

  return (
    <nav className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Forever Logo" className="w-36" />
      </Link>

      {/* Navigation Links */}
      {/* a little bit of css added for every hr inside index.css file */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/*Icons */}
      <div className="flex items-center gap-6">
        {/* Search Icon */}
        <Link to="/collection">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt="menu search icon"
            className="w-5 cursor-pointer"
            title="Search"
          />
        </Link>
        {/* Profile Icon */}
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile icon"
          />
          {/* ---------Dropdown Menu---------- */}
          <div className="hidden group-hover:block absolute dropdown-menu right-0 pt-4">
            {token && (
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="w-5 min-w-5"
            alt="Cart"
            title="Cart"
          />
          {getCartCount() > 0 && (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          )}
        </Link>

        {/* Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="menu icon"
          className="w-5 cursor-pointer sm:hidden"
          title="Menu"
        />

        {/* Sidebar Menu for Small Screen */}
        <div
          className={`absolute right-0 top-0 bottom-0 overflow-hidden bg-white transition-all duration-200 ${
            visible ? "w-full" : "w-0"
          }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 cursor-pointer hover:text-gray-800"
            >
              <img
                className="h-4"
                src={assets.dropdown_icon}
                alt="close menu"
              />
              <p>BACK</p>
            </div>
            {/* Navlinks for small screen */}
            <div className="flex flex-col items-center">
              <NavLink
                to="/"
                onClick={() => setVisible(false)}
                className="hover:text-gray-800 border-t w-full text-center py-1"
              >
                HOME
              </NavLink>
              <NavLink
                to="/collection"
                onClick={() => setVisible(false)}
                className="hover:text-gray-800 border-t w-full text-center py-1"
              >
                COLLECTION
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setVisible(false)}
                className="hover:text-gray-800 border-t w-full text-center py-1"
              >
                ABOUT
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setVisible(false)}
                className="hover:text-gray-800 border-y pb-2 w-full text-center py-1"
              >
                CONTACT
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
