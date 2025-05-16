import { Link, useLocation } from "wouter";
import { Home, Map, DollarSign, CheckSquare, Calendar, MessageCircle } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  const isLinkActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 flex justify-around p-2 z-50">
      <Link href="/">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/") ? "text-primary-600" : "text-gray-500"}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Início</span>
        </a>
      </Link>
      <Link href="/destinos">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/destinos") ? "text-primary-600" : "text-gray-500"}`}>
          <Map className="h-6 w-6" />
          <span className="text-xs mt-1">Destinos</span>
        </a>
      </Link>
      <Link href="/conversao">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/conversao") ? "text-primary-600" : "text-gray-500"}`}>
          <DollarSign className="h-6 w-6" />
          <span className="text-xs mt-1">Conversão</span>
        </a>
      </Link>
      <Link href="/checklist">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/checklist") ? "text-primary-600" : "text-gray-500"}`}>
          <CheckSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Checklist</span>
        </a>
      </Link>
      <Link href="/roteiro">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/roteiro") ? "text-primary-600" : "text-gray-500"}`}>
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Roteiro</span>
        </a>
      </Link>
      <Link href="/chat">
        <a className={`flex flex-col items-center justify-center w-1/6 py-1 ${isLinkActive("/chat") ? "text-primary-600" : "text-gray-500"}`}>
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Chat</span>
        </a>
      </Link>
    </div>
  );
};

export default MobileNav;
