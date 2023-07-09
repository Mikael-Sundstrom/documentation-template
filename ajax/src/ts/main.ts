import Cards from './cards.js'
import { CardOptions, SidenavOptions } from './interfaces.js'

declare global {
	interface Window { OnlineCores: any }
}

/* window.OnlineCores = {
	Cards: (options: CardOptions) => {
		return new Cards(options)
	},
} */