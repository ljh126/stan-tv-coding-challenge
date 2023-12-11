// import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import Home from '../pages/Home';
import { CarouselProvider } from '../carousel/providers/CarouselProvider';
import Carousel from '../carousel';
import Sliders from '../carousel/components/Sliders';

it('if component match Snapshot', () => {
    const component = renderer.create(
        <CarouselProvider>
            <Home />
        </CarouselProvider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

it('if Sliders loaded properly', () => {
    const component = renderer.create(
        <CarouselProvider>
            <Home />
        </CarouselProvider>
    );

    const testInstance = component.root;
    expect(testInstance.findByType(Sliders).children.length).toEqual(1);
});

