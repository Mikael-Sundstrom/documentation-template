/* if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
	console.log("%cHost: %s", "color:#999;", "%c" + location.hostname, "color:white;"); */
/**
 * ██████╗  █████╗  ██████╗ ███████╗    ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗
 * ██╔══██╗██╔══██╗██╔════╝ ██╔════╝    ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗
 * ██████╔╝███████║██║  ███╗█████╗      ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝
 * ██╔═══╝ ██╔══██║██║   ██║██╔══╝      ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗
 * ██║     ██║  ██║╚██████╔╝███████╗    ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║
 * ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
 */

const ajax = new MO.AJAX()

document.addEventListener('DOMContentLoaded', () => {
	// Get route from URL
	currentRoute = GetRoutePath()

	// Call start page
	ajax.callPage('pages/' + currentRoute + '.html', (content) => {
		loadPage(content)
	})

	// Setup router
	const mainContent = document.getElementById('page-content')
	const el = document.getElementsByTagName('a')

	// Automate routes, <a href="#about">Link</a>
	for (let i = 0; i < el.length; i++) {
		el[i].addEventListener('click', (e) => {

			linkHref = e.target.getAttribute("href")
			linkHref = linkHref.substring(linkHref.indexOf('#') + 1)

			ajax.callPage('pages/' + linkHref + '.html', (content) => {
				loadPage(content)
			})
		})
	}

	// Animate with greensock and initializ javascript
	loadPage = (content) => {
		return gsap.to("#page-content", {
			duration: 0.3, opacity: '0', ease: "power4", onComplete: () => {

				mainContent.innerHTML = content
				gsap.to("#page-content", { duration: 0.6, opacity: '1', ease: "power4" })

				// Initilze javascript after ajax load
				MaterializeInit()
				Prism.highlightAll()
			}
		})
	}
})

MaterializeInit = () => {
	M.Sidenav.init(document.querySelectorAll('.sidenav'), {
		edge: 'left',
		draggable: true,
		inDuration: 200,
		outDuration: 150,
		onOpenStart: null,
		onOpenEnd: null,
		onCloseStart: null,
		onCloseEnd: null,
		preventScrolling: true
	})

	M.Collapsible.init(document.querySelectorAll('.collapsible'), {
		accordion: true
	})
}

GetRoutePath = () => {
	var route = document.location.toString().toLowerCase().split('#')[1]

	if (route == null || route == '' || route == '!')
		route = 'home'

	return route
}