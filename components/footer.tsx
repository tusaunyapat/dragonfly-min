import AuthButton from "./header-auth";
import Contact from "./contact";
import SocialMedia from "./social-media";
export default function Footer() {
  return (
    <footer className="footer bg-neutral text-neutral-content  p-10 z-0">
      <aside>
        <img
          src="https://cyvjegcckjxoaaruifxw.supabase.co/storage/v1/object/public/product-images/product_images/image%201.png"
          className="w-32 h-32"
        />

        <p>
          Dragonfly minimart
          <br />
        </p>
      </aside>
      <nav className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full px-1 lg:px-8 sm:px-16">
        <div className="col-span-1 lg:col-span-2">
          <Contact />
        </div>

        <div className="col-span-1">
          <SocialMedia />
        </div>
        <div className="col-span-1">
          <h6 className="footer-title pt-1">สำหรับแอดมิน</h6>
          <AuthButton />
        </div>
      </nav>
    </footer>
  );
}
