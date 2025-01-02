import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
              Matrix Mingle
            </h3>
            <p className="text-gray-400">
              Your personal AI companion in the digital realm.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Product</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Features</li>
              <li className="text-gray-400">Pricing</li>
              <li className="text-gray-400">About</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Membership</h4>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <a
                href="https://www.patreon.com/c/matrixmingle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500"
              >
                Support us on Patreon
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-500/20">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Matrix Mingle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
