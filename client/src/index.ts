import Phaser from 'phaser';
import MatchScene from './scenes/match';
// import { InitialScene } from './scenes/InitialScene';

const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  parent: 'canvas-parent',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);

game.scene.add(MatchScene.KEY, MatchScene);
game.scene.start(MatchScene.KEY);
