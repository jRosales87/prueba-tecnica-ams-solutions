import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

interface Props {
    onSearch: (query: string) => void;
    placeholder?: string
}


export const SearchBar = ({
    onSearch,
    placeholder = "Buscar productos..."
}: Props) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

    const deferredValue = useDeferredValue(inputValue);

    useEffect(() => {
        onSearch(deferredValue);
        if (deferredValue) {
            setSearchParams({ q: deferredValue });
        } else {
            setSearchParams({});
        }
    }, [deferredValue, onSearch, setSearchParams]);


    return (
        <div className="flex justify-end mb-4" role="search">
            <div className="relative w-full max-w-md">
                <label htmlFor="search-input" className="sr-only">
                    Buscar productos por marca o modelo
                </label>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                        aria-hidden="true"
                    />
                    <input
                        id="search-input"
                        type="search"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-describedby="search-help"
                        autoComplete="off"
                    />
                </div>
                <div id="search-help" className="sr-only">
                    Escribe para buscar productos por marca o modelo. Los resultados se actualizarán automáticamente.
                </div>
            </div>
        </div>
    )
}
