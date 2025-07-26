"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./ui/pagination";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  totalPage: number;
  className?: string;
}

const PaginationComponent = (props: Props) => {
  const { totalPage = 1, className } = props;

  const searchParams = useSearchParams();
  const pathName = usePathname();

  const createQueryString = (
    name: string,
    value: string,
    query = searchParams
  ) => {
    const params = new URLSearchParams(query);
    params.set(name, value);
    return decodeURIComponent(params.toString());
  };

  const renderPagination = () => {
    const page = Number(searchParams.get("page")) || 1;
    return (
      <Pagination
        className={`${cn(`justify-end dark:text-white/80`, className)}`}
      >
        <PaginationContent>
          <PaginationItem>
            <Button variant={"ghost"} className="p-0" disabled={page === 1}>
              <Link
                href={`${pathName}?${createQueryString(
                  "page",
                  (page - 1).toString()
                )}`}
                aria-label="Go to previous page"
                className={
                  "gap-1 px-2.5 py-2 rounded-md sm:pl-2.5 flex items-center text-sm"
                }
              >
                <ChevronLeftIcon size={15} />
                <span className="hidden sm:block">Previous</span>
              </Link>
            </Button>
          </PaginationItem>
          {totalPage < 10 ? (
            Array.from({ length: totalPage }).map((_, index) => {
              return (
                <PaginationItem key={index}>
                  <Link
                    href={`${pathName}?${createQueryString(
                      "page",
                      (index + 1).toString()
                    )}`}
                    className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                      index === page - 1 ? "border border-gray-200" : ""
                    }`}
                  >
                    {index + 1}
                  </Link>
                </PaginationItem>
              );
            })
          ) : (
            <>
              {page > 2 && (
                <>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString("page", "1")}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center`}
                    >
                      1
                    </Link>
                  </PaginationItem>
                  {page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {page === 1 ? (
                <>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString("page", "1")}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                        page === 1 ? "border border-gray-200" : ""
                      }`}
                    >
                      1
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString("page", "2")}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center `}
                    >
                      2
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString("page", "3")}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center`}
                    >
                      3
                    </Link>
                  </PaginationItem>
                </>
              ) : page < totalPage - 2 ? (
                <>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        (page - 1).toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center`}
                    >
                      {page - 1}
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        page.toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${"border border-gray-200"}`}
                    >
                      {page}
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        (page + 1).toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center`}
                    >
                      {page + 1}
                    </Link>
                  </PaginationItem>
                </>
              ) : (
                <>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        (totalPage - 3).toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                        page === totalPage - 3 ? "border border-gray-200" : ""
                      }`}
                    >
                      {totalPage - 3}
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        (totalPage - 2).toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                        page === totalPage - 2 ? "border border-gray-200" : ""
                      }`}
                    >
                      {totalPage - 2}
                    </Link>
                  </PaginationItem>
                  <PaginationItem>
                    <Link
                      href={`${pathName}?${createQueryString(
                        "page",
                        (totalPage - 1).toString()
                      )}`}
                      className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                        page === totalPage - 1 ? "border border-gray-200" : ""
                      }`}
                    >
                      {totalPage - 1}
                    </Link>
                  </PaginationItem>
                </>
              )}

              {page < totalPage - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <Link
                  href={`${pathName}?${createQueryString(
                    "page",
                    totalPage.toString()
                  )}`}
                  className={`h-9 w-9 hover:bg-muted rounded-md flex items-center justify-center ${
                    page === totalPage ? "border border-gray-200" : ""
                  }`}
                >
                  {totalPage}
                </Link>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <Button
              variant={"ghost"}
              className="p-0"
              disabled={page === totalPage}
            >
              <Link
                href={`${pathName}?${createQueryString(
                  "page",
                  (page + 1).toString()
                )}`}
                aria-label="Go to previous page"
                className={
                  "gap-1 py-2 px-2.5 sm:pr-2.5 rounded-md sm:pl-2.5 flex items-center text-sm hover:bg-muted"
                }
              >
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon size={15} />
              </Link>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return <>{renderPagination()}</>;
};

export default PaginationComponent;
