import {LitElement, html, PropertyValues} from 'lit'
import {customElement, property, queryAssignedElements} from 'lit/decorators.js'
import styles from '../../../styles/components/basic/input.styles.scss'
import {ColorEnum, SizeEnum} from "../../base"

export enum InputType { DEFAULT="default", UPLOAD="upload", TEXTAREA="textarea", NUMBER="number" }

@customElement('cc-input')
export class InputComponent extends LitElement {
    @property({type: ColorEnum, reflect: true})
    color?: ColorEnum = ColorEnum.ACCENT

    @property({type: SizeEnum})
    size?: SizeEnum = SizeEnum.MEDIUM

    @property({type: String})
    text?: String = this.innerText;

    @property({type: String})
    image?: String

    @property()
    placeholder?: String = ""

    @property()
    type: InputType = InputType.DEFAULT

    @property({reflect: true})
    private isExpanded: boolean = false

    @property()
    tooltip: string = ""

    @property()
    label: string = ""

    @property()
    maxLength: number = 255

    @property()
    onInput: (text: String) => void = () => {}

    @queryAssignedElements()
    private detailElement!: Array<HTMLElement>;

    constructor() {
        super()
        if(this.type == InputType.NUMBER){
            this.text = "0"
        }
    }

    render() {
        return html`
            <style>${styles}</style>
            <label for="inputField">${this.label}</label>
            
            ${this.type == InputType.TEXTAREA ? 
                    html`
                        <textarea id="inputField" rows="2" placeholder="${this.placeholder}" minlength="2" maxlength="${this.maxLength}" @input="${(e) => {this.onInput(e.target.value)}}" required>${this.text}</textarea>` :
                this.type == InputType.UPLOAD ?
                        html`
                            <input type="file" accept="image/png, image/jpeg, image/webp" @input="${(e) => this.handleFileInput(e)}">
                        `                        
                        :
                    html`
                        <input id="inputField" type="text" placeholder="${this.placeholder}" value="${this.text}"
                               @input="${(e) => {this.onInput(e.target.value)}}" minlength="2" maxlength="${this.maxLength}" required>
                    `
            }

            ${
                this.maxLength * 0.9 < this.text?.length || 0 ? html`
                    <p class="warning">
                        ${this.text?.length || 0}/${this.maxLength}
                    </p>
                ` : ''
            }
        `
    }

   /* handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                this.onInput(base64String);
            };
            reader.readAsDataURL(file);
        }
    }*/

    //practically fully GPT generated
    handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;

                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Target height and dynamic width calculation
                    const targetHeight = 300; // Fixed height
                    const targetWidth = (img.width / img.height) * targetHeight;

                    // Set the canvas dimensions
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Draw the downscaled image onto the canvas
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Ensure canvas is clear
                        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    }

                    let quality;
                    if (file.type === 'image/jpeg') {
                        quality = 0.5; // You can adjust this as needed
                    }
                    const downscaledBase64 = canvas.toDataURL(file.type, quality);
                    this.onInput(downscaledBase64);
                };

                img.src = base64String;
            };

            reader.readAsDataURL(file);
        }
    }


}

declare global {
    interface HTMLElementTagNameMap {
        "cc-input": InputComponent
    }
}
