import useMousePosition from "./useMousePos";
const Cursor = () => {
const { x, y } = useMousePosition();
  return (
    <>
        <div className={"dot"}
        style={{ left: `${x}px`, top: `${y}px` }}
        color={'blue'}
        > <img src="cursor.svg" alt="" /></div>
      
    </>
  );
};
export default Cursor;