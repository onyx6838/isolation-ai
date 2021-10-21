const StrategyManager = {
  none: function () {
    return null;
  },
  minimax: function (tree, playerIndex, players, values, width, height) {
    let bestState = null;
    let bestVal = -9999;
    let beta = 9999;

    const getSuccessors = node => {
      return node ? node.children : [];
    };

    const isTerminal = node => {
      return node ? node.children.length === 0 : true;
    };

    const getUtility = node => {
      return node ? node.score : -9999;
    };

    const minValue = (node, alpha, beta) => {

      if (isTerminal(node)) {
        return getUtility(node);
      } else {
        let value = 9999;

        const successors = getSuccessors(node);
        successors.forEach(state => {
          value = Math.min(value, maxValue(state, alpha, beta));
          if (value <= alpha) {
            return value;
          } else {
            beta = Math.min(beta, value);
          }
        });

        return value;
      }
    };

    const maxValue = (node, alpha, beta) => {

      if (isTerminal(node)) {
        return getUtility(node);
      } else {
        let value = -9999;

        const successors = getSuccessors(node);
        successors.forEach(state => {
          value = Math.max(value, minValue(state, alpha, beta));
          if (value >= beta) {
            return value;
          } else {
            alpha = Math.max(alpha, value);
          }
        });

        return value;
      }
    };

    // implementation
    const successors = getSuccessors(tree);
    successors.forEach(state => {
      const value = minValue(state, bestVal, beta);
      if (value > bestVal) {
        bestVal = value;
        bestState = state;
      }
    });

    return bestState ? {
      x: bestState.players[bestState.activePlayer].x,
      y: bestState.players[bestState.activePlayer].y
    } : {
      x: 1,
      y: 1
    };
  }
};

export default StrategyManager;