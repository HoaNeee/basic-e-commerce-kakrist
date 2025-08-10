/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CardProduct from "@/components/product/CardProduct";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CartModel } from "@/models/cartModel";
import { CategoryModel } from "@/models/categoryModel";
import { ProductModel } from "@/models/productModel";
import { Supplier } from "@/models/supplier";
import { addProduct } from "@/redux/reducer/cartReducer";
import {
  handleToggleFavorite,
  listFavoriteToggle,
  toggleProduct,
} from "@/redux/reducer/favoriteReducer";
import { RootState } from "@/redux/store";
import { createTree } from "@/utils/createTree";
import { fetcher, post } from "@/utils/requets";
import { ChevronDown, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { GrAppsRounded } from "react-icons/gr";
import { LuPlus } from "react-icons/lu";
import { RiListCheck2 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import lodash from "lodash";
import CardSkeleton from "@/components/product/CardSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { VariationModel } from "@/models/variationModel";
import PaginationComponent from "@/components/PaginationComponent";
import useSWR from "swr";

const limit = 15;

interface ProductListProps {
  createQueryString: (name: string, value: string, query?: any) => string;
  deleteQueryString: (name: string, query?: any) => string;
  filter_cats?: string;
  min_price?: string;
  max_price?: string;
  supplier_id?: string;
}

const ProductList = (props: ProductListProps) => {
  const { createQueryString, deleteQueryString } = props;

  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [keyword, setKeyword] = useState("");

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const dispatch = useDispatch();

  const sort = searchParams.get("sort");
  const keySearch = searchParams.get("q");
  const view = searchParams.get("view");
  const next = encodeURIComponent(
    pathName + (searchParams ? `?${searchParams}` : ``)
  );

  const getQuery = useCallback(() => {
    const query = decodeURIComponent(searchParams.toString());
    const api = `${pathName.replace("shop", "products")}?${
      query
        ? query.includes("page")
          ? `${query}&limit=${limit}`
          : `${query}&page=1&limit=${limit}`
        : `page=1&limit=${limit}`
    }`;

    return api;
  }, [searchParams, pathName]);

  useEffect(() => {
    if (sort !== null) {
      setSortBy(sort);
    }
    if (keySearch) {
      setKeyword(keySearch);
    }
  }, [sort, keySearch]);

  const { data, isLoading } = useSWR(getQuery(), fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const handleCart = async (product: ProductModel) => {
    if (!auth.isLogin) {
      window.location.href = `/auth/login?next=${next}`;
      return;
    }

    try {
      const cartItem: CartModel = {
        cart_id: cart.cart_id,
        options: [],
        product_id: product?._id,
        price: Number(product?.price),
        discountedPrice: product?.discountedPrice,
        thumbnail: product?.thumbnail,
        quantity: 1,
        productType: "simple",
        title: product?.title,
        slug: product?.slug,
        SKU: product?.SKU || "",
      };
      const response = await post(
        `/cart/add-product/${cart.cart_id}`,
        cartItem
      );

      dispatch(
        addProduct({
          ...cartItem,
          cartItem_id: response.data.cartItem.cartItem_id,
        })
      );

      toast.success("Add product to cart success", {
        description: "Click to cart to see details!",
        action: {
          label: "Close",
          onClick: () => {},
        },
        duration: 1000,
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const sortKey = (key: string) => {
    switch (key) {
      case "createdAt-desc":
        return "Newest First";
      case "createdAt-asc":
        return "Oldest First";
      case "sortPrice-desc":
        return "Price: High to Low";
      case "sortPrice-asc":
        return "Price: Low to High";
      default:
        return "Sort By";
    }
  };

  const handleFavorite = async (product_id: string) => {
    try {
      if (!auth.isLogin) {
        window.location.href = "/auth/login?next=" + next;
        return;
      }
      dispatch(toggleProduct(product_id));
      const list = listFavoriteToggle(listFavorite, product_id);
      debounceToggleFavorite(list);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const debounceToggleFavorite = React.useRef(
    lodash.debounce((list: string[]) => handleToggleFavorite(list), 1000)
  ).current;

  return (
    <div className="flex-1">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 data-[active=true]:bg-white data-[active=false]:hover:bg-white dark:data-[active=true]:bg-neutral-600 dark:data-[active=true]:text-white/80 data-[active=true]:shadow-sm"
                data-active={!view || view === "grid" ? "true" : "false"}
                onClick={() => {
                  let newQuery: any = createQueryString("view", "grid");
                  if (newQuery.includes("page")) {
                    newQuery = deleteQueryString("page", newQuery);
                  }
                  router.push(`${pathName}?${newQuery}`, {
                    scroll: false,
                  });
                }}
                title="Grid View"
              >
                <GrAppsRounded size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 data-[active=true]:bg-white data-[active=false]:hover:bg-white dark:data-[active=true]:bg-neutral-600 dark:data-[active=true]:text-white/80 data-[active=true]:shadow-sm"
                data-active={view === "list" ? "true" : "false"}
                onClick={() => {
                  let newQuery: any = createQueryString("view", "list");
                  if (newQuery.includes("page")) {
                    newQuery = deleteQueryString("page", newQuery);
                  }
                  router.push(`${pathName}?${newQuery}`, {
                    scroll: false,
                  });
                }}
                title="List View"
              >
                <RiListCheck2 size={16} />
              </Button>
            </div>

            {data?.data?.products?.length > 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-200">
                Showing{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {((Number(searchParams.get("page")) || 1) - 1) * limit + 1}
                </span>{" "}
                -{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.min(
                    (Number(searchParams.get("page")) || 1) * limit,
                    data?.data?.totalRecord
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {data?.data?.totalRecord}
                </span>{" "}
                products
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No products found
              </p>
            )}
          </div>

          <div className="flex lg:items-center gap-3 lg:flex-row flex-col">
            <div className="relative">
              <Input
                placeholder="Search products..."
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    let newQuery: any = createQueryString("q", keyword);
                    if (newQuery.includes("page")) {
                      newQuery = deleteQueryString("page", newQuery);
                    }
                    router.push(`${pathName}?${newQuery}`, {
                      scroll: false,
                    });
                  }
                }}
                className="pr-10 lg:w-64 w-full dark:text-white"
              />
              <FiSearch
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 dark:text-gray-100"
                onClick={() => {
                  let newQuery: any = createQueryString("q", keyword);
                  if (newQuery.includes("page")) {
                    newQuery = deleteQueryString("page", newQuery);
                  }
                  router.push(`${pathName}?${newQuery}`, {
                    scroll: false,
                  });
                }}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:min-w-[140px] w-48 dark:text-white/80"
                >
                  {sortKey(sortBy)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) => {
                    const query = createQueryString("sort", value);
                    router.push(`${pathName}?${query}`, {
                      scroll: false,
                    });
                    setSortBy(value);
                  }}
                >
                  <DropdownMenuRadioItem value="createdAt-desc">
                    Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="createdAt-asc">
                    Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sortPrice-asc">
                    Price: Low to High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sortPrice-desc">
                    Price: High to Low
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <CardSkeleton control key={index} />
          ))}
        </div>
      ) : (
        <div>
          {data?.data?.products?.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {(data?.data?.products || []).map((item: ProductModel) => (
                <CardProduct
                  key={item._id}
                  item={item}
                  control
                  onAddToCart={(item) => {
                    handleCart(item);
                  }}
                  onToggleFavorite={() => {
                    handleFavorite(item._id);
                  }}
                  favorited={listFavorite.includes(item._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293L16 5v2m0 0v.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white/80">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6 dark:text-gray-300">
                  We couldn&apos;t find any products matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push(pathName, { scroll: false })}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => router.push("/")}
                    className="w-full dark:text-white/80"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {data?.data?.totalPage > 0 && (
        <div className="mt-8 flex justify-center">
          <PaginationComponent totalPage={data.data.totalPage} />
        </div>
      )}
    </div>
  );
};

const LayoutShopWithSuspense = ({
  categories,
  suppliers,
  variations,
  maxPrice,
  categories_full,
}: {
  categories: CategoryModel[];
  suppliers: Supplier[];
  variations: VariationModel[];
  maxPrice: number;
  categories_full: CategoryModel[];
}) => {
  const [rangePrice, setRangePrice] = useState<number[]>([0, 0]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const filter_cats = searchParams.get("filter_cats");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const supplier_id = searchParams.get("supplier_id");

  useEffect(() => {
    if (maxPrice) {
      setRangePrice([0, maxPrice]);
    }
  }, [maxPrice]);

  useEffect(() => {
    if (min_price !== null || max_price !== null) {
      setRangePrice([Number(min_price || 0), Number(max_price || 0)]);
    } else {
      setRangePrice([0, maxPrice]);
    }
  }, [min_price, max_price, maxPrice]);

  const createQueryString = useCallback(
    (name: string, value: string, query = searchParams) => {
      const params = new URLSearchParams(query);
      params.set(name, value);
      return decodeURIComponent(params.toString());
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (name: string, query = searchParams) => {
      const params = new URLSearchParams(query);
      params.delete(name);
      return decodeURIComponent(params.toString());
    },
    [searchParams]
  );

  const renderCategoriesFilter = (categories: CategoryModel[]) => {
    const valuesChecked = filter_cats ? filter_cats.split(",") : [];

    return (
      <div className="flex flex-col w-full gap-5 dark:text-white/80">
        {categories.map((item) => (
          <Collapsible
            key={item._id}
            className={`group`}
            defaultOpen={valuesChecked.includes(item._id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <Checkbox
                  checked={valuesChecked.includes(item._id) || false}
                  id={item._id}
                  className="size-4.5"
                  onCheckedChange={(e) => {
                    let values: string[] = [];
                    if (filter_cats) {
                      values = filter_cats.split(",");
                      if (e) {
                        if (!values.includes(item._id)) {
                          values.push(item._id);
                        }
                      } else {
                        if (values.includes(item._id)) {
                          values = values.filter((id) => id !== item._id);
                        }
                      }
                    } else {
                      if (e) {
                        if (!values.includes(item._id)) {
                          values.push(item._id);
                        }
                      } else {
                        if (values.includes(item._id)) {
                          values = values.filter((id) => id !== item._id);
                        }
                      }
                    }

                    let newQuery: any = createQueryString(
                      "filter_cats",
                      values.toString()
                    );

                    if (newQuery.includes("page")) {
                      newQuery = deleteQueryString("page", newQuery);
                    }

                    router.push(`${pathName}?${newQuery}`, { scroll: false });
                  }}
                />
                <Label
                  htmlFor={item._id}
                  className="mt-0.5 font-medium tracking-wider"
                >
                  {item.title}
                </Label>
              </div>

              {item.children && item.children.length > 0 && (
                <CollapsibleTrigger>
                  <LuPlus
                    size={19}
                    className={`cursor-pointer group-data-[state=open]:rotate-135 transition-transform duration-300`}
                  />
                </CollapsibleTrigger>
              )}
            </div>
            {item.children && item.children.length > 0 && (
              <CollapsibleContent className="ml-6 mt-4">
                {renderCategoriesFilter(item.children)}
              </CollapsibleContent>
            )}
          </Collapsible>
        ))}
      </div>
    );
  };

  const renderFilterPrice = () => {
    return (
      <div className="space-y-4 dark:text-white/80">
        <div className="flex justify-between items-center">
          <p>Price: 0 - {maxPrice}</p>
          <Button
            size={"sm"}
            className="px-2 h-6 py-0 text-xs"
            onClick={() => {
              let newQuery: any = deleteQueryString("page");
              newQuery = createQueryString(
                `min_price`,
                rangePrice[0].toString(),
                newQuery
              );
              newQuery = createQueryString(
                `max_price`,
                rangePrice[1].toString(),
                newQuery
              );
              router.push(`${pathName}?${newQuery}`, { scroll: false });
            }}
          >
            Filter
          </Button>
        </div>
        <div className="">
          <Slider
            min={0}
            max={maxPrice}
            value={rangePrice}
            onValueChange={setRangePrice}
          />
          <p className="mt-3 text-muted-foreground text-center">
            {`${rangePrice[0]} - ${rangePrice[1]}`}
          </p>
        </div>
      </div>
    );
  };

  const renderFilterSupplier = () => {
    return (
      <div className="flex flex-col gap-6">
        {suppliers?.map((item) => (
          <div key={item._id} className="flex items-center gap-2">
            <Checkbox
              checked={supplier_id === item._id}
              id={item._id}
              onCheckedChange={(e) => {
                const supplier_id = searchParams.get("supplier_id") || "";
                let newQuery: any;
                if (e) {
                  if (searchParams.toString().includes("page")) {
                    newQuery = deleteQueryString("page");
                  }
                  newQuery = createQueryString(
                    "supplier_id",
                    item._id,
                    newQuery
                  );
                } else {
                  if (supplier_id) {
                    if (searchParams.toString().includes("page")) {
                      newQuery = deleteQueryString("page");
                    }
                    newQuery = createQueryString("supplier_id", "", newQuery);
                  }
                }
                router.push(`${pathName}?${newQuery}`, { scroll: false });
              }}
            />
            <Label htmlFor={item._id} className="dark:text-white/80">
              {item.name}
            </Label>
          </div>
        ))}
      </div>
    );
  };

  const renderVariations = () => {
    return variations.map((item) => {
      return (
        <AccordionItem
          key={item._id}
          value={item._id}
          className="p-0 border-b-1 border-gray-200 dark:text-gray-200 data-[state=closed]:pb-5 data-[state=open]:pb-4"
        >
          <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
            Filter By {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="flex flex-col gap-6">
              {item.options &&
                item.options?.map((option) => {
                  const variation = searchParams.get(item.key) || "";

                  return (
                    <div key={option._id} className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          (variation && option.key === variation) || false
                        }
                        id={option._id}
                        onCheckedChange={(e) => {
                          let newQuery: any;
                          if (e) {
                            if (searchParams.toString().includes("page")) {
                              newQuery = deleteQueryString("page");
                            }
                            newQuery = createQueryString(
                              item.key,
                              option.key,
                              newQuery
                            );
                          } else {
                            if (variation) {
                              if (searchParams.toString().includes("page")) {
                                newQuery = deleteQueryString("page");
                              }
                              newQuery = createQueryString(
                                item.key,
                                "",
                                newQuery
                              );
                            }
                          }
                          router.push(`${pathName}?${newQuery}`, {
                            scroll: false,
                          });
                        }}
                      />
                      <Label htmlFor={option._id}>{option.title}</Label>
                    </div>
                  );
                })}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    });
  };

  const renderFilterTags = () => {
    const exist_variations = variations.some((item) => {
      return searchParams.get(item.key);
    });

    if (
      !filter_cats &&
      !min_price &&
      !max_price &&
      !supplier_id &&
      !exist_variations
    ) {
      return null;
    }

    const supplier = suppliers.find((sup) => sup._id === supplier_id);

    return (
      <div className="p-4 bg-white dark:bg-neutral-800 rounded shadow mb-4 text-sm">
        <p className="mb-2 font-semibold">Filter Tags</p>
        <div className="flex flex-col gap-2 flex-wrap">
          {filter_cats && (
            <div className="flex items-center gap-2 flex-wrap">
              <p>Categories: </p>
              {filter_cats.split(",").map((item) => {
                const cat = categories_full.find((cat) => cat._id === item);

                return (
                  <div
                    key={item}
                    className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm capitalize flex items-center gap-2 "
                  >
                    {cat?.title}
                    <X
                      className="w-4 h-4 text-gray-500 dark:text-white/80 cursor-pointer"
                      onClick={() => {
                        let newQuery: any = createQueryString(
                          "filter_cats",
                          filter_cats
                            .split(",")
                            .filter((id) => id !== item)
                            .join(",")
                        );

                        if (newQuery.includes("page")) {
                          newQuery = deleteQueryString("page", newQuery);
                        }

                        router.push(`${pathName}?${newQuery}`, {
                          scroll: false,
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {supplier_id && (
            <div className="flex items-center gap-2">
              <p>Supplier: </p>
              <div
                key={supplier_id}
                className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm capitalize flex items-center gap-2"
              >
                {supplier?.name}
                <X
                  className="w-4 h-4 text-gray-500 dark:text-white/80 cursor-pointer"
                  onClick={() => {
                    let newQuery: any = deleteQueryString("page");
                    newQuery = deleteQueryString("supplier_id", newQuery);
                    router.push(`${pathName}?${newQuery}`, { scroll: false });
                  }}
                />
              </div>
            </div>
          )}
          {(min_price || max_price) && (
            <div className="flex items-center gap-2">
              <p>Price Range: </p>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center gap-2">
                {min_price || 0} - {max_price || 0}
                <X
                  className="w-4 h-4 text-gray-500 dark:text-white/80 cursor-pointer"
                  onClick={() => {
                    let newQuery: any = deleteQueryString("page");
                    newQuery = deleteQueryString("min_price", newQuery);
                    newQuery = deleteQueryString("max_price", newQuery);
                    router.push(`${pathName}?${newQuery}`, { scroll: false });
                  }}
                />
              </div>
            </div>
          )}
          {variations.map((item) => {
            if (searchParams.get(item.key)) {
              return (
                <div className="flex items-center gap-2" key={item.key}>
                  <p>{item.title}: </p>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center gap-2 capitalize">
                    {searchParams.get(item.key)}
                    <X
                      className="w-4 h-4 text-gray-500 dark:text-white/80 cursor-pointer"
                      onClick={() => {
                        let newQuery: any = deleteQueryString("page");
                        newQuery = deleteQueryString(item.key, newQuery);
                        router.push(`${pathName}?${newQuery}`, {
                          scroll: false,
                        });
                      }}
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="mt-4">
          {(filter_cats || max_price || min_price || supplier_id) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(pathName, { scroll: false });
              }}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Clear All Filter
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-black/90">
      <div className="container w-full xl:px-4 py-8 mx-auto px-2 md:px-0">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={"/"}>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {renderFilterTags()}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4 w-full md:relative sticky top-25 md:top-0 z-30 md:z-auto">
            <Collapsible
              defaultOpen={window?.innerWidth < 768 ? false : true}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm md:sticky md:top-30 py-4 px-1 lg:data-[state=open]:pb-10 group/collapsible"
            >
              <CollapsibleTrigger asChild className="pl-5 pr-4">
                <div className="flex items-center justify-between group-data-[state=open]/collapsible:mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-300">
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 rounded-full w-6 h-6"
                    style={{ padding: 0 }}
                  >
                    <Plus className="w-4 h-4 group-data-[state=open]/collapsible:rotate-135 text-gray-500 dark:text-white/80 transition-transform duration-300" />
                  </Button>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="max-h-120 overflow-hidden overflow-y-auto custom-scrollbar">
                <Accordion
                  type="multiple"
                  className="w-full space-y-3 overflow-y-auto px-5"
                  defaultValue={[]}
                >
                  <AccordionItem
                    value="categories"
                    className="p-0 border-b border-gray-200 data-[state=closed]:pb-4 data-[state=open]:pb-4"
                  >
                    <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-semibold text-gray-900 dark:text-gray-200">
                      Product Categories
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      {renderCategoriesFilter(categories)}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="price"
                    className="p-0 border-b border-gray-200 data-[state=closed]:pb-4 data-[state=open]:pb-4"
                  >
                    <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-semibold text-gray-900 dark:text-gray-200">
                      Price Range
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      {renderFilterPrice()}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="supplier"
                    className="p-0 border-b border-gray-200 data-[state=closed]:pb-4 data-[state=open]:pb-4"
                  >
                    <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-semibold text-gray-900 dark:text-gray-200">
                      Suppliers
                    </AccordionTrigger>
                    <AccordionContent className="mt-4">
                      {renderFilterSupplier()}
                    </AccordionContent>
                  </AccordionItem>
                  {renderVariations()}
                </Accordion>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <ProductList
            createQueryString={createQueryString}
            deleteQueryString={deleteQueryString}
            filter_cats={filter_cats || ""}
            min_price={min_price || ""}
            max_price={max_price || ""}
            supplier_id={supplier_id || ""}
          />
        </div>
      </div>
    </section>
  );
};

const Shop = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  const optionsSWR = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  };

  const { data: categoryResponse, isLoading: isLoadingCategories } = useSWR(
    "/categories",
    fetcher,
    optionsSWR
  );
  const { data: priceResponse, isLoading: isLoadingPrice } = useSWR(
    "/products/get-price",
    fetcher,
    optionsSWR
  );
  const { data: supplierResponse, isLoading: isLoadingSuppliers } = useSWR(
    "/suppliers",
    fetcher,
    optionsSWR
  );
  const { data: variationResponse, isLoading: isLoadingVariations } = useSWR(
    "/products/variations",
    fetcher,
    optionsSWR
  );

  useEffect(() => {
    if (categoryResponse && categoryResponse.code === 200) {
      setCategories(createTree(categoryResponse.data, "", "_id"));
    }
  }, [categoryResponse]);

  const renderSkeleton = () => {
    return (
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <div className="flex my-13">
          <div className="md:w-1/5 md:block hidden px-6"></div>
          <div className="flex-1">
            <div className="mt-6">
              <div className="grid lg:grid-cols-3 grid-cols-2 w-full gap-8">
                {Array.from({ length: limit }).map((_, index) => (
                  <CardSkeleton control key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (
    isLoadingCategories ||
    isLoadingPrice ||
    isLoadingSuppliers ||
    isLoadingVariations
  ) {
    return renderSkeleton();
  }

  return (
    <Suspense fallback={renderSkeleton()}>
      <LayoutShopWithSuspense
        categories={categories}
        suppliers={supplierResponse?.data?.suppliers || []}
        variations={variationResponse?.data?.variations || []}
        maxPrice={priceResponse?.data?.max || Infinity}
        categories_full={categoryResponse?.data || []}
      />
    </Suspense>
  );
};

export default Shop;
