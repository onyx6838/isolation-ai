// import ReactDOM from "react-dom";
// import Isolation from "../components/Isolation";

// import $ from 'jquery'
// import React from 'react';

import IsolationManager from './isolationManager'

const StrategyManager = {
  none: function () {
    return null;
  },

  random: (playerIndex, players, values, width, height) => {
    let isValid = false;
    let count = 0;
    let x, y;

    console.log('Using AI strategy random.');

    while (!isValid && count++ < 1000) {
      x = Math.floor(Math.random() * width);
      y = Math.floor(Math.random() * height);
      isValid = IsolationManager.isValidMove(x, y, playerIndex, players, values, width, height);
    }

    if (count >= 1000) {
      console.log('Random strategy failed to find a move.');
    }

    return {
      x,
      y
    };
  },

  minimax: (tree, playerIndex, players, values, width, height) => {
    if (tree === 1) {
      return StrategyManager.random(playerIndex, players, values, width, height);
    } else {


      let bestState = null;
      let bestVal = -9999;
      let beta = 9999;

      console.log('Using AI strategy minimax.');


      // trả về các node con hiện tại
      const getSuccessors = node => {
        return node ? node.children : [];
      };
      // xác định nút có phải là nút lá hay không
      const isTerminal = node => {
        return node ? node.children.length === 0 : true;
      };
      // trả về điểm cho nút hiện tại
      const getUtility = node => {
        return node ? node.score : -9999;
      };

      const maxValue = (node, alpha, beta) => {
        //console.log(`AlphaBeta-->MAX: Visited Node: ${toString(node)}`);

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

      const minValue = (node, alpha, beta) => {
        //console.log(`AlphaBeta-->MIN: Visited Node: ${toString(node)}`);

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

      const toString = state => {
        return `Depth ${state.depth}, Score ${state.score}, activePlayer ${state.activePlayer}, players: (${state.players[0].x}, ${state.players[0].y}), (${state.players[1].x}, ${state.players[1].y})`;
      };

      const successors = getSuccessors(tree);
      successors.forEach(state => {
        const value = minValue(state, bestVal, beta);
        if (value > bestVal) {
          bestVal = value;
          bestState = state;
        }
      });

      console.log(`MiniMax: Utility value of best node is ${bestVal}.`);
      console.log(`MiniMax: Best state is: ${toString(bestState)}`)

      return bestState ? {
        x: bestState.players[bestState.activePlayer].x,
        y: bestState.players[bestState.activePlayer].y
      } : {
        x: 1,
        y: 1
      };
    }
  },

  tree: function (playerIndex, players, values, width, height, round, heuristic, maxDepth) {
    const referencePlayerIndex = !playerIndex ? 1 : 0; // Point-of-view for the player that the tree is calculated for. The root node will be from the opposing player.
    console.log(round);

    let root = {
      depth: 0,
      player: playerIndex,
      activePlayer: playerIndex,
      baseScore: players[referencePlayerIndex].moves.length,
      score: heuristic(players[referencePlayerIndex].moves.length, players[!referencePlayerIndex ? 1 : 0].moves.length, width, height, round),
      moves: players[referencePlayerIndex].moves,
      players,
      values,
      children: [],
      width,
      height
    };
    let fringe = [root];
    let node = fringe.shift();

    while (node) {
      if (node.depth <= maxDepth && node.moves.length) {
        const newPlayerIndex = node.depth % 2 === 0 ? referencePlayerIndex : playerIndex; //0 : 1;

        // Evaluate all possible moves from the current state.
        // eslint-disable-next-line no-loop-func
        node.moves.forEach(move => {
          // Make a copy of the players.
          let newPlayers = JSON.parse(JSON.stringify(node.players));

          // Move the player to a new position.
          newPlayers[newPlayerIndex].x = move.x;
          newPlayers[newPlayerIndex].y = move.y;

          // Set the new position as used.
          let newValues = JSON.parse(JSON.stringify(node.values));
          newValues[newPlayers[newPlayerIndex].y][newPlayers[newPlayerIndex].x] = !newPlayerIndex ? 'lightpink' : 'lightblue';

          // Get available moves at new position in relation to the reference player.
          const movesReferencePlayer = IsolationManager.availableMoves(referencePlayerIndex, newPlayers, newValues, width, height);
          // Get available moves with new game board for next player.
          const moves = IsolationManager.availableMoves(!newPlayerIndex ? 1 : 0, newPlayers, newValues, width, height);

          // Add the new node to our tree.
          const child = {
            depth: node.depth + 1,
            player: playerIndex,
            activePlayer: newPlayerIndex,
            baseScore: movesReferencePlayer.length,
            score: heuristic(movesReferencePlayer.length, moves.length, width, height, round),
            moves,
            players: newPlayers,
            values: newValues,
            children: []
          };
          node.children.push(child);
          fringe.push(child);
        });
      }

      // Process next node.
      node = fringe.shift();
    }

    return root;
  }


};

export default StrategyManager;