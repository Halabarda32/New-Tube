import { VideoView } from '@/modules/videos/ui/views/video-view'
import { HydrateClient, trpc } from '@/trpc/server'
// import { TRPCError } from '@trpc/server'

interface PageProps {
	params: Promise<{
		videoId: string
	}>
}
// interface PageProps {
//     params: {
//         videoId: string
//     }
// }

const Page = async ({ params }: PageProps) => {
	const { videoId } = await params

	// if (!videoId) {
	// 	throw new TRPCError({ code: 'NOT_FOUND' })
	// }

	void trpc.videos.getOne.prefetch({ id: videoId })

	return (
		<HydrateClient>
			<VideoView videoId={videoId} />
		</HydrateClient>
	)
}

export default Page
