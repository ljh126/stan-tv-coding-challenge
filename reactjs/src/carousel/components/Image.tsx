import { setSilderWidth } from "../Constants";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef } from 'react';

const useCallbackNoDeps = (cb: (event: KeyboardEvent) => void) => {
    const ref = useRef<(event: KeyboardEvent) => void>();
  
    useEffect(() => {
      ref.current = cb;
    });
  
    return useCallback((event: KeyboardEvent) => {
      ref.current?.(event);
    }, []);
};

export default function Image({ image, id, active }: { image: string, id: number, active: boolean }) {
    const navigate = useNavigate();
    const ref = useRef<HTMLAnchorElement>(null);
    
    const onKeyUp = useCallbackNoDeps((event: KeyboardEvent) => {
        if (ref.current?.classList.contains("active") && event.key === 'Enter') {
            navigate(`/program/${id}`);
        }
        if (event.key === 'Backspace') {
            navigate('/');
        }
    });

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);
        return () => { 
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return (
        <Link ref={ref} to={`/program/${id}`} className={`slider-wrapper ${active ? 'active' : ''}`}>
            <img className='slider' src={image} onLoad={() => {
                if (ref.current) {
                    setSilderWidth(Math.ceil(ref.current?.getBoundingClientRect().width));
                }
            }} />
        </Link>
    )
}