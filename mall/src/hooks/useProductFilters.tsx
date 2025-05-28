import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useSubCategoryFilters (paramName:string){
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentValues = useCallback((): string[] => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.getAll(paramName);
    }, [location.search, paramName]);

    const addValue = useCallback((value: string) => {
        const searchParams = new URLSearchParams(location.search);
        const values = new Set(searchParams.getAll(paramName));
        values.add(value);

        searchParams.delete(paramName);
        values.forEach((v) => searchParams.append(paramName, v));
        navigate({ search: searchParams.toString() }, { replace: true });
    }, [location.search, navigate, paramName]);

    const removeValue = useCallback((value: string) => {
        const searchParams = new URLSearchParams(location.search);
        const values = searchParams.getAll(paramName).filter(v => v !== value);

        searchParams.delete(paramName);
        values.forEach((v) => searchParams.append(paramName, v));
        navigate({ search: searchParams.toString() }, { replace: true });
    }, [location.search, navigate, paramName]);

    const clearValues = useCallback(() => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(paramName);
        navigate({ search: searchParams.toString() }, { replace: true });
    }, [location.search, navigate, paramName]);

    return {
        values: getCurrentValues(),
        addValue,
        removeValue,
        clearValues,
    };
}
