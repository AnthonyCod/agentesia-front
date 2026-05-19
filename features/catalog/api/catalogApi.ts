import { baseApi } from '@/shared/api/baseApi'
import type { Product, CreateProductDto, UpdateProductDto } from '../types/catalog.types'

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/catalog',
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/catalog/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({ url: '/catalog', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string } & UpdateProductDto>({
      query: ({ id, ...body }) => ({ url: `/catalog/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/catalog/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = catalogApi
