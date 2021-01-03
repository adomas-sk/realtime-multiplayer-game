import Phaser from 'phaser';
import { createWSClient } from '../../components/connection';
import Character from '../../components/character/character';
import { loadBodyAnimation, loadBodySprite } from '../../loaders/body.loader';
import { getGameTimeStamp, getInitialState } from '../../components/connection/create.connection';

class MatchScene extends Phaser.Scene {
  public static KEY = 'MATCH';

  private characters: Character[] = [];

  preload() {
    loadBodySprite(this.load);

    createWSClient();
  }

  async create() {
    loadBodyAnimation(this);

    const initialState = await getInitialState();
    initialState.characters.map((characterState) => {
      this.characters.push(new Character(this, characterState.x, characterState.y, characterState.velocity));
    });
  }

  update(_timePassed: number, fallbackDelta: number) {
    const gameTime = getGameTimeStamp();
    const delta = gameTime ? Date.now() - gameTime : fallbackDelta;

    console.log({ delta });
    if (this.characters.length) {
      this.characters.forEach((character) => character.run(delta));
    }
  }
}

export default MatchScene;
