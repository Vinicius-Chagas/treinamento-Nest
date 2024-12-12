import {
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export async function paginateData<T extends ObjectLiteral>(
  page: number,
  limit: number,
  queryBuilder: SelectQueryBuilder<T>,
  isCsv = false,
): Promise<Pagination<T>> {
  if (isCsv) {
    const data = await queryBuilder.getMany()

    return {
      items: data,
      meta: {
        currentPage: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: data.length,
        totalPages: 0,
      },
    }
  }

  const totalItems = await queryBuilder.getCount();

  const paginationResult = await paginate(queryBuilder, {
    page,
    limit,
    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
  })

  paginationResult.meta.totalItems = totalItems;
  paginationResult.meta.totalPages = Math.ceil(totalItems / limit);

  return paginationResult;
}
