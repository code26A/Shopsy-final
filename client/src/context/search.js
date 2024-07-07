import { useState,useContext } from "react";
import { createContext } from "react";

const SearchContext = createContext();



const SearchProvider =({children})=>{
    const[search,setSearch]=useState({
        key: null,
        results:[]
    });

    return (
        <SearchContext.Provider value={[search,setSearch]}>
            {children}
        </SearchContext.Provider>
    )
}

//ustom hook

const useSearch=()=>useContext(SearchContext)
 
export {useSearch, SearchProvider}