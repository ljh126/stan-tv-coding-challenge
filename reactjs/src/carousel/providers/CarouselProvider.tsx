import { createContext, useContext, useReducer, useMemo, ReactNode, useEffect } from "react";
import { CAROUSEL_SLIDES_PER_PAGE, CAROUSEL_SLIDER_GAP, getSilderWidth, isMobile } from "../Constants";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../../pages/Error";

type ApiType = {
    onNextSlider: () => void,
    onPreSlider: () => void,
    onSearch: (id: string) => void
}
type Program = {
    id: number,
    title: string,
    description: string,
    type: string,
    image: string,
    rating: string,
    genre: string,
    year: number,
    language: string
}

type State = {
    pointTo: number,
    sliders: Array<Program>,
    distance: number,
    program: Program
};
type Action = { type: "on-search", data: string } | { type: "next-slider" } | { type: "pre-slider" } | { type: "init-sliders", data: Array<Program> };

const CarouselAPIContext = createContext<ApiType>({} as ApiType);
const CarouselSlidersContext = createContext<State>({} as State);
const CarouselProgramContext = createContext<Program>({} as Program);

let dataStore: Array<Program> = [];

const handleSlide = (state: State, isNext: boolean) => {
    const totalSliderWidth = CAROUSEL_SLIDER_GAP + getSilderWidth();
    let pointTo: number = state.pointTo;
    let distance: number = state.distance;;
    let end: number = state.sliders.length;

    if (isNext && state.pointTo + 1 !== dataStore.length) { // next but not last
        pointTo = state.pointTo + 1;

        if (isNaN(state.distance)) {
            if (isMobile() || pointTo > 4) {
                distance = -totalSliderWidth
            }
        } else {
            if (isMobile() || pointTo > 4) {
                distance = -(Math.abs(state.distance) + totalSliderWidth);
            }
        }

        if (pointTo === state.sliders.length - 1) {
            end = end + 1;
        }
    } else if (!isNext && state.pointTo > 0) { // previous but not first
        pointTo = state.pointTo - 1;
        if (isMobile() || pointTo > 3) {
            distance = state.distance + totalSliderWidth;
        }
    }
    let result = {
        ...state,
        sliders: dataStore.slice(0, end),
        distance: distance,
        pointTo: pointTo
    };

    return result;
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "init-sliders":
            dataStore = action.data;
            return {
                ...state,
                sliders: dataStore.slice(0, CAROUSEL_SLIDES_PER_PAGE),
                distance: NaN
            };
        case "next-slider":
            return handleSlide(state, true);
        case "pre-slider":
            return handleSlide(state, false);
        case "on-search":
            return {
                ...state,
                program: dataStore.find((element: Program) => (element.id + "" === action.data))!
            }
        default:
            return state;
    }
};

export const CarouselProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {
        pointTo: 0,
        sliders: [],
        distance: NaN,
        program: {
            id: 0,
            title: "",
            description: "",
            type: "",
            image: "",
            rating: "",
            genre: "",
            year: 0,
            language: ""
        }
    });

    const api = useMemo(() => {
        const onNextSlider = () => {
            dispatch({ type: "next-slider" });
        };
        const onPreSlider = () => {
            dispatch({ type: "pre-slider" });
        };
        const onSearch = (id: string) => {
            dispatch({ type: "on-search", data: id });
        };
        return { onNextSlider, onPreSlider, onSearch };
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const res = await fetch('data.json');
            const data = await res.json();

            dispatch({ type: 'init-sliders', data });
        };

        fetchImages();
    }, []);

    return (
        <ErrorBoundary fallbackRender={Error}>
            <CarouselAPIContext.Provider value={api}>
                <CarouselSlidersContext.Provider value={state}>
                    <CarouselProgramContext.Provider value={state.program}>
                        {children}
                    </CarouselProgramContext.Provider>
                </CarouselSlidersContext.Provider>
            </CarouselAPIContext.Provider>
        </ErrorBoundary>

    );
};

export const useCarouselApi = () => useContext<ApiType>(CarouselAPIContext);
export const useCarouselSliders = () => useContext<State>(CarouselSlidersContext);
export const useProgramContext = () => useContext<Program>(CarouselProgramContext);
