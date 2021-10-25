const HeuristicManager = {
  simple: function (playerMoves) {
    // Favor maximizing the number of available moves for the player.
    return playerMoves;
  },

  defensive: function (playerMoves, opponentMoves) {
    // Favor maximizing the number of available moves for the player weighted while minimizing the available moves for the opponent, emphasis on maximizing the player.
    return (playerMoves * 2) - opponentMoves;
  },

  offensive: function (playerMoves, opponentMoves) {
    // Favor maximizing the number of available moves for the player while minimizing the available moves for the opponent, emphasis on minimizing the opponent.
    return playerMoves - (opponentMoves * 2);
  },

  aggressive: function (playerMoves, opponentMoves) {
    // Favor minimizing the available moves for the opponent.
    return 10 - opponentMoves;
  },

  defensiveToOffensive: function (playerMoves, opponentMoves, width, height, round) {
    // Early game, play a defensive strategy. Late game, play an offensive strategy.
    const ratio = round / (width * height);
    return ratio <= 0.5 ? HeuristicManager.defensive(playerMoves, opponentMoves) : HeuristicManager.offensive(playerMoves, opponentMoves);
  },

  offensiveToDefensive: function (playerMoves, opponentMoves, width, height, round) {
    // Early game, play an offensive strategy. Late game, play a defensive strategy.
    const ratio = round / (width * height);
    return ratio <= 0.5 ? HeuristicManager.offensive(playerMoves, opponentMoves) : HeuristicManager.defensive(playerMoves, opponentMoves);
  },
  // ,movesToBoard: function (playerMoves, opponentMoves, currentMove, width, height, round) {
  //   const weight = playerMoves * 2;
  //   const mov = currentMove / (width * height);
  //   return (weight * mov) - opponentMoves;
  // }
  // walls: function (playerMoves, opponentMoves, currentMove, width, height) {
  //   const dis = this.distance(this.state);
  //   if (dis >= 2)
  //     return this.defensive(this.state);
  //   else {
  //     return playerMoves - opponentMoves;
  //   }
  // }
};

export default HeuristicManager;