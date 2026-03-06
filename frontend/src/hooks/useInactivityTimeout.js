import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

export default function useInactivityTimeout() {
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        const logout = () => {
            localStorage.removeItem('token');
            navigate('/login');
        };

        const resetTimer = () => {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
        };

        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer(); // start timer on mount

        return () => {
            clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [navigate]);
}
