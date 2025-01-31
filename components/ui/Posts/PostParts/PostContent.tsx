import { Post } from "@/types/types";



const renderPostContent = (post: Post) => {
    if (post.medias) {
        return (
            <div className="mt-2">
                <p className="mb-2 text-[#c9d1d9]">{post.content}</p>

                <div className={`${post.medias.length > 1 ? 'grid grid-cols-3 gap-2' : 'gap-4'}`}>
                    {post.medias.map((media) =>
                        media.type === 'video' ? (
                            <div
                                key={media.url}
                                className="relative aspect-video rounded-lg overflow-hidden bg-[#21262d] shadow-lg"
                            >
                                <video
                                    src={media.url || ''}
                                    controls
                                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                                    className="w-full h-full object-cover"
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div
                                key={media.url}
                                className="relative w-full rounded-lg overflow-hidden bg-[#21262d] shadow-lg"
                            >
                                <img
                                    src={media.url || ''}
                                    alt="media"
                                    className="w-full h-full object-scale-down"
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    }

    return <p className="mt-2 ext-[#c9d1d9]">{post.content}</p>;
};


export default renderPostContent;