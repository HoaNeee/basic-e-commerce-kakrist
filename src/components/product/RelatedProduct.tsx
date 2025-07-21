/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import HeadContent from "../HeadContent";
import CardProduct from "./CardProduct";
import { ProductModel } from "@/models/productModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  handleToggleFavorite,
  listFavoriteToggle,
  toggleProduct,
} from "@/redux/reducer/favoriteReducer";
import lodash from "lodash";
import { toast } from "sonner";
import { get } from "@/utils/requets";
import CardSkeleton from "./CardSkeleton";

interface Props {
  product?: ProductModel;
}

const RelatedProduct = (props: Props) => {
  const { product } = props;

  const [relatedProducts, setRelatedProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const listFavorite = useSelector((state: RootState) => state.favorite.list);
  const auth = useSelector((state: RootState) => state.auth.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (product) {
      getRelatedProducts(product);
    }
  }, [product]);

  const getRelatedProducts = async (product: ProductModel) => {
    try {
      setIsLoading(true);
      const response = await get(
        `/products/related?product_id=${product?._id}`
      );
      setRelatedProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async (product_id: string) => {
    try {
      if (!auth.isLogin) {
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
    lodash.debounce((list: string[]) => handleToggleFavorite(list), 500)
  ).current;

  return (
    <div className="w-full h-full">
      <HeadContent title="Related Products" left={<></>} />
      <div className="flex flex-wrap gap-6 w-full">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        {!isLoading &&
          relatedProducts &&
          relatedProducts.map((item) => (
            <CardProduct
              key={item._id}
              item={item}
              favorited={listFavorite.includes(item._id)}
              onToggleFavorite={() => handleFavorite(item._id)}
            />
          ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
