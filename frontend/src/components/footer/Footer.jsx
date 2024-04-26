const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <h5 className="mb-4 text-center text-sm font-medium text-gray-600 sm:!mb-0 md:text-lg">
        <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} e2e Pulser All Rights Reserved.
        </p>
      </h5>
      {/* <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="blank"
              href="https://ih1.redbubble.net/image.1929991272.4340/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Support
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://ih1.redbubble.net/image.1929991272.4340/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              License
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://ih1.redbubble.net/image.1929991272.4340/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Terms of Use
            </a>
          </li>
          <li>
            <a
              target="blank"
              href="https://ih1.redbubble.net/image.1929991272.4340/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Blog
            </a>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default Footer;
