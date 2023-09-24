import { useEffect } from 'react';
import { useAuth } from 'contexts/user/AuthContext';
import logtastic from '@ofrepose/logtastic';

function useFetchUser() {
    const { getUser } = useAuth();

    useEffect(() => {
        logtastic.log('useFetchUser', { time: true, color: 'blue' })
        getUser();
    }, []);
}

export default useFetchUser;
