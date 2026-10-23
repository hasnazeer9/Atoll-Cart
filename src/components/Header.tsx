import { getSettings } from "@/lib/settings";
import HeaderClient from "./HeaderClient";

// Server wrapper so the shop name always comes from the saved settings.
export default function Header() {
  return <HeaderClient shopName={getSettings().name} />;
}
