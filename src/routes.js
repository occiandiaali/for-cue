import Home from "./pages/Home.svelte";
import About from "./pages/About.svelte";
import Policy from "./pages/Policy.svelte";
import History from "./pages/History.svelte";
import NotFound from "./pages/NotFound.svelte";

export default {
  "/": Home,
  "/about": About,
  "/policy": Policy,
  "/history": History,
  "*": NotFound,
};
