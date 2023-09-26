import Card from "components/card";
import { MdCheckCircle, MdUnfoldMore, MdUnfoldLess, MdTextSnippet } from "react-icons/md";
import React, { useState } from "react";

const ForecastTable = (props) => {
  const { columnsData, tableData, raw } = props;
  const [windowOpts, setWindowOpts] = useState(true)


  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="relative flex items-center justify-between px-2">
        <div className="text-xl font-bold text-navy-700 dark:text-white w-full">
          <div className="flex wrap justify-between items-center">
            <span>{props?.dataTitle}  <span className="text-sm text-gray-600">({tableData.length})</span></span>
            <span className="text-sm italic text-gray-300">Potential conflicts if you were to update all deps to latest versions</span>
            <button className={`rounded-full text-xl`}  >
              <p className="text-2xl font-bold text-blue-500 dark:text-blue-500">
                <span onClick={() => setWindowOpts((prev) => !prev)}>{!windowOpts ? <MdUnfoldMore className="text-blue-500 mr-4" /> : <MdUnfoldLess className="text-blue-500 mr-4" />}</span>
              </p>
            </button>
            
          </div>
        </div>
      </div>

      <div className={`h-full overflow-x-scroll xl:overflow-x-hidden ${!windowOpts ? 'hidden' : ''}`}>
        <table className="mt-8 h-max w-full" variant="simple" color="gray-500" mb="24px">
          <thead>
            <tr>
              {columnsData.map((column, index) => (
                <th
                  key={index}
                  className="border-b border-gray-200 pr-32 pb-[10px] text-start dark:!border-navy-700 "
                >
                  <div className="text-xs font-bold tracking-wide text-gray-600">
                    {column.Header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {columnsData.map((column, columnIndex) => {
                  let data = (
                    <p className={`text-sm font-bold text-navy-700 dark:text-white bg-black ${row?.latestVersion?.split('.')[0] !== row?.version?.split('.')[0] ? 'text-red-500 dark:text-red-500' : row.update ? 'text-yellow-500 dark:text-yellow-500' : 'text-green-700'} 
                   
                    `}>
                      {row[column.accessor]}
                    </p>
                  );
                  if (column.Header === "UPDATE") {
                    data = (
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {row[column.accessor] ? (
                            <button>Update</button>
                          ) : (
                            <MdCheckCircle className="text-green-500" />
                          )}
                        </p>
                      </div>
                    );
                  } else if (column.Header === "DESCRIPTION") {
                    data = (
                      <p className={`text-sm font-base text-navy-700 dark:text-white bg-black pr-10`} >
                        {row[column.accessor]?.startsWith('<') ? '' : row[column.accessor]}
                      </p>
                    );
                  }
                  else if (column.Header === "DOCS") {
                    data = (
                      row[column.accessor] ? (
                        <span className="flex">
                          <a className={`text-sm font-bold text-navy-700 dark:text-white bg-black text-center pl-2`} href={row[column.accessor]} target="_blank"
                            rel="noopener noreferrer" >
                            {/* 📖 */}
                            <MdTextSnippet className="text-white-500 text-lg" />
                          </a>
                          <p className="text-base font-medium text-navy-700 dark:text-white flex items-center">
                            <img
                              src={row.logo}
                              onClick={() => window.open(`https://docs.digitalocean.com/`, '_blank')}
                              className="h-auto w-auto max-h-[13px] m-1 rounded-lg cursor-pointer" />
                          </p>
                        </span>
                      ) : ''

                    );
                  }
                  return (
                    <td
                      key={columnIndex}
                      className="pt-[14px] pb-3 text-[14px]"
                    >
                      {data}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ForecastTable;
