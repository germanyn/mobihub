import { Router } from "next/router";
import { useEffect, useState } from "react"

export function useNextLoading() {
    const state = useState(false)
    useEffect(() => {
      const start = () => {
        console.log("start");
        state[1](true);
      };
      const end = () => {
        console.log("findished");
        state[1](false);
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