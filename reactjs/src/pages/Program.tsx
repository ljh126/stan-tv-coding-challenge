import { Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarouselApi, useProgramContext } from "../carousel/providers/CarouselProvider";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../pages/Error";

export default function Program() {
    const { id } = useParams();
    const navigate = useNavigate();

    const program = useProgramContext();
    const { onSearch } = useCarouselApi();

    useEffect(() => {
        if (id) {
            onSearch(id);
        }
        const keyPressListener = (event: KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === 'Backspace') {
                navigate('/');
            }
        };

        window.addEventListener('keyup', keyPressListener);

        return () => { window.removeEventListener('keyup', keyPressListener); };
    }, [id]);

    return (
        <Suspense fallback={<ProgramSkeleton />}>
            <ErrorBoundary fallbackRender={Error}>
                <div className="program-container">
                    <div className="program">
                        <div className="program-image">
                            <img src={program.image} />
                        </div>
                        <div className="program-info">
                            <h2>{program.title}</h2>
                            <div className="program-meta">
                                {program.rating} | {program.year} | {program.genre} | {program.language}
                            </div>
                            <div className="program-description">
                                {program.description}
                            </div>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        </Suspense>
    );
}

function ProgramSkeleton() {
    return (
        <div className="program-skeleton">
            <section className="left"></section>
            <section className="right">
                <div className="first-block"></div>
                <div className="second-block"></div>
                <div className="third-block"></div>
            </section>
        </div>
    );
}