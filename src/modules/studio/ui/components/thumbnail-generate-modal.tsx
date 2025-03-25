import { ResponsiveModal } from '@/components/responsive-modal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { trpc } from '@/trpc/client'
import { z } from 'zod'

interface ThumbnailGenerateModalProps {
	videoId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
	prompt: z.string().min(10),
})

export const ThumbnailGenerateModal = ({ onOpenChange, open, videoId }: ThumbnailGenerateModalProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prompt: '',
		},
	})

	const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
		onSuccess: () => {
			toast.success('Background job started', { description: 'It may take some time' })
			form.reset()
			onOpenChange(false)
		},
		onError: () => {
			toast.error('Something went wrong')
		},
	})

	const onsubmit = (values: z.infer<typeof formSchema>) => {
		generateThumbnail.mutate({
			prompt: values.prompt,
			id: videoId,
		})
	}

	return (
		<ResponsiveModal title="Upload a thumbnail" onOpenChange={onOpenChange} open={open}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onsubmit)} className="flex flex-col gap-4">
					<FormField
						name="prompt"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prompt</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className="resize-none"
										cols={30}
										rows={5}
										placeholder="A description of wanted thumbnail"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end">
						<Button disabled={generateThumbnail.isPending} type="submit">
							Generate
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveModal>
	)
}
