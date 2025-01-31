import { Building2, Sparkles, Users } from "lucide-react";

const renderPostAlert = (source: string) => {
    const alertConfig = {
        friend: { icon: Users, text: 'Posted by someone in your network' },
        suggested: { icon: Sparkles, text: 'Suggested post based on your interests' },
        company: { icon: Building2, text: 'From a company you follow' },
    };

    const config = alertConfig[source as keyof typeof alertConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className="flex items-center gap-2 py-2 px-4 text-xs text-[#8b949e] bg-dark-secondary rounded-t-lg">
            <Icon className="h-3.5 w-3.5" />
            <span>{config.text}</span>
        </div>
    );
};

export default renderPostAlert;