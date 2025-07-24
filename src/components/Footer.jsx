"use client";

export default function Footer() {
  return (
    <footer
      className="footer footer-center p-4 mt-4 bg-base-100 text-base-content"
      data-theme="light"
    >
      <div>
        <p>© {new Date().getFullYear()} InvoSync. All rights reserved.</p>
      </div>
    </footer>
  );
}
