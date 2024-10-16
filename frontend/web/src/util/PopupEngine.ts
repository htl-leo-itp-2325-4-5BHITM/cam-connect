interface ModalSettings {
	heading?: string
	text?: string
	buttons?: ModalButton[]
	inputs?: ModalInput[]
}

interface ModalButton {
	text?: string,
	action?: (data?: ModalCallbackData) => void
	closePopup?: boolean
	role?: "confirm" | "cancel"
}

interface ModalInput {
	type?: string
	placeholder?: string
	label?: string
}

interface NotificationSettings {
	heading?: string,
	text?: string,
	position?: string[],
	CSSClass?: string | string[],
	lifetime?: number,
}

interface Config{
	doLogs?: boolean
	preferedInlinePopupPosition?: ("bottom" | "top")
	defaultInlinePopupDelay?: number
	textColor?: string
	backgroundColor?: string
	elemBackground?: string
	notificationOffset?: {top: string, bottom: string, left: string, right: string}
	notificationOffsetPhone?: {top: string, bottom: string}
	defaultNotificationLifetime?: number
	defaultNotificationPosition?: string[]
	phoneBreakpoint?: number
	onModalOpen?: () => void
	onModalClose?: (data: ModalCallbackData) => void

}

interface ModalCallbackData{
	inputValues?: (string | number)[]
	text?: string,
	heading?: string,
	buttons?: ModalButton[],
	inputs?: ModalInput[],
	buttonIndex?: number,
}

export default class PopupEngine{
	static modal = document.createElement("div")
	static modalContent = document.createElement("div")

	static inline = document.createElement("div")
	static inlinePopupDelay //timeout object not time value
		
	static initialized = false
	static config: Config = {
		doLogs: true,
		preferedInlinePopupPosition: "top",
		defaultInlinePopupDelay: 0,

		textColor: "white",
		backgroundColor: "hsl(0,0%,15%)",
		elemBackground: "hsl(0,0%,25%)",

		notificationOffset: {top: "1vw", bottom: "1vw", left: "1vw", right: "1vw"},
		notificationOffsetPhone: {top: "1vh", bottom: "1vh"},
		defaultNotificationLifetime: 5000,
		defaultNotificationPosition: ["top", "right"],

		phoneBreakpoint: 600,

		onModalOpen: () => {},
		onModalClose: (data: ModalCallbackData) => {}
	}

	static endModal
	static observer

	/**
	 * creates the needed html and configures the engine
	 * @param {JSON} config {object} of config options like doLogs, defaultPopupDelay. Check README for details.
	 */
	static init(config?: Config){
		if(this.initialized == true){
			if(this.config.doLogs)
			console.log("PopupEngine is already initialized, will ignore this call.")
			return
		}

		//configure the engine
		if(config){
			if(config.doLogs){
				if(typeof config.doLogs == "boolean")
					this.config.doLogs = config.doLogs
				else
					console.error('invalid value for coinfig doLogs: "' + config.preferedInlinePopupPosition + '" must be a boolean. Will default to true.');
			}

			if(config.defaultInlinePopupDelay){
				if(typeof config.defaultInlinePopupDelay === "number" && config.defaultInlinePopupDelay >= 0)
					this.config.defaultInlinePopupDelay = config.defaultInlinePopupDelay
				else
					console.error('invalid default delay: "' + config.defaultInlinePopupDelay + '" must be a number >= 0. Will default to 0');
			}

			if(config.preferedInlinePopupPosition){
				if(["top","bottom"].includes(config.preferedInlinePopupPosition))
					this.config.preferedInlinePopupPosition = config.preferedInlinePopupPosition
				else
					console.error('invalid prefered position: "' + config.preferedInlinePopupPosition + '" either "top" or "bottom". Will default to "top".');
			}

			if(config.textColor){
				this.config.textColor = config.textColor
			}
			if(config.backgroundColor){
				this.config.backgroundColor = config.backgroundColor
			}
			if(config.elemBackground){
				this.config.elemBackground = config.elemBackground
			}

			if(config.notificationOffset){
				this.config.notificationOffset = config.notificationOffset
			}
			if(config.notificationOffsetPhone){
				this.config.notificationOffsetPhone = config.notificationOffsetPhone
			}
			if(config.defaultNotificationLifetime){
				if(typeof config.defaultNotificationLifetime === "number")
					this.config.defaultNotificationLifetime = config.defaultNotificationLifetime
				else
					console.error('invalid default notification lifetime value: "' + config.defaultNotificationLifetime + '" must be a number, will default to "5000".');
			}
			if(config.defaultNotificationPosition){
				this.config.defaultNotificationPosition = config.defaultNotificationPosition
			}

			if(config.phoneBreakpoint){
				if(typeof config.phoneBreakpoint === "number")
					this.config.phoneBreakpoint = config.phoneBreakpoint
				else
					console.error('invalid phone breakpoint value: "' + config.phoneBreakpoint + '" must be a number, will default to "600".');
			}

			if(config.onModalOpen){
				this.config.onModalOpen = config.onModalOpen
			}

			if(config.onModalClose){
				this.config.onModalClose = config.onModalClose
			}
		}

		//create needed html
		this.modal.classList.add("popupEngineModalContainer")
		this.modal.style.display = "none"
		this.modalContent.classList.add("popupEngineModalContent")
		this.modal.appendChild(this.modalContent)

		this.inline.classList.add("popupEngineInlineContainer")
		this.inline.style.scale = "0"

		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			this.#addDOMElems()
		} 
		else {
			window.addEventListener('load', ()=>{
				this.#addDOMElems()
			});
		}
	}

	static #addDOMElems(){
		document.body.appendChild(document.createComment('Code generated by popupEngine'))
		document.body.appendChild(this.modal)
		document.body.appendChild(this.inline)

		let counter = 0
		let yOptions = ["top", "bottom"]
		let xOptions = ["left", "center", "right"]
		yOptions.forEach(yAxis => {
			xOptions.forEach(xAxis => {
				counter++
				let noti = document.createElement('div')
				noti.classList.add("popupEngineNotificationContainer", yAxis, xAxis)
				document.body.appendChild(noti)
			});

			let noti = document.createElement('div')
			noti.classList.add("popupEngineNotificationContainer", "phone", "center", yAxis)
			document.body.appendChild(noti)
		});
		
		this.#createCSS()
		this.#createDOMchangeListener()

		//add hover listeners to existing elements that request inline popups
		document.querySelectorAll('*[data-popup-text]').forEach((element)=>{
			this.#addHoverListener(element)
		})

		this.initialized = true
	}

	static #createCSS(){
		//create stylesheet
		const style = document.createElement('style')
		document.head.appendChild(style)

		const stylesheet = style.sheet

		//----------- modal -----------//

		//#region 
		stylesheet.insertRule(`:root{
			--popupEngine-background-color: ${this.config.backgroundColor};
			--popupEngine-color: ${this.config.textColor};
			--popupEngine-elem-background-color: ${this.config.elemBackground}
		}`)

		stylesheet.insertRule(`:where(.popupEngineModalContainer){
			position: fixed;
			inset: 0;
			background-color: hsla(0,0%,0%,.3);
			z-index: 1000;
			display: none;
			place-content: center;
			font-family: sans-serif;
			color: var(--popupEngine-color);
			transition: opacity .3s;
			opacity:0;
			backdrop-filter: blur(4px);
		}`)

		stylesheet.insertRule(`:where(.popupEngineModalContent) { 
			background-color: var(--popupEngine-background-color);
			padding: 2vw 5vw;
			max-width: 90vw;
			min-width: 25vw;
			overflow: hidden;
			word-wrap: break-word;
			transition: scale .3s;
			transition-timing-function: cubic-bezier(.13,.68,.46,1.33);
			scale: 0; 
			box-sizing: border-box;
		}`)

		stylesheet.insertRule(`:where(.popupEngineModalHeading) {
			text-align: center;
			font-size: 1.5rem
		}`)

		stylesheet.insertRule(`:where(.popupEngineModalText) {
			text-align: center;
			margin-bottom: 1rem;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineModalInputs) {
			display: flex;
				flex-direction: column;
				justify-content: center;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineModalInput) {
			padding: .5rem;
			border: 1px solid gray;
			margin: .2rem 0 .5rem 0;
			color: var(--popupEngine-color);
			background-color: var(--popupEngine-elem-background-color);
		}`)

		stylesheet.insertRule(`:where(.popupEngineModalInput::placholder) {
			color: hsl(0, 0%, 50%)
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineModalInputLabel) {
			font-size: .9rem;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineModalButtons) {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
			justify-content: center;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineModalButton) {
			cursor: pointer;
			border: 1px solid gray;
			padding: .5rem;
			color: var(--popupEngine-color);
			background-color: var(--popupEngine-elem-background-color);
		}`)
		//#endregion
		
		//----------- inline -----------//

		//#region 

		stylesheet.insertRule(`:where(.popupEngineInlineContainer) { 
			position: absolute;
			z-index: 999;
			display: grid;
			place-items: center;
			top: 0;
			transition: scale .3s;
			color: var(--popupEngine-color);
			font-family: sans-serif;
		}`)

		stylesheet.insertRule(`:where(.popupEngineInlineContent) { 
			background-color: var(--popupEngine-background-color);
			padding: .65rem;
			max-width: 30vw;
			word-wrap: break-word;
			transition: scale .3s;
			transition-timing-function: cubic-bezier(.13,.68,.46,1.33);
			box-shadow: 0 0 .3rem .3rem rgba(0,0,0,.1);
			grid-area: 1 / 1 / 2 / 2;
			transform: translateX(0);
		}`)

		stylesheet.insertRule(`:where(.popupEngineInlinePointer) { 
			background-color: var(--popupEngine-background-color);
			transform: rotate(45deg) translateY(50%);
			box-shadow: 0 0 .3rem .3rem rgba(0,0,0,.1);
			aspect-ratio: 1;
			width: 1rem;
			grid-area: 1 / 1 / 2 / 2;
			align-self: end;
		}`)
		stylesheet.insertRule(`.popupEngineInlineContainer.atBottom .popupEngineInlinePointer { 
			transform: translateY(-40%) rotate(45deg);
			align-self: start;
		}`)
		stylesheet.insertRule(`.popupEngineInlineContainer.left .popupEngineInlinePointer { 
			justify-self: start;
			margin-left: .5rem;
		}`)
		stylesheet.insertRule(`.popupEngineInlineContainer.right .popupEngineInlinePointer { 
			justify-self: end;
			margin-right: .5rem;
		}`)

		stylesheet.insertRule(`:where(.popupEngineInlineText) {
			margin: 0;
			font-size: .9rem;
		}`)

		stylesheet.insertRule(`:where(.popupEngineInlineHeading) {
			text-align: center;
			font-size: 1rem;
			margin: 0 0 .5rem 0;
			font-weight: bold;
		}`)
		//#endregion
		
		//----------- Notification -----------//
		
		//#region 
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer) {
			position: fixed;
			display: flex;
			flex-direction: column;
			max-width: 20vw;
			z-index: 999;
			gap: 1vw;
			height: auto;
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.top) {
			top: ${this.config.notificationOffset.top};
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.bottom) {
			bottom: ${this.config.notificationOffset.bottom};
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.left) {
			left: ${this.config.notificationOffset.left};
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.right) {
			right: ${this.config.notificationOffset.right};
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.center) {
			left: 50%;
			transform: translateX(-50%);
		}`)

		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.phone) {
			width: 80vw;
			max-width: 80vw !important;
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.phone.top) {
			top: ${this.config.notificationOffsetPhone.top} !important;
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationContainer.phone.bottom) {
			bottom: ${this.config.notificationOffsetPhone.bottom} !important;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineNotification) {
			padding: .5rem;
			gap: .5rem;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			background-color: var(--popupEngine-background-color);
			box-shadow: 0 0 .3rem .3rem rgba(0,0,0,.1);
			color: var(--popupEngine-color);
		}`)

		stylesheet.insertRule(`:where(.popupEngineNotificationHeading) {
			font-size: 1rem;
			margin: 0 0 .5rem 0;
			font-weight: bold;
		}`)

		stylesheet.insertRule(`:where(.popupEngineNotificationText) {
			margin: 0;
			font-size: .9rem;
		}`)
		
		stylesheet.insertRule(`:where(.popupEngineNotificationCloseIcon) {
			display: grid;
			place-items: center;
			width: 1.5rem;
			cursor: pointer;
			margin-left: auto;
		}`)
		stylesheet.insertRule(`:where(.popupEngineNotificationCloseIcon p) {
			margin: 0;
			font-family: Segoe UI Symbol;
		}`)
		//#endregion
	}

	/**
	 * creates a MutationObserver that fires when the dom is manipulated and adds eventlisteners to the new elements using #addHoverListeners()
	 */
	static #createDOMchangeListener(){
		// Options for the observer (which mutations to observe)
		const config = { attributes: true, childList: true, subtree: true }

		let relevantAttributes = ["data-popup-text", "data-popup-heading", "data-create-popup", "data-popup-delay"]

		// Callback function to execute when mutations are observed
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === "childList" && mutation.type != null) {
					mutation.addedNodes.forEach((elem)=>{
						if(elem?.dataset?.popuptext !== undefined){
							this.#addHoverListener(elem)
						}
					}) 
				}
				else if(relevantAttributes.includes(mutation.attributeName)){
					if(mutation.target !== undefined){
						this.#addHoverListener(mutation.target)
					}
				}
			}
		};

		// Create an observer instance linked to the callback function
		this.observer = new MutationObserver(callback)

		// Start observing the target node for configured mutations
		this.observer.observe(document, config)
	}

	/**
	 * adds a onhover event to the elem that creates the popup and a mouseleave
	 * that closes it. Also handles the popup delay.
	 * @param {Element} elem 
	 * @returns 
	 */
	static #addHoverListener(elem){
		if(elem.dataset.createPopup === "false")
			return

		let delay = parseInt(elem.dataset.popupDelay)
		if(!elem.dataset.popupDelay){
			delay = this.config.defaultInlinePopupDelay
		}
		else if(!delay){
			if(this.config.doLogs)
				console.log("invalid delay entered using default value", elem);
			delay = this.config.defaultInlinePopupDelay
		}

		elem.onmouseenter = ()=>{
			clearTimeout(this.inlinePopupDelay)
			this.inlinePopupDelay = setTimeout(function(){
				const controller = new AbortController();
				const signal = controller.signal;

				elem.addEventListener("mouseleave", ()=>{
					PopupEngine.closeInlinePopup()
					controller.abort()
				}, {signal})

				PopupEngine.createInlinePopup({
					position: elem, 
					text: elem.dataset.popupText, 
					heading: elem.dataset.popupHeading,
					element: elem
				})
			},delay)
		}
	}

	static createNotification(settings: NotificationSettings){
		if(!this.#checkHTML() || !settings )return

		if(!settings.position)
			settings.position = this.config.defaultNotificationPosition

		if(settings.position.length !== 2){
			if(this.config.doLogs)
				console.error("position setting is invalid: expecting a [array] that contains the y axis(top or bottom) and the x axis (left, center or right)")
		}

		let noti = document.createElement('div')
		noti.classList.add("popupEngineNotification")

		let content = document.createElement('div')

		//create heading
		if(settings.heading){
			let heading = document.createElement("p")
			heading.innerHTML = settings.heading
			heading.classList.add("popupEngineNotificationHeading")

			content.appendChild(heading)
		}

		//generate text
		if(settings.text && settings.text != "") {
			let popupText = document.createElement("p")
			popupText.classList.add("popupEngineNotificationText")
			popupText.innerHTML = settings.text

			content.appendChild(popupText)
		}
		
		noti.appendChild(content)

		//create close icon
		let close = document.createElement('div')
		close.classList.add("popupEngineNotificationCloseIcon")
		close.addEventListener("click", ()=>{
			PopupEngine.closeNotification(noti)
		})
		let closeIcon = document.createElement('p')
		closeIcon.innerHTML = "&#10006"

		close.appendChild(closeIcon)
		noti.appendChild(close)

		//add custom classes
		if(settings.CSSClass != undefined){
			if(Array.isArray(settings.CSSClass))
				noti.classList.add(...settings.CSSClass)
			else
				noti.classList.add(settings.CSSClass)
		}

		//append notification to container
		let targetedContainer
		if(window.innerWidth > this.config.phoneBreakpoint){ //desktop mode
			targetedContainer = document.querySelector('.popupEngineNotificationContainer.' + settings.position[0] + '.' + settings.position[1])
		}
		else{//phone
			if(["top","bottom"].includes(settings.position[0])){
				targetedContainer = document.querySelector('.popupEngineNotificationContainer.phone.' + settings.position[0])
			}
			else{
				targetedContainer = document.querySelector('.popupEngineNotificationContainer.phone.' + settings.position[1])
			}
		}

		targetedContainer.appendChild(noti)

		//add auto close
		if(!settings.lifetime || settings.lifetime > 0){
			setTimeout(function(){
				PopupEngine.closeNotification(noti)
			}, settings.lifetime || this.config.defaultNotificationLifetime)
		}

		return noti;
	}

	static closeNotification(noti) {
		noti.remove()
	}

	/**
	 * creates a small text only popup on top of a html element when its hovered
	 * @param {JSON} settings of the popup like text, heading, position. Check README for details.
	 */
	static createInlinePopup(settings){
		if(!this.#checkHTML() || !settings )return

		if(!settings.position){
			if(this.config.doLogs)
				console.error("position setting is required: either a element or a mouse event")
			return
		}

		this.observer.disconnect()

		this.inline.innerHTML = ""

		let content = document.createElement('div')
		content.classList.add("popupEngineInlineContent")

		//create heading
		if(settings.heading){
			let heading = document.createElement("p")
			heading.innerHTML = settings.heading
			heading.classList.add("popupEngineInlineHeading")

			content.appendChild(heading)
		}

		//generate text
		let popupText = document.createElement("p")
		popupText.classList.add("popupEngineInlineText")
		popupText.innerHTML = settings.text || "no text specified"

		content.appendChild(popupText)

		let pointer = document.createElement('div')
		pointer.classList.add("popupEngineInlinePointer")
		this.inline.appendChild(pointer)

		this.inline.appendChild(content)

		this.inline.style.scale = "1"

		let topOffsetTOP
		let topOffsetBOTTOM
		let leftOffset

		if(settings.position instanceof Element){ //allignt to hovered element
			let hoverElementRect = settings.position.getBoundingClientRect();

			topOffsetTOP = hoverElementRect.top - hoverElementRect.height - this.inline.offsetHeight + 5 //top ofset so that popup is on top of the hovered elem/mouse
			topOffsetBOTTOM = hoverElementRect.top + hoverElementRect.height + 10 //top ofset so that popup is below hovered elem/mouse

			leftOffset = hoverElementRect.left - this.inline.offsetWidth/2 + hoverElementRect.width/2
		}
		else if(settings.position.clientX){ //align to mouse
			topOffsetTOP = settings.position.clientY - this.inline.offsetHeight - 10
			topOffsetBOTTOM = settings.position.clientY + 10

			leftOffset = settings.position.clientX - this.inline.offsetWidth/2
		}
		else if(false){//align at coordinates

		}
		else{
			if(this.config.doLogs)
			console.error('Invalid position specified: "' + settings.position + '" either a element or a mouse event');
		}

		if( //if its out the top or preferes bottom position an bottom pos is valid
		topOffsetTOP < 0 ||
		this.config.preferedInlinePopupPosition == "bottom" &&
		topOffsetBOTTOM + this.inline.offsetHeight < document.body.clientHeight
		){
			this.inline.style.top = topOffsetBOTTOM + "px"
			this.inline.classList.add("atBottom") 
		}
		else{
			this.inline.style.top = topOffsetTOP + "px"
			this.inline.classList.remove("atBottom")
		}

		//left value must be higher then 0 and 
		this.inline.style.left = `min( max(${leftOffset}px, 0px), ${document.documentElement.clientWidth - this.inline.clientWidth}px)`
		const maxLeftOffset = document.documentElement.clientWidth - this.inline.clientWidth	

		this.inline.classList.remove("left", "right")
		if(leftOffset < 0){
			leftOffset = 0
			this.inline.classList.add("left")
		}
		else if(leftOffset > maxLeftOffset){
			leftOffset = maxLeftOffset - 5
			this.inline.classList.add("right")
		}

		settings?.element.classList.add("popupVisible")
	}

	/**
	 * Closes the inline popup and removes the .popupVisible
	 */
	static closeInlinePopup(){
		if(this.inline.style.scale == "1"){
			document.querySelectorAll('.popupVisible').forEach((elem)=>{elem.classList.remove("popupVisible")})
			this.inline.style.scale = "0"
			this.#createDOMchangeListener()
			clearTimeout(this.inlinePopupDelay)
		}
	}

	/**
	 * creates a full screen modal popup on top of the whole page that can contain text inputs and buttons.
	 * @param {JSON} settings of the popup like text, heading, buttons. Check README for details.
	 */
	static createModal(settings:ModalSettings = {}){
		return new Promise((resolve: (value: ModalCallbackData) => void, reject) => {
			this.endModal = resolve
	
			if(!this.#checkHTML())return
	
			if(this.modal.style.display != "none"){
				if(this.config.doLogs)
				console.log('overwriting old popup: "' + this.modalContent.querySelector(".popupEngineModalText").innerHTML + '"')
			}
			
			//#region generate content

			this.modalContent.innerHTML = ""

			//create heading
			if(settings.heading){
				let heading = document.createElement("p")
				heading.innerHTML = settings.heading
				heading.classList.add("popupEngineModalHeading")

				this.modalContent.appendChild(heading)
			}

			//generate text
			let popupText = document.createElement("p")
			popupText.classList.add("popupEngineModalText")
			popupText.innerHTML = settings.text || "no text specified"
	
			this.modalContent.appendChild(popupText)

			//create input
			if(!settings.inputs || settings.inputs.length == 0){
				settings.inputs = []
			}

			let popupInputs = document.createElement("div")
			popupInputs.classList.add("popupEngineModalInputs")

			for (let i = 0; i < settings.inputs.length; i++) {
				let input = document.createElement("input")

				if(settings.inputs[i].label){
					input.name = String(i)

					let label = document.createElement("label")
					label.classList.add("popupEngineModalInputLabel")
					label.innerText = settings.inputs[i].label

					popupInputs.appendChild(label)
				}

				input.classList.add("popupEngineModalInput")
				input.type = settings.inputs[i].type || "text"
				input.placeholder = settings.inputs[i].placeholder || ""
	
				popupInputs.appendChild(input)
			}
	
			this.modalContent.appendChild(popupInputs)
			
			//create buttons
			this.confirmModal = () => {}
			this.cancelModal = () => {}

			if(!settings.buttons || settings.buttons.length == 0){
				settings.buttons = [{text: "okay"}]
			}
	
			let popupButtons = document.createElement("div")
			popupButtons.classList.add("popupEngineModalButtons")
			
			for (let i = 0; i < settings.buttons.length; i++) {
				let button = document.createElement("button")
				button.classList.add("popupEngineModalButton")
				button.classList.add(settings?.buttons[i]?.role)
				button.innerText = settings.buttons[i].text
				button.onclick = function () { 
					PopupEngine.closeModal(
						settings.buttons[i].closePopup, 
						settings.buttons[i].action, 
						{
							text: settings.text,
							heading: settings.heading,
							buttons: settings.buttons,
							inputs: settings.inputs,
							buttonIndex: i,
						}
				)}

				switch (settings.buttons[i]?.role) {
					case "confirm":
						this.confirmModal = () => {
							PopupEngine.closeModal(
								settings.buttons[i].closePopup,
								settings.buttons[i].action,
								{
									text: settings.text,
									heading: settings.heading,
									buttons: settings.buttons,
									inputs: settings.inputs,
									buttonIndex: i,
								})
						}
						break;
					case "cancel":
						this.cancelModal = () => {
							PopupEngine.closeModal(
								settings.buttons[i].closePopup,
								settings.buttons[i].action,
								{
									text: settings.text,
									heading: settings.heading,
									buttons: settings.buttons,
									inputs: settings.inputs,
									buttonIndex: i,
								})
						}
						break;
				}
	
				popupButtons.appendChild(button)
			}
	
			this.modalContent.appendChild(popupButtons)
	
			//#endregion

			this.config.onModalOpen()
	
			//show popup
			this.modal.style.display = "grid"
			setTimeout(function(){
				let container = document.querySelector('.popupEngineModalContainer') as HTMLDivElement
				container.style.opacity = "1"
				let content = document.querySelector('.popupEngineModalContent') as HTMLDivElement
				content.style.scale = "1"
			},)
		})
	}

	/**
	 * Runns any button action and/or closes the popop. Should only be run if you want to close a modal and potentially lose all its data.
	 * @param {*} closePopup in case a button shouldnt actually close the popup, Defaults to true.
	 * @param {*} closeAction will be run if specified
	 * @param {*} data that will be handed to the specified action
	 */
	static closeModal(closePopup:boolean = true, closeAction = (data) => {}, data: ModalCallbackData = {}){
		//get values of inputs
		if(this.modalContent.querySelector(".popupEngineModalInputs")){
			let inputValues = []
			document.querySelectorAll('.popupEngineModalInputs .popupEngineModalInput').forEach((item: HTMLInputElement) => {
				inputValues.push(item.value)
			})
			data.inputValues = inputValues
		}

		closeAction(data)

		if(closePopup){
			this.modal.style.display = "none"
			this.modal.style.opacity = "0"
			this.modalContent.style.scale = "0"

			this.config.onModalClose(data)

			this.endModal(data)
		}
	}

	static confirmModal = () => {}
	static cancelModal = () => {}
	static pressModalButton(role: "confirm" | "cancel"){
		switch (role) {
			case "cancel":
				this.cancelModal()
				break;
			case "confirm":
				this.confirmModal()
				break;
		}
	}

	static #checkHTML(){
		if (document.readyState === 'loading') {
			if(this.config.doLogs)
			console.error("PopupEngine cant be run before DOM content has finished loading. Try adding a window.load() event arround this call or use defer.")
			return false
		} 

		if(!this.initialized){
			if(this.config.doLogs)
			console.error("PopupEngine has not yet been initialized: PopupEngine.init(). \n try running PopupEngine.test()")
			return false
		}

		return true
	}

	/**
	 * test method, creates one popup and outputs errors
	 */
	static test(){
		if(!this.initialized){
			console.error("TEST: PopupEngine has not yet been initialized: PopupEngine.init()")
			return
		}
		if(!document.querySelector('.popupEngineModalContainer')){
			console.error("TEST: Could not find DOM elements needed to run PopupEngine. This is probably because the Engine has not yet been initialized: PopupEngine.init()")
			return
		}
		if(!document.querySelector('.popupEngineModalContent')){
			console.error("TEST: Could not find DOM elements needed to run PopupEngine. This might be a problem with the initialization but is probably because another script has changed the engines elements or because your version of the engine is faulty.")
			return
		}
		console.log("TEST: all DOM elements seem fine");
		console.log(
		`TEST: Generating a test popup`);
		PopupEngine.createModal({
			heading: "test",
			text: "this is a test",
			buttons: [
				{
					text: "okay",
					action: (data) => {console.log("buttonpressed, value:", data.inputValues[0])}
				}
			],
			inputs: [
				{
					type: "text",
				}
			]
		})
	}
}