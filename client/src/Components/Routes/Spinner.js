import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Spinner = ({path="login"}) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);

        
        if (count === 0) {
            clearInterval(interval); 
            navigate(`/${path}`);
        }

        return () => clearInterval(interval);
    }, [count, navigate,path]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
            <h1 className="text-center style={{ text-color: 'grey' }}">Redirecting you to the Login Page in {count} seconds</h1>
            <div className="spinner-border m-5 text-primary" role="status"></div>
        </div>
    );
};

export default Spinner;
