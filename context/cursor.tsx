import useMousePosition from "./useMousePos";
import { CiCompass1 } from "react-icons/ci";
const Cursor = () => {
const { x, y } = useMousePosition();
  return (
    <>
      <div
        className={"ring"}
        style={{ left: `${x}px`, top: `${y}px` }}
      ></div>
      
        <CiCompass1 className={"dot"}
        style={{ left: `${x}px`, top: `${y}px` }}
        color={'blue'}
        />
      
    </>
  );
};
export default Cursor;