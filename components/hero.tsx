export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center w-full">
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://cyvjegcckjxoaaruifxw.supabase.co/storage/v1/object/public/product-images/product_images/Frame%2018.png)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-white text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">ยินดีต้อนรับ</h1>
            <p className="mb-5">สู่ร้านค้าของเรา</p>
            <a href="#products" className="btn btn-primary smooth-scroll">
              ค้นหาสินค้า
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
