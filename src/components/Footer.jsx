import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-400">
          By <span className="text-white font-semibold">Jawed</span> 2025 -{' '}
          <a 
            href="https://jawed.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Jawed.fr
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
