
import Image from './Image';
import { useCarouselApi, useCarouselSliders } from "../providers/CarouselProvider";
import { Suspense, useEffect, useRef } from 'react';
import { CAROUSEL_SLIDES_PER_PAGE } from '../Constants';

export default function Sliders() {
    const { sliders, pointTo, distance } = useCarouselSliders();
    const { onNextSlider, onPreSlider } = useCarouselApi();

    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const keyPressListener = (event: KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === 'ArrowRight') {
                onNextSlider();
            }
            if (event.key === 'ArrowLeft') {
                onPreSlider();
            }
        };
        window.addEventListener('keyup', keyPressListener);
        return () => { window.removeEventListener('keyup', keyPressListener); }
    }, []);

    useEffect(() => {
        if (!isNaN(distance) && sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${distance}px)`;
        }
    }, [distance]);

    return (
        <Suspense fallback={<SliderSkeleton />}>
            <div className="carousel-sliders" ref={sliderRef}>
                {sliders.length > 0 && sliders.map((slider, index) => {
                    return <Image image={slider.image} id={slider.id}
                        key={slider.id} active={pointTo === index} />;
                })}
            </div>
        </Suspense>
    )
}

function SliderSkeleton() {
    return (
        <>
            {[...Array(CAROUSEL_SLIDES_PER_PAGE)].map((skeleton, index) => {
                return <div className="slider-skeleton"></div>;
            })}
        </>
    );
}