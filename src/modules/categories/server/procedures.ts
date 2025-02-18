import { db } from '@/db'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { categories } from '@/db/schema'

export const categoriesRouter = createTRPCRouter({
	getMany: baseProcedure.query(async () => {
		const data = await db.select().from(categories)
		return data
	}),
})
