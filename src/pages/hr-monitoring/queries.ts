// queries.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { mockMonitoringItems, mockSummary } from "./mock-data";
import { MonitoringQuery } from "./types";

// Hook for fetching monitoring summary data
export const useMonitoringSummary = () => {
  return useQuery({
    queryKey: ["monitoring-summary"],
    queryFn: () => {
      // In a real app, you'd fetch this from the API
      return Promise.resolve(mockSummary);
    },
  });
};

// Hook for fetching monitoring items with pagination
export const useMonitoringItems = (query?: MonitoringQuery) => {
  return useInfiniteQuery({
    queryKey: ["monitoring-items", query],
    queryFn: ({ pageParam = 1 }) => {
      // Filter items based on query params
      let filteredItems = [...mockMonitoringItems];
      
      if (query?.employeeId) {
        filteredItems = filteredItems.filter(
          item => item.employee.id === query.employeeId
        );
      }
      
      if (query?.type && query.type !== "all") {
        filteredItems = filteredItems.filter(
          item => item.type === query.type
        );
      }
      
      // Calculate pagination
      const limit = 10; // Items per page
      const startIndex = (pageParam - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      // Return in the format expected by your DataTable component
      return {
        items: paginatedItems,
        meta: {
          page: pageParam,
          totalItems: filteredItems.length,
          itemCount: paginatedItems.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(filteredItems.length / limit),
          currentPage: pageParam,
          limit,
          total: filteredItems.length
        }
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.currentPage < lastPage.meta?.totalPages) {
        return lastPage.meta?.currentPage + 1;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });
};