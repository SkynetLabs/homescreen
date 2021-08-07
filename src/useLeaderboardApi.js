import { useSWRInfinite } from "swr";
import ky from "ky";

const api = process.env.REACT_APP_API_URL || "https://dev1.siasky.dev/leaderboard";
export const pageSize = 20;
const createQueryString = (attributes) => {
  return attributes.reduce((acc, [key, value = null]) => {
    if (value === null) return acc;
    return [acc, `${key}=${value}`].filter(Boolean).join("&");
  }, "");
};

const fetcher = (url, transform = (data) => data) => ky(url).json().then(transform);
const getKey =
  (endpoint, { search, searchKey, sortBy, sortDir }) =>
  (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end

    const queryString = createQueryString([
      ["skip", pageIndex * pageSize],
      ["limit", pageSize],
      ["sortBy", sortBy],
      ["sortDir", sortDir],
      [searchKey, search],
    ]);

    return `${api}/${endpoint}?${queryString}`;
  };

export default function useLeaderboardApi(endpoint, { transform, search, searchKey, sortBy, sortDir }) {
  return useSWRInfinite(getKey(endpoint, { search, searchKey, sortBy, sortDir }), (url) => fetcher(url, transform));
}
