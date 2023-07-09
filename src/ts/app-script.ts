import Router, { cleanOnDestroy, cleanableStore, cache } from './app-server.js'
import Cards from "./cards.js"


// Initialize the router with a map of scripts for each hash
const router = new Router(
	{
		'/home': () => {
			cache['title'] = 'Home'
		},
		'/card': () => {
			const cards = new Cards(300, 'easeInOutQuart')
			cleanOnDestroy(cards)
		}
	}, middleware
)

// Middleware function, runs when route is changed
function middleware() {
	cleanableStore.clean()
}