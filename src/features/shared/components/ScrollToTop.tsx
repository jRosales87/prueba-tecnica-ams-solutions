import { ChevronUp } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface ScrollToTopProps {
    threshold?: number;
    behavior?: ScrollBehavior;
}

export const ScrollToTop = ({
    threshold = 300,
    behavior = 'smooth'
}: ScrollToTopProps) => {
    const showButton = useScrollToTop(threshold);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: behavior
        });
    };


    if (!showButton) {
        return null;
    }

    return (
        <button
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Volver al inicio de la página"
            title="Volver arriba"
        >
            <ChevronUp
                className="w-6 h-6"
                aria-hidden="true"
            />
        </button>
    );
};