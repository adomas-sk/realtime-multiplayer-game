import { USER_INPUT } from '../../connection';
import { characterNext } from '../character';
import { ObjectOf, Player, Platform, EventState, PlayerEvent } from '../interfaces';

export class Game {
  public gameKey = '';
  public gameStarted = false;
  public gameStartedAt?: number;
  public lastTick?: number;
  public serverClockId?: number;

  private players: ObjectOf<Player> = {};
  private platforms: ObjectOf<Platform> = {};
  private events: ObjectOf<EventState> = {};
  private playerEvents: PlayerEvent[] = [];

  constructor(gameKey?: string) {
    if (gameKey) {
      this.gameKey = gameKey;
    }
  }

  public progressGameDeltaOverride = (deltaOverride: number) => {
    Object.values(this.players).forEach((player) =>
      characterNext({
        player,
        eventState: this.events[player.playerId],
        playerEvents: this.playerEvents.map((pe) => ({
          ...pe,
          timeSinceLastTick: deltaOverride - pe.timeSinceLastTick,
        })),
        platforms: Object.values(this.platforms),
        delta: deltaOverride,
      })
    );
  };

  public progressGame = (fallbackDelta: number) => {
    if (!this.lastTick) {
      this.lastTick = this.gameStartedAt;
    }

    const currentTick = Date.now();
    const delta = this.lastTick ? currentTick - this.lastTick : fallbackDelta;

    Object.values(this.players).forEach((player) =>
      characterNext({
        player,
        eventState: this.events[player.playerId],
        playerEvents: this.playerEvents.map((pe) => ({
          ...pe,
          timeSinceLastTick: this.lastTick
            ? delta - (this.lastTick - pe.timeSinceLastTick)
            : fallbackDelta - pe.timeSinceLastTick,
        })),
        platforms: Object.values(this.platforms),
        delta,
      })
    );

    this.lastTick = currentTick;
  };

  public addGameKey = (gameKey: string) => {
    if (this.gameKey) {
      throw new Error(`Game with key <${this.gameKey}> already has key.`);
    }
    this.gameKey = gameKey;
  };

  public addPlayer = (player: Player) => {
    if (this.players[player.playerId]) {
      throw new Error(`Player with id <${player.playerId}> already exists in this game`);
    }
    const newPlayer: Player = { ...player };
    this.players[player.playerId] = newPlayer;
    this.events[player.playerId] = { right: false, left: false };
  };

  public processPlayerEvent = (playerId: string, event: USER_INPUT, timestamp?: number) => {
    if (!this.players[playerId]) {
      throw new Error(`Invalid playerId given to event processor`);
    }
    this.playerEvents.push({ playerId, event, timeSinceLastTick: timestamp || 0 });
    switch (event) {
      case USER_INPUT.LEFT_DOWN:
        this.events[playerId].left = true;
        break;
      case USER_INPUT.LEFT_UP:
        this.events[playerId].left = false;
        break;
      case USER_INPUT.RIGHT_DOWN:
        this.events[playerId].right = true;
        break;
      case USER_INPUT.RIGHT_UP:
        this.events[playerId].right = false;
        break;
      default:
        throw new Error(`Unknown event encountered ${event}`);
    }
  };

  public getPlayer = (playerId: string, throwError = true) => {
    if (!this.players[playerId] && throwError) {
      throw new Error(`Player with id <${playerId}> does not exist in this game`);
    }
    return this.players[playerId];
  };

  public getPlayersExcept = (exceptPlayerId: string) => {
    return Object.values(this.players).filter((i) => i.playerId !== exceptPlayerId);
  };

  public getNonRenderedPlayers = () => {
    const playersToRender = Object.values(this.players).filter((player) => !player.rendered);
    return playersToRender.map((i) => i.playerId);
  };

  public setPlayerAsRendered = (playerId: string) => {
    this.players[playerId].rendered = true;
  };

  public startGame = (startTime: number) => {
    this.gameStarted = true;
    this.gameStartedAt = startTime;
  };

  public addPlatform = (platform: Platform) => {
    this.platforms[platform.id] = platform;
  };

  public setPlayerReady = (playerId: string) => {
    this.players[playerId].ready = true;
  };

  public getStartTimeIfAllPlayersReady = (): number | null => {
    const allReady = Object.values(this.players).every((i) => i.ready);
    return allReady ? Date.now() : null;
  };

  public setPlayerDisconnected = (playerId: string) => {
    this.players[playerId].disconnected = true;
  };

  public areAllPlayersDisconnected = () => {
    return Object.values(this.players).every((i) => i.disconnected);
  };

  public updatePlayers = (players: ObjectOf<Player>) => {
    this.players = players;
  };

  public getGameState = () => {
    return {
      players: this.players,
    };
  };
}
