import React from 'react';

function Footer() {
  return (
    <footer className="bg-white text-gray-800 p-4 shadow-md py-6 shadow-t ">
      <div className="container mx-auto text-center">
        <h3 className="text-lg font-semibold mb-2">About Us</h3>
        <p className="mb-4">
          Welcome to our Alfamaba Services! We offer a wide range of products and services to suit all your needs. Our mission is to provide
          high-quality products at competitive prices with exceptional customer service. Thank you for choosing us for your
          shopping needs.
        </p>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm">
            Alfamaba.com &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
