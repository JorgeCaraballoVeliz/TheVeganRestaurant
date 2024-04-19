import { LitElement, html, css } from 'lit';
import { TimerPartComponent } from './TimerPartComponent.js';

export class TimerComponent extends LitElement {
    static properties = {
        _seconds: { type: Number, state: true },
        _minutes: { type: Number, state: true },
        _hours: { type: Number, state: true },
        _days: { type: Number, state: true },
        format: { type: String, attribute: true },
        start: { type: Number },
        reverse: { type: Boolean, attribute: true },
        limit: { type: Number, attribute: true },
        join: { type: String, attribute: true },
        autostart: { type: Boolean, attribute: true },
        autoreset: { type: Boolean, attribute: true },
    }

    static styles = css`
        :host {
            display: flex;
            justify-content: var(--timer-component-justify-content, center);
        }

        .timer-component_join {
            padding: var(--timer-component-join-padding);
        }
    `;

    constructor() {
        super();
        this.start = 0;
        this.reverse = false;
        this.format = 'HH:MM:SS';
        this.join = ':';
        this.finishEvent = new CustomEvent('finishTimer', { bubbles: true, composed: true });
        this.playEvent = new CustomEvent('playTimer', { bubbles: true, composed: true });
        this.pauseEvent = new CustomEvent('pauseTimer', { bubbles: true, composed: true });
        this.resetEvent = new CustomEvent('resetTimer', { bubbles: true, composed: true });
    }

    connectedCallback() {
        super.connectedCallback();
        this._resetValues();
        if (this.autostart) this.startTimer();
    }

    disconnectedCallback() {
        this._finish();
        super.disconnectedCallback();
    }

    render() {
        return html`
            ${this._timerTemplate()}
        `;
    }

    get isFinished() {
        if (this.reverse && this._secondsCount === 0) {
            return true;
        } else if (!this.reverse && this.limit && this._secondsCount === this.limit) {
            return true;
        }
    }

    startTimer() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                if (this.isFinished) {
                    this._finish();
                } else {
                    this.reverse ? this._secondsCount-- : this._secondsCount++;
                    this._setTime();
                    if (this.isFinished) this._finish();
                }
    
                //console.log(this._secondsCount);
            }, 1000);
            this.dispatchEvent(this.playEvent);
        }
    }

    resetTimer() {
        this._clearInterval();
        this._resetValues();
        this.dispatchEvent(this.resetEvent);
        if (this.autostart) this.startTimer();
    }

    pauseTimer() {
        this._clearInterval();
        this.dispatchEvent(this.pauseEvent);
    }

    _joinTemplate() {
        return html`
            <span class="timer-component_join">${this.join}</span>
        `;
    }

    _timerTemplate() {
        const formatArr = this.format.split(':');
        const time = formatArr.map((part) => {
            if (part.includes('D')) return this._days;
            if (part.includes('H')) return this._hours;
            if (part.includes('M')) return this._minutes;
            if (part.includes('S')) return this._seconds;
        });

        const template = html`${time.map((value, index) => html`
            <time-part-component value="${value}" format="${formatArr[index]}"></time-part-component>
            ${index < time.length - 1 ? this._joinTemplate() : ''}
        `)}`;

        return template;
    }

    _setTime() {
        const seconds = this._secondsCount % 60;
        const minutes = Math.floor(this._secondsCount / 60) % 60;
        const hours = Math.floor(this._secondsCount / 3600);
        const days = Math.floor(this._secondsCount / 86400);
        if (seconds !== this._seconds) this._seconds = seconds;
        if (minutes !== this._minutes) this._minutes = minutes;
        if (hours !== this._hours) this._hours = hours;
        if (days !== this._days) this._days = days;
    }

    _resetValues() {
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
        this._days = 0;
        this._secondsCount = this.start;
        this._setTime();
    }

    _clearInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }

    _finish() {
        this._clearInterval();
        this.dispatchEvent(this.finishEvent);
        if (this.autoreset) this.resetTimer();
    }
}
customElements.define('timer-component', TimerComponent);