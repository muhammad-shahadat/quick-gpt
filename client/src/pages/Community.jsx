import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';

import Loading from './Loading';
import { useGetCommunityImages } from '../hooks/useImageQueries';



const Community = () => {

    const { ref, inView } = useInView();
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        isError

    } = useGetCommunityImages();
    const allImages = data?.pages.flatMap((page) => page.images) || [];



    useEffect(() => {
        if (hasNextPage && inView) {
            fetchNextPage();
        }

    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading) return <Loading />;
    if (isError) return <p className="text-center text-red-500 mt-10">Error loading images</p>;

    return (

        <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
            <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100'>Community Images</h2>
            {
                allImages.length > 0 ? (
                    <div className='flex flex-wrap max-sm:justify-center gap-5'>
                        {
                            allImages.map((item, index) => (
                                <a className='relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300' href={item.content} target='_blank' key={index}>
                                    <img src={item.content} className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out' alt="" />
                                    <p className='absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 rounded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'>Created by {item?.chat?.user?.name}</p>
                                </a>
                            ))
                        }
                    </div>
                ) : (
                    <p className='text-center text-gray-600 dark:text-purple-200 mt-10'>No images available</p>
                )
            }

            {/* loading indicator */}
            <div ref={ref} className="h-4 flex justify-center">
                {isFetchingNextPage && <Loader2 className="animate-spin" />}
            </div>

        </div>


    )

}

export default Community