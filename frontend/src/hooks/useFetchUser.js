import { useEffect } from 'react';
import { useAuth } from 'contexts/user/AuthContext';

function useFetchUser() {
    const { getUser } = useAuth();

    useEffect(() => {
        getUser();
    }, []);
}

export default useFetchUser;
