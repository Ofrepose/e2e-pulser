import React, { useState } from 'react';
import Card from "components/card";
import { MdCheckCircle, MdAddCircleOutline, MdArrowBack } from "react-icons/md";
import { useMemo } from "react";
import Progress from "components/progress";
import AddApp from 'views/admin/apps/forms/AddApp';
import { useTestProvider } from 'contexts/tests/TestContext';

const ComplexTable = (props) => {
  const { columnsData, tableData, setActiveProject, setActiveProjectId } = props;

  const columns = useMemo(() => columnsData, [columnsData]);

  const [cardState, setCardState] = useState('default');
  const { clearInfo } = useTestProvider();

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <>
        {cardState === 'default' ?
          (
            <>
              <div className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">
                  Applications:
                </div>
                <MdAddCircleOutline onClick={() => setCardState('add')} className="text-blue-500 mr-4 text-2xl cursor-pointer" />
              </div>

              <div className="mt-8 overflow-x-scroll xl:overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className="border-b border-gray-200 pr-28 pb-[10px] text-start dark:!border-navy-700 pl-2"
                        >
                          <p className="text-xs tracking-wide text-gray-600">{column.Header}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (

                      <tr
                        key={rowIndex}
                        onClick={() => {
                          setActiveProject(rowIndex);
                          setActiveProjectId(row.rawData._id);
                          clearInfo();
                        }}
                        className="hover:bg-blue-200 dark:hover:bg-navy-900 focus-within:shadow-lg cursor-pointer transition duration-300 ease-in-out"
                      >
                        {columns.map((column, cellIndex) => {
                          let data = row[column.accessor];
                          if (column.Header === "UPDATES") {
                            data = (
                              <div className="flex items-center gap-2">
                                <div className={`rounded-full text-xl`}>
                                  {data === false ? (
                                    <MdCheckCircle className="text-green-500" />
                                  ) : (
                                    <p className="text-sm font-bold text-yellow-500 dark:text-yellow-500">
                                      UPDATES AVAILABLE
                                    </p>
                                  )}
                                </div>
                                <p className="text-sm font-bold text-navy-700 dark:text-white">
                                  {data}
                                </p>
                              </div>
                            );
                          } else if (column.Header === "LAST RUN STATUS") {
                            data = (
                              <div className="flex items-center gap-2">
                                <div className={`rounded-full text-xl`}>
                                  {data === "Online" ? (
                                    <p className="text-sm font-bold text-green-500 dark:text-green-500">
                                      😎 {data}
                                    </p>
                                  ) : (
                                    <p className="text-sm font-bold text-red-500 dark:text-red-500">
                                      😱 {data}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          } else if (column.Header === "PROGRESS") {
                            data = <Progress width="w-[108px]" value={data} />;
                          }
                          return (
                            <td className="pt-[14px] pb-[18px] sm:text-[14px] pl-2" key={cellIndex}>
                              {data}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </>
          ) :
          (<>
            <div className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Create Application:
              </div>
              <MdArrowBack onClick={() => setCardState('default')} className="text-blue-500 mr-4 text-2xl cursor-pointer" />

            </div>

            <AddApp />
          </>
          )}
      </>
    </Card>
  );
};

export default ComplexTable;
