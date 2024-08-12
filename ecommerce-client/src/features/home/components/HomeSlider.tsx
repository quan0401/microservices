import { FC, ReactElement, useEffect, useState } from 'react';
import { ISliderState } from '../interfaces/home.interface';
import { sliderImages, sliderImagesText } from '~shared/utils/static-data';
import { ISliderImagesText } from '~shared/shared.interface';

const HomeSlider: FC = (): ReactElement => {
  const [slideState, setSlideState] = useState<ISliderState>({
    slideShow: sliderImages[0],
    slideIndex: 0
  });
  // const [sliderInterval, setSliderInterval] = useState<NodeJS.Timeout>();
  const [currentSliderImageText, setCurrentSliderImageText] = useState<ISliderImagesText>(sliderImagesText[0]);
  const { slideIndex, slideShow } = slideState;
  let currentSlideIndex = 0;

  const autoMoveSlide = (): void => {
    const nextIndex = currentSlideIndex + 1;
    currentSlideIndex = nextIndex >= sliderImages.length ? 0 : nextIndex;
    setCurrentSliderImageText(sliderImagesText[currentSlideIndex]);
    setSlideState((prev: ISliderState) => ({
      ...prev,
      slideIndex: currentSlideIndex,
      slideShow: sliderImages[currentSlideIndex]
    }));
  };

  useEffect(() => {
    const timeInterval: NodeJS.Timeout = setInterval(() => {
      autoMoveSlide();
    }, 4000);

    // setSliderInterval(timeInterval);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="flex gap-x-8">
      <div className="relative h-96 w-full overflow-hidden bg-red-50">
        <img alt="slider" className="absolute h-96 w-full object-cover transition" src={slideShow} />
        <div className="absolute px-6 py-4">
          <h2 className="text-3xl font-bold">Header</h2>
          <h4 className="pt-1 font-bold">Subheader</h4>
        </div>
        <div className="absolute bottom-0 flex gap-3 px-6 py-4">
          {sliderImages.map((_, index: number) => (
            <div key={index} className={`h-2 w-2 rounded-full ${slideIndex === index ? `bg-sky-500` : 'bg-gray-300'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
