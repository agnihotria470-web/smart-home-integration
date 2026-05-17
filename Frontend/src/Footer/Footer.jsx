import React from 'react';
import logo from '../../public/logo.png';

export const Footer = () => {
  const totalCircles = 5;

  return (
    <footer className="bg-sky-200 text-black font-poppins">
      <div className="container flex justify-between items-center">
        <div className="flex flex-col items-center mx-10 sm:mx-12 md:mx-14 lg:mx-16 xl:mx-16">
          <img className="h-12 w-16 sm:h-16 sm:w-24 md:h-20 md:w-32 lg:h-20 lg:w-40 xl:h-24 xl:w-48 xl:mx-2 xl:my-2" src={logo} alt="Logo" />
          <div className="flex space-x-1 sm:space-x-1 md:space-x-2 lg:space-x-2 xl:space-x-3 mt-1 sm:mt-2 md:mt-3 lg:mt-4  xl:mt-5">
            {Array.from({ length: totalCircles }).map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-8 xl:h-8 rounded-full inline-block transition-colors duration-300 bg-gray-400`}
              ></span>
            ))}
          </div>
        </div>
        <div className="flex ml-2 sm:ml-14 md:ml-16 lg:ml-20 xl:ml-24 mt-4 sm:mt-16 md:mt-12 lg:mt-10 xl:mt-8 space-x-6 sm:space-x-12 md:space-x-16 lg:space-x-24 xl:space-x-32">
        <div>
          <h2
            className=" font-montserrat font-semibold
              text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
              mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-8
              text-black break-words
            "
          >
            Quick<br className='md:hidden'/> Access
          </h2>
          <ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 text-left">
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Home</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">About Us</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Designs</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Contact Us</li>
          </ul>
        </div>
        <div className="">
          <h2
            className="font-montserrat font-semibold
              text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
              mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-8
              text-black
            "
          >
            Designs
          </h2>
          <ul className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 ">
            <li className="flex font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Bedroom</li>
            <li className="flex font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Modular <br className='md:hidden'/> Kitchen</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Living <br className='md:hidden'/> Room</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">Wardrobe</li>
          </ul>
        </div>
        <div className='pr-3'>
        <h2
            className="font-montserrat font-semibold
              text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
              mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-8
              text-black
            "
          >
            Helpline
          </h2>
          <ul className="space-y-1 sm:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 text-left">
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">8791418904</li>
            <li className="font-montserrat text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg leading-[14px]">ayush agnihotri<br className='md:hidden'/>8114@gmail.com</li>
          </ul>
        </div>
        </div>
      </div>
      <div className="container mx-auto mt-12 flex justify-center items-center pb-8">
        <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm text-black font-montserrat">
          Designed by ayush agnihotri, Developed by ayush agnihotri
        </p>
      </div>
    </footer>
  );
};
