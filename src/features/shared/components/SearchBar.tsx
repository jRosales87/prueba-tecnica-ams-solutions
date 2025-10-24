import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';

interface Props {
    onSearch: (query: string) => void;
    placeholder?: string
}


export const SearchBar = ({
    onSearch,
    placeholder = "Search products..."
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
        <div className="flex justify-end mb-4">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="border p-2 mb-4"
            />
        </div>
    )
}
