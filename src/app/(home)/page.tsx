import { HydrateClient, trpc } from '@/trpc/server'
import { PageClient } from './client'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default async function Home() {
	void trpc.hello.prefetch({ text: 'krzyś' })
	return (
		<HydrateClient>
			<Suspense fallback={<p>Loading...</p>}></Suspense>
			<ErrorBoundary fallback={<p>Error</p>}>
				<PageClient />
			</ErrorBoundary>
		</HydrateClient>
	)
}
