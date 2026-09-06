import { applicationProduct } from "@/content/application";

export function LogoLockup() {
  return (
    <span className="text-lg font-black tracking-tight uppercase">
      {applicationProduct.name}
    </span>
  );
}
