import Phaser from 'phaser';
import type { Platform } from 'shared';

import { createWSClient, ClientEvents } from '../../components/connection';
import Character from '../../components/character';
import { BODY_SPRITE, loadBodyAnimation, loadBodySprite } from '../../loaders/body.loader';
import { loadPlatformSprite, PLATFORM_ANIMATION, PLATFORM_SPRITE } from '../../loaders/platform.loader';
import Button from '../../components/button';
import { loadPlatformAnimation } from '../../loaders/platform.loader';
import { leftKeyDown, rightKeyUp, rightKeyDown, leftKeyUp } from '../../components/input';
import { getGame } from '../../components/state';

class MatchScene extends Phaser.Scene {
  public static KEY = 'MATCH';
  private clientEvents?: ClientEvents;

  private characters: Character[] = [];
  private platforms: Platform[] = [{ id: '1', left: 0, right: 600, top: 400 - 50, bottom: 500 - 50 }];
  private joinedGame = false;

  preload() {
    loadBodySprite(this.load);
    loadPlatformSprite(this.load);

    this.clientEvents = createWSClient();
  }

  async create() {
    loadBodyAnimation(this);
    loadPlatformAnimation(this);

    if (this.clientEvents) {
      new Button(this, 50, 50, this.textures.get(BODY_SPRITE)).makeItCreateGame(this.clientEvents.createGame);
      new Button(this, 100, 50, this.textures.get(BODY_SPRITE)).makeItJoinGame(this.clientEvents.joinGame);
      this.input.keyboard.on('keydown-A', leftKeyDown(this.clientEvents));
      this.input.keyboard.on('keyup-A', leftKeyUp(this.clientEvents));
      this.input.keyboard.on('keydown-D', rightKeyDown(this.clientEvents));
      this.input.keyboard.on('keyup-D', rightKeyUp(this.clientEvents));
    }

    // this.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_MOVE, (event: Phaser.Input.Pointer) => {
    //   console.log(event.position);
    // });

    const platformA = new Phaser.GameObjects.Sprite(this, 150, 400, this.textures.get(PLATFORM_SPRITE));
    this.add.existing(platformA);
    platformA.anims.play(PLATFORM_ANIMATION);
    const platformB = new Phaser.GameObjects.Sprite(this, 450, 400, this.textures.get(PLATFORM_SPRITE));
    this.add.existing(platformB);
    platformB.anims.play(PLATFORM_ANIMATION);
  }

  update(_timePassed: number, fallbackDelta: number) {
    this.joinGameCheck();

    this.addPlayers();

    this.mainLoop(fallbackDelta);
  }

  private mainLoop = (fallbackDelta: number) => {
    if (getGame().gameStarted) {
      getGame().progressGame(fallbackDelta);

      this.characters.forEach((char) => char.update());
    }
  };

  private joinGameCheck = () => {
    const gameKey = getGame().gameKey;
    if (!this.joinedGame && gameKey && this.clientEvents) {
      new Button(this, 150, 50, this.textures.get(BODY_SPRITE)).makeItReady(this.clientEvents.ready);
      this.platforms.forEach((platform) => getGame().addPlatform(platform));
      this.joinedGame = true;
    }
  };

  private addPlayers = () => {
    const playerIds = getGame().getNonRenderedPlayers();
    if (playerIds.length) {
      playerIds.forEach((playerId) => {
        const character = new Character(this, playerId);
        this.characters.push(character);
      });
    }
  };
}

export default MatchScene;
