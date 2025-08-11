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
  const [keywordStrong, setKeywordStrong] = useState<string>("");
  const [isSuggestWithKeywordEmpty, setisSuggestWithKeywordEmpty] =
    useState(false);
  const [suggestSelected, setSuggestSelected] = useState<number | null>(null);

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
    if (pathName === "/search") {
      const url = new URL(window.location.href);
      url.searchParams.set("keyword", keyword.trim());
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
      setIsLoading(false);
      setTimeout(() => {}, 200);
    }
  };

  const debounceSuggest = useRef(
    lodash.debounce((keyword: string) => {
      if (keyword.trim() === "") {
        setisSuggestWithKeywordEmpty(true);
      } else {
        setisSuggestWithKeywordEmpty(false);
      }
      setSuggestSelected(null);
      setKeywordStrong(keyword);
      setIsLoading(true);
      setOpenPopover(true);
      getSuggest(keyword);
    }, 500)
  ).current;

  const handleSolveSuggest = (suggest: string) => {
    const index = convertStr(suggest).indexOf(convertStr(keywordStrong));
    if (index !== -1 && keywordStrong.trim() !== "") {
      return (
        <>
          {suggest.slice(0, index)}
          <span className="text-primary dark:text-primary font-semibold bg-gray-100 dark:bg-neutral-600/70 px-1 rounded">
            {suggest.slice(index, index + keywordStrong.length)}
          </span>
          {suggest.slice(index + keywordStrong.length)}
        </>
      );
    }
    return <span className="text-gray-700 dark:text-gray-200">{suggest}</span>;
  };

  return (
    <div className="flex items-center gap-3 flex-1 relative z-20 max-w-2xl">
      {openPopover && (
        <div
          className="fixed w-full h-screen bg-transparent z-10 left-0 top-0"
          onClick={() => setOpenPopover(false)}
        ></div>
      )}

      <div className="w-full relative z-20 transition-all duration-300 ease-in-out">
        <div className="relative">
          <Input
            placeholder="Search products, blogs..."
            className="w-full pl-4 pr-4 py-5 text-sm bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-neutral-800 focus:border-primary/30 focus:ring-primary/20 transition-all duration-200 shadow-sm hover:shadow-md"
            autoComplete="off"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              debounceSuggest(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                debounceSuggest.cancel();
                setOpenPopover(false);
                setSuggests([]);
                handleSearch(keyword);
                return;
              }

              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const index = suggestSelected;

                if (index === null || index === undefined) {
                  setSuggestSelected(0);
                  setKeyword(suggests[0]);
                  return;
                }
                if (e.key === "ArrowDown") {
                  setKeyword(
                    suggests[Math.min(suggests.length - 1, index + 1)] || ""
                  );
                  setSuggestSelected(Math.min(suggests.length - 1, index + 1));
                } else {
                  setKeyword(suggests[Math.max(0, index - 1)] || "");
                  setSuggestSelected(Math.max(0, index - 1));
                }
              }
            }}
          />
        </div>
      </div>

      {openPopover && (
        <>
          <div className="absolute min-h-16 z-30 w-full bg-white dark:bg-neutral-800 p-3 top-12 shadow-2xl left-0 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            {!isLoading ? (
              <div className="flex flex-col gap-1">
                {isSuggestWithKeywordEmpty && (
                  <div className="text-gray-500 dark:text-gray-400 text-sm px-3 py-2 font-medium">
                    💡 Suggestions for you:
                  </div>
                )}
                {suggests.length > 0 ? (
                  suggests.map((item, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        suggestSelected === index
                          ? "bg-primary/5 dark:bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                      onClick={() => {
                        setKeyword(item);
                        setOpenPopover(false);
                        handleSearch(item);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <LuSearch className="text-gray-400 text-xs flex-shrink-0" />
                        <span>{handleSolveSuggest(item)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm px-3 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 text-gray-300 dark:text-gray-600">
                        <LuSearch className="w-full h-full" />
                      </div>
                      <span>No suggestions found</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-20 py-8 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Searching...
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <button
        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-600 dark:text-gray-300 hover:text-primary flex-shrink-0"
        onClick={() => {
          handleSearch(keyword);
        }}
      >
        <LuSearch className="text-xl" />
      </button>
    </div>
  );
};

export default SearchComponent;
