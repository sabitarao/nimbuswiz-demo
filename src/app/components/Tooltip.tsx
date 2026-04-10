import { ReactNode, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string | ReactNode;
  children?: ReactNode;
  icon?: boolean;
}

export default function Tooltip({ content, children, icon = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || (
          icon && <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
        )}
      </div>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
          <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-8 border-transparent border-t-slate-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoTooltipProps {
  title: string;
  description: string;
}

export function InfoTooltip({ title, description }: InfoTooltipProps) {
  return (
    <Tooltip
      content={
        <div>
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-slate-300">{description}</div>
        </div>
      }
      icon
    />
  );
}
