class CardComponent extends HTMLElement {
    baseText = 'Componente vacío';
    myAttr = '';
    fontAt = '';
    padAt = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.myAttr = this.getAttribute('my-attribute');
        this.fontAt = this.getAttribute('font-attribute');
        this.padAt = this.getAttribute('pad-attribute');
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['my-attribute', 'font-attribute', 'pad-attribute'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback', name, oldValue, newValue);
        if (name == 'my-attribute') {
            this.myAttr = newValue;
        }
        if (name == 'font-attribute') {
            this.fontAt = newValue;
        }
        if (name == 'pad-attribute') {
            this.padAt = newValue;
        }
        
        this.render();
    }

    render() {
        const { shadowRoot } = this;
        shadowRoot.innerHTML = '';
        shadowRoot.appendChild(this.htmlToElement().content);
    }

    htmlToElement() {
        const divAttribute = this.myAttr ? `my-attribute="${this.myAttr}"` : '';
        const bgAtt = this.myAttr ? `var(${this.myAttr})` : 'var(--secondary-color)';
        const fntAtt = this.fontAt ? `var(${this.fontAt})` : 'var(--primary-lightest-color)';
        const padAttribute = this.padAt ? `0` : '';
        const sizeAttribute = this.padAt ? `19rem` : '27rem';

        const html = `
                <style>
                    div {
                        padding: 1${padAttribute}rem 2rem 1rem 1rem;
                        border-radius: 0.5rem;
                        background-color: ${bgAtt};
                        height: ${sizeAttribute};
                    }

                    div > * {
                        color: ${fntAtt};
                    }


                </style>
            <div ${divAttribute}>
                <slot name="inner-text">${this.baseText}</slot>
            </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;
        return template;
    }
}
window.customElements.define('card-component', CardComponent);