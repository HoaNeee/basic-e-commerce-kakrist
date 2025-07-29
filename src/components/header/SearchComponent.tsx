import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { LuSearch } from "react-icons/lu";
import lodash from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { get } from "@/utils/requets";
import { convertStr } from "@/utils/formatText";

const SearchComponent = () => {
  const [keyword, setKeyword] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [suggests, setSuggests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keywordDebounce, setKeywordDebounce] = useState<string>("");

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const initialKeyword = searchParams.get("keyword") || "";

  useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  const handleSearch = (keyword: string) => {
    if (keyword.trim() === "") {
      return;
    }

    if (pathName === "/search") {
      const url = new URL(window.location.href);
      url.searchParams.set("keyword", keyword.trim());
      // already on search page
      router.push(url.toString());
    } else {
      const href = `/search?keyword=${keyword.trim().replace(/\s+/g, "+")}`;
      window.location.href = href;
    }
  };

  const getSuggest = async (keyword: string) => {
    try {
      const api = `/search/suggest?keyword=${encodeURIComponent(keyword)}`;
      const response = await get(api);
      setSuggests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const debounceSuggest = useRef(
    lodash.debounce((keyword: string) => {
      if (keyword.trim() === "") {
        setSuggests([]);
        setOpenPopover(false);
        setIsLoading(false);
        return;
      }
      setKeywordDebounce(keyword);
      setIsLoading(true);
      setOpenPopover(true);
      getSuggest(keyword);
    }, 1000)
  ).current;

  const handleSolveSuggest = (suggest: string) => {
    const index = convertStr(suggest).indexOf(convertStr(keywordDebounce));
    if (index !== -1) {
      return (
        <>
          {suggest.slice(0, index)}
          <span className="text-black font-semibold">
            {suggest.slice(index, index + keywordDebounce.length)}
          </span>
          {suggest.slice(index + keywordDebounce.length)}
        </>
      );
    }
    return <p>{suggest}</p>;
  };

  return (
    <div className="flex items-center gap-2 flex-1 relative z-1">
      {openPopover && (
        <div
          className="fixed w-full h-screen bg-transparent z-9 left-0 top-0"
          onClick={() => setOpenPopover(false)}
        ></div>
      )}

      <div className="w-full relative z-10 transition-all duration-300 ease-in-out">
        <Input
          placeholder="Enter products, blog,..."
          className="w-full relative z-10 py-5"
          autoComplete="off"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (e.target.value.trim() === "") {
              setSuggests([]);
              setOpenPopover(false);
              setIsLoading(false);
            }
            debounceSuggest(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              debounceSuggest.cancel();
              setOpenPopover(false);
              setSuggests([]);
              handleSearch(keyword);
            }
          }}
        />
      </div>
      {openPopover && (
        <>
          <div className="absolute min-h-10 z-40 w-9/10 xl:w-25/26 bg-white p-2 top-10 shadow-2xl left-0 rounded-sm border border-gray-200">
            {!isLoading ? (
              <div className="flex flex-col gap-0">
                {suggests.length > 0 ? (
                  suggests.map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm"
                      onClick={() => {
                        setKeyword(item);
                        setOpenPopover(false);
                        handleSearch(item);
                      }}
                    >
                      {handleSolveSuggest(item)}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm p-2">
                    No suggestions found
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full py-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="relative z-10 transition-all duration-300 ease-in-out">
        <LuSearch
          className={`lg:text-2xl text-xl`}
          onClick={() => {
            handleSearch(keyword);
          }}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
