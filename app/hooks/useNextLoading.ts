import { Router } from "next/router";
import { useEffect, useState } from "react"

export function useNextLoading() {
    const state = useState(false)
    const setLoading = state[1];
    useEffect(() => {
      const start = () => {
        setLoading(true);
      };
      const end = () => {
        setLoading(false);
      };
      Router.events.on("routeChangeStart", start);
      Router.events.on("routeChangeComplete", end);
      Router.events.on("routeChangeError", end);
      return () => {
        Router.events.off("routeChangeStart", start);
        Router.events.off("routeChangeComplete", end);
        Router.events.off("routeChangeError", end);
      };
    }, []);
    return state
}