import React, { useEffect, useState } from 'react';
import { columnsDataComplex, columnsDataDevelopment } from "./variables/columnsData";

import ComplexTable from "views/admin/default/components/ComplexTable";

import { useAuth } from "../../../contexts/user/AuthContext";

import DevelopmentTable from "views/admin/tables/components/DevelopmentTable";
import General from '../profile/components/General';
import TestingTable from '../tables/components/TestingTable';
import HistoryCard from '../tables/components/HistoryCard';

import useFetchUser from 'hooks/useFetchUser';

const Dashboard = () => {
  const { user, isLoading, getUser } = useAuth();
  const [activeProject, setActiveProject] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTestInfo, setActiveTestInfo] = useState(null);
  useFetchUser();

  function handleInfo(testName) {
    const active = user?.currentUserProjects[activeProject].tests;
    setActiveTestInfo(() => active.find((item) => item.name === testName));
  }

  function closeInfo() {
    setActiveTestInfo(() => null);
  }

  return (
    isLoading ? ''
      :
      <div>
        {activeTestInfo &&
          <>
            <div className="fixed inset-0 z-40 backdrop-blur-sm backdrop-opacity-70">
              {/* Backdrop with blur effect */}
            </div>
            <div className="fixed center right-0 z-50 px-4 flex items-center justify-center overflow-auto">
              <HistoryCard
                closeInfo={closeInfo}
                runs={activeTestInfo?.runs.sort((a, b) => {
                  const timeA = new Date(a.runTime).getTime();
                  const timeB = new Date(b.runTime).getTime();
                  return timeB - timeA;
                }).slice(0, 5)}
                title={`Log: ${activeTestInfo.name}`}
                highlight={`${activeTestInfo?.runs?.length ? `This test has been run ${activeTestInfo?.runs?.length} time${activeTestInfo?.runs?.length === 1 ? '' : 's'}. 
            It has passed ${activeTestInfo?.runs.reduce((acc, curr) => curr?.passed ? acc + 1 : acc, 0)} times and failed 
            ${activeTestInfo?.runs.reduce((acc, curr) => !curr?.passed ? acc + 1 : acc, 0)} times` :
                  'has not been run'}.`}
              />
            </div>
          </>
        }

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-1">


          <ComplexTable
            setActiveProject={setActiveProject}
            setActiveProjectId={setActiveProjectId}
            columnsData={columnsDataComplex}
            tableData={user?.currentUserProjects?.map((item) => {
              return {
                name: item.projectName,
                status: item?.status || 'Unknown',
                updates: item?.updates.find(item => item.updateAvailable) && true || false,
                lastRunDate: item?.updatedAt?.slice(0, 10),
                lastRunStatus: item?.status || 'Offline',
                rawData: item
              }
            }) || []}
          />



          {activeProject !== null && !isLoading ? (
            <>
              <General
                projectName={user?.currentUserProjects[activeProject].projectName}
                json={user?.currentUserProjects[activeProject].json}
              />
              <TestingTable
                projectName={user?.currentUserProjects[activeProject].projectName}
                dataTitle="Tests"
                activeProject={activeProject}
                activeProjectId={activeProjectId}
                handleInfo={handleInfo}
                columnsData={[
                  {
                    Header: "NAME",
                    accessor: "name",
                  },
                  {
                    Header: "TEST TYPE",
                    accessor: "testType",
                  },
                  {
                    Header: "CREATED AT",
                    accessor: "createdAt",
                  },
                  {
                    Header: "LAST RUN",
                    accessor: "lastRun",
                  },
                  {
                    Header: "RUN",
                    accessor: "run",
                  },
                  {
                    Header: "RUN ALL",
                    accessor: "",
                  },
                ]}
                user={user}
                setActiveProject={setActiveProject}
                currentProjectTests={user?.currentUserProjects[activeProject].tests}
                tableData={user?.currentUserProjects[activeProject].tests.map((item) => {
                  return {
                    name: item?.name,
                    testType: item?.testType,
                    createdAt: item?.createdAt?.slice(0, 10),
                    updatedAt: item?.updatedAt?.slice(0, 10),
                    lastRun: new Date(item?.runs.sort((a, b) => {
                      const timeA = new Date(a.runTime).getTime();
                      const timeB = new Date(b.runTime).getTime();
                      return timeB - timeA;
                    })[0]?.runTime).toLocaleString('en-US', { timeZoneName: 'short' }) || 'Never',

                    passed: item?.runs[0]?.passed,
                    run: true,
                    raw: item,
                  }
                })}
              />

              <DevelopmentTable
                projectName={user?.currentUserProjects[activeProject].projectName}
                dataTitle="Dependencies"
                columnsData={columnsDataDevelopment}
                setActiveProject={setActiveProject}
                raw={user?.currentUserProjects[activeProject].updates}
                tableData={user?.currentUserProjects[activeProject].updates.filter(item => !item.dev).map((item) => {
                  return {
                    name: item?.name,
                    version: item?.version,
                    latestVersion: item?.updatedVersion?.slice(0, 10),
                    update: item?.updateAvailable,
                    description: item?.description,
                    docs: item?.documentation,
                    repo: item?.repoUrl,
                    logo: item?.logo
                  }
                })}
              />

              <DevelopmentTable
                projectName={user?.currentUserProjects[activeProject].projectName}
                dataTitle="Dev Dependencies"
                columnsData={columnsDataDevelopment}
                setActiveProject={setActiveProject}
                raw={user?.currentUserProjects[activeProject].updates}
                tableData={user?.currentUserProjects[activeProject].updates.filter(item => item.dev).map((item) => {
                  return {
                    name: item?.name,
                    version: item?.version,
                    latestVersion: item?.updatedVersion?.slice(0, 10),
                    update: item?.updateAvailable,
                    description: item?.description,
                    docs: item?.documentation,
                    repo: item?.repoUrl,
                    logo: item?.logo
                  }
                })}
              />



            </>

          ) : ''
          }
        </div>
      </div>
  );
};

export default Dashboard;
