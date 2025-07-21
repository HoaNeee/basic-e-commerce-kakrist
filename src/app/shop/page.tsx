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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
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
import { get, post } from "@/utils/requets";
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { GrAppsRounded } from "react-icons/gr";
import { LuPlus } from "react-icons/lu";
import { RiListCheck2 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import lodash from "lodash";
import CardSkeleton from "@/components/product/CardSkeleton";

const Shop = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [limit] = useState(15);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [rangePrice, setRangePrice] = useState<number[]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [suppliers, setSuppliers] = useState<Supplier[]>();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const auth = useSelector((state: RootState) => state.auth.auth);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const dispatch = useDispatch();

  const filter_cats = searchParams.get("filter_cats");
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const sort = searchParams.get("sort");
  const supplier_id = searchParams.get("supplier_id");

  useEffect(() => {
    getCategories();
    getPrice();
    getSupplier();
  }, []);

  useEffect(() => {
    getProducts();
    if (min_price !== null || max_price !== null) {
      setRangePrice([Number(min_price || 0), Number(max_price || 0)]);
    } else {
      setRangePrice([0, maxPrice]);
    }

    if (sort !== null) {
      setSortBy(sort);
    }
  }, [searchParams]);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const query = decodeURIComponent(searchParams.toString());
      const api = `${pathName.replace("shop", "products")}?${
        query
          ? query.includes("page")
            ? `${query}&limit=${limit}`
            : `${query}&page=1&limit=${limit}`
          : `page=1&limit=${limit}`
      }`;

      console.log(api);

      // const response = await get(
      //   `/products?filter_cats=${filter_cats || ""}&page=1&limit=${limit}`
      // );
      const response = await get(api);

      setProducts(response.data.products);
      setTotalPage(response.data.totalPage);
      setTotalRecord(response.data.totalRecord);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await get("/categories");
      const data = createTree(response.data, "", "_id");
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPrice = async () => {
    try {
      const response = await get("/products/get-price");
      setMaxPrice(response.data.max);
      if (max_price === null && min_price == null) {
        setRangePrice([0, response.data.max]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSupplier = async () => {
    try {
      const response = await get("/suppliers");
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.log(error);
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string, query = searchParams) => {
      const params = new URLSearchParams(query);
      params.set(name, value);
      return decodeURIComponent(params.toString());
    },
    [searchParams]
  );

  const deleteQueryString = (name: string, query = searchParams) => {
    const params = new URLSearchParams(query);
    params.delete(name);
    return decodeURIComponent(params.toString());
  };

  const renderPagination = () => {
    const page = Number(searchParams.get("page")) || 1;
    return (
      <Pagination className="justify-end">
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

  const renderCategoriesFilter = (categories: CategoryModel[]) => {
    const valuesChecked = filter_cats ? filter_cats.split(",") : [];

    return (
      <div className="flex flex-col w-full gap-5">
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
                      newQuery = deleteQueryString("page");
                    }

                    router.push(`${pathName}?${newQuery}`);
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p>Price: 0 - {maxPrice}</p>
          <Button
            size={"sm"}
            className="px-2 h-6 py-0 text-xs"
            onClick={() => {
              // router.push(`${pathName}?`)
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
              router.push(`${pathName}?${newQuery}`);
            }}
            // disabled={rangePrice[0] === 0 && rangePrice[1] === 0}
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
                router.push(`${pathName}?${newQuery}`);
              }}
            />
            <Label htmlFor={item._id}>{item.name}</Label>
          </div>
        ))}
      </div>
    );
  };

  const handleCart = async (product: ProductModel) => {
    if (!auth.isLogin) {
      const next = encodeURIComponent(
        pathName + (searchParams ? `?${searchParams}` : ``)
      );

      router.push(`/auth/login?next=${next}`);
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
        return "latest";
      case "createdAt-asc":
        return "oldest";
      case "price-desc":
        return "highest price";
      case "price-asc":
        return "lowest price";

      default:
        return "";
    }
  };

  const handleFavorite = async (product_id: string) => {
    try {
      if (!auth.isLogin) {
        const next = encodeURIComponent(`${pathName}?${searchParams}`);

        router.push("/auth/login?next=" + next);

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
    <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
      <div className="flex">
        <div className="w-1/5 px-6">
          <Accordion
            type="multiple"
            className="w-full space-y-3"
            defaultValue={["item-1"]}
          >
            <AccordionItem
              value="item-1"
              className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
            >
              <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold">
                Products Categories
              </AccordionTrigger>
              <AccordionContent className="mt-4 ">
                {renderCategoriesFilter(categories)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
            >
              <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
                Filter By Price
              </AccordionTrigger>
              <AccordionContent className="mt-4">
                {renderFilterPrice()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
            >
              <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
                Supplier
              </AccordionTrigger>
              <AccordionContent className="mt-4">
                {renderFilterSupplier()}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
            >
              <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
                Filter By Color
              </AccordionTrigger>
              <AccordionContent className="mt-4">Color</AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
            >
              <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
                Filter By Size
              </AccordionTrigger>
              <AccordionContent className="mt-4">Size</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-1">
          <div className="flex tracking-wider text-sm justify-between items-center">
            <div className="flex items-center gap-3">
              <GrAppsRounded size={21} />
              <RiListCheck2 size={21} />
              {products.length > 0 ? (
                <div className="flex items-center gap-2">
                  <p>
                    Showing{" "}
                    {((Number(searchParams.get("page")) || 1) - 1) * limit + 1}{" "}
                    -{" "}
                    {Math.min(
                      (Number(searchParams.get("page")) || 1) * limit,
                      totalRecord
                    )}{" "}
                    of {totalRecord} results
                  </p>
                </div>
              ) : (
                <p>Showing 0-0 of 0 results</p>
              )}
              {searchParams.toString() &&
                !searchParams.toString().includes("page") && (
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="h-6 px-2"
                    onClick={() => {
                      router.push(pathName);
                    }}
                  >
                    Clear filter
                  </Button>
                )}
            </div>

            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"}>
                    Sort by {sortKey(sortBy)}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-48 absolute top-0 -right-15">
                  <DropdownMenuLabel className="flex items-center justify-between gap-2">
                    Lists
                    <Button size="icon" variant="ghost" className="h-5 w-5">
                      <X />
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(value) => {
                      const query = createQueryString("sort", value);
                      router.push(`${pathName}?${query}`);
                      setSortBy(value);
                    }}
                  >
                    <DropdownMenuRadioItem value="createdAt-desc">
                      Sort by latest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="createdAt-asc">
                      Sort by oldest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-asc">
                      Sort by lowest price
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-desc">
                      Sort by highest price
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {isLoading ? (
            <div className="mt-4">
              <div className="grid lg:grid-cols-3 grid-cols-2 w-full gap-8">
                {Array.from({ length: 15 }).map((_, index) => (
                  <CardSkeleton control key={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              {products.length > 0 ? (
                <div className="grid lg:grid-cols-3 grid-cols-2 w-full gap-8">
                  {products.map((item) => (
                    <CardProduct
                      key={item._id}
                      item={item}
                      control
                      onAddToCart={(item) => {
                        handleCart(item);
                      }}
                      onToggleFavorite={() => handleFavorite(item._id)}
                      favorited={listFavorite.includes(item._id)}
                    />
                  ))}
                </div>
              ) : (
                <div>No data</div>
              )}
            </div>
          )}
          {totalPage > 0 && (
            <div className="w-full mt-6">{renderPagination()}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Shop;
