import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = process.env.PORT || 3000

const mimeTypes = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.ico': 'image/x-icon'
}

http.createServer(async (req, res) => {
	try {
		if (req.url.endsWith('/favicon.ico') || req.url.startsWith('/assets') || req.url.startsWith('/dist') || req.url.startsWith('/js') || req.url.startsWith('/css') || req.url.startsWith('/img')) {
			const filePath = path.join(__dirname, './docs', req.url)
			const content = await fs.readFile(filePath)
			const ext = path.extname(filePath)
			const mimeType = mimeTypes[ext] || 'application/octet-stream'
			res.writeHead(200, { 'Content-Type': mimeType })
			res.end(content)
		} else {
			console.log('index.html')
			const content = await fs.readFile('./docs/index.html', 'utf-8')
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end(content)
		}
	} catch (err) {
		console.log('Error while handling request:', err)
		res.writeHead(500)
		res.end()
	}
}).listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})
