import { Box } from "@chakra-ui/react";
import useMousePosition from "../context/useMousePos";
const Cursor = () => {
const { x, y } = useMousePosition();
  return (
    <Box display={{sm:"inline", base:"none"}}>
        <div className={"dot"}
        style={{ left: `${x}px`, top: `${y}px` }}
        color={'blue'}
        > <img src="cursor.svg" alt="" /></div>
      
    </Box>
  );
};
export default Cursor;