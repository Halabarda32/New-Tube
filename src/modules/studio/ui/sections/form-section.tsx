'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from 'zod'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ErrorBoundary } from 'react-error-boundary'
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'
import { videoUpdateSchema } from '@/db/schema'
import { toast } from 'sonner'

interface FormSectionProps {
	videoId: string
}

export const FormSection = ({ videoId }: FormSectionProps) => {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const FormSectionSkeleton = () => {
	return (
		<div>
			<p>loading</p>
		</div>
	)
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
	const utils = trpc.useUtils()
	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
	const [categories] = trpc.categories.getMany.useSuspenseQuery()

	const update = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })
			toast.success('Video updated')
		},
		onError: () => {
			toast.error('Something went wrong')
		},
	})

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		resolver: zodResolver(videoUpdateSchema),
		defaultValues: video,
	})

	const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
		update.mutate(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2lx font-bold">Video details</h1>
						<p className="text-xs text-muted-foreground">Menage your video details</p>
					</div>
					<div className="flex items-center gap-x-2">
						<Button type="submit" disabled={update.isPending}>
							Save
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant={'ghost'} size={'icon'}>
									<MoreVerticalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem className="cursor-pointer">
									<TrashIcon className="size-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<div className="space-y-8 lg:col-span-3">
						<FormField
							control={form.control}
							name={'title'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Add a title of your video" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={'description'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											value={field.value ?? ''}
											placeholder="Add a title of your video"
											rows={10}
											className="resize-none pr-10"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* TODO ADD THUMBNAIL FIELD HERE */}
						<FormField
							control={form.control}
							name={'categoryid'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder={'Select a category'} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(category => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</form>
		</Form>
	)
}
