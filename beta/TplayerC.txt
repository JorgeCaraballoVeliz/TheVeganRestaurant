import { LitElement, css, html } from 'lit';
import { TimerComponent } from './TimerComponent.js';

export class TimerPlayerComponent extends LitElement {
    static properties = {
        playBtn: { type: Boolean, attribute: 'play-btn' },
        pauseBtn: { type: Boolean, attribute: 'pause-btn' },
        resetBtn: { type: Boolean, attribute: 'reset-btn' },
        endMsg: { type: String, attribute: 'end-msg' },
        enableEvents: { type: Boolean, attribute: 'enable-events' },
        _status: { type: String, state: true },
    }

    constructor() {
        super();
        this.playBtn = false;
        this.pauseBtn = false;
        this.resetBtn = false;
        this.endMsg = '¡Ready!';
        this._status = '';
        this.enableEvents = false;
        this.addEventListener('finishTimer', this._handleFinishTimer);
        //this.addEventListener('resetTimer', this._handleResetTimer);
    }

    static styles = css`
        :host {
            display: flex;
            justify-content: var(--timer-player-component-justify-content, center);
            flex-direction: var(--timer-player-component-flex-direction, column);
        }

        .timer-player-component__status {
            color: var(--timer-player-component-status-color);
            font-size: var(--timer-player-component-status-font-size);
            text-align: var(--timer-player-component-status-text-align, center);
            margin: var(--timer-player-component-status-margin);
            padding: var(--timer-player-component-status-padding);
        }

        .timer-player-component__actions {
            display: flex;
            flex-wrap: var(--timer-player-component-actions-flex-wrap, wrap);
            justify-content: var(--timer-player-component-actions-justify-content, center);
            flex-direction: var(--timer-player-component-actions-flex-direction, row);
            margin: var(--timer-player-component-actions-margin);
        }

        button {
            cursor: pointer;
            padding: var(--timer-player-component-button-padding);
            margin: var(--timer-player-component-button-margin);
            border-radius: var(--timer-player-component-button-border-radius);
        }

        button.timer-player-component__actions--play {
            background-color: var(--timer-player-component-play-background-color);
            color: var(--timer-player-component-play-color);
            border: var(--timer-player-component-play-border);
        }

        button.timer-player-component__actions--pause {
            background-color: var(--timer-player-component-pause-background-color);
            color: var(--timer-player-component-pause-color);
            border: var(--timer-player-component-pause-border);
        }

        button.timer-player-component__actions--reset {
            background-color: var(--timer-player-component-reset-background-color);
            color: var(--timer-player-component-reset-color);
            border: var(--timer-player-component-reset-border);
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.timer = this.querySelector('timer-component');
        this.sound = this.querySelector('sound-component');
    }

    _handleFinishTimer(e) {
        if (!this.enableEvents) e.stopPropagation();
        this._status = this.endMsg;
        if (this.sound) this.sound.play();
    }

    _handleResetTimer(e) {
        if (!this.enableEvents) e.stopPropagation();
        this._status = '';
    }

    render() {
        return html`
            <div class="timer-player-component__status">${this._status}</div>
            <slot></slot>
            <div class="timer-player-component__actions">
                ${this.pauseBtn ? html`<button class="timer-player-component__actions--pause" @click="${this.pause}">Pause</button>` : ''}
                ${this.playBtn ? html`<button class="timer-player-component__actions--play" @click="${this.play}">Play</button>` : ''}
                ${this.resetBtn ? html`<button class="timer-player-component__actions--reset" @click="${this.reset}">Reset</button>` : ''}
            </div>
        `;
    }

    play() {
        this.timer.startTimer();
        this._status = '';
    }

    pause() {
        this.timer.pauseTimer();
    }

    reset() {
        this.timer.resetTimer();
        this._status = '';
    }
}
customElements.define('timer-player-component', TimerPlayerComponent);