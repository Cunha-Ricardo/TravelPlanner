import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLinkActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.12 15.39l-1.83-1.83c-3.34-3.34-3.34-8.77 0-12.12s8.77-3.34 12.12 0 3.34 8.77 0 12.12l-4.24 4.24a2 2 0 01-2.83 0l-3.17-3.17a2 2 0 012.83-2.83l2.83 2.83L15.3 8.12a4 4 0 00-5.66-5.66 4 4 0 00-1.17 2.83L8.47 5.3A6 6 0 0118 10a6 6 0 01-1.77 4.25l-1.83 1.83a2 2 0 01-2.83 0l-.13-.13a2 2 0 010-2.83l.13.13a2 2 0 002.83 0z" />
          </svg>
          <h1 className="text-xl font-accent font-semibold text-primary-600">
            TravelPlanner
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className={`${isLinkActive("/") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Início
          </Link>
          <Link href="/destinos" className={`${isLinkActive("/destinos") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Destinos
          </Link>
          <Link href="/conversao" className={`${isLinkActive("/conversao") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Conversão
          </Link>
          <Link href="/checklist" className={`${isLinkActive("/checklist") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Checklist
          </Link>
          <Link href="/roteiro" className={`${isLinkActive("/roteiro") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Roteiro
          </Link>
          <Link href="/chat" className={`${isLinkActive("/chat") ? "text-primary-600" : "text-gray-600 hover:text-primary-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Chat
          </Link>
        </div>
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile Navigation for smaller screens */}
      <div className={`md:hidden bg-white border-b ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col space-y-1 p-2">
          <Link href="/" className={`${isLinkActive("/") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Início
          </Link>
          <Link href="/destinos" className={`${isLinkActive("/destinos") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Destinos
          </Link>
          <Link href="/conversao" className={`${isLinkActive("/conversao") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Conversão
          </Link>
          <Link href="/checklist" className={`${isLinkActive("/checklist") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Checklist
          </Link>
          <Link href="/roteiro" className={`${isLinkActive("/roteiro") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Roteiro
          </Link>
          <Link href="/chat" className={`${isLinkActive("/chat") ? "text-primary-600" : "text-gray-600"} px-3 py-2 rounded-md text-sm font-medium`}>
            Chat
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
