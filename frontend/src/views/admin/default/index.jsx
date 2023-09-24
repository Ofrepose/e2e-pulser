import React, { useEffect, useState } from 'react';
import { columnsDataComplex, columnsDataDevelopment } from "./variables/columnsData";

import ComplexTable from "views/admin/default/components/ComplexTable";

import { useAuth } from "../../../contexts/user/AuthContext";

import DevelopmentTable from "views/admin/tables/components/DevelopmentTable";
import General from '../profile/components/General';
import TestingTable from '../tables/components/TestingTable';
import HistoryCard from '../tables/components/HistoryCard';

import useFetchUser from 'hooks/useFetchUser';
import { useSearchToggle } from 'hooks/useSearchToggle';

const Dashboard = () => {
  const { user, isLoading, getUser } = useAuth();
  const [activeProject, setActiveProject] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTestInfo, setActiveTestInfo] = useState(null);
  useFetchUser();
  const [filterText, setFilterText] = useState("");
  const [tableDataFiltered, setTableDataFiltered] = useState(user?.currentUserProjects?.[activeProject]?.updates || []);
  const [searchOpen, setSearchOpen] = useSearchToggle();

  // Filter tableData based on the filterText
  const filteredTableData = user?.currentUserProjects?.[activeProject]?.updates.filter((row) =>
    row.name.toLowerCase().includes(filterText.toLowerCase()) || row.description.toLowerCase().includes(filterText.toLowerCase())
  );

  React.useEffect(() => {
    setTableDataFiltered(filteredTableData)
  }, [filterText])

  React.useEffect(() => {
    setTableDataFiltered(filteredTableData)
  }, [activeProject])

  React.useEffect(() => {
    if (!searchOpen) {
      setFilterText("")
    }
  }, [searchOpen])


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



          {activeProject !== null && tableDataFiltered && !isLoading ? (
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

              {searchOpen && (
                <div className="fixed top left-0 w-full flex items-start justify-center z-50">
                  <div>
                    <span className='pr-2 cursor-pointer text-xl' onClick={() => setFilterText('')}>
                      🚮
                    </span>
                    <input
                      type="text"
                      placeholder="Search dependencies by name"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      id='search'
                      autoFocus={true}
                      className="border border-white/10 p-4 rounded px-2 py-2 text-2xl items-center justify-between rounded-xl bg-white/10 p-2 text-white min-w-[400px] width-full"
                    />
                    <span className='pl-2 cursor-pointer text-xl' onClick={() => setSearchOpen(false)}>
                      🙅
                    </span>
                  </div>
                </div>
              )}
              {tableDataFiltered && (
                <DevelopmentTable
                  projectName={user?.currentUserProjects[activeProject].projectName}
                  dataTitle="Dependencies"
                  columnsData={columnsDataDevelopment}
                  setActiveProject={setActiveProject}
                  raw={tableDataFiltered}
                  tableData={tableDataFiltered && tableDataFiltered?.filter(item => !item.dev).map((item) => {
                    return {
                      name: item?.name,
                      version: `${item?.version} | ${item?.updatedVersion?.slice(0, 10)}`,
                      latestVersion: item?.updatedVersion?.slice(0, 10),
                      license: item.license,
                      update: item?.updateAvailable,
                      description: item?.description,
                      docs: item?.documentation,
                      repo: item?.repoUrl,
                      logo: item?.logo
                    }
                  })}
                />
              )}


              <DevelopmentTable
                projectName={user?.currentUserProjects[activeProject].projectName}
                dataTitle="Dev Dependencies"
                columnsData={columnsDataDevelopment}
                setActiveProject={setActiveProject}
                raw={tableDataFiltered}
                tableData={tableDataFiltered && tableDataFiltered?.filter(item => item.dev).map((item) => {
                  return {
                    name: item?.name,
                    version: `${item?.version} | ${item?.updatedVersion?.slice(0, 10)}`,
                    latestVersion: item?.updatedVersion?.slice(0, 10),
                    license: item.license,
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
