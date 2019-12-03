import React, { FC, useState } from "react";
import Board from "../Board/Board";

const Game: FC = () => {
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(8);
  const [mines, setMines] = useState(10);

  return (
    <div className="game">
      <Board width={width} height={height} mines={mines}/>
    </div>
  )
};

export default Game;
