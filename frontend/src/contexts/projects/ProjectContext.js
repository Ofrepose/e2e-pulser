import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../user/AuthContext';

const ProjectContext = createContext();

const API = 'http://localhost:5001/api/projects/';

export function ProjectProvider({ children }){
    const { getUser, user } = useAuth();
    const [ projects, setProjects ] = useState(user?.currentUserProjects);
    const [ isLoading, setLoading ] = useState(false);
    const [ status, setStatus ] = useState(null);
    

    // backend is appending the projects to the user and then we call getUser once addApplication is done. So this
    // is not needed. If I decide to destructure these two properties in seperate localStorage keys I can reactivate this.
    // useEffect(() => {
    //     setLoading(true);
    //     const storedProjects = localStorage.getItem('projects');
    //     if(storedProjects){
    //         setProjects(JSON.parse(storedProjects));
    //     }
    //     setLoading(false);
    // }, []);

    const addApplication = async (appData) => {
        setStatus(null);
        let data;
        try{
            setLoading(() => true);
            const response = await fetch(API + 'add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify(appData),
            });

            data = await response.json();
            setProjects(data);          
        }catch(error){
            console.error('Error adding application:', error);
            setStatus(()=> "Failure")
        }finally{
            setLoading(false);
            await getUser();
            if(data.errors){
                setStatus("Failure");
            }else{
                setStatus("Success");
            }
        }
        
    };

    return(
        <ProjectContext.Provider 
            value={{ 
                projects, 
                isLoading, 
                addApplication,
                setProjects,
                status
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    return useContext(ProjectContext);
}