import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../user/AuthContext';
import { useProject } from 'contexts/projects/ProjectContext';
import Logtastic, { log } from '@ofrepose/logtastic';
import logtastic from '@ofrepose/logtastic';

const TestContext = createContext();

const API = 'http://localhost:5005/api/test/';

export function TestProvider({ children }) {
  const { getUser } = useAuth();
  const { setProjects, projects, updateProjects } = useProject();

  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isTesting, setIsTesting] = useState([]);
  const [info, setInfo] = useState([]);

  const addTest = async (testData) => {
    // {
    //     "projectId": "64e1b36a69e7c68a7ca05360",
    //     "testType": "Can see text on page",
    //     "testName": "TestNameExample",
    //     "data": {
    //         "targetUrl": "https://leadpulser.com",
    //         "targetText": "d"
    //     }
    // }
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
        body: JSON.stringify(testData),
      });
      data = await response.json();
      setLoading(false);
      Logtastic.log(`✅ API - Add test 🐧`, { color: 'blue', style: 'dim'})

    } catch (error) {
      Logtastic.err(`❌ API - Add Test: ${error}`, {escape: false})
      setStatus(() => "Failure")
    } finally {
      await updateProjects();
      setLoading(false);
      if (data?.errors) {
        setStatus("Failure");
        Logtastic.err(`❌ API - Add Test: ${data?.errors}`, {escape: false})
      } else {
        setStatus("Success");
      }
    }
  }

  const runAll = async ({ projectId, tests }) => {
    clearInfo();
    for (const test of tests) {
      await runTest({ projectId, testName: test });
    }
    await updateProjects();
  }

  const runSingle = async (testData) => {
    clearInfo();
    await runTest(testData);
    await updateProjects();
  }

  const runTest = async (testData) => {
    // {
    //     "projectId": "64e1b36a69e7c68a7ca05360",
    //     "testName": "test shoul fail"
    // }

    setInfo((prevInfo) => {
      const newInfo = [...prevInfo, { testName: testData.testName, statuses: [`Starting test: ${testData.testName}`] }];
      setIsTesting([...isTesting, testData.testName]);
      return newInfo;
    });

    let data;

    try {
      const response = await fetch(API + 'test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(testData),
      });
      data = await response.json();
      setProjects((prev) => data?.projectData || prev);
      if (data?.current?.error) {
        setInfo((prevInfo) => {
          const updatedInfo = prevInfo.map((item) => {
            if (item.testName === testData.testName) {
              item.statuses.push(`TEST FAILED: ${data?.current?.error}`);
            }
            return item;
          });
          return updatedInfo;
        });
      } else if (data?.current?.passed) {
        setInfo((prevInfo) => {
          const updatedInfo = prevInfo.map((item) => {
            if (item.testName === testData.testName) {
              item.statuses.push(`TEST PASSED!`);
            }
            return item;
          });
          return updatedInfo;
        });
      }

    } catch (error) {
      console.error('Error adding application:', error);
      setStatus("Failure");
    } finally {
      setIsTesting((prevIsTesting) => prevIsTesting.filter((item) => item !== testData.testName));
      logtastic.log(projects)
      if (data?.errors) {
        setStatus("Failure");
      } else {
        setStatus("Success");
      }
    }
  };

  const clearInfo = () => {
    setInfo(prev => []);
  }

  return (
    <TestContext.Provider
      value={{
        addTest,
        runTest,
        clearInfo,
        runAll,
        runSingle,
        isLoading,
        status,
        isTesting,
        info,
        projects
      }}
    >
      {children}

    </TestContext.Provider>
  )
}

export function useTestProvider() {
  return useContext(TestContext);
}