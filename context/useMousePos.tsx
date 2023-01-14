import { useEffect, useState } from "react";
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
useEffect(() => {
    const mouseMoveHandler = (event:any) => {
      const { clientX, clientY } = event;
      setMousePosition({ x: clientX, y: clientY });
    };
    document.addEventListener("mousemove", mouseMoveHandler);
return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);
return mousePosition;
};
export default useMousePosition;