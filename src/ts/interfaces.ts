export interface Cleanable {
	cleanup(): void
}

export interface CardOptions {
	openDuration: number,
	openEasing: string,
	closeDuration: number,
	closeEasing: string
}

export interface SidenavOptions {
	options: {
		edge: string,
		draggable: boolean,
		inDuration: number,
		outDuration: number,
		onOpenStart: any,
		onOpenEnd: any,
		onCloseStart: any,
		onCloseEnd: any,
		preventScrolling: boolean
	}
}