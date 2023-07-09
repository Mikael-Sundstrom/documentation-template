import { Cleanable } from "./interfaces"

/*  */
export let cache: { [key: string]: any } = {}

/*  */
export const BASE_PATH = window.location.hostname === 'localhost' ? '/docs' : ''

/*  */
export function cleanOnDestroy(instance: Cleanable) {
	cleanableStore.add(instance)
}
/*  */
class CleanableStore {
	private instances: Cleanable[] = []

	constructor() {
		this.clean = this.clean.bind(this)
	}

	add(instance: Cleanable) {
		this.instances.push(instance)
	}
	clean() {
		for (let instance of this.instances)
			instance.cleanup()
		this.instances = []  // remove references to allow garbage collection
	}
}
export const cleanableStore = new CleanableStore()

/*  */
class Router {
	routes: Record<string, () => void>
	currentPath: string = ''
	private beforeRouteChange: () => void

	constructor(routes: Record<string, () => void>, beforeRouteChange: () => void) {
		// Register script routes
		this.routes = routes

		// Middleware
		this.beforeRouteChange = beforeRouteChange

		window.addEventListener('popstate', () => this.pathChanged())
		document.addEventListener('DOMContentLoaded', () => {
			this.pathChanged()
			this.registerLinks()
			this.updateNavLinks()
		})
	}

	public navigate(path: string) {
		history.pushState(null, '', `${BASE_PATH}${path}`)
		this.pathChanged()
	}

	pathChanged() {
		// If we are at the root of our app, default to '/home'
		let path = window.location.pathname.startsWith(BASE_PATH)
			? window.location.pathname.slice(BASE_PATH.length)
			: window.location.pathname

		path = path in this.routes ? path : '/home'


		console.log(path)

		// Ensure path always starts with '/'
		path = path.startsWith('/') ? path : '/' + path

		if (path !== this.currentPath) {
			this.beforeRouteChange() // Call the cleanup function
			this.currentPath = path
			this.loadContent(path)
		}
		console.log(this.currentPath)
	}


	private registerLinks() {
		document.body.addEventListener('click', e => {
			if (e.target instanceof HTMLAnchorElement) {
				e.preventDefault()
				const href = e.target.getAttribute('href')
				if (href !== null) {
					const cleanedHref = href.replace(`${BASE_PATH}/`, '/')
					this.navigate(`${cleanedHref}`)
				}
			}
		})
	}




	private updateNavLinks() {
		// Get all the a tags in your nav element
		const navLinks = document.querySelectorAll('nav a')

		// Iterate over the nav links and update the href attributes
		navLinks.forEach(function (navLink) {
			// Get the original href attribute
			const originalHref = navLink.getAttribute('href')

			// Create the new href by prepending the base path
			const newHref = `/${originalHref}`

			// Set the new href on the navLink
			navLink.setAttribute('href', newHref)
		})
	}

	// Fetch the HTML and insert it into the DOM
	private loadContent(path: string): void {
		fetch(`${BASE_PATH}/pages${this.currentPath}.html`)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				return response.text()
			})
			.then(content => {
				const app = document.querySelector('#routerOutlet')
				if (app !== null) {
					app.innerHTML = content
					// Wait for the next tick to ensure the new HTML is rendered
					setTimeout(() => this.executeScript(path), 0)
				}
			})
			.catch(error => {
				console.error('Error:', error)
			})
	}

	// Execute a script after loading the content
	private executeScript(path: string): void {
		const route = this.routes[path]
		if (route !== undefined) {
			route()
		}
	}
}
export default Router