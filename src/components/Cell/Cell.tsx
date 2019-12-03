import React, { FC, useMemo } from "react";

type Props = {
  value?: any;
  onClick?: any;
  cMenu?: any;
}

const Cell: FC<Props> = ({value, onClick, cMenu}) => {
  const getValue = () => {
    if (!value.isRevealed) {
      return value.isFlagged ? "🚩" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  };


  return useMemo(() => {
    const className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");

    return (
      <div onClick={onClick} className={className} onContextMenu={cMenu}>
        {getValue()}
      </div>)
  }, [value, onClick, cMenu]);

};

export default Cell;
