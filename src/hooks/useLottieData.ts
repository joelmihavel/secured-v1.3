import { useEffect, useState } from "react";

export function useLottieData(url: string) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [url]);

  return data;
}
