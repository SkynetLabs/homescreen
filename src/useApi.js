import useSWR from "swr";

const api = process.env.REACT_APP_API_URL || "https://dev1.siasky.dev/leaderboard";

export default function useApi(path, options) {
  return useSWR(`${api}${path}`);
}
