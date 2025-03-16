'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ErrorBoundary } from 'react-error-boundary'
import { MoreVerticalIcon, TrashIcon } from 'lucide-react'

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
	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })

    const form = useForm({
        defaultValues: video
    })

	return (
		<div className="flex items-center justify-between mb-6">
			<div>
				<h1 className="text-2lx font-bold">Video details</h1>
				<p className="text-xs text-muted-foreground">Menage your video details</p>
			</div>
			<div className="flex items-center gap-x-2">
				<Button type="submit" disabled={false}>
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
	)
}
