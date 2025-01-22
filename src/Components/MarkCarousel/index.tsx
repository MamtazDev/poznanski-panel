import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "keen-slider/keen-slider.min.css";
import { apiGetReq } from "../../Constant/api-functions";
import { fileUrl } from "../../Constant/config";
import { compare, lcm } from "../../Constant/helpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface PartnerLogo {
  id: string;
  name: string;
  img1: string;
  img2: string;
}

interface InputLogo {
  _id: string;
  name: string;
  img1: string;
  img2: string;
}

const MarkCarousel = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [logoNum, setLogoNum] = useState<number>(7);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000, // Adjust speed as needed
    slidesToShow: logoNum, // Display 7 slides per page
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Change slide every 3 seconds
    pauseOnHover: false,
  };

  useEffect(() => {
    apiGetReq("/logo", {})
      .then((res) => {
        let newData: PartnerLogo[] = [];
        res.logos.map((item: InputLogo) => {
          const temp: PartnerLogo = {
            id: item._id,
            name: item.name,
            img1: fileUrl + item.img1,
            img2: fileUrl + item.img2,
          };
          newData.push(temp);
        });
        setLogos(newData);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1350) {
        setLogoNum(5);
        if (window.innerWidth < 1050) {
          setLogoNum(4);
        }
        if (window.innerWidth < 768) {
          setLogoNum(7);
        }
        if (window.innerWidth < 570) {
          setLogoNum(6);
        }
        if (window.innerWidth < 400) {
          setLogoNum(4);
        }
      } else {
        setLogoNum(7);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="md:mt-36 mt-20 md:pt-1.5">
      {themeMode ? (
        <Slider {...settings}>
          {logos?.length &&
            [...Array(lcm(logos.length, 7))].map((_, idx) => (
              <div key={`logo-light-${idx}`}>
                <img
                  src={logos[idx % logos.length].img1}
                  alt={logos[idx % logos.length].name}
                  className="md:w-40 md:h-40 w-16 h-16"
                />
              </div>
            ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {logos?.length &&
            [...Array(lcm(logos.length, 7))].map((_, idx) => (
              <div key={`logo-dark-${idx}`}>
                <div className="flex justify-center items-center ">
                  <img
                    src={logos[idx % logos.length].img2}
                    alt={logos[idx % logos.length].name}
                    className="md:w-40 md:h-40 w-16 h-16"
                  />
                </div>
              </div>
            ))}
        </Slider>
      )}
    </div>
  );
};

export default MarkCarousel;
