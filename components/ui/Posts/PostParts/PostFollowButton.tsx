const renderFollowButton = (author: any) => {
    if (author.isFollowing) return null;

    return (
        <button className="text-[0.6rem] px-2 py-1 rounded-full bg-theme-primary text-white/90">
            Follow
        </button>
    );
};
export default renderFollowButton;