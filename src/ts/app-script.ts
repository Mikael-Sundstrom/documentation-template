import Router, { cleanOnDestroy, cleanableStore, cache } from './app-server.js'
import Cards from "./cards.js"

/*
'linear',
'easeInQuad',
'easeInCubic',
'easeInQuart',
'easeInQuint',
'easeInSine',
'easeInExpo',
'easeInCirc',
'easeInBack',
'easeOutQuad',
'easeOutCubic',
'easeOutQuart',
'easeOutQuint',
'easeOutSine',
'easeOutExpo',
'easeOutCirc',
'easeOutBack',
'easeInBounce',
'easeInOutQuad',
'easeInOutCubic',
'easeInOutQuart',
'easeInOutQuint',
'easeInOutSine',
'easeInOutExpo',
'easeInOutCirc',
'easeInOutBack',
'easeInOutBounce',
'easeOutBounce',
'easeOutInQuad',
'easeOutInCubic',
'easeOutInQuart',
'easeOutInQuint',
'easeOutInSine',
'easeOutInExpo',
'easeOutInCirc',
'easeOutInBack',
'easeOutInBounce',
'cubicBezier(.5, .05, .1, .3)',
'spring(1, 80, 10, 0)',
'easeInElastic',
'easeOutElastic',
'easeInOutElastic',
'easeOutInElastic',
'steps(5)'
*/

// Initialize the router with a map of scripts for each hash
const router = new Router(
	{
		'/home': () => {
			cache['title'] = 'Home'
		},
		'/card/foo': () => {
			const cards = new Cards(600, 'easeOutInQuart')
			cleanOnDestroy(cards)
		}
	}, middleware
)

// Middleware function, runs when route is changed
function middleware() {
	cleanableStore.clean()
}