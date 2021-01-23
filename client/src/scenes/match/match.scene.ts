import Phaser from 'phaser';
import { CharacterState, runGame, Platform } from 'shared';

import {
  createWSClient,
  ClientEvents,
  getGameJoined,
  getGameStarted,
  getGameStartedAt,
  getPlayers,
} from '../../components/connection';
import Character from '../../components/character';
import { BODY_SPRITE, loadBodyAnimation, loadBodySprite } from '../../loaders/body.loader';
import { loadPlatformSprite, PLATFORM_ANIMATION, PLATFORM_SPRITE } from '../../loaders/platform.loader';
import Button from '../../components/button';
import { loadPlatformAnimation } from '../../loaders/platform.loader';

class MatchScene extends Phaser.Scene {
  public static KEY = 'MATCH';
  private clientEvents?: ClientEvents;

  private players: Character[] = [];
  private player?: Character;
  private platforms: Platform[] = [{ left: 100, right: 700, top: 400, bottom: 500 }];
  private lastTick?: number;

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
    }

    const platformA = new Phaser.GameObjects.Sprite(this, 100, 400, this.textures.get(PLATFORM_SPRITE));
    this.add.existing(platformA);
    platformA.anims.play(PLATFORM_ANIMATION);
    const platformB = new Phaser.GameObjects.Sprite(this, 400, 400, this.textures.get(PLATFORM_SPRITE));
    this.add.existing(platformB);
    platformB.anims.play(PLATFORM_ANIMATION);
  }

  update(_timePassed: number, fallbackDelta: number) {
    const gameKey = getGameJoined();
    if (!this.player && gameKey && this.clientEvents) {
      new Button(this, 150, 50, this.textures.get(BODY_SPRITE)).makeItReady(this.clientEvents.ready);
      this.player = new Character(this, 200, 200, [0, 0]);
    }

    const players = getPlayers();
    if (Object.keys(players).length !== this.players.length) {
      const playersToAdd = Object.keys(players).filter(
        (playerId) => !this.players.find((character) => character.playerId === playerId)
      );
      playersToAdd.forEach((playerId) => {
        this.players.push(new Character(this, 200 + (this.players.length + 1) * 50, 200, [0, 0], playerId));
      });
    }

    if (this.player) {
      const gameStarted = getGameStarted();
      if (gameStarted) {
        if (!this.lastTick) {
          this.lastTick = getGameStartedAt();
        }
        const currentTick = Date.now();
        const delta = this.lastTick ? currentTick - this.lastTick : fallbackDelta;

        const characters = ([this.player, ...this.players]
          .filter((player) => player.characterState)
          .map((player) => player.characterState) as any) as CharacterState[];
        const nextGameState = runGame({ characters, platforms: this.platforms }, delta);

        const nextSelf = nextGameState.characters.find((char) => char.playerId === 'player');
        // console.log(nextSelf);
        this.player.update(nextSelf);

        this.players.forEach((player) =>
          player.update(nextGameState.characters.find((char) => char.playerId === player.playerId))
        );

        this.lastTick = currentTick;
      }
    }
  }
}

export default MatchScene;
