import Phaser from 'phaser';
import { Player, runGame, Platform } from 'shared';

import {
  createWSClient,
  ClientEvents,
  getGameJoined,
  getGameStarted,
  getGameStartedAt,
  getPlayers,
  getSelf,
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
  private platforms: Platform[] = [{ left: 0, right: 600, top: 400 - 50, bottom: 500 - 50 }];
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
    const self = getSelf();
    if (this.player && self) {
      const gameStarted = getGameStarted();
      if (gameStarted) {
        if (!this.lastTick) {
          this.lastTick = getGameStartedAt();
        }
        const currentTick = Date.now();
        const delta = this.lastTick ? currentTick - this.lastTick : fallbackDelta;

        const players = getPlayers();
        const playersInGame = [self, ...Object.values(players)];
        const nextGameState = runGame({ players: playersInGame, platforms: this.platforms }, delta);

        const nextSelf = nextGameState.players.find((char) => char.playerId === self?.playerId);

        this.player.update(nextSelf);
        this.players.forEach((player) => {
          const nextPlayer = nextGameState.players.find((char) => char.playerId === player.playerId);
          player.update(nextPlayer);
        });

        this.lastTick = currentTick;
      }
    }
  };

  private joinGameCheck = () => {
    const gameKey = getGameJoined();
    if (!this.player && gameKey && this.clientEvents) {
      new Button(this, 150, 50, this.textures.get(BODY_SPRITE)).makeItReady(this.clientEvents.ready);
      const self = getSelf();
      if (self) {
        this.player = new Character(this, self);
      }
    }
  };

  private addPlayers = () => {
    const players = getPlayers();
    if (Object.keys(players).length !== this.players.length) {
      const playersToAdd = Object.keys(players).filter(
        (playerId) => !this.players.find((character) => character.playerId === playerId)
      );
      playersToAdd.forEach((playerId) => {
        this.players.push(new Character(this, players[playerId] as Player));
      });
    }
  };
}

export default MatchScene;
