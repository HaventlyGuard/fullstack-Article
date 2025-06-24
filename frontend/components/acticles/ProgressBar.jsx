import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';


const ProgressBar = ({...props}) => {
    const{
        duration,
        procent,
        onFinish,
    } = props;
    const [DURATION, setDURATION] = useState(duration);
    const [procents, setProcents] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (elapsed >= duration) return;

        const interval = setInterval(() => {
            setElapsed(prev => {
                const next = prev + 0.1;
                return next >= duration ? duration : next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [elapsed, duration]);

    useEffect(() => {
        if (procents >= procent) {
            if (onFinish) onFinish();
            return;
        }

        const interval = setInterval(() => {
            setProcents(prev => {
                const next = prev + 1;
                return next >= procent ? procent : next;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [procents, procent, onFinish]);

    // const timeLeft = Math.ceil(DURATION - elapsed);
    // let timeLeftStr = '';
    // if (timeLeft > 86400) {
    //     const days = Math.ceil(timeLeft / 86400);
    //     timeLeftStr = `${days} ${days === 1 ? 'day' : 'days'} remaining`;
    // } else if (timeLeft > 3600) {
    //     const hours = Math.ceil(timeLeft / 3600);
    //     timeLeftStr = `${hours} ${hours === 1 ? 'hour' : 'hours'} remaining`;
    // } else if (timeLeft > 60) {
    //     const minutes = Math.ceil(timeLeft / 60);
    //     timeLeftStr = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} remaining`;
    // } else {
    //     timeLeftStr = `${timeLeft} seconds remaining`;
    // }
    //
    const progressColor = procents < 100 ? 'rgb(31,41,55)' : 'rgb(55,65,81)';

    return (
        <div style={{ width: '100%' }}>
            <Progress
                percent={procents}
                showInfo={false}
                strokeColor={progressColor}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontWeight: 'bold' }}>Progress: {procents}%</span>
            </div>
        </div>
    );
};

export default ProgressBar;