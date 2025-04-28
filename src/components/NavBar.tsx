
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-white shadow-sm mb-6 py-4">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link to="/">
          <Button 
            variant={currentPath === "/" ? "default" : "outline"}
            className={currentPath === "/" ? "bg-blue-600" : ""}
          >
            Tính toán điện mặt trời
          </Button>
        </Link>
        <Link to="/consumption">
          <Button 
            variant={currentPath === "/consumption" ? "default" : "outline"}
            className={currentPath === "/consumption" ? "bg-green-600" : ""}
          >
            Từ hóa đơn điện
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
