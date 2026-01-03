import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeLink() {
  return (
    <Link href="/enclave/directory">
      <Button variant="outline" className="w-full">
        My Enclaves
      </Button>
    </Link>
  );
}
