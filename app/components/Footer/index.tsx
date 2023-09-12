import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer
        className="wow fadeInUp relative z-10 bg-white bg-opacity-5 pt-16 md:pt-20 lg:pt-24"
        data-wow-delay=".1s"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[600px] lg:mb-16">
                <h2 className="mb-9 text-3xl font-semibold text-secondary dark:text-white text-center">Contact Us</h2>
                <p className="mb-9 text-base font-semibold text-center text-body-color dark:text-white/[0.5]">
                  Have something specific you'd like to discuss? Feel free to shoot us an email at <a className="text-primary">ortho.aigpt@gmail.com</a>. Our team of experts will be sure to respond as promptly as possible
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
