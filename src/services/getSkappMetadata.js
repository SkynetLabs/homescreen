import ky from "ky";

export default async function getSkappMetadata(url) {
  try {
    const { data } = await ky(`https://api.microlink.io/?url=${encodeURIComponent(url)}`).json();

    return data;
  } catch (error) {
    return null;
  }
}
