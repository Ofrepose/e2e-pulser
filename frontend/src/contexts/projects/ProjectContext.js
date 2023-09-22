import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../user/AuthContext';

const ProjectContext = createContext();

const API = 'http://localhost:5001/api/projects/';

export function ProjectProvider({ children }) {
    const { getUser, user } = useAuth();
    const [projects, setProjects] = useState(user?.currentUserProjects);
    const [isLoading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const updateProjects = async () => {
        const currentProjects = await getUser()?.currentUserProjects;
        setProjects(currentProjects);
    }


    const addApplication = async (appData) => {
        setStatus(null);
        let data;
        try {
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
        } catch (error) {
            console.error('Error adding application:', error);
            setStatus(() => "Failure")
        } finally {
            await getUser();
            setLoading(false);
            if (data?.errors) {
                setStatus("Failure");
            } else {
                setStatus("Success");
            }
        }

    };

    return (
        <ProjectContext.Provider
            value={{
                projects,
                isLoading,
                addApplication,
                setProjects,
                status,
                updateProjects
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    return useContext(ProjectContext);
}