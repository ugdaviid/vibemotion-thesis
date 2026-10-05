// src/components/SideBar.jsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Home", path: "/main" },
  // TODO: Profile (/profile) és Favourite (/favourite) – ha lesz hozzájuk oldal és route
];

function SideBarComponent({ isOpen, onClose }) {
  const location = useLocation();

  const renderedMenu = useMemo(
    () =>
      menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`p-3 rounded-lg hover:bg-neon-purple/40 transition ${
            location.pathname === item.path ? "bg-neon-purple/60" : ""
          }`}
          onClick={onClose}
        >
          {item.name}
        </Link>
      )),
    [location.pathname, onClose]
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 md:top-24 left-0 h-full md:h-[calc(100%-6rem)] pt-16 md:pt-0 w-60 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 bg-gradient-to-b from-black via-[#1a002e] to-[#3b0066]" : "-translate-x-full"} 
          z-40 md:translate-x-0 md:bg-transparent`}
      >
        <button
          className="text-white text-3xl self-end m-4 md:hidden"
          onClick={onClose}
        >
          &times;
        </button>

        <nav className="flex flex-col gap-4 mt-6 p-6">
          {renderedMenu}
        </nav>
      </div>
    </>
  );
}

// React.memo → stabil render, csak ha props változik
export default React.memo(SideBarComponent);
