import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import API from '../api/axiosInstance';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      isLoaded: false,
      loading: false,
      sortOption: 'popular', // 초기 정렬(인기순)
      selectedCategory: 0, // 선택된 카테고리

      // 상품 목록 로드 및 정렬
      loadProducts: async () => {
        if (get().isLoaded) return;

        set({ loading: true });

        try {
          const response = await API.get('/products');

          const productsWithImages = await Promise.all(
            response.data.data.map(async (product) => {
              try {
                const storageRef = ref(storage, product.image);
                const imageUrl = await getDownloadURL(storageRef);
                return {
                  ...product,
                  image: imageUrl,
                };
              } catch (error) {
                console.error('상품 이미지 로드 실패:', error);
                return product;
              }
            })
          );

          const sortedProducts = get().sortProducts(productsWithImages, get().sortOption);
          set({
            products: sortedProducts,
            isLoaded: true,
          });
        } catch (error) {
          console.error('상품 목록 조회 실패:', error);
        } finally {
          set({ loading: false });
        }
      },

      // 선택된 카테고리 설정
      setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
      },

      // 정렬 함수
      sortProducts: (products, option) => {
        const sortedProducts = [...products];

        if (option === 'latest') {
          sortedProducts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        } else if (option === 'popular') {
          sortedProducts.sort((a, b) => b.sales - a.sales);
        } else if (option === 'high-price') {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else {
          sortedProducts.sort((a, b) => a.price - b.price);
        }

        return sortedProducts;
      },

      // 정렬 옵션 설정
      setSortOption: (option) => {
        const sortedProducts = get().sortProducts(get().products, option);

        set({
          products: sortedProducts,
          sortOption: option,
        });
      },

      resetProduct: () => {
        set({
          products: [],
          sortOption: 'latest',
          isLoaded: false,
        });
      },
    }),
    {
      name: 'product',
      storage: createJSONStorage(() => sessionStorage),
      // getStorage: () => sessionStorage,
    }
  )
);
