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
import { get, post } from "@/utils/requets";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
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

const Shop = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);

  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [rangePrice, setRangePrice] = useState<number[]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [suppliers, setSuppliers] = useState<Supplier[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [variations, setVariations] = useState<VariationModel[]>([]);
  const [loaded, setLoaded] = useState(false);

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
  const keySearch = searchParams.get("q");
  const limit = 15;

  useEffect(() => {
    getCategories();
    getPrice();
    getSupplier();
    getVariationOptions();
    setLoaded(true);
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
    if (keySearch) {
      setKeyword(keySearch);
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

  const getVariationOptions = async () => {
    try {
      const response = await get("/products/variations");
      setVariations(response.data.variations);
    } catch (error) {
      console.log(error);
    }
  };

  const createQueryString = (
    name: string,
    value: string,
    query = searchParams
  ) => {
    const params = new URLSearchParams(query);
    params.set(name, value);
    return decodeURIComponent(params.toString());
  };

  const deleteQueryString = (name: string, query = searchParams) => {
    const params = new URLSearchParams(query);
    params.delete(name);
    return decodeURIComponent(params.toString());
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
                      newQuery = deleteQueryString("page", newQuery);
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

  const renderVariations = () => {
    return variations.map((item) => {
      return (
        <AccordionItem
          key={item._id}
          value={item._id}
          className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
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
                          router.push(`${pathName}?${newQuery}`);
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

  const renderSkeleton = () => {
    return (
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <div className="flex my-13">
          <div className="w-1/5 px-6"></div>
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

  if (!loaded) {
    return renderSkeleton();
  }

  return (
    <Suspense fallback={renderSkeleton()}>
      <section className="container w-full xl:px-4 py-10 mx-auto px-2 md:px-0">
        <div className="mb-9 flex items-center justify-between px-7">
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
        <div className="flex">
          <div className="w-1/5 px-6 dark:text-white/80">
            <Accordion
              type="multiple"
              className="w-full space-y-3"
              // defaultValue={["item-1"]}
            >
              <AccordionItem
                value="categories"
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
                value="price"
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
                value="supllier"
                className="p-0 border-b-2 border-muted data-[state=closed]:pb-5 data-[state=open]:pb-4"
              >
                <AccordionTrigger className="text-base p-0 items-center hover:no-underline font-bold mt-1">
                  Supplier
                </AccordionTrigger>
                <AccordionContent className="mt-4">
                  {renderFilterSupplier()}
                </AccordionContent>
              </AccordionItem>
              {renderVariations()}
            </Accordion>
          </div>
          <div className="flex-1">
            <div className="flex tracking-wider text-sm justify-between items-center dark:text-white/80">
              <div className="flex items-center gap-3">
                <GrAppsRounded size={21} />
                <RiListCheck2 size={21} />
                {products.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <p>
                      Showing{" "}
                      {((Number(searchParams.get("page")) || 1) - 1) * limit +
                        1}{" "}
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

              <div className="relative flex gap-2 items-center">
                <div className="transition-all duration-300 relative">
                  <Input
                    placeholder="Enter keyword..."
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        let newQuery: any = createQueryString("q", keyword);
                        if (newQuery.includes("page")) {
                          newQuery = deleteQueryString("page", newQuery);
                        }
                        router.push(`${pathName}?${newQuery}`);
                      }
                    }}
                    name="key-search"
                    className="pr-10"
                  />
                  <FiSearch
                    size={20}
                    cursor={"pointer"}
                    onClick={() => {
                      let newQuery: any = createQueryString("q", keyword);
                      if (newQuery.includes("page")) {
                        newQuery = deleteQueryString("page", newQuery);
                      }
                      router.push(`${pathName}?${newQuery}`);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    title="Search"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild title="Sort result">
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
              <div className="w-full mt-6">
                <PaginationComponent totalPage={totalPage} />
              </div>
            )}
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Shop;
