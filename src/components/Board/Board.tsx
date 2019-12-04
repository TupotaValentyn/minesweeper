import React, { FC, useCallback, useEffect, useState } from "react";
import Cell from "../Cell/Cell";

type Props = {
  height: number;
  width: number;
  mines: number
}

const Board: FC<Props> = ({width, height, mines}) => {
  const [gameStatus, setGameStatus] = useState('');
  const [mineCount, setMineCount] = useState(0);

  const createEmptyArray = (height: number, width: number) => {
    return Array
      .from(Array(width)
        .fill(0), (_: number, y: number) => new Array(height)
        .fill(0)
        .map((__: number, x: number) => ({
          x,
          y,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        })));
  };

  const getRandomNumber = (dimension: number): number => {
    return Math.floor((Math.random() * 1000) + 1) % dimension;
  };

  const plantMines = (emptyArray: any, height: number, width: number, mines: number) => {
    let randomx, randomy = 0;

    let i = mines;
    for (; i--;) {
      [randomx, randomy] = [getRandomNumber(width), getRandomNumber(height)];

      if (!emptyArray[randomx][randomy].isMine) {
        emptyArray[randomx][randomy].isMine = true;
      }
    }

    return emptyArray;
  };

  const traverseBoard = (cellX: number, cellY: number, boardArray: any) => {
    const el = [];

    //up
    if (cellX > 0) {
      el.push(boardArray[cellX - 1][cellY]);
    }

    //down
    if (cellX < height - 1) {
      el.push(boardArray[cellX + 1][cellY]);
    }

    //left
    if (cellY > 0) {
      el.push(boardArray[cellX][cellY - 1]);
    }

    //right
    if (cellY < width - 1) {
      el.push(boardArray[cellX][cellY + 1]);
    }

    // top left
    if (cellX > 0 && cellY > 0) {
      el.push(boardArray[cellX - 1][cellY - 1]);
    }

    // top right
    if (cellX > 0 && cellY < width - 1) {
      el.push(boardArray[cellX - 1][cellY + 1]);
    }

    // bottom right
    if (cellX < height - 1 && cellY < width - 1) {
      el.push(boardArray[cellX + 1][cellY + 1]);
    }

    // bottom left
    if (cellX < height - 1 && cellY > 0) {
      el.push(boardArray[cellX + 1][cellY - 1]);
    }

    return el;
  };

  const getNeighbours = (arrayWithMines: any) => {
    return arrayWithMines.map((oneDimensionArray: any) => {
      return oneDimensionArray.map((cell: any) => {
        if (!!cell.isMine) {
          let mine = 0;
          const area = traverseBoard(cell.x, cell.y, arrayWithMines);
          area.map((value: any) => {
            if (value.isMine) {
              mine++;
            }
            return false;
          });

          if (mine === 0) {
            cell.isEmpty = true;
          }
          cell.neighbour = mine;
        }
        return cell;
      })
    });
  };

  const initBoard = (height: number, width: number, mines: number) => {
    const dataArray = createEmptyArray(height, width);
    const arrayWithMines = plantMines(dataArray, height, width, mines);
    return getNeighbours(arrayWithMines);
  };

  const [board, setBoard] = useState(initBoard(height, width, mines));

  const revealBoard = () => {
    setBoard((prevBoard: any) => {
      return prevBoard.map((datarow: any) => {
        return datarow.map((dataitem: any) => {
          dataitem.isRevealed = true;
          return dataitem
        });
      });
    })
  };

  const getFlags = (data: any) => {
    return data.map((datarow: any) => {
      return datarow.map((dataitem: any) => {
        if (dataitem.isFlagged) {
          return dataitem;
        }
        return false;
      });
    });
  };

  const revealEmpty = (x: any, y: any, data: any) => {
    let area = traverseBoard(x, y, data);
    area.map(value => {
      if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          revealEmpty(value.x, value.y, data);
        }
      }
    });
    return data;
  };

  const getHidden = (data: any) => {
    return data.map((datarow: any) => {
      return datarow.map((dataitem: any) => {
        if (!dataitem.isRevealed) {
          return dataitem;
        }
        return false;
      });
    });
  };


  const _handleCellClick = (y: any, x: any) => {

    // check if revealed. return if true.
    if (board[x][y].isRevealed || board[x][y].isFlagged) return null;

    // check if mine. game over if true
    if (board[x][y].isMine) {
      setGameStatus('You Lost.');
      revealBoard();
      alert("game over");
    }

    let updatedData = [...board];
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(x, y, updatedData);
    }

    if (getHidden(updatedData).length === mines) {
      setMineCount(0);
      setGameStatus('You Win.');
      revealBoard();
      alert("You Win");
    }
    setBoard(() => updatedData);
    setMineCount(mines - getFlags(updatedData).length);
  };

  // cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}

  const renderBoard = useCallback(() => {
    return board.map((datarow: any) => {
      return datarow.map((dataitem: any) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              onClick={() => _handleCellClick(dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {(datarow[datarow.length - 1] === dataitem) ? <div className="clear"/> : ""}
          </div>);
      })
    });
  }, [board]);

  return (
    <div>
      Board
      <div>
        {renderBoard()}
      </div>
    </div>
  )
};

export default Board;
