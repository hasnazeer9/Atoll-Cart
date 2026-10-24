import { getSettings } from "@/lib/settings";
import { getAccount } from "@/lib/customer-auth";
import HeaderClient from "./HeaderClient";

// Server wrapper: the shop name comes from settings, and the account (if the
// visitor is logged in) from their session cookie.
export default async function Header() {
  const account = await getAccount();
  return <HeaderClient shopName={getSettings().name} accountName={account ? account.name.split(" ")[0] : null} />;
}
