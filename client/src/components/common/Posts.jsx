import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, username, userId}) => {
	const returnEndpoint = (feedType) => {
		switch (feedType) {
			case 'forYou': return '/api/post/all'
			case 'following': return '/api/post/following'
			case 'posts': return `/api/post/user/${username}`
			case 'likes': return `/api/post/liked/${userId}`
			default: return '/api/post/all'
		}
	}

	const postEndpoint = returnEndpoint(feedType);

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ['posts'],
		queryFn: async () => {
			try {
				const response = await fetch(postEndpoint);
				const data = await response.json();

				// if (data.error) throw new Error(data.error);
				if (!response.ok) {
					throw new Error(data.error || 'Something Went Wrong');
				}

				return data;
			} catch (error) {
				throw error;
			}
		}
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;