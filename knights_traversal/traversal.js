const knightsMoves = function (start, finish) {
  const visitedSquares = Array(8)
    .fill()
    .map((_) =>
      Array(8)
        .fill()
        .map((_) => [])
    );
  const possibleMoves = [
    [-1, 2],
    [-1, -2],
    [1, 2],
    [1, -2],
    [2, -1],
    [2, 1],
    [-2, -1],
    [-2, 1],
  ];

  const queue = [{ square: start, previousSquareMoves: [] }];

  while (queue.length > 0) {
    const { square: current, previousSquareMoves } = queue.shift();
    const movesToCurrent = [...previousSquareMoves, current];
    if (current[0] === finish[0] && current[1] === finish[1]) {
      return movesToCurrent;
    }

    visitedSquares[current[0]][current[1]] = movesToCurrent;

    possibleMoves.forEach((move) => {
      const currMove = [current[0] + move[0], current[1] + move[1]];
      if (currMove[0] < 0 || currMove[0] > 7) return;
      if (currMove[1] < 0 || currMove[1] > 7) return;
      if (visitedSquares[currMove[0]][currMove[1]].length > 0) return;

      queue.push({ square: currMove, previousSquareMoves: movesToCurrent });
    });
  }
  return [];
};

const knightsMovesPrint = function (start, finish) {
  const moves = knightsMoves(start, finish);
  console.log(
    `You made it in ${moves.length} move${
      moves.length > 1 ? "s" : ""
    }! Here is your path:`
  );
  let output = "";
  moves.forEach((move, i) => {
    output += `[${move[0]}, ${move[1]}]` + (i < moves.length - 1 ? " -> " : "");
  });
  console.log(output);
};

knightsMovesPrint([0, 0], [7, 7]);
