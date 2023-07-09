import anime from './anime.es.js'

interface CardOptions {
	duration: number
	easing: string
}

class Cards implements CardOptions {
	public cards: NodeListOf<any>

	constructor(public duration: number = 300, public easing: string) {
		this.cards = document.querySelectorAll('.card')

		for (let card of this.cards) {
			card.addEventListener('click', this.handleClick)
			card.duration = this.duration
			card.easing = this.easing

		}
	}

	handleClick(this: any, e: any): void {
		this.style.overflowY = 'hidden'

		for (let child of this.children) {

			if (child.classList.contains('card-reveal')) {

				if (e.target.classList.contains('activator')) {
					child.style.display = 'block'
					anime({
						targets: child,
						translateY: '-100%',
						duration: e.currentTarget.duration,
						easing: e.currentTarget.easing
					})
				}

				else if (e.target.classList.contains('close-card')) {
					anime({
						targets: child,
						translateY: 0,
						duration: e.currentTarget.duration * 0.8,
						easing: e.currentTarget.easing,
						complete: () => {
							child.style.display = 'none'
							this.style.overflowY = 'visible'
						}
					})
				}

			}
		}
	}

	cleanup() {
		for (let card of Array.from(this.cards)) {
			card.removeEventListener('click', this.handleClick);
			(card as any).duration = null;
			(card as any).easing = null
		}
	}
}

export default Cards