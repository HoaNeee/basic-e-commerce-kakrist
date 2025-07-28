import SearchResultComponent from "@/components/SearchResultComponent";
import { Metadata } from "next";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProps): Promise<Metadata> => {
  const { keyword } = await searchParams;

  return {
    title: `${keyword || "Search"} - Search Results`,
    description: "Search for products, blogs, and more.",
  };
};

const Search = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { keyword } = await searchParams;

  return (
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <div>
        <h1 className="md:text-3xl text-2xl text-gray-800 leading-tight font-bold">
          Search Results {keyword ? `For "${keyword}"` : ""}
        </h1>
        <p className="text-gray-600">Here are the results for your search.</p>
      </div>

      <Suspense fallback={<></>}>
        <SearchResultComponent />
      </Suspense>
    </section>
  );
};

export default Search;
