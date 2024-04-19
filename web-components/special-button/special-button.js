class SpecialButton extends HTMLElement {
    btnText = 'Mi botón WC';
    myAttr = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.myAttr = this.getAttribute('my-attribute');
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['my-attribute'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback', name, oldValue, newValue);
        this.myAttr = newValue;
        this.render();
    }

    render() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = '';
        shadowRoot.appendChild(this.htmlToElement().content);
    }

    htmlToElement() {
        const btnAttribute = this.myAttr ? `my-attribute="${this.myAttr}"` : '';
        const html = `
                <style>
                button {
                    font-size: 1.6rem;
                    padding: 1rem 2rem 1rem 2rem;
                    border: none;
                    background-color: var(--primary-color);
                    color: var(--neutral-color);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    flex-flow: row nowrap;
                }

                button:before {
                    content: "";
                    display: block;
                    opacity: 0;
                    width: 0;
                    height: 1px;
                    margin-right: 1rem;
                    background-color: var(--neutral-color);
                    transition: all 0.2s linear 0s;
                }

                button:after {
                    content: "";
                    display: block;
                    width: 3rem;
                    height: 1px;
                    margin-left: 1rem;
                    background-color: var(--neutral-color);
                    transition: all 0.2s linear 0s;
                }

                button:hover:after {
                    opacity: 0;
                    width: 0;
                    transition: all 0.2s linear 0s;
                }

                button:hover:before {
                    opacity: 1;
                    width: 3rem;
                    transition: all 0.2s linear 0s;
                }
            </style>
            <button ${btnAttribute}>
                <slot name="button-text">${this.btnText}</slot>
            </button>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;
        return template;
    }
}
window.customElements.define('special-button', SpecialButton);