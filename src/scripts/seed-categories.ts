import { db } from '@/db'
import { categories } from '@/db/schema'

const categoryNames = [
	'Cars and vehicles',
	'Comedy',
	'Education',
	'Entertainment',
	'Film and animation',
	'How-to and style',
	'Music',
	'News and Politics',
	'People and blogs',
	'Pets and animals',
	'Science and technology',
	'Sports',
	'Travel and events',
]

async function main() {
	console.log('sending categories......')

	try {
		const values = categoryNames.map(name => ({
			name,
			description: `Videos related to ${name.toLowerCase()}`,
		}))

		await db.insert(categories).values(values)
		console.log('Categories sended successfully!!!')
	} catch (error) {
		console.error('Error sending categories:', error)
		process.exit(1)
	}
}

main()
