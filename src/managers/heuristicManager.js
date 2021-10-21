const HeuristicManager = {
  simple: function (playerMoves) {
    return playerMoves;
  },

  defensive: function (playerMoves, opponentMoves) {
    return (playerMoves * 2) - opponentMoves;
  },

  offensive: function (playerMoves, opponentMoves) {
    return playerMoves - (opponentMoves * 2);
  },

  aggressive: function (playerMoves, opponentMoves) {
    return 10 - opponentMoves;
  },

  defensiveToOffensive: function (playerMoves, opponentMoves, width, height, round) {
    const ratio = round / (width * height);
    return ratio <= 0.5 ? HeuristicManager.defensive(playerMoves, opponentMoves) : HeuristicManager.offensive(playerMoves, opponentMoves);
  },

  offensiveToDefensive: function (playerMoves, opponentMoves, width, height, round) {
    const ratio = round / (width * height);
    return ratio <= 0.5 ? HeuristicManager.offensive(playerMoves, opponentMoves) : HeuristicManager.defensive(playerMoves, opponentMoves);
  },
  
  movesToBoard: function (playerMoves, opponentMoves, currentMove, width, height, round) {
    const weight = playerMoves * 2;
    const mov = currentMove / (width * height);
    return (weight * mov) - opponentMoves;
  }
};

export default HeuristicManager;