import Sliders from './components/Sliders';
import './carouselStyles.css';

export default function Carousel() {
    return (
        <div className="carousel">
            <div className="carousel-container">
                <Sliders />
            </div>
        </div>
    );
}