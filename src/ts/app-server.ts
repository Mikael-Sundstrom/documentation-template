import { Cleanable } from "./interfaces"

/**
 * An object for storing cache data.
 * The object key is the cache key and the value is the cached data.
 */
export let cache: { [key: string]: any } = {}

/**
 * This function registers a Cleanable instance for cleanup when destroyed.
 *
 * @param {Cleanable} instance - The Cleanable instance to be registered for cleanup.
 */
export function cleanOnDestroy(instance: Cleanable) {
	cleanableStore.add(instance)
}

/**
 * A store for managing Cleanable instances.
 */
class CleanableStore {
	private instances: Cleanable[] = []

	constructor() {
		this.clean = this.clean.bind(this)
	}

	/**
	 * Registers a Cleanable instance to the store.
	 *
	 * @param {Cleanable} instance - The Cleanable instance to be registered.
	 */
	add(instance: Cleanable) {
		this.instances.push(instance)
	}

	/**
	 * Cleans all registered Cleanable instances and removes them from the store.
	 */
	clean() {
		console.log(`Cleaning up ${this.instances.length} instance(s)`)
		for (let instance of this.instances)
			instance.cleanup()
		this.instances = []  // remove references to allow garbage collection
	}
}

export const cleanableStore = new CleanableStore()

/**
 * A router for managing application routes.
 */
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

	/**
	 * Navigates to the specified path.
	 *
	 * @param {string} path - The path to navigate to.
	 */
	private navigate(path: string) {
		history.pushState(null, '', `${path}`)
		this.pathChanged()
	}

	private pathChanged() {
		// If we are at the root of our app, default to '/home'
		let path = window.location.pathname

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
					const cleanedHref = href.replace(`/`, '/')
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
		fetch(`/pages${this.currentPath}.html`)
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